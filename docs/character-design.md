# 独立角色设计

## 参考与辨识点

- 秋月：用户照片里的大圆形银色眼镜、偏分黑发、圆润脸颊和爱笑的神情。米白连衣裙与洞洞鞋是初始设计参考，游戏中按人生路线与阶段选用八种服饰和发型。
- 尹航：短黑发、偏方的细银框眼镜、眉眼与温和笑容。用户补充：秋月喜欢尹航穿白衬衫，最终游戏造型改用白衬衫和深色长裤。
- 用户进一步指定类似 Codex 宠物的 Q 版形象，最终方向为约 2—2.5 头身、大头小身体、清楚的像素轮廓。

## 制作方式

使用内置 imagegen，根据形象参考为每种角色形态分别生成待机、行走与招呼／伸手动作条带，整理为独立透明帧。`assets/actors/<形态>/<动作>/<帧号>.png` 中的 192×208 独立帧保留为制作素材，再合成每种形态的生产精灵图 `assets/actors/<形态>/spritesheet.png`，大小为 1536×624、8 列 3 行，三行依次是待机、行走和招呼／伸手。`src/actors.js` 为每种形态加载并解码一次精灵图，再按帧裁切到独立 Canvas；对话框头像使用当前阶段的 `idle/00.png`。

秋月的 8 种阶段形态加尹航，共 9 种形态。每种均包含 `idle` 6 帧、`running-right` 8 帧和 `waving` 4 帧，总计 162 帧；其中 `running-right` 播放行走步态，向左移动时镜像显示。27 组动作条带的生成提示词保存在 `docs/animation-prompts/`。

`assets/qiuyue-sprite.png` 与 `assets/yinhang-sprite.png` 是最初的 Q 版设计参考，均为 1254×1254、含透明 alpha 的 PNG，已不承担生产角色显示。早期较写实比例的立绘与旧封面保存在 `docs/art-studies/`。网页角色只发布每种形态的 `spritesheet.png` 与 `idle/00.png`，其余独立帧、设计参考和过程稿均不进入发布包。

## 阶段形态与出场

| 形态目录 | 使用阶段 | 服装与发型 |
| --- | --- | --- |
| `childhood` | 草原童年 | 黄色短袖、砖红背带裤、小双发髻 |
| `school` | 寄宿校园／飞行训练 | 蓝白校服、深蓝长裤、双肩包、短马尾 |
| `university` | 兰州科研／飞船检修 | 白大褂、浅蓝上衣、深蓝长裤、低发髻 |
| `beijing` | 北京读研 | 青绿色洗手服、高马尾 |
| `meeting` | 相遇 | 米白无袖连衣裙、低发髻、洞洞鞋 |
| `together` | 创业起步、星际出行、两个人的日常 | 蓝色短袖、奶油色短背带裤、低马尾 |
| `chengdu` | 水果事业、草原生意、太空果园 | 柠檬黄短袖、鼠尾草绿围裙、奶油色长裤、低发髻 |
| `birthday` | 首页及哈尔滨生日 | 桃粉连衣裙、奶油色开衫、小月牙发夹 |
| `yinhang` | 相遇后双人场景 | 纯白翻领长袖衬衫、深蓝长裤、奶油色运动鞋、银色略方眼镜 |

首页仅秋月一人，使用生日形态。医学故事默认通过 `formForChapter` 切换阶段造型；创业与星际节点用 `form` 选用对应工作装／日常装，人物问候也跟随人生路线。尹航在相遇发生后加入，出现在相遇后段、两个人的日常和生日章节及最后的生日信场景。换装服务于改编故事，不将照片或未经确认的年龄扩写为传记事实。

## 桌面交互与背景

以电脑鼠标操作为主：点空地让秋月行走，点角色播放招呼动作与短对白，点小游戏物件后秋月先走近再伸手，动作完成才领取或推进小游戏计数。减少动态效果时保留交互结果，使用静止角色帧和更短的抵达／领取过程。

背景由 9 组基础画面与动态画面组成，覆盖大院、校园、实验室、家、公园、海边、太空、水果摊与哈尔滨。`src/scenes.js` 用局部柔边遮罩让树叶、水面和灯光区域轻柔循环混合，建筑和主体构图保留在基础画面中；发布包使用 18 张 WebP。全屏背景上叠放角色、对话框和选项，真实参考照片保留在仓库外，不进入网页。

## 初始 Q 版设计参考提示词

### 秋月

Use case: stylized-concept. Asset: ONE cute chibi pixel mascot sprite for a game, like a tiny desktop companion/pet that lives on the screen. Output square 1024x1024 PNG with TRUE transparent alpha background: only opaque character pixels, clean cutout edges. No visible background of any color, NO GLOW or HALO, no drop shadow, no floor, no vignette, no checkerboard drawn into the image. CRITICAL PROPORTIONS: 2 to 2.3 heads tall in total, head is almost half total height, very large round head, tiny compact body, short arms and legs. Not a tall portrait and not a realistic illustration. This is an adorable adult couple represented as tiny chibi mascots. Crisp actual pixel art made on a 96x96-pixel grid then enlarged with nearest neighbor, visible consistent square pixels, tight 20-color palette, dark warm outlines, simple 2-tone cel shading, no antialiasing or smooth gradients. Full body, front slightly three-quarter view, top of hair and soles visible, centered, character fills 82% height with about 8% empty padding at top/bottom. No props, no lettering. Preserve the distinguishing photo traits at chibi scale, tiny hands, rounded shoes, lively friendly expression, high quality professional mascot design. ONLY draw the WOMAN from the references, QiuYue. Large thin silver round eyeglasses, warm dark eyes, cheerful big smile, rosy round cheeks, side-parted dark hair tucked behind the ears and tied in a small low bun. Small nose, identifiable glasses and face shape, do not add anime eyelashes. Ivory sleeveless A-line dress ending at her tiny knees, cream Crocs-style clogs with 3 visible pixel holes. One hand waving next to the face and the other hand on hip. VERY cute and compact 2.2-head proportions, happy clever energetic personality. No male.

### 尹航（白衬衫）

Use case: stylized-concept. Asset: ONE cute chibi pixel mascot sprite for a game, like a tiny desktop companion/pet that lives on the screen. Output square 1024x1024 PNG with TRUE transparent alpha background: only opaque character pixels, clean cutout edges. No visible background of any color, NO GLOW or HALO, no drop shadow, no floor, no vignette, no checkerboard drawn into the image. CRITICAL PROPORTIONS: 2 to 2.3 heads tall in total, head is almost half total height, very large round head, tiny compact body, short arms and legs. Not a tall portrait and not a realistic illustration. This is an adorable adult couple represented as tiny chibi mascots. Crisp actual pixel art made on a 96x96-pixel grid then enlarged with nearest neighbor, visible consistent square pixels, tight 20-color palette, dark warm outlines, simple 2-tone cel shading, no antialiasing or smooth gradients. Full body, front slightly three-quarter view, top of hair and soles visible, centered, character fills 82% height with about 8% empty padding at top/bottom. No props, no lettering. Preserve the distinguishing photo traits at chibi scale, tiny hands, rounded shoes, lively friendly expression, high quality professional mascot design. ONLY draw the MAN from the references, YinHang. Short straight black hair, straight dark brows, thin silver slightly rectangular eyeglasses, small kind smile and softly squared cheeks. The user's explicit wardrobe requirement is a PURE WHITE COLLARED BUTTON-DOWN SHIRT, long sleeves, open collar, subtle pale blue pixel shadows, visible small buttons, no tie. Plain white shirt only: NO STRIPES, NO POLO, NO BLUE SHIRT. Dark navy trousers, cream casual sneakers. One hand relaxed in trouser pocket, other hand making a small friendly gesture. Tiny compact body, short legs, very large head, 2.2-head proportions, approachable sweet companion character. No female.

## 较写实过程稿提示词

### 秋月

Use case: stylized-concept. Production asset: ONE standalone full-body character sprite for a cozy 8-bit pixel-art narrative game, genuinely TRANSPARENT RGBA background, no paper backdrop, no checkerboard drawn into the picture, no ground plane, no text, no shadow outside the character. Pixel art MUST be deliberate crisp square pixels: design as if hand-drawn on a 128x192 pixel grid then nearest-neighbor upscaled. Limited 24-color warm palette, 1-pixel dark colored outlines, 2-3-tone clusters, NO smooth shading, no antialiasing, no painterly texture, no vector cartoon, no blurry photo filter. Charming adult proportions approximately 3.5 heads tall, sophisticated readable sprite design with expressive face and carefully rendered clothing. One complete person, head and feet fully visible, front-facing slightly three-quarter view, relaxed standing pose, about 84% of total image height, centered with transparent padding. Match the photo's identifiable face, hair, and eyewear traits while translating to stylized pixels. This will be shown at 320px height in the game; face must read well at that size. Subject: ONLY the Chinese adult WOMAN in the reference images, Zhang Qiuyue, a cheerful petite 31-year-old medical student. Preserve large thin silver round slightly polygonal eyeglasses, bright almond-shaped dark eyes, her rounded cheeks and warm open smile, gently arched eyebrows, dark black side-parted hair swept behind the ears and tied into a compact low bun, a few loose side locks. Do not give her a generic anime face, giant eyes, a childlike body or long flowing hair. Wardrobe: simple elegant ivory sleeveless A-line casual midi dress with subtly textured fabric and natural pixel folds, cream comfortable clogs with small vent holes. One hand resting near her hip and the other relaxed in a small friendly open-palm gesture. Empty hands: no lemon tree, no bag, no props. The third reference's white coat and face mask should NOT be carried over: use it only for hair/eyewear/face cues. Friendly lively clever expression.

### 尹航

Use case: stylized-concept. Production asset: ONE standalone full-body character sprite for a cozy 8-bit pixel-art narrative game, genuinely TRANSPARENT RGBA background, no paper backdrop, no checkerboard drawn into the picture, no ground plane, no text, no shadow outside the character. Pixel art MUST be deliberate crisp square pixels: design as if hand-drawn on a 128x192 pixel grid then nearest-neighbor upscaled. Limited 24-color warm palette, 1-pixel dark colored outlines, 2-3-tone clusters, NO smooth shading, no antialiasing, no painterly texture, no vector cartoon, no blurry photo filter. Charming adult proportions approximately 3.5 heads tall, sophisticated readable sprite design with expressive face and carefully rendered clothing. One complete person, head and feet fully visible, front-facing slightly three-quarter view, relaxed standing pose, about 84% of total image height, centered with transparent padding. Match the photo's identifiable face, hair, and eyewear traits while translating to stylized pixels. This will be shown at 320px height in the game; face must read well at that size. Subject: ONLY the Chinese adult MAN in the reference images, Yin Hang. Preserve short dense straight black hair with a natural slightly side-swept fringe, dark straight brows, dark narrow warm eyes, thin silver rectangular rimless-looking eyeglasses, slightly longer softly squared adult face, straight nose and a small gentle smile. Clean shaven. Do not make a generic round baby face. Wardrobe: the reference photo's blue-and-cream broad horizontal striped long-sleeve knit polo with a short white button placket, navy straight trousers and simple cream sneakers. Stands comfortably with both arms relaxed, slightly open hand toward companion on his left. Empty hands, no cake, no props. Warm and grounded companion character, same warm outlined pixel-game art direction as a woman with an ivory dress. Not photorealistic.
