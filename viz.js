(() => {
  const canvas = document.querySelector("#research-cosmos");
  const detail = document.querySelector("#node-detail");
  const liveState = document.querySelector("#live-state");
  if (!canvas || !detail) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const palette = {
    origin: "#f8f5ef",
    analytic: "#e8dcc2",
    algebraic: "#72a8b2",
    architectural: "#c77d89",
    boundary: "#9b8bc4"
  };

  const identityNodes = [
    { id: 0, parent: null, ring: 0, angle: 0, type: "origin", title: "Jesús / research identity", text: "Human-controlled interface joining proof, geometry, systems, and adversarial verification." },
    { id: 1, parent: 0, ring: 1, angle: -1.42, type: "analytic", title: "Analytic physics", text: "PDE identities, scale-critical estimates, pressure, localization, and continuation obligations." },
    { id: 2, parent: 0, ring: 1, angle: -.18, type: "algebraic", title: "Proof kernels", text: "Lean, nanoda, symbolic algebra, exact finite witnesses, and rebuildable theorem footprints." },
    { id: 3, parent: 0, ring: 1, angle: 1.04, type: "architectural", title: "Geometric systems", text: "Bundles, moving frames, hyperbolic representations, and explicit transport costs." },
    { id: 4, parent: 0, ring: 1, angle: 2.34, type: "boundary", title: "Doubt protocol", text: "Falsifiers, matched nulls, reversal gates, provenance, and privacy boundaries." },
    { id: 5, parent: 1, ring: 2, angle: -1.75, type: "analytic", title: "Signed production", text: "Retain cancellation in omega · S omega rather than hiding it behind absolute values." },
    { id: 6, parent: 1, ring: 2, angle: -1.12, type: "analytic", title: "λ₂⁺ top-hill", text: "Middle-strain route with alignment, pressure-Hessian, localization, and viscous reserve exposed." },
    { id: 7, parent: 2, ring: 2, angle: -.48, type: "algebraic", title: "Lean / nanoda", text: "Small trusted kernels and explicit axiom footprints." },
    { id: 8, parent: 2, ring: 2, angle: .14, type: "algebraic", title: "Symbolic falsifiers", text: "Executable identities, counterexamples, scaling audits, and obstruction tests." },
    { id: 9, parent: 3, ring: 2, angle: .72, type: "architectural", title: "Hyperbolic learning", text: "Represent hierarchy and curvature natively rather than flattening structure into Euclidean bookkeeping." },
    { id: 10, parent: 3, ring: 2, angle: 1.35, type: "architectural", title: "Fibered interfaces", text: "Moving charts and nested frames with conditioning, connection, and reconstruction costs charged." },
    { id: 11, parent: 4, ring: 2, angle: 1.96, type: "boundary", title: "Semantic lineage", text: "Stable claim chunks, evidence references, and machine-readable research ancestry." },
    { id: 12, parent: 4, ring: 2, angle: 2.58, type: "boundary", title: "No-leak membrane", text: "Public capability signals without private repository, branch, issue, file, or data leakage." },
    { id: 13, parent: 5, ring: 3, angle: -2.02, type: "analytic", title: "Zero-set safety", text: "Regularized direction fields without dividing blindly by vanishing vorticity." },
    { id: 14, parent: 6, ring: 3, angle: -1.49, type: "analytic", title: "Pressure/localization", text: "The real unresolved physics edge; never replaced by certificate organization." },
    { id: 15, parent: 7, ring: 3, angle: -.93, type: "algebraic", title: "Axiom audit", text: "Proof dependency inspection as a first-class artifact." },
    { id: 16, parent: 8, ring: 3, angle: -.39, type: "algebraic", title: "Reverse DAG", text: "Sufficient implications cannot close targets whose antecedents remain open." },
    { id: 17, parent: 9, ring: 3, angle: .18, type: "architectural", title: "Manifold intelligence", text: "Geometry-aware optimization, representation, and control." },
    { id: 18, parent: 10, ring: 3, angle: .72, type: "architectural", title: "Adiabatic transport", text: "Slow deformation makes connection cost measurable instead of metaphorical." },
    { id: 19, parent: 10, ring: 3, angle: 1.27, type: "architectural", title: "Multi-chart worlds", text: "Parallel representations survive only when every inter-world cost is charged." },
    { id: 20, parent: 11, ring: 3, angle: 1.82, type: "boundary", title: "Claim units", text: "Object, premise, evidence, translation, and reversal bound together." },
    { id: 21, parent: 12, ring: 3, angle: 2.37, type: "boundary", title: "Public memory", text: "Pages, papers, tests, and releases form the external memory surface." },
    { id: 22, parent: 12, ring: 3, angle: 2.92, type: "boundary", title: "Human sovereignty", text: "The identity amplifies orientation; it does not impersonate autonomous authority." }
  ];
  let nodes = identityNodes;
  let semanticNodes = null;
  let blendNodes = null;
  let mode = "identity";

  let width = 0;
  let height = 0;
  let ratio = 1;
  let hover = 0;
  let pointer = { x: -999, y: -999 };
  let phase = 0;

  function resize() {
    const box = canvas.getBoundingClientRect();
    ratio = Math.min(devicePixelRatio || 1, 2);
    width = box.width;
    height = box.height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function position(node) {
    const compact = width < 700;
    const cx = compact ? width / 2 : width * .43;
    const cy = height * .5;
    const max = Math.min(compact ? width : width * .72, height) * .42;
    if (mode === "blend" && node.braid) {
      const t = node.braid.t;
      const axisX = width * (.13 + .59 * t);
      const amplitude = Math.min(width, height) * (.11 + .025 * node.braid.depth);
      const sign = node.braid.side === "upper" ? -1 : 1;
      return {
        x: axisX,
        y: cy + sign * amplitude * Math.sin(Math.PI * t) + (node.braid.offset || 0)
      };
    }
    if (!node.ring) return { x: cx, y: cy };
    const radial = max * (1 - Math.exp(-.62 * node.ring)) / (1 - Math.exp(-1.86));
    const drift = reduceMotion ? 0 : Math.sin(phase * .45 + node.id) * 2.2;
    return {
      x: cx + Math.cos(node.angle) * (radial + drift),
      y: cy + Math.sin(node.angle) * (radial + drift)
    };
  }

  function curve(a, b) {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const bend = .16;
    return {
      x: mx + (height / 2 - my) * bend,
      y: my + (mx - width * .43) * bend
    };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const positions = nodes.map(position);
    const center = positions[0];

    const glow = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, Math.min(width, height) * .48);
    glow.addColorStop(0, "rgba(232,220,194,.12)");
    glow.addColorStop(.35, "rgba(106,141,146,.055)");
    glow.addColorStop(1, "rgba(8,11,18,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    [1, 2, 3].forEach((ring) => {
      const sample = position({ ring, angle: 0, id: 100 + ring });
      const radius = Math.abs(sample.x - center.x);
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(248,245,239,${.035 + ring * .012})`;
      ctx.setLineDash([2, 9 + ring * 3]);
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    ctx.setLineDash([]);

    if (mode === "blend") {
      for (let strand = 0; strand < 5; strand += 1) {
        ctx.beginPath();
        for (let step = 0; step <= 120; step += 1) {
          const t = step / 120;
          const x = width * (.1 + .66 * t);
          const y = height * .5
            + Math.sin(t * Math.PI * 4 + strand * 1.22 + phase * .8)
            * Math.min(width, height) * (.055 + strand * .008);
          if (!step) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = strand % 2
          ? "rgba(114,168,178,.11)"
          : "rgba(199,125,137,.10)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    nodes.forEach((node, i) => {
      if (node.parent === null) return;
      const a = positions[node.parent];
      const b = positions[i];
      const c = curve(a, b);
      const active = i === hover || node.parent === hover;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(c.x, c.y, b.x, b.y);
      ctx.strokeStyle = active ? palette[node.type] : "rgba(248,245,239,.11)";
      ctx.lineWidth = active ? 1.8 : .8;
      ctx.stroke();
    });

    nodes.forEach((node, i) => {
      const p = positions[i];
      const active = i === hover;
      const radius = node.ring === 0 ? 15 : Math.max(4.5, 9 - node.ring);
      if (active) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius + 12 + Math.sin(phase * 2) * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${palette[node.type]}22`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = palette[node.type];
      ctx.shadowColor = palette[node.type];
      ctx.shadowBlur = active ? 24 : 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (node.ring < 3 || active) {
        ctx.fillStyle = active ? "#f8f5ef" : "rgba(248,245,239,.58)";
        ctx.font = `${active ? 600 : 500} ${active ? 12 : 10}px ui-monospace, monospace`;
        ctx.textAlign = p.x < center.x ? "right" : "left";
        ctx.fillText(node.title.toUpperCase(), p.x + (p.x < center.x ? -13 : 13), p.y + 4);
      }
    });

    phase += reduceMotion ? 0 : .008;
    requestAnimationFrame(draw);
  }

  function select(event) {
    const box = canvas.getBoundingClientRect();
    pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
    let nearest = { id: hover, distance: 34 };
    nodes.forEach((node, id) => {
      const p = position(node);
      const distance = Math.hypot(pointer.x - p.x, pointer.y - p.y);
      if (distance < nearest.distance) nearest = { id, distance };
    });
    if (nearest.id !== hover) {
      hover = nearest.id;
      const node = nodes[hover];
      detail.innerHTML = `<span class="node-index">${String(node.id).padStart(2, "0")} · ${node.type}</span><h3>${node.title}</h3><p>${node.text}</p><small>stratum ${node.ring} · public capability map</small>`;
    }
  }

  function buildSemanticNodes(data) {
    const result = [{
      id: 0, parent: null, ring: 0, angle: 0, type: "origin",
      title: `${data.total_chunks} semantic chunks`,
      text: "Sanitized EAVS-MMF semantic aggregate: topology and counts only, never raw research text or local provenance."
    }];
    const strataStep = Math.PI * 2 / data.strata.length;
    data.strata.forEach((item, index) => {
      result.push({
        id: result.length, parent: 0, ring: 1,
        angle: -Math.PI / 2 + index * strataStep,
        type: item.type, title: `${item.id} · ${item.count}`,
        text: item.summary
      });
    });
    const typeStep = Math.PI * 2 / data.chunk_types.length;
    data.chunk_types.forEach((item, index) => {
      const parent = 1 + index % data.strata.length;
      result.push({
        id: result.length, parent, ring: 2,
        angle: -Math.PI / 2 + .28 + index * typeStep,
        type: item.type, title: `${item.id} · ${item.count}`,
        text: `${item.count} sanitized ${item.id}; the map exposes volume and relation, not content.`
      });
    });
    Object.entries(data.confidence).forEach(([level, count], index) => {
      result.push({
        id: result.length, parent: 3, ring: 3,
        angle: -.45 + index * .42, type: "boundary",
        title: `${level} confidence · ${count}`,
        text: "Parser confidence is metadata about extraction, not confidence in the mathematical claim."
      });
    });
    return result;
  }

  function buildBlendNodes(repo, languages, commits) {
    const languageList = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
    const latest = commits[0];
    const result = [
      { id: 0, parent: null, ring: 0, angle: 0, type: "origin", title: "Dojo-1 overlap atlas", text: "Two research fibers joined by explicit public overlap maps: proof, doubt, provenance, and boundary." },
      { id: 1, parent: 0, ring: 1, angle: Math.PI, type: "analytic", title: "EAVS-MMF · private fiber", text: "Sanitized static projection only: 717 semantic chunks. No browser request reaches the private repository.", braid: { t: .06, side: "upper", depth: 2 } },
      { id: 2, parent: 0, ring: 1, angle: 0, type: "boundary", title: "doubt-the-machine · live fiber", text: `${repo.description} Updated ${new Date(repo.updated_at).toLocaleDateString()}.`, braid: { t: .94, side: "lower", depth: 2 } },
      { id: 3, parent: 1, ring: 2, angle: 0, type: "algebraic", title: "proof kernels", text: "Lean, nanoda, deterministic tests, and exact symbolic witnesses form the common algebraic fiber.", braid: { t: .24, side: "upper", depth: 1 } },
      { id: 4, parent: 2, ring: 2, angle: 0, type: "boundary", title: "falsifier membrane", text: "Failure modes, reversal conditions, and cheap rollback connect research claims to operational verification.", braid: { t: .72, side: "lower", depth: 1 } },
      { id: 5, parent: 3, ring: 2, angle: 0, type: "architectural", title: "provenance overlap", text: "Semantic chunks and deterministic traces preserve ancestry across the two coordinate systems.", braid: { t: .42, side: "upper", depth: 3 } },
      { id: 6, parent: 4, ring: 2, angle: 0, type: "architectural", title: "public translation", text: "Private-safe research topology meets a public API and documentation surface without crossing the data boundary.", braid: { t: .56, side: "lower", depth: 3 } },
      { id: 7, parent: 5, ring: 3, angle: 0, type: "analytic", title: "373 research sections", text: "Sanitized EAVS research stratum count; content remains in its protected fiber.", braid: { t: .32, side: "upper", depth: 4, offset: -42 } },
      { id: 8, parent: 5, ring: 3, angle: 0, type: "algebraic", title: "240 executable tests", text: "The EAVS semantic mirror exposes test volume, not test internals.", braid: { t: .39, side: "lower", depth: 4, offset: 52 } },
      { id: 9, parent: 4, ring: 3, angle: 0, type: "boundary", title: `latest · ${latest.sha.slice(0, 7)}`, text: `${latest.commit.message.split("\n")[0]} · ${new Date(latest.commit.author.date).toLocaleString()}`, braid: { t: .79, side: "upper", depth: 4, offset: -38 } },
      { id: 10, parent: 2, ring: 3, angle: 0, type: "boundary", title: `${repo.stargazers_count} stars · ${repo.forks_count} forks`, text: "Live public GitHub metadata; popularity is not evidence quality.", braid: { t: .87, side: "lower", depth: 4, offset: 42 } }
    ];
    languageList.forEach(([language, bytes], index) => {
      result.push({
        id: result.length, parent: 2, ring: 3, angle: 0,
        type: index ? "architectural" : "algebraic",
        title: `${language} · ${bytes.toLocaleString()} bytes`,
        text: "Live public language distribution reported by GitHub.",
        braid: { t: .77 + index * .045, side: index % 2 ? "upper" : "lower", depth: 5, offset: (index - 1.5) * 34 }
      });
    });
    return result;
  }

  async function loadBlend() {
    liveState.textContent = "querying public GitHub metadata · EAVS remains local";
    liveState.className = "live-state cached";
    const headers = { Accept: "application/vnd.github+json" };
    const [repoResponse, languageResponse, commitResponse] = await Promise.all([
      fetch("https://api.github.com/repos/Dojo-1/doubt-the-machine", { headers }),
      fetch("https://api.github.com/repos/Dojo-1/doubt-the-machine/languages", { headers }),
      fetch("https://api.github.com/repos/Dojo-1/doubt-the-machine/commits?per_page=3", { headers })
    ]);
    if (![repoResponse, languageResponse, commitResponse].every((response) => response.ok)) {
      throw new Error("public GitHub metadata unavailable");
    }
    blendNodes = buildBlendNodes(
      await repoResponse.json(),
      await languageResponse.json(),
      await commitResponse.json()
    );
    liveState.textContent = `live public signal · refreshed ${new Date().toLocaleTimeString()} · private fiber sanitized`;
    liveState.className = "live-state online";
  }

  async function switchCosmos(mode) {
    if (mode === "semantic" && !semanticNodes) {
      const response = await fetch("semantic-map.json");
      if (!response.ok) throw new Error("semantic projection unavailable");
      semanticNodes = buildSemanticNodes(await response.json());
    }
    if (mode === "blend" && !blendNodes) await loadBlend();
    nodes = mode === "semantic"
      ? semanticNodes
      : mode === "blend" ? blendNodes : identityNodes;
    window.requestAnimationFrame(() => resize());
    currentMode(mode);
    hover = 0;
    const node = nodes[0];
    detail.innerHTML = `<span class="node-index">00 · ${node.type}</span><h3>${node.title}</h3><p>${node.text}</p><small>stratum 0 · ${mode} projection</small>`;
    document.querySelector("#projection-label").textContent =
      mode === "semantic"
        ? "SANITIZED .SEMANTIC PROJECTION"
        : mode === "blend" ? "LIVE BRAIDED SHEAF ATLAS" : "POINCARÉ PROJECTION";
    document.querySelectorAll("[data-cosmos]").forEach((button) => {
      button.classList.toggle("active", button.dataset.cosmos === mode);
    });
    if (mode !== "blend") {
      liveState.textContent = mode === "semantic"
        ? "local sanitized aggregate · no private network request"
        : "local projection · no network request";
      liveState.className = "live-state";
    }
  }

  function currentMode(next) {
    mode = next;
  }

  addEventListener("resize", resize);
  canvas.addEventListener("pointermove", select);
  canvas.addEventListener("pointerdown", select);
  document.querySelectorAll("[data-cosmos]").forEach((button) => {
    button.addEventListener("click", () => {
      switchCosmos(button.dataset.cosmos).catch(() => {
        detail.innerHTML = "<span class='node-index'>projection fault</span><h3>Semantic mirror unavailable</h3><p>The identity map remains active; no hidden data was requested or exposed.</p>";
      });
    });
  });
  resize();
  draw();
})();
