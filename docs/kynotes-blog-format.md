# KyNotes blog 写作规范

写在 `/about`（KyNotes）里的长文，以《Software Isn't Dead》为样板。以后每一篇 blog 都按这份规范写。
适用范围：`app/kynotes/kaynote-app.tsx` 里 `blog` 分组（以及 `design` 分组里的 essay 型笔记）。

---

## 0. 一句话原则

**观点是 Kayna 的，论证是一起做的，数据和案例是必须的，标题要让人想点。**

- 文章的核心观点来自 Kayna 最初给的那句话，不能被替换、不能被稀释。Claude 负责展开、找证据、补案例、纠错。
- 纠错可以，但"这是我的历史，不是她的"这种个人经历式的补充不要加（例：2016 语音助手失败那段被删掉，因为那是 Claude 的记忆不是她的）。
- 每篇文章必须能用一句话说出立场。说不出来就还不能发。

现有的观点（都是 Kayna 的原话或原意，写新文章时不要跟这些打架）：

| 文章 | 核心观点 |
| --- | --- |
| Software Isn't Dead | 软件没死，底层技术变了，软件和新技术结合后变成新东西。新事物 = 已有零件的拼贴（collage formula），在某个零件刚成熟的那一刻拼出来。 |
| Founder Theory | 智商决定类别，商业脑子都是一样的。 |
| Time Machine | TikTok 和小红书是孙正义 time machine 理论的重演。 |
| The Garage and the Plan | 读 CSIS 的 China 2035 报告：中美追同样的技术，机制相反。美国是自下而上的实践，中国是自上而下的执行。（Kayna 删掉了"互相借用"和"对 builder 的意义"两节，文章只做对照，不做综合。） |
| Designer Founders | 设计背景对创始人到底有什么用、短板在哪。（draft，观点待她定） |

---

## 1. 文章在代码里长什么样

一篇 blog 是 `SECTIONS` 里的一个 `Note` 对象，放在 `label: "blog"` 分组（curated 类内容放 `lifestyle`，不放这里）。

```tsx
{
  id: "founder-theory",                 // kebab-case，一旦发布不要改（NoteJump 靠它跳转）
  title: "Founder Theory",              // Title Case，见 §3
  snippet: "IQ decides the category, the business brain is the same", // 一句话论点
  date: "September 2, 2026 at 11:52 AM",
  essay: true,                          // 长文：680px 窄栏 + 右侧草稿边栏
  searchText: "founder theory IQ ... 智商决定类别",  // 中英文关键词都放，搜索用
  body: (
    <Essay>
      <p style={{ marginTop: 0 }}>…</p>
      …
    </Essay>
  ),
}
```

- `essay: true` 必须加，否则正文是 840px 宽、没有边栏图。
- 正文包在 `<Essay>` 里，它负责在宽屏把边栏图推开、不重叠。
- 草稿状态的文章结尾加一行 `draft, more to come.`，发布时删掉。
- 还没写好、不想让人点开的笔记，用 `building: true`（点击弹 iOS 提示"still building"），snippet 写 `Still building`。

---

## 2. 字体与排版（数值来自现有 CSS，不要另起一套）

KyNotes 是 Apple Notes 复刻，是全站设计系统的例外：用 SF 系统字体栈，14px 字号体系，**站点的 16px 最小字号规则在这里不适用**。

| 元素 | 字体 | 字号 / 行高 | 颜色 | 备注 |
| --- | --- | --- | --- | --- |
| 笔记标题 `.kn-title` | SF Pro | 20px / bold | `#1d1d1f` | Title Case（每个实词首字母大写） |
| 日期 `.kn-date` | SF Pro | 12px | `#8e8e93` | |
| 正文 `p` / `li` | SF Pro | 14px / 20px | `#1d1d1f` | 段距 12px |
| 小节标题 `p.kn-subhead` | SF Pro | 14px / 700 | `#1d1d1f` | 上边距 32px，**不用 h2/h3** |
| 列表 `ul` | | 缩进 24px，disc | | 用于"X = A + B"式案例列表 |
| 波浪下划线 `.kn-mark` | | `underline wavy rgba(0,0,0,.45)`，offset 3px | | 被注释的短语 |
| 脚注上标 `sup.kn-ref` | SF Pro | 10px / 600 | `#8e8e93` | 跟在 `.kn-mark` 后 |
| 边栏图说明 `.kn-fig-cap` | IntrudingCat（手写体） | 15px / 18px | `#8e8e93` | 全小写，像手写便签 |
| 边栏数据 `.kn-fig-stat` | IntrudingCat | 30px / 32px | `#1d1d1f` | 只放一个数字或 `A → B` |
| 数据来源 `.kn-fig-src` | IntrudingCat | 13px | `rgba(0,0,0,.3)` | 机构名，不写 URL |
| 编号圆圈 `.kn-fig-n` | SF Pro | 15px，20×20 圆 | `#1d1d1f` | 照片图贴左上角，数据图在顶部 |
| 链接 | | | `#b8860b`（金色） | 站内跳转用 `<NoteJump noteId="…">` |
| 表格 `.kn-table-wrap > table.kn-table` | SF Pro | 14px / 20px（手机 13/18） | `#1d1d1f` | 1px `rgba(0,0,0,.14)` 网格，表头 700 + 浅灰底，首列 `th` 600；用于维度对照（Time Machine） |

排版规则：

- 正文栏宽 680px（`.kn-body--essay`）。
- 正文里**不用加粗、不用 h 标签、不用引用块、不用代码块**。层级只靠 `kn-subhead` 和段落。
- 对照类内容（传统 vs 现代、A 国 vs B 国）用 `kn-table`：第一列是维度名，后面每列一个对象，一格一句话。表格外必须包 `.kn-table-wrap`（手机横向滚动兜底）。
- 一段 3 到 6 句。一句一个意思。
- **笔记标题用 Title Case**（Sep 2 2026 起，Kayna 的要求）：每个实词首字母大写，介词和冠词小写（"Software Isn't Dead"、"Restaurants in NYC"、"The Garage and the Plan"）。
- snippet、小节标题、段落开头、列表开头保持 sentence case（Kayna 明确否掉过全小写）。只有手写体的图注是小写。
- 手机端（<768px）边栏图变成段落下方居中显示；宽屏（≥1400px）贴到右侧空白处。

---

## 3. 标题、snippet、开头、结尾

**标题要吸睛，但要是一个判断，不是一个话题。**

| 不要 | 要 |
| --- | --- |
| Thoughts on interaction | Software Isn't Dead |
| About founders | Founder Theory |
| Notes on TikTok and Rednote | Time Machine |
| My thoughts on China 2035 | The Garage and the Plan |

- 2 到 5 个词。能引起"真的吗？"的反应最好。
- 反常识、有立场的短句 > 描述性的长句。两个具体名词的对照也行（"The Garage and the Plan"）。
- Title Case，不要全大写或感叹号。

**snippet** = 侧栏第二行，13px 灰字。写文章的一句话论点，或者最抓人的一个副题。例："IQ decides the category, the business brain is the same"。

**开头段**（`<p style={{ marginTop: 0 }}>`）：三句话之内把观点说完，用 Kayna 自己的话。不做铺垫，不写"In this article I will…"。

**结尾段**：回到立场，说清楚"所以我信什么、我要怎么做"。允许一句短促的祈使句收尾（"Build boldly."）。不要总结全文，不要"thanks for reading"。不要 cliché 的 CTA。

---

## 4. 注释系统（Mark + Fig）

这是这套 blog 最有辨识度的部分：正文里的短语加波浪线和脚注号，右侧空白处"贴"一张照片或一条手写数据，编号对应。**没有箭头**（试过，被否了：太丑）。

### 4.1 用法

```tsx
<li className="kn-anno">
  The electric car = the car we already had + a battery that got{" "}
  <Mark n={3}>cheap enough</Mark>, roughly 90% cheaper per kWh than in 2010.
  <Fig
    n={3}
    stat="$1,400 → $115"
    caption="a battery pack per kWh, 2010 → 2024"
    source="BloombergNEF"
    dx={40} dy={60} tilt={2} w={210}
  />
</li>
```

- `Fig` 必须放在它所注释的那个 `<p>` 或 `<li>` 里面，并且该元素加 `className="kn-anno"`。
- `Mark n` 和 `Fig n` 的编号一致，全文从 1 开始顺序编号。
- 没有 `n` 的 `<Mark>` 只是波浪线，用来标一句值得记住的话，不配图。

### 4.2 `Fig` 参数

| 参数 | 含义 | 常用值 |
| --- | --- | --- |
| `n` | 脚注号 | 与 Mark 一致 |
| `src` / `alt` / `width` / `height` | 照片，`/kaynote/essay/*.webp` | 真实产品图，webp |
| `w` | 边栏里渲染宽度 | 照片 100–150，数据 200–220 |
| `dx` | 距正文右边缘的水平偏移 | 40–300，故意错开 |
| `dy` | 相对所在段落顶部的垂直偏移 | -40 到 60 |
| `tilt` | 旋转角度 | ±2 到 ±4，正负交替 |
| `stat` | 手写大数字 | `"30 → 9 → 2"`、`"$2B ARR"` |
| `caption` | 手写说明，小写 | 一行到两行 |
| `source` | 数据来源机构 | `"UBS"`、`"BloombergNEF"` |

### 4.3 规则

- **不要对齐。** dx、dy、tilt 每张都不一样，看起来像随手贴的（Kayna："何必如此整齐"）。
- **照片要真。** 官方站、Wikimedia 的产品照，裁成 webp 放 `public/kaynote/essay/`。不要生成图，不要示意图。
- **一张图只说一件事。** 数据图 = 一个数字 + 一行说明 + 来源；照片图 = 图 + 一行说明。
- **图上的数据必须直接支撑它旁边那句话。** 反例：`30 → 9 → 2`（Instagram / TikTok / ChatGPT 到 1 亿用户的月数）挂在 "mobile era" 的 "a thumb" 上，caption 说 "each surface is faster"，但三个产品不对应三个时代（前两个都是手机，ChatGPT 是浏览器文本框），论证就断了。写图注前先问：这个数字证明的是这句话吗？
- 每 4 到 6 段至少一张图，一篇长文 5 到 9 张。

---

## 5. 内容硬要求

### 5.1 数据

- **每个小节至少一个数字**，带年份和来源。数字可以在正文里，也可以在边栏手写，最好两处都有一次（正文说完整版，边栏只留最抓眼的那个）。
- 来源必须是能点名的公开机构或公司自己的公告：UBS、BloombergNEF、Sensor Tower、公司官方 blog、YC 页面。不用"据报道"。
- 数字要具体：`$499 on January 9, 2007` 好于 `around $500 in 2007`。
- **不用绝对词**："the fastest consumer product ever" 这种句子会过期（Threads 五天一亿注册）。写 `at the time`，或者写清口径（monthly users）。
- 同一个数字在正文和边栏都出现时，全文最多出现两次，不要在三个地方重复。
- 关于公司的公开数字可以写（估值、ARR、用户数）；**关于 Kayna 自己在公司内部影响的指标不写**（雇主会看这个网站）。

### 5.2 案例

- 用真实的、有名字的产品，写清它是什么时候、多少钱、什么零件凑成的。
- Collage 型论证用固定句式：**X = A + B**，然后一句解释哪个零件刚成熟。例：`iPhone = a capacitive touchscreen that got good enough + a shrunken macOS.`
- 一个论点至少 3 个案例，跨不同行业更好（软件 + 硬件 + 消费品）。
- 时间线型论证要给每个阶段年份和代表产品，并且每个阶段的例子要真的属于那个阶段。
- 反例和"太早了"的案例同样有价值（Newton 1993、Glass 2013）。

### 5.3 观点与语气

- 第一人称，warm，像在跟朋友说话。不写简历腔、不写"太典"的话。
- 有立场就直接说："What I firmly believe: …"。不确定就承认："I don't have the answer."
- 短句为主，主动语态。逗号连接的口语式并列可以（"the browser, the page, the link, the search box"）。
- 不用 emoji（笔记标题里的 emoji 只用于 lifestyle 类，blog 不用）。
- 中文原话翻成英文时保留她的判断力度，不要把"一定"软化成"maybe"。反过来，Claude 想补的判断要标记为建议，由她定。
- **对照型文章不强行综合。** Garage and the Plan 里 Claude 加的"两边互相借用"和"对 builder 的意义"两节被她删了（"honestly 确实不需要"）。对照说清楚就收，不要替她下结论。

---

## 6. 一篇文章的骨架

```
title        一个判断，2–5 词
snippet      一句话论点
─────────────────────────────
开头段       观点，三句内，她的话
小节 1       定义 / 公式（列表：X = A + B，每条一个案例，2–3 条带 Fig）
小节 2       时间线或机制（每阶段：年份 + 代表产品 + 它建立在什么之上）
小节 3       现在正在发生的（3–6 条，每条带一个具体产品和一个数字）
小节 4       "所以呢"：立场、不确定的地方、要怎么做
结尾         一句祈使句
```

小节标题用 `kn-subhead`，句式统一：陈述句或名词短语（"How the surface has moved"、"Where designers go from here"）。

---

## 7. 发布前检查

- [ ] 一句话能说出这篇的观点，而且是 Kayna 最初给的那个观点
- [ ] 标题是判断不是话题，Title Case
- [ ] snippet 是论点
- [ ] 开头三句内亮观点，结尾有立场
- [ ] 每个小节至少一个带来源和年份的数字
- [ ] 每个论点至少三个有名字的案例
- [ ] 每张 Fig 的数据直接支撑它旁边那句话；编号顺序对得上
- [ ] 没有绝对词（ever / first / only）或已写明口径
- [ ] 没有 Kayna 自己的公司内部指标
- [ ] 没有加粗、h 标签、引用块、emoji
- [ ] 桌面（≥1400）边栏图不重叠；手机（390）图居中、无横向滚动
- [ ] 草稿结尾有 `draft, more to come.`，正式发布时删掉
