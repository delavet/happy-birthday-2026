import { test, expect } from "@playwright/test";

async function waitForArtwork(page) {
  await expect(page.locator(".scene-character").first()).toBeVisible();
  await expect.poll(() => page.locator('[data-actor]').evaluateAll((actors) =>
    actors.every((actor) => actor.dataset.ready === 'true'),
  )).toBe(true);
  await expect
    .poll(() =>
      page.locator("img:visible").evaluateAll((images) =>
        images.every((image) => image.complete && image.naturalWidth > 0),
      ),
    )
    .toBe(true);
  const canvas = page.locator("#scene, #title-scene, #final-scene");
  if (await canvas.count()) {
    await page.evaluate(async () => {
      const scene = document.querySelector(".game-screen")?.dataset.scene ||
        (document.querySelector('.title-screen') ? 'village' : 'birthday');
      const { preloadScene } = await import(new URL("./src/scenes.js", location.href));
      await preloadScene(scene);
      await new Promise(requestAnimationFrame);
    });
    await expect.poll(() => canvas.evaluate((scene) =>
      scene.getContext("2d").getImageData(scene.width / 2, scene.height / 2, 1, 1).data[3],
    )).toBeGreaterThan(0);
  }
}

async function expectDesktopStage(page) {
  const layout = await page.evaluate(() => {
    const world = document.querySelector(".scene-world").getBoundingClientRect();
    const panel = document.querySelector(".story-panel")?.getBoundingClientRect();
    const text = document.querySelector(".dialogue-copy")?.getBoundingClientRect();
    return {
      pageFits:
        document.documentElement.scrollWidth <= innerWidth + 1 &&
        document.documentElement.scrollHeight <= innerHeight + 1,
      backgroundCovers:
        world.left <= 1 && world.top <= 1 &&
        world.right >= innerWidth - 1 && world.bottom >= innerHeight - 1,
      dialogueFits: !panel || (
        panel.left >= 0 && panel.top >= 0 &&
        panel.right <= innerWidth + 1 && panel.bottom <= innerHeight + 1
      ),
      textFits: !text || (
        text.left >= panel.left && text.top >= panel.top &&
        text.right <= panel.right && text.bottom <= panel.bottom
      ),
      controlsFit: [...document.querySelectorAll("[data-choice], #continue")]
        .every((button) => {
          const box = button.getBoundingClientRect();
          return box.left >= 0 && box.top >= 0 &&
            box.right <= innerWidth + 1 && box.bottom <= innerHeight + 1;
        }),
    };
  });
  expect(layout).toEqual({
    pageFits: true,
    backgroundCovers: true,
    dialogueFits: true,
    textFits: true,
    controlsFit: true,
  });
}

test.describe("desktop", () => {
  for (const route of [0, 1, 2]) {
    const career = ["doctor", "founder", "astronaut"][route];
    test(`complete birthday route ${route}, ${route === 1 ? "skip" : "play"} minigames`, async ({
      page,
    }, testInfo) => {
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("response", (response) => {
        if (response.status() >= 400)
          errors.push(`${response.status()} ${response.url()}`);
      });
      await page.goto("./");
      await waitForArtwork(page);
      await expect(page.locator('[data-actor="yinhang"]')).toHaveCount(0);
      await expectDesktopStage(page);
      if (route === 0)
        await page.screenshot({
          path: `output/${testInfo.project.name}-home.png`,
          animations: "disabled",
        });
      await page.getByRole("button", { name: /开始我的人生奇遇/ }).click();
      let screens = 0;
      const visited = new Set();
      while ((await page.locator('[data-node="ending"]').count()) === 0) {
        expect(screens++).toBeLessThan(55);
        await expect(page.locator("#scene")).toBeVisible();
        await waitForArtwork(page);
        await expectDesktopStage(page);
        const chapter = Number(await page.locator('.game-screen').getAttribute('data-chapter'));
        const nodeId = await page.locator('.game-screen').getAttribute('data-node');
        visited.add(nodeId);
        const careerNow = await page.locator('.game-screen').getAttribute('data-career');
        if (careerNow) {
          expect(careerNow).toBe(career);
          await expect(page.locator('.route-badge')).toHaveText(['医学人生', '草原创业人生', '星际人生'][route]);
        }
        const workForms = { doctor_work: 'university', doctor_crisis: 'beijing', founder_work: 'chengdu', founder_crisis: 'together', astronaut_work: 'together', astronaut_crisis: 'university' };
        if (workForms[nodeId]) {
          await expect(page.locator('[data-actor="qiuyue"]')).toHaveAttribute('data-form', workForms[nodeId]);
          await page.screenshot({ path: `output/${testInfo.project.name}-${nodeId}.png`, animations: 'disabled' });
        }
        if (careerNow && career !== 'doctor')
          await expect(page.locator('.story-text')).not.toContainText(/解放军医学院|认真备考|继续学医|读博|博士生|毕设/);
        if (chapter < 4) await expect(page.locator('[data-actor="yinhang"]')).toHaveCount(0);
        if (route === 0 && (screens === 1 || await page.locator('[data-node="firstdate"], [data-node="candles"]').count())) {
          const screenshot = screens === 1 ? "chapter" : await page.locator('[data-node="candles"]').count() ? "candles" : "together";
          if (screenshot === "together") {
            await expect(page.locator(".scene-character.qiuyue")).toBeVisible();
            await expect(page.locator(".scene-character.yinhang")).toBeVisible();
          }
          await page.screenshot({
            path: `output/${testInfo.project.name}-${screenshot}.png`,
            animations: "disabled",
          });
        }
        if (await page.locator("[data-choice]").count())
          await page.locator(`[data-choice="${route}"]`).click();
        else if (await page.locator("#continue").count())
          await page.locator("#continue").click();
        else if (route === 1) await page.locator("#skip").click();
        else {
          const targets = page.locator("[data-target]");
          for (let index = 0; index < (await targets.count()); index++)
            await targets.nth(index).click();
          await expect(page.locator("#game-next")).toBeVisible();
          await page.locator("#game-next").click();
        }
      }
      await waitForArtwork(page);
      await expectDesktopStage(page);
      for (const step of ['teen','work','breakthrough','crisis','turning','meeting','future','packing'])
        expect(visited.has(`${career}_${step}`)).toBe(true);
      for (const other of ['doctor','founder','astronaut'].filter(value => value !== career))
        expect([...visited].some(id => id.startsWith(`${other}_`))).toBe(false);
      await expect(page.locator('.ending-screen')).toHaveAttribute('data-career', career);
      await expect(page.locator(".letter")).toContainText("生日快乐");
      await expect(page.locator(".letter")).toContainText("爱你的，尹航");
      await expect(page.locator(".letter")).toContainText(
        ["守护快乐的医生", "草原动物联邦的创业家", "在星际冒险的宇航员"][route],
      );
      await expect(page.locator(".letter")).toContainText("哈尔滨");
      await expect(page.locator(".ending-inventory span")).toHaveCount(11);
      if (route === 0)
        await page.screenshot({
          path: `output/${testInfo.project.name}-ending.png`,
          animations: "disabled",
        });
      await page.getByRole("button", { name: /再走一条离谱/ }).click();
      await page.getByRole("button", { name: /开始我的人生奇遇/ }).click();
      await expect(page.locator("#bag b")).toHaveText("0");
      await expect(page.locator('.game-screen')).toHaveAttribute('data-career', '');
      await expect(page.locator('.route-badge')).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  }

  test("keyboard choices, memory pocket and sound toggle", async ({ page }) => {
    await page.goto("./");
    await waitForArtwork(page);
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-node="meadow"]')).toBeVisible();
    await page.keyboard.press("1");
    await expect(page.locator('[data-node="result"]')).toBeVisible();
    await expect(page.locator("#bag b")).toHaveText("1");
    await page.keyboard.press("b");
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator(".bag-list")).toContainText("动物会长徽章");
    await page.keyboard.press("2");
    await expect(page.locator("#bag b")).toHaveText("1");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await page.locator(".story-panel h2").focus();
    await page.keyboard.press("Space");
    await expect(page.locator('[data-node="apricots"]')).toBeVisible();
    await page.getByRole("button", { name: "打开音乐" }).click();
    await expect(page.locator("#sound-toggle")).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "关闭音乐" }).click();
    await expect(page.locator("#sound-toggle")).toHaveAttribute("aria-pressed", "false");
  });

  test("animated actors walk, respond and collect after reaching objects", async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('./');
    await waitForArtwork(page);
    await expect(page.locator('[data-actor]')).toHaveCount(1);
    await page.locator('#start').click();
    await waitForArtwork(page);
    const actor = page.locator('[data-actor="qiuyue"]');
    const actorCanvas = actor.locator('canvas');
    const idleImage = await actorCanvas.evaluate((canvas) => canvas.toDataURL());
    await expect.poll(async () =>
      (await actorCanvas.evaluate((canvas) => canvas.toDataURL())) !== idleImage,
    ).toBe(true);

    const background = page.locator('#scene');
    const basePixels = await background.evaluate((canvas) => Array.from(canvas.getContext('2d').getImageData(190, 40, 80, 60).data));
    await expect.poll(() => background.evaluate((canvas, before) =>
      canvas.getContext('2d').getImageData(190, 40, 80, 60).data.some((value, index) => value !== before[index]), basePixels),
    ).toBe(true);

    const viewport = page.viewportSize();
    const targetX = viewport.width * .59;
    await page.mouse.click(targetX, viewport.height * .61);
    await expect(actor).toHaveAttribute('data-moving', 'true');
    const walkingFrame = await actor.getAttribute('data-frame');
    await expect.poll(() => actor.getAttribute('data-frame')).not.toBe(walkingFrame);
    await expect(actor).toHaveAttribute('data-moving', 'false');
    const position = await actor.boundingBox();
    expect(Math.abs(position.x + position.width / 2 - targetX)).toBeLessThan(4);

    await actor.click();
    await expect(actor.locator('.actor-speech')).toContainText('这个院子我罩了');
    await expect(actor).toHaveAttribute('data-animation', 'waving');
    await page.locator('[data-choice="0"]').click();
    await page.locator('#continue').click();
    await waitForArtwork(page);
    await page.locator('[data-target="0"]').click();
    await expect(page.locator('#mini-count')).toHaveText('0 / 3');
    await expect(page.locator('[data-target="0"]')).toHaveClass(/pending/);
    await expect(page.locator('#mini-count')).toHaveText('1 / 3', { timeout: 7000 });
    await page.locator('[data-target="1"]').click();
    await page.locator('#skip').click();
    await waitForArtwork(page);
    await expect(page.locator('[data-node="crossroads"]')).toBeVisible();
    await expect(page.locator('[data-actor="qiuyue"]')).toHaveAttribute('data-form', 'childhood');
    await expect(page.locator('#bag b')).toHaveText('2');
    await page.waitForTimeout(2000); // The skipped approach/reach would have completed by now.
    expect(errors).toEqual([]);
  });
});

test("mobile smoke: touch choices and minigame skip remain usable", async ({ page }) => {
  await page.goto("./");
  await waitForArtwork(page);
  await page.locator("#start").click();
  await page.locator('[data-choice="0"]').click();
  await page.locator("#bag").click();
  await expect(page.locator(".bag-list")).toContainText("动物会长徽章");
  await page.getByRole("button", { name: "关闭 ×" }).click();
  await page.locator("#continue").click();
  await page.locator("#skip").click();
  await expect(page.locator('[data-node="crossroads"]')).toBeVisible();
  await page.locator('[data-choice="2"]').click();
  await expect(page.locator(".reward")).toContainText("地球出入通行证");
  await expect(page.locator(".route-badge")).toHaveText("星际人生");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
