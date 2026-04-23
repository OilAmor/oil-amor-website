/**
 * Label Generation API — Enhanced v2
 * 
 * Generates beautiful, print-ready bottle labels with:
 * - Oil-specific safety warnings from the Oil Amor Safety Database
 * - Real QR codes for batch tracking
 * - Per-oil ml measurements with percentages
 * - Professional Oil Amor branding
 * - Crystal pairing display
 * - Carrier oil dilution info
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import { getOilSafetyProfile } from '@/lib/safety/database';
import type { OilSafetyProfile } from '@/lib/safety/types';

export const dynamic = 'force-dynamic';

// ============================================================================
// TYPES
// ============================================================================

export interface LabelOil {
  name: string;
  percentage: number;
  ml: number;
  oilId?: string; // For safety database lookup
}

export interface LabelData {
  blendName: string;
  oils: LabelOil[];
  carrierOil?: string;
  carrierPercentage?: number;
  size: number;
  batchId: string;
  madeDate: string;
  expiryDate: string;
  warnings: string[];
  crystal?: string;
  intendedUse?: string;
  // Toggleable elements
  showIngredients?: boolean;
  showExpiry?: boolean;
  showWarnings?: boolean;
  showQRCode?: boolean;
  showBatchId?: boolean;
  showMadeDate?: boolean;
  showCrystal?: boolean;
  showSafetyIcons?: boolean;
  // QR target
  qrUrl?: string;
}

// ============================================================================
// SAFETY WARNING EXTRACTION
// ============================================================================

interface ExtractedWarning {
  text: string;
  severity: 'critical' | 'warning' | 'caution' | 'info';
  icon: string;
  category: string;
}

function extractOilWarnings(oils: LabelOil[]): ExtractedWarning[] {
  const warnings: ExtractedWarning[] = [];
  const seen = new Set<string>();

  for (const oil of oils) {
    if (!oil.oilId) continue;
    const profile = getOilSafetyProfile(oil.oilId);
    if (!profile) continue;

    // Photosensitivity
    if (profile.photosensitivity.isPhotosensitive) {
      const key = `photosensitive-${oil.oilId}`;
      if (!seen.has(key)) {
        seen.add(key);
        warnings.push({
          text: `${profile.commonName}: Avoid sun for ${profile.photosensitivity.safeAfterHours || 12}+ hrs after application`,
          severity: 'warning',
          icon: '☀️',
          category: 'photosensitivity',
        });
      }
    }

    // Skin sensitization
    if (profile.skinSensitization.isSensitizer && profile.skinSensitization.riskLevel !== 'low') {
      const key = `sensitizer-${oil.oilId}`;
      if (!seen.has(key)) {
        seen.add(key);
        warnings.push({
          text: `${profile.commonName}: May cause skin sensitization (risk: ${profile.skinSensitization.riskLevel})`,
          severity: profile.skinSensitization.riskLevel === 'high' ? 'critical' : 'warning',
          icon: '⚠️',
          category: 'skin',
        });
      }
    }

    // Pregnancy
    if (profile.pregnancySafety === 'avoid') {
      const key = `pregnancy-${oil.oilId}`;
      if (!seen.has(key)) {
        seen.add(key);
        warnings.push({
          text: `${profile.commonName}: Avoid during pregnancy`,
          severity: 'critical',
          icon: '🤰',
          category: 'pregnancy',
        });
      }
    } else if (profile.pregnancySafety === 'caution') {
      const key = `pregnancy-caution-${oil.oilId}`;
      if (!seen.has(key)) {
        seen.add(key);
        warnings.push({
          text: `${profile.commonName}: Use with caution during pregnancy`,
          severity: 'caution',
          icon: '🤰',
          category: 'pregnancy',
        });
      }
    }

    // Toxicity
    if (profile.toxicity.level !== 'none' && profile.toxicity.level !== 'low') {
      const key = `toxicity-${oil.oilId}`;
      if (!seen.has(key)) {
        seen.add(key);
        const routes: string[] = [];
        if (profile.toxicity.oral) routes.push('oral');
        if (profile.toxicity.dermal) routes.push('dermal');
        if (profile.toxicity.inhalation) routes.push('inhalation');
        warnings.push({
          text: `${profile.commonName}: Toxic via ${routes.join('/')}`,
          severity: profile.toxicity.level === 'extreme' ? 'critical' : 'warning',
          icon: '☠️',
          category: 'toxicity',
        });
      }
    }

    // Contraindications
    for (const c of profile.contraindications) {
      const key = `contra-${c.type}-${oil.oilId}`;
      if (!seen.has(key)) {
        seen.add(key);
        warnings.push({
          text: `${profile.commonName}: ${c.description}`,
          severity: c.severity === 'critical' || c.severity === 'avoid' ? 'critical' : 'warning',
          icon: '🚫',
          category: 'contraindication',
        });
      }
    }

    // Drug interactions
    for (const di of profile.drugInteractions) {
      const key = `drug-${di.drugClass}-${oil.oilId}`;
      if (!seen.has(key)) {
        seen.add(key);
        warnings.push({
          text: `${profile.commonName}: Interacts with ${di.drugClass} — ${di.description}`,
          severity: di.severity === 'critical' ? 'critical' : di.severity === 'warning' ? 'warning' : 'caution',
          icon: '💊',
          category: 'drug-interaction',
        });
      }
    }
  }

  // Sort by severity
  const severityOrder = { critical: 0, warning: 1, caution: 2, info: 3 };
  warnings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return warnings;
}

function getSeverityColor(severity: ExtractedWarning['severity']): string {
  switch (severity) {
    case 'critical': return '#dc2626'; // red-600
    case 'warning': return '#d97706'; // amber-600
    case 'caution': return '#ca8a04'; // yellow-600
    case 'info': return '#2563eb'; // blue-600
  }
}

function getSeverityBg(severity: ExtractedWarning['severity']): string {
  switch (severity) {
    case 'critical': return '#fef2f2'; // red-50
    case 'warning': return '#fffbeb'; // amber-50
    case 'caution': return '#fefce8'; // yellow-50
    case 'info': return '#eff6ff'; // blue-50
  }
}

// ============================================================================
// QR CODE
// ============================================================================

function generateQrCodeUrl(data: string): string {
  // Use QRServer API for reliable QR generation
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=2&data=${encoded}`;
}

// ============================================================================
// HTML GENERATION
// ============================================================================

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateLabelHtml(data: LabelData): string {
  const {
    showIngredients = true,
    showExpiry = true,
    showWarnings = true,
    showQRCode = true,
    showBatchId = true,
    showMadeDate = true,
    showCrystal = true,
    showSafetyIcons = true,
  } = data;

  const extractedWarnings = extractOilWarnings(data.oils);
  const allWarnings = [...extractedWarnings];
  
  // Add user-provided warnings
  for (const w of data.warnings) {
    if (!allWarnings.some(ew => ew.text === w)) {
      allWarnings.push({
        text: w,
        severity: 'warning',
        icon: '⚠️',
        category: 'general',
      });
    }
  }

  // Default warnings if none found
  if (allWarnings.length === 0) {
    allWarnings.push(
      { text: 'External use only', severity: 'info', icon: '📌', category: 'general' },
      { text: 'Do not ingest', severity: 'info', icon: '📌', category: 'general' },
      { text: 'Keep away from children', severity: 'info', icon: '📌', category: 'general' },
      { text: 'Perform patch test before use', severity: 'caution', icon: '🔬', category: 'general' },
    );
  }

  // Build ingredient rows with ml and %
  const ingredientRows = data.oils.map(o => `
    <tr>
      <td class="oil-name">${escapeHtml(o.name)}</td>
      <td class="oil-ml">${o.ml.toFixed(1)}ml</td>
      <td class="oil-pct">${o.percentage}%</td>
    </tr>
  `).join('');

  // Carrier oil row
  const carrierRow = data.carrierOil ? `
    <tr class="carrier-row">
      <td class="oil-name">${escapeHtml(data.carrierOil)} (carrier)</td>
      <td class="oil-ml">—</td>
      <td class="oil-pct">${data.carrierPercentage || 0}%</td>
    </tr>
  ` : '';

  // QR code
  const qrUrl = data.qrUrl || `https://oilamor.com/batch/${encodeURIComponent(data.batchId)}`;
  const qrCodeUrl = generateQrCodeUrl(qrUrl);

  // Crystal display
  const crystalHtml = showCrystal && data.crystal ? `
    <div class="crystal-section">
      <span class="crystal-icon">💎</span>
      <span class="crystal-name">${escapeHtml(data.crystal)}</span>
    </div>
  ` : '';

  // Intended use
  const useHtml = data.intendedUse ? `
    <div class="intended-use">${escapeHtml(data.intendedUse)}</div>
  ` : '';

  // Warning badges
  const warningBadges = allWarnings.slice(0, 4).map(w => `
    <div class="warning-badge" style="background:${getSeverityBg(w.severity)};color:${getSeverityColor(w.severity)};">
      <span class="warning-icon">${w.icon}</span>
      <span class="warning-text">${escapeHtml(w.text)}</span>
    </div>
  `).join('');

  // Count additional warnings
  const moreWarnings = allWarnings.length > 4 ? `
    <div class="more-warnings">+${allWarnings.length - 4} more warnings — scan QR for full safety info</div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Oil Amor — ${escapeHtml(data.blendName)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      width: 70mm;
      min-height: 120mm;
      padding: 5mm 4mm;
      font-family: 'Inter', 'Helvetica Neue', sans-serif;
      background: #fff;
      color: #1a1a1a;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    /* Brand Header */
    .brand-header {
      text-align: center;
      border-bottom: 1.5px solid #c9a227;
      padding-bottom: 2.5mm;
      margin-bottom: 2.5mm;
    }
    .brand-logo {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 9pt;
      font-weight: 700;
      letter-spacing: 0.25em;
      color: #c9a227;
      text-transform: uppercase;
    }
    .brand-tagline {
      font-size: 5pt;
      color: #a69b8a;
      letter-spacing: 0.1em;
      margin-top: 0.5mm;
    }
    
    /* Blend Info */
    .blend-info {
      text-align: center;
      margin-bottom: 2mm;
    }
    .blend-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 13pt;
      font-weight: 700;
      color: #0a080c;
      line-height: 1.2;
    }
    .blend-type {
      font-size: 6.5pt;
      color: #666;
      font-style: italic;
      margin-top: 0.5mm;
    }
    .intended-use {
      display: inline-block;
      font-size: 5.5pt;
      color: #c9a227;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 1mm;
      padding: 0.5mm 2mm;
      border: 0.5px solid #c9a227;
      border-radius: 1mm;
    }
    
    /* Crystal */
    .crystal-section {
      text-align: center;
      margin: 1.5mm 0;
    }
    .crystal-icon { font-size: 8pt; }
    .crystal-name {
      font-size: 6.5pt;
      color: #6b5b4e;
      font-style: italic;
    }
    
    /* Ingredients Table */
    .ingredients-table {
      width: 100%;
      border-collapse: collapse;
      margin: 2mm 0;
      font-size: 6.5pt;
    }
    .ingredients-table thead th {
      text-align: left;
      font-weight: 600;
      font-size: 5.5pt;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 1mm 1mm 1mm 0;
      border-bottom: 0.5px solid #ddd;
    }
    .ingredients-table thead th:last-child { text-align: right; }
    .ingredients-table thead th:nth-child(2) { text-align: right; }
    .ingredients-table tbody td {
      padding: 0.8mm 1mm 0.8mm 0;
      border-bottom: 0.3px solid #f0f0f0;
      vertical-align: top;
    }
    .ingredients-table tbody td:last-child { text-align: right; }
    .ingredients-table tbody td:nth-child(2) { text-align: right; font-variant-numeric: tabular-nums; }
    .oil-name { color: #1a1a1a; font-weight: 500; }
    .oil-ml { color: #555; font-size: 6pt; }
    .oil-pct { color: #c9a227; font-weight: 600; font-size: 6.5pt; }
    .carrier-row .oil-name { color: #666; font-style: italic; }
    .carrier-row .oil-pct { color: #888; }
    
    /* Total row */
    .total-row td {
      border-top: 0.8px solid #c9a227;
      border-bottom: none;
      padding-top: 1mm;
      font-weight: 600;
      color: #0a080c;
    }
    
    /* Details Grid */
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5mm;
      margin: 2mm 0;
      padding: 2mm;
      background: #faf9f7;
      border-radius: 1.5mm;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
    }
    .detail-label {
      font-size: 5pt;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .detail-value {
      font-size: 6.5pt;
      font-weight: 600;
      color: #0a080c;
      font-variant-numeric: tabular-nums;
    }
    
    /* Warnings */
    .warnings-section {
      margin: 2mm 0;
    }
    .warning-badge {
      display: flex;
      align-items: flex-start;
      gap: 1mm;
      padding: 1mm 1.5mm;
      border-radius: 1mm;
      margin-bottom: 1mm;
      font-size: 5.5pt;
      line-height: 1.35;
    }
    .warning-icon { flex-shrink: 0; font-size: 6pt; margin-top: 0.2mm; }
    .warning-text { flex: 1; }
    .more-warnings {
      font-size: 5pt;
      color: #999;
      text-align: center;
      font-style: italic;
      margin-top: 0.5mm;
    }
    
    /* QR Section */
    .qr-section {
      display: flex;
      align-items: center;
      gap: 2mm;
      margin-top: 2mm;
      padding-top: 2mm;
      border-top: 0.5px solid #eee;
    }
    .qr-image {
      width: 16mm;
      height: 16mm;
      flex-shrink: 0;
    }
    .qr-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .qr-info {
      flex: 1;
    }
    .batch-id {
      font-family: 'Cormorant Garamond', serif;
      font-size: 7pt;
      font-weight: 600;
      color: #0a080c;
      letter-spacing: 0.03em;
    }
    .batch-label {
      font-size: 5pt;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .qr-hint {
      font-size: 4.5pt;
      color: #bbb;
      margin-top: 0.5mm;
    }
    
    /* Footer */
    .label-footer {
      margin-top: 1.5mm;
      text-align: center;
      font-size: 4.5pt;
      color: #bbb;
      letter-spacing: 0.05em;
    }
    
    @media print {
      body { width: 70mm; min-height: 120mm; margin: 0; padding: 5mm 4mm; }
      @page { size: 70mm 120mm; margin: 0; }
    }
  </style>
</head>
<body>
  <!-- Brand Header -->
  <div class="brand-header">
    <div class="brand-logo">Oil Amor</div>
    <div class="brand-tagline">Handcrafted Essential Oils</div>
  </div>
  
  <!-- Blend Info -->
  <div class="blend-info">
    <div class="blend-name">${escapeHtml(data.blendName)}</div>
    <div class="blend-type">${data.carrierOil ? `${escapeHtml(data.carrierOil)} Carrier Dilution` : 'Pure Essential Oil Blend'} • ${data.size}ml</div>
    ${useHtml}
  </div>
  
  ${crystalHtml}
  
  <!-- Ingredients -->
  ${showIngredients ? `
  <table class="ingredients-table">
    <thead>
      <tr>
        <th>Ingredient</th>
        <th>Amount</th>
        <th>%</th>
      </tr>
    </thead>
    <tbody>
      ${ingredientRows}
      ${carrierRow}
      <tr class="total-row">
        <td>Total</td>
        <td>${data.size}ml</td>
        <td>100%</td>
      </tr>
    </tbody>
  </table>
  ` : ''}
  
  <!-- Details -->
  <div class="details-grid">
    ${showBatchId ? `
    <div class="detail-item">
      <span class="detail-label">Batch</span>
      <span class="detail-value">${escapeHtml(data.batchId)}</span>
    </div>
    ` : ''}
    ${showMadeDate ? `
    <div class="detail-item">
      <span class="detail-label">Made</span>
      <span class="detail-value">${escapeHtml(data.madeDate)}</span>
    </div>
    ` : ''}
    ${showExpiry ? `
    <div class="detail-item">
      <span class="detail-label">Expires</span>
      <span class="detail-value">${escapeHtml(data.expiryDate)}</span>
    </div>
    ` : ''}
    <div class="detail-item">
      <span class="detail-label">Type</span>
      <span class="detail-value">${data.carrierOil ? 'Diluted' : 'Pure'}</span>
    </div>
  </div>
  
  <!-- Warnings -->
  ${showWarnings ? `
  <div class="warnings-section">
    ${warningBadges}
    ${moreWarnings}
  </div>
  ` : ''}
  
  <!-- QR Code -->
  ${showQRCode ? `
  <div class="qr-section">
    <div class="qr-image">
      <img src="${qrCodeUrl}" alt="Batch QR Code" onerror="this.style.display='none'">
    </div>
    <div class="qr-info">
      <div class="batch-label">Batch Number</div>
      <div class="batch-id">${escapeHtml(data.batchId)}</div>
      <div class="qr-hint">Scan for safety info &amp; reorder</div>
    </div>
  </div>
  ` : ''}
  
  <div class="label-footer">
    Hand-blended with intention • oilamor.com
  </div>
</body>
</html>`;
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const data: LabelData = await request.json();
    
    // Validate required fields
    if (!data.blendName || !data.oils?.length || !data.batchId) {
      return NextResponse.json(
        { error: 'Missing required fields: blendName, oils, batchId' },
        { status: 400 }
      );
    }

    const labelHtml = generateLabelHtml(data);

    return NextResponse.json({
      success: true,
      html: labelHtml,
      printDimensions: {
        width: '70mm',
        height: '120mm',
      },
      warningsGenerated: extractOilWarnings(data.oils).length,
    });
  } catch (error) {
    console.error('Label generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate label', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
