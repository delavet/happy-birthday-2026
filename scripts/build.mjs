import { cp, mkdir, readdir, rm } from "node:fs/promises";
await rm("output/site", { recursive: true, force: true });
await mkdir("output/site", { recursive: true });
await mkdir("output/site/assets/scenes", { recursive: true });
for (const path of ["index.html", "src", "assets/moon.svg"])
  await cp(path, `output/site/${path}`, { recursive: true });
for (const form of await readdir("assets/actors")) {
  await mkdir(`output/site/assets/actors/${form}/idle`, { recursive: true });
  await cp(`assets/actors/${form}/spritesheet.png`, `output/site/assets/actors/${form}/spritesheet.png`);
  await cp(`assets/actors/${form}/idle/00.png`, `output/site/assets/actors/${form}/idle/00.png`);
}
for (const file of await readdir("assets/scenes"))
  if (file.endsWith('.webp'))
    await cp(`assets/scenes/${file}`, `output/site/assets/scenes/${file}`);
console.log("Static site ready: output/site");
