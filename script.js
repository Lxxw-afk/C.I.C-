const evidenceData = [
  {
    id: 1,
    name: "Trace de sang - victime",
    className: "evidence-blood",
    category: "Biologique",
    description: "Petite trace sombre près du corps.",
    x: 57.2,
    y: 69.8,
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
    name: "Douille dissimulée",
    className: "evidence-casing",
    category: "Balistique",
    description: "Douille presque cachée près de la table basse.",
    x: 38.4,
    y: 61.5,
    ballisticsProfile: {
      ammoType: "9mm",
      weaponType: "Pistol",
      serialNumber: "KX-9941-17"
    }
  },
  {
    id: 3,
    name: "Arme à feu",
    className: "evidence-gun",
    category: "Arme à feu",
    description: "Pistolet retrouvé au sol proche de la victime.",
    x: 56.2,
    y: 77.2,
    ballisticsProfile: {
      ammoType: "9mm",
      weaponType: "Pistol",
      serialNumber: "KX-9941-17"
    }
  },
  {
    id: 4,
    name: "Balle ensanglantée",
    className: "evidence-bloody-bullet",
    category: "Projectile",
    description: "Projectile retrouvé avec le sang d'une autre personne.",
    x: 66.8,
    y: 68.4,
    ballisticsProfile: {
      ammoType: "9mm",
      weaponType: "Pistol",
      serialNumber: "KX-9941-17"
    },
    bloodProfile: {
      fullName: "Sarah Moreau",
      birthDate: "03/11/1994",
      sex: "Femme",
      bloodGroup: "O-",
      country: "France",
      fingerprint: "9912457800341187"
    }
  },
  {
    id: 5,
    name: "Téléphone cassé",
    className: "evidence-phone",
    category: "Numérique",
    description: "Téléphone tombé à côté du corps.",
    x: 73.4,
    y: 63.6
  },
  {
    id: 6,
    name: "Petit couteau taché",
    className: "evidence-knife",
    category: "Arme blanche",
    description: "Lame fine difficile à distinguer près du canapé gauche.",
    x: 27.6,
    y: 66.4,
    bloodProfile: {
      fullName: "Inconnu",
      birthDate: "Non identifié",
      sex: "Inconnu",
      bloodGroup: "AB-",
      country: "Inconnu",
      fingerprint: "Non disponible"
    }
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

const analysisVisual = document.getElementById("analysisVisual");
const analysisTemplateImage = document.getElementById("analysisTemplateImage");
const bloodOverlay = document.getElementById("bloodOverlay");
const ballisticsOverlay = document.getElementById("ballisticsOverlay");

const bloodNameValue = document.getElementById("bloodNameValue");
const bloodNameSecondaryValue = document.getElementById("bloodNameSecondaryValue");
const bloodDobValue = document.getElementById("bloodDobValue");
const bloodSexValue = document.getElementById("bloodSexValue");
const bloodGroupValue = document.getElementById("bloodGroupValue");
const bloodCountryValue = document.getElementById("bloodCountryValue");
const bloodFingerprintValue = document.getElementById("bloodFingerprintValue");

const ammoTypeValue = document.getElementById("ammoTypeValue");
const weaponTypeValue = document.getElementById("weaponTypeValue");
const weaponSerialValue = document.getElementById("weaponSerialValue");

function init() {
  totalCount.textContent = evidenceData.length;
  renderEvidence();
  renderInventory();
  renderProofList();
  updateTabletSelection();
  updateStats();
  addLog("Système lancé. Début de la fouille de la scène.");
}

function renderEvidence() {
  evidenceLayer.innerHTML = "";

  evidenceData.forEach((item) => {
    const evidence = document.createElement("div");
    evidence.className = `evidence ${item.className}`;

    if (state.foundEvidenceIds.includes(item.id)) {
      evidence.classList.add("found");
    }

    evidence.style.left = `${item.x}%`;
    evidence.style.top = `${item.y}%`;
    evidence.title = state.foundEvidenceIds.includes(item.id)
      ? `${item.name} collecté`
      : "Indice discret";

    evidence.addEventListener("click", () => collectEvidence(item.id));
    evidenceLayer.appendChild(evidence);
  });
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
          <div class="inventory-name">${item.name}</div>
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
      hideAnalysisVisual();
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

    btn.innerHTML = `${item.name}<small>${item.category}</small>`;

    btn.addEventListener("click", () => {
      state.selectedEvidenceId = item.id;
      renderProofList();
      updateTabletSelection();
      hideAnalysisVisual();
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

  tabletSelectedTitle.textContent = selected.name;
  tabletSelectedMeta.textContent = `${selected.category} • ${selected.description}`;
}

function runAnalysis(type) {
  const selected = getEvidenceById(state.selectedEvidenceId);

  if (!selected) {
    tabletOutput.textContent = "Aucune preuve sélectionnée.";
    hideAnalysisVisual();
    return;
  }

  state.analysisCount += 1;
  updateStats();

  if (type === "blood") {
    if (!selected.bloodProfile) {
      tabletOutput.textContent = "Cette preuve ne contient pas de données sanguines.";
      hideAnalysisVisual();
      setResult(tabletOutput.textContent);
      addLog(`Analyse sanguine impossible sur ${selected.name}.`);
      return;
    }

    const profile = selected.bloodProfile;

    tabletOutput.textContent =
      `Résultat - Analyse sanguine\n\n` +
      `Nom : ${profile.fullName || "-"}\n` +
      `Date de naissance : ${profile.birthDate || "-"}\n` +
      `Sexe : ${profile.sex || "-"}\n` +
      `Groupe sanguin : ${profile.bloodGroup || "-"}\n` +
      `Pays : ${profile.country || "-"}\n` +
      `Empreinte digitale : ${profile.fingerprint || "-"}`;

    setResult(tabletOutput.textContent);
    showBloodAnalysis(profile);
    addLog(`Analyse sanguine sur ${selected.name}.`);
    return;
  }

  if (type === "ballistics") {
    if (!selected.ballisticsProfile) {
      tabletOutput.textContent = "Cette preuve ne contient pas de données balistiques.";
      hideAnalysisVisual();
      setResult(tabletOutput.textContent);
      addLog(`Analyse balistique impossible sur ${selected.name}.`);
      return;
    }

    const profile = selected.ballisticsProfile;

    tabletOutput.textContent =
      `Résultat - Analyse balistique\n\n` +
      `Type de munitions : ${profile.ammoType || "-"}\n` +
      `Arme utilisée : ${profile.weaponType || "-"}\n` +
      `Numéro de série de l'arme : ${profile.serialNumber || "-"}`;

    setResult(tabletOutput.textContent);
    showBallisticsAnalysis(profile);
    addLog(`Analyse balistique sur ${selected.name}.`);
  }
}

function showBloodAnalysis(profile) {
  analysisVisual.classList.remove("hidden");
  bloodOverlay.classList.remove("hidden");
  ballisticsOverlay.classList.add("hidden");
  analysisTemplateImage.src = "images/sang-ui.png";

  bloodNameValue.textContent = profile.fullName || "-";
  bloodNameSecondaryValue.textContent = profile.fullName || "-";
  bloodDobValue.textContent = profile.birthDate || "-";
  bloodSexValue.textContent = profile.sex || "-";
  bloodGroupValue.textContent = profile.bloodGroup || "-";
  bloodCountryValue.textContent = profile.country || "-";
  bloodFingerprintValue.textContent = profile.fingerprint || "-";
}

function showBallisticsAnalysis(profile) {
  analysisVisual.classList.remove("hidden");
  ballisticsOverlay.classList.remove("hidden");
  bloodOverlay.classList.add("hidden");
  analysisTemplateImage.src = "images/douille-ui.png";

  ammoTypeValue.textContent = profile.ammoType || "-";
  weaponTypeValue.textContent = profile.weaponType || "-";
  weaponSerialValue.textContent = profile.serialNumber || "-";
}

function hideAnalysisVisual() {
  analysisVisual.classList.add("hidden");
  bloodOverlay.classList.add("hidden");
  ballisticsOverlay.classList.add("hidden");
  analysisTemplateImage.src = "";
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
  hideAnalysisVisual();

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
