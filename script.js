const evidenceData = [
  {
    id: 1,
    code: "P1",
    name: "Sang victime",
    category: "Biologique",
    cx: 50.5,
    cy: 64.5,
    size: 5
  },
  {
    id: 2,
    code: "P2",
    name: "Balle ensanglantée",
    category: "Projectile",
    cx: 75.8,
    cy: 82.8,
    size: 4.5
  },
  {
    id: 3,
    code: "P3",
    name: "Arme",
    category: "Arme",
    cx: 52.5,
    cy: 73.5,
    size: 5
  },
  {
    id: 4,
    code: "P4",
    name: "Douille 1",
    category: "Balistique",
    cx: 32.5,
    cy: 87.5,
    size: 3
  },
  {
    id: 5,
    code: "P5",
    name: "Douille 2",
    category: "Balistique",
    cx: 6.5,
    cy: 70,
    size: 3.2
  }
];
const state = {
  foundEvidenceIds: [],
  selectedEvidenceId: null,
  analysisCount: 0,
  tabletOpen: false
};

const evidenceLayer = document.getElementById("evidenceLayer");
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
const bloodTestBtn = document.getElementById("bloodTestBtn");
const ballisticsBtn = document.getElementById("ballisticsBtn");
const resetBtn = document.getElementById("resetBtn");

function init() {
  totalCount.textContent = evidenceData.length;
  renderEvidence();
  renderInventory();
  renderProofList();
  updateTabletSelection();
  updateStats();
  addLog("Système lancé. Début de la fouille de la scène.");
}

function collectEvidence(id) {
  const item = evidenceData.find(e => e.id === id);
  if (!item) return;

  if (state.foundEvidenceIds.includes(id)) {
    return;
  }

  state.foundEvidenceIds.push(id);
  state.selectedEvidenceId = id;

  renderEvidence();
  renderInventory();
  renderProofList();
  updateTabletSelection();
  updateStats();

  setResult(`Preuve récupérée : ${item.name}`);
  addLog(`Preuve récupérée : ${item.name}.`);
}
function collectEvidence(id) {
  const item = getEvidenceById(id);

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

  setResult(
    `Preuve récupérée : ${item.name}\n${item.description}\n\nOuvre la tablette avec T pour lancer une analyse.`
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
      setResult(`Preuve sélectionnée : ${item.name}\nAppuie sur T pour ouvrir la tablette.`);
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
    tabletOutput.textContent = "Résultat en attente...";
    return;
  }

  tabletSelectedTitle.textContent = `${selected.code} • ${selected.name}`;
  tabletSelectedMeta.textContent = `${selected.category} • ${selected.description}`;
}

function runAnalysis(type) {
  const selected = getEvidenceById(state.selectedEvidenceId);

  if (!selected) {
    tabletOutput.textContent = "Aucune preuve sélectionnée.";
    return;
  }

  state.analysisCount += 1;
  updateStats();

  if (type === "blood") {
    if (!selected.bloodProfile) {
      tabletOutput.textContent = "Cette preuve ne contient pas de données sanguines.";
      setResult(tabletOutput.textContent);
      addLog(`Analyse sanguine impossible sur ${selected.name}.`);
      return;
    }

    const p = selected.bloodProfile;
    tabletOutput.textContent =
      `Résultat - Analyse sanguine\n\n` +
      `Preuve : ${selected.code} • ${selected.name}\n` +
      `Nom : ${p.fullName}\n` +
      `Date de naissance : ${p.birthDate}\n` +
      `Sexe : ${p.sex}\n` +
      `Groupe sanguin : ${p.bloodGroup}\n` +
      `Pays : ${p.country}\n` +
      `Empreinte digitale : ${p.fingerprint}`;

    setResult(tabletOutput.textContent);
    addLog(`Analyse sanguine sur ${selected.name}.`);
    return;
  }

  if (type === "ballistics") {
    if (!selected.ballisticsProfile) {
      tabletOutput.textContent = "Cette preuve ne contient pas de données balistiques.";
      setResult(tabletOutput.textContent);
      addLog(`Analyse balistique impossible sur ${selected.name}.`);
      return;
    }

    const p = selected.ballisticsProfile;
    tabletOutput.textContent =
      `Résultat - Analyse balistique\n\n` +
      `Preuve : ${selected.code} • ${selected.name}\n` +
      `Type de munitions : ${p.ammoType}\n` +
      `Arme utilisée : ${p.weaponType}\n` +
      `Numéro de série de l'arme : ${p.serialNumber}`;

    setResult(tabletOutput.textContent);
    addLog(`Analyse balistique sur ${selected.name}.`);
  }
}

function toggleTablet(force) {
  const nextState = typeof force === "boolean" ? force : !state.tabletOpen;
  state.tabletOpen = nextState;
  tabletOverlay.classList.toggle("open", state.tabletOpen);
  updateStats();

  if (state.tabletOpen) {
    renderProofList();
    updateTabletSelection();
    addLog("Tablette ouverte.");
  }
}

function resetAll() {
  state.foundEvidenceIds = [];
  state.selectedEvidenceId = null;
  state.analysisCount = 0;
  state.tabletOpen = false;

  tabletOverlay.classList.remove("open");
  journal.innerHTML = "";
  tabletOutput.textContent = "Résultat en attente...";

  renderEvidence();
  renderInventory();
  renderProofList();
  updateTabletSelection();
  updateStats();

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
bloodTestBtn.addEventListener("click", () => runAnalysis("blood"));
ballisticsBtn.addEventListener("click", () => runAnalysis("ballistics"));
resetBtn.addEventListener("click", resetAll);

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
