const counts = { idle: 6, 'running-right': 8, waving: 4 };
const rows = { idle: 0, 'running-right': 1, waving: 2 };
const forms = ['childhood', 'school', 'university', 'beijing', 'meeting', 'together', 'chengdu', 'birthday'];
const sheets = new Map();
const greetings = {
  childhood: '这个院子我罩了！', school: '我又有一个好点子！',
  university: '五鼠科研队，集合！', beijing: '快乐生活就很好。',
  meeting: '太逗儿啦！', together: '今天也要一起开心！',
  chengdu: '等等，这里有个商机！', birthday: '今天，我最大！', yinhang: '秋月，我在呢。',
};
export const formForChapter = (chapter) => forms[chapter];

function loadForm(form) {
  if (!sheets.has(form)) {
    const image = new Image();
    image.src = new URL(`../assets/actors/${form}/spritesheet.png`, import.meta.url).href;
    sheets.set(form, image.decode().then(() => image));
  }
  return sheets.get(form);
}

// One engine belongs to one screen; navigation cancels its collection queue and RAF.
export function mountActors(screen) {
  const world = screen.querySelector('.scene-world');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new AbortController();
  const queue = [];
  let destroyed = false;
  let animation;
  let lastTime = performance.now();
  let activeCollection = null;
  const actors = [...screen.querySelectorAll('[data-actor]')].map((element) => {
    const box = element.getBoundingClientRect();
    const worldBox = world.getBoundingClientRect();
    const actor = {
      element, canvas: element.querySelector('canvas'), bubble: element.querySelector('.actor-speech'),
      x: (box.left + box.width / 2 - worldBox.left) / worldBox.width,
      destination: null, frames: null, state: 'idle', elapsed: 0, waveUntil: 0,
      speechUntil: 0, lastFrame: '', onArrival: null, onWaveEnd: null,
    };
    element.style.left = `${actor.x * 100}%`;
    Object.assign(element.dataset, { animation: 'idle', moving: 'false', ready: 'false' });
    loadForm(element.dataset.form).then((frames) => {
      if (destroyed) return;
      actor.frames = frames;
      element.dataset.ready = 'true';
      if (element.dataset.actor === 'qiuyue') nextCollection();
    });
    element.addEventListener('click', (event) => {
      event.stopPropagation();
      if (actor === heroine && activeCollection) return;
      actor.destination = null;
      actor.onArrival = null;
      wave(actor, element.dataset.greeting || greetings[element.dataset.form]);
    }, { signal: listeners.signal });
    return actor;
  });
  const heroine = actors.find((actor) => actor.element.dataset.actor === 'qiuyue');

  function setState(actor, state) {
    if (actor.state === state) return;
    actor.state = state;
    actor.elapsed = 0;
    actor.element.dataset.animation = state;
    actor.element.dataset.moving = String(state === 'running-right');
  }
  function wave(actor, words, complete) {
    setState(actor, 'waving');
    actor.waveUntil = performance.now() + (reduced.matches ? 180 : 650);
    actor.onWaveEnd = complete || null;
    if (words) {
      actor.bubble.textContent = words;
      actor.bubble.hidden = false;
      actor.speechUntil = performance.now() + 2300;
    }
  }
  function walk(actor, clientX, arrived) {
    const bounds = world.getBoundingClientRect();
    const margin = actor.element.getBoundingClientRect().width * 0.28;
    const x = Math.max(margin, Math.min(bounds.width - margin, clientX - bounds.left));
    actor.destination = x / bounds.width;
    actor.onArrival = arrived || null;
    actor.onWaveEnd = null;
    actor.element.dataset.facing = actor.destination < actor.x ? 'left' : 'right';
    actor.bubble.hidden = true;
    setState(actor, 'running-right');
  }
  function nextCollection() {
    if (activeCollection || queue.length === 0 || !heroine.frames) return;
    activeCollection = queue.shift();
    const box = activeCollection.target.getBoundingClientRect();
    walk(heroine, box.left + box.width / 2, () => {
      wave(heroine, null, () => {
        activeCollection.complete();
        activeCollection = null;
        nextCollection();
      });
    });
  }
  world.addEventListener('click', (event) => {
    if (event.target.closest('button, a') || activeCollection || !heroine.frames) return;
    walk(heroine, event.clientX);
  }, { signal: listeners.signal });

  function tick(now) {
    const delta = Math.min(now - lastTime, 64);
    lastTime = now;
    for (const actor of actors) {
      actor.elapsed += delta;
      if (actor.destination !== null) {
        const difference = actor.destination - actor.x;
        const step = reduced.matches ? Math.abs(difference) : delta / 1000 * 320 / world.clientWidth;
        if (Math.abs(difference) <= step) {
          actor.x = actor.destination;
          actor.destination = null;
          setState(actor, 'idle');
          const arrived = actor.onArrival;
          actor.onArrival = null;
          arrived?.();
        } else actor.x += Math.sign(difference) * step;
        actor.element.style.left = `${actor.x * 100}%`;
      }
      if (actor.state === 'waving' && now >= actor.waveUntil) {
        setState(actor, 'idle');
        const complete = actor.onWaveEnd;
        actor.onWaveEnd = null;
        complete?.();
      }
      if (now >= actor.speechUntil) actor.bubble.hidden = true;
      if (actor.frames) {
        const index = reduced.matches ? (actor.state === 'waving' ? 2 : 0)
          : actor.state === 'waving' ? Math.min(Math.floor(actor.elapsed / 120), 3)
            : Math.floor(actor.elapsed / (actor.state === 'idle' ? 240 : 85)) % counts[actor.state];
        const key = `${actor.state}/${index}`;
        if (key !== actor.lastFrame) {
          const ctx = actor.canvas.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          ctx.clearRect(0, 0, 192, 208);
          ctx.drawImage(actor.frames, index * 192, rows[actor.state] * 208, 192, 208, 0, 0, 192, 208);
          actor.element.dataset.frame = String(index);
          actor.lastFrame = key;
        }
      }
    }
    if (!destroyed) animation = requestAnimationFrame(tick);
  }
  animation = requestAnimationFrame(tick);
  return {
    collect(target, complete) {
      queue.push({ target, complete });
      nextCollection();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(animation);
      listeners.abort();
      queue.length = 0;
      activeCollection = null;
    },
  };
}
