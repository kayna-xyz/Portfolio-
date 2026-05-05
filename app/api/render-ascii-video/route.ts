import { NextRequest } from 'next/server'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const params = await request.json()

  const cwd        = process.cwd()
  const configPath = path.join(cwd, 'public', 'output', 'render-config.json')
  const outputPath = path.join(cwd, 'public', 'output', 'ascii-video-custom.mp4')
  const scriptPath = path.join(cwd, 'scripts', 'generate-ascii-video-v2.py')
  const inputPath  = path.join(cwd, 'public', 'input', 'original.mp4')

  const config = { ...params, inputPath, outputPath }
  fs.mkdirSync(path.dirname(configPath), { recursive: true })
  fs.writeFileSync(configPath, JSON.stringify(config))

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const enq = (data: object) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch { /* client disconnected */ }
      }

      const proc = spawn('python3', [scriptPath, '--config', configPath], { cwd })

      let buf = ''
      proc.stdout.on('data', (chunk: Buffer) => {
        buf += chunk.toString()
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''
        for (const line of lines) {
          if (line.startsWith('PROGRESS:')) {
            const pct = parseFloat(line.slice(9))
            if (!isNaN(pct)) enq({ type: 'progress', percent: pct })
          } else if (line.startsWith('DONE:')) {
            enq({ type: 'progress', percent: 100 })
            enq({ type: 'done', outputPath: '/output/ascii-video-custom.mp4' })
          } else if (line.startsWith('ERROR:')) {
            enq({ type: 'error', message: line.slice(6) })
          } else if (line.startsWith('Grid:')) {
            enq({ type: 'info', message: line })
          }
        }
      })

      proc.stderr.on('data', (chunk: Buffer) => {
        const text = chunk.toString().trim()
        if (text && !text.includes('Warning') && !text.includes('NotOpen')) {
          console.error('[ascii-render]', text.slice(0, 200))
        }
      })

      proc.on('close', (code) => {
        if (code !== 0) {
          enq({ type: 'error', message: `Process exited with code ${code}` })
        }
        controller.close()
      })

      proc.on('error', (err) => {
        enq({ type: 'error', message: err.message })
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
