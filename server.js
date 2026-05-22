const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3010);
const PUBLIC_DIR = path.join(__dirname, "public");
const GENERATED_DIR = path.join(PUBLIC_DIR, "generated");
const SOURCE_IMAGES = path.join(PUBLIC_DIR, "source-images");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml; charset=utf-8",
};

fs.mkdirSync(GENERATED_DIR, { recursive: true });

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

function sendPlaceholderImage(res) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
  <rect width="640" height="640" fill="#fffdf5"/>
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="6" cy="6" r="2" fill="#e2e8f0"/>
    </pattern>
  </defs>
  <rect width="640" height="640" fill="url(#dots)"/>
  <circle cx="182" cy="178" r="86" fill="#fbbf24" stroke="#1e293b" stroke-width="8"/>
  <rect x="238" y="226" width="250" height="180" rx="28" fill="#8b5cf6" stroke="#1e293b" stroke-width="8"/>
  <path d="M176 466h288l-84-112-58 74-42-44z" fill="#34d399" stroke="#1e293b" stroke-width="8" stroke-linejoin="round"/>
  <text x="320" y="542" text-anchor="middle" font-family="system-ui, sans-serif" font-size="34" font-weight="800" fill="#1e293b">Image Prompt Studio</text>
</svg>`;
  send(res, 200, svg, "image/svg+xml; charset=utf-8");
}

function safeFile(baseDir, requestPath) {
  const cleanPath = decodeURIComponent(requestPath).replace(/^\/+/, "");
  const filePath = path.join(baseDir, cleanPath);
  if (!filePath.startsWith(baseDir)) return null;
  return filePath;
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
}

async function readBuffer(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

function parseMultipart(req, body) {
  const contentType = req.headers["content-type"] || "";
  const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[1] || contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[2];
  if (!boundary) throw new Error("Missing multipart boundary");

  const fields = {};
  const files = [];
  const delimiter = Buffer.from(`--${boundary}`);
  let start = body.indexOf(delimiter);

  while (start !== -1) {
    start += delimiter.length;
    if (body[start] === 45 && body[start + 1] === 45) break;
    if (body[start] === 13 && body[start + 1] === 10) start += 2;

    const headerEnd = body.indexOf(Buffer.from("\r\n\r\n"), start);
    if (headerEnd === -1) break;

    const header = body.slice(start, headerEnd).toString("utf8");
    let partEnd = body.indexOf(delimiter, headerEnd + 4);
    if (partEnd === -1) break;
    if (body[partEnd - 2] === 13 && body[partEnd - 1] === 10) partEnd -= 2;

    const content = body.slice(headerEnd + 4, partEnd);
    const name = header.match(/name="([^"]+)"/)?.[1];
    const filename = header.match(/filename="([^"]*)"/)?.[1];
    const mimeType = header.match(/Content-Type:\s*([^\r\n]+)/i)?.[1] || "application/octet-stream";

    if (name && filename) {
      files.push({ name, filename, mimeType, content });
    } else if (name) {
      fields[name] = content.toString("utf8");
    }

    start = body.indexOf(delimiter, partEnd + 2);
  }

  return { fields, files };
}

function imageExtension(mimeType) {
  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/webp") return ".webp";
  return ".png";
}

function saveBase64Image(base64, mimeType = "image/png") {
  const filename = `gpt-image-2-${Date.now()}-${Math.random().toString(16).slice(2)}${imageExtension(mimeType)}`;
  const filePath = path.join(GENERATED_DIR, filename);
  fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
  return `/generated/${filename}`;
}

function normalizeImageResponse(data) {
  const images = [];
  const add = (value, mimeType = "image/png") => {
    if (!value || typeof value !== "string") return;
    if (value.startsWith("http")) images.push({ url: value, mimeType });
    else if (value.startsWith("data:")) {
      const match = value.match(/^data:([^;]+);base64,(.+)$/);
      images.push({ url: match ? saveBase64Image(match[2], match[1]) : value, mimeType: match?.[1] || mimeType });
    }
    else images.push({ url: saveBase64Image(value, mimeType), mimeType });
  };

  for (const item of data?.data || []) add(item.b64_json || item.url, item.mime_type || "image/png");
  for (const item of data?.images || []) add(typeof item === "string" ? item : item.url || item.b64_json, item.mime_type || "image/png");
  for (const url of data?.image_urls || []) add(url);

  return { ok: images.length > 0, images, raw: data };
}

function authHeaders(apiKey, json = true) {
  const headers = { Authorization: `Bearer ${apiKey}` };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

function assertApiKey(apiKey) {
  if (!apiKey) throw new Error("请先填写 API Key");
}

async function handleTextToImage(req, res) {
  try {
    const payload = await readJson(req);
    assertApiKey(payload.apiKey);

    const response = await fetch("https://yunwu.ai/v1/images/generations", {
      method: "POST",
      headers: authHeaders(payload.apiKey),
      body: JSON.stringify({
        model: "gpt-image-2",
        prompt: payload.prompt,
        n: Number(payload.n || 1),
        quality: payload.quality || "auto",
        aspect_ratio: payload.aspect_ratio || "1:1",
        background: payload.background || "auto",
        moderation: "auto",
      }),
    });
    const data = await response.json();
    send(res, response.ok ? 200 : response.status, JSON.stringify(normalizeImageResponse(data)), "application/json; charset=utf-8");
  } catch (error) {
    send(res, 400, JSON.stringify({ ok: false, error: error.message }), "application/json; charset=utf-8");
  }
}

async function handleImageToImage(req, res) {
  try {
    const body = await readBuffer(req);
    const { fields, files } = parseMultipart(req, body);
    assertApiKey(fields.apiKey);
    if (!files.length) throw new Error("图生图需要至少上传一张参考图");

    const form = new FormData();
    form.append("model", "gpt-image-2");
    form.append("prompt", fields.prompt || "");
    form.append("n", String(Number(fields.n || 1)));
    form.append("quality", fields.quality || "auto");
    form.append("aspect_ratio", fields.aspect_ratio || "1:1");
    form.append("background", fields.background || "auto");
    form.append("moderation", "auto");

    files.forEach((file) => {
      form.append("image", new Blob([file.content], { type: file.mimeType }), file.filename || "image.png");
    });

    const response = await fetch("https://yunwu.ai/v1/images/edits", {
      method: "POST",
      headers: authHeaders(fields.apiKey, false),
      body: form,
    });
    const data = await response.json();
    send(res, response.ok ? 200 : response.status, JSON.stringify(normalizeImageResponse(data)), "application/json; charset=utf-8");
  } catch (error) {
    send(res, 400, JSON.stringify({ ok: false, error: error.message }), "application/json; charset=utf-8");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "POST" && url.pathname === "/api/image/text-to-image") {
    await handleTextToImage(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/image/image-to-image") {
    await handleImageToImage(req, res);
    return;
  }

  if (url.pathname.startsWith("/source-images/")) {
    const filePath = safeFile(SOURCE_IMAGES, url.pathname.replace("/source-images/", ""));
    if (!filePath || !fs.existsSync(filePath)) return sendPlaceholderImage(res);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const requestPath = url.pathname === "/" ? "index.html" : url.pathname;
  const filePath = safeFile(PUBLIC_DIR, requestPath);
  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    send(res, 404, "Not found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Image Prompt Studio running at http://localhost:${PORT}`);
});
