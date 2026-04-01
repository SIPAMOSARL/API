/* =========================================================
   SIPAMO – SCRIPT GLOBAL UNIFIÉ (VERSION CORRIGÉE)
   - Gestion unique du panier (pas de duplication)
   - Initialisation correcte des pages (produits vs détail)
   - Liens corrects vers les pages détail
   - Pas de redéfinition de fonctions
   ========================================================= */

/* ==============
   NOTIFICATIONS (TOASTS)
   ============== */
function showNotification(message, type = 'info') {
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 300px;
    `;
    document.body.appendChild(container);
  }

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
    color: white;
    padding: 12px 18px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    cursor: default;
    border-left: 4px solid rgba(255,255,255,0.5);
  `;

  container.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 10);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

/* ==============
   UTILITAIRES
   ============== */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDateFR(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/* ========================
   GESTION DU PANIER (UNIQUE)
   ======================== */
const CART_KEY = "sipamoCart";
// Email assemblé au runtime — Cloudflare ne peut pas détecter et obfusquer le "@"
const EMAIL_RECEPTION = ["contact", "sipamo.site"].join("@");
const WHATSAPP_PHONE = "237620412921";

// Charger le panier depuis localStorage (une seule fois)
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateGlobalUI(); // Mettre à jour tous les affichages
}

function addToCart(product, size, color, qty = 1) {
  if (!size || !color) {
    showNotification('Veuillez sélectionner une taille et une couleur.', 'warning');
    return false;
  }

  const existingItem = cart.find(
    item => item.id === product.id && item.size === size && item.color === color
  );

  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      size: size,
      color: color,
      qty: qty
    });
  }

  saveCart();
  showNotification(`✅ ${product.name} ajouté au panier`, 'success');
  return true;
}

function removeFromCart(index) {
  if (cart[index]) {
    cart.splice(index, 1);
    saveCart();
  }
}

function updateCartQuantity(index, newQty) {
  const qty = parseInt(newQty, 10);
  if (isNaN(qty) || qty < 1) return;
  if (cart[index]) {
    cart[index].qty = qty;
    saveCart();
  }
}

/* ========================
   FORMULE PRIX SIPAMO
   ======================== */
function calculateSipamoTotals() {
  const totalBrut = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  if (totalBrut === 0) return { total: 0, remise: 0, perItemTotals: [] };

  // Calcul du taux de réduction selon le total brut
  let tauxRemise = 0;
  if (totalBrut > 220000) {
    tauxRemise = 0.10; // 10%
  } else if (totalBrut > 50000) {
    tauxRemise = 0.05; // 5%
  }

  const remiseMontant = Math.round(totalBrut * tauxRemise);
  const totalNet = totalBrut - remiseMontant;

  // Appliquer la remise proportionnellement sur chaque article
  const perItemTotals = cart.map((item) => {
    const raw = item.price * item.qty;
    const subtotal = Math.round(raw * (1 - tauxRemise));
    return { idx: item.id, raw, subtotal };
  });

  return { total: totalNet, remise: remiseMontant, tauxRemise, perItemTotals };
}

/* ========================
   UI GLOBALE
   ======================== */
function updateGlobalUI() {
  // Mise à jour du badge du panier
  const badge = document.getElementById('cart-badge');
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  if (badge) {
    badge.textContent = totalItems;
    badge.style.opacity = totalItems > 0 ? '1' : '0';
  }

  // Mise à jour du tiroir (si visible)
  updateCartDrawer();
}

function updateCartDrawer() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#999;">Votre panier est vide</p>';
    return;
  }

  let html = '';
  cart.forEach((item, idx) => {
    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
        <div>
          <div style="font-weight:600; font-size:13px;">${escapeHtml(item.name)}</div>
          <div style="font-size:11px; color:#999;">${escapeHtml(item.size)} / ${escapeHtml(item.color)} x${item.qty}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:600; font-size:13px;">${(item.price * item.qty).toLocaleString('fr-FR')} FCFA</div>
          <button onclick="removeFromCart(${idx}); updateGlobalUI();" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size:12px;">Retirer</button>
        </div>
      </div>
    `;
  });

  const sip = calculateSipamoTotals();
  const cartTotalSpan = document.getElementById('cart-total');
  if (cartTotalSpan) cartTotalSpan.textContent = sip.total.toLocaleString('fr-FR') + ' FCFA';
  const totalHtml = `
    <div style="margin-top:15px; padding-top:15px; border-top:2px solid #000;">
      <div style="display:flex; justify-content:space-between; font-weight:600;">
        <span>Total:</span>
        <span>${sip.total.toLocaleString('fr-FR')} FCFA</span>
      </div>
    </div>
  `;

  container.innerHTML = html + totalHtml;
}

/* ========================
   MENU & DRAWERS
   ======================== */
function setupGlobalEvents() {
  document.querySelectorAll(".toggle-menu").forEach(btn => btn.addEventListener("click", toggleMenu));
  document.querySelectorAll(".toggle-cart").forEach(btn => btn.addEventListener("click", toggleCart));
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.addEventListener("click", closeAllDrawers);
}

function toggleMenu() {
  document.getElementById("menu-drawer")?.classList.toggle("open");
  document.getElementById("overlay")?.classList.toggle("active");
}

function toggleCart() {
  if (location.pathname.includes("panier.html")) return;
  document.getElementById("cart-drawer")?.classList.toggle("open");
  document.getElementById("overlay")?.classList.toggle("active");
}

function closeAllDrawers() {
  document.getElementById("menu-drawer")?.classList.remove("open");
  document.getElementById("cart-drawer")?.classList.remove("open");
  document.getElementById("overlay")?.classList.remove("active");
}

function toggleSubMenu(el) {
  const sub = el.nextElementSibling;
  if (!sub) return;
  sub.classList.toggle("show");
  el.classList.toggle("open");
  const arrow = el.querySelector(".nav-arrow");
  if (arrow) arrow.textContent = el.classList.contains("open") ? "−" : "+";
}

function toggleSubMenu2(el) {
  const sub = el.nextElementSibling;
  if (!sub) return;
  sub.classList.toggle("show");
  el.classList.toggle("open");
  const arrow = el.querySelector(".nav-arrow-sub");
  if (arrow) arrow.textContent = el.classList.contains("open") ? "−" : "+";
}

/* ========================
   AFFICHAGE PRIX & BADGE
   ======================== */
function getPriceHTML(p) {
  const stylePrixActuel = "color: #27ae60; font-weight: 700; letter-spacing: 0.5px; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 1.1em;";
  let priceHTML = `<span class="prix-actuel" style="${stylePrixActuel}">${p.price.toLocaleString()} FCFA</span>`;
  if (p.oldPrice && p.oldPrice > p.price) {
    const stylePrixBarre = "text-decoration: line-through; color: #b2b2b2; font-size: 0.85em; font-weight: 300; margin-right: 8px;";
    priceHTML = `
      <span class="prix-barre" style="${stylePrixBarre}">
        ${p.oldPrice.toLocaleString()} FCFA
      </span>
      <span class="prix-actuel" style="${stylePrixActuel}">
        ${p.price.toLocaleString()} FCFA
      </span>
    `;
  }
  return priceHTML;
}

function getBadgeHTML(p) {
  if (p.oldPrice && p.oldPrice > p.price) {
    let discount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
    const styleBadge = "position: absolute; top: 10px; right: 10px; background: #e74c3c; color: #fff; padding: 4px 8px; font-size: 11px; font-weight: 600; border-radius: 4px; letter-spacing: 0.5px; z-index: 2; box-shadow: 0 2px 4px rgba(0,0,0,0.1);";
    return `<span class="badge-promo" style="${styleBadge}">-${discount}%</span>`;
  }
  return "";
}

/* ========================
   INITIALISATION DES PAGES
   ======================== */
document.addEventListener("DOMContentLoaded", () => {
  setupGlobalEvents();
  updateGlobalUI();

  const path = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  // DÉTERMINER QUELLE PAGE AFFICHER
  // Priorité 1: Si ?id= est présent → page détail
  if (productId) {
    initDetailPage();
  }
  // Priorité 2: Sinon si URL contient "produits.html" → page boutique
  else if (path.includes("produits.html")) {
    initShopPage();
  }
  // Autres pages
  if (path.includes("index.html") || path === "/" || path.endsWith("/")) {
    initHomePage();
  }
  if (path.includes("panier.html")) {
    initCartPage();
  }
});

/* ========================
   PAGE D'ACCUEIL
   ======================== */
function initHomePage() {
  const grid = document.getElementById('new-arrivals-grid');
  if (!grid) return;

  if (typeof products === 'undefined') return;

  const featured = products.slice(0, 6);
  grid.innerHTML = featured.map(p => `
    <div style="cursor:pointer; transition:transform 0.2s;" onclick="navigateToProduct(${p.id})">
      <div style="position:relative; overflow:hidden; border-radius:8px; aspect-ratio:3/4;">
        <img src="${p.images[0]}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;">
        ${getBadgeHTML(p)}
      </div>
      <h3 style="font-size:14px; margin:12px 0 6px; font-weight:600;">${p.name}</h3>
      <div>${getPriceHTML(p)}</div>
    </div>
  `).join("");
}

function navigateToProduct(productId) {
  window.location.href = `produit-detail.html?id=${productId}`;
}

/* ========================
   PAGE BOUTIQUE (GRILLE)
   ======================== */
function initShopPage() {
  if (typeof products === 'undefined') return;

  const grid = document.getElementById('product-grid');
  const shopSection = document.getElementById('shop-section');

  if (!grid || !shopSection) return;

  // Afficher la grille, masquer le détail s'il existe
  shopSection.style.display = 'block';
  const detailSection = document.getElementById('detail-section');
  if (detailSection) detailSection.style.display = 'none';

  // Récupérer les filtres depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const cat = urlParams.get('cat') || 'all';
  const sub = urlParams.get('sub');
  const type = urlParams.get('type');

  // Filtrer les produits
  let filtered = products;
  if (cat !== 'all') filtered = filtered.filter(p => p.category?.toLowerCase() === cat.toLowerCase());
  if (sub) filtered = filtered.filter(p => p.subcategory?.toLowerCase() === sub.toLowerCase());
  if (type) {
    filtered = filtered.filter(p => {
      if (Array.isArray(p.type)) return p.type.includes(type);
      else return p.type === type;
    });
  }

  // Générer la grille (LIENS VERS produit-detail.html?id=...)
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="text-align:center; padding:40px; color:#999;">Aucun produit trouvé pour cette catégorie.</p>';
  } else {
    grid.innerHTML = filtered.map(p => `
      <div style="cursor:pointer; transition:transform 0.2s;" onclick="navigateToProduct(${p.id})">
        <div style="position:relative; overflow:hidden; border-radius:8px; aspect-ratio:3/4;">
          <img src="${p.images[0]}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;">
          ${getBadgeHTML(p)}
        </div>
        <h3 style="font-size:14px; margin:12px 0 6px; font-weight:600;">${p.name}</h3>
        <div>${getPriceHTML(p)}</div>
      </div>
    `).join("");
  }
}

/* ========================
   PAGE DÉTAIL PRODUIT
   ======================== */
function initDetailPage() {
  if (typeof products === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get("id"));
  const product = products.find(p => p.id === id);

  const shopSection = document.getElementById('shop-section');
  const detailSection = document.getElementById('detail-section');

  if (!product || !detailSection) {
    if (shopSection) shopSection.style.display = 'block';
    if (detailSection) detailSection.style.display = 'none';
    return;
  }

  // Mémoriser le produit courant pour updateStockDisplay
  window.currentProduct = product;

  // Afficher le détail, masquer la grille
  if (shopSection) shopSection.style.display = 'none';
  detailSection.style.display = 'block';

  // Afficher le formulaire de commande
  const form = document.getElementById('detail-form');
  if (form) form.style.display = 'block';

  document.title = product.name + " | SIPAMO";

  const setTextSafe = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setTextSafe("d-title", product.name);
  setTextSafe("d-cat", `${product.category} / ${product.subcategory}`);
  const dPriceEl = document.getElementById("d-price");
  if (dPriceEl) dPriceEl.innerHTML = getPriceHTML(product);
  setTextSafe("d-desc", product.desc || "");

  // Remplir les spécifications
  const setSpec = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '';
  };
  if (product.specs) {
    setSpec('d-matiere', product.specs.material || '');
    setSpec('d-composition', product.specs.finish || '');
    setSpec('d-col', 'Voir description');
    const finitionsEl = document.getElementById('d-finitions');
    if (finitionsEl && product.specs.finish) {
      finitionsEl.innerHTML = product.specs.finish.split(',').map(f => `<li>${f.trim()}</li>`).join('');
    }
    setSpec('d-entretien', product.specs.care || '');
  }

  // Image principale et galerie desktop
  const mainImg = document.getElementById("d-main-img");
  if (mainImg) mainImg.src = product.images[0] || '';
  const gallery = document.getElementById("d-gallery");
  if (gallery) {
    gallery.innerHTML = product.images.map((img, i) => 
      `<img src="${img}" class="thumb ${i===0 ? 'active' : ''}" onclick="changeMainImg(this, '${img}')" style="cursor:pointer; width:60px; height:60px; border-radius:4px; border:2px solid #eee;">`
    ).join("");
  }

  // Slider mobile
  const track = document.getElementById("d-slider-track");
  if (track) {
    track.innerHTML = product.images.map(img => `<img src="${img}" class="slide-img" style="min-width:100%; height:auto;">`).join("");
    initSwipe(track);
  }

  // TAILLES
  const sizeSelect = document.getElementById("d-size");
  if (sizeSelect && product.sizes && product.sizes.length > 0) {
    sizeSelect.innerHTML = '<option value="" disabled selected>-- Choisir une taille --</option>';
    product.sizes.forEach(size => {
      const option = document.createElement('option');
      option.value = size;
      option.textContent = size;
      sizeSelect.appendChild(option);
    });
  }

  // COULEURS
  const colorContainer = document.getElementById("d-color-container");
  const selectedColorInput = document.getElementById('selectedColor');
  const colorNameDisplay = document.getElementById('color-name');

  if (colorContainer && product.colors && product.colors.length > 0) {
    const colorPalette = {
      // --- TEINTES NEUTRES & MINÉRALES ---
      "noir": "#000000",
      "blanc": "#ffffff",
      "gris": "#808080",
      "gris clair": "#d3d3d3",
      "gris ardoise": "#708090",
      "anthracite": "#303030",
      "taupe": "#483c32",
      "grège": "#b1a799",
      "beige": "#f5f5dc",
      "crème": "#fffdd0",
      "ivoire": "#fffff0",
      "coquille d'œuf": "#f0ead6",
      "albâtre": "#f2f0e6",
      "nude": "#e3bc9a",
      "perle": "#f0f0f0",
      "lin": "#faf0e6",
      "écru": "#faf3e0",
      "bis": "#f0ead2",
      "cendre": "#bebebe",
      "ardoise foncé": "#2f4f4f",
      "gris souris": "#6e6e6e",
      "gris perle": "#c9c0bb",
      "gris fer": "#7f7f7f",
      "pierre": "#928e85",
      "silex": "#6d6f6c",

      // --- TERRE & MATIÈRES ---
      "terre cuite": "#e2725b",
      "ocre": "#cc7722",
      "sable": "#f4a460",
      "kaki": "#c3b091",
      "kaki militaire": "#4b5320",
      "argile": "#b66a50",
      "rouille": "#b7410e",
      "cuivre": "#b87333",
      "bronze": "#cd7f32",
      "laiton": "#b5a642",
      "marron": "#8b4513",
      "café": "#6f4e37",
      "chocolat": "#7b3f00",
      "terre d'ombre": "#5e3a2c",
      "terre de sienne": "#a0522d",
      "bitume": "#4a3c31",
      "bistre": "#3d2b1f",
      "sépia": "#704214",
      "bois": "#deb887",
      "acajou": "#c04040",
      "noisette": "#d2b48c",
      "cannelle": "#7b3f3f",
      "caramel": "#af6f4f",
      "amande": "#efdecd",
      "noix": "#5d4321",
      "chanvre": "#c9b79b",
      "jute": "#c3a68c",

      // --- ROUGES, ORANGES & JAUNES ---
      "rouge": "#ff0000",
      "rouge vif": "#e74c3c",
      "rouge rubis": "#e0115f",
      "rouge carmin": "#960018",
      "rouge brique": "#cb4154",
      "bordeaux": "#800020",
      "grenat": "#6a0c0b",
      "lie de vin": "#4e070c",
      "orange": "#ffa500",
      "orange clair": "#ffb347",
      "corail": "#ff7f50",
      "saumon": "#fa8072",
      "mangue": "#ff8243",
      "papaye": "#ffefd5",
      "jaune moutarde": "#ffdb58",
      "curry": "#cca01d",
      "safran": "#f4c430",
      "ambre": "#ffbf00",
      "or": "#ffd700",
      "jaune paille": "#e4d96f",
      "vanille": "#f3e5ab",
      "vermillon": "#e34234",
      "écarlate": "#ff2400",
      "coquelicot": "#ff3800",
      "fraise": "#fc5a8d",
      "framboise": "#e30b5d",
      "cerise": "#de3163",
      "tomate": "#ff6347",
      "piment": "#ff4d40",
      "rouge tomette": "#b33b24",
      "orange brûlé": "#cc5500",
      "mandarine": "#f28500",
      "pamplemousse": "#f7a35c",
      "jaune citron": "#fafa33",
      "jaune canari": "#ffef00",
      "jaune maïs": "#fbec5d",
      "jaune soufre": "#f1f0a1",

      // --- BLEUS & FROIDS ---
      "bleu": "#0000ff",
      "bleu clair": "#87ceeb",
      "bleu dragée": "#dff2ff",
      "bleu ciel": "#add8e6",
      "bleu marine": "#000080",
      "bleu nuit": "#09244e",
      "bleu roi": "#4169e1",
      "bleu saphir": "#0f52ba",
      "bleu électrique": "#7df9ff",
      "bleu acier": "#4682b4",
      "bleu canard": "#048b9a",
      "bleu pétrole": "#1d4851",
      "cyan": "#00ffff",
      "aqua": "#00ffff",
      "turquoise": "#40e0d0",
      "teal": "#008080",
      "bleu outremer": "#3d5a80",
      "bleu de Prusse": "#003153",
      "bleu cobalt": "#0047ab",
      "bleu persan": "#1c39bb",
      "bleu turquoise": "#1c7e7e",
      "bleu glacier": "#96ded1",
      "bleu ardoise": "#6a5acd",
      "bleu minuit": "#191970",
      "bleu crépuscule": "#4a5d6e",
      "bleu lavande": "#ccd9ff",
      "bleu pervenche": "#ccccff",
      "bleu barbeau": "#6495ed",
      "bleu ciel profond": "#3a6ea5",
      "cyan foncé": "#008b8b",
      "pétrole": "#1f4f4f",

      // --- VERTS ---
      "vert": "#008000",
      "vert clair": "#90ee90",
      "vert d'eau": "#b0f2b6",
      "menthe": "#98ff98",
      "vert émeraude": "#50c878",
      "vert forêt": "#228b22",
      "vert sapin": "#095228",
      "vert impérial": "#00563f",
      "vert bouteille": "#006a4e",
      "vert foncé": "#006400",
      "olive": "#808000",
      "vert olive":"#6B7C3A", 
      "sauge": "#87ae73",
      "vert chartreuse": "#7fff00",
      "vert pomme": "#8db600",
      "vert lime": "#c0ff00",
      "vert céladon": "#ace1af",
      "vert jade": "#00a86b",
      "vert malachite": "#0bda51",
      "vert oxyde": "#4a5d23",
      "vert mousse": "#8a9a5b",
      "vert prairie": "#4f9f4f",
      "vert amande": "#c1e0c1",
      "vert pistache": "#b8d9a6",
      "vert tilleul": "#b8c75a",

      // --- VIOLETS & ROSES ---
      "violet": "#8a2be2",
      "violet clair": "#da70d6",
      "améthyste": "#9966cc",
      "lilas": "#c8a2c8",
      "mauve": "#e0b0ff",
      "lavande": "#e6e6fa",
      "indigo": "#4b0082",
      "aubergine": "#3d0c02",
      "prune": "#dda0dd",
      "magenta": "#ff00ff",
      "fuchsia": "#ff00ff",
      "rose": "#ffc0cb",
      "rose poudré": "#ffb6c1",
      "rose foncé": "#ff69b4",
      "vieux rose": "#c08081",
      "pêche": "#ffe5b4",
      "abricot": "#fbceb1",
      "melon": "#fdbcb4",
      "champagne": "#f7e7ce",
      "pourpre": "#9e1e64",
      "bourgogne": "#900020",
      "vin rouge": "#b22222",
      "mûre": "#6a2e3a",
      "myrtille": "#4f3a3c",
      "violet pourpre": "#7d3c4b",
      "orchidée": "#da70d6",
      "rose bonbon": "#f9429e",
      "rose fuchsia": "#ff77ff",
      "rose thé": "#eab5b5",
      "rose saumon": "#ff91a4",
      "coquillage": "#fff5e6",
      "nacré": "#efe4e4"
    };

    colorContainer.innerHTML = product.colors.map(color => {
      const hexColor = colorPalette[color.toLowerCase()] || "#cccccc";
      return `
        <div class="color-option" data-color="${color}" onclick="selectColor(this, '${color}')" 
             style="width:30px; height:30px; border-radius:50%; background:${hexColor}; cursor:pointer; border:2px solid #ddd; transition:all 0.2s; box-sizing:border-box;">
        </div>
      `;
    }).join("");
  }

  // Afficher le stock initial (première couleur)
  const dStockEl = document.getElementById('d-stock');
  if (product.colors && product.colors.length > 0 && dStockEl) {
    const firstColor = product.colors[0];
    if (product.colorStock && product.colorStock[firstColor] !== undefined) {
      const stock = product.colorStock[firstColor];
      dStockEl.innerHTML = `<span style="color: #27ae60;">${stock} disponible${stock > 1 ? 's' : ''}</span>`;
    } else {
      updateStockDisplay(product, firstColor, dStockEl);
    }
  }

  // BOUTON AJOUTER AU PANIER
  const addBtn = document.getElementById('add-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      const size = sizeSelect?.value || '';
      const color = selectedColorInput?.value || '';
      const qty = parseInt(document.getElementById('d-qty')?.value || '1');

      if (addToCart(product, size, color, qty)) {
        document.getElementById('d-qty').value = '1';
        if (selectedColorInput) selectedColorInput.value = '';
        if (colorNameDisplay) colorNameDisplay.textContent = 'Couleur non sélectionnée';
      }
    };
  }
}

function selectColor(el, colorName) {
  // Retirer la sélection des autres
  document.querySelectorAll('.color-option').forEach(c => {
    c.style.borderColor = '#ddd';
    c.style.borderWidth = '2px';
  });
  // Sélectionner celui-ci
  el.style.borderColor = '#000';
  el.style.borderWidth = '2px';

  const selectedColorInput = document.getElementById('selectedColor');
  if (selectedColorInput) selectedColorInput.value = colorName;
  const colorNameDisplay = document.getElementById('color-name');
  if (colorNameDisplay) colorNameDisplay.textContent = `Couleur: ${colorName}`;

  // Mettre à jour le stock pour cette couleur via colorStock
  const dStockEl = document.getElementById('d-stock');
  if (dStockEl && window.currentProduct) {
    if (window.currentProduct.colorStock && window.currentProduct.colorStock[colorName] !== undefined) {
      const stock = window.currentProduct.colorStock[colorName];
      if (stock === 0) {
        dStockEl.innerHTML = '<span style="color:#e74c3c;">❌ Rupture de stock</span>';
      } else if (stock < 5) {
        dStockEl.innerHTML = `<span style="color:#f39c12;">⚠️ ${stock} restant${stock > 1 ? 's' : ''}</span>`;
      } else {
        dStockEl.innerHTML = `<span style="color:#27ae60;">${stock} disponible${stock > 1 ? 's' : ''}</span>`;
      }
    } else {
      updateStockDisplay(window.currentProduct, colorName, dStockEl);
    }
  }
}

function updateStockDisplay(product, color, dStockEl) {
  if (!dStockEl || !product) return;
  const stockInfo = product.specs?.stock || "";
  dStockEl.innerHTML = `<span style="color: #27ae60; font-weight: 600;">${stockInfo}</span>`;
}

function changeMainImg(el, src) {
  document.querySelectorAll('.thumb').forEach(t => {
    t.style.border = '2px solid #eee';
  });
  el.style.border = '2px solid #000';
  const mainImg = document.getElementById("d-main-img");
  if (mainImg) mainImg.src = src;
}

let touchStartX = 0;
function initSwipe(track) {
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });
  track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      const slides = track.querySelectorAll('.slide-img');
      const currentIndex = Math.round(track.offsetLeft / -window.innerWidth);
      if (currentIndex < slides.length - 1) {
        track.style.transform = `translateX(${(currentIndex + 1) * -100}%)`;
      }
    } else if (diff < -50) {
      const currentIndex = Math.round(track.offsetLeft / -window.innerWidth);
      if (currentIndex > 0) {
        track.style.transform = `translateX(${(currentIndex - 1) * -100}%)`;
      }
    }
  });
}

/* ========================
   PAGE PANIER COMPLÈTE
   ======================== */
function initCartPage() {
  // Initialiser la date et la référence de commande
  const today = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const screenDate = document.getElementById('screen-date');
  const printDate = document.getElementById('print-date');
  const orderRef = document.getElementById('order-ref');

  const refCommande = 'SIP-' + Math.floor(Date.now() / 1000);

  if (screenDate) screenDate.textContent = 'DATE : ' + today;
  if (printDate) printDate.textContent = today;
  if (orderRef) orderRef.textContent = refCommande;

  loadUserFormData();    // charge les données sauvegardées
  attachFormAutoSave();  // écoute les modifications pour sauvegarder

  // ✅ Initialisation de la date gérée par delivery-system.js (évite le double init + conflit UTC)

  renderCartPage();
}

function renderCartPage() {
  const tbody = document.getElementById('cart-tbody');
  const emptyMsg = document.getElementById('empty-cart-msg');
  const contentArea = document.getElementById('cart-content-area');
  const totalBrutSpan = document.getElementById('total-brut');
  const totalRemiseSpan = document.getElementById('total-remise');
  const grandTotalSpan = document.getElementById('grand-total');

  if (!tbody) return;

  if (!cart.length) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (contentArea) contentArea.style.display = 'none';
    if (totalBrutSpan) totalBrutSpan.textContent = '0 FCFA';
    if (totalRemiseSpan) totalRemiseSpan.textContent = '0 FCFA';
    if (grandTotalSpan) grandTotalSpan.textContent = '0 FCFA';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';
  if (contentArea) contentArea.style.display = 'block';

  const sip = calculateSipamoTotals();
  const totalBrut = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const remise = sip.remise || 0;

  let rowsHtml = '';
  cart.forEach((item, index) => {
    const qty = Number(item.qty) || 0;
    const price = Number(item.price) || 0;
    const itemTotal = qty * price;
    const reducedPrice = sip.perItemTotals[index]?.subtotal || 0;

    rowsHtml += `
      <tr>
        <td>
          <span class="item-name" style="font-weight:600;">${escapeHtml(item.name)}</span>
          <div class="item-details" style="margin-top:5px; color:#555;">
            Taille: ${escapeHtml(item.size)} | Couleur: ${escapeHtml(item.color)}
          </div>
        </td>
        <td class="text-center">
          <input type="number" min="1" value="${qty}"
                 onchange="updateCartQuantity(${index}, this.value); renderCartPage();"
                 style="width:45px; text-align:center; border:none; background:transparent; font-size:12px;">
        </td>
        <td class="text-right">${price.toLocaleString('fr-FR')} FCFA</td>
        <td class="text-right">${itemTotal.toLocaleString('fr-FR')} FCFA</td>
        <td class="text-right">${reducedPrice.toLocaleString('fr-FR')} FCFA</td>
        <td class="action-col" style="text-align:right;">
          <button class="btn-remove" onclick="removeFromCart(${index}); renderCartPage();" title="Supprimer">&times;</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = rowsHtml;

  if (totalBrutSpan) totalBrutSpan.textContent = totalBrut.toLocaleString('fr-FR') + ' FCFA';
  if (totalRemiseSpan) totalRemiseSpan.textContent = remise.toLocaleString('fr-FR') + ' FCFA';
  if (grandTotalSpan) grandTotalSpan.textContent = (sip.total || 0).toLocaleString('fr-FR') + ' FCFA';

  const noteEl = document.getElementById('promo-hint');
  if (noteEl) {
    if (totalBrut > 220000) {
      noteEl.textContent = "⭐ Réduction de 10% appliquée sur l'ensemble de votre commande !";
      noteEl.style.display = 'block';
    } else if (totalBrut > 50000) {
      noteEl.textContent = "⭐ Réduction de 5% appliquée sur l'ensemble de votre commande !";
      noteEl.style.display = 'block';
    } else {
      noteEl.style.display = 'none';
    }
  }
}

/* ========================
   TRAITEMENT DE COMMANDE
   ======================== */
window.processOrder = async function () {
  const name = document.getElementById('c-name')?.value.trim();
  const phone = document.getElementById('c-tel')?.value.trim();
  const email = document.getElementById('c-email')?.value.trim();
  const city = document.getElementById('c-city')?.value.trim();
  const deliveryDate = document.getElementById('c-delivery-date')?.value.trim();
  const deliveryTime = document.getElementById('c-delivery-time')?.value.trim();

  if (cart.length === 0) {
    showNotification('Votre panier est vide.', 'warning');
    return;
  }

  // Lire le mode de réception EN PREMIER pour conditionner les validations
  let deliveryMode = 'delivery';
  const modeRadios = document.querySelectorAll('input[name="deliveryMode"]');
  for (let radio of modeRadios) {
    if (radio.checked) { deliveryMode = radio.value; break; }
  }

  // Validation champ par champ — message précis sur le champ manquant
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  if (!name) {
    showNotification('⚠️ Veuillez entrer votre nom complet.', 'warning');
    document.getElementById('c-name')?.focus(); return;
  }
  if (!phone) {
    showNotification('⚠️ Veuillez entrer votre numéro WhatsApp.', 'warning');
    document.getElementById('c-tel')?.focus(); return;
  }
  if (!email || !emailRegex.test(email)) {
    showNotification('⚠️ Veuillez entrer une adresse email valide (ex: nom@domaine.com).', 'warning');
    document.getElementById('c-email')?.focus(); return;
  }
  if (deliveryMode === 'delivery' && !city) {
    showNotification('⚠️ Veuillez sélectionner votre ville de livraison.', 'warning');
    document.getElementById('c-city')?.focus(); return;
  }
  if (!deliveryDate) {
    showNotification('⚠️ Veuillez sélectionner une date de livraison.', 'warning');
    document.getElementById('c-delivery-date')?.focus(); return;
  }
  if (!deliveryTime) {
    showNotification('⚠️ Veuillez sélectionner une heure de livraison.', 'warning');
    document.getElementById('c-delivery-time')?.focus(); return;
  }

  let quartier = '', street = '';
  if (deliveryMode === 'pickup') {
    quartier = 'Retrait Total Melen';
    street = '';
  } else {
    if (city === 'Yaoundé') {
      quartier = document.getElementById('c-quartier')?.value.trim() || '';
      street = document.getElementById('c-street')?.value.trim() || '';

      if (!quartier) {
        showNotification('Veuillez entrer votre quartier à Yaoundé.', 'warning');
        return;
      }
      if (!street) {
        showNotification('Veuillez entrer votre rue / lieu-dit à Yaoundé.', 'warning');
        return;
      }

      if (typeof getZoneByQuartier === 'function') {
        const zone = getZoneByQuartier(quartier);
        if (!zone) {
          showNotification('❌ Quartier non reconnu. Veuillez vérifier l\'orthographe ou consulter les zones disponibles.', 'warning');
          return;
        }
      }
    }
  }

  // Validation de la date de livraison
  const expectedDate = getEarliestDeliveryDate(deliveryTime);
  if (deliveryDate !== expectedDate) {
    showNotification('⚠️ La date de livraison ne respecte pas le délai de 3 jours pleins (pas de livraison le dimanche). Veuillez rafraîchir la page et sélectionner à nouveau l\'heure.', 'warning');
    return;
  }

  // Générer ou récupérer la référence
  let ref = document.getElementById('order-ref')?.textContent?.trim() || 'SIP-' + Math.floor(Date.now() / 1000);

  const btn = document.querySelector('.btn-order');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi de la commande...';
  }

  const sip = calculateSipamoTotals();
  let deliveryFee = 0;
  if (typeof getSelectedDeliveryFee === 'function') {
    deliveryFee = getSelectedDeliveryFee();
  }
  // En mode retrait, getSelectedDeliveryFee() retourne déjà 0 — ne pas écraser
  const totalAPayer = sip.total + deliveryFee;
  const formattedDeliveryDate = formatDateFR(deliveryDate);

  let detailArticles = '';
  cart.forEach(item => {
    const stBrut = item.qty * item.price;
    detailArticles += `- ${item.name} (${item.size || '-'} / ${item.color || '-'}) x${item.qty} = ${stBrut.toLocaleString('fr-FR')} FCFA\n`;
  });

  const infoLivraison = `Vous allez être contacté sur WhatsApp au numéro ${WHATSAPP_PHONE} pour la livraison et la finalisation de votre commande.\nDate de livraison prévue: ${formattedDeliveryDate}\nPlage horaire: ${deliveryTime}h à ${parseInt(deliveryTime) + 1}h`;

  // --- CONSTRUCTION DES LIENS POUR LES DOCUMENTS ---
  const baseUrl = 'https://www.sipamo.site';
  const bonLink = `${baseUrl}/bon-commande.html?ref=${encodeURIComponent(ref)}`;
  const factureLink = `${baseUrl}/facture-bon.html?ref=${encodeURIComponent(ref)}`;

  // AJOUT SIPAMO : Créer l'objet JSON complet avant l'envoi
  const orderToSave = {
    ref: ref,
    date: new Date().toISOString(),
    client: { name, phone, email, city, quartier, street },
    deliveryDate: deliveryDate,
    deliveryTime: deliveryTime,
    cart: cart.map(item => ({ ...item }))
  };

  // --- ENVOI À GOOGLE SHEETS ---
  const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxn9QPt9aODT0riL0S0IAobdV_CZu3dHe1s-nyNd9ZaxGdARVPVVSzV5TJu6aOK_7sB/exec';

  fetch(GOOGLE_SHEETS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ref: ref,
      date: new Date().toLocaleString('fr-FR'),
      nom: name,
      telephone: phone,
      email: email,
      ville: city,
      quartier: city === 'Yaoundé' ? quartier : '-',
      rue: city === 'Yaoundé' ? street : '-',
      articles: detailArticles,
      total_produits: sip.total.toLocaleString('fr-FR') + ' FCFA',
      frais_livraison: (deliveryFee || 0).toLocaleString('fr-FR') + ' FCFA',
      total_payer: (Number(totalAPayer) || 0).toLocaleString('fr-FR') + ' FCFA',
      date_livraison: formattedDeliveryDate,
      heure_livraison: deliveryTime + 'h - ' + (parseInt(deliveryTime) + 1) + 'h',
      lien_bon: bonLink,
      lien_facture: factureLink,
      order_data: JSON.stringify(orderToSave) // JSON brut pour facture-bon.html et bon-commande.html
    })
  }).catch(err => console.warn('Erreur envoi Google Sheets:', err));

  // --- SAUVEGARDE LOCALE + WHATSAPP (toujours exécutés, indépendamment de l'email) ---
  localStorage.setItem('order_' + ref, JSON.stringify(orderToSave));

  const messageText =
    `*NOUVELLE COMMANDE SIPAMO* (réf: ${ref})\n\n` +
    `*Client :* ${name}\n` +
    `*Téléphone :* ${phone}\n` +
    `*Adresse :* ${city}${city === 'Yaoundé' ? ' - ' + quartier + ', ' + street : ''}\n` +
    `*Livraison :* ${formattedDeliveryDate} à ${deliveryTime}h\n\n` +
    `*Articles :*\n${detailArticles}\n` +
    `*Total à payer :* ${totalAPayer.toLocaleString('fr-FR')} FCFA`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(messageText)}`;
  window.open(whatsappUrl, '_blank');

  showNotification(`✅ Commande confirmée ! (réf: ${ref}) Vous allez être contacté sur WhatsApp.`, 'success');
  showNotification('Vous pouvez imprimer votre Bon de commande ou continuer vos achats.', 'info');

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }

  // --- ENVOI EMAILS VIA API VERCEL + RESEND (non bloquant) ---
  const orderForEmail = {
    ref: ref,
    client: { name, phone, email, city, quartier, street },
    cart: cart.map(item => ({ ...item })),
    totalAPayer: (Number(totalAPayer) || 0).toLocaleString('fr-FR') + ' FCFA',
    sousTotal: sip.total.toLocaleString('fr-FR') + ' FCFA',
    deliveryDate: formattedDeliveryDate,
    deliveryTime: deliveryTime,
    fraisLivraison: (deliveryFee || 0).toLocaleString('fr-FR') + ' FCFA',
    detailsArticles: detailArticles,
    bonLink: bonLink,
    factureLink: factureLink,
  };

  fetch('/api/send-order-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Secret-Token': 'sipamo2026', // doit correspondre à la variable API_SECRET sur Vercel
    },
    body: JSON.stringify(orderForEmail),
  }).catch(err => console.warn('Envoi email échoué (non bloquant) :', err));
};

/* ========================
   SAUVEGARDE FORMULAIRE CLIENT
   ======================== */
function saveUserFormData() {
  const formData = {
    name: document.getElementById('c-name')?.value || '',
    phone: document.getElementById('c-tel')?.value || '',
    email: document.getElementById('c-email')?.value || '',
    city: document.getElementById('c-city')?.value || '',
    quartier: document.getElementById('c-quartier')?.value || '',
    street: document.getElementById('c-street')?.value || '',
    deliveryDate: document.getElementById('c-delivery-date')?.value || '',
    deliveryTime: document.getElementById('c-delivery-time')?.value || ''
  };
  localStorage.setItem('sipamo_user_form', JSON.stringify(formData));
}

function loadUserFormData() {
  const saved = localStorage.getItem('sipamo_user_form');
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    if (data.name) document.getElementById('c-name').value = data.name;
    if (data.phone) document.getElementById('c-tel').value = data.phone;
    if (data.email) document.getElementById('c-email').value = data.email;
    if (data.city) {
      document.getElementById('c-city').value = data.city;
      if (data.city === 'Yaoundé' && typeof window.handleCityChange === 'function') {
        window.handleCityChange();
      }
    }
    if (data.quartier) {
      const quartierEl = document.getElementById('c-quartier');
      if (quartierEl) quartierEl.value = data.quartier;
      if (typeof window.validateQuartier === 'function') window.validateQuartier();
    }
    if (data.street) {
      const streetEl = document.getElementById('c-street');
      if (streetEl) streetEl.value = data.street;
    }
    if (data.deliveryDate) document.getElementById('c-delivery-date').value = data.deliveryDate;
    if (data.deliveryTime) document.getElementById('c-delivery-time').value = data.deliveryTime;
  } catch (e) {
    console.warn('Erreur de chargement des données utilisateur', e);
  }
}

function attachFormAutoSave() {
  const fields = ['c-name', 'c-tel', 'c-email', 'c-city', 'c-quartier', 'c-street', 'c-delivery-date', 'c-delivery-time'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', saveUserFormData);
      el.addEventListener('change', saveUserFormData);
    }
  });
}

window.clearCart = function () {
  if (confirm('Vider le panier ?')) {
    cart = [];
    saveCart();
    renderCartPage();
  }
};

/* ========================
   LIGHTBOX
   ======================== */
let currentLightboxIndex = 0;
let lightboxImages = [];

window.openLightbox = function(index = 0) {
  const product = window.currentProduct;
  if (!product || !product.images || product.images.length === 0) return;
  lightboxImages = product.images;
  currentLightboxIndex = Math.max(0, Math.min(index, lightboxImages.length - 1));
  const img = document.getElementById('lightbox-img');
  const lb  = document.getElementById('lightbox');
  if (img) img.src = lightboxImages[currentLightboxIndex];
  if (lb)  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.style.display = 'none';
  document.body.style.overflow = '';
};

window.changeLightbox = function(direction) {
  if (lightboxImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
  const img = document.getElementById('lightbox-img');
  if (img) img.src = lightboxImages[currentLightboxIndex];
};

// Navigation clavier pour la lightbox
document.addEventListener('keydown', function(e) {
  const lb = document.getElementById('lightbox');
  if (!lb || lb.style.display === 'none') return;
  if (e.key === 'Escape')     window.closeLightbox();
  if (e.key === 'ArrowLeft')  window.changeLightbox(-1);
  if (e.key === 'ArrowRight') window.changeLightbox(1);
});
