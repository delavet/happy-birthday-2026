# Background motion frame prompts

Generated with the built-in `image_gen.imagegen` tool using one independent edit call per scene. Original background PNGs were inspected with `view_image` before editing. All outputs are new sibling files; original images were preserved.

These are second-frame raster assets for local masked blending. Visual inspection confirmed the same main composition and scenery, but generated images contain small texture and foliage redraws outside the requested movement. The renderer should keep static architecture and the ground from the original frame and blend only the selected foliage, fabric, water or star regions; do not flash-cut the entire image.

The first Harbin call returned a connection failure with no image. One retry with the identical prompt and source image succeeded.

## village

- Edit target: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/village.png`
- Saved output: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/village-motion.png`
- Original generated output: `/Users/yinhang/.codex/generated_images/01a0d1fd-67ae-7a50-ae35-6e1a1e638ddf/exec-65f53ca4-d81b-497e-97d6-49fd453ea73f.png`
- Visual review: main camera, composition and object placement retained; only selected local regions should be animated.

Full prompt:

```text
Use case: precise-object-edit. Asset type: second animation frame of an existing pixel-art game background. Input image is the exact edit target. Preserve its original aspect ratio, framing, camera, architecture, object identities, foreground ground, palette, lighting, weather, texture and pixel-art rendering. Make an almost-identical second frame, with only the very small local motion specified below, approximately 2–4 pixels. Do not redesign, crop, pan, zoom, add/remove/move any other object, add people, add readable text, add UI, or change time of day. It will alternate with the original, so all static geometry must stay aligned. Return one complete full-frame image.
Local motion: Only gently shift a few leaf clusters and the finest fruit-bearing apricot twigs in the upper-left tree canopy slightly to the right, as in a tiny breeze. Keep the tree trunk and main branches perfectly fixed; keep all apricots attached and nearly at the same locations. House, fence, animals, pots, basket, sky and ground must remain unchanged.
```

## campus

- Edit target: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/campus.png`
- Saved output: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/campus-motion.png`
- Original generated output: `/Users/yinhang/.codex/generated_images/01a0d1fd-67ae-7a50-ae35-6e1a1e638ddf/exec-1a90045a-40e1-4f7f-b460-3b2a63909c5f.png`
- Visual review: main camera, composition and object placement retained; only selected local regions should be animated.

Full prompt:

```text
Use case: precise-object-edit. Asset type: second animation frame of an existing pixel-art game background. Input image is the exact edit target. Preserve its original aspect ratio, framing, camera, architecture, object identities, foreground ground, palette, lighting, weather, texture and pixel-art rendering. Make an almost-identical second frame, with only the very small local motion specified below, approximately 2–4 pixels. Do not redesign, crop, pan, zoom, add/remove/move any other object, add people, add readable text, add UI, or change time of day. It will alternate with the original, so all static geometry must stay aligned. Return one complete full-frame image.
Local motion: Only gently shift a few small leaf clusters in the overhead tree canopy and left/right shrub foliage by 2–4 pixels in a tiny breeze. Preserve all main tree trunks and branches, school buildings, doors, windows, benches, bicycle, stairs, stone paving and their exact locations. Keep the original light level.
```

## lab

- Edit target: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/lab.png`
- Saved output: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/lab-motion.png`
- Original generated output: `/Users/yinhang/.codex/generated_images/01a0d1fd-67ae-7a50-ae35-6e1a1e638ddf/exec-82468791-955d-447e-926a-96547db848e8.png`
- Visual review: main camera, composition and object placement retained; only selected local regions should be animated.

Full prompt:

```text
Use case: precise-object-edit. Asset type: second animation frame of an existing pixel-art game background. Input image is the exact edit target. Preserve its original aspect ratio, framing, camera, architecture, object identities, foreground ground, palette, lighting, weather, texture and pixel-art rendering. Make an almost-identical second frame, with only the very small local motion specified below, approximately 2–4 pixels. Do not redesign, crop, pan, zoom, add/remove/move any other object, add people, add readable text, add UI, or change time of day. It will alternate with the original, so all static geometry must stay aligned. Return one complete full-frame image.
Local motion: Only very slightly change the shape of a few leaves visible through the large rear windows, and the corresponding soft leaf-shaped sunlight flecks on the floor, by 2–3 pixels. Preserve the window frames, outside architecture, all desks, microscopes, glassware, drawers, plants, mouse enclosure, books and their exact locations. Keep total sunlight, color and brightness the same.
```

## home

- Edit target: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/home.png`
- Saved output: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/home-motion.png`
- Original generated output: `/Users/yinhang/.codex/generated_images/01a0d1fd-67ae-7a50-ae35-6e1a1e638ddf/exec-6b43686d-5968-4b9a-87e9-b2941c64e51c.png`
- Visual review: main camera, composition and object placement retained; only selected local regions should be animated.

Full prompt:

```text
Use case: precise-object-edit. Asset type: second animation frame of an existing pixel-art game background. Input image is the exact edit target. Preserve its original aspect ratio, framing, camera, architecture, object identities, foreground ground, palette, lighting, weather, texture and pixel-art rendering. Make an almost-identical second frame, with only the very small local motion specified below, approximately 2–4 pixels. Do not redesign, crop, pan, zoom, add/remove/move any other object, add people, add readable text, add UI, or change time of day. It will alternate with the original, so all static geometry must stay aligned. Return one complete full-frame image.
Local motion: Only bend a few small leaves of the potted houseplants and the lemon tree very slightly, and shift the loose curtain edge by 2–3 pixels as a tiny indoor breeze. Preserve all pots, lemons, furniture, windows, objects, room geometry, perspective, brightness and shadows except the tiny local leaf movement.
```

## park

- Edit target: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/park.png`
- Saved output: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/park-motion.png`
- Original generated output: `/Users/yinhang/.codex/generated_images/01a0d1fd-67ae-7a50-ae35-6e1a1e638ddf/exec-8ed94040-c75a-41f8-a173-aba72b13fb33.png`
- Visual review: main camera, composition and object placement retained; only selected local regions should be animated.

Full prompt:

```text
Use case: precise-object-edit. Asset type: second animation frame of an existing pixel-art game background. Input image is the exact edit target. Preserve its original aspect ratio, framing, camera, architecture, object identities, foreground ground, palette, lighting, weather, texture and pixel-art rendering. Make an almost-identical second frame, with only the very small local motion specified below, approximately 2–4 pixels. Do not redesign, crop, pan, zoom, add/remove/move any other object, add people, add readable text, add UI, or change time of day. It will alternate with the original, so all static geometry must stay aligned. Return one complete full-frame image.
Local motion: Only gently move tiny leaf clusters at the ends of the overhead tree branches by 2–4 pixels and advance a few narrow ripples on the river surface by 2–3 pixels. Preserve bridges, waterfront buildings, paving, furniture, lamps, trees' major branches, flowers, camera and sunset color exactly.
```

## sea

- Edit target: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/sea.png`
- Saved output: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/sea-motion.png`
- Original generated output: `/Users/yinhang/.codex/generated_images/01a0d1fd-67ae-7a50-ae35-6e1a1e638ddf/exec-69ed7906-e1d0-4571-89ef-62bed51fcb54.png`
- Visual review: main camera, composition and object placement retained; only selected local regions should be animated.

Full prompt:

```text
Use case: precise-object-edit. Asset type: second animation frame of an existing pixel-art game background. Input image is the exact edit target. Preserve its original aspect ratio, framing, camera, architecture, object identities, foreground ground, palette, lighting, weather, texture and pixel-art rendering. Make an almost-identical second frame, with only the very small local motion specified below, approximately 2–4 pixels. Do not redesign, crop, pan, zoom, add/remove/move any other object, add people, add readable text, add UI, or change time of day. It will alternate with the original, so all static geometry must stay aligned. Return one complete full-frame image.
Local motion: Only move the narrow white foam edges of the existing shallow shore waves by 2–4 pixels and adjust a few tiny nearby water glints. Keep the shoreline shape, rocks, buildings, horizon, sun, clouds, birds, sand, shells, foreground grasses, perspective and all colors exactly unchanged.
```

## space

- Edit target: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/space.png`
- Saved output: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/space-motion.png`
- Original generated output: `/Users/yinhang/.codex/generated_images/01a0d1fd-67ae-7a50-ae35-6e1a1e638ddf/exec-433e54cd-4748-4cef-b483-3e7a86a3e43e.png`
- Visual review: main camera, composition and object placement retained; only selected local regions should be animated.

Full prompt:

```text
Use case: precise-object-edit. Asset type: second animation frame of an existing pixel-art game background. Input image is the exact edit target. Preserve its original aspect ratio, framing, camera, architecture, object identities, foreground ground, palette, lighting, weather, texture and pixel-art rendering. Make an almost-identical second frame, with only the very small local motion specified below, approximately 2–4 pixels. Do not redesign, crop, pan, zoom, add/remove/move any other object, add people, add readable text, add UI, or change time of day. It will alternate with the original, so all static geometry must stay aligned. Return one complete full-frame image.
Local motion: Only vary the brightness of a small handful of the tiny existing star pixels, making them subtly twinkle. Do not add/remove stars or move them. Keep Earth, celestial bodies, the rocket, lunar ground, rocks, flags, lamps, rabbit, all equipment and structural lines, camera, overall exposure and colors exactly unchanged.
```

## market

- Edit target: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/market.png`
- Saved output: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/market-motion.png`
- Original generated output: `/Users/yinhang/.codex/generated_images/01a0d1fd-67ae-7a50-ae35-6e1a1e638ddf/exec-9c92fc4a-1e2f-4329-834f-f85d570fad03.png`
- Visual review: main camera, composition and object placement retained; only selected local regions should be animated.

Full prompt:

```text
Use case: precise-object-edit. Asset type: second animation frame of an existing pixel-art game background. Input image is the exact edit target. Preserve its original aspect ratio, framing, camera, architecture, object identities, foreground ground, palette, lighting, weather, texture and pixel-art rendering. Make an almost-identical second frame, with only the very small local motion specified below, approximately 2–4 pixels. Do not redesign, crop, pan, zoom, add/remove/move any other object, add people, add readable text, add UI, or change time of day. It will alternate with the original, so all static geometry must stay aligned. Return one complete full-frame image.
Local motion: Only shift the loose edge of the existing market awning fabric by 2–3 pixels and bend a few nearby small leaves very slightly in a tiny breeze. Preserve fruit displays, stalls, signs, counters, baskets, ground, surrounding buildings, pots, tools, color, sunlight and all object positions exactly.
```

## harbin

- Edit target: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/harbin.png`
- Saved output: `/Users/yinhang/workspace/experiments/happy-birthday-2026/assets/scenes/harbin-motion.png`
- Original generated output: `/Users/yinhang/.codex/generated_images/01a0d1fd-67ae-7a50-ae35-6e1a1e638ddf/exec-7deeff56-3e0f-447e-8f18-9e6c87af7e5a.png`
- Visual review: main camera, composition and object placement retained; only selected local regions should be animated.

Full prompt:

```text
Use case: precise-object-edit. Asset type: second animation frame of an existing pixel-art game background. Input image is the exact edit target. Preserve its original aspect ratio, framing, camera, architecture, object identities, foreground ground, palette, lighting, weather, texture and pixel-art rendering. Make an almost-identical second frame, with only the very small local motion specified below, approximately 2–4 pixels. Do not redesign, crop, pan, zoom, add/remove/move any other object, add people, add readable text, add UI, or change time of day. It will alternate with the original, so all static geometry must stay aligned. Return one complete full-frame image.
Local motion: Only very gently shift small leaf clusters at the ends of the autumn tree branches by 2–3 pixels, and adjust a few tiny existing light reflections on the river surface. Preserve every building, dome, window, bridge, street lamp, stone paving, the table and fruit cake, moon, sky, furniture and their exact positions and colors.
```

