(() => {
  const canvas = document.querySelector("#research-cosmos");
  const detail = document.querySelector("#node-detail");
  const liveState = document.querySelector("#live-state");
  const metadataStatus = document.querySelector("#metadata-status");
  const motionToggle = document.querySelector("#motion-toggle");
  const nodeList = document.querySelector("#cosmos-node-list");
  const stage = document.querySelector(".cosmos-stage");
  if (!canvas || !detail || !liveState || !metadataStatus || !motionToggle || !nodeList || !stage) return;

  const ctx = canvas.getContext("2d");
  canvas.classList.toggle("unavailable", !ctx);
  stage.classList.toggle("canvas-unavailable", !ctx);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colors = {
    origin: "#f8f5ef",
    analytic: "#e8dcc2",
    algebraic: "#72a8b2",
    architectural: "#c77d89",
    boundary: "#9b8bc4"
  };
  const publicRepos = [
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
  const identityNodes = [
    node(0, null, 0, 0, "origin", "Jesús / research identity", "A public interface joining proof, geometry, systems, and adversarial verification.", "", "s"),
    node(1, 0, 1, -1.45, "analytic", "Geometric intelligence", "Information geometry, bundles, sheaves, and hyperbolic representation.", "", "h"),
    node(2, 0, 1, -.15, "algebraic", "Proof engineering", "Lean, symbolic tests, exact witnesses, and rebuildable theorem footprints."),
    node(3, 0, 1, 1.12, "architectural", "Context systems", "Semantic versioning, context compilation, and AI orchestration."),
    node(4, 0, 1, 2.4, "boundary", "Adversarial clarity", "Verification APIs, falsifiers, provenance, and reversible experiments."),
    node(5, 1, 2, -1.78, "analytic", "IGBundle-LLM", "Information-geometric and bundle-aware language-model adaptation.", "https://github.com/jesusvilela/IGBundle-LLM", "h"),
    node(6, 1, 2, -1.12, "analytic", "generational-autoresearch", "AI agents running research on public infrastructure.", "https://github.com/jesusvilela/generational-autoresearch", "s"),
    node(7, 2, 2, -.48, "algebraic", "connection Laplacian", "Formal finite-graph mathematics in Lean.", "https://github.com/jesusvilela/connection_laplacian_lean", "p"),
    node(8, 2, 2, .14, "algebraic", "lambda SAT solver", "Certified structured-region SAT middleware.", "https://github.com/jesusvilela/lambda-sat-solver", "p"),
    node(9, 3, 2, .76, "architectural", "aigit", "AI-native semantic version control built on Git.", "https://github.com/jesusvilela/aigit"),
    node(10, 3, 2, 1.38, "architectural", "trasgo", "Context compilation with a clever, local-first interface.", "https://github.com/jesusvilela/trasgo"),
    node(11, 3, 2, 2.0, "boundary", "NETTRACER", "Route, observe, replay, and audit multiple AI runtimes.", "https://github.com/jesusvilela/NETTRACER"),
    node(12, 4, 2, 2.62, "boundary", "doubt-the-machine", "A deterministic framework for using AI without being fooled.", "https://github.com/Dojo-1/doubt-the-machine", "p")
  ];
  let nodes = identityNodes;
  let mode = "identity";
  let width = 0;
  let height = 0;
  let ratio = 1;
  let selected = 0;
  let phase = 0;
  let repoCache = null;
  let frameRequest = 0;
  let canvasVisible = true;
  let userPaused = false;

  function node(id, parent, ring, angle, type, title, text, url = "", evidence = "s") {
    return { id, parent, ring, angle, type, title, text, url, evidence };
  }

  function resize() {
    if (!ctx) return;
    const box = canvas.getBoundingClientRect();
    const pixelBudgetRatio = Math.sqrt(2000000 / Math.max(box.width * box.height, 1));
    ratio = Math.max(1, Math.min(devicePixelRatio || 1, 2, pixelBudgetRatio));
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

  function drawInstrumentField(center) {
    ctx.save();
    ctx.lineWidth = .7;

    for (let row = 0; row < 7; row += 1) {
      const baseY = height * (.18 + row * .075);
      ctx.beginPath();
      for (let step = 0; step <= 28; step += 1) {
        const x = width * step / 28;
        const distance = Math.abs(x - center.x) / Math.max(width, 1);
        const wave = Math.sin(step * .72 + row * .84 + phase * .35) * (8 + row * 2);
        const y = baseY + wave * (1 - distance * .55);
        if (step === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(114,168,178,${.025 + row * .008})`;
      ctx.stroke();
    }

    for (let spoke = -5; spoke <= 5; spoke += 1) {
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(center.x + spoke * width * .12, height);
      ctx.strokeStyle = "rgba(183,110,121,.035)";
      ctx.stroke();
    }

    const attributes = ["#1d59ff", "#e6d830", "#c13c78", "#72a8b2"];
    attributes.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(18 + index * 12, height - 20, 8, 4);
    });

    if (!reduceMotion) {
      ctx.fillStyle = "rgba(248,245,239,.045)";
      for (let y = 12; y < height; y += 24) {
        for (let x = 12; x < width; x += 24) {
          if ((x / 12 + y / 12) % 5 === 0) ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    ctx.restore();
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
    drawInstrumentField(center);

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

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(bendX + 4, bendY - 4, b.x, b.y);
      ctx.strokeStyle = index === selected
        ? `${colors[item.type]}88` : "rgba(114,168,178,.055)";
      ctx.lineWidth = .55;
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
    if (!reduceMotion) {
      phase += .008;
      requestDraw();
    }
  }

  function shouldAnimate() {
    return !reduceMotion && canvasVisible && !document.hidden && !userPaused;
  }

  function requestDraw() {
    if (!ctx) return;
    if (frameRequest || (phase > 0 && !shouldAnimate())) return;
    frameRequest = requestAnimationFrame(() => {
      frameRequest = 0;
      draw();
    });
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
    const evidenceLabels = {
      metadata: "Metadata · repository fact",
      p: "P · inspectable artifact",
      h: "H · hypothesis",
      s: "S · metaphor / proposal"
    };
    const indexLabel = document.createElement("span");
    const title = document.createElement("h3");
    const text = document.createElement("p");
    const evidence = document.createElement("span");
    const action = document.createElement("small");
    indexLabel.className = "node-index";
    indexLabel.textContent = `${String(item.id).padStart(2, "0")} · ${item.type}`;
    title.textContent = item.title;
    text.textContent = item.text;
    evidence.className = `status ${item.evidence}`;
    evidence.textContent = evidenceLabels[item.evidence];
    action.id = "cosmos-help";
    if (item.url) {
      const link = document.createElement("a");
      link.href = item.url;
      link.textContent = "open public repository ↗";
      action.append(link);
    } else {
      action.textContent = "hover · touch · arrow keys to select";
    }
    detail.replaceChildren(indexLabel, title, text, evidence, action);
    canvas.setAttribute("aria-label", `Selected: ${item.title}. ${item.text}${item.url ? " Press Enter to open its public repository." : ""}`);
    nodeList.querySelectorAll("button").forEach((button, buttonIndex) => {
      if (buttonIndex === index) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    if (!shouldAnimate()) requestDraw();
  }

  function renderNodeList() {
    const items = nodes.map((item, index) => {
      const listItem = document.createElement("li");
      const selectButton = document.createElement("button");
      selectButton.type = "button";
      selectButton.textContent = item.title;
      selectButton.addEventListener("click", () => show(index));
      listItem.append(selectButton);
      if (item.url) {
        const sourceLink = document.createElement("a");
        sourceLink.href = item.url;
        sourceLink.textContent = "source ↗";
        sourceLink.setAttribute("aria-label", `Inspect public source for ${item.title}`);
        listItem.append(sourceLink);
      }
      return listItem;
    });
    nodeList.replaceChildren(...items);
  }

  function buildPublicNodes(repos, evidence = "metadata") {
    const description = evidence === "metadata"
      ? "A live constellation built from public GitHub repository facts."
      : "A curated constellation of public, inspectable repositories.";
    const result = [node(0, null, 0, 0, "origin", `${repos.length} public systems`, description, "", evidence)];
    const groups = new Map();
    repos.forEach((repo) => {
      const language = repo.language || "Other";
      if (!groups.has(language)) groups.set(language, []);
      groups.get(language).push(repo);
    });
    const entries = [...groups.entries()];
    entries.forEach(([language, reposInLanguage], index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / entries.length;
      const type = ["algebraic", "architectural", "analytic", "boundary"][index % 4];
      const parent = result.length;
      const groupText = evidence === "metadata"
        ? `Public systems whose primary GitHub language is ${language}.`
        : "An editorial grouping of public systems; inspect each repository for technical detail.";
      result.push(node(parent, 0, 1, angle, type, `${language} · ${reposInLanguage.length}`, groupText, "", evidence));
      reposInLanguage.forEach((repo, childIndex) => {
        const spread = (childIndex - (reposInLanguage.length - 1) / 2) * .18;
        result.push(node(
          result.length, parent, 2, angle + spread, type,
          evidence === "metadata" ? `${repo.name} · ★${repo.stars}` : repo.name,
          repo.description || "Public research and engineering artifact.",
          repo.url,
          evidence
        ));
      });
    });
    return result;
  }

  async function fetchRepos() {
    if (repoCache) return repoCache;
    liveState.textContent = "reading public GitHub metadata";
    liveState.className = "live-state cached";
    const rateResponse = await fetch("https://api.github.com/rate_limit", {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!rateResponse.ok) throw new Error("public metadata status unavailable");
    const rate = await rateResponse.json();
    if ((rate.resources?.core?.remaining ?? 0) < 2) {
      throw new Error("public metadata rate limit reached");
    }
    const responses = await Promise.all([
      "https://api.github.com/users/jesusvilela/repos?per_page=100",
      "https://api.github.com/orgs/Dojo-1/repos?per_page=100"
    ].map((url) =>
      fetch(url, {
        headers: { Accept: "application/vnd.github+json" }
      })
    ));
    if (!responses.every((response) => response.ok)) throw new Error("public metadata unavailable");
    const payloads = await Promise.all(responses.map((response) => response.json()));
    const selectedNames = new Set(publicRepos.map(([owner, repo]) => `${owner}/${repo}`.toLowerCase()));
    const repos = payloads.flat().filter((repo) => selectedNames.has(repo.full_name.toLowerCase())).map((repo) => {
      return {
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url,
        updated: repo.updated_at
      };
    });
    if (repos.length !== publicRepos.length) throw new Error("public metadata incomplete");
    document.querySelector("#repo-count").textContent = String(repos.length).padStart(2, "0");
    document.querySelector("#star-count").textContent = String(repos.reduce((sum, repo) => sum + repo.stars, 0)).padStart(2, "0");
    document.querySelector("#pulse-date").textContent = `metadata · refreshed ${new Date().toLocaleTimeString()}`;
    metadataStatus.textContent = "metadata · live GitHub data, never proof quality";
    repoCache = repos;
    if (mode === "identity") {
      liveState.textContent = "local public projection · metadata connected";
      liveState.className = "live-state online";
    }
    return repoCache;
  }

  async function switchMode(next) {
    mode = next;
    if (next === "identity") {
      nodes = identityNodes;
      liveState.textContent = "local public projection";
      liveState.className = "live-state";
    } else if (next === "public") {
      const repos = publicRepos.map(([owner, repo], index) => ({
        name: repo,
        description: "Public research and engineering artifact. Open the repository for its current scope and evidence.",
        language: ["verification", "infrastructure", "formal systems"][index % 3],
        url: `https://github.com/${owner}/${repo}`
      }));
      nodes = buildPublicNodes(repos, "p");
      liveState.textContent = `${repos.length} curated public repositories · P`;
      liveState.className = "live-state";
    } else {
      const repos = await fetchRepos();
      nodes = buildPublicNodes(repos);
      liveState.textContent = `live public pulse · refreshed ${new Date().toLocaleTimeString()}`;
      liveState.className = "live-state online";
    }
    document.querySelector("#projection-label").textContent = next === "identity"
      ? "POINCARÉ PROJECTION" : next === "live" ? "LIVE REPOSITORY PULSE" : "PUBLIC CONSTELLATION";
    document.querySelectorAll("[data-cosmos]").forEach((button) => {
      button.classList.toggle("active", button.dataset.cosmos === next);
    });
    selected = 0;
    renderNodeList();
    show(0);
    resize();
    requestDraw();
  }

  addEventListener("resize", () => {
    resize();
    requestDraw();
  });
  document.addEventListener("visibilitychange", requestDraw);
  addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--px", `${event.clientX / innerWidth * 100}%`);
    document.documentElement.style.setProperty("--py", `${event.clientY / innerHeight * 100}%`);
  }, { passive: true });
  canvas.addEventListener("pointermove", select);
  canvas.addEventListener("pointerdown", select);
  canvas.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      show((selected + 1) % nodes.length);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      show((selected - 1 + nodes.length) % nodes.length);
    } else if (event.key === "Enter" && nodes[selected].url) {
      window.open(nodes[selected].url, "_blank", "noopener");
    }
  });
  motionToggle.addEventListener("click", () => {
    userPaused = !userPaused;
    motionToggle.setAttribute("aria-pressed", String(userPaused));
    motionToggle.textContent = userPaused ? "resume field" : "pause field";
    if (!userPaused) requestDraw();
  });
  document.querySelectorAll("[data-cosmos]").forEach((button) => {
    button.addEventListener("click", () => {
      switchMode(button.dataset.cosmos).catch(() => {
        liveState.textContent = "public metadata temporarily unavailable";
        liveState.className = "live-state cached";
      });
    });
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      canvasVisible = entry.isIntersecting;
      if (canvasVisible) requestDraw();
    }, { rootMargin: "120px" }).observe(canvas);
  }
  resize();
  renderNodeList();
  show(0);
  if (!ctx) {
    liveState.textContent = "semantic public projection · canvas unavailable";
    liveState.className = "live-state cached";
  }
  requestDraw();
})();
