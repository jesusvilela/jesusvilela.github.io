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
  // Editorially curated. A repository only joins the public research portfolio
  // after reviewing its question, inspectable artifacts, evidence and limitations.
  // Research-grade here does NOT mean peer-reviewed or mathematically proved.
  // Do not auto-promote newly discovered GitHub repositories.
  const curatedResearch = [
    { key: "dojo-1/tenth-discriminant", url: "https://github.com/Dojo-1/tenth-discriminant", name: "The Tenth Discriminant", type: "algebraic", evidence: "Lean statement · human review open", description: "Arithmetic and geometry applied to one determinant; a checked 47-billion field endpoint with independent semantic review still outstanding." },
    { key: "jesusvilela/connection_laplacian_lean", url: "https://github.com/jesusvilela/connection_laplacian_lean", name: "Connection Laplacian · Lean", type: "algebraic", evidence: "Lean proofs · stated assumptions", description: "Finite-graph Z/2 connection-Laplacian kernel and spectral statements, with audited formalization and explicit transfer obligations." },
    { key: "dojo-1/cryptid-verifier", url: "https://github.com/Dojo-1/cryptid-verifier", name: "Cryptid verifier", type: "boundary", evidence: "Lean reductions · open problems", description: "Machine-level halting criteria and bounded L17 results. The non-halting questions remain unresolved." },
    { key: "jesusvilela/lambda-sat-solver", url: "https://github.com/jesusvilela/lambda-sat-solver", name: "λSAT", type: "algebraic", evidence: "Certificates · bounded benchmarks", description: "Certificate-checked SAT experiments and hypotheses about structured hardness; benchmark comparisons remain scope-specific." },
    { key: "jesusvilela/igbundle-llm", url: "https://github.com/jesusvilela/IGBundle-LLM", name: "IGBundle-LLM", type: "analytic", evidence: "Experimental · corrected results", description: "Geometric language-model adapters with published controls and retractions; a general geometric advantage is not established." },
    { key: "dojo-1/esmf-0-mathematical-genesis", url: "https://github.com/Dojo-1/ESMF-0-Mathematical-Genesis", name: "ESMF-0 · Mathematical Genesis", type: "analytic", evidence: "Controls · open hypotheses", description: "Experiments in adaptive topology and geometric transport. No demonstrated semantic emergence or biological brain model." },
    { key: "dojo-1/a-synopsis-of-results-in-pure-applied-and-computational-mathematics", url: "https://github.com/Dojo-1/A-Synopsis-of-Results-in-Pure-Applied-and-Computational-Mathematics", name: "A Synopsis of Results", type: "architectural", evidence: "Editorial research atlas · audit limits", description: "Five volumes and 5,000 classified records, not 5,000 original proofs; public PDFs lack the underlying machine-readable registry." },
    { key: "jesusvilela/-lang.s1", url: "https://github.com/jesusvilela/-lang.s1", name: "§-LANG / S1", type: "architectural", evidence: "Bounded executable core · semantic programme", description: "A testable core and sectional language specification. Passing structural checks does not prove the larger mathematical programme." },
    { key: "jesusvilela/trasgo", url: "https://github.com/jesusvilela/trasgo", name: "Trasgo §1", type: "architectural", evidence: "Experimental codec · recorded evaluations", description: "Context compression and typed state-transition experiments, with finite evaluations and explicit model-conformance limits." }
  ];
  const curatedByName = new Map(curatedResearch.map((entry) => [entry.key, entry]));
  const curatedHubModels = new Set(["jesusvilela/manifoldgl"]); // Research execution artifact, not an independent result.
  const githubAccount = "jesusvilela";
  const hfAccount = "jesusvilela";
  const identityNodes = [
    node(0, null, 0, 0, "origin", "Jesús / research identity", "A human-directed research map: formal statements, experiments, conceptual representations and unresolved remainder."),
    node(1, 0, 1, -1.6, "algebraic", "Formal mathematics", "Proof statements, audit boundaries and certificate-bearing computational research."),
    node(2, 0, 1, -.1, "analytic", "Geometric AI experiments", "Geometry as a hypothesis to measure, challenge or revise—not a demonstrated cognitive mechanism."),
    node(3, 0, 1, 1.35, "architectural", "Languages and research atlas", "Specifications, contextual translation and editorial dependencies; semantics do not upgrade proof."),
    node(4, 0, 1, 2.65, "boundary", "Adversarial verification", "Machine-level reductions, corrected interpretations and open halting questions."),
    node(5, 1, 2, -1.95, "algebraic", "Tenth Discriminant", "Lean-checked 47-billion field endpoint; external semantic reconstruction remains open.", "https://github.com/Dojo-1/tenth-discriminant"),
    node(6, 1, 2, -1.3, "algebraic", "Connection Laplacian", "Lean kernel and spectral results, with declared formal scope.", "https://github.com/jesusvilela/connection_laplacian_lean"),
    node(7, 1, 2, -.77, "algebraic", "λSAT", "Certificate-checked SAT frames and scoped hardness experiments.", "https://github.com/jesusvilela/lambda-sat-solver"),
    node(8, 2, 2, -.1, "analytic", "IGBundle-LLM", "Geometric adapters, negative controls and corrected evidence.", "https://github.com/jesusvilela/IGBundle-LLM"),
    node(9, 2, 2, .55, "analytic", "ESMF-0", "Adaptive geometric substrate; empirical cognition hypothesis unresolved.", "https://github.com/Dojo-1/ESMF-0-Mathematical-Genesis"),
    node(10, 3, 2, 1.14, "architectural", "Synopsis of Results", "Research atlas with public editions and declared reproducibility limits.", "https://github.com/Dojo-1/A-Synopsis-of-Results-in-Pure-Applied-and-Computational-Mathematics"),
    node(11, 3, 2, 1.7, "architectural", "§-LANG S1", "Bounded reference core and a wider, explicitly speculative language programme.", "https://github.com/jesusvilela/-lang.s1"),
    node(12, 3, 2, 2.23, "architectural", "Trasgo §1", "Context transport experiments, finite evaluations and verification remainders.", "https://github.com/jesusvilela/trasgo"),
    node(13, 4, 2, 2.85, "boundary", "Cryptid verifier", "Lean halting reductions; non-halting questions still open.", "https://github.com/Dojo-1/cryptid-verifier")
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
    const result = [node(0, null, 0, 0, "origin", `${total} public artifacts`, "Curated research studies and their selectively included execution artifacts; neither the visual map nor a repository name establishes proof.")];

    const ghParent = result.length;
    result.push(node(ghParent, 0, 1, -2.15, "boundary", `GitHub · ${githubRepos.length}`, "Curated formal, experimental and editorial research artifacts with their stated evidence boundaries.", "https://github.com/Dojo-1"));

    const ghSpan = 1.7;
    githubRepos.forEach((repo, index) => {
      const divisor = Math.max(githubRepos.length - 1, 1);
      const angle = -2.15 - ghSpan / 2 + ghSpan * (index / divisor);
      result.push(node(result.length, ghParent, 2, angle, repo.type || "boundary", `${repo.name} · ${repo.language || "repo"}`, repo.description || "Public source artifact.", repo.url));
    });

    const hfParent = result.length;
    result.push(node(hfParent, 0, 1, .75, "analytic", `Hugging Face · ${hfArtifacts.length}`, "Only separately reviewed model execution artifacts are shown here.", `https://huggingface.co/${hfAccount}`));

    const kinds = [["model", -.05, "analytic"], ["dataset", .85, "algebraic"], ["space", 1.75, "architectural"]];
    kinds.forEach(([kind, angle, type]) => {
      const allItems = hfArtifacts.filter((item) => item.kind === kind).sort((a, b) => new Date(b.updated || 0) - new Date(a.updated || 0));
      if (!allItems.length) return;
      const parent = result.length;
      result.push(node(parent, hfParent, 2, angle, type, `${kind}s · ${allItems.length}`, `Selected ${kind} execution artifacts only; these are not independent scientific results.`, `https://huggingface.co/${hfAccount}`));
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
    status.textContent = `${visible.length} ${filter === "all" ? "curated research entries" : `${filter} research entries`} shown · evidence-led selection${status.dataset.partial ? " · source metadata partly unavailable" : ""}`;
    list.innerHTML = visible.map((repo) => `<a class="research-item" href="${escapeHtml(repo.url)}"><span class="research-item-meta"><span>${escapeHtml(repo.type)}</span><span>${escapeHtml(repo.evidence || "research")}</span></span><strong>${escapeHtml(repo.name)}</strong><p>${escapeHtml(repo.description || "Public source artifact. Scope and evidence live with the repository.")}</p><small>open source artifact ↗</small></a>`).join("") || "<p>Nothing in this research lane is public yet.</p>";
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
    const partial = successful.length < sources.length;
    const publicByName = new Map();
    successful.flatMap((entry) => entry.value).forEach((repo) => {
      const key = String(repo.full_name || "").toLowerCase();
      if (curatedByName.has(key) && !publicByName.has(key)) publicByName.set(key, repo);
    });
    // Fallback to the previously checked curation for an unavailable owner,
    // without ever expanding the portfolio to non-curated or private repositories.
    const repos = curatedResearch.filter((entry) => {
      const owner = entry.key.split("/")[0];
      const sourceIndex = owner === "dojo-1" ? 1 : 0;
      return sources[sourceIndex].status === "rejected" || publicByName.has(entry.key);
    }).map((entry) => {
      const metadata = publicByName.get(entry.key);
      return { ...entry, updated: metadata?.updated_at || metadata?.pushed_at || "", language: metadata?.language || "source" };
    });
    const count = document.querySelector("#repo-count");
    if (count) count.textContent = String(repos.length).padStart(2, "0");
    const status = document.querySelector("#research-index-status");
    if (status) {
      if (partial) status.dataset.partial = "true";
      else delete status.dataset.partial;
    }
    return repos;
  }

  async function fetchHuggingFace() {
    const specs = [["model", `https://huggingface.co/api/models?author=${hfAccount}&limit=100&full=true`]];
    const groups = await Promise.all(specs.map(async ([kind, url]) => {
      try {
        const response = await fetch(url);
        if (!response.ok) return [];
        const payload = await response.json();
        if (!Array.isArray(payload)) return [];
        return payload.filter((item) => curatedHubModels.has(String(item.id || item.modelId || "").toLowerCase())).map((item) => {
          const id = item.id || item.modelId || "";
          const name = id.split("/").pop() || id || kind;
          const prefix = kind === "dataset" ? "datasets/" : kind === "space" ? "spaces/" : "";
          const description = "Experimental IGBundle model artifact; read the source repository correction notice before interpreting performance claims.";
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
    liveState.textContent = "checking curated public sources";
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
        ? `source checked · curated GitHub ${surface.github.length} · model artifacts ${surface.huggingface.length}`
        : `curated research surface · ${surface.github.length + surface.huggingface.length} entries`;
      liveState.className = next === "live" ? "live-state online" : "live-state";
    }
    document.querySelector("#projection-label").textContent = next === "identity"
      ? "CONCEPTUAL PROJECTION"
      : next === "live" ? "RESEARCH SOURCE CHECK" : "CURATED RESEARCH CONSTELLATION";
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
