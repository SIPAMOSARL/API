/**
 * SYSTÈME DE GESTION DES FRAIS DE LIVRAISON - SIPAMO
 * Reconnaissance automatique des quartiers Yaoundé
 * Version corrigée - 2026
 */

// ==========================================
// QUARTIERS YAOUNDÉ ORGANISÉS PAR ZONE
// ==========================================
const YAONDE_QUARTIERS = {
    'zone-proche': {
        price: 500,
        name: 'Zone Proche (0-3 km)',
        color: '🟢',
        quartiers: [
            'Melen', 'Ngoa-Ekellé', 'Obili', 'Mokolo', 'La Briqueterie', 
            'La Brique', 'Etoug-Ebé', 'Ekoudou', 'Biyem-Assi'
        ]
    },
    'zone-moyenne': {
        price: 1000,
        name: 'Zone Moyenne (3-7 km)',
        color: '🟡',
        quartiers: [
            'Tsinga', 'Nkomkana', 'TKC', 'Etoa-Meki', 'Cité Verte',
            'Nlongkak', 'Nsimeyong', 'Quartier Fouda', 'Mvog-Mbi',
            'Madagascar', 'Mvog-Ada', 'Efoulan', 'Bastos', 'Dakar', 'Essos',
            'Nkoldongo', 'Mendong', 'Mballa I', 'Mballa II', 'Mballa III',
            'Mballa IV', 'Mballa V', 'Mballa VI', 'Kondengui', 'Oliga',
            'Nsam', 'Djoungolo', 'Mfandena', 'Oyom-Abang', 'Ekounou',
            'Tongolo', 'Simbock', 'Ngousso', 'Etoudi'
        ]
    },
    'zone-eloignee': {
        price: 1500,
        name: 'Zone Éloignée (7-10 km)',
        color: '🟠',
        quartiers: [
            'Mvan', 'Nkolbisson', 'Awae', 'Eleveur', 'Nkolmesseng',
            'Emana', 'Minkoameyos', 'Odza', 'Messamendongo', 'Borne 10',
            'Ahala', 'Borne 12'
        ]
    },
    'zone-grande': {
        price: 2000,
        name: 'Zone Grand Rayon (+ 10 km)',
        color: '🔴',
        quartiers: [
            'Biteng', 'Mbatu', 'Olembé', 'Ntinga', 'Ndamvout', 'Nkolda', 'Nyom'
        ]
    },
    'zone-peripherique': {
        price: 2500,
        name: 'Zone Périphérique (Sortie de ville)',
        color: '✈️',
        quartiers: [
            'Soa', 'Nsimalen', 'Aéroport', 'Mbankomo', 'Nomayos', 'Otop'
        ]
    }
};

// ==========================================
// TARIFS PAR VILLE (AUTRES VILLES)
// ==========================================
const DELIVERY_TARIFFS = {
    // +1000 FCFA ajouté à chaque tarif de base
    'Edéa': 2000,
    'Obala': 2000,
    'Mbalmayo': 2000,
    'Akonolinga': 2000,
    'Eséka': 2000,
    'Douala': 2500,
    'Ebolowa': 2500,
    'Sangmélima': 2500,
    'Bafoussam': 2500,
    'Bangangté': 2500,
    'Foumban': 3000,
    'Dschang': 3000,
    'Kribi': 3000,
    'Bertoua': 3000,
    'Nkongsamba': 3500,
    'Melong': 3500,
    'Manjo': 3500,
    'Penja': 3500,
    'Mbanga': 3500,
    'Buea': 3500,
    'Limbe': 3500,
    'Tiko': 3500,
    'Kumba': 3500,
    'Muyuka': 3500,
    'Bamenda': 4000,
    'Ngaoundéré': 4000,
    'Meiganga': 4000,
    'Ambam': 4000,
    'Lolodorf': 4000,
    'Batouri': 5000,
    'Tibati': 5000,
    'Garoua': 5500,
    'Banyo': 5500,
    'Tignère': 5500,
    'Poli': 5500,
    'Wum': 5500,
    'Mamfe': 5500,
    'Fontem': 5500,
    'Fundong': 5500,
    'Nkambe': 5500,
    'Maroua': 6000,
    'Guider': 6000,
    'Kaélé': 6000,
    'Yagoua': 6000,
    'Mora': 6000,
    'Mokolo': 7000,
    'Idenau': 7000,
    'Campo': 7000,
    'Mintom': 7000,
    'Kousséri': 7500,
};

// ==========================================
// SEUIL DE LIVRAISON GRATUITE
// ==========================================
const FREE_DELIVERY_THRESHOLD = 50000;

// ==========================================
// FONCTION : Obtenir la zone selon le quartier
// ==========================================
function getZoneByQuartier(quartierName) {
    if (!quartierName) return null;
    
    const quartierLower = quartierName.trim().toLowerCase();
    
    for (const [zoneKey, zoneData] of Object.entries(YAONDE_QUARTIERS)) {
        for (const q of zoneData.quartiers) {
            if (q.toLowerCase() === quartierLower) {
                return { key: zoneKey, data: zoneData };
            }
        }
    }
    
    return null;
}

// ==========================================
// FONCTION : Afficher/Masquer les champs quartier et rue
// ==========================================
window.handleCityChange = function() {
    const citySelect = document.getElementById('c-city');
    const quartierGroup = document.getElementById('yaonde-quartier-group');
    const quartierInput = document.getElementById('c-quartier');
    const streetGroup = document.getElementById('yaonde-street-group');
    const streetInput = document.getElementById('c-street');
    const selectedCity = citySelect.value;

    if (selectedCity === 'Yaoundé') {
        // Afficher les deux groupes
        quartierGroup.classList.add('show');
        if (streetGroup) streetGroup.classList.add('show');

        // Rendre les champs obligatoires
        quartierInput.setAttribute('required', 'required');
        if (streetInput) streetInput.setAttribute('required', 'required');

        quartierInput.focus();
    } else {
        // Cacher les groupes
        quartierGroup.classList.remove('show');
        if (streetGroup) streetGroup.classList.remove('show');

        // Vider et supprimer l'obligation
        quartierInput.value = '';
        quartierInput.classList.remove('valid', 'invalid');
        if (streetInput) streetInput.value = '';

        quartierInput.removeAttribute('required');
        if (streetInput) streetInput.removeAttribute('required');
    }

    // Mettre à jour les frais de livraison
    updateDeliveryFee();
};

// ==========================================
// FONCTION : Valider et reconnaître le quartier
// ==========================================
window.validateQuartier = function() {
    const quartierInput = document.getElementById('c-quartier');
    const zoneDisplay = document.getElementById('zone-display');
    
    if (!quartierInput) return;
    
    const quartierName = quartierInput.value.trim();
    
    if (!quartierName) {
        quartierInput.classList.remove('valid', 'invalid');
        if (zoneDisplay) zoneDisplay.style.display = 'none';
        updateDeliveryFee();
        return;
    }
    
    const zone = getZoneByQuartier(quartierName);
    
    if (zone) {
        // Quartier reconnu
        quartierInput.classList.add('valid');
        quartierInput.classList.remove('invalid');
        
        if (zoneDisplay) {
            zoneDisplay.style.display = 'block';
            zoneDisplay.innerHTML = `
                <span class="zone-badge">${zone.data.color} ${zone.data.name}</span>
                <span class="zone-price">${zone.data.price.toLocaleString('fr-FR')} FCFA</span>
            `;
        }
    } else {
        // Quartier non reconnu
        quartierInput.classList.add('invalid');
        quartierInput.classList.remove('valid');
        
        if (zoneDisplay) {
            zoneDisplay.style.display = 'block';
            zoneDisplay.innerHTML = `<span class="zone-error">❌ Quartier non reconnu</span>`;
        }
    }
    
    updateDeliveryFee();
};

// ==========================================
// FONCTION : Mettre à jour les frais de livraison
// ==========================================
window.updateDeliveryFee = function() {
    const mode = document.querySelector('input[name="deliveryMode"]:checked')?.value;
    if (mode === 'pickup') {
        const deliveryFeeSpan = document.getElementById('delivery-fee');
        if (deliveryFeeSpan) deliveryFeeSpan.textContent = '0 FCFA';
        window.updateGrandTotal();
        return;
    }

    const citySelect = document.getElementById('c-city');
    const quartierInput = document.getElementById('c-quartier');
    const deliveryFeeSpan = document.getElementById('delivery-fee');
    
    const selectedCity = citySelect?.value || '';
    let deliveryFee = 0;

    // 1. Déterminer les frais selon la ville/quartier
    if (selectedCity === 'Yaoundé') {
        const quartierName = quartierInput?.value.trim() || '';

        if (!quartierName) {
            // Aucun quartier saisi : tarif inconnu, on attend
            if (deliveryFeeSpan) {
                deliveryFeeSpan.innerHTML = '<span style="color:#999; font-size:12px;">Entrez votre quartier pour voir les frais</span>';
            }
            updateGrandTotal();
            return;
        }

        const zone = getZoneByQuartier(quartierName);
        if (zone) {
            deliveryFee = zone.data.price;
        } else {
            // Quartier saisi mais non reconnu : bloquer et afficher une erreur
            if (deliveryFeeSpan) {
                deliveryFeeSpan.innerHTML = '<span style="color:#e74c3c; font-size:12px;">❌ Quartier non reconnu — frais non calculés</span>';
            }
            updateGrandTotal();
            return;
        }
    } else if (selectedCity && DELIVERY_TARIFFS[selectedCity]) {
        deliveryFee = DELIVERY_TARIFFS[selectedCity];
    }

    // Afficher le tarif de livraison calculé
    if (deliveryFeeSpan) {
        deliveryFeeSpan.textContent = (deliveryFee || 0).toLocaleString('fr-FR') + ' FCFA';
    }

    // Mettre à jour le total général
    updateGrandTotal();
};

// ==========================================
// FONCTION : Mettre à jour le total général
// ==========================================
window.updateGrandTotal = function() {
    const totalBrutElement = document.getElementById('total-brut');
    const totalRemiseElement = document.getElementById('total-remise');
    const deliveryFeeElement = document.getElementById('delivery-fee');
    const grandTotalElement = document.getElementById('grand-total');

    if (!totalBrutElement || !grandTotalElement) return;

    let totalBrut = parseInt(totalBrutElement.textContent.replace(/\D/g, '')) || 0;
    let totalRemise = parseInt(totalRemiseElement?.textContent.replace(/\D/g, '')) || 0;
    
    // Extraire le tarif de livraison
    let deliveryFee = 0;
    if (deliveryFeeElement) {
        deliveryFee = parseInt(deliveryFeeElement.textContent.replace(/\D/g, '')) || 0;
    }

    // Calculer le total : (brut - remise) + frais
    const netBeforeDelivery = totalBrut - totalRemise;
    const grandTotal = netBeforeDelivery + deliveryFee;

    if (grandTotalElement) {
        grandTotalElement.textContent = grandTotal.toLocaleString('fr-FR') + ' FCFA';
    }
};

// ==========================================
// FONCTION : Obtenir le tarif sélectionné
// ==========================================
window.getSelectedDeliveryFee = function() {
    const mode = document.querySelector('input[name="deliveryMode"]:checked')?.value;
    if (mode === 'pickup') return 0;

    const citySelect = document.getElementById('c-city');
    const quartierInput = document.getElementById('c-quartier');

    const selectedCity = citySelect?.value || '';
    let deliveryFee = 0;

    // Déterminer les frais
    if (selectedCity === 'Yaoundé') {
        const quartierName = quartierInput?.value.trim() || '';
        if (quartierName) {
            const zone = getZoneByQuartier(quartierName);
            if (zone) {
                deliveryFee = zone.data.price;
            }
        }
    } else if (selectedCity && DELIVERY_TARIFFS[selectedCity]) {
        deliveryFee = DELIVERY_TARIFFS[selectedCity];
    }

    return deliveryFee;
};

// ==========================================
// PATCH : Appeler updateDeliveryFee après chaque renderCartPage
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.renderCartPage === 'function') {
        const _originalRenderCartPage = window.renderCartPage;
        window.renderCartPage = function() {
            _originalRenderCartPage.apply(this, arguments);
            updateDeliveryFee();
        };
    }
});



// ==========================================
// FONCTION : Peupler la datalist des quartiers
// ==========================================
function populateQuartiersDatalist() {
    const datalist = document.getElementById('quartiers-list');
    if (!datalist) return;

    const allQuartiers = [];
    for (const zoneKey in YAONDE_QUARTIERS) {
        allQuartiers.push(...YAONDE_QUARTIERS[zoneKey].quartiers);
    }
    const uniqueQuartiers = [...new Set(allQuartiers)].sort((a, b) => a.localeCompare(b, 'fr'));
    datalist.innerHTML = uniqueQuartiers.map(q => `<option value="${q}">`).join('');
}

// ==========================================
// FONCTIONS DE GESTION DES DATES DE LIVRAISON
// ==========================================

/**
 * Convertit une chaîne "YYYY-MM-DD" en objet Date locale (sans décalage UTC)
 */
function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Calcule la date de livraison minimale selon la règle des 3 jours pleins (72h)
 * et pas de livraison le dimanche.
 * @param {string} hourStr - Heure choisie au format "HH:MM" (ex: "14:00")
 * @returns {string} Date au format YYYY-MM-DD
 */
function getEarliestDeliveryDate(hourStr) {
  const now = new Date();
  const [h] = hourStr.split(':').map(Number);
  // On prend la date/heure actuelle avec l'heure choisie (même jour)
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, 0, 0);
  // Ajouter 3 jours (72h)
  const earliest = new Date(base.getTime() + 3 * 24 * 60 * 60 * 1000);
  // Si c'est un dimanche (0), décaler au lundi
  if (earliest.getDay() === 0) {
    earliest.setDate(earliest.getDate() + 1);
  }
  // Formater en YYYY-MM-DD
  const y = earliest.getFullYear();
  const m = String(earliest.getMonth() + 1).padStart(2, '0');
  const d = String(earliest.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ==========================================
// INITIALISATION AU CHARGEMENT
// ==========================================
document.addEventListener('DOMContentLoaded', function() {

    // ── OBSERVER total brut → recalcul frais livraison ─────────────
    const totalBrutElement = document.getElementById('total-brut');
    if (totalBrutElement) {
        const observer = new MutationObserver(updateDeliveryFee);
        observer.observe(totalBrutElement, { childList: true, subtree: true, characterData: true });
    }

    // ── Frais de livraison initiaux ─────────────────────────────────
    updateDeliveryFee();

    // ── Quartier ────────────────────────────────────────────────────
    const quartierInput = document.getElementById('c-quartier');
    if (quartierInput) {
        quartierInput.addEventListener('input', validateQuartier);
        quartierInput.addEventListener('change', validateQuartier);
    }

    // ── Datalist quartiers ──────────────────────────────────────────
    populateQuartiersDatalist();
});
