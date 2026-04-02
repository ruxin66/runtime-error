import { storyBackgrounds } from "../catalog/backgrounds";
import { storyCharacters } from "../catalog/characters";
import { choice, defineChapter, ending, line } from "../chapterTools";

export const prologueChapter = defineChapter({
  id: "prologue",
  title: "Runtime Error",
  subtitle: "序章：十三区的叉烧饭",
  startId: "alley-awakening",
  initialState: {
    flags: {
      ariesAffinity: 0,
      geminiAffinity: 0,
      replyStyle: "unknown",
    },
  },
  characters: {
    protagonist: storyCharacters.protagonist,
    riderLeader: storyCharacters.riderLeader,
    canteenBoss: storyCharacters.canteenBoss,
    aries: storyCharacters.aries,
    gemini: storyCharacters.gemini,
  },
  backgrounds: {
    alley: storyBackgrounds.alley,
    kitchen: storyBackgrounds.kitchen,
    storefront: storyBackgrounds.storefront,
    table: storyBackgrounds.table,
  },
  nodes: {
    "alley-awakening": line(
      "alley-awakening",
      "alley",
      [
        "主角刚睁开眼，就看见一串摩托轮胎从头顶擦过去。",
        "尖叫还没来得及冲出喉咙，就被引擎声彻底碾碎。",
      ],
      "alley-circling",
    ),
    "alley-circling": line(
      "alley-circling",
      "alley",
      [
        "绕到第七圈的时候，他们终于发现角落里缩着个人。",
        "领头的那位单手把主角拎起来，像拎一只误入巢穴的小鸡仔。",
      ],
      "alley-questions",
      "riderLeader",
    ),
    "alley-questions": line(
      "alley-questions",
      "alley",
      [
        "有人猜主角是被仇家扔来的，有人说像是反叛军出门就被抓，还有人一本正经怀疑是和高阶级恋人私奔失败。",
        "主角说：别猜了，我是穿越来的。",
      ],
      "alley-dismissed",
      "riderLeader",
    ),
    "alley-dismissed": line(
      "alley-dismissed",
      "alley",
      [
        "飞车党沉默了两秒，随后一致判定：来了个设定错误的人工智障。",
        "为了防止主角下一秒在十三区被拆掉器官，他们把人卖进了街角餐馆。",
      ],
      "kitchen-disguise",
      "riderLeader",
    ),
    "kitchen-disguise": line(
      "kitchen-disguise",
      "kitchen",
      [
        "老板把主角按在镜子前，飞快给 ta 套上红色围裙和圆帽。",
        "等主角回过神，镜子里已经站着一个像中华小厨娘一样的服务员。",
      ],
      "storefront-observe",
      "canteenBoss",
    ),
    "storefront-observe": line(
      "storefront-observe",
      "storefront",
      [
        "主角端着叉烧饭靠在门边，觉得这一切都荒谬得像某个劣质全息剧。",
        "就在这时，两个戴着墨镜和金色假发的客人推门走了进来。",
      ],
      "table-suspicion",
      "protagonist",
    ),
    "table-suspicion": line(
      "table-suspicion",
      "table",
      [
        "他们点了餐，却一口没动，只是安静地坐着看过来。",
        "主角心想：这地方还有黑手党吗？",
      ],
      "table-approach",
      "protagonist",
    ),
    "table-approach": line(
      "table-approach",
      "table",
      [
        "Aries 直接把支付码拍在桌面上：想要多少自己扫，然后跟我走一趟。",
        "一旁的 Gemini 仍旧撑着下巴，像是在观察某个刚刚被系统发现的异常值。",
      ],
      "first-choice",
      "aries",
    ),
    "first-choice": choice(
      "first-choice",
      "table",
      "主角捏着托盘，决定先回一句什么。",
      [
        {
          id: "refuse",
          text: "我只是一个卖叉烧饭的，不卖。",
          nextId: "choice-refuse",
          effects: [
            { key: "replyStyle", type: "set", value: "defiant" },
            { key: "ariesAffinity", type: "increment", value: 1 },
          ],
        },
        {
          id: "cash-only",
          text: "这里没有网络，所以请给我现金。",
          nextId: "choice-cash",
          effects: [
            { key: "replyStyle", type: "set", value: "wry" },
            { key: "geminiAffinity", type: "increment", value: 1 },
          ],
        },
      ],
      "protagonist",
    ),
    "choice-refuse": line(
      "choice-refuse",
      "table",
      [
        "Gemini 先笑出了声，说这孩子嘴比叉烧还硬。",
        "Aries 盯着主角那双黑眼睛，像是终于确认了什么。",
      ],
      "choice-merge",
      "gemini",
    ),
    "choice-cash": line(
      "choice-cash",
      "table",
      [
        "Gemini 摘下一点墨镜边框，露出一线雪白的眼睫，笑得相当真心。",
        "Aries 倒是没笑，只把手指在桌面上轻轻敲了两下。",
      ],
      "choice-merge",
      "gemini",
    ),
    "choice-merge": line(
      "choice-merge",
      "table",
      [
        "Aries 站起身，低声说：你不该出现在这里。",
        "Gemini 接上后半句：所以现在，你最好跟我们谈谈。",
      ],
      {
        fallbackId: "assessment-neutral",
        branches: [
          {
            nextId: "assessment-defiant",
            conditions: [{ key: "replyStyle", operator: "equals", value: "defiant" }],
          },
          {
            nextId: "assessment-wry",
            conditions: [{ key: "replyStyle", operator: "equals", value: "wry" }],
          },
        ],
      },
      "aries",
    ),
    "assessment-defiant": line(
      "assessment-defiant",
      "table",
      [
        "Aries 像是被这份顶嘴取悦了，眼神里终于露出一点近似欣赏的东西。",
        "Gemini 则偏过头，笑着评价主角像一把刚拆封的黑色小刀。",
      ],
      "prologue-end",
      "gemini",
    ),
    "assessment-wry": line(
      "assessment-wry",
      "table",
      [
        "Gemini 用指节轻轻敲了敲杯沿，说这孩子的脑子转得比十三区大多数人快。",
        "Aries 没反驳，只是把那张支付码重新推近了一寸。",
      ],
      "prologue-end",
      "gemini",
    ),
    "assessment-neutral": line(
      "assessment-neutral",
      "table",
      [
        "两人短暂交换了一个眼神，像是在用某种主角无法理解的方式完成判断。",
        "下一秒，餐馆门口的夜风灌进来，吹得主角后颈发凉。",
      ],
      "prologue-end",
      "protagonist",
    ),
    "prologue-end": ending(
      "prologue-end",
      "table",
      [
        "门外十三区的霓虹晃进来，把两人的影子拉得很长。",
        "序章到这里结束。现在这套引擎已经能根据你的选择记录状态，并在后续节点里做条件跳转。",
      ],
      "返回标题",
    ),
  },
});
