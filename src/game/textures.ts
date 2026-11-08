import * as THREE from 'three';

/**
 * Procedural texture generator for Cyber Angel FPS
 * 100% canvas-generated, zero 404 dependencies.
 */

/**
 * Realistic Human Face Texture (Female & Male)
 * Generates natural skin tone gradients, realistic eyes with pupils and highlights,
 * sculpted lips, fine eyebrows, eyelashes, and subtle cyber-tactical decals.
 */
export function createHumanFaceTexture(gender: 'female' | 'male'): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // 1. Natural Base Skin Tone (Warm fair skin with soft shading)
  const baseSkin = gender === 'female' ? '#fbe4d8' : '#eecdbb';
  const shadowSkin = gender === 'female' ? '#e8c2b0' : '#d4aa95';
  const blushSkin = gender === 'female' ? '#f4a59a' : '#d89b88';

  // Base fill
  ctx.fillStyle = baseSkin;
  ctx.fillRect(0, 0, size, size);

  // Soft facial depth gradient (shading around forehead, temples, jaw)
  const radGrad = ctx.createRadialGradient(size * 0.5, size * 0.45, 80, size * 0.5, size * 0.5, size * 0.45);
  radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
  radGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
  radGrad.addColorStop(1, shadowSkin);
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, size, size);

  // Cheeks soft blush
  const drawCheek = (cx: number, cy: number) => {
    const cheekGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 60);
    cheekGrad.addColorStop(0, gender === 'female' ? 'rgba(244, 114, 138, 0.35)' : 'rgba(220, 100, 80, 0.15)');
    cheekGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cheekGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCheek(size * 0.28, size * 0.55);
  drawCheek(size * 0.72, size * 0.55);

  // 2. Realistic Eyes
  const drawEye = (cx: number, cy: number, isLeft: boolean) => {
    // Sclera (Eye white with soft ambient shadow)
    ctx.save();
    ctx.beginPath();
    const eyeW = gender === 'female' ? 44 : 40;
    const eyeH = gender === 'female' ? 24 : 18;
    ctx.ellipse(cx, cy, eyeW, eyeH, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.clip();

    // Iris (Striking anime/cyber shooter colored eyes: cyan/sapphire for female, steel blue for male)
    const irisR = gender === 'female' ? 18 : 15;
    const irisGrad = ctx.createRadialGradient(cx, cy, 3, cx, cy, irisR);
    if (gender === 'female') {
      irisGrad.addColorStop(0, '#38bdf8');
      irisGrad.addColorStop(0.7, '#0284c7');
      irisGrad.addColorStop(1, '#082f49');
    } else {
      irisGrad.addColorStop(0, '#60a5fa');
      irisGrad.addColorStop(0.7, '#2563eb');
      irisGrad.addColorStop(1, '#1e1b4b');
    }
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, irisR, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(cx, cy, irisR * 0.45, 0, Math.PI * 2);
    ctx.fill();

    // Specular Catchlights (Gives life to the eyes!)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - 5, cy - 5, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 4, cy + 3, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Eyelid line & Eyelashes
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = gender === 'female' ? 3.5 : 2.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, eyeW, eyeH, 0, Math.PI * 0.95, Math.PI * 2.05);
    ctx.stroke();

    // Winged eyeliner for female operative
    if (gender === 'female') {
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      const wingTipX = isLeft ? cx - eyeW - 6 : cx + eyeW + 6;
      ctx.moveTo(isLeft ? cx - eyeW : cx + eyeW, cy - 2);
      ctx.lineTo(wingTipX, cy - 7);
      ctx.lineTo(isLeft ? cx - eyeW + 8 : cx + eyeW - 8, cy);
      ctx.fill();
    }
  };

  drawEye(size * 0.32, size * 0.42, true);
  drawEye(size * 0.68, size * 0.42, false);

  // 3. Eyebrows (Detailed fine strokes)
  const drawEyebrow = (startX: number, endX: number, cy: number, archY: number) => {
    ctx.strokeStyle = gender === 'female' ? '#451a03' : '#1c1917';
    ctx.lineWidth = gender === 'female' ? 3.5 : 5.0;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, cy);
    ctx.quadraticCurveTo((startX + endX) / 2, archY, endX, cy + 3);
    ctx.stroke();
  };
  drawEyebrow(size * 0.22, size * 0.42, size * 0.34, size * 0.31);
  drawEyebrow(size * 0.78, size * 0.58, size * 0.34, size * 0.31);

  // 4. Nose Bridge & Nostril shading
  const nx = size * 0.5;
  const ny = size * 0.58;
  ctx.strokeStyle = shadowSkin;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(nx - 4, size * 0.45);
  ctx.lineTo(nx - 5, ny - 4);
  ctx.lineTo(nx, ny);
  ctx.stroke();

  // Subtle nostril dots
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(nx - 7, ny + 2, 2.5, 0, Math.PI * 2);
  ctx.arc(nx + 7, ny + 2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 5. Lips
  const lx = size * 0.5;
  const ly = size * 0.74;
  const lipW = gender === 'female' ? 36 : 38;
  const lipH = gender === 'female' ? 14 : 10;

  // Upper lip
  ctx.fillStyle = gender === 'female' ? '#f43f5e' : '#be7362';
  ctx.beginPath();
  ctx.moveTo(lx - lipW, ly);
  ctx.quadraticCurveTo(lx - lipW * 0.5, ly - lipH * 0.7, lx - 4, ly - lipH * 0.5);
  ctx.lineTo(lx, ly - lipH * 0.2);
  ctx.lineTo(lx + 4, ly - lipH * 0.5);
  ctx.quadraticCurveTo(lx + lipW * 0.5, ly - lipH * 0.7, lx + lipW, ly);
  ctx.quadraticCurveTo(lx, ly + 2, lx - lipW, ly);
  ctx.fill();

  // Lower lip
  ctx.fillStyle = gender === 'female' ? '#fb7185' : '#a35749';
  ctx.beginPath();
  ctx.moveTo(lx - lipW, ly);
  ctx.quadraticCurveTo(lx, ly + lipH, lx + lipW, ly);
  ctx.quadraticCurveTo(lx, ly + 2, lx - lipW, ly);
  ctx.fill();

  // Lip gloss highlight
  if (gender === 'female') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.ellipse(lx, ly + 4, 8, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Subtle Cyber Decal (Bullet Angel aesthetic mark on cheek)
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('ANGEL // 07', size * 0.7, size * 0.65);
  ctx.fillRect(size * 0.68, size * 0.63, 3, 3);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Hair Texture with Anisotropic Highlight
 */
export function createHairTexture(colorHex: string = '#1e1b4b'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 256, 256);

  // Hair strands
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 256;
    ctx.fillRect(x, 0, 1.5, 256);
  }

  // Specular sheen ring across hair
  const grad = ctx.createLinearGradient(0, 80, 0, 160);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 80, 256, 80);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Realistic Tactical Uniform / Bodysuit Texture
 */
export function createTacticalUniformTexture(
  primaryColor: string = '#0f172a',
  accentColor: string = '#0284c7',
  pattern: 'camo' | 'carbon' = 'carbon'
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, size, size);

  // Carbon weave grid
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  const step = 8;
  for (let x = 0; x < size; x += step) {
    for (let y = 0; y < size; y += step) {
      if ((x / step + y / step) % 2 === 0) {
        ctx.fillRect(x, y, step, step);
      }
    }
  }

  // Tactical accent stripe
  ctx.fillStyle = accentColor;
  ctx.fillRect(size * 0.45, 0, 16, size);
  ctx.fillRect(0, size * 0.45, size, 16);

  // Buckle / Kevlar border
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, size - 32, size - 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCyberGridTexture(maxAnisotropy: number = 4): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0b1120';
  ctx.fillRect(0, 0, size, size);

  // Brushed steel micro-streaks
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let i = 0; i < 400; i++) {
    ctx.fillRect(Math.random() * size, Math.random() * size, 4 + Math.random() * 20, 1);
  }

  const step = size / 16;
  ctx.strokeStyle = '#020617';
  ctx.lineWidth = 3;
  for (let i = 0; i <= size; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= size; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  // Major accent neon grid
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
  ctx.lineWidth = 3;
  const majorStep = size / 4;
  for (let i = 0; i <= size; i += majorStep) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  ctx.fillStyle = '#06b6d4';
  for (let x = 0; x <= size; x += majorStep) {
    for (let y = 0; y <= size; y += majorStep) {
      ctx.fillRect(x - 5, y - 5, 10, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 2, y - 2, 4, 4);
      ctx.fillStyle = '#06b6d4';
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createWallTileTexture(maxAnisotropy: number = 4): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = '#020617';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, size - 10, size - 10);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, size - 24, size - 24);

  ctx.fillStyle = '#334155';
  const margin = 28;
  [margin, size - margin].forEach((x) => {
    [margin, size - margin].forEach((y) => {
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(x - 2, y - 2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#334155';
    });
  });

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(size * 0.15, size * 0.5);
  ctx.lineTo(size * 0.45, size * 0.5);
  ctx.lineTo(size * 0.58, size * 0.3);
  ctx.lineTo(size * 0.85, size * 0.3);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(size * 0.85, size * 0.3, 6, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createShippingContainerTexture(
  baseColor: string = '#0284c7',
  darkColor: string = '#0369a1',
  stencilText: string = 'CA-LOGISTICS // SECTOR 9',
  maxAnisotropy: number = 4
): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);

  const ribWidth = 32;
  for (let x = 0; x < width; x += ribWidth) {
    ctx.fillStyle = darkColor;
    ctx.fillRect(x, 0, ribWidth * 0.4, height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(x, 0, 4, height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.fillRect(x + ribWidth * 0.4, 0, 6, height);
  }

  ctx.fillStyle = '#0f172a';
  const frameThick = 24;
  ctx.fillRect(0, 0, width, frameThick);
  ctx.fillRect(0, height - frameThick, width, frameThick);
  ctx.fillRect(0, 0, frameThick, height);
  ctx.fillRect(width - frameThick, 0, frameThick, height);

  ctx.fillRect(width / 2 - 8, 0, 16, height);

  const stripeW = 20;
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#0f172a';
    ctx.beginPath();
    ctx.moveTo(frameThick + i * stripeW, height - frameThick);
    ctx.lineTo(frameThick + (i + 1) * stripeW + 15, height - frameThick);
    ctx.lineTo(frameThick + (i + 1) * stripeW - 5, height);
    ctx.lineTo(frameThick + i * stripeW - 20, height);
    ctx.fill();
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px monospace';
  ctx.fillText(stencilText, 48, 80);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = '18px monospace';
  ctx.fillText('ISO 668 1AA // MAX GROSS: 32,500 KG / 71,650 LBS', 48, 120);
  ctx.fillText('TARE WT: 3,800 KG / 8,380 LBS', 48, 145);
  ctx.fillText('NET / PAYLOAD: 28,700 KG', 48, 170);
  ctx.fillText('CUBE: 76.4 CU.M / 2,700 CU.FT', 48, 195);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(width - 240, 50, 180, 150);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('CYBER ANGEL', width - 225, 95);
  ctx.font = 'bold 16px monospace';
  ctx.fillText('TACTICAL ASSET', width - 220, 125);
  ctx.fillText('SECTOR-09', width - 205, 155);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createCrateTexture(maxAnisotropy: number = 4): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(16, 16, size - 32, size - 32);

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(20, 20, size - 40, 24);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('VALKYRIE SUPPLY', 26, 38);

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(20, 50);
  ctx.lineTo(size - 20, size - 20);
  ctx.moveTo(size - 20, 50);
  ctx.lineTo(20, size - 20);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createTargetTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;

  const rings = [
    { r: 110, color: '#ffffff' },
    { r: 85, color: '#0ea5e9' },
    { r: 60, color: '#ef4444' },
    { r: 35, color: '#f59e0b' },
    { r: 15, color: '#e11d48' },
  ];

  rings.forEach((ring) => {
    ctx.beginPath();
    ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
    ctx.fillStyle = ring.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
  });

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 110);
  ctx.lineTo(cx, cy + 110);
  ctx.moveTo(cx - 110, cy);
  ctx.lineTo(cx + 110, cy);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Realistic Desert Sand & Dunes Texture
 */
export function createDesertSandTexture(maxAnisotropy: number = 4): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base warm desert sand
  ctx.fillStyle = '#d97706';
  ctx.fillRect(0, 0, size, size);

  // Gradient ripple bands
  for (let y = 0; y < size; y += 32) {
    const sandGrad = ctx.createLinearGradient(0, y, 0, y + 32);
    sandGrad.addColorStop(0, '#f59e0b');
    sandGrad.addColorStop(0.5, '#d97706');
    sandGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = sandGrad;
    ctx.fillRect(0, y, size, 32);
  }

  // Wind-blown sand grain noise
  ctx.fillStyle = 'rgba(254, 243, 199, 0.25)';
  for (let i = 0; i < 3000; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    ctx.fillRect(rx, ry, 2, 1);
  }

  // Stone pebbles
  ctx.fillStyle = '#78350f';
  for (let i = 0; i < 60; i++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    ctx.beginPath();
    ctx.arc(px, py, 2 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

/**
 * Realistic Frozen Arctic Snow & Ice Texture
 */
export function createIceSnowTexture(maxAnisotropy: number = 4): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Crisp Arctic blue base
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(0, 0, size, size);

  // Deep ice cracks and crystal facets
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    let cx = Math.random() * size;
    let cy = Math.random() * size;
    ctx.moveTo(cx, cy);
    for (let j = 0; j < 4; j++) {
      cx += (Math.random() - 0.5) * 80;
      cy += (Math.random() - 0.5) * 80;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  // Glacial frost sparkles
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 2000; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    ctx.fillRect(rx, ry, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

/**
 * Tactical House / Building Wall Texture
 */
export function createTacticalBuildingTexture(
  style: 'cyber' | 'desert' | 'arctic',
  maxAnisotropy: number = 4
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  if (style === 'desert') {
    // Adobe sandstone brick
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    const rowH = 64;
    const blockW = 128;
    for (let y = 0; y < size; y += rowH) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();

      const offset = (y / rowH) % 2 === 0 ? 0 : blockW / 2;
      for (let x = offset; x < size; x += blockW) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + rowH);
        ctx.stroke();
      }
    }

    // Weathering stains
    ctx.fillStyle = 'rgba(180, 83, 9, 0.2)';
    ctx.fillRect(0, size - 40, size, 40);
  } else if (style === 'arctic') {
    // Insulated Arctic research facility panels
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, size - 16, size - 16);
    ctx.strokeRect(16, 16, size - 32, size - 32);

    // Hazard stripes at bottom
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(16, size - 48, size - 32, 32);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('ARCTIC POST // SUB-ZERO 04', 32, size - 26);
  } else {
    // Cyber City modular tactical panel
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, size - 24, size - 24);

    // Cyan glowing seam line
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(12, size * 0.5);
    ctx.lineTo(size - 12, size * 0.5);
    ctx.stroke();

    // Stencil text
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('SECTOR 7 // TACTICAL DEPOT', 32, 45);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

/**
 * Custom Face Texture by Character ID:
 * - Eva (เอวา): Cyber Valkyrie, high pony, cyan eyes
 * - Kevin (เควิน): Combat juggernaut, steel jaw, tactical crew cut
 * - Kelly (เคลลี่): Fast runner, golden eyes, headband, sporty cheek mark
 * - Hayato (ฮายาโตะ): Samurai ronin, fierce gaze, battle scar, dark topknot
 */
export function createOperativeFaceTexture(characterId: string): THREE.CanvasTexture {
  if (characterId === 'kelly') {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Sun-kissed athletic skin
    ctx.fillStyle = '#fae0cf';
    ctx.fillRect(0, 0, size, size);

    // Yellow athletic headband across forehead
    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, size * 0.2, size, 48);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, size * 0.2 + 40, size, 8);

    // Amber golden athletic eyes
    const drawKellyEye = (cx: number, cy: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, 40, 22, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.clip();

      const irisGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 16);
      irisGrad.addColorStop(0, '#fbbf24');
      irisGrad.addColorStop(0.7, '#d97706');
      irisGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - 4, cy - 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawKellyEye(size * 0.32, size * 0.44);
    drawKellyEye(size * 0.68, size * 0.44);

    // Athletic bandaid on left cheek
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(size * 0.24, size * 0.58, 40, 14);

    // Lips
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(size * 0.5, size * 0.74, 18, 0, Math.PI);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  if (characterId === 'hayato') {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Chiseled warrior skin
    ctx.fillStyle = '#e8c4ad';
    ctx.fillRect(0, 0, size, size);

    // Samurai forehead headband
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, size * 0.22, size, 40);

    // Fierce dark eyes
    const drawHayatoEye = (cx: number, cy: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, 42, 18, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
      ctx.clip();

      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - 3, cy - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawHayatoEye(size * 0.32, size * 0.44);
    drawHayatoEye(size * 0.68, size * 0.44);

    // Battle scar across right cheek
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(size * 0.62, size * 0.48);
    ctx.lineTo(size * 0.76, size * 0.66);
    ctx.stroke();

    // Determined lips
    ctx.fillStyle = '#9f1239';
    ctx.fillRect(size * 0.42, size * 0.74, size * 0.16, 8);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // Fallback to Eva / Kevin
  return createHumanFaceTexture(characterId === 'eva' ? 'female' : 'male');
}
