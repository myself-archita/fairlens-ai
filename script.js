const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navLinkItems = document.querySelectorAll(".nav-links a");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = event.target.closest(".nav");
    if (!clickedInsideNav) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const revealElements = document.querySelectorAll(".reveal");
const fastReveal = window.matchMedia("(max-width: 768px)").matches;

if (fastReveal) {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.06,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element) => {
    element.style.transitionDelay = "0ms";
    revealObserver.observe(element);
  });
}

const scenarios = {
  lending: {
    title: "Loan approval model v4.2",
    risk: "High risk",
    riskClass: "danger",
    riskLabel: "HIGH",
    gapPercent: "18%",
    status: "Flagged",
    lowestGroup: "Group C",
    chart: [
      { label: "Group A", value: 82, tone: "high" },
      { label: "Group B", value: 63, tone: "medium" },
      { label: "Group C", value: 46, tone: "low" },
    ],
    description:
      "The model approves urban applicants more often than rural applicants even when income and repayment history are similar.",
    impact: "0.68",
    gap: "14%",
    confidence: "91/100",
    finding:
      "Bias detected in Group C due to significant disparity (46% vs 82%). This indicates potential underrepresentation or imbalance in training data. Suggested mitigation includes reweighting or threshold adjustment.",
    fix:
      "Remove postcode-weighted features, widen the human-review band for borderline cases, and re-audit the model before release.",
    signals: [
      ["Approval rate parity", "Fail", "danger-text"],
      ["Proxy variable detection", "Watch", "warning-text"],
      ["Explanation consistency", "Pass", "success-text"],
    ],
  },
  hiring: {
    title: "Resume screening model v2.9",
    risk: "Medium risk",
    riskClass: "warning",
    riskLabel: "MEDIUM",
    gapPercent: "11%",
    status: "Flagged",
    lowestGroup: "Group B",
    chart: [
      { label: "Group A", value: 72, tone: "high" },
      { label: "Group B", value: 54, tone: "medium" },
      { label: "Group C", value: 61, tone: "medium" },
    ],
    description:
      "The hiring model ranks candidates from elite colleges and specific career gaps more favorably, creating a gender-skewed shortlist.",
    impact: "0.79",
    gap: "9%",
    confidence: "88/100",
    finding:
      "Bias detected in Group B due to significant disparity (54% vs 72%). This indicates historical screening preferences may be influencing the model. Suggested mitigation includes feature normalization and shortlist threshold review.",
    fix:
      "Reduce school prestige weighting, normalize career-gap features, and require manual review for borderline shortlist decisions.",
    signals: [
      ["Shortlist rate parity", "Watch", "warning-text"],
      ["Feature proxy detection", "Fail", "danger-text"],
      ["Interview progression parity", "Pass", "success-text"],
    ],
  },
  healthcare: {
    title: "Triage prioritization model v1.6",
    risk: "High risk",
    riskClass: "danger",
    riskLabel: "HIGH",
    gapPercent: "21%",
    status: "Flagged",
    lowestGroup: "Group C",
    chart: [
      { label: "Group A", value: 79, tone: "high" },
      { label: "Group B", value: 58, tone: "medium" },
      { label: "Group C", value: 41, tone: "low" },
    ],
    description:
      "Patients from lower-income neighborhoods are assigned lower urgency scores because historical healthcare usage is being mistaken for health need.",
    impact: "0.63",
    gap: "17%",
    confidence: "94/100",
    finding:
      "Bias detected in Group C due to significant disparity (41% vs 79%). This indicates spending history may be acting as a harmful proxy for medical need. Suggested mitigation includes replacing cost-linked features and tightening clinician review.",
    fix:
      "Replace cost-history proxies with clinical severity features, add clinician override review, and monitor outcome parity after deployment.",
    signals: [
      ["Urgency score parity", "Fail", "danger-text"],
      ["Clinical feature sufficiency", "Watch", "warning-text"],
      ["Reviewer override coverage", "Pass", "success-text"],
    ],
  },
};

const chips = document.querySelectorAll(".scenario-chip");
const title = document.getElementById("scenario-title");
const risk = document.getElementById("scenario-risk");
const description = document.getElementById("scenario-description");
const impact = document.getElementById("metric-impact");
const gap = document.getElementById("metric-gap");
const confidence = document.getElementById("metric-confidence");
const finding = document.getElementById("scenario-finding");
const fix = document.getElementById("scenario-fix");
const signalList = document.getElementById("signal-list");
const heroRiskPill = document.getElementById("hero-risk-pill");
const heroBiasGap = document.getElementById("hero-bias-gap");
const heroRiskLevel = document.getElementById("hero-risk-level");
const heroLowGroup = document.getElementById("hero-low-group");
const heroExplainScore = document.getElementById("hero-explain-score");
const heroReviewCopy = document.getElementById("hero-review-copy");
const metricRiskCard = document.getElementById("metric-risk-card");
const metricGapCard = document.getElementById("metric-gap-card");
const metricStatusCard = document.getElementById("metric-status-card");
const metricRiskCopy = document.getElementById("metric-risk-copy");
const metricGapCopy = document.getElementById("metric-gap-copy");
const metricStatusCopy = document.getElementById("metric-status-copy");
const alertTitle = document.getElementById("alert-title");
const alertGroup = document.getElementById("alert-group");
const alertRisk = document.getElementById("alert-risk");
const auditTimestamp = document.getElementById("audit-timestamp");
const runAuditButton = document.getElementById("run-audit");
const runAuditLabel = document.getElementById("run-audit-label");
const compareLabelA = document.getElementById("compare-label-a");
const compareLabelB = document.getElementById("compare-label-b");
const compareLabelC = document.getElementById("compare-label-c");
const compareValueA = document.getElementById("compare-value-a");
const compareValueB = document.getElementById("compare-value-b");
const compareValueC = document.getElementById("compare-value-c");
const compareFillA = document.getElementById("compare-fill-a");
const compareFillB = document.getElementById("compare-fill-b");
const compareFillC = document.getElementById("compare-fill-c");

const renderSignals = (items) => {
  if (!signalList) return;

  signalList.innerHTML = items
    .map(
      ([label, status, tone]) => `
        <div class="signal-row">
          <span>${label}</span>
          <strong class="signal-status ${tone}">${status}</strong>
        </div>
      `
    )
    .join("");
};

const renderComparisonChart = (items = []) => {
  const entries = [items[0], items[1], items[2]];
  const labelNodes = [compareLabelA, compareLabelB, compareLabelC];
  const valueNodes = [compareValueA, compareValueB, compareValueC];
  const fillNodes = [compareFillA, compareFillB, compareFillC];

  entries.forEach((entry, index) => {
    if (!entry || !labelNodes[index] || !valueNodes[index] || !fillNodes[index]) {
      return;
    }

    labelNodes[index].textContent = entry.label;
    valueNodes[index].textContent = `${entry.value}%`;
    fillNodes[index].style.width = `${entry.value}%`;
    fillNodes[index].className = `comparison-fill ${entry.tone}`;
  });
};

const setScenario = (key) => {
  const scenario = scenarios[key];
  if (!scenario || !title || !risk || !description || !impact || !gap || !confidence || !finding || !fix) {
    return;
  }

  title.textContent = scenario.title;
  risk.textContent = scenario.risk;
  risk.className = `pill ${scenario.riskClass}`;
  description.textContent = scenario.description;
  impact.textContent = scenario.impact;
  gap.textContent = scenario.gap;
  confidence.textContent = scenario.confidence;
  finding.textContent = scenario.finding;
  fix.textContent = scenario.fix;
  if (heroRiskPill) {
    heroRiskPill.textContent = `${scenario.riskLabel} bias review`;
    heroRiskPill.className = `pill ${scenario.riskClass}`;
  }
  if (heroBiasGap) heroBiasGap.textContent = scenario.gapPercent;
  if (heroRiskLevel) heroRiskLevel.textContent = scenario.riskLabel;
  if (heroLowGroup) heroLowGroup.textContent = scenario.lowestGroup;
  if (heroExplainScore) heroExplainScore.textContent = scenario.confidence;
  if (heroReviewCopy) heroReviewCopy.textContent = scenario.finding;
  if (metricRiskCard) metricRiskCard.textContent = scenario.riskLabel;
  if (metricGapCard) metricGapCard.textContent = scenario.gapPercent;
  if (metricStatusCard) metricStatusCard.textContent = scenario.status;
  if (metricRiskCopy) metricRiskCopy.textContent = `${scenario.lowestGroup} requires attention`;
  if (metricGapCopy) metricGapCopy.textContent = "Difference across monitored groups";
  if (metricStatusCopy) metricStatusCopy.textContent = `${scenario.status} for release review`;
  if (alertTitle) alertTitle.textContent = `${scenario.riskLabel === "HIGH" ? "High" : "Moderate"} Bias Detected`;
  if (alertGroup) alertGroup.textContent = `${scenario.lowestGroup} shows lowest fairness score`;
  if (alertRisk) alertRisk.textContent = `Risk Level: ${scenario.riskLabel}`;
  if (auditTimestamp) auditTimestamp.textContent = "Updated just now";
  renderComparisonChart(scenario.chart);
  renderSignals(scenario.signals);

  chips.forEach((chip) => {
    const active = chip.dataset.scenario === key;
    chip.classList.toggle("active", active);
    chip.setAttribute("aria-pressed", String(active));
  });
};

const runAudit = () => {
  if (!runAuditButton || !runAuditLabel) {
    return;
  }

  runAuditButton.classList.add("loading");
  runAuditButton.disabled = true;
  runAuditLabel.textContent = "Running audit...";

  window.setTimeout(() => {
    const activeScenario = [...chips].find((chip) => chip.classList.contains("active"))?.dataset.scenario || "lending";
    setScenario(activeScenario);
    runAuditButton.classList.remove("loading");
    runAuditButton.disabled = false;
    runAuditLabel.textContent = "Run Audit";
    if (auditTimestamp) {
      auditTimestamp.textContent = "Updated 1 sec ago";
    }
  }, 1400);
};

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    setScenario(chip.dataset.scenario);
  });
});

runAuditButton?.addEventListener("click", runAudit);

const sampleJudgeData = `group,approved
urban,1
urban,1
urban,1
urban,0
rural,1
rural,0
rural,0
rural,0`;

const judgeInput = document.getElementById("judge-data");
const judgeAnalyze = document.getElementById("analyze-judge-data");
const judgeReset = document.getElementById("load-sample-data");
const judgeRateA = document.getElementById("judge-rate-a");
const judgeRateB = document.getElementById("judge-rate-b");
const judgeImpact = document.getElementById("judge-impact");
const judgeSummary = document.getElementById("judge-summary");
const judgeGroups = document.getElementById("judge-groups");

const toPercent = (value) => `${Math.round(value * 100)}%`;

const parseJudgeData = (raw) => {
  const rows = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length < 3) {
    throw new Error("Add a header row and at least two data rows.");
  }

  const header = rows[0].split(",").map((cell) => cell.trim().toLowerCase());
  const groupIndex = header.indexOf("group");
  const approvedIndex = header.indexOf("approved");

  if (groupIndex === -1 || approvedIndex === -1) {
    throw new Error("CSV must include 'group' and 'approved' columns.");
  }

  const stats = new Map();

  rows.slice(1).forEach((row) => {
    const cells = row.split(",").map((cell) => cell.trim());
    const group = cells[groupIndex];
    const approvedRaw = cells[approvedIndex];
    const approved = approvedRaw === "1" || approvedRaw.toLowerCase() === "true" ? 1 : 0;

    if (!group) {
      return;
    }

    const current = stats.get(group) || { total: 0, approved: 0 };
    current.total += 1;
    current.approved += approved;
    stats.set(group, current);
  });

  if (stats.size !== 2) {
    throw new Error("Use exactly two group names so FairLens can compare them clearly.");
  }

  return [...stats.entries()].map(([group, values]) => ({
    group,
    rate: values.total ? values.approved / values.total : 0,
  }));
};

const renderJudgeAnalysis = (raw) => {
  if (!judgeRateA || !judgeRateB || !judgeImpact || !judgeSummary || !judgeGroups) {
    return;
  }

  try {
    const results = parseJudgeData(raw).sort((a, b) => b.rate - a.rate);
    const [first, second] = results;
    const impactValue = first.rate === 0 ? 0 : second.rate / first.rate;
    const severity =
      impactValue < 0.8
        ? "Bias risk is high because one group is being approved much less often than the other."
        : "Bias risk looks lower in this sample, but you should still inspect features, errors, and edge cases.";

    judgeRateA.textContent = `${first.group}: ${toPercent(first.rate)}`;
    judgeRateB.textContent = `${second.group}: ${toPercent(second.rate)}`;
    judgeImpact.textContent = impactValue.toFixed(2);
    judgeSummary.textContent = severity;
    judgeGroups.textContent = `${first.group} and ${second.group}`;
  } catch (error) {
    judgeRateA.textContent = "--";
    judgeRateB.textContent = "--";
    judgeImpact.textContent = "--";
    judgeSummary.textContent = error.message;
    judgeGroups.textContent = "waiting for valid CSV input";
  }
};

judgeAnalyze?.addEventListener("click", () => {
  renderJudgeAnalysis(judgeInput?.value || "");
});

judgeReset?.addEventListener("click", () => {
  if (judgeInput) {
    judgeInput.value = sampleJudgeData;
  }
  renderJudgeAnalysis(sampleJudgeData);
});

renderJudgeAnalysis(sampleJudgeData);
