import puppeteer from "puppeteer";
import { preview } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

const ROUTES = [
  "/",
  "/games",
  "/guesstheflag",
  "/guessthecountry",
  "/higherlower",
  "/worldle",
];

// Copy index.html as fallback for SPA routes before preview
function setupFallback() {
  const indexHtml = path.join(distDir, "index.html");
  for (const route of ROUTES) {
    if (route === "/") continue;
    const dir = path.join(distDir, route);
    const file = path.join(dir, "index.html");
    if (!fs.existsSync(file)) {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(indexHtml, file);
    }
  }
}

async function prerender() {
  setupFallback();

  const server = await preview({ preview: { port: 4173, open: false } });
  const address = server.resolvedUrls.local[0];

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const route of ROUTES) {
    const url = new URL(route, address).href;
    console.log(`Pre-rendering: ${route}`);

    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait for route content to render (title changes from default)
    await page.waitForFunction(
      (r) => {
        if (r === "/") return document.title === "Where in the world?" && !document.body.textContent.includes("Loading...") && !document.body.textContent.includes("404");
        return !document.body.textContent.includes("404") && !document.body.textContent.includes("Loading...");
      },
      { timeout: 15000 },
      route
    ).catch(() => console.log(`  Warning: timeout waiting for ${route}`));

    await new Promise((r) => setTimeout(r, 500));

    const html = await page.content();

    const filePath =
      route === "/"
        ? path.join(distDir, "index.html")
        : path.join(distDir, route, "index.html");

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(filePath, html);
    console.log(`  -> ${filePath}`);
  }

  await browser.close();
  server.close();
  console.log("\nPre-rendering complete!");
}

prerender().catch((err) => {
  console.error(err);
  process.exit(1);
});
