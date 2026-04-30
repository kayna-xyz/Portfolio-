"use client"

const blogEntries = [
  {
    date: "01/11/23",
    title: "Co-hosted the largest hackathon in China",
    link: "https://adventure-x.org/en",
  },
  {
    date: "15/02/26",
    title: "My reading list",
    link: "https://www.notion.so/Reading-List-308dd3c14a8e808dbff4db060e76c2ea",
  },
  {
    date: "19/01/26",
    title: "In the post-AI era, design is no longer what it used to be.",
    link: "https://work.kayna.ai/blog1",
  },
]

export default function BlogSection() {
  return (
    <section id="blog" className="w-full bg-[#FDFBFA] pt-16 md:pt-24 pb-32 md:pb-48" style={{ paddingLeft: "70px", paddingRight: "70px" }}>
      <div className="mx-auto" style={{ maxWidth: "680px" }}>
        {/* Section title - left aligned */}
        <h2 className="text-xs sm:text-sm font-mono tracking-[0.15em] text-[#474747] mb-12 uppercase">
          Side Projects & Writings
        </h2>
        
        {/* Blog entries */}
        <div className="space-y-8">
          {blogEntries.map((entry, i) => {
            const content = (
              <div className="flex gap-8 md:gap-16 items-baseline">
                <span className="font-mono text-[13px] text-[#b0aeab] tracking-wide shrink-0 w-20">
                  {entry.date}
                </span>
                <h3 className="text-[15px] md:text-[16px] text-[#474747] flex-1 hover:text-[#21A5D5] transition-colors">
                  {entry.title}
                </h3>
              </div>
            )
            
            if ('link' in entry) {
              return (
                <a 
                  key={i}
                  href={entry.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block no-underline"
                >
                  {content}
                </a>
              )
            }
            
            return <div key={i}>{content}</div>
          })}
        </div>
      </div>
    </section>
  )
}
