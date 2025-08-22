import sharp from "sharp";

// Génère un path SVG pour un sparkline à partir d'un tableau de prix
function sparklinePath(values: number[], w: number, h: number, pad = 8) {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = (w - pad * 2) / Math.max(values.length - 1, 1);

  const xy = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (h - pad * 2) * (1 - (v - min) / span);
    return [x, y] as const;
  });

  const [x0, y0] = xy[0];
  const d =
    "M" +
    x0.toFixed(1) +
    " " +
    y0.toFixed(1) +
    xy.slice(1).map(([x, y]) => ` L ${x.toFixed(1)} ${y.toFixed(1)}`).join("");

  return d;
}

// Construit un SVG d'overlay (bandeau + textes + sparkline)
export function buildOverlaySVG(opts: {
  title: string;              // ex: "Coincerto"
  date: string;               // ex: "2025-08-22"
  width?: number;             // 1024 par défaut
  height?: number;            // 1024 par défaut
  fearGreed?: number;         // 0..100 (optionnel, pour un petit indicateur)
  prices?: number[];          // série pour sparkline (optionnel)
}) {
  const {
    title,
    date,
    width = 1024,
    height = 1024,
    fearGreed,
    prices = [],
  } = opts;

  // Bandeau bas
  const bandH = 92;
  const bandY = height - bandH;

  // Sparkline
  const sparkW = 240;
  const sparkH = 56;
  const sparkX = width - sparkW - 16;
  const sparkY = bandY + 18;
  const path = sparklinePath(prices, sparkW, sparkH, 6);

  // Petit badge Fear&Greed
  const fg = typeof fearGreed === "number" ? Math.max(0, Math.min(100, fearGreed)) : undefined;
  const fgColor = fg === undefined
    ? "#999"
    : fg > 60 ? "#16a34a" : fg < 40 ? "#dc2626" : "#f59e0b";

  return Buffer.from(
    `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="black" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.0"/>
    </linearGradient>
  </defs>

  <!-- bandeau dégradé en bas -->
  <rect x="0" y="${bandY}" width="${width}" height="${bandH}" fill="url(#g)"/>

  <!-- Titre -->
  <text x="24" y="${bandY + 36}" font-family="Inter, Arial, sans-serif" font-weight="700"
        font-size="28" fill="white">${escapeXml(title)}</text>

  <!-- Date -->
  <text x="24" y="${bandY + 72}" font-family="Inter, Arial, sans-serif"
        font-size="20" fill="white" opacity="0.9">${escapeXml(date)}</text>

  <!-- Sparkline (si données) -->
  ${
    prices.length
      ? `
    <g transform="translate(${sparkX}, ${sparkY})">
      <rect x="0" y="0" width="${sparkW}" height="${sparkH}" rx="8" ry="8" fill="white" fill-opacity="0.06" />
      <path d="${path}" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    </g>
  `
      : ``
  }

  <!-- Badge Fear&Greed (si fourni) -->
  ${
    fg !== undefined
      ? `
    <g transform="translate(${width - 16 - 92}, ${bandY - 12})">
      <rect x="0" y="0" width="92" height="32" rx="16" fill="${fgColor}" />
      <text x="46" y="22" font-size="16" text-anchor="middle" font-family="Inter, Arial, sans-serif" fill="white">
        FG ${fg}
      </text>
    </g>
  `
      : ``
  }
</svg>
    `.trim()
  );
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Compose l'overlay sur une image existante (Buffer OU URL)
export async function applyOverlay(options: {
  baseImage: Buffer | string; // Buffer ou URL (http/https)
  title: string;
  date: string;
  prices?: number[];
  fearGreed?: number;
  outFormat?: "png" | "jpeg"; // png par défaut
}) {
  const { baseImage, title, date, prices, fearGreed, outFormat = "png" } = options;

  // Charge l'image source et redimensionne d'abord
  const base = typeof baseImage === "string"
    ? sharp(await fetchAsBuffer(baseImage))
    : sharp(baseImage);

  // Redimensionner à 512x512 pour optimiser la taille
  const resized = base.resize(512, 512, { 
    fit: 'cover',
    position: 'center'
  });

  const overlay = buildOverlaySVG({ title, date, width: 512, height: 512, prices, fearGreed });

  const composed = resized.composite([{ input: overlay }]);
  
  return outFormat === "jpeg" 
    ? composed.jpeg({ quality: 85 }).toBuffer() 
    : composed.png({ compressionLevel: 9 }).toBuffer();
}

async function fetchAsBuffer(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to fetch image: ${r.status}`);
  const a = await r.arrayBuffer();
  return Buffer.from(a);
} 