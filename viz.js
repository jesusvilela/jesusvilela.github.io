(() => {
  const canvas = document.querySelector("#research-cosmos");
  const detail = document.querySelector("#node-detail");
  const liveState = document.querySelector("#live-state");
  if (!canvas || !detail || !liveState) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colors = {
    origin: "#f8f5ef",
    analytic: "#e8dcc2",
    algebraic: "#72a8b2",
    architectural: "#c77d89",
    boundary: "#9b8bc4"
  };
  const fallbackRepos = [
    ["Dojo-1", "doubt-the-machine", "boundary"],
    ["jesusvilela", "aigit", "architectural"],
    ["jesusvilela", "trasgo", "architectural"],
    ["jesusvilela", "NETTRACER", "boundary"],
    ["jesusvilela", "connection_laplacian_lean", "algebraic"],
    ["jesusvilela", "IGBundle-LLM", "analytic"],
    ["jesusvilela", "lambda-sat-solver", "algebraic"],
    ["jesusvilela", "Topos-Trasgo", "architectural"],
    ["jesusvilela", "generational-autoresearch", "analytic"]
  ];
  const githubAccount = "jesusvilela";
  const hfAccount = "jesusvilela";
  const identityNodes = [
    node(0, null, 0, 0, "origin", "Jesús / research identity", "A public interface joining proof, geometry, systems, and adversarial verification."),
    node(1, 0, 1, -1.45, "analytic", "Geometric intelligence", "Information geometry, bundles, sheaves, and hyperbolic representation."),
    node(2, 0, 1, -.15, "algebraic", "Proof engineering", "Lean, symbolic tests, exact witnesses, and rebuildable theorem footprints."),
    node(3, 0, 1, 1.12, "architectural", "Context systems", "Semantic versioning, context compilation, and AI orchestration."),
    node(4, 0, 1, 2.4, "boundary", "Adversarial clarity", "Verification APIs, falsifiers, provenance, and reversible experiments."),
    node(5, 1, 2, -1.78, "analytic", "IGBundle-LLM", "Information-geometric and bundle-aware language-model adaptation.", "https://github.com/jesusvilela/IGBundle-LLM"),
    node(6, 1, 2, -1.12, "analytic", "generational-autoresearch", "AI agents running research on public infrastructure.", "https://github.com/jesusvilela/generational-autoresearch"),
    node(7, 2, 2, -.48, "algebraic", "connection Laplacian", "Formal finite-graph mathematics in Lean.", "https://github.com/jesusvilela/connection_laplacian_lean"),
    node(8, 2, 2, .14, "algebraic", "lambda SAT solver", "Certified structured-region SAT middleware.", "https://github.com/jesusvilela/lambda-sat-solver"),
    node(9, 3, 2, .76, "architectural", "aigit", "AI-native semantic version control built on Git.", "https://github.com/jesusvilela/aigit"),
    node(10, 3, 2, 1.38, "architectural", "trasgo", "Context compilation with a clever, local-first interface.", "https://github.com/jesusvilela/trasgo"),
    node(11, 3, 2, 2.0, "boundary", "NETTRACER", "Route, observe, replay, and audit multiple AI runtimes.", "https://github.com/jesusvilela/NETTRACER"),
    node(12, 4, 2, 2.62, "boundary", "doubt-the-machine", "A deterministic framework for using AI without being fooled.", "https://github.com/Dojo-1/doubt-the-machine")
  ];
  let nodes = identityNodes;
  let mode = "identity";
  let width = 0;
  let height = 0;
  let ratio = 1;
  let selected = 0;
  let phase = 0;

  function node(id, parent, ring, angle, type, title, text, url = "") {
    return { id, parent, ring, angle, type, title, text, url };
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    ratio = Math.min(devicePixelRatio || 1, 2);
    width = box.width;
    height = box.height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function position(item) {
    const compact = width < 700;
    const cx = compact ? width / 2 : width * .45;
    const cy = height * .5;
    const limit = Math.min(compact ? width : width * .72, height) * .42;
    if (!item.ring) return { x: cx, y: cy };
    const radius = limit * (1 - Math.exp(-.68 * item.ring)) / (1 - Math.exp(-2.04));
    const pulse = reduceMotion ? 0 : Math.sin(phase * .42 + item.id) * 2;
    return {
      x: cx + Math.cos(item.angle) * (radius + pulse),
      y: cy + Math.sin(item.angle) * (radius + pulse)
    };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const points = nodes.map(position);
    const center = points[0];
    const glow = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, Math.min(width, height) * .5);
    glow.addColorStop(0, "rgba(232,220,194,.13)");
    glow.addColorStop(.38, "rgba(106,141,146,.05)");
    glow.addColorStop(1, "rgba(8,11,18,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    [1, 2, 3].forEach((ring) => {
      const sample = position({ ring, angle: 0, id: 80 + ring });
      ctx.beginPath();
      ctx.arc(center.x, center.y, Math.abs(sample.x - center.x), 0, Math.PI * 2);
      ctx.setLineDash([2, 10 + ring * 3]);
      ctx.strokeStyle = `rgba(248,245,239,${.035 + ring * .012})`;
      ctx.stroke();
    });
    ctx.setLineDash([]);

    nodes.forEach((item, index) => {
      if (item.parent === null) return;
      const a = points[item.parent];
      const b = points[index];
      const bendX = (a.x + b.x) / 2 + (height / 2 - (a.y + b.y) / 2) * .16;
      const bendY = (a.y + b.y) / 2 + ((a.x + b.x) / 2 - width * .45) * .16;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(bendX, bendY, b.x, b.y);
      ctx.strokeStyle = index === selected || item.parent === selected
        ? colors[item.type] : "rgba(248,245,239,.11)";
      ctx.lineWidth = index === selected ? 1.8 : .8;
      ctx.stroke();
    });

    nodes.forEach((item, index) => {
      const point = points[index];
      const active = index === selected;
      const radius = item.ring === 0 ? 15 : Math.max(5, 10 - item.ring);
      if (active) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius + 12 + Math.sin(phase * 2) * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${colors[item.type]}22`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = colors[item.type];
      ctx.shadowColor = colors[item.type];
      ctx.shadowBlur = active ? 24 : 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      if (item.ring < 3 || active) {
        ctx.fillStyle = active ? "#f8f5ef" : "rgba(248,245,239,.58)";
        ctx.font = `${active ? 600 : 500} ${active ? 12 : 10}px ui-monospace, monospace`;
        ctx.textAlign = point.x < center.x ? "right" : "left";
        ctx.fillText(item.title.toUpperCase(), point.x + (point.x < center.x ? -13 : 13), point.y + 4);
      }
    });
    phase += reduceMotion ? 0 : .008;
    requestAnimationFrame(draw);
  }

  function select(event) {
    const box = canvas.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    let nearest = { index: selected, distance: 36 };
    nodes.forEach((item, index) => {
      const point = position(item);
      const distance = Math.hypot(x - point.x, y - point.y);
      if (distance < nearest.distance) nearest = { index, distance };
    });
    show(nearest.index);
  }

  function show(index) {
    if (!nodes[index]) return;
    selected = index;
    const item = nodes[index];
    const url = /^https:\/\/github\.com\/|^https:\/\/huggingface\.co\//.test(item.url || "") ? item.url : "";
    const action = url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">open public artifact ↗</a>` : "hover · touch a node";
    detail.innerHTML = `<span class="node-index">${String(item.id).padStart(2, "0")} · ${escapeHtml(item.type)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p><small>${action}</small>`;
  }

  function buildUnifiedNodes(githubRepos, hfArtifacts) {
    const total = githubRepos.length + hfArtifacts.length;
    const result = [node(0, null, 0, 0, "origin", `${total} public artifacts`, "One research identity projected across GitHub source/proof lineage and Hugging Face model/data/Space execution.")];

    const ghParent = result.length;
    result.push(node(ghParent, 0, 1, -2.15, "boundary", `GitHub · ${githubRepos.length}`, "Source, proof, provenance, correction history, and rebuildable engineering artifacts.", "https://github.com/Dojo-1"));

    const ghSpan = 1.7;
    githubRepos.forEach((repo, index) => {
      const divisor = Math.max(githubRepos.length - 1, 1);
      const angle = -2.15 - ghSpan / 2 + ghSpan * (index / divisor);
      result.push(node(result.length, ghParent, 2, angle, repo.type || "boundary", `${repo.name} · ${repo.language || "repo"}`, repo.description || "Public source artifact.", repo.url));
    });

    const hfParent = result.length;
    result.push(node(hfParent, 0, 1, .75, "analytic", `Hugging Face · ${hfArtifacts.length}`, "Models, datasets, and Spaces: the public execution plane for research artifacts.", `https://huggingface.co/${hfAccount}`));

    const kinds = [["model", -.05, "analytic"], ["dataset", .85, "algebraic"], ["space", 1.75, "architectural"]];
    kinds.forEach(([kind, angle, type]) => {
      const allItems = hfArtifacts.filter((item) => item.kind === kind).sort((a, b) => new Date(b.updated || 0) - new Date(a.updated || 0));
      if (!allItems.length) return;
      const parent = result.length;
      result.push(node(parent, hfParent, 2, angle, type, `${kind}s · ${allItems.length}`, `Public Hugging Face ${kind}s. The six most recently updated are projected here.`, `https://huggingface.co/${hfAccount}`));
      const items = allItems.slice(0, 6);
      items.forEach((item, childIndex) => {
        const spread = (childIndex - (items.length - 1) / 2) * .14;
        result.push(node(result.length, parent, 3, angle + spread, type, `${item.name} · ${kind}`, item.description || `Public Hugging Face ${kind} artifact.`, item.url));
      });
    });
    return result;
  }

  function classifyRepo(repo) {
    const text = `${repo.name || ""} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
    if (/§lang|§\|lang|lang\.s1|language specification/.test(text)) return "architectural";
    if (/lean|proof|sat|theorem|formal|laplacian|certificate/.test(text)) return "algebraic";
    if (/bundle|geometry|geometric|hyperbolic|manifold|topos/.test(text)) return "analytic";
    if (/doubt|verify|verification|falsif|audit|trace|observer/.test(text)) return "boundary";
    return "architectural";
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  }

  function renderResearchIndex(repos, filter = "all") {
    const list = document.querySelector("#research-index-list");
    const status = document.querySelector("#research-index-status");
    if (!list || !status) return;
    const visible = repos.filter((repo) => filter === "all" || repo.type === filter);
    status.textContent = `${visible.length} ${filter === "all" ? "recent public repositories" : `${filter} repositories`} shown · ordered by source update${status.dataset.partial ? " · one GitHub source unavailable" : ""}`;
    list.innerHTML = visible.map((repo) => `<a class="research-item" href="${escapeHtml(repo.url)}"><span class="research-item-meta"><span>${escapeHtml(repo.type)}</span><span>${escapeHtml(repo.language || "source")}</span></span><strong>${escapeHtml(repo.name)}</strong><p>${escapeHtml(repo.description || "Public source artifact. Scope and evidence live with the repository.")}</p><small>open source artifact ↗</small></a>`).join("") || "<p>Nothing in this research lane is public yet.</p>";
  }

  async function listPublicRepos(owner, kind) {
    const found = [];
    // GitHub REST pages contain at most 100 entries; avoid silently dropping newer work.
    for (let page = 1; page <= 5; page++) {
      const endpoint = kind === "org" ? "orgs" : "users";
      const response = await fetch(`https://api.github.com/${endpoint}/${owner}/repos?sort=updated&per_page=100&page=${page}`, {
        headers: { Accept: "application/vnd.github+json" }
      });
      if (!response.ok) throw new Error(`Public GitHub metadata unavailable: ${owner}`);
      const payload = await response.json();
      if (!Array.isArray(payload)) throw new Error("GitHub public metadata malformed");
      found.push(...payload.filter((repo) => !repo.fork && !repo.archived && !repo.private && repo.visibility !== "internal"));
      if (payload.length < 100) break;
    }
    return found;
  }

  async function fetchGitHubRepos() {
    const sources = await Promise.allSettled([
      listPublicRepos(githubAccount, "user"),
      listPublicRepos("Dojo-1", "org")
    ]);
    const successful = sources.filter((result) => result.status === "fulfilled");
    if (!successful.length) throw new Error("Both public GitHub metadata sources are unavailable");
    const unique = new Map();
    successful.flatMap((entry) => entry.value).forEach((repo) => {
      const url = repo.html_url;
      if (!url || unique.has(url)) return;
      unique.set(url, {
        name: repo.name,
        description: repo.description,
        language: repo.language,
        url,
        updated: repo.updated_at || repo.pushed_at,
        topics: repo.topics || [],
        type: classifyRepo(repo)
      });
    });
    const repos = [...unique.values()].sort((a, b) => new Date(b.updated || 0) - new Date(a.updated || 0));
    const count = document.querySelector("#repo-count");
    if (count) count.textContent = String(repos.length).padStart(2, "0");
    const status = document.querySelector("#research-index-status");
    if (status && successful.length < sources.length) {
      status.dataset.partial = "true";
    } else if (status) {
      delete status.dataset.partial;
    }
    return repos;
  }

  async function fetchHuggingFace() {
    const specs = [
      ["model", `https://huggingface.co/api/models?author=${hfAccount}&limit=100&full=true`],
      ["dataset", `https://huggingface.co/api/datasets?author=${hfAccount}&limit=100&full=true`],
      ["space", `https://huggingface.co/api/spaces?author=${hfAccount}&limit=100&full=true`]
    ];
    const groups = await Promise.all(specs.map(async ([kind, url]) => {
      try {
        const response = await fetch(url);
        if (!response.ok) return [];
        const payload = await response.json();
        if (!Array.isArray(payload)) return [];
        return payload.map((item) => {
          const id = item.id || item.modelId || "";
          const name = id.split("/").pop() || id || kind;
          const prefix = kind === "dataset" ? "datasets/" : kind === "space" ? "spaces/" : "";
          const description = item.cardData?.short_description || item.pipeline_tag || item.sdk || (Array.isArray(item.tags) ? item.tags.slice(0, 3).join(" · ") : "");
          return { name, kind, description, updated: item.lastModified || item.createdAt || "", url: `https://huggingface.co/${prefix}${id}` };
        });
      } catch {
        return [];
      }
    }));
    const artifacts = groups.flat();
    const count = document.querySelector("#hf-count");
    if (count) count.textContent = String(artifacts.length).padStart(2, "0");
    return artifacts;
  }

  let publicCache = null;

  async function fetchPublicSurface(force = false) {
    if (publicCache && !force) return publicCache;
    liveState.textContent = "resolving GitHub ↔ Hugging Face";
    liveState.className = "live-state cached";
    const [github, huggingface] = await Promise.all([fetchGitHubRepos(), fetchHuggingFace()]);
    publicCache = { github, huggingface };
    renderResearchIndex(github);
    const pulse = document.querySelector("#pulse-date");
    if (pulse) pulse.textContent = `refreshed ${new Date().toLocaleTimeString()}`;
    return publicCache;
  }

  async function switchMode(next) {
    mode = next;
    if (next === "identity") {
      nodes = identityNodes;
      liveState.textContent = "local public projection";
      liveState.className = "live-state";
    } else {
      const surface = await fetchPublicSurface(next === "live");
      nodes = buildUnifiedNodes(surface.github, surface.huggingface);
      liveState.textContent = next === "live"
        ? `live · GitHub ${surface.github.length} ↔ HF ${surface.huggingface.length} · ${new Date().toLocaleTimeString()}`
        : `unified public surface · ${surface.github.length + surface.huggingface.length} artifacts`;
      liveState.className = next === "live" ? "live-state online" : "live-state";
    }
    document.querySelector("#projection-label").textContent = next === "identity"
      ? "POINCARÉ PROJECTION"
      : next === "live" ? "LIVE GITHUB ↔ HF PULSE" : "UNIFIED PUBLIC CONSTELLATION";
    document.querySelectorAll("[data-cosmos]").forEach((button) => {
      button.classList.toggle("active", button.dataset.cosmos === next);
    });
    selected = 0;
    show(0);
    resize();
  }

  addEventListener("resize", resize);
  addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--px", `${event.clientX / innerWidth * 100}%`);
    document.documentElement.style.setProperty("--py", `${event.clientY / innerHeight * 100}%`);
  }, { passive: true });
  canvas.addEventListener("pointermove", select);
  canvas.addEventListener("pointerdown", select);
  detail.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link) window.open(link.href, "_blank", "noopener");
  });
  document.querySelectorAll("[data-cosmos]").forEach((button) => {
    button.addEventListener("click", () => {
      switchMode(button.dataset.cosmos).catch(() => {
        liveState.textContent = "public metadata temporarily unavailable";
        liveState.className = "live-state cached";
      });
    });
  });
  document.querySelectorAll("[data-research-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.researchFilter;
      document.querySelectorAll("[data-research-filter]").forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });
      if (publicCache) renderResearchIndex(publicCache.github, filter);
    });
  });
  fetchPublicSurface().catch(() => {
    liveState.textContent = "public metadata temporarily unavailable";
    liveState.className = "live-state cached";
    const status = document.querySelector("#research-index-status");
    if (status) status.textContent = "Public metadata is temporarily unavailable. Open the full source graph directly.";
  });
  resize();
  draw();
})();
