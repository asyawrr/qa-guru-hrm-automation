/**
 * Sends Allure report summary to Telegram with a donut chart.
 * Usage: node scripts/send-allure-to-telegram.js [path-to-summary.json]
 * Config: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID env vars (required).
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { buildChartUrl } from './build-chart-url.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SUMMARY_PATH = resolve(ROOT, process.argv[2] || 'allure-report/summary.json');

function loadSummary(path) {
  if (!existsSync(path)) {
    throw new Error(`Summary file not found: ${path}`);
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}

function loadTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    throw new Error('Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.');
  }
  return { token, chat };
}

function getStats(summary) {
  const stats = summary.stats ?? {};
  const total = stats.total ?? 0;
  const failed = stats.failed ?? 0;
  const broken = stats.broken ?? 0;
  const skipped = stats.skipped ?? 0;
  const unknown = stats.unknown ?? 0;
  const passed = stats.passed ?? Math.max(0, total - failed - broken - skipped - unknown);
  return { total, passed, failed, broken, skipped, unknown };
}

function formatDurationMs(ms) {
  if (ms == null || ms < 0) return '00:00:00.000';
  const totalSec = ms / 1000;
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const secInt = Math.floor(s);
  const millis = Math.round((s - secInt) * 1000);
  const secPart = `${String(secInt).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
  return [h, m, secPart].map((x) => String(x).padStart(2, '0')).join(':');
}

function buildCaption(summary, stats, options = {}) {
  const { name, duration, createdAt } = summary;
  const { total, passed, failed, broken, skipped, unknown } = stats;
  const project = options.project ?? name ?? 'Allure Report';
  const environment = 'docker';
  const reportLink = options.reportLink ?? 'https://asyawrr.github.io/qa-guru-hrm-automation/';

  const pct = (n) => (total > 0 ? ((n / total) * 100).toFixed(1) : '0');
  const lines = [
    `*${project}*`,
    '',
    '*Results:*',
    `Environment: ${environment}`,
  ];
  if (options.comment) lines.push(`Comment: ${options.comment}`);
  lines.push(
    `Duration: ${formatDurationMs(duration)}`,
    `Total scenarios: ${total}`,
    `Total passed: ${passed} (${pct(passed)} %)`,
    `Total failed: ${failed} (${pct(failed)} %)`,
    `Total broken: ${broken}`,
    `Total unknown: ${unknown}`,
    `Total skipped: ${skipped}`
  );
  lines.push(`Report: ${reportLink}`);
  if (createdAt) lines.push(`Run: ${new Date(createdAt).toISOString()}`);

  return lines.join('\n');
}

async function sendPhotoToTelegram(token, chatId, photoUrl, caption) {
  const url = `https://api.telegram.org/bot${token}/sendPhoto`;
  const body = {
    chat_id: chatId,
    photo: photoUrl,
    caption,
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram API error ${res.status}: ${err}`);
  }
  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram error: ${data.description || JSON.stringify(data)}`);
  }
}

async function main() {
  const summary = loadSummary(SUMMARY_PATH);
  const { token, chat } = loadTelegramConfig();
  const stats = getStats(summary);

  const chartUrl = buildChartUrl(stats);
  const caption = buildCaption(summary, stats, {
    project: process.env.ALLURE_PROJECT,
    environment: process.env.ALLURE_ENV,
    comment: process.env.ALLURE_COMMENT,
    reportLink: process.env.ALLURE_REPORT_LINK,
  });

  await sendPhotoToTelegram(token, chat, chartUrl, caption);
  console.log('Sent Allure summary with chart to Telegram.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
