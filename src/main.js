import { chapters, journeys, getNode, newGame, resolveChoice } from "./story.js";
import { paintScene, preloadScene } from "./scenes.js";
import { toggleMusic, playNote } from "./sound.js";
import { mountActors, formForChapter } from "./actors.js";

const app = document.querySelector("#app");
let state = newGame();
let animation;
let actorEngine;
let collected = 0;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

document.querySelector("#sound-toggle").addEventListener("click", async () => {
  const enabled = await toggleMusic();
  document
    .querySelector("#sound-toggle")
    .setAttribute("aria-pressed", String(enabled));
  document
    .querySelector("#sound-toggle")
    .setAttribute("aria-label", enabled ? "关闭音乐" : "打开音乐");
  document.querySelector("#sound-label").textContent = enabled
    ? "音乐开"
    : "音乐关";
});

function setScreen(markup) {
  cancelAnimationFrame(animation);
  actorEngine?.destroy();
  const previousScene = app.querySelector("#scene, #final-scene, #title-scene");
  app.innerHTML = markup;
  const nextScene = app.querySelector("#scene, #final-scene, #title-scene");
  if (previousScene && nextScene)
    nextScene.getContext("2d").drawImage(previousScene, 0, 0, nextScene.width, nextScene.height);
  window.scrollTo({ top: 0, behavior: "instant" });
  const heading = app.querySelector("h1, h2");
  heading?.focus({ preventScroll: true });
  actorEngine = mountActors(app.querySelector("section"));
}

function home() {
  setScreen(`<section class="title-screen">
    <div class="scene-world"><canvas class="cover" id="title-scene" width="1536" height="864" role="img" aria-label="杏树下的草原大院，秋月的地球online漫游的冒险从这里开始。"></canvas><div class="title-shade"></div>${characters(false, "birthday")}</div>
    <div class="intro-copy">
      <p class="edition"><span class="tiny-square"></span> 生日特别篇 · 2026</p>
      <p class="english-title">QIUYUE’S EARTH ONLINE</p>
      <h1 tabindex="-1" aria-label="秋月的地球online漫游">秋月的<span>地球<em>online</em></span><span>漫游</span></h1>
      <p class="intro-text">一个很有想法的人类，<br>和她不太按套路的人生。</p>
      <button class="primary start-button" id="start"><span class="start-cursor" aria-hidden="true">▶</span> 开始我的人生奇遇 <span class="keycap" aria-hidden="true">ENTER</span></button>
      <p class="play-hint">5—7 分钟的小冒险 · 鼠标或键盘游玩<br>点点秋月打个招呼，点空地带她走一走。</p>
    </div>
    <div class="title-world-label"><span class="world-dot"></span> 世界已就绪 <span>01 → 31 岁</span></div>
    <p class="fiction-note">改编自真实回忆，其余纯属秋月发挥。</p>
  </section>`);
  document.querySelector("#start").addEventListener("click", () => {
    state = newGame();
    render();
  });
  const canvas = document.querySelector("#title-scene");
  preloadScene("village").then(() => {
    if (!canvas.isConnected) return;
    const start = performance.now();
    function draw(now) {
      paintScene(canvas, "village", reducedMotion.matches ? 0 : (now - start) / 1000);
      if (!reducedMotion.matches) animation = requestAnimationFrame(draw);
    }
    draw(start);
  });
}

function characters(together = false, form = "birthday", greeting = "") {
  const actor = (id, actorForm, name) => `<button class="scene-character actor ${id}" data-actor="${id}" data-form="${actorForm}" data-greeting="${id === "qiuyue" ? greeting : ""}" aria-label="和${name}打招呼" type="button"><canvas class="actor-canvas" width="192" height="208" aria-hidden="true"></canvas><span class="actor-speech" role="status" hidden></span></button>`;
  return `<div class="scene-characters ${together ? "together" : "solo"}">${actor("qiuyue", form, "秋月")}${together ? actor("yinhang", "yinhang", "尹航") : ""}</div>`;
}

function frame(node, content, actions = "", choices = "") {
  const together = node.chapter === 5 || node.chapter === 7 || (node.chapter === 4 && (state.result || state.node === "firstdate"));
  const form = node.form || formForChapter(node.chapter);
  const journey = journeys[state.career];
  const greeting = node.chapter > 0 && node.chapter < 7 ? journey?.greeting : "";
  return `<section class="game-screen ${choices ? "with-choices" : ""} ${node.game ? "mini-game" : ""}" data-node="${state.result ? "result" : state.node}" data-scene="${node.scene}" data-chapter="${node.chapter}" data-career="${state.career || ""}">
    <div class="scene-world"><canvas id="scene" width="1536" height="864" role="img" aria-label="${node.place}的像素游戏场景"></canvas><div class="scene-vignette"></div>${characters(together, form, greeting)}</div>
    <div class="journey-header"><div class="chapter-meta"><span class="chapter-number">CH. ${String(node.chapter + 1).padStart(2, "0")} <span>/ 08</span></span><span class="chapter-name">${chapters[node.chapter]}</span></div><button class="bag-button" id="bag" aria-label="打开回忆口袋，已有${state.items.length}件纪念物"><span aria-hidden="true">▣</span> 回忆口袋 <b>${state.items.length}</b></button></div>
    <div class="journey-track" aria-label="旅程进度，第${node.chapter + 1}章，共8章">${chapters.map((_, i) => `<span class="${i <= node.chapter ? "visited" : ""} ${i === node.chapter ? "current" : ""}"></span>`).join("")}</div>
    <div class="location-hud"><span class="scene-location"><span aria-hidden="true">✦</span> ${node.place}</span><span class="age-badge">${node.age}<small> 岁</small></span>${journey ? `<span class="route-badge">${journey.label}</span>` : ""}</div>
    <p class="movement-hint">点空地走一走 · 点角色打招呼</p><div id="game-targets"></div>
    ${choices ? `<aside class="choice-area" aria-label="选择接下来的故事"><p class="choice-prompt"><span>你的直觉是？</span><small>按 1 / 2 / 3 选择</small></p>${choices}</aside>` : ""}
    <div class="story-panel ${actions ? "has-actions" : ""}">
      <div class="dialogue-portrait"><img src="./assets/actors/${form}/idle/00.png" alt="" /><span>秋月</span></div>
      <div class="dialogue-copy">${content}<p class="dialogue-hint">${choices ? "凭直觉选就好，没有标准答案。" : node.game ? "点小物件，秋月会走过去收集；也可以直接继续故事。" : '<span class="keycap">SPACE</span> / <span class="keycap">ENTER</span> 继续故事'}</p></div>
      ${actions ? `<div class="dialogue-actions">${actions}</div>` : ""}
    </div>
  </section><dialog id="bag-dialog" aria-labelledby="bag-title"><div class="dialog-top"><h2 id="bag-title">回忆口袋</h2><button class="text-button" id="close-bag">关闭 ×</button></div><p>一路带回来的，都是属于你的宝贝。</p><ul class="bag-list">${state.items.length ? state.items.map((item) => `<li><span aria-hidden="true">✦</span>${item}</li>`).join("") : "<li>口袋还是空的。出发后就会慢慢装满啦。</li>"}</ul><p class="dialog-keyhint">ESC 关闭 · B 打开口袋</p></dialog>`;
}

async function setupFrame(node) {
  const canvas = document.querySelector("#scene");
  const start = performance.now();
  function draw(now) {
    paintScene(
      canvas,
      node.scene,
      reducedMotion.matches ? 0 : (now - start) / 1000,
      { career: state.career, lit: collected > 0 && node.game === "candle" },
    );
    if (!reducedMotion.matches) animation = requestAnimationFrame(draw);
  }
  const dialog = document.querySelector("#bag-dialog");
  document
    .querySelector("#bag")
    .addEventListener("click", () => dialog.showModal());
  document
    .querySelector("#close-bag")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  await preloadScene(node.scene);
  if (!canvas.isConnected) return;
  draw(start);
}

function render() {
  if (state.node === "ending" && !state.result) return ending();
  const node = state.result || getNode(state);
  collected = 0;
  if (state.result) {
    setScreen(frame(node,
      `<p class="eyebrow">${state.career === "astronaut" ? "宇宙" : "人生"}轨迹已更新</p><h2 tabindex="-1">${node.title}</h2><p class="story-text">${node.text}</p>`,
      `<div class="reward"><span aria-hidden="true">✦</span><div><small>获得纪念物</small><strong>${node.item}</strong></div></div><button class="primary" id="continue">然后呢？ <span aria-hidden="true">→</span></button>`,
    ));
    setupFrame(node);
    document.querySelector("#continue").addEventListener("click", () => {
      state.result = null;
      render();
    });
    return;
  }
  const choices = node.choices
    ? `<div class="choices">${node.choices.map((choice, index) => `<button class="choice" data-choice="${index}"><span class="choice-letter">${index + 1}</span><span><strong>${choice.label}</strong><small>${choice.detail}</small></span><span class="choice-arrow" aria-hidden="true">▸</span></button>`).join("")}</div>`
    : "";
  const actions = node.choices ? "" : node.game
    ? `<div class="mini-status" aria-live="polite"><span id="mini-label">${node.game === "candle" ? "轻触烛光，许个愿吧" : "点一点画面里的小物件"}</span><b id="mini-count">0 / ${node.game === "candle" ? 1 : 3}</b></div><button class="primary" id="game-next" hidden>装进口袋，继续走 <span aria-hidden="true">→</span></button><button class="text-button skip" id="skip">${node.game === "candle" ? "许好愿了，读一封信 →" : "帮我收好，继续故事 →"}</button>`
    : `<button class="primary" id="continue">${node.button} <span aria-hidden="true">→</span></button>`;
  setScreen(frame(node,
    `<p class="eyebrow">${node.kicker || "沿途的小小片段"}</p><h2 tabindex="-1">${node.title}</h2><p class="story-text">${node.text}</p>`,
    actions, choices,
  ));
  setupFrame(node);
  document.querySelectorAll("[data-choice]").forEach((button) =>
    button.addEventListener("click", () => {
      playNote(587.33);
      state = resolveChoice(state, node, Number(button.dataset.choice));
      render();
    }),
  );
  document.querySelector("#continue")?.addEventListener("click", () => {
    state.node = node.next;
    render();
  });
  if (node.game) setupMini(node);
}

function setupMini(node) {
  const targetCount = node.game === "candle" ? 1 : 3;
  const type = node.game;
  const labels = {
    apricot: "杏子",
    slingshot: "气球",
    shells: "贝壳",
    candle: "生日蜡烛",
  };
  const coords = {
    apricot: [
      [11, 12],
      [27, 9],
      [7, 24],
    ],
    slingshot: [
      [22, 30],
      [49, 25],
      [76, 35],
    ],
    shells: [
      [23, 78],
      [47, 85],
      [74, 76],
    ],
    candle: [[51, 67]],
  }[type];
  const layer = document.querySelector("#game-targets");
  layer.className = `targets-${type}`;
  const cake = type === "candle" ? '<div class="mini-cake" aria-hidden="true" style="left:51%;top:67%"><i></i><i></i><i></i></div>' : "";
  layer.innerHTML = cake + coords
    .map(
      ([x, y], i) =>
        `<button class="target target-${type} target-${i}" ${type === "candle" ? "" : `style="left:${x}%;top:${y}%"`} aria-label="${type === "candle" ? "轻触生日烛光许愿" : `收集第${i + 1}个${labels[type]}`}" data-target="${i}"><span class="target-art" aria-hidden="true"></span></button>`,
    )
    .join("");
  const advance = () => {
    const gifts = {
      apricot: "杏树下的夏天",
      slingshot: "生日快乐小弹弓",
      shells: "阿那亚的海风",
      candle: "今天许下的愿望",
    };
    state.items.push(gifts[type]);
    state.node = node.next;
    render();
  };
  layer.querySelectorAll("button").forEach((button) =>
    button.addEventListener("click", () => {
      button.disabled = true;
      button.classList.add("pending");
      actorEngine.collect(button, () => {
        button.classList.remove("pending");
        button.classList.add("collected");
        collected++;
        playNote([523.25, 659.25, 783.99][(collected - 1) % 3]);
        document.querySelector("#mini-count").textContent =
          `${collected} / ${targetCount}`;
        if (reducedMotion.matches)
          paintScene(document.querySelector("#scene"), node.scene, 0, {
            career: state.career,
            lit: type === "candle",
        });
      if (collected === targetCount) {
        document.querySelector("#mini-label").textContent =
          type === "candle"
            ? "愿你的每一天，都有小小的光。"
            : "收集完成！快乐已经装好啦。";
        const next = document.querySelector("#game-next");
        next.hidden = false;
        if (type === "candle")
          next.innerHTML =
            '有一封信，想给你读 <span aria-hidden="true">→</span>';
        document.querySelector("#skip").hidden = true;
        next.focus({ preventScroll: true });
      }
      });
    }),
  );
  document.querySelector("#game-next").addEventListener("click", advance);
  document.querySelector("#skip").addEventListener("click", advance);
}

async function ending() {
  const { role, label } = journeys[state.career];
  const project = state.choices.find((choice) => choice.chapter === 2);
  const turning = state.choices.find((choice) => choice.chapter === 3);
  const meet = state.choices.find((choice) => choice.chapter === 4).item;
  setScreen(
    `<section class="ending-screen" data-node="ending" data-career="${state.career}"><div class="ending-stamp">HAPPY BIRTHDAY · 2026.09.25</div><div class="ending-art scene-world"><canvas id="final-scene" width="1536" height="864" role="img" aria-label="哈尔滨的圆月下，秋月和尹航围着水果蛋糕一起过生日"></canvas><div class="scene-vignette"></div>${characters(true)}</div><div class="ending-scene-caption"><span>TO BE CONTINUED</span><strong>下一站，和你一起。</strong></div><div class="letter" tabindex="0" aria-label="尹航写给秋月的生日信"><p class="eyebrow">农历八月十五 · 哈尔滨 · ${label}</p><h1 tabindex="-1">秋月，<br><span>生日快乐。</span></h1><p class="letter-dear">亲爱的秋月：</p><p>刚才这一路，你是${role}。你带着「${state.items[0]}」出发，又把「${meet}」放进了口袋。</p><p>你选择了「${project.label}」，后来又带着「${turning.item}」继续出发。这些有点离谱、又很像你的决定，把我们带到了同一个月亮下面。</p><p>人生可以有好多种走法。我想，无论你去了哪里，冒出了多么奇妙的点子，我都会很想认识那个爱笑、聪明，又说干就干的你。</p><p>现实里的你，已经走过一条很了不起的路。从通辽的小村庄，到兰州、北京，再到成都。你靠自己，一步一步，走到了这里。</p><p>我喜欢你的奇思妙想，也喜欢你认真把它们变成现实的样子。喜欢和你一起做饭、学习，喜欢看你照顾花草，喜欢听你笑着说——</p><blockquote>“太逗儿啦。”</blockquote><p>从前的那些年，我听你慢慢讲。往后的日子，我们一起过。</p><p>今天，你从成都来，我从北京来。我们在哈尔滨碰头，一起看看这座城，好好吃顿饭，过一个属于你的生日。</p><p class="letter-wish">愿你继续做很有想法的秋月。<br>做喜欢的事，挣喜欢的钱，<br>成为你想成为的人，<br>也永远有快乐生活的底气。</p><p>31 岁生日快乐。以后每一岁，<br>我都想陪你一起过。</p><p class="signature">爱你的，尹航 <span aria-hidden="true">♥</span></p><div class="ending-inventory"><p class="eyebrow">这趟旅程的纪念物</p><div>${state.items.map((item) => `<span>${item}</span>`).join("")}</div></div><button class="primary" id="replay">再走一条离谱的人生路线 <span aria-hidden="true">↗</span></button><p class="ending-footnote">故事还会继续。下一站，和你一起。</p></div></section>`,
  );
  const start = performance.now();
  function draw(now) {
    paintScene(
      document.querySelector("#final-scene"),
      "birthday",
      reducedMotion.matches ? 0 : (now - start) / 1000,
      { lit: true },
    );
    if (!reducedMotion.matches) animation = requestAnimationFrame(draw);
  }
  document.querySelector("#replay").addEventListener("click", () => {
    state = newGame();
    home();
  });
  const canvas = document.querySelector("#final-scene");
  await preloadScene("birthday");
  if (!canvas.isConnected) return;
  draw(start);
}

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
  if (document.querySelector("dialog[open]")) return;
  if (event.key.toLowerCase() === "b") {
    document.querySelector("#bag")?.click();
    return;
  }
  if (/^[1-3]$/.test(event.key)) {
    const choice = document.querySelector(`[data-choice="${Number(event.key) - 1}"]`);
    if (choice) {
      event.preventDefault();
      choice.click();
    }
    return;
  }
  if (event.key !== "Enter" && event.code !== "Space") return;
  if (event.target.closest("button, a, input, textarea, select, .letter")) return;
  const next = document.querySelector("#start, #continue, #game-next:not([hidden])");
  if (next) {
    event.preventDefault();
    next.click();
  }
});

home();
