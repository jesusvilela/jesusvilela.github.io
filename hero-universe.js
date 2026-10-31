/**
 * A restrained, genuine 3D hero figure, visually informed by the author's
 * UniverseOS nested-shell / Fano-orbit vocabulary. This is an original
 * browser-side artistic projection, not a scientific simulation or proof.
 *
 * The page and SVG fallback work without this optional WebGL enhancement.
 * Three.js is pinned, lazy-loaded and not required for primary content.
 */
(() => {
  "use strict";
  const host = document.getElementById("hero-figure");
  const canvas = document.getElementById("hero-manifold");
  const toggle = document.getElementById("hero-motion-toggle");
  if (!host || !canvas || !toggle) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = prefersReducedMotion.matches;
  let visible = true;
  let lost = false;
  let ready = false;
  let running = false;
  let frameId = 0;
  let lastTime = 0;
  let elapsed = 0;
  let renderer = null;
  let camera = null;
  let scene = null;
  let assembly = null;
  let orbitLayers = [];
  let ribbonLayers = [];
  let centralCore = null;
  let initPromise = null;
  let resizeObserver = null;
  let dragging = false;
  let pointerX = 0;
  let pointerY = 0;
  const TAU = Math.PI * 2;

  function updateButton() {
    toggle.hidden = !ready || lost;
    toggle.textContent = paused ? "Enable motion" : "Pause motion";
    toggle.setAttribute("aria-pressed", String(!paused));
  }

  function stop() {
    running = false;
    lastTime = 0;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
  }

  function renderStill() {
    if (ready && !lost) renderer.render(scene, camera);
  }

  function schedule() {
    if (!ready || paused || !visible || document.hidden || lost || running) return;
    running = true;
    frameId = requestAnimationFrame(animate);
  }

  function animate(now) {
    running = false;
    frameId = 0;
    if (!ready || paused || !visible || document.hidden || lost) return;
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.04) : 0;
    lastTime = now;
    elapsed += dt;
    if (!dragging) assembly.rotation.y += dt * 0.075;
    orbitLayers.forEach((layer, index) => {
      layer.rotation.z += dt * (index % 2 ? -0.035 : 0.028);
      layer.rotation.y += dt * (index % 2 ? 0.018 : -0.015);
    });
    ribbonLayers.forEach((layer, index) => {
      layer.rotation.y += dt * (index % 2 ? -0.015 : 0.018);
    });
    const breath = 1 + 0.022 * Math.sin(elapsed * 0.85);
    assembly.scale.setScalar(breath);
    centralCore.scale.setScalar(0.95 + 0.09 * Math.sin(elapsed * 1.1));
    renderStill();
    schedule();
  }

  function sync() {
    if (!ready || lost) return;
    updateButton();
    if (paused || document.hidden || !visible) {
      stop();
      renderStill();
    } else {
      schedule();
    }
  }

  function makeRibbonGeometry(THREE, radius, halfWidth, twists, phase, lift) {
    const steps = 240;
    const strips = 10;
    const vertices = [];
    const indices = [];
    const borders = [[], []];
    const fibers = [[], [], []];

    function at(u, across) {
      const ripple = radius + 0.12 * Math.sin(3 * u + phase);
      const twist = twists * u + phase;
      const ct = Math.cos(twist), st = Math.sin(twist);
      const radialX = Math.cos(u), radialZ = Math.sin(u);
      const w = across * halfWidth;
      return new THREE.Vector3(
        ripple * radialX + w * ct * radialX,
        lift * Math.sin(2 * u + phase) + w * st,
        ripple * radialZ + w * ct * radialZ
      );
    }

    for (let i = 0; i <= steps; i++) {
      const u = TAU * i / steps;
      for (let j = 0; j <= strips; j++) {
        const across = -1 + 2 * j / strips;
        const p = at(u, across);
        vertices.push(p.x, p.y, p.z);
      }
      borders[0].push(at(u, -1));
      borders[1].push(at(u, 1));
      [-0.52, 0, 0.52].forEach((v, k) => fibers[k].push(at(u, v)));
    }
    for (let i = 0; i < steps; i++) {
      for (let j = 0; j < strips; j++) {
        const a = i * (strips + 1) + j;
        const b = a + strips + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return { geometry, borders, fibers };
  }

  function buildSculpture(THREE) {
    const root = new THREE.Group();
    scene.add(root);
    root.rotation.set(-0.17, -0.48, 0.12);
    assembly = root;

    scene.add(new THREE.HemisphereLight(0xe8dcc2, 0x18323a, 1.15));
    const key = new THREE.PointLight(0xf0ded1, 30, 26, 2);
    key.position.set(5, 6, 9);
    scene.add(key);
    const side = new THREE.PointLight(0x72a8b2, 17, 22, 2);
    side.position.set(-6, -3, 4);
    scene.add(side);
    const rim = new THREE.DirectionalLight(0xb76e79, 1.5);
    rim.position.set(3, -5, -5);
    scene.add(rim);

    const palette = [0xe8dcc2, 0x72a8b2, 0xc77d89, 0xb6a3d0];

    // Translucent sectional shells: geometry as an exploratory projection.
    [2.35, 2.95, 3.56].forEach((radius, index) => {
      const shell = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 30, 20),
        new THREE.MeshBasicMaterial({
          color: palette[index], wireframe: true,
          transparent: true, opacity: 0.036 + index * 0.013,
          depthWrite: false, side: THREE.DoubleSide
        })
      );
      shell.rotation.set(0.22 * index, 0.4 * index, 0.15);
      root.add(shell);
    });

    // Seven nested, mutually angled orbital carriers.
    for (let i = 0; i < 7; i++) {
      const layer = new THREE.Group();
      const radius = 1.5 + i * 0.33;
      const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.013 + i * 0.0018, 6, 200),
        new THREE.MeshBasicMaterial({
          color: palette[i % palette.length], transparent: true,
          opacity: i > 4 ? 0.24 : 0.42, depthWrite: false
        })
      );
      layer.add(orbit);
      layer.rotation.set(0.39 + i * 0.33, i * 0.57, i * 0.2);
      root.add(layer);
      orbitLayers.push(layer);
    }

    // Three woven ribbon membranes. The twists close continuously;
    // "Möbius-like" is visual shorthand, not a topology claim.
    [
      { r: 2.38, w: 0.22, n: 1, p: 0.45, l: 0.48, rot: [0.65, -0.23, 0.47], color: 0xe8dcc2 },
      { r: 2.14, w: 0.18, n: 2, p: 1.25, l: 0.55, rot: [-0.38, 0.69, -0.28], color: 0x72a8b2 },
      { r: 1.83, w: 0.15, n: 3, p: 0.12, l: 0.48, rot: [0.81, 0.31, 0.71], color: 0xc77d89 }
    ].forEach((spec) => {
      const group = new THREE.Group();
      const ribbon = makeRibbonGeometry(THREE, spec.r, spec.w, spec.n, spec.p, spec.l);
      group.add(new THREE.Mesh(ribbon.geometry, new THREE.MeshPhysicalMaterial({
        color: spec.color,
        emissive: spec.color, emissiveIntensity: 0.11,
        roughness: 0.35, metalness: 0.28, clearcoat: 0.8,
        clearcoatRoughness: 0.22, side: THREE.DoubleSide,
        transparent: true, opacity: 0.34, depthWrite: false
      })));
      ribbon.borders.forEach((points) => group.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: spec.color, opacity: 0.78, transparent: true, depthWrite: false })
      )));
      ribbon.fibers.forEach((points) => group.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: spec.color, opacity: 0.21, transparent: true, depthWrite: false })
      )));
      group.rotation.set(...spec.rot);
      root.add(group);
      ribbonLayers.push(group);
    });

    // 7 points and the Fano incidence lines as a delicate visual genealogy.
    // No algebraic identity is inferred from this embedding.
    const positions = [];
    const nodeGeo = new THREE.SphereGeometry(0.075, 14, 10);
    const haloGeo = new THREE.SphereGeometry(0.18, 12, 8);
    for (let i = 0; i < 7; i++) {
      const y = 1 - 2 * (i + 0.5) / 7;
      const a = i * 2.399963229728653;
      const ring = Math.sqrt(1 - y * y);
      const p = new THREE.Vector3(ring * Math.cos(a), y, ring * Math.sin(a)).multiplyScalar(3.4);
      positions.push(p);
      const tint = palette[i % palette.length];
      const node = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: tint }));
      const halo = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({
        color: tint, transparent: true, opacity: 0.08, depthWrite: false
      }));
      node.position.copy(p);
      halo.position.copy(p);
      root.add(node, halo);
    }
    const fano = [[0,1,3],[1,2,4],[2,3,5],[3,4,6],[4,5,0],[5,6,1],[6,0,2]];
    const edges = new Set();
    fano.forEach((triple) => {
      [[triple[0], triple[1]], [triple[1], triple[2]], [triple[2], triple[0]]].forEach(([a,b]) => {
        const key = [a,b].sort((x,y) => x - y).join(":");
        if (edges.has(key)) return;
        edges.add(key);
        root.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([positions[a], positions[b]]),
          new THREE.LineBasicMaterial({ color: 0xa2b8bd, transparent: true, opacity: 0.16, depthWrite: false })
        ));
      });
    });

    // Nested luminous nucleus and intersecting local frames.
    const coreGroup = new THREE.Group();
    for (const [r, color, opacity] of [
      [0.27, 0xfff4dc, 0.98], [0.48, 0xe8dcc2, 0.17], [0.83, 0x72a8b2, 0.053]
    ]) {
      coreGroup.add(new THREE.Mesh(
        new THREE.SphereGeometry(r, 24, 20),
        new THREE.MeshBasicMaterial({
          color, transparent: true, opacity, depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      ));
    }
    for (let i = 0; i < 3; i++) {
      const micro = new THREE.Mesh(
        new THREE.TorusGeometry(0.9 + i * 0.14, 0.012, 5, 120),
        new THREE.MeshBasicMaterial({
          color: palette[i], transparent: true, opacity: 0.45, depthWrite: false
        })
      );
      micro.rotation.set(i * 0.7, i * 0.9, 0.3);
      coreGroup.add(micro);
    }
    root.add(coreGroup);
    centralCore = coreGroup;

    // Sparse local stars create depth without turning the hero into a game UI.
    const points = [];
    for (let i = 0; i < 135; i++) {
      const a = i * 2.399963229728653;
      const y = 1 - 2 * (i + 0.5) / 135;
      const r = 4.05 + 0.62 * Math.sin(i * 5.11);
      const xz = Math.sqrt(1 - y * y);
      points.push(r * xz * Math.cos(a), r * y, r * xz * Math.sin(a));
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    root.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({
      color: 0xd9c7bd, size: 0.025, sizeAttenuation: true,
      transparent: true, opacity: 0.42,
      blending: THREE.AdditiveBlending, depthWrite: false
    })));
  }

  function resize() {
    if (!ready) return;
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width < 2 || bounds.height < 2) return;
    const width = Math.round(bounds.width);
    const height = Math.round(bounds.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderStill();
  }

  async function init() {
    if (ready || lost) return;
    let THREE;
    try {
      // Pinned external renderer: the original text and inline SVG never depend on it.
      THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js");
    } catch {
      // Offline/CDN-blocked visitors retain the non-animated geometric SVG.
      return;
    }
    if (!host.isConnected) return;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas, antialias: true, alpha: true, powerPreference: "low-power"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0.25, 13.8);
      camera.lookAt(0, 0, 0);
      buildSculpture(THREE);
      ready = true;
      resize();
      renderStill();
      host.classList.add("is-live");
      updateButton();
      if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host.querySelector(".hero-manifold-stage"));
      } else {
        window.addEventListener("resize", resize, { passive: true });
      }
      sync();
    } catch {
      ready = false;
      host.classList.remove("is-live");
      toggle.hidden = true;
      try { if (renderer) renderer.dispose(); } catch { /* graceful fallback */ }
    }
  }

  function ensureInit() {
    if (!initPromise) initPromise = init();
    return initPromise;
  }

  // Defer WebGL creation until the figure approaches the viewport.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) ensureInit().then(sync);
      else stop();
    }, { rootMargin: "160px 0px", threshold: 0.01 });
    observer.observe(host);
  } else {
    ensureInit();
  }

  toggle.addEventListener("click", () => {
    paused = !paused;
    updateButton();
    sync();
  });
  prefersReducedMotion.addEventListener?.("change", (event) => {
    paused = event.matches;
    sync();
  });
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("pagehide", stop);
  window.addEventListener("pageshow", sync);

  canvas.addEventListener("pointerdown", (event) => {
    if (!ready || event.button !== 0) return;
    dragging = true;
    pointerX = event.clientX;
    pointerY = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!ready || !dragging) return;
    const dx = event.clientX - pointerX;
    const dy = event.clientY - pointerY;
    pointerX = event.clientX;
    pointerY = event.clientY;
    assembly.rotation.y += dx * 0.008;
    assembly.rotation.x = Math.max(-1.3, Math.min(1.3, assembly.rotation.x + dy * 0.008));
    renderStill();
  });
  function release(event) {
    dragging = false;
    if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  }
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);

  canvas.addEventListener("keydown", (event) => {
    const amount = 0.14;
    if (!ready) return;
    if (!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") assembly.rotation.y -= amount;
    if (event.key === "ArrowRight") assembly.rotation.y += amount;
    if (event.key === "ArrowUp") assembly.rotation.x = Math.max(-1.3, assembly.rotation.x - amount);
    if (event.key === "ArrowDown") assembly.rotation.x = Math.min(1.3, assembly.rotation.x + amount);
    renderStill();
  });

  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    lost = true;
    stop();
    host.classList.remove("is-live");
    updateButton();
  });
  canvas.addEventListener("webglcontextrestored", () => {
    lost = false;
    host.classList.add("is-live");
    resize();
    sync();
  });
})();
