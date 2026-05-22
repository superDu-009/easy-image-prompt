# Image Prompt Studio

A local-first web app for browsing curated image prompts and generating images with GPT Image-2 compatible APIs.

The project is intentionally simple: no database, no account system, no build step. It runs as a small Node.js static server with API proxy endpoints.

## Features

- Curated prompt gallery with 600+ prompt templates
- Chinese / English UI switch
- Category and quick-tag filtering
- Editable prompt composer
- Text-to-image and image-to-image generation
- Local API key input stored only in browser `localStorage`
- Local generation history in "My Images"
- Generated base64 images saved to `public/generated/`
- Image preview with zoom, pan, and download
- Prompt thumbnail images included in `public/source-images/`

## Quick Start

```bash
npm start
```

Then open:

```text
http://localhost:3010
```

Use another port if needed:

```bash
PORT=3011 npm start
```

## Image API

The server currently proxies GPT Image-2 compatible requests to:

- `POST https://yunwu.ai/v1/images/generations`
- `POST https://yunwu.ai/v1/images/edits`

The model is fixed to:

```text
gpt-image-2
```

API keys are entered in the web UI and stored in browser `localStorage`. They are not written to project files.

## Local Files

- `public/index.html` - page structure
- `public/style.css` - UI theme and responsive styles
- `public/app.js` - gallery, i18n, generation, preview, and history logic
- `public/prompts.json` - curated prompt data
- `public/source-images/` - bundled prompt preview images
- `public/generated/` - locally generated images, ignored by git
- `server.js` - static server and image API proxy
- `scripts/enrich-prompts-i18n.js` - enrich prompt records with i18n metadata
- `scripts/validate-content.js` - validate prompt content completeness

## Content Status

The current prompt library is usable, but the bilingual content is still being refined.

Run:

```bash
npm run validate:content
```

The validator reports remaining translation and metadata gaps.

## Notes For Open Source Use

Generated images are local artifacts and are ignored by git.

Prompt thumbnail assets are bundled in `public/source-images/`. If a referenced file is missing, the server still returns a built-in placeholder image so the app does not break.

## License

MIT
