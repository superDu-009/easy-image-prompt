const fs = require("fs");
const path = require("path");

const promptsPath = path.join(__dirname, "..", "public", "prompts.json");
const prompts = JSON.parse(fs.readFileSync(promptsPath, "utf8"));
const verbose = process.argv.includes("--verbose");

const issues = [];
const required = ["id", "title_cn", "title_en", "category_key", "tags_key", "prompt_cn", "prompt_en"];

function hasCjk(value) {
  return /[\u4e00-\u9fff]/.test(value || "");
}

function argumentTokens(value) {
  return Array.from(String(value || "").matchAll(/\{argument name="([^"]+)" default="([^"]*)"\}/g)).map((match) => match[0]).sort();
}

for (const item of prompts) {
  for (const key of required) {
    if (key === "tags_key") {
      if (!Array.isArray(item.tags_key) || !item.tags_key.length) issues.push(`#${item.id} missing ${key}`);
      continue;
    }
    if (!item[key]) issues.push(`#${item.id} missing ${key}`);
  }

  if (item.title_cn && !hasCjk(item.title_cn)) issues.push(`#${item.id} title_cn has no Chinese characters: ${item.title_cn}`);
  if (item.title_en && hasCjk(item.title_en)) issues.push(`#${item.id} title_en still contains Chinese: ${item.title_en}`);

  const cnTokens = argumentTokens(item.prompt_cn);
  const enTokens = argumentTokens(item.prompt_en);
  if (item.prompt_cn && item.prompt_en && cnTokens.join("\n") !== enTokens.join("\n")) {
    issues.push(`#${item.id} prompt variable tokens differ between cn/en`);
  }
}

const summary = {
  total: prompts.length,
  missing_prompt_cn_count: prompts.filter((item) => !item.prompt_cn).length,
  missing_prompt_en_count: prompts.filter((item) => !item.prompt_en).length,
  title_cn_without_chinese_count: prompts.filter((item) => item.title_cn && !hasCjk(item.title_cn)).length,
  title_en_with_chinese_count: prompts.filter((item) => item.title_en && hasCjk(item.title_en)).length,
  issue_count: issues.length,
};

if (verbose) {
  summary.missing_prompt_cn = prompts.filter((item) => !item.prompt_cn).map((item) => ({ id: item.id, title: item.title_cn || item.title }));
  summary.missing_prompt_en = prompts.filter((item) => !item.prompt_en).map((item) => ({ id: item.id, title: item.title_en || item.title }));
  summary.title_cn_without_chinese = prompts.filter((item) => item.title_cn && !hasCjk(item.title_cn)).map((item) => ({ id: item.id, title: item.title_cn }));
  summary.title_en_with_chinese = prompts.filter((item) => item.title_en && hasCjk(item.title_en)).map((item) => ({ id: item.id, title: item.title_en }));
  summary.issues = issues;
} else {
  summary.sample_issues = issues.slice(0, 20);
}

console.log(JSON.stringify(summary, null, 2));

if (issues.length) {
  process.exitCode = 1;
}
