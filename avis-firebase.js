// --- 1. CONFIGURATION (C'est ici qu'on met les clés du coffre) ---
// Allez dans Firebase > Paramètres du projet > Général > Vos applications
// Copiez le "firebaseConfig" et remplacez la section ci-dessous :

const firebaseConfig = {
    apiKey: "VOTRE_API_KEY_ICI",
    authDomain: "sipamo-sarl.firebaseapp.com",
    projectId: "sipamo-sarl",
    storageBucket: "sipamo-sarl.appspot.com",
    messagingSenderId: "VOTRE_SENDER_ID",
    appId: "VOTRE_APP_ID"
};

// On démarre Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- 2. CHARGEMENT DES AVIS ---
document.addEventListener("DOMContentLoaded", function() {
    console.log("Système d'avis démarré...");
    
    // On récupère l'ID du produit dans l'adresse (URL)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // ex: "7"

    if(productId) {
        chargerLesAvis(productId);
    } else {
        console.log("Aucun ID de produit trouvé.");
    }

    // Gestion du clic sur les étoiles pour noter
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const valeur = this.getAttribute('data-value');
            document.getElementById('rating-value').value = valeur;
            
            // On colorie les étoiles en or jusqu'à celle cliquée
            stars.forEach(s => {
                if(s.getAttribute('data-value') <= valeur) {
                    s.style.color = "#d4a017"; // Or
                } else {
                    s.style.color = "#ccc"; // Gris
                }
            });
        });
    });
});

// Fonction pour aller chercher les avis dans le "frigo" (Firebase)
function chargerLesAvis(idProduit) {
    const listeDiv = document.getElementById('reviews-list');
    const countSpan = document.getElementById('review-count');

    // On demande à Firebase : "Donne-moi les avis du produit X"
    db.collection("reviews")
      .where("productId", "==", idProduit)
      .get()
      .then((querySnapshot) => {
          
          // Mise à jour du nombre total d'avis
          if(countSpan) countSpan.innerText = querySnapshot.size;

          if (querySnapshot.empty) {
              listeDiv.innerHTML = "<p>Soyez le premier à donner votre avis !</p>";
              return;
          }

          // On vide la liste pour éviter les doublons
          listeDiv.innerHTML = "";

          // Pour chaque avis trouvé, on crée l'affichage
          querySnapshot.forEach((doc) => {
              const avis = doc.data();
              
              // On convertit la note (chiffre) en étoiles visuelles
              let etoiles = "";
              for(let i=0; i<5; i++) {
                  if(i < avis.rating) etoiles += "★";
                  else etoiles += "☆";
              }

              const htmlAvis = `
                  <div class="review-item" style="border-bottom:1px solid #eee; padding:10px 0;">
                      <div style="font-weight:bold; font-size:14px;">${avis.name} <span style="color:#d4a017">${etoiles}</span></div>
                      <div style="font-size:13px; margin-top:5px;">${avis.text}</div>
                      <div style="font-size:10px; color:#999; margin-top:5px;">Posté le ${avis.dateString || "Récemment"}</div>
                  </div>
              `;
              listeDiv.innerHTML += htmlAvis;
          });
      })
      .catch((error) => {
          console.error("Erreur de chargement : ", error);
          listeDiv.innerHTML = "<p>Impossible de charger les avis pour le moment.</p>";
      });
}

// --- 3. ENVOYER UN AVIS ---
function submitReview() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    const nom = document.getElementById('review-name').value;
    const texte = document.getElementById('review-text').value;
    const note = document.getElementById('rating-value').value;

    if(!nom || !texte || note == "0") {
        alert("Merci de remplir votre nom, le commentaire et de cliquer sur une étoile !");
        return;
    }

    // On prépare le paquet à envoyer
    const nouvelAvis = {
        productId: productId,
        name: nom,
        text: texte,
        rating: parseInt(note),
        dateString: new Date().toLocaleDateString("fr-FR"),
        dateTimestamp: firebase.firestore.FieldValue.serverTimestamp() // Pour trier par date plus tard
    };

    // On envoie vers Firebase
    db.collection("reviews").add(nouvelAvis)
    .then(() => {
        alert("Merci ! Votre avis a été publié.");
        location.reload(); // On recharge la page pour voir l'avis
    })
    .catch((error) => {
        console.error("Erreur : ", error);
        alert("Une erreur est survenue.");
    });
}