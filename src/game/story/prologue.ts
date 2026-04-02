import type { StoryChapter } from "../types";

export const prologueChapter: StoryChapter = {
  id: "prologue",
  title: "Runtime Error",
  subtitle: "序章：十三区的叉烧饭",
  startId: "alley-awakening",
  characters: {
    protagonist: {
      id: "protagonist",
      name: "主角",
      title: "错误样本",
      accentColor: "#f4efe8",
    },
    riderLeader: {
      id: "riderLeader",
      name: "飞车党",
      title: "巷道暴走族",
      accentColor: "#ff8f70",
    },
    canteenBoss: {
      id: "canteenBoss",
      name: "餐馆老板",
      title: "十三区中餐馆",
      accentColor: "#ffd36a",
    },
    aries: {
      id: "aries",
      name: "Aries",
      title: "白发统治者之一",
      accentColor: "#ffcf8d",
    },
    gemini: {
      id: "gemini",
      name: "Gemini",
      title: "白发统治者之一",
      accentColor: "#9dd4ff",
    },
  },
  backgrounds: {
    alley: {
      id: "alley",
      label: "十三区狭巷",
      description: "飞车轰鸣在头顶盘旋，巷口霓虹像碎裂的玻璃。",
    },
    kitchen: {
      id: "kitchen",
      label: "后厨更衣间",
      description: "蒸汽和酱香混在一起，廉价灯泡照得瓷砖发黄。",
    },
    storefront: {
      id: "storefront",
      label: "餐馆门前",
      description: "澄澄夜色下，叉烧的甜香和机油味一起飘过来。",
    },
    table: {
      id: "table",
      label: "靠窗餐桌",
      description: "两个戴墨镜的金发客人坐得笔直，像故意学不会饿。",
    },
  },
  nodes: {
    "alley-awakening": {
      id: "alley-awakening",
      kind: "line",
      backgroundId: "alley",
      text: [
        "主角刚睁开眼，就看见一串摩托轮胎从头顶擦过去。",
        "尖叫还没来得及冲出喉咙，就被引擎声彻底碾碎。",
      ],
      nextId: "alley-circling",
    },
    "alley-circling": {
      id: "alley-circling",
      kind: "line",
      backgroundId: "alley",
      speakerId: "riderLeader",
      text: [
        "绕到第七圈的时候，他们终于发现角落里缩着个人。",
        "领头的那位单手把主角拎起来，像拎一只误入巢穴的小鸡仔。",
      ],
      nextId: "alley-questions",
    },
    "alley-questions": {
      id: "alley-questions",
      kind: "line",
      backgroundId: "alley",
      speakerId: "riderLeader",
      text: [
        "有人猜主角是被仇家扔来的，有人说像是反叛军出门就被抓，还有人一本正经怀疑是和高阶级恋人私奔失败。",
        "主角说：别猜了，我是穿越来的。",
      ],
      nextId: "alley-dismissed",
    },
    "alley-dismissed": {
      id: "alley-dismissed",
      kind: "line",
      backgroundId: "alley",
      speakerId: "riderLeader",
      text: [
        "飞车党沉默了两秒，随后一致判定：来了个设定错误的人工智障。",
        "为了防止主角下一秒在十三区被拆掉器官，他们把人卖进了街角餐馆。",
      ],
      nextId: "kitchen-disguise",
    },
    "kitchen-disguise": {
      id: "kitchen-disguise",
      kind: "line",
      backgroundId: "kitchen",
      speakerId: "canteenBoss",
      text: [
        "老板把主角按在镜子前，飞快给 ta 套上红色围裙和圆帽。",
        "等主角回过神，镜子里已经站着一个像中华小厨娘一样的服务员。",
      ],
      nextId: "storefront-observe",
    },
    "storefront-observe": {
      id: "storefront-observe",
      kind: "line",
      backgroundId: "storefront",
      speakerId: "protagonist",
      text: [
        "主角端着叉烧饭靠在门边，觉得这一切都荒谬得像某个劣质全息剧。",
        "就在这时，两个戴着墨镜和金色假发的客人推门走了进来。",
      ],
      nextId: "table-suspicion",
    },
    "table-suspicion": {
      id: "table-suspicion",
      kind: "line",
      backgroundId: "table",
      speakerId: "protagonist",
      text: [
        "他们点了餐，却一口没动，只是安静地坐着看过来。",
        "主角心想：这地方还有黑手党吗？",
      ],
      nextId: "table-approach",
    },
    "table-approach": {
      id: "table-approach",
      kind: "line",
      backgroundId: "table",
      speakerId: "aries",
      text: [
        "Aries 直接把支付码拍在桌面上：想要多少自己扫，然后跟我走一趟。",
        "一旁的 Gemini 仍旧撑着下巴，像是在观察某个刚刚被系统发现的异常值。",
      ],
      nextId: "first-choice",
    },
    "first-choice": {
      id: "first-choice",
      kind: "choice",
      backgroundId: "table",
      speakerId: "protagonist",
      text: "主角捏着托盘，决定先回一句什么。",
      choices: [
        {
          id: "refuse",
          text: "我只是一个卖叉烧饭的，不卖。",
          nextId: "choice-refuse",
        },
        {
          id: "cash-only",
          text: "这里没有网络，所以请给我现金。",
          nextId: "choice-cash",
        },
      ],
    },
    "choice-refuse": {
      id: "choice-refuse",
      kind: "line",
      backgroundId: "table",
      speakerId: "gemini",
      text: [
        "Gemini 先笑出了声，说这孩子嘴比叉烧还硬。",
        "Aries 盯着主角那双黑眼睛，像是终于确认了什么。",
      ],
      nextId: "choice-merge",
    },
    "choice-cash": {
      id: "choice-cash",
      kind: "line",
      backgroundId: "table",
      speakerId: "gemini",
      text: [
        "Gemini 摘下一点墨镜边框，露出一线雪白的眼睫，笑得相当真心。",
        "Aries 倒是没笑，只把手指在桌面上轻轻敲了两下。",
      ],
      nextId: "choice-merge",
    },
    "choice-merge": {
      id: "choice-merge",
      kind: "line",
      backgroundId: "table",
      speakerId: "aries",
      text: [
        "Aries 站起身，低声说：你不该出现在这里。",
        "Gemini 接上后半句：所以现在，你最好跟我们谈谈。",
      ],
      nextId: "prologue-end",
    },
    "prologue-end": {
      id: "prologue-end",
      kind: "end",
      backgroundId: "table",
      text: [
        "门外十三区的霓虹晃进来，把两人的影子拉得很长。",
        "序章到这里结束，下一段将从主角是否跟他们离开开始。",
      ],
      endLabel: "返回标题",
    },
  },
};
