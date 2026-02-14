/**
 * Sends Allure report summary to Telegram with a donut chart.
 * Usage: node scripts/send-allure-to-telegram.js [path-to-summary.json]
 * Config: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID env vars, or notifications/telegram.json
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SUMMARY_PATH = resolve(ROOT, process.argv[2] || 'allure-report/summary.json');
const TELEGRAM_CONFIG_PATH = join(ROOT, 'notifications/telegram.json');

const CHART_COLORS = {
  passed: '#22c55e',
  failed: '#ef4444',
  broken: '#eab308',
  skipped: '#94a3b8',
  unknown: '#a855f7',
};

function loadSummary(path) {
  if (!existsSync(path)) {
    throw new Error(`Summary file not found: ${path}`);
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}

function loadTelegramConfig() {
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    return {
      token: process.env.TELEGRAM_BOT_TOKEN,
      chat: process.env.TELEGRAM_CHAT_ID,
      base: {},
    };
  }
  if (existsSync(TELEGRAM_CONFIG_PATH)) {
    const config = JSON.parse(readFileSync(TELEGRAM_CONFIG_PATH, 'utf8'));
    const tg = config?.telegram;
    const base = config?.base ?? {};
    if (tg?.token && tg?.chat) {
      return { token: tg.token, chat: tg.chat, base };
    }
  }
  throw new Error(
    'Telegram config missing. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID, or use notifications/telegram.json with telegram.token and telegram.chat'
  );
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

function buildChartUrl(stats) {
  const { passed, failed, broken, skipped, unknown } = stats;
  const data = [passed, failed, broken, skipped, unknown];
  const labels = ['passed', 'failed', 'broken', 'skipped', 'unknown'];
  const colors = labels.map((k) => CHART_COLORS[k]);

  const chartConfig = {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: '65%',
      layout: { padding: 16 },
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 12,
            font: { size: 13 },
            generateLabels: (chart) => {
              const dataset = chart.data.datasets[0];
              const values = dataset.data;
              return chart.data.labels.map((label, i) => ({
                text: `${values[i]} ${label}`,
                fillStyle: dataset.backgroundColor[i],
                hidden: false,
                index: i,
              }));
            },
          },
        },
        doughnutlabel: {
          labels: [
            { text: String(stats.total), font: { size: 28 }, color: '#1e293b' },
            { text: 'Total scenarios', font: { size: 12 }, color: '#64748b' },
          ],
        },
      },
    },
  };

  const encoded = encodeURIComponent(JSON.stringify(chartConfig));
  return `https://quickchart.io/chart?c=${encoded}&width=420&height=280`;
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
  const environment = options.environment ?? process.env.ALLURE_ENV ?? '—';
  const comment = options.comment ?? '';
  const reportLink = options.reportLink ?? 'https://asyawrr.github.io/qa-guru-hrm-automation/';

  const pct = (n) => (total > 0 ? ((n / total) * 100).toFixed(1) : '0');
  const lines = [
    `*${project}*`,
    '',
    '*Results:*',
    `Environment: ${environment}`,
  ];
  if (comment) lines.push(`Comment: ${comment}`);
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
  const { token, chat, base } = loadTelegramConfig();
  const stats = getStats(summary);

  const chartUrl = buildChartUrl(stats);
  const caption = buildCaption(summary, stats, {
    project: base.project,
    environment: base.environment,
    comment: base.comment,
    reportLink: base.reportLink,
  });

  await sendPhotoToTelegram(token, chat, chartUrl, caption);
  console.log('Sent Allure summary with chart to Telegram.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
