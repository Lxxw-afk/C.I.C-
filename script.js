const evidenceData = [
  {
    id: 1,
    code: "P1",
    name: "Sang victime",
    category: "Biologique",
    description: "Trace de sang appartenant à la victime.",
    x: 1270,
    y: 789,
    r: 28,
    bloodProfile: {
      fullName: "Lucas Martin",
      birthDate: "12/08/1997",
      sex: "Homme",
      bloodGroup: "A+",
      country: "France",
      fingerprint: "7845123698754412"
    }
  },
  {
    id: 2,
    code: "P2",
    name: "Balle ensanglantée",
    category: "Projectile",
    description: "Projectile tiré par l'auteur en fuite.",
    x: 1635,
    y: 990,
    r: 36,
    bloodProfile: {
      fullName: "Sarah Moreau",
      birthDate: "03/11/1994",
      sex: "Femme",
      bloodGroup: "O-",
      country: "France",
      fingerprint: "9912457800341187"
    },
    ballisticsProfile: {
      ammoType: "9mm",
      weaponType: "Pistol",
      serialNumber: "FT-8821-09"
    }
  },
  {
    id: 3,
    code: "P3",
    name: "Arme de la victime",
    category: "Arme à feu",
    description: "Arme appartenant à la victime.",
    x: 1160,
    y: 973,
    r: 42,
    ballisticsProfile: {
      ammoType: "9mm",
      weaponType: "Pistol",
      serialNumber: "LM-1208-97"
    }
  },
  {
    id: 4,
    code: "P4",
    name: "Douille 1",
    category: "Balistique",
    description: "Douille tirée par le tireur en fuite.",
    x: 736,
    y: 1133,
    r: 20,
    ballisticsProfile: {
      ammoType: "9mm",
      weaponType: "Pistol",
      serialNumber: "FT-8821-09"
    }
  },
  {
    id: 5,
    code: "P5",
    name: "Douille 2",
    category: "Balistique",
    description: "Seconde douille tirée par le tireur.",
    x: 363,
    y: 850,
    r: 22,
    ballisticsProfile: {
      ammoType: "9mm",
      weaponType: "Pistol",
      serialNumber: "FT-8821-09"
    }
  }
];

const state = {
  foundEvidenceIds: [],
  selectedEvidenceId: null,
  analysisCount: 0,
  tabletOpen: false,
  currentTab: "adn"
};

const sceneSvg = document.getElementById("sceneSvg");
const inventory = document.getElementById("inventory");
const resultBox = document.getElementById("resultBox");
const journal = document.getElementById("journal");
const foundCount = document.getElementById("foundCount");
const totalCount = document.getElementById("totalCount");
const analysisCountEl = document.getElementById("analysisCount");
const tabletState = document.getElementById("tabletState");

const tabletOverlay = document.getElementById("tabletOverlay");
const tabletToggleBtn = document.getElementById("tabletToggleBtn");
const closeTabletBtn = document.getElementById("closeTabletBtn");
const proofList = document.getElementById("proofList");
const tabletSelectedTitle = document.getElementById("tabletSelectedTitle");
const tabletSelectedMeta = document.getElementById("tabletSelectedMeta");
const tabletOutput = document.getElementById("tabletOutput");
const resetBtn = document.getElementById("resetBtn");
const tabButtons = document.querySelectorAll(".tab-btn");

function init() {
  totalCount.textContent = evidenceData.length;
  renderEvidence();
  renderInventory();
  renderProofList();
  updateTabletSelection();
  updateStats();
  renderCurrentTab();
  addLog("Système lancé. Début de la fouille de la scène.");
}

function renderEvidence() {
  sceneSvg.innerHTML = "";

  evidenceData.forEach((item) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", item.x);
    circle.setAttribute("cy", item.y);
    circle.setAttribute("r", item.r);
    circle.setAttribute("class", "evidence-node");
    circle.setAttribute("data-id", item.id);
    circle.setAttribute("pointer-events", "all");

    if (state.foundEvidenceIds.includes(item.id)) {
      circle.classList.add("found");
    }

    circle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      collectEvidence(item.id);
    });

    sceneSvg.appendChild(circle);
  });
}

function collectEvidence(id) {
  const item = getEvidenceById(id);
  if (!item) return;

  if (state.foundEvidenceIds.includes(id)) {
    setResult(`Cette preuve a déjà été récupérée : ${item.name}`);
    return;
  }

  state.foundEvidenceIds.push(id);
  state.selectedEvidenceId = id;

  renderEvidence();
  renderInventory();
  renderProofList();
  updateTabletSelection();
  updateStats();
  renderCurrentTab();

  setResult(
    `Preuve récupérée : ${item.name}\n${item.description}\n\nOuvre la tablette avec T pour consulter les onglets ADN, Balistique et Comparaison.`
  );

  addLog(`Preuve récupérée : ${item.name}.`);
}

function renderInventory() {
  inventory.innerHTML = "";

  const items = evidenceData.filter((item) =>
    state.foundEvidenceIds.includes(item.id)
  );

  if (!items.length) {
    inventory.innerHTML = '<div class="empty">Aucune preuve récupérée pour le moment.</div>';
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "inventory-item";

    card.innerHTML = `
      <div class="inventory-header">
        <div>
          <div class="inventory-name">${item.code} • ${item.name}</div>
          <div class="inventory-desc">${item.description}</div>
        </div>
        <div class="badge">${item.category}</div>
      </div>
      <div class="inventory-actions">
        <button class="btn secondary">Sélectionner</button>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => {
      state.selectedEvidenceId = item.id;
      renderProofList();
      updateTabletSelection();
      renderCurrentTab();
      setResult(`Preuve sélectionnée : ${item.name}\nConsulte maintenant les onglets de la tablette.`);
      addLog(`Preuve sélectionnée : ${item.name}.`);
    });

    inventory.appendChild(card);
  });
}

function renderProofList() {
  proofList.innerHTML = "";

  const items = evidenceData.filter((item) =>
    state.foundEvidenceIds.includes(item.id)
  );

  if (!items.length) {
    proofList.innerHTML = '<div class="empty">Aucune preuve disponible.</div>';
    return;
  }

  items.forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "proof-btn";

    if (state.selectedEvidenceId === item.id) {
      btn.classList.add("active");
    }

    btn.innerHTML = `${item.code} • ${item.name}<small>${item.category}</small>`;

    btn.addEventListener("click", () => {
      state.selectedEvidenceId = item.id;
      renderProofList();
      updateTabletSelection();
      renderCurrentTab();
      addLog(`Tablette : preuve sélectionnée ${item.name}.`);
    });

    proofList.appendChild(btn);
  });
}

function updateTabletSelection() {
  const selected = getEvidenceById(state.selectedEvidenceId);

  if (!selected) {
    tabletSelectedTitle.textContent = "Aucune preuve sélectionnée";
    tabletSelectedMeta.textContent = "Collecte une preuve pour commencer.";
    return;
  }

  tabletSelectedTitle.textContent = `${selected.code} • ${selected.name}`;
  tabletSelectedMeta.textContent = `${selected.category} • ${selected.description}`;
}

function renderCurrentTab() {
  const selected = getEvidenceById(state.selectedEvidenceId);

  tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === state.currentTab);
  });

  if (!selected) {
    tabletOutput.textContent = "Sélectionne une preuve, puis choisis un onglet.";
    return;
  }

  state.analysisCount += 1;
  updateStats();

  if (state.currentTab === "adn") {
    renderADNTab(selected);
    return;
  }

  if (state.currentTab === "balistique") {
    renderBallisticsTab(selected);
    return;
  }

  if (state.currentTab === "comparaison") {
    renderComparisonTab(selected);
  }
}

function renderADNTab(selected) {
  if (!selected.bloodProfile) {
    tabletOutput.textContent =
      `ONGLET ADN\n\n` +
      `Preuve : ${selected.code} • ${selected.name}\n\n` +
      `Aucune donnée biologique exploitable sur cette preuve.`;
    return;
  }

  const p = selected.bloodProfile;
  tabletOutput.textContent =
    `ONGLET ADN\n\n` +
    `Preuve : ${selected.code} • ${selected.name}\n` +
    `Nom : ${p.fullName}\n` +
    `Date de naissance : ${p.birthDate}\n` +
    `Sexe : ${p.sex}\n` +
    `Groupe sanguin : ${p.bloodGroup}\n` +
    `Pays : ${p.country}\n` +
    `Empreinte digitale : ${p.fingerprint}`;
}

function renderBallisticsTab(selected) {
  if (!selected.ballisticsProfile) {
    tabletOutput.textContent =
      `ONGLET BALISTIQUE\n\n` +
      `Preuve : ${selected.code} • ${selected.name}\n\n` +
      `Aucune donnée balistique exploitable sur cette preuve.`;
    return;
  }

  const p = selected.ballisticsProfile;
  const linked = evidenceData
    .filter(
      (item) =>
        item.id !== selected.id &&
        item.ballisticsProfile &&
        item.ballisticsProfile.serialNumber === p.serialNumber
    )
    .map((item) => `${item.code} • ${item.name}`);

  tabletOutput.textContent =
    `ONGLET BALISTIQUE\n\n` +
    `Preuve : ${selected.code} • ${selected.name}\n` +
    `Type de munitions : ${p.ammoType}\n` +
    `Arme utilisée : ${p.weaponType}\n` +
    `Numéro de série : ${p.serialNumber}\n\n` +
    `Correspondances balistiques :\n` +
    `${linked.length ? linked.join("\n") : "Aucune autre correspondance trouvée."}`;
}

function renderComparisonTab(selected) {
  const lines = [];
  lines.push(`ONGLET COMPARAISON`);
  lines.push("");
  lines.push(`Preuve : ${selected.code} • ${selected.name}`);
  lines.push("");

  if (selected.id === 1) {
    lines.push("Analyse croisée :");
    lines.push("- Le sang de la preuve P1 correspond à la victime.");
    lines.push("- Il s'agit de la référence biologique principale de la scène.");
  }

  if (selected.id === 2) {
    lines.push("Analyse croisée :");
    lines.push("- La balle P2 contient le sang d'une autre personne.");
    lines.push("- La munition de P2 correspond au même numéro de série que P4 et P5.");
    lines.push("- Cela indique la présence d'un second individu armé.");
  }

  if (selected.id === 3) {
    lines.push("Analyse croisée :");
    lines.push("- L'arme P3 appartient à la victime.");
    lines.push("- Son numéro de série est différent de celui lié à P2, P4 et P5.");
    lines.push("- Il y a donc au moins deux armes impliquées sur la scène.");
  }

  if (selected.id === 4 || selected.id === 5) {
    lines.push("Analyse croisée :");
    lines.push("- Cette douille correspond au même numéro de série que P2.");
    lines.push("- Elle n'est pas liée à l'arme de la victime (P3).");
    lines.push("- Cela renforce l'hypothèse d'un tireur en fuite.");
  }

  lines.push("");
  lines.push("Conclusion provisoire :");
  lines.push("- Victime identifiée par le sang P1.");
  lines.push("- Présence d'une seconde personne blessée via P2.");
  lines.push("- Présence d'un second tireur confirmée par P2, P4 et P5.");
  lines.push("- L'arme P3 ne correspond pas à ces douilles.");

  tabletOutput.textContent = lines.join("\n");
}

function toggleTablet(force) {
  const nextState = typeof force === "boolean" ? force : !state.tabletOpen;
  state.tabletOpen = nextState;
  tabletOverlay.classList.toggle("open", state.tabletOpen);
  updateStats();

  if (state.tabletOpen) {
    renderProofList();
    updateTabletSelection();
    renderCurrentTab();
    addLog("Tablette ouverte.");
  }
}

function resetAll() {
  state.foundEvidenceIds = [];
  state.selectedEvidenceId = null;
  state.analysisCount = 0;
  state.tabletOpen = false;
  state.currentTab = "adn";

  tabletOverlay.classList.remove("open");
  journal.innerHTML = "";
  tabletOutput.textContent = "Résultat en attente...";

  renderEvidence();
  renderInventory();
  renderProofList();
  updateTabletSelection();
  updateStats();
  renderCurrentTab();

  setResult("Récupère une preuve sur la scène, puis ouvre la tablette avec T.");
  addLog("Affaire réinitialisée.");
}

function updateStats() {
  foundCount.textContent = state.foundEvidenceIds.length;
  totalCount.textContent = evidenceData.length;
  analysisCountEl.textContent = state.analysisCount;
  tabletState.textContent = state.tabletOpen ? "Ouverte" : "Fermée";
}

function setResult(text) {
  resultBox.textContent = text;
}

function addLog(text) {
  const line = document.createElement("div");
  line.className = "log-item";

  const now = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  line.textContent = `[${now}] ${text}`;
  journal.prepend(line);
}

function getEvidenceById(id) {
  return evidenceData.find((item) => item.id === id);
}

tabletToggleBtn.addEventListener("click", () => toggleTablet());
closeTabletBtn.addEventListener("click", () => toggleTablet(false));
resetBtn.addEventListener("click", resetAll);

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    state.currentTab = btn.dataset.tab;
    renderCurrentTab();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "t") {
    toggleTablet();
  }

  if (event.key === "Escape" && state.tabletOpen) {
    toggleTablet(false);
  }
});

tabletOverlay.addEventListener("click", (event) => {
  if (event.target === tabletOverlay) {
    toggleTablet(false);
  }
});

init();
