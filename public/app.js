const state = {
  prompts: [],
  filtered: [],
  selected: null,
  category: "all",
  tag: "all",
  lang: "cn",
  uiLang: localStorage.getItem("imagePromptStudio.uiLang") || "zh",
  query: "",
  sort: "default",
};

const TEXT = {
  zh: {
    brandEyebrow: "本地图片提示词工具",
    searchLabel: "搜索提示词",
    searchPlaceholder: "海报、电商、头像、3D...",
    categoryTitle: "分类",
    tagTitle: "快捷标签",
    usageTitle: "使用方式",
    usageBody: "先在顶部设置 API Key，再选择模板修改提示词。上传参考图会自动切到图生图。",
    galleryEyebrow: "提示词画廊",
    sortDefault: "默认排序",
    sortTitle: "标题 A-Z",
    sortCategory: "分类排序",
    emptyTitle: "选一个模板开始",
    emptyBody: "左侧搜索，中间点卡片，右侧会出现可编辑提示词和生成按钮。",
    referenceTitle: "+ 参考图",
    referenceHint: "可选；上传后自动使用图生图",
    aspectRatio: "比例",
    quality: "质量",
    generate: "生成",
    projectSettings: "项目设置",
    save: "保存",
    all: "全部",
    allTemplates: "全部模板",
    setApiKey: "设置 API Key",
    apiKeyReady: "API Key 已设置",
    apiKeyPlaceholder: "输入 API Key，仅保存在本机浏览器",
    promptPlaceholder: "描述你想生成的图片，或从模板里继续修改...",
    uploadEmpty: "未上传参考图，默认文生图",
    submitting: "正在提交生成请求...",
    failed: "生成失败",
    noImageReturned: "接口没有返回可识别图片",
    resultTitle: "生成结果",
    resultAlt: "生成结果",
    resultCaption: "GPT Image-2 生成结果",
    download: "下载",
    previewDownload: "下载",
    myImages: "我的图片",
    localHistory: "本地生成历史",
    clearHistory: "清空历史",
    historyEmpty: "还没有本地生成记录",
    generatedAt: "生成于",
  },
  en: {
    brandEyebrow: "Local Image Prompt Tool",
    searchLabel: "Search Prompts",
    searchPlaceholder: "poster, product, avatar, 3D...",
    categoryTitle: "Categories",
    tagTitle: "Quick Tags",
    usageTitle: "How it works",
    usageBody: "Set the API key once, choose a template, then edit and generate. Uploading a reference image automatically switches to image-to-image.",
    galleryEyebrow: "Prompt Gallery",
    sortDefault: "Default",
    sortTitle: "Title A-Z",
    sortCategory: "By Category",
    emptyTitle: "Pick a template",
    emptyBody: "Search on the left, choose a card in the gallery, then edit and generate from the detail panel.",
    referenceTitle: "+ Reference",
    referenceHint: "Optional; uploaded images enable image-to-image",
    aspectRatio: "Ratio",
    quality: "Quality",
    generate: "Generate",
    projectSettings: "Project Settings",
    save: "Save",
    all: "All",
    allTemplates: "All Templates",
    setApiKey: "Set API Key",
    apiKeyReady: "API Key Set",
    apiKeyPlaceholder: "Enter API Key, saved only in this browser",
    promptPlaceholder: "Describe the image, or keep editing this template...",
    uploadEmpty: "No reference image. Text-to-image by default.",
    submitting: "Submitting generation request...",
    failed: "Generation failed",
    noImageReturned: "The API did not return a recognizable image",
    resultTitle: "Generated Images",
    resultAlt: "Generated image",
    resultCaption: "GPT Image-2 result",
    download: "Download",
    previewDownload: "Download",
    myImages: "My Images",
    localHistory: "Local Generation History",
    clearHistory: "Clear History",
    historyEmpty: "No local generation history yet",
    generatedAt: "Generated at",
  },
};

const CATEGORY_META = {
  creative: { zh: "创意模板", en: "Creative Templates" },
  ui: { zh: "UI界面", en: "UI Screens" },
  avatar: { zh: "头像写真", en: "Profile / Avatar" },
  social: { zh: "社交媒体", en: "Social Media Post" },
  infographic: { zh: "信息图 / 教育视觉", en: "Infographic / Edu Visual" },
  thumbnail: { zh: "YouTube 封面", en: "YouTube Thumbnail" },
  comic: { zh: "漫画 / 分镜", en: "Comic / Storyboard" },
  product: { zh: "产品营销", en: "Product Marketing" },
  brand: { zh: "品牌广告", en: "Brand Advertising" },
  portrait: { zh: "人物写真", en: "Portrait Photography" },
  character: { zh: "角色设定", en: "Character Design" },
  screenshot: { zh: "社交截图", en: "Social Screenshot" },
  food: { zh: "美食", en: "Food" },
  ecommerce: { zh: "电商", en: "E-commerce" },
};

const TAG_META = {
  creative: { zh: "创意", en: "creative" },
  poster: { zh: "海报", en: "poster" },
  product: { zh: "产品", en: "product" },
  infographic: { zh: "信息图", en: "infographic" },
  ui: { zh: "UI", en: "ui" },
  "3d": { zh: "3D", en: "3d" },
  food: { zh: "美食", en: "food" },
  portrait: { zh: "人像", en: "portrait" },
  anime: { zh: "动漫", en: "anime" },
  avatar: { zh: "头像", en: "avatar" },
  cinematic: { zh: "电影感", en: "cinematic" },
  fashion: { zh: "时尚", en: "fashion" },
  social: { zh: "社交", en: "social" },
  thumbnail: { zh: "封面", en: "thumbnail" },
  comic: { zh: "漫画", en: "comic" },
  brand: { zh: "品牌", en: "brand" },
  character: { zh: "角色", en: "character" },
  screenshot: { zh: "截图", en: "screenshot" },
  ecommerce: { zh: "电商", en: "e-commerce" },
};

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

const TAG_ALIASES = {
  "创意模板": "creative",
  "UI界面": "ui",
  "Profile / Avatar": "avatar",
  "Social Media Post": "social",
  "Infographic / Edu Visual": "infographic",
  "YouTube Thumbnail": "thumbnail",
  "Comic / Storyboard": "comic",
  "Product Marketing": "product",
  "品牌广告": "brand",
  "人物写真": "portrait",
  "信息图": "infographic",
  "角色设定": "character",
  "社交截图": "screenshot",
  "美食": "food",
  "电商": "ecommerce",
};

const HISTORY_KEY = "imagePromptStudio.generationHistory";
const HISTORY_LIMIT = 24;

const els = {
  i18nNodes: document.querySelectorAll("[data-i18n]"),
  languageButtons: document.querySelectorAll("[data-ui-lang]"),
  totalCount: document.querySelector("#totalCount"),
  searchInput: document.querySelector("#searchInput"),
  categoryList: document.querySelector("#categoryList"),
  tagList: document.querySelector("#tagList"),
  sortSelect: document.querySelector("#sortSelect"),
  resultTitle: document.querySelector("#resultTitle"),
  gallery: document.querySelector("#gallery"),
  emptyState: document.querySelector("#emptyState"),
  detailContent: document.querySelector("#detailContent"),
  detailImage: document.querySelector("#detailImage"),
  detailCategory: document.querySelector("#detailCategory"),
  detailTitle: document.querySelector("#detailTitle"),
  detailTags: document.querySelector("#detailTags"),
  promptEditor: document.querySelector("#promptEditor"),
  generateButton: document.querySelector("#generateButton"),
  generateResult: document.querySelector("#generateResult"),
  myImagesButton: document.querySelector("#myImagesButton"),
  myImagesDrawer: document.querySelector("#myImagesDrawer"),
  myImagesBackdrop: document.querySelector("#myImagesBackdrop"),
  myImagesClose: document.querySelector("#myImagesClose"),
  myImagesContent: document.querySelector("#myImagesContent"),
  apiKeyButton: document.querySelector("#apiKeyButton"),
  apiKeyStatus: document.querySelector("#apiKeyStatus"),
  apiModal: document.querySelector("#apiModal"),
  apiModalBackdrop: document.querySelector("#apiModalBackdrop"),
  apiModalClose: document.querySelector("#apiModalClose"),
  apiKeySave: document.querySelector("#apiKeySave"),
  apiKeyInput: document.querySelector("#apiKeyInput"),
  aspectRatioSelect: document.querySelector("#aspectRatioSelect"),
  qualitySelect: document.querySelector("#qualitySelect"),
  imageUploadBox: document.querySelector("#imageUploadBox"),
  imageInput: document.querySelector("#imageInput"),
  uploadPreview: document.querySelector("#uploadPreview"),
  detailClose: document.querySelector("#detailClose"),
  previewOpen: document.querySelector("#previewOpen"),
  imagePreview: document.querySelector("#imagePreview"),
  previewImage: document.querySelector("#previewImage"),
  previewCaption: document.querySelector("#previewCaption"),
  previewClose: document.querySelector("#previewClose"),
  previewBackdrop: document.querySelector("#previewBackdrop"),
  previewStage: document.querySelector(".preview-stage"),
  previewZoomOut: document.querySelector("#previewZoomOut"),
  previewZoomIn: document.querySelector("#previewZoomIn"),
  previewZoomReset: document.querySelector("#previewZoomReset"),
  previewZoomValue: document.querySelector("#previewZoomValue"),
  previewDownload: document.querySelector("#previewDownload"),
};

let referenceFiles = [];
let previewScale = 1;
let previewPan = { x: 0, y: 0 };
let previewDrag = null;
let previewDownloadUrl = "";

function t(key) {
  return TEXT[state.uiLang]?.[key] || TEXT.zh[key] || key;
}

function textByLang(value, fallback = "") {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value[state.uiLang] || value.zh || value.en || fallback;
}

function normalizeCategoryKey(value = "") {
  return CATEGORY_ALIASES[value] || value;
}

function normalizeTagKey(value = "") {
  return TAG_ALIASES[value] || value;
}

function categoryLabel(key) {
  if (key === "all") return t("all");
  return CATEGORY_META[key]?.[state.uiLang] || key;
}

function tagLabel(key) {
  if (key === "all") return t("all");
  return TAG_META[key]?.[state.uiLang] || key;
}

function promptTitle(item) {
  if (!item) return "";
  if (state.uiLang === "en") return item.title_en || item.title || item.title_cn || "";
  return item.title_cn || item.title || item.title_en || "";
}

function promptCategoryKey(item) {
  return item.category_key || normalizeCategoryKey(item.category);
}

function promptTagKeys(item) {
  return (item.tags_key || item.tags || []).map(normalizeTagKey);
}

function imageUrl(imagePath) {
  return `/source-images/${imagePath.replace(/^images\//, "")}`;
}

function currentPrompt(prompt = state.selected) {
  if (!prompt) return "";
  if (state.lang === "en") return prompt.prompt_en || prompt.prompt || prompt.prompt_cn || "";
  return prompt.prompt_cn || prompt.prompt || prompt.prompt_en || "";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildChips(container, items, active, onClick) {
  container.innerHTML = "";
  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = `chip${item === active ? " active" : ""}`;
    button.type = "button";
    button.textContent = container === els.categoryList ? categoryLabel(item) : tagLabel(item);
    button.addEventListener("click", () => onClick(item));
    container.appendChild(button);
  });
}

function renderFilters() {
  const categories = ["all", ...new Set(state.prompts.map(promptCategoryKey))];
  const popularTags = ["all", "poster", "product", "portrait", "infographic", "ui", "cinematic", "3d", "anime", "fashion", "food"];

  buildChips(els.categoryList, categories.slice(0, 18), state.category, (category) => {
    state.category = category;
    filterPrompts();
  });

  buildChips(els.tagList, popularTags, state.tag, (tag) => {
    state.tag = tag;
    filterPrompts();
  });
}

function filterPrompts() {
  const query = state.query.trim().toLowerCase();
  let results = state.prompts.filter((item) => {
    const categoryKey = promptCategoryKey(item);
    const tagKeys = promptTagKeys(item);
    const inCategory = state.category === "all" || categoryKey === state.category;
    const inTag = state.tag === "all" || tagKeys.includes(state.tag);
    const haystack = `${item.id} ${item.title || ""} ${item.title_cn || ""} ${item.title_en || ""} ${categoryLabel(categoryKey)} ${tagKeys.map(tagLabel).join(" ")} ${item.prompt_cn || ""} ${item.prompt_en || ""}`.toLowerCase();
    return inCategory && inTag && (!query || haystack.includes(query));
  });

  if (state.sort === "title") {
    results = results.slice().sort((a, b) => promptTitle(a).localeCompare(promptTitle(b)));
  }
  if (state.sort === "category") {
    results = results.slice().sort((a, b) => categoryLabel(promptCategoryKey(a)).localeCompare(categoryLabel(promptCategoryKey(b))) || a.id - b.id);
  }

  state.filtered = results;
  renderGallery();
  els.resultTitle.textContent = `${state.category === "all" ? t("allTemplates") : categoryLabel(state.category)} · ${results.length}`;
  renderFilters();
}

function renderGallery() {
  const fragment = document.createDocumentFragment();
  els.gallery.innerHTML = "";

  state.filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = `prompt-card${state.selected?.id === item.id ? " active" : ""}`;
    const image = item.images[0] ? imageUrl(item.images[0]) : "";
    const title = promptTitle(item);
    card.innerHTML = `
      <button type="button" aria-label="${escapeHtml(title)}">
        <div class="thumb">
          <img src="${image}" alt="${escapeHtml(title)}" loading="lazy">
          <span class="number-badge">#${item.id}</span>
        </div>
        <div class="card-body">
          <div class="card-title">${escapeHtml(title)}</div>
          <span class="card-category">${escapeHtml(categoryLabel(promptCategoryKey(item)))}</span>
        </div>
      </button>
    `;
    card.querySelector("button").addEventListener("click", () => selectPrompt(item.id));
    fragment.appendChild(card);
  });

  els.gallery.appendChild(fragment);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function selectPrompt(id) {
  state.selected = state.prompts.find((item) => item.id === id);
  state.lang = state.uiLang === "en" && state.selected.prompt_en ? "en" : state.selected.prompt_cn ? "cn" : "en";
  document.body.classList.add("detail-open");
  renderGallery();
  renderDetail();
}

function renderDetail() {
  const item = state.selected;
  if (!item) return;

  els.emptyState.classList.add("hidden");
  els.detailContent.classList.remove("hidden");
  els.generateResult.classList.add("hidden");
  els.detailImage.src = imageUrl(item.images[0]);
  els.detailImage.alt = promptTitle(item);
  els.previewImage.src = imageUrl(item.images[0]);
  els.previewImage.alt = promptTitle(item);
  els.previewCaption.textContent = `#${item.id} ${promptTitle(item)}`;
  els.detailCategory.textContent = categoryLabel(promptCategoryKey(item));
  els.detailTitle.textContent = promptTitle(item);
  els.detailTags.innerHTML = promptTagKeys(item).map((tag) => `<span class="tag">${escapeHtml(tagLabel(tag))}</span>`).join("");

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.lang === state.lang);
  });

  els.promptEditor.value = currentPrompt(item);
}

function openImagePreview() {
  if (!state.selected) return;
  previewDownloadUrl = "";
  els.previewDownload.classList.add("hidden");
  resetPreviewTransform();
  els.imagePreview.classList.remove("hidden");
  document.body.classList.add("preview-open");
  els.previewClose.focus();
}

function closeImagePreview() {
  els.imagePreview.classList.add("hidden");
  document.body.classList.remove("preview-open");
}

function renderPreviewTransform() {
  els.previewImage.style.transform = `translate(${previewPan.x}px, ${previewPan.y}px) scale(${previewScale})`;
  els.previewZoomValue.textContent = `${Math.round(previewScale * 100)}%`;
}

function setPreviewScale(scale, anchor) {
  const previousScale = previewScale;
  previewScale = Math.min(4, Math.max(0.25, scale));
  if (anchor && previousScale !== previewScale) {
    const ratio = previewScale / previousScale;
    previewPan.x = anchor.x - (anchor.x - previewPan.x) * ratio;
    previewPan.y = anchor.y - (anchor.y - previewPan.y) * ratio;
  }
  if (previewScale <= 1) {
    previewPan = { x: 0, y: 0 };
  }
  renderPreviewTransform();
}

function resetPreviewTransform() {
  previewScale = 1;
  previewPan = { x: 0, y: 0 };
  renderPreviewTransform();
}

function openGeneratedPreview(image, index = 0) {
  previewDownloadUrl = image.url;
  els.previewImage.src = image.url;
  els.previewImage.alt = t("resultAlt");
  els.previewCaption.textContent = t("resultCaption");
  els.previewDownload.href = image.url;
  els.previewDownload.download = `gpt-image-2-${Date.now()}-${index + 1}.png`;
  els.previewDownload.textContent = t("previewDownload");
  els.previewDownload.classList.remove("hidden");
  resetPreviewTransform();
  els.imagePreview.classList.remove("hidden");
  document.body.classList.add("preview-open");
}

function updateApiKeyStatus() {
  const hasKey = Boolean(els.apiKeyInput.value.trim());
  els.apiKeyStatus.textContent = hasKey ? t("apiKeyReady") : t("setApiKey");
  els.apiKeyButton.classList.toggle("ready", hasKey);
}

function openApiModal() {
  els.apiModal.classList.remove("hidden");
  els.apiKeyInput.focus();
}

function closeApiModal() {
  els.apiModal.classList.add("hidden");
}

function saveApiKey() {
  localStorage.setItem("imagePromptStudio.apiKey", els.apiKeyInput.value.trim());
  updateApiKeyStatus();
  closeApiModal();
}

function loadGenerationHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGenerationHistory(items) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, HISTORY_LIMIT)));
  } catch (error) {
    console.warn("Failed to save generation history", error);
  }
}

function addGenerationHistory(data, payload) {
  const history = loadGenerationHistory();
  const item = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
    promptTitle: state.selected ? promptTitle(state.selected) : "",
    prompt: payload.prompt,
    aspect_ratio: payload.aspect_ratio,
    quality: payload.quality,
    mode: referenceFiles.length ? "image-to-image" : "text-to-image",
    images: data.images,
  };
  saveGenerationHistory([item, ...history]);
  return item;
}

function clearGenerationHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderMyImages();
}

async function generateImage() {
  els.generateButton.disabled = true;
  els.generateResult.classList.remove("hidden");
  els.generateResult.textContent = t("submitting");

  try {
    const apiKey = els.apiKeyInput.value.trim();
    localStorage.setItem("imagePromptStudio.apiKey", apiKey);
    const basePayload = {
      apiKey,
      prompt: els.promptEditor.value,
      aspect_ratio: els.aspectRatioSelect.value,
      n: "1",
      quality: els.qualitySelect.value,
      background: "auto",
    };

    let response;
    if (referenceFiles.length) {
      const form = new FormData();
      Object.entries(basePayload).forEach(([key, value]) => form.append(key, value));
      referenceFiles.forEach((file) => form.append("image", file));
      response = await fetch("/api/image/image-to-image", { method: "POST", body: form });
    } else {
      response = await fetch("/api/image/text-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(basePayload),
      });
    }

    const data = await response.json();
    if (data.ok && data.images?.length) {
      addGenerationHistory(data, basePayload);
    }
    renderGenerateResult(data);
  } catch (error) {
    els.generateResult.textContent = `${t("failed")}：${error.message}`;
  } finally {
    els.generateButton.disabled = false;
  }
}

function renderGenerateResult(data) {
  if (!data.ok || !data.images?.length) {
    els.generateResult.innerHTML = `<strong>${escapeHtml(t("failed"))}</strong><p>${escapeHtml(data.error || t("noImageReturned"))}</p><pre>${escapeHtml(JSON.stringify(data.raw || data, null, 2))}</pre>`;
    return;
  }

  els.generateResult.innerHTML = `
    <strong>${escapeHtml(t("resultTitle"))}</strong>
    <div class="result-grid">
      ${data.images
        .map(
          (image, index) => `
            <figure>
              <button class="result-preview-button" type="button" data-result-index="${index}">
                <img src="${image.url}" alt="${escapeHtml(t("resultAlt"))} ${index + 1}">
              </button>
              <a href="${image.url}" download="gpt-image-2-${Date.now()}-${index + 1}.png">${escapeHtml(t("download"))}</a>
            </figure>
          `,
        )
        .join("")}
    </div>
  `;

  els.generateResult.querySelectorAll("[data-result-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.resultIndex);
      openGeneratedPreview(data.images[index], index);
    });
  });
}

function openMyImages() {
  renderMyImages();
  els.myImagesDrawer.classList.remove("hidden");
}

function closeMyImages() {
  els.myImagesDrawer.classList.add("hidden");
}

function renderMyImages() {
  const history = loadGenerationHistory();
  renderHistoryContainer(els.myImagesContent, history);
}

function renderHistoryContainer(container, history) {
  if (!container) return;
  if (!history.length) {
    container.innerHTML = `
      <div class="my-images-empty shape-stack"><span></span><span></span><span></span></div>
      <p>${escapeHtml(t("historyEmpty"))}</p>
    `;
    return;
  }

  const html = `
    <div class="result-head">
      <strong>${escapeHtml(t("localHistory"))}</strong>
      <button class="history-clear" type="button">${escapeHtml(t("clearHistory"))}</button>
    </div>
    <div class="my-images-grid">
      ${history
        .flatMap((item, itemIndex) =>
          (item.images || []).map(
            (image, imageIndex) => `
              <figure class="my-image-card">
                <button class="result-preview-button" type="button" data-history-item="${itemIndex}" data-history-image="${imageIndex}">
                  <img src="${image.url}" alt="${escapeHtml(t("resultAlt"))} ${imageIndex + 1}">
                </button>
                <figcaption>
                  <strong>${escapeHtml(item.promptTitle || t("resultTitle"))}</strong>
                  <span>${escapeHtml(new Date(item.createdAt).toLocaleString())}</span>
                  <a href="${image.url}" download="gpt-image-2-${item.id}-${imageIndex + 1}.png">${escapeHtml(t("download"))}</a>
                </figcaption>
              </figure>
            `,
          ),
        )
        .join("")}
    </div>
  `;

  container.innerHTML = html;

  const clearButton = container.querySelector(".history-clear");
  if (clearButton) clearButton.addEventListener("click", clearGenerationHistory);

  container.querySelectorAll("[data-history-item]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = history[Number(button.dataset.historyItem)];
      const imageIndex = Number(button.dataset.historyImage);
      openGeneratedPreview(item.images[imageIndex], imageIndex);
    });
  });
}

function renderUploadPreview() {
  els.uploadPreview.innerHTML = "";
  if (!referenceFiles.length) {
    els.uploadPreview.innerHTML = `<div class="upload-empty">${escapeHtml(t("uploadEmpty"))}</div>`;
    return;
  }
  referenceFiles.forEach((file, index) => {
    const item = document.createElement("div");
    item.className = "upload-item";
    item.innerHTML = `
      <img src="${URL.createObjectURL(file)}" alt="参考图 ${index + 1}">
      <button type="button" aria-label="删除参考图">×</button>
    `;
    item.querySelector("button").addEventListener("click", () => {
      referenceFiles.splice(index, 1);
      renderUploadPreview();
    });
    els.uploadPreview.appendChild(item);
  });
}

function applyUiLanguage() {
  document.documentElement.lang = state.uiLang === "en" ? "en" : "zh-CN";
  els.i18nNodes.forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  els.searchInput.placeholder = t("searchPlaceholder");
  els.promptEditor.placeholder = t("promptPlaceholder");
  els.apiKeyInput.placeholder = t("apiKeyPlaceholder");
  els.previewDownload.textContent = t("previewDownload");
  if (previewDownloadUrl) {
    els.previewDownload.href = previewDownloadUrl;
  }
  els.languageButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.uiLang === state.uiLang);
  });
  updateApiKeyStatus();
  renderUploadPreview();
  if (state.selected) renderDetail();
  filterPrompts();
  renderMyImages();
}

function setUiLanguage(lang) {
  state.uiLang = lang;
  localStorage.setItem("imagePromptStudio.uiLang", lang);
  if (state.selected) {
    state.lang = lang === "en" && state.selected.prompt_en ? "en" : state.selected.prompt_cn ? "cn" : "en";
  }
  applyUiLanguage();
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    state.lang = tab.dataset.lang;
    renderDetail();
  });
});

els.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  filterPrompts();
});

els.sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  filterPrompts();
});

els.generateButton.addEventListener("click", generateImage);
els.apiKeyInput.value = localStorage.getItem("imagePromptStudio.apiKey") || "";
updateApiKeyStatus();
renderUploadPreview();
els.languageButtons.forEach((button) => {
  button.addEventListener("click", () => setUiLanguage(button.dataset.uiLang));
});
els.apiKeyButton.addEventListener("click", openApiModal);
els.myImagesButton.addEventListener("click", openMyImages);
els.myImagesBackdrop.addEventListener("click", closeMyImages);
els.myImagesClose.addEventListener("click", closeMyImages);
els.apiModalBackdrop.addEventListener("click", closeApiModal);
els.apiModalClose.addEventListener("click", closeApiModal);
els.apiKeySave.addEventListener("click", saveApiKey);
els.apiKeyInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveApiKey();
});
els.imageInput.addEventListener("change", () => {
  referenceFiles = Array.from(els.imageInput.files || []).slice(0, 4);
  renderUploadPreview();
});
els.detailClose.addEventListener("click", () => {
  document.body.classList.remove("detail-open");
});
els.previewOpen.addEventListener("click", openImagePreview);
els.previewClose.addEventListener("click", closeImagePreview);
els.previewBackdrop.addEventListener("click", closeImagePreview);
els.previewZoomOut.addEventListener("click", () => setPreviewScale(previewScale - 0.25));
els.previewZoomIn.addEventListener("click", () => setPreviewScale(previewScale + 0.25));
els.previewZoomReset.addEventListener("click", resetPreviewTransform);
els.previewStage.addEventListener("wheel", (event) => {
  if (els.imagePreview.classList.contains("hidden")) return;
  event.preventDefault();
  const rect = els.previewStage.getBoundingClientRect();
  setPreviewScale(previewScale + (event.deltaY < 0 ? 0.1 : -0.1), {
    x: event.clientX - rect.left - rect.width / 2,
    y: event.clientY - rect.top - rect.height / 2,
  });
});
els.previewStage.addEventListener("pointerdown", (event) => {
  if (els.imagePreview.classList.contains("hidden")) return;
  previewDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    panX: previewPan.x,
    panY: previewPan.y,
  };
  els.previewStage.classList.add("dragging");
  els.previewStage.setPointerCapture(event.pointerId);
});
els.previewStage.addEventListener("pointermove", (event) => {
  if (!previewDrag || previewDrag.pointerId !== event.pointerId) return;
  previewPan.x = previewDrag.panX + event.clientX - previewDrag.startX;
  previewPan.y = previewDrag.panY + event.clientY - previewDrag.startY;
  renderPreviewTransform();
});
els.previewStage.addEventListener("pointerup", (event) => {
  if (!previewDrag || previewDrag.pointerId !== event.pointerId) return;
  previewDrag = null;
  els.previewStage.classList.remove("dragging");
});
els.previewStage.addEventListener("pointercancel", () => {
  previewDrag = null;
  els.previewStage.classList.remove("dragging");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !els.myImagesDrawer.classList.contains("hidden")) {
    closeMyImages();
    return;
  }
  if (event.key === "Escape" && !els.apiModal.classList.contains("hidden")) {
    closeApiModal();
    return;
  }
  if (event.key === "Escape" && !els.imagePreview.classList.contains("hidden")) {
    closeImagePreview();
  }
  if (!els.imagePreview.classList.contains("hidden") && (event.key === "+" || event.key === "=")) {
    setPreviewScale(previewScale + 0.25);
  }
  if (!els.imagePreview.classList.contains("hidden") && event.key === "-") {
    setPreviewScale(previewScale - 0.25);
  }
  if (!els.imagePreview.classList.contains("hidden") && event.key === "0") {
    resetPreviewTransform();
  }
});

fetch("/prompts.json")
  .then((response) => response.json())
  .then((prompts) => {
    state.prompts = prompts;
    state.filtered = prompts;
    els.totalCount.textContent = prompts.length;
    applyUiLanguage();
  });
