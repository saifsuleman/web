import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';

const outputPath = path.resolve(process.cwd(), 'resume.pdf');
const format = process.env.RESUME_PAPER_SIZE === 'Letter' ? 'Letter' : 'A4';

async function resolvePort(): Promise<number> {
  const preferred = process.env.RESUME_PORT ? Number(process.env.RESUME_PORT) : null;
  if (preferred && Number.isFinite(preferred)) return preferred;

  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Failed to resolve a local port.'));
        return;
      }
      const { port } = address;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

async function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // no-op
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Preview server did not become ready in ${timeoutMs}ms`);
}

async function main(): Promise<void> {
  const port = await resolvePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const targetUrl = `${baseUrl}/resume`;

  const preview = spawn(
    'npm',
    ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port)],
    {
    stdio: 'inherit',
    shell: process.platform === 'win32'
    }
  );

  try {
    await waitForServer(targetUrl);

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      if ('fonts' in document) {
        await document.fonts.ready;
      }
    });
    await page.waitForTimeout(500);

    await page.pdf({
      path: outputPath,
      printBackground: true,
      preferCSSPageSize: true,
      format,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm'
      }
    });

    await browser.close();
    console.log(`Generated PDF at ${outputPath}`);
  } finally {
    preview.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
