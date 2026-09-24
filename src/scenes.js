// Static architecture stays in the base image; only foliage, water and light blend into frame two.
const backdrops = {
  village: 'village', school: 'campus', campus: 'campus', graduation: 'campus',
  lab: 'lab', home: 'home', cake: 'home', garden: 'home', market: 'market',
  station: 'park', date: 'park', park: 'park', engagement: 'park', sea: 'sea',
  space: 'space', dream: 'space', harbin: 'harbin', birthday: 'harbin',
};
// Ellipses: center x/y and radius x/y in image coordinates. Soft edges keep the two paintings registered.
const motionAreas = {
  village: [[.22,.15,.31,.27], [.91,.72,.14,.23]],
  campus: [[.3,.12,.25,.16], [.88,.10,.18,.19], [.08,.7,.1,.24]],
  lab: [[.06,.13,.1,.2], [.45,.12,.06,.17], [.53,.06,.06,.07], [.68,.16,.06,.10], [.88,.11,.06,.13]],
  home: [[.355,.32,.09,.13], [.31,.10,.035,.2], [.62,.19,.07,.1], [.97,.7,.05,.15]],
  park: [[.13,.10,.2,.19], [.87,.13,.16,.23], [.40,.43,.19,.06]],
  sea: [[.68,.40,.30,.12], [.35,.37,.17,.04], [.87,.58,.15,.16]],
  space: [[.30,.10,.22,.13], [.72,.07,.12,.08], [.07,.27,.04,.03]],
  market: [[.3,.07,.25,.12], [.68,.40,.095,.17], [.84,.15,.15,.045]],
  harbin: [[.13,.31,.14,.18], [.94,.17,.09,.17], [.85,.52,.12,.04]],
};
const images = new Map();
const loading = new Map();

function softMotionLayer(image, name) {
  const layer = document.createElement('canvas');
  const mask = document.createElement('canvas');
  layer.width = mask.width = 1536;
  layer.height = mask.height = 864;
  const painter = layer.getContext('2d');
  painter.imageSmoothingEnabled = false;
  painter.drawImage(image, 0, 0, layer.width, layer.height);
  const brush = mask.getContext('2d');
  for (const [x, y, rx, ry] of motionAreas[name]) {
    brush.save();
    brush.translate(x * mask.width, y * mask.height);
    brush.scale(rx * mask.width, ry * mask.height);
    const edge = brush.createRadialGradient(0, 0, .45, 0, 0, 1);
    edge.addColorStop(0, '#fff');
    edge.addColorStop(1, '#ffffff00');
    brush.fillStyle = edge;
    brush.fillRect(-1, -1, 2, 2);
    brush.restore();
  }
  painter.globalCompositeOperation = 'destination-in';
  painter.drawImage(mask, 0, 0);
  return layer;
}

export function preloadScene(scene) {
  const name = backdrops[scene];
  if (!loading.has(name)) {
    const pair = ['', '-motion'].map(async (suffix) => {
      const image = new Image();
      image.src = new URL(`../assets/scenes/${name}${suffix}.webp`, import.meta.url).href;
      await image.decode();
      return image;
    });
    loading.set(name, Promise.all(pair).then(([base, motion]) => {
      images.set(name, { base, motion: softMotionLayer(motion, name) });
    }));
  }
  return loading.get(name);
}

export function paintScene(canvas, scene, seconds = 0, options = {}) {
  const image = images.get(backdrops[scene]);
  if (!image) return; // Its pending preload paints this screen as soon as decoding completes.
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = 1;
  ctx.drawImage(image.base, 0, 0, width, height);
  const phase = (1 - Math.cos(seconds * Math.PI / 2.6)) / 2;
  ctx.globalAlpha = phase * .72;
  ctx.drawImage(image.motion, 0, 0, width, height);
  ctx.globalAlpha = 1;
  canvas.dataset.backgroundFrame = phase > .5 ? '1' : '0';

  const night = ['space', 'dream', 'harbin', 'birthday'].includes(scene);
  const petals = ['park', 'date', 'engagement', 'campus', 'graduation'].includes(scene);
  const dust = ['village', 'market'].includes(scene);
  if (night || petals || dust) {
    for (let i = 0; i < 15; i++) {
      const drift = Math.floor(seconds * (petals ? 9 : 3));
      const x = (i * 137 + 57 + drift) % width;
      const y = (i * 71 + 53 + (petals ? drift : 0)) % (height * .68);
      if (seconds !== 0 && Math.sin(seconds * .8 + i) <= -.3) continue;
      ctx.globalAlpha = night ? .62 : .45;
      ctx.fillStyle = night ? '#ffe6a3' : petals ? '#f6caa9' : '#ffffc9';
      ctx.fillRect(Math.floor(x / 3) * 3, Math.floor(y / 3) * 3, 3, 3);
    }
  }
  if (scene === 'birthday' && options.lit) {
    ctx.globalAlpha = .8;
    ctx.fillStyle = '#ffeab2';
    for (let i = 0; i < 12; i++) {
      const angle = i * Math.PI / 6;
      const radius = 70 + Math.sin(seconds + i) * 12;
      const x = width * .47 + Math.cos(angle) * radius;
      const y = height * .42 + Math.sin(angle) * radius * .6;
      ctx.fillRect(Math.floor(x / 3) * 3, Math.floor(y / 3) * 3, 3, 3);
    }
  }
  ctx.globalAlpha = 1;
}
