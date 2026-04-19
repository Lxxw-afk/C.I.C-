const evidenceData = [
  {
    id: 1,
    name: "Trace de sang",
    className: "evidence-blood",
    category: "Biologique",
    description: "Petite trace sombre sur le tapis près du corps.",
    x: 57.8,
    y: 74.2,
    bloodProfile: {
      firstName: "Titouan",
      lastName: "Darlitza",
      fullName: "Titouan Darlitza",
      birthDate: "14/03/1995",
      sex: "Homme",
      bloodGroup: "R+",
      country: "France",
      fingerprint: "1120201184814141"
    },
    analyses: {
      blood: {
        title: "Résultat - Analyse sanguine",
        content:
          "Nom : Darlitza\nPrénom : Titouan\nGroupe sanguin : R+\nDate de naissance : 14/03/1995"
      },
      ballistics: {
        title: "Résultat - Analyse balistique",
        content:
          "Analyse impossible : cette preuve est un échantillon biologique, pas une munition."
      }
    }
  },
  {
    id: 2,
    name: "Douille dissimulée",
    className: "evidence-casing",
    category: "Balistique",
    description: "Douille presque cachée près de la table basse.",
    x: 39.2,
    y: 66.5,
    ballisticsProfile: {
      ammoType: "45 ACP",
      weaponType: "Pistol",
      serialNumber: "4654431LYE846BA"
    },
    analyses: {
      blood: {
        title: "Résultat - Analyse sanguine",
        content:
          "Aucune donnée sanguine exploitable sur cette douille. Utilise plutôt l’analyse balistique."
      },
      ballistics: {
        title: "Résultat - Analyse balistique",
        content:
          "Numéro de série de l'arme : 4654431LYE846BA\nType de munition : 45 ACP\nArme utilisée : Pistol"
      }
    }
  },
  {
    id: 3,
    name: "Projectile ensanglanté",
    className: "evidence-bullet",
    category: "Projectile",
    description: "Projectile très discret proche du canapé droit.",
    x: 72.8,
    y: 70.4,
    ballisticsProfile: {
      ammoType: "9mm",
      weaponType: "Pistol",
      serialNumber: "KX-9941-17"
    },
    bloodProfile: {
      firstName: "Ethan",
      lastName: "Morel",
      fullName: "Ethan Morel",
      birthDate: "14/09/1998",
      sex: "Homme",
      bloodGroup: "B+",
      country: "France",
      fingerprint: "8894012574410012"
    },
    analyses: {
      blood: {
        title: "Résultat - Analyse sanguine",
        content:
          "Nom : Morel\nPrénom : Ethan\nGroupe sanguin : B+\nDate de naissance : 14/09/1998"
      },
      ballistics: {
        title: "Résultat - Analyse balistique",
        content:
          "Numéro de série de l'arme : KX-9941-17\nType de munition : 9mm\nArme utilisée : Pistol"
      }
    }
  },
  {
    id: 4,
    name: "Téléphone cassé",
    className: "evidence-phone",
    category: "Numérique",
    description: "Téléphone tombé près de la victime.",
    x: 63.8,
    y: 68.3,
    analyses: {
      blood: {
        title: "Résultat - Analyse sanguine",
        content: "Micro-traces détectées, mais quantité insuffisante pour un profil complet."
      },
      ballistics: {
        title: "Résultat - Analyse balistique",
        content: "Analyse balistique non pertinente sur un appareil électronique."
      }
    }
  },
  {
    id: 5,
    name: "Petit couteau taché",
    className: "evidence-knife",
    category: "Arme blanche",
    description: "Lame fine difficile à distinguer sur le parquet près du canapé gauche.",
    x: 24.5,
    y: 71.8,
    bloodProfile: {
      firstName: "Inconnu",
      lastName: "Inconnu",
      fullName: "Inconnu",
      birthDate: "Non identifié",
      sex: "Inconnu",
      bloodGroup: "O-",
      country: "Inconnu",
      fingerprint: "Non disponible"
    },
    analyses: {
      blood: {
        title: "Résultat - Analyse sanguine",
        content:
          "Nom : Inconnu\nPrénom : Inconnu\nGroupe sanguin : O-\nDate de naissance : Non identifié"
      },
      ballistics: {
        title: "Résultat - Analyse balistique",
        content:
          "Analyse impossible : cette preuve relève d'une arme blanche, pas d'une arme à feu."
      }
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
const analysisCount = document.getElementById("analysisCount");
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

  const result = selected.analyses[type];
  state.analysisCount += 1;
  updateStats();

  tabletOutput.textContent = `${result.title}\n\n${result.content}`;
  setResult(`${result.title}\n\n${result.content}`);
  addLog(`${result.title} sur ${selected.name}.`);

  if (type === "blood" && selected.bloodProfile) {
    showBloodAnalysis(selected.bloodProfile);
    return;
  }

  if (type === "ballistics" && selected.ballisticsProfile) {
    showBallisticsAnalysis(selected.ballisticsProfile);
    return;
  }

  hideAnalysisVisual();
}

function showBloodAnalysis(profile) {
  analysisVisual.classList.remove("hidden");
  bloodOverlay.classList.remove("hidden");
  ballisticsOverlay.classList.add("hidden");
  analysisTemplateImage.src = "images/sang-ui.png";

  bloodNameValue.textContent = profile.fullName || `${profile.firstName} ${profile.lastName}`;
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
  analysisCount.textContent = state.analysisCount;
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
