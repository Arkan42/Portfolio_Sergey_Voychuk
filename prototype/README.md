# Sergey Voichuk — interactive portfolio prototype

Static GitHub Pages site. Upload this directory as `prototype/` in the existing portfolio repository. The current main portfolio is preserved.

## Run locally

Serve this directory using a static HTTP server, for example `python -m http.server 8765`, then visit `http://localhost:8765`. Do not open index.html as a file URL.

Dependencies: Three.js 0.180.0 and its official OrbitControls / GLTFLoader modules via jsDelivr, plus optional Google Fonts with system fallbacks. An internet connection and WebGL2 are required for the viewer. No build step, API keys, tracking, or backend.

## Controls

- Drag the viewport to orbit. Page scroll remains available.
- Lit / Clay / Wire / UV switch material inspection modes.
- Explore activates keyboard input while the viewport is focused: WASD or arrows move, Space casts, Escape releases control. Tab moves focus normally.
- Touch direction buttons appear in Explore mode.
- Pause stops motion; Reset restores the original camera, character position, and Lit shading.
- Delivery section accepts a local, self-contained uncompressed GLB (up to 50 MB). It replaces the procedural traveller and plays the first embedded clip. Reload restores primitives. Files are not uploaded or persisted.

## Replace primitives with finished art

1. Export a self-contained GLB from Blender with applied transforms, sensible scale, embedded textures, and named animation clips. This prototype does not load Draco/KTX2 assets.
2. Verify using the local GLB picker. A character is automatically fitted to 2.5 scene units in height, centred and grounded.
3. For permanent delivery add the asset under `prototype/assets/`, load it with GLTFLoader, then use the same normalization code in scene.js. Separate environment and character exports keep motion independent.
4. Replace procedural animation with named Idle/Walk/Cast actions and transitions. The current GLB preview only plays its first clip and moves the model root; it is not a full animation controller.
5. Replace draft notes and planned breakdowns in index.html with actual screenshots, UV sheets, bakes, budgets, timings, and decisions. Do not present prototype triangle counts as final production metrics.
6. Performance-review the real assets on mobile before making this the main portfolio. Movement is bounded to the island; there is no obstacle collision in the prototype.

## Content status

The Alchemist is a placeholder concept, not a shipped title or an NDA work disclosure. All visible geometry is procedurally built from primitives. The artist comments are proposed copy marked as drafts. No seniority, production credits, or measured career achievements are invented. The metrics show the prototype, not completed artwork. The geometry statistic counts visible scene geometry; rendered triangle count is the renderer's actual current-frame count.

## Next art milestones

1. Lock a single reference board and character silhouette.
2. Finish character blockout and one strong camera composition.
3. Build the final low-poly character and focal environment pieces.
4. UV, bake, texture, and capture neutral material checks.
5. Rig, author three clips, export, and profile.
6. Replace each draft comment with one concrete artistic or technical decision and supporting image.
