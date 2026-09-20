(() => {
  const root = document.querySelector("#science-cycle");
  if (!root) return;

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const graphNodes = Array.from(root.querySelectorAll("[data-cycle-step]"));
  const spark = root.querySelector("#cycle-spark");
  const run = root.querySelector("#cycle-run");
  const reset = root.querySelector("#cycle-reset");
  const evidenceButtons = Array.from(root.querySelectorAll("[data-evidence]"));

  const detail = {
    evidence: root.querySelector("#cycle-evidence"),
    index: root.querySelector("#cycle-index"),
    title: root.querySelector("#cycle-step-title"),
    body: root.querySelector("#cycle-step-body"),
    output: root.querySelector("#cycle-output"),
    kill: root.querySelector("#cycle-kill"),
    remainder: root.querySelector("#cycle-remainder")
  };

  const steps = {
    question: ["H","Question","State the phenomenon or claim before the story around it.","A claim narrow enough to test.","Name a result that would make the favored interpretation untenable.","Unknowns remain explicit rather than being filled by narrative."],
    operationalize: ["A","Operationalize","Translate the idea into observables, types, units, boundaries, and assumptions.","A measurable or formally checkable object.","If the operationalization cannot distinguish the intended claim from a plausible alternative, redesign it.","The concept-to-instrument bridge stays typed as an assumption until earned."],
    baseline: ["A","Freeze the baseline","Choose classical and matched controls before seeing the result you want.","A comparison that isolates what actually changed.","If compute, data, tuning, or information access is not matched, the mechanism claim is not licensed.","Unmatched resources remain visible rather than being absorbed into the headline."],
    instrument: ["A","Build the instrument","Make the measurement, proof kernel, benchmark, or executable fixture reconstructable.","An artifact another researcher can inspect or rerun.","If the reported method and executable artifact diverge, treat the implementation gap as evidence against closure.","Instrumentation error stays separate from the phenomenon."],
    measure: ["M","Measure","Record bounded observations with uncertainty, seeds, ranges, and effect size where relevant.","A measured result inside a named scope.","Instability across seeds, splits, ranges, or sensible nulls blocks promotion.","Finite behavior is not silently upgraded into a universal law."],
    attack: ["M","Attack the interpretation","Use counterexamples, matched nulls, ablations, perturbations, negators, and adversarial reframings.","A smaller set of explanations that still survive.","If a simpler control explains the signal, retire the special interpretation.","Discovery value may survive even when the original story does not."],
    replicate: ["M","Replicate","Move across seeds, implementations, datasets, environments, or independent reconstruction where feasible.","Evidence about robustness rather than one successful run.","Failure to reproduce constrains scope or returns the claim to hypothesis.","External validity remains open unless the new domain was actually tested."],
    gate: ["P/M/R","Evidence gate","Promote only what survived. Hold the rest. Retire what broke without erasing the path.","P, A, M, H, S, or R — never stronger than the evidence licenses.","A later correction supersedes an attractive earlier interpretation.","The unresolved remainder becomes the next question, not a hidden footnote."]
  };

  const coords = {
    question:[310,70], operationalize:[480,140], baseline:[550,310], instrument:[480,480],
    measure:[310,550], attack:[140,480], replicate:[70,310], gate:[140,140]
  };

  const evidenceNotes = {
    P:"P · Proved — exact typed statement or formally closed object; proof does not automatically establish a broader intended-world bridge.",
    A:"A · Axiomatized — depends on an explicit assumption, surrogate, encoding, or bridge that must stay visible.",
    M:"M · Measured — observed under a bounded instrument, dataset, parameter range, and controls; not an asymptotic theorem.",
    H:"H · Hypothesis — conjecture, mechanism proposal, theorem target, or open bridge awaiting discriminating evidence.",
    S:"S · Semantic — ontology, metaphor, interface, or design language; useful for hypotheses, not proof.",
    R:"R · Retired — corrected, killed, or superseded by stronger controls, bug analysis, scaling, or counterexample."
  };

  let active = "question";
  let timer = null;

  function choose(key, focusNode) {
    const item = steps[key];
    if (!item) return;
    active = key;
    graphNodes.forEach(function(node) {
      const on = node.dataset.cycleStep === key;
      node.classList.toggle("active", on);
      node.setAttribute("aria-pressed", String(on));
      if (on && focusNode) node.focus();
    });
    const keys = Object.keys(steps);
    const idx = keys.indexOf(key);
    detail.evidence.textContent = item[0];
    detail.index.textContent = String(idx + 1).padStart(2, "0") + " / 08";
    detail.title.textContent = item[1];
    detail.body.textContent = item[2];
    detail.output.textContent = item[3];
    detail.kill.textContent = item[4];
    detail.remainder.textContent = item[5];
    if (spark && coords[key]) {
      spark.setAttribute("cx", coords[key][0]);
      spark.setAttribute("cy", coords[key][1]);
    }
  }

  graphNodes.forEach(function(node) {
    node.addEventListener("click", function() { choose(node.dataset.cycleStep, false); });
    node.addEventListener("keydown", function(event) {
      if (["Enter"," ","ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].indexOf(event.key) < 0) return;
      event.preventDefault();
      const keys = Object.keys(steps);
      const here = keys.indexOf(node.dataset.cycleStep);
      if (event.key === "Enter" || event.key === " ") {
        choose(keys[here], false);
        return;
      }
      const delta = (event.key === "ArrowLeft" || event.key === "ArrowUp") ? -1 : 1;
      choose(keys[(here + delta + keys.length) % keys.length], true);
    });
  });

  if (run) run.addEventListener("click", function() {
    if (timer) {
      clearInterval(timer);
      timer = null;
      run.textContent = "run one cycle";
      return;
    }
    const keys = Object.keys(steps);
    let idx = keys.indexOf(active);
    if (reduceMotion) {
      choose("gate", false);
      return;
    }
    run.textContent = "pause cycle";
    timer = setInterval(function() {
      idx = (idx + 1) % keys.length;
      choose(keys[idx], false);
      if (idx === keys.length - 1) {
        clearInterval(timer);
        timer = null;
        run.textContent = "run one cycle";
      }
    }, 760);
  });

  if (reset) reset.addEventListener("click", function() {
    if (timer) clearInterval(timer);
    timer = null;
    if (run) run.textContent = "run one cycle";
    choose("question", false);
  });

  evidenceButtons.forEach(function(button) {
    button.addEventListener("click", function() {
      evidenceButtons.forEach(function(other) { other.classList.toggle("active", other === button); });
      const note = root.querySelector("#evidence-note");
      if (note) note.textContent = evidenceNotes[button.dataset.evidence] || "";
    });
  });

  const bridge = document.querySelector("#substrates");
  const bridgeButton = document.querySelector("#bridge-mode");
  const modes = [["loop","closed research loop"],["source","source → execution"],["execution","execution → source"]];
  let bridgeIndex = 0;
  if (bridge && bridgeButton) {
    bridgeButton.addEventListener("click", function() {
      bridgeIndex = (bridgeIndex + 1) % modes.length;
      bridge.dataset.bridgeMode = modes[bridgeIndex][0];
      const label = bridgeButton.querySelector("small");
      if (label) label.textContent = modes[bridgeIndex][1];
    });
  }

  choose("question", false);
})();