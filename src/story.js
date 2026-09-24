import { doctorNodes } from './routes/medicine.js';
import { founderNodes } from './routes/business.js';
import { astronautNodes } from './routes/space.js';

export const chapters = ['草原出生点', '世界的岔路口', '点子成真了', '人生大事件', '命运的小插曲', '两个人的日常', '下一件大事', '今晚的月亮'];
export const journeys = {
  doctor: { label: '医学人生', role: '守护快乐的医生', greeting: '快乐生活，也很重要。' },
  founder: { label: '草原创业人生', role: '草原动物联邦的创业家', greeting: '等等，这里有个商机！' },
  astronaut: { label: '星际人生', role: '在星际冒险的宇航员', greeting: '下一站，去宇宙看看！' },
};

// Ages describe fictional game progression, not a dated biography.
export const story = {
  ...doctorNodes,
  ...founderNodes,
  ...astronautNodes,

  "meadow": {
    "chapter": 0,
    "age": 1,
    "place": "通辽 · 杏树下",
    "scene": "village",
    "kicker": "你好，小小的冒险家",
    "title": "一个很有想法的人类，出生了。",
    "text": "通辽的小村庄里，杏树把影子铺满大院。小鸡、小羊、小狗全都来了。它们看着新来的秋月，决定先推选一位院长。",
    "choices": [
      {
        "label": "宣布：这个院子我罩了",
        "detail": "就任第一届动物大会会长",
        "result": "小鸡鼓掌，小羊点头，小狗负责维持秩序。你发表了三分钟演讲，核心思想只有一句：大家都要吃好。",
        "item": "动物会长徽章",
        "next": "apricots",
        "set": {
          "origin": 0
        }
      },
      {
        "label": "爬上杏树，看看外面的世界",
        "detail": "也许树梢就是世界地图的入口",
        "result": "你爬上杏树，发现树梢藏着一张世界地图。最上面还有一小块没画完的蓝色。你折下一枝勇气：以后去远处，总能用上。",
        "item": "杏树的勇气",
        "next": "apricots",
        "set": {
          "origin": 1
        }
      },
      {
        "label": "开一家“摸狗一毛钱”体验店",
        "detail": "商业直觉，已经开始萌芽",
        "result": "第一位顾客是小羊。它付了你一口草。创业第一天，营收：草。客户满意度：非常高。",
        "item": "草原第一桶草",
        "next": "apricots",
        "set": {
          "origin": 2
        }
      }
    ]
  },
  "apricots": {
    "chapter": 0,
    "age": 6,
    "place": "通辽 · 老家的院子",
    "scene": "village",
    "kicker": "口袋里的童年",
    "title": "把杏树的夏天装进口袋。",
    "text": "长大以后，有些地方会变样。但此刻，杏子刚好熟了。点一点树上的三颗杏子，把这个夏天带走吧。",
    "game": "apricot",
    "next": "crossroads"
  },
  "seaside": {
    "chapter": 5,
    "age": 30,
    "place": "阿那亚 · 上一个生日",
    "scene": "sea",
    "title": "海风路过，你们刚好在笑。",
    "text": "上一年的生日，你们一起去了阿那亚。看海、赶海，慢慢走，什么也不用赶。点一点沙滩上的三枚贝壳，把这天的好心情捡回来。",
    "game": "shells",
    "next": "engagement"
  },
  "arrival": {
    "chapter": 7,
    "age": 31,
    "place": "哈尔滨 · 农历八月十五",
    "scene": "harbin",
    "kicker": "最后一站，也是新的开始",
    "title": "你从成都来，我从北京来。",
    "text": "地图上的两条线，终于在哈尔滨交会。无论来时坐的是飞机、草原专车，还是花手飞船，今天都可以歇一歇。月亮很圆，你也刚好在我身边。",
    "button": "去过一个开心的生日",
    "next": "candles"
  },
  "candles": {
    "chapter": 7,
    "age": 31,
    "place": "哈尔滨 · 生日快乐",
    "scene": "birthday",
    "title": "秋月，许个愿吧。",
    "text": "草原和远方，那些认真生活的日子，还有一路惹出来的离谱故事，都陪你走到了这里。轻触烛光，把今天留给自己。",
    "game": "candle",
    "next": "ending"
  }
,
  crossroads: (state) => ({
    chapter: 1, age: 12, place: '通辽 · 杏树外的世界', scene: 'village', form: 'childhood',
    title: '世界地图摊开了。往哪儿走？',
    kicker: '这次的决定，会把你带去不同的人生',
    text: [
      '动物大会给会长办了张通行证。小狗问：下一站是学校、集市，还是天上？它负责看家，你负责亲自去看看。',
      '你把杏树上找到的地图展开，发现纸上的路会自己生长。去学校的路最平整，去集市的路很好闻，往天上那条暂时没有栏杆。',
      '当年的第一桶草还好好装在口袋里。世界上有很多种活法，你可以拿它当书签、当启动资金，也可以试着当飞船燃料。',
    ][state.origin],
    choices: [
      { label: '背上书包，去学会帮助别人', detail: '医学人生 · 寄宿校园、五鼠科研与快乐生活', result: '这条路有考试、有朋友，也有很远的地方。你背好书包，决定亲手弄懂世界，然后让一些人的日子变好一点。', item: '医学人生通行证', set: { career: 'doctor' }, form: 'school', scene: 'school', next: 'doctor_teen' },
      { label: '不等毕业了，先把小生意做起来', detail: '草原创业 · 动物联邦、草币与柠檬董事会', result: '小羊送来草席，小狗拉来客人。你把“摸狗一毛钱”的木牌擦亮，宣布营业。今天起，整个草原都是你的练习场。', item: '草原营业执照', set: { career: 'founder' }, form: 'together', scene: 'market', next: 'founder_teen' },
      { label: '沿着杏树往上走，去太空看看', detail: '星际人生 · 花手飞船、催眠枕头与失重奇遇', result: '你在树顶试着摇了一下花手，脚竟然离开了树枝。小狗在下面追着喊，翻译过来是：会长，回来记得带点月亮！', item: '地球出入通行证', set: { career: 'astronaut' }, form: 'school', scene: 'space', next: 'astronaut_teen' },
    ],
  }),
  firstdate: (state) => ({
    chapter: 4, age: 28,
    place: { doctor: '北京 · 见面之后', founder: '草原联邦 · 收摊之后', astronaut: '近地轨道 · 救援之后' }[state.career],
    scene: { doctor: 'date', founder: 'market', astronaut: 'space' }[state.career],
    title: { doctor: '那张没买到的票，后来很值得。', founder: '今日营收，多了一份心动。', astronaut: '引力没恢复，你们先靠近了。' }[state.career],
    text: {
      doctor: '朋友介绍的人，慢慢变成了想分享日常的人。尹航发现，精致鞋是限定装备，洞洞鞋才是常驻。秋月发现，和他聊天，很容易笑到停不下来。',
      founder: '尹航开始常来帮忙，你也总会给他留一份甜的。柠檬董事长默默发芽，小狗自觉提前收摊。你们聊着聊着，连最后一盏灯都忘了关。',
      astronaut: '尹航学会了在失重时抓住你的手，你学会了给双人座留位置。星图上多了一条常走的航线。距离这么远，两个人却越来越近。',
    }[state.career],
    button: '两人小队，出发', next: 'birthdaygift',
  }),
  birthdaygift: (state) => ({
    chapter: 5, age: 29,
    place: { doctor: '北京 · 尹航的生日', founder: '联邦集市 · 尹航的生日', astronaut: '空间站 · 尹航的生日' }[state.career],
    scene: { doctor: 'park', founder: 'market', astronaut: 'space' }[state.career],
    kicker: '双人模式已开启', title: '花、蛋糕，还有……小弹弓？',
    text: {
      doctor: '认识不久，就是尹航的生日。秋月认真准备了花和小蛋糕，甚至带上了弹弓。两个人干脆下楼玩了起来。点中三只彩色气球，给这一天加点快乐。',
      founder: '尹航过生日，老板亲自收摊，抱着花、蛋糕和小弹弓出现。动物员工把气球系在集市上空，今天全场休息，只招待两位快乐的人。点中三只气球吧。',
      astronaut: '空间站第一次办生日会。花用安全带固定，蛋糕装在保鲜盒里。你掏出小弹弓：“训练一下太空准头？”尹航笑着接过。点中三只失重气球吧。',
    }[state.career],
    game: 'slingshot', next: 'daily',
  }),
  daily: (state) => ({
    chapter: 5, age: 29,
    place: { doctor: '北京 · 珍贵的周末', founder: '集市打烊 · 老板也要放假', astronaut: '双人飞船 · 今天不赶路' }[state.career],
    scene: state.career === 'astronaut' ? 'space' : 'home',
    title: '世界很大，今天先过两个人的小日子。',
    text: {
      doctor: '平时都忙，住得也远，见面常常要等到晚上或周末。好不容易凑在一起，一件普通的小事也值得认真安排。',
      founder: '把营业牌翻到“明天再说”，把柠檬董事长挪到向阳的位置。没有订单的一晚，你们决定认真研究一下，什么事最适合两个人一起浪费时间。',
      astronaut: '飞船停在安静的轨道上，窗外的星星慢慢后退。今天没有紧急呼叫，也不用抢着拯救宇宙。这一小块失重的地方，就是你们的周末。',
    }[state.career],
    choices: [
      { label: '做一顿饭，厨房并肩作战', detail: '一个掌勺，一个试吃', result: state.career === 'astronaut' ? '番茄飘过去，尹航伸手接住。你负责调味，他负责阻止晚饭逃离厨房。终于吃上第一口，尹航顺手记下了“秋月爱吃清单”：下次还要一起做。' : '你掌勺，尹航试吃，尝着尝着还总结出一张“秋月爱吃清单”。原来认真研究一顿饭，也是认真研究怎样让对方开心。', item: '两个人的家常菜', set: { partnerActivity: 0 }, next: 'fruitcake' },
      { label: '一起研究一个很离谱的问题', detail: '比如柠檬树为什么不能当司机', result: state.career === 'doctor' ? '书摊开五分钟，话题已经从论文转到柠檬树考驾照。尹航负责认真听，你负责继续想。研究没有结论，笑得倒是很完整。' : '你们认真画了张柠檬树驾驶座设计图。讨论到第三页，尹航问：“它是不是够不到刹车？”两个人笑倒，决定先给它颁个理论结业证。', item: '双人脑洞设计图', set: { partnerActivity: 1 }, next: 'fruitcake' },
      { label: '一起吃鸡，勇闯决赛圈', detail: '双人小队，正式出击', result: '你突然冒出一个绝妙的战术，尹航负责跟上。名次先放一边，这一局最重要的战利品，是两个人笑到停不下来。赛后约定：下一次也要组队。', item: '最佳双排队友奖', set: { partnerActivity: 2 }, next: 'fruitcake' },
    ],
  }),
  fruitcake: (state) => ({
    chapter: 5, age: 30, place: '两个人的回忆 · 水果蛋糕', scene: 'cake',
    title: '不太爱吃蛋糕？那就换个办法。',
    text: [
      '尹航翻开一起做饭时记的“秋月爱吃清单”，把西瓜和其他水果做成了一只蛋糕。没有标准配方，但每一种水果，都有认真记住你的痕迹。',
      '那张离谱的双人设计图终于有了实用版本：用西瓜做底、水果搭塔，给秋月造一只不必有奶油的蛋糕。尹航说，这次先吃，论文就不写了。',
      '尹航把西瓜和其他水果堆成生日补给箱，最甜的一块留给队长秋月。你们确认，这一局没有缩圈，只有两个人慢慢吃完的时间。',
    ][state.partnerActivity],
    button: '下一站，一起去看海', next: 'seaside',
  }),
  engagement: (state) => ({
    chapter: 5, age: 30, place: '今年六月 · 订婚', scene: 'engagement',
    title: '两人小队，长期组队成功。',
    text: {
      doctor: '从一次见面，到很多个认真过的周末，再到今年六月的订婚。未来还很长，你们已经决定：接着一起走。',
      founder: '动物联邦想给订婚仪式加一条“终身试吃”的规定。你说，这次不用合同。你们已经认真约好，往后的日子，要一起经营。',
      astronaut: '你们把双人座的使用期限改成“很久很久”，把约定也带进了六月的订婚。飞船可以停靠很多星球，身边的人，你们已经选好了。',
    }[state.career],
    button: '下一章，还有好多新点子', next: `${state.career}_future`,
  }),
};

export function getNode(state) {
  const node = story[state.node];
  return typeof node === 'function' ? node(state) : node;
}

export function resolveChoice(state, node, index) {
  const choice = node.choices[index];
  return {
    ...state,
    ...choice.set,
    node: choice.next,
    items: [...state.items, choice.item],
    choices: [...state.choices, { chapter: node.chapter, index, label: choice.label, item: choice.item }],
    result: {
      title: choice.label, text: choice.result, scene: choice.scene || node.scene,
      item: choice.item, chapter: node.chapter, age: node.age, place: node.place,
      form: choice.form || node.form,
    },
  };
}

export const newGame = () => ({
  node: 'meadow', career: null, origin: 0, project: 0, approach: 0, ambition: 0, partnerActivity: 0,
  items: [], choices: [], result: null,
});
