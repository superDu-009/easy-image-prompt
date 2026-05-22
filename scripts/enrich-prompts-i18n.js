const fs = require("fs");
const path = require("path");

const promptsPath = path.join(__dirname, "..", "public", "prompts.json");

const CATEGORY_ALIASES = {
  "创意模板": "creative",
  "UI界面": "ui",
  "Profile / Avatar": "avatar",
  "Social Media Post": "social",
  "Infographic / Edu Visual": "infographic",
  "YouTube Thumbnail": "thumbnail",
  "Comic / Storyboard": "comic",
  "Product Marketing": "product",
  "E-commerce Main Image": "ecommerce",
  "品牌广告": "brand",
  "人物写真": "portrait",
  "信息图": "infographic",
  "角色设定": "character",
  "社交截图": "screenshot",
  "美食": "food",
  "电商": "ecommerce",
};

const CATEGORY_LABELS = {
  creative: { title_cn: "创意模板", title_en: "Creative Templates" },
  ui: { title_cn: "UI界面", title_en: "UI Screens" },
  avatar: { title_cn: "头像写真", title_en: "Profile / Avatar" },
  social: { title_cn: "社交媒体", title_en: "Social Media Post" },
  infographic: { title_cn: "信息图 / 教育视觉", title_en: "Infographic / Edu Visual" },
  thumbnail: { title_cn: "YouTube 封面", title_en: "YouTube Thumbnail" },
  comic: { title_cn: "漫画 / 分镜", title_en: "Comic / Storyboard" },
  product: { title_cn: "产品营销", title_en: "Product Marketing" },
  brand: { title_cn: "品牌广告", title_en: "Brand Advertising" },
  portrait: { title_cn: "人物写真", title_en: "Portrait Photography" },
  character: { title_cn: "角色设定", title_en: "Character Design" },
  screenshot: { title_cn: "社交截图", title_en: "Social Screenshot" },
  food: { title_cn: "美食", title_en: "Food" },
  ecommerce: { title_cn: "电商", title_en: "E-commerce" },
};

const TAG_ALIASES = {
  ...CATEGORY_ALIASES,
  poster: "poster",
  product: "product",
  infographic: "infographic",
  ui: "ui",
  "3d": "3d",
  food: "food",
  portrait: "portrait",
  anime: "anime",
  cinematic: "cinematic",
  fashion: "fashion",
};

const TITLE_CN_OVERRIDES = {
  1: "VR 头显爆炸结构海报",
  2: "手绘城市美食地图",
  3: "桃太郎混合风格讲解幻灯片",
  4: "电商直播间 UI 模板",
  5: "动漫武侠对战插画",
  6: "3D 石阶演化信息图",
  7: "赛博朋克动漫头像与霓虹文字",
  8: "紫色花园优雅幻想少女头像",
  9: "薰衣草幻想法师头像",
  10: "真实瑕疵感 AI 自拍头像",
  11: "雪兔汉服人像",
  12: "雪兔女帝人像",
  13: "雪兔面具汉服人像",
  14: "雪兔精灵人像",
  15: "动漫少女转电影感照片",
  16: "宋制汉服人像",
  17: "老照片修复成单反人像",
  18: "专业身份照壁纸",
  19: "黑衣华丽女性人像",
  20: "花园诗意女性人像",
  21: "超写实自拍质感提示词",
  22: "南亚男性与秃鹫电影感人像",
  23: "签名色纸马克笔人像",
  24: "休闲时尚九宫格写真",
  25: "蓝发空灵幻想人像",
  26: "单色棚拍人像",
  27: "PSG 转会官宣海报",
  28: "复古招牌画师草图",
  29: "电影感电梯场景",
  30: "昭和日复古文化杂志封面",
  31: "时装编辑摄影",
  32: "时尚编辑拼贴海报",
  33: "粉彩桌前困惑精灵少女",
  34: "旅行快照拼贴提示词",
  35: "社交媒体穿搭生成",
  36: "动漫宝可梦商店穿搭预告海报",
  37: "电影感清晨室内场景",
  38: "风景地经典汽车照片",
  39: "夜雨氛围人像",
  40: "地形文字卫星视角",
  41: "夕阳情侣电影感特写",
  42: "雨中英超奖杯庆祝",
  43: "照片改造与场景替换",
  44: "雨中蓝调编辑人像",
  45: "详细动物百科信息图",
  46: "旅行广告转化对比页",
  47: "日式住宅平面图生成器",
  48: "教育信息图生成器",
  49: "等距宗教建筑微缩场景",
  50: "四大宗教微缩信息图",
  51: "等距宗教建筑网格",
  52: "奢华宗教概念海报网格",
  53: "日式面部美学报告版式",
  54: "舞蹈动作教学图生成器",
  55: "意大利餐厅品牌套件板",
  56: "意大利餐厅品牌套件板",
  57: "手相分析卡片生成器",
  58: "深色 AI 产品主题演讲页",
  59: "电影感失忆主题 PPT 页",
  60: "极简 AI 锁定效应对比页",
  61: "电视访谈字幕封面",
  62: "红色荒漠星球上的宇航员",
  63: "火焰日式增长封面",
  64: "金色 AI 收入封面",
  65: "赛博 AI 网络研讨会封面",
  66: "电视综艺节目截图封面",
  67: "错位时代美容教程封面",
  68: "戏剧化足球电影动作镜头",
  69: "动漫 BL 宣传封面",
  70: "餐厅 POV 变化对比",
  71: "动漫人群 POV 对比",
  72: "霓虹 AI 封面对比",
  73: "赛博朋克 AI 工具对比海报",
  74: "日式 AI 对战 YouTube 封面",
  75: "Monika 动漫横幅插画",
  76: "紫色动漫百合横幅",
  77: "粉色动漫 Natsuki 横幅",
  78: "梦幻动漫 Sayori 横幅",
  79: "赛博朋克 404 女巫召唤",
  80: "动漫幻想旅行电影海报",
  81: "燃烧校园动漫惊悚海报",
  82: "动漫校园间谍电影海报",
  83: "动漫天空幻想主视觉",
  84: "史诗叙事毕业海报",
  85: "宋代风格英雄联盟",
  86: "粉发大教堂骑士",
  87: "电影分镜：山中巨怪",
  88: "雨夜花卉哥特人像",
  89: "幻想风 GPT Image 技能横幅",
  90: "复古波普漫画条",
  91: "哥特合体机甲设定图",
  92: "哥特五兽合体机甲图",
  93: "暗黑幻想合体机甲阵容",
  94: "武术动作教学分解图",
  95: "蒸汽朋克城市狐耳街头少年",
  96: "札幌上空虹彩松鼠少女",
  97: "3D 灰阶舞蹈参考图",
  98: "暗黑幻想内心怪物海报",
  99: "超现实 Crocs 夏季广告海报",
  100: "产品启发的时装设计",
  101: "产品灵感时装设计",
  102: "全息 AI 远见者收藏卡",
  103: "电子游戏杂志封面",
  104: "AI 合作发布海报场景",
  105: "4K 真实 Rolo 封面重制",
  106: "福布斯 30 Under 30 风格人像",
  107: "风格光谱时尚海报",
  108: "Merl iOS 个性化截图",
  109: "AI 模型路由应用商店截图",
  110: "AI 证件照应用商店宣传海报",
  111: "AI 团队应用海报",
  112: "高端街头服饰广告海报",
  113: "僵尸解药药品广告海报",
  114: "参考图转波西米亚时尚广告主图",
  115: "奢华护肤编辑网格主图",
  116: "日式雨具目录版式主图",
  117: "宠物服饰替换样机",
  118: "日式电商风扇主图",
  119: "极简时尚编辑分屏",
  120: "GPT-Image-2 产品摄影",
  121: "奢华维 C 精华产品图",
  122: "积木迷你套装包装样机",
  123: "奢华班尼迪克蛋微缩盒",
  124: "奢华防晒产品图",
  125: "蛋白粉飞溅英雄图",
  126: "时尚编辑穿搭拆解",
};

function hasCjk(value) {
  return /[\u4e00-\u9fff]/.test(value || "");
}

function titleWithoutPrefix(title) {
  return title.replace(/^(Profile \/ Avatar|Social Media Post|Infographic \/ Edu Visual|YouTube Thumbnail|Comic \/ Storyboard|Product Marketing|E-commerce Main Image)\s+-\s+/, "");
}

function normalizeCategoryKey(category) {
  return CATEGORY_ALIASES[category] || "creative";
}

function normalizeTagKey(tag) {
  return TAG_ALIASES[tag] || tag;
}

function deriveTitleCn(item) {
  if (item.title_cn) return item.title_cn;
  if (TITLE_CN_OVERRIDES[item.id]) return TITLE_CN_OVERRIDES[item.id];
  if (hasCjk(item.title)) return item.title;
  return titleWithoutPrefix(item.title);
}

function deriveTitleEn(item) {
  if (item.title_en) return item.title_en;
  if (!hasCjk(item.title)) return item.title;
  return item.title;
}

const prompts = JSON.parse(fs.readFileSync(promptsPath, "utf8"));

const enriched = prompts.map((item) => {
  const categoryKey = item.category_key || normalizeCategoryKey(item.category);
  const category = CATEGORY_LABELS[categoryKey] || CATEGORY_LABELS.creative;
  const tagsKey = Array.from(new Set((item.tags_key || item.tags || []).map(normalizeTagKey)));
  const promptCn = item.prompt_cn || "";
  const promptEn = item.prompt_en || "";

  return {
    ...item,
    title_cn: deriveTitleCn(item),
    title_en: deriveTitleEn(item),
    category_key: categoryKey,
    category_cn: category.title_cn,
    category_en: category.title_en,
    tags_key: tagsKey,
    prompt_cn: promptCn,
    prompt_en: promptEn,
    translation_status: {
      title_cn: Boolean(deriveTitleCn(item)),
      title_en: Boolean(deriveTitleEn(item)),
      prompt_cn: Boolean(promptCn),
      prompt_en: Boolean(promptEn),
    },
  };
});

fs.writeFileSync(promptsPath, `${JSON.stringify(enriched, null, 2)}\n`);
console.log(`Enriched ${enriched.length} prompts with i18n fields.`);
