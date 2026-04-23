/**
 * Label Generation API
 * Generates print-ready bottle labels as HTML/PDF with toggleable elements
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export interface LabelData {
  blendName: string;
  oils: Array<{
    name: string;
    percentage: number;
    ml: number;
  }>;
  carrierOil?: string;
  carrierPercentage?: number;
  size: number;
  batchId: string;
  madeDate: string;
  expiryDate: string;
  warnings: string[];
  crystal?: string;
  // Toggleable elements
  showIngredients?: boolean;
  showExpiry?: boolean;
  showWarnings?: boolean;
  showQRCode?: boolean;
  showBatchId?: boolean;
  showMadeDate?: boolean;
  showCrystal?: boolean;
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  try {
    const data: LabelData = await request.json();
    const labelHtml = generateLabelHtml(data);

    return NextResponse.json({
      success: true,
      html: labelHtml,
      printDimensions: {
        width: '70mm',
        height: '120mm',
      },
    });
  } catch (error) {
    console.error('Label generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate label' },
      { status: 500 }
    );
  }
}

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
  } = data;

  const ingredients = data.oils.map(o => 
    `${escapeHtml(o.name)} (${o.percentage}%)`
  ).join(', ');

  const warnings = data.warnings.length > 0 
    ? data.warnings.map(w => escapeHtml(w)).join(' • ')
    : 'External use only • Do not ingest • Keep away from children';

  return `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 70mm; height: 120mm; padding: 8mm;
      font-family: 'Georgia', serif;
      background: white; color: #1a1a1a;
    }
    .brand {
      text-align: center;
      border-bottom: 2px solid #c9a227;
      padding-bottom: 3mm; margin-bottom: 3mm;
    }
    .brand-name {
      font-size: 8pt; letter-spacing: 0.2em;
      color: #c9a227; text-transform: uppercase;
    }
    .blend-name { font-size: 14pt; font-weight: bold; color: #0a080c; }
    .blend-type { font-size: 8pt; color: #666; font-style: italic; }
    .ingredients { margin: 4mm 0; font-size: 7pt; line-height: 1.4; }
    .ingredients-label { font-weight: bold; }
    .details {
      display: grid; grid-template-columns: 1fr 1fr; gap: 2mm;
      font-size: 7pt; margin: 4mm 0; padding: 3mm;
      background: #f9f9f9; border-radius: 2mm;
    }
    .detail-label { color: #666; font-size: 6pt; }
    .detail-value { font-weight: bold; color: #0a080c; }
    .warnings {
      font-size: 6pt; color: #666; margin: 3mm 0;
      padding-top: 3mm; border-top: 1px solid #ddd;
    }
    .qr-section { text-align: center; margin-top: 3mm; }
    .qr-code {
      width: 20mm; height: 20mm; background: #0a080c;
      margin: 0 auto; display: flex;
      align-items: center; justify-content: center;
      border-radius: 2mm;
    }
    .qr-code span { color: white; font-size: 6pt; }
    .reorder-text { font-size: 6pt; color: #666; margin-top: 1mm; }
    .hidden { display: none !important; }
    @media print {
      body { width: 70mm; height: 120mm; margin: 0; padding: 8mm; }
      @page { size: 70mm 120mm; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="brand">
    <div class="brand-name">Oil Amor</div>
    <div class="blend-name">${escapeHtml(data.blendName)}</div>
    <div class="blend-type">${data.carrierOil ? 'Carrier Oil Dilution' : 'Pure Essential Oil Blend'}</div>
  </div>
  
  ${showIngredients ? `
  <div class="ingredients">
    <div class="ingredients-label">Ingredients:</div>
    ${ingredients}
    ${data.carrierOil ? `<br><em>in ${escapeHtml(data.carrierOil)} (${data.carrierPercentage}%)</em>` : ''}
  </div>
  ` : ''}
  
  ${showCrystal && data.crystal ? `
  <div class="ingredients">
    <div class="ingredients-label">Crystal:</div>
    ${escapeHtml(data.crystal)}
  </div>
  ` : ''}
  
  <div class="details">
    <div><span class="detail-label">Size:</span> <span class="detail-value">${data.size}ml</span></div>
    ${showBatchId ? `<div><span class="detail-label">Batch:</span> <span class="detail-value">${escapeHtml(data.batchId)}</span></div>` : ''}
    ${showMadeDate ? `<div><span class="detail-label">Made:</span> <span class="detail-value">${escapeHtml(data.madeDate)}</span></div>` : ''}
    ${showExpiry ? `<div><span class="detail-label">Expires:</span> <span class="detail-value">${escapeHtml(data.expiryDate)}</span></div>` : ''}
  </div>
  
  ${showWarnings ? `
  <div class="warnings">${warnings}</div>
  ` : ''}
  
  ${showQRCode ? `
  <div class="qr-section">
    <div class="qr-code"><span>QR</span></div>
    <div class="reorder-text">Scan to reorder</div>
  </div>
  ` : ''}
</body>
</html>`;
}
