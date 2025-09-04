// playwright-processNumbers.ts
// npm i -E playwright
import { writeFile } from 'fs/promises';
import { chromium, type Browser, type Page, type Response } from 'playwright';

/* ------------------ your existing generator ------------------ */
function mod97(num: string): number {
  let r = 0;
  for (let i = 0; i < num.length; i++) {
    r = (r * 10 + (num.charCodeAt(i) - 48)) % 97;
  }
  return r;
}

export function generateNumber(startingNums: string): string {
  let next21 = '';
  for (let i = 0; i < 24 - startingNums.length; i++) {
    next21 += Math.floor(Math.random() * 10).toString();
  }
  const first24 = startingNums + next21;
  const fixed = '2521';
  const prefix28 = first24 + fixed;
  const rP = mod97(prefix28);
  const r100 = (rP * 3) % 97;
  let x = (1 - r100) % 97;
  if (x < 0) x += 97;
  const last2 = x.toString().padStart(2, '0');
  return last2 + first24; // 26 digits
}

/* ------------------ types & options ------------------ */
export type HandleDataArgs<T = unknown> = {
  numStr: string;
  apiUrl: string;
  response: Response;
  data: T;
};

export type ProcessNumbersOptions = {
  handleData?: (args: HandleDataArgs) => void | Promise<void>;
  handleNotFound?: (numStr: string, apiUrl: string) => void | Promise<void>;
  perRequestDelayMs?: number;
  requestTimeoutMs?: number;
  maxPrefixes?: number;
  headless?: boolean;
  maxConcurrency?: number;
  outputPath?: string;
};

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

async function waitForApiResponse(page: Page, timeoutMs: number): Promise<Response> {
  const targetPart = `/api/general/accountBank/number/`;
  return await page.waitForResponse(r => r.url().includes(targetPart), { timeout: timeoutMs });
}

/* ------------------ main driver ------------------ */
export async function processNumbersWithPlaywright(options: ProcessNumbersOptions): Promise<void> {
  const {
    handleData,
    handleNotFound = async (numStr: string, apiUrl: string) => {
      console.warn(`  Code ${numStr}: -        [404]`);
    },
    perRequestDelayMs = 0,
    requestTimeoutMs = 15_000,
    maxPrefixes = 9999,
    headless = true,
    maxConcurrency = 10,
    outputPath = 'results.json',
  } = options;

  const concurrency = Math.max(1, Math.floor(maxConcurrency));
  let browser: Browser | null = null;
  const contextViewport = { width: 1280, height: 800 };

  const start = 1010;
  const endExclusive = Math.min(9999, Math.max(0, maxPrefixes));
  let nextIndex = start;

  // results map: numStr -> bankName
  const results = new Map<string, string>();

  const getNext = () => {
    if (nextIndex >= endExclusive) return null;
    const n = nextIndex;
    nextIndex += 1;
    return n;
  };

  try {
    browser = await chromium.launch({ headless });
    const context = await browser.newContext({ viewport: contextViewport });

    const workers = Array.from({ length: concurrency }, async (_, idx) => {
      const page = await context.newPage();
      await page.goto('' /* //! API ADDRESS HERE! */, {
        waitUntil: 'networkidle',
        timeout: 60_000,
      });

      // Handle consent banner
      try {
        const consentBtn = page.locator('button:has-text("Akceptuję i przechodzę do serwisu")');
        if (
          await consentBtn
            .first()
            .isVisible({ timeout: 5000 })
            .catch(() => false)
        ) {
          await consentBtn.first().click();
          await page.waitForTimeout(200);
        }
      } catch (err) {
        console.log(`[worker ${idx}] Consent handling error:`, err);
      }

      await page.waitForSelector('#iban', { timeout: 30_000 });

      while (true) {
        const i = getNext();
        if (i === null) break;

        const numStr = i.toString().padEnd(4, '0');
        const generated = generateNumber(numStr);

        await page.click('#iban', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('#iban', generated, { delay: 10 });
        await page.waitForTimeout(500);
        await page.click('#whatBankSubmit');

        let response: Response | null = null;
        try {
          response = await waitForApiResponse(page, requestTimeoutMs);
        } catch {
          console.error(`[worker ${idx}] Timeout for ${numStr} (${generated}).`);
        }

        if (response) {
          const apiUrl = response.url();
          const status = response.status();

          if (status === 200) {
            let data: any;
            try {
              const ct = response.headers()['content-type'] || '';
              data = ct.includes('application/json') ? await response.json() : await response.text();
            } catch {
              try {
                data = await response.text();
              } catch {
                data = null;
              }
            }

            const bankName = (data as any)?.bankName ?? '';
            results.set(numStr, bankName);

            if (handleData) {
              await handleData({ numStr, apiUrl, response, data });
            } else {
              console.log(`  Code ${numStr}: ${bankName}`);
            }
          } else if (status === 404) {
            await handleNotFound(numStr, apiUrl);
            results.set(numStr, '-');
          } else {
            console.warn(`  Code ${numStr}: -        [${status}]`);
          }
        }

        if (perRequestDelayMs > 0) {
          await sleep(perRequestDelayMs);
        }
      }

      await page.close();
    });

    await Promise.all(workers);

    // Save results as JSON file
    const obj: Record<string, string> = {};
    for (const [k, v] of results.entries()) obj[k] = v;
    await writeFile(outputPath, JSON.stringify(obj, null, 2), 'utf8');
    console.log(`Saved ${results.size} results to ${outputPath}.`);

    await context.close();
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/* ===========================
   Example usage
   =========================== */
if (require.main === module) {
  processNumbersWithPlaywright({
    perRequestDelayMs: 100,
    requestTimeoutMs: 30_000,
    headless: true,
    maxConcurrency: 15,
    outputPath: 'results.json',
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
