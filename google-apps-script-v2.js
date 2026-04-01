// ============================================================
//  SIPAMO — Google Apps Script V2
//  SYSTÈME D'EMAILS DEPUIS GOOGLE SHEETS
//  
//  Flux :
//  1. Commande créée → Email1 (validation requise)
//  2. Client clique sur lien → Marque "validé" dans Sheets
//  3. 70h après validation → Email2 (commande prête)
// ============================================================

const SHEET_ID = '1q2buykI8D0MeEQQcI9IkjKy37sqEK9cHvhsIE-208y0';
const EMAIL_CONTACT = 'contact@sipamo.site';

// ==================== doPost : Ajouter la commande à Sheets ====================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Commandes');

    // Vérifier les en-têtes
    let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (!headers.includes('statut')) {
      sheet.getRange(1, headers.length + 1).setValue('statut');
      sheet.getRange(1, headers.length + 2).setValue('date_validation');
      sheet.getRange(1, headers.length + 3).setValue('email_validé_sent');
      sheet.getRange(1, headers.length + 4).setValue('email_prêt_sent');
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }

    // Ajouter la ligne avec statut "en attente validation"
    sheet.appendRow([
      data.ref,
      data.date,
      data.nom,
      data.telephone,
      data.email,
      data.ville,
      data.quartier,
      data.rue,
      data.articles,
      data.total_produits,
      data.frais_livraison,
      data.total_payer,
      data.date_livraison,
      data.heure_livraison,
      data.lien_bon,
      data.lien_facture,
      data.order_data,
      'en attente validation', // statut
      '', // date_validation
      '', // email_validé_sent
      ''  // email_prêt_sent
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==================== doGet : Récupérer les données et envoyer Email1 ====================
function doGet(e) {
  try {
    const ref = e.parameter.ref;
    const action = e.parameter.action; // "validate" pour validation
    
    if (!ref) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Paramètre ref manquant' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Commandes');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    // Trouver les colonnes
    const refCol = headers.indexOf('Référence');
    const nomCol = headers.indexOf('Nom');
    const emailCol = headers.indexOf('Email');
    const telephoneCol = headers.indexOf('Telephone');
    const villeCol = headers.indexOf('Ville');
    const quartierCol = headers.indexOf('Quartier');
    const articleCol = headers.indexOf('Articles');
    const totalProdCol = headers.indexOf('Total produits');
    const fraisLivCol = headers.indexOf('Frais livraison');
    const totalPayCol = headers.indexOf('Total à payer');
    const dateLivCol = headers.indexOf('Date livraison');
    const heureLivCol = headers.indexOf('Heure livraison');
    const lienBonCol = headers.indexOf('Lien bon');
    const lienFactCol = headers.indexOf('Lien facture');
    const orderDataCol = headers.indexOf('Order data');
    const statutCol = headers.indexOf('statut');
    const dateValCol = headers.indexOf('date_validation');
    const emailValCol = headers.indexOf('email_validé_sent');
    const emailPretCol = headers.indexOf('email_prêt_sent');

    // Chercher la commande
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][refCol] === ref) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Commande introuvable' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const row = data[rowIndex];
    const nom = row[nomCol];
    const email = row[emailCol];
    const telephone = row[telephoneCol];
    const ville = row[villeCol];
    const quartier = row[quartierCol];
    const articles = row[articleCol];
    const totalProd = row[totalProdCol];
    const fraisLiv = row[fraisLivCol];
    const totalPay = row[totalPayCol];
    const dateLiv = row[dateLivCol];
    const heureLiv = row[heureLivCol];
    const lienBon = row[lienBonCol];
    const lienFact = row[lienFactCol];
    const orderData = row[orderDataCol];
    const statut = row[statutCol];
    const emailValSent = row[emailValCol];

    // ─── ACTION 1 : Client valide sa commande ───
    if (action === 'validate') {
      // Marquer comme "validé"
      sheet.getRange(rowIndex + 1, statutCol + 1).setValue('validé');
      sheet.getRange(rowIndex + 1, dateValCol + 1).setValue(new Date().toISOString());

      // Envoyer Email 2 : Validation confirmée (depuis contact@sipamo.site)
      sendEmailValidationConfirmed(nom, email, ref, lienBon, lienFact);

      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: 'Commande validée !' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ─── ACTION 2 : Retourner les données de la commande (pour bon-commande.html) ───
    if (!emailValSent) {
      // Premier accès → Envoyer Email 1 : Invitation à valider
      sendEmailValidationRequired(nom, email, ref, lienBon, lienFact);
      sheet.getRange(rowIndex + 1, emailValCol + 1).setValue(new Date().toISOString());
    }

    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        data: orderData,
        statut: statut
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==================== EMAIL 1 : Invitation à valider ====================
function sendEmailValidationRequired(nom, email, ref, lienBon, lienFact) {
  const validateLink = `https://script.google.com/macros/s/AKfycbxn9QPt9aODT0riL0S0IAobdV_CZu3dHe1s-nyNd9ZaxGdARVPVVSzV5TJu6aOK_7sB/usercallable?ref=${encodeURIComponent(ref)}&action=validate`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
      <div style="background: #000; padding: 20px 30px;">
        <h1 style="color: #fff; font-size: 22px; letter-spacing: 3px; margin: 0;">SIPAMO</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 15px;">Bonjour <strong>${nom}</strong>,</p>
        <p>Votre commande <strong>${ref}</strong> a bien été enregistrée.</p>
        
        <p style="font-weight: bold; color: #d4a017; font-size: 14px;">
          ⚠️ ÉTAPE IMPORTANTE : Veuillez valider votre bon de commande
        </p>
        
        <p>Cliquez sur le lien ci-dessous pour consulter et valider votre bon :</p>
        
        <div style="text-align: center; margin: 28px 0;">
          <a href="${lienBon}" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 14px 32px; font-size: 14px; letter-spacing: 1px; border-radius: 3px; margin-bottom: 12px;">
            📋 Consulter mon bon de commande
          </a>
        </div>

        <div style="background: #f0f0f0; padding: 16px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #555;">
            Une fois votre bon validé, nous vous contacterons sous 48h sur WhatsApp au <strong>${nom}</strong> pour confirmer la disponibilité et organiser la livraison.
          </p>
        </div>

        <p style="font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 15px;">
          Merci de votre confiance.<br>
          <strong>L'équipe SIPAMO</strong><br>
          <a href="mailto:${EMAIL_CONTACT}" style="color: #999;">${EMAIL_CONTACT}</a>
        </p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: email,
    subject: `Validez votre bon de commande SIPAMO (${ref})`,
    htmlBody: htmlBody,
    replyTo: EMAIL_CONTACT,
    name: 'SIPAMO',
    from: EMAIL_CONTACT
  });
}

// ==================== EMAIL 2 : Confirmation de validation ====================
function sendEmailValidationConfirmed(nom, email, ref, lienBon, lienFact) {
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
      <div style="background: #000; padding: 20px 30px;">
        <h1 style="color: #fff; font-size: 22px; letter-spacing: 3px; margin: 0;">SIPAMO</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 15px;">Bonjour <strong>${nom}</strong>,</p>
        <p style="font-size: 14px; color: #27ae60;">✅ Votre commande <strong>${ref}</strong> a été validée avec succès !</p>
        
        <p>Nous vous contacterons sous 48h sur WhatsApp pour :</p>
        <ul style="font-size: 13px; color: #555;">
          <li>Confirmer la disponibilité de vos articles</li>
          <li>Finaliser les détails de livraison</li>
          <li>Organiser la date et l'heure de passage</li>
        </ul>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${lienFact}" style="display: inline-block; background: #d4a017; color: #fff; text-decoration: none; padding: 12px 28px; font-size: 13px; letter-spacing: 1px; border-radius: 3px;">
            📄 Consulter ma facture
          </a>
        </div>

        <p style="font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 15px;">
          Merci de votre confiance.<br>
          <strong>L'équipe SIPAMO</strong><br>
          <a href="mailto:${EMAIL_CONTACT}" style="color: #999;">${EMAIL_CONTACT}</a>
        </p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: email,
    subject: `Commande validée ✅ — SIPAMO (${ref})`,
    htmlBody: htmlBody,
    replyTo: EMAIL_CONTACT,
    name: 'SIPAMO',
    from: EMAIL_CONTACT
  });
}

// ==================== EMAIL 3 : Commande prête (70h après validation) ====================
function sendDeliveryReminders() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Commandes');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const refCol = headers.indexOf('Référence');
  const emailCol = headers.indexOf('Email');
  const nomCol = headers.indexOf('Nom');
  const dateValCol = headers.indexOf('date_validation');
  const emailPretCol = headers.indexOf('email_prêt_sent');
  const statutCol = headers.indexOf('statut');
  const lienBonCol = headers.indexOf('Lien bon');
  const lienFactCol = headers.indexOf('Lien facture');

  if (refCol === -1 || emailPretCol === -1 || statutCol === -1) return;

  const now = new Date();
  for (let i = 1; i < data.length; i++) {
    const ref = data[i][refCol];
    const email = data[i][emailCol];
    const nom = data[i][nomCol];
    const dateVal = data[i][dateValCol];
    const emailPretSent = data[i][emailPretCol];
    const statut = data[i][statutCol];
    const lienBon = data[i][lienBonCol];
    const lienFact = data[i][lienFactCol];

    if (!email || emailPretSent || statut !== 'validé') continue;

    if (!dateVal) continue;

    const valDate = new Date(dateVal);
    const diffHours = (now - valDate) / (1000 * 60 * 60);

    if (diffHours >= 70) {
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
          <div style="background: #000; padding: 20px 30px;">
            <h1 style="color: #fff; font-size: 22px; letter-spacing: 3px; margin: 0;">SIPAMO</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 15px;">Bonjour <strong>${nom}</strong>,</p>
            <p style="font-size: 14px; color: #27ae60;">🎉 Votre commande <strong>${ref}</strong> est maintenant prête à être livrée !</p>
            
            <p>Nos équipes vous recontacteront très bientôt sur WhatsApp pour finaliser la livraison.</p>

            <p style="font-weight: bold; color: #d4a017;">Conditions de livraison :</p>
            <ul style="font-size: 13px; color: #555;">
              <li><strong>Yaoundé :</strong> Paiement à la livraison possible</li>
              <li><strong>Hors Yaoundé :</strong> Paiement intégral par Mobile Money</li>
              <li><strong>Retrait gratuit :</strong> À Total Melen (Yaoundé)</li>
            </ul>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${lienBon}" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 28px; font-size: 13px; letter-spacing: 1px; border-radius: 3px; margin-right: 10px;">
                📋 Bon de commande
              </a>
              <a href="${lienFact}" style="display: inline-block; background: #d4a017; color: #fff; text-decoration: none; padding: 12px 28px; font-size: 13px; letter-spacing: 1px; border-radius: 3px;">
                📄 Facture
              </a>
            </div>

            <p style="font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 15px;">
              Merci de votre confiance.<br>
              <strong>L'équipe SIPAMO</strong><br>
              <a href="mailto:${EMAIL_CONTACT}" style="color: #999;">${EMAIL_CONTACT}</a>
            </p>
          </div>
        </div>
      `;

      MailApp.sendEmail({
        to: email,
        subject: `Votre commande est prête 🎉 — SIPAMO (${ref})`,
        htmlBody: htmlBody,
        replyTo: EMAIL_CONTACT,
        name: 'SIPAMO',
        from: EMAIL_CONTACT
      });

      sheet.getRange(i + 1, emailPretCol + 1).setValue(new Date().toISOString());
    }
  }
}
