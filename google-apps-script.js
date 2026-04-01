// ============================================================
//  SIPAMO — Google Apps Script
//  Coller ce code sur https://script.google.com
//  Puis : Déployer > Nouveau déploiement > Application Web
//         Exécuter en tant que : Moi
//         Accès : Tout le monde
// ============================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const SHEET_ID = '1q2buykI8D0MeEQQcI9IkjKy37sqEK9cHvhsIE-208y0';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Commandes');

    // Vérifier les en-têtes
    let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (!headers.includes('statut')) {
      sheet.getRange(1, headers.length + 1).setValue('statut');
      sheet.getRange(1, headers.length + 2).setValue('rappel_envoye');
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }

    // Ajouter la ligne
    sheet.appendRow([
      data.ref            || '',
      data.date           || '',
      data.nom            || '',
      data.telephone      || '',
      data.email          || '',
      data.ville          || '',
      data.quartier       || '',
      data.articles       || '',
      data.total_produits || '',
      data.frais_livraison|| '',
      data.total_payer    || '',
      data.date_livraison || '',
      data.heure_livraison|| '',
      data.lien_bon       || '',
      data.lien_facture   || '',
      data.order_data     || '',
      'nouvelle',         // statut
      ''                  // rappel_envoye
    ]);

    // Envoyer l'email de confirmation au client
    if (data.email) {
      const bonLink = data.lien_bon || '';
      const factureLink = data.lien_facture || '';
      const articlesHtml = (data.articles || '').split('\n').filter(l => l.trim()).map(l => `<tr><td style="padding:6px 10px; border-bottom:1px solid #eee;">${l.trim()}</td></tr>`).join('');
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
          <div style="background: #000; padding: 20px 30px;">
            <h1 style="color: #fff; font-size: 22px; letter-spacing: 3px; margin: 0;">SIPAMO</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 15px;">Bonjour <strong>${data.nom || ''}</strong>,</p>
            <p>Votre commande a bien été enregistrée. Voici le récapitulatif :</p>
            <table style="width:100%; border-collapse:collapse; margin: 20px 0; font-size:13px;">
              <tr style="background:#f5f5f5;"><td style="padding:6px 10px; font-weight:bold; width:40%;">Référence</td><td style="padding:6px 10px;">${data.ref || ''}</td></tr>
              <tr><td style="padding:6px 10px; font-weight:bold; background:#fafafa;">Date</td><td style="padding:6px 10px;">${data.date || ''}</td></tr>
              <tr style="background:#f5f5f5;"><td style="padding:6px 10px; font-weight:bold;">Ville</td><td style="padding:6px 10px;">${data.ville || ''}</td></tr>
              <tr><td style="padding:6px 10px; font-weight:bold; background:#fafafa;">Quartier</td><td style="padding:6px 10px;">${data.quartier || ''}</td></tr>
              <tr style="background:#f5f5f5;"><td style="padding:6px 10px; font-weight:bold;">Date de livraison</td><td style="padding:6px 10px;">${data.date_livraison || ''}</td></tr>
              <tr><td style="padding:6px 10px; font-weight:bold; background:#fafafa;">Heure de livraison</td><td style="padding:6px 10px;">${data.heure_livraison || ''}</td></tr>
            </table>
            <p style="font-weight:bold; margin-bottom:6px;">Articles commandés :</p>
            <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:20px;">
              ${articlesHtml}
            </table>
            <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:20px;">
              <tr style="background:#f5f5f5;"><td style="padding:6px 10px;">Total produits</td><td style="padding:6px 10px; text-align:right;">${data.total_produits || ''}</td></tr>
              <tr><td style="padding:6px 10px; background:#fafafa;">Frais de livraison</td><td style="padding:6px 10px; text-align:right; background:#fafafa;">${data.frais_livraison || ''}</td></tr>
              <tr style="background:#fff8e1;"><td style="padding:8px 10px; font-weight:bold; font-size:14px;">Total à payer</td><td style="padding:8px 10px; text-align:right; font-weight:bold; font-size:14px; color:#d4a017;">${data.total_payer || ''}</td></tr>
            </table>
            <p style="font-size:13px; color:#555; background:#fff8e1; padding:12px; border-radius:4px;">
              Nous vous contacterons sous 48h sur WhatsApp (${data.telephone || ''}) pour confirmer la disponibilité et organiser la livraison.
            </p>
            <div style="margin: 24px 0; text-align:center;">
              <a href="${bonLink}" style="display:inline-block; background:#000; color:#fff; text-decoration:none; padding:12px 28px; font-size:13px; letter-spacing:1px; border-radius:3px; margin-right:10px;">Bon de commande</a>
              <a href="${factureLink}" style="display:inline-block; background:#d4a017; color:#fff; text-decoration:none; padding:12px 28px; font-size:13px; letter-spacing:1px; border-radius:3px;">Facture</a>
            </div>
            <p style="font-size:12px; color:#999; border-top:1px solid #eee; padding-top:15px;">
              Merci de votre confiance.<br>
              <strong>L'équipe SIPAMO</strong><br>
              <a href="mailto:contact@sipamo.site" style="color:#999;">contact@sipamo.site</a>
            </p>
          </div>
        </div>
      `;
      MailApp.sendEmail({
        to: data.email,
        subject: 'Votre commande SIPAMO (' + (data.ref || '') + ') — Confirmation',
        htmlBody: htmlBody,
        replyTo: 'contact@sipamo.site',
        name: 'SIPAMO'
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Lecture d'une commande par référence (appelée par facture-bon.html et bon-commande.html) ──
// URL : ...exec?ref=SIP-XXXXXXXXXX
function doGet(e) {
  try {
    const ref = e.parameter.ref;
    if (!ref) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Paramètre ref manquant' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const SHEET_ID = '1q2buykI8D0MeEQQcI9IkjKy37sqEK9cHvhsIE-208y0';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Commandes');
    const data  = sheet.getDataRange().getValues();

    // Ligne 0 = en-têtes, on cherche la colonne "Référence" (col 0) et "order_data" (col 15)
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === ref) {
        const orderData = data[i][15]; // Colonne order_data
        if (orderData) {
          return ContentService
            .createTextOutput(JSON.stringify({ success: true, data: orderData }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Commande introuvable' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendDeliveryReminders() {
  const SHEET_ID = '1q2buykI8D0MeEQQcI9IkjKy37sqEK9cHvhsIE-208y0';
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Commandes');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const refCol = headers.indexOf('Référence');
  const emailCol = headers.indexOf('Email');
  const nomCol = headers.indexOf('Nom');
  const dateCommandeCol = headers.indexOf('Date');
  const rappelCol = headers.indexOf('rappel_envoye');
  const statutCol = headers.indexOf('statut');

  if (rappelCol === -1 || statutCol === -1) return;

  const now = new Date();
  for (let i = 1; i < data.length; i++) {
    const ref = data[i][refCol];
    const email = data[i][emailCol];
    const nom = data[i][nomCol];
    const dateCommande = data[i][dateCommandeCol];
    const rappelEnvoye = data[i][rappelCol];
    const statut = data[i][statutCol];

    if (!email || rappelEnvoye || statut !== 'nouvelle') continue;

    const cmdDate = new Date(dateCommande);
    const diffHours = (now - cmdDate) / (1000 * 60 * 60);
    if (diffHours >= 70) {
      const bonLink = `https://www.sipamo.site/bon-commande.html?ref=${ref}`;
      const factureLink = `https://www.sipamo.site/facture-bon.html?ref=${ref}`;
      const subject = `Votre commande SIPAMO (${ref}) est prête à être livrée`;
      const htmlBody = `
        <p>Bonjour ${nom},</p>
        <p>Votre commande référencée <strong>${ref}</strong> est désormais prête à être livrée.</p>
        <p>Nous vous rappelons nos conditions de livraison :</p>
        <ul>
          <li><strong>Yaoundé :</strong> Paiement à la livraison possible. Les frais de livraison sont à régler avant l'envoi du livreur. Le paiement de l'article se fait à la réception. (Frais de livraison non remboursables)</li>
          <li><strong>Hors Yaoundé :</strong> Paiement intégral (articles + frais de livraison) par Mobile Money à la commande.</li>
          <li><strong>Retrait gratuit à Total Melen (Yaoundé) :</strong> Pour ceux qui préfèrent venir chercher.</li>
        </ul>
        <p>Vous pouvez consulter votre facture et votre bon de commande ici :<br>
        <a href="${bonLink}">Bon de commande</a><br>
        <a href="${factureLink}">Facture</a></p>
        <p>Nous vous remercions de votre confiance et restons à votre disposition.</p>
        <p>Cordialement,<br>L'équipe SIPAMO</p>
      `;

      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: htmlBody
      });

      sheet.getRange(i + 1, rappelCol + 1).setValue(new Date().toISOString());
      sheet.getRange(i + 1, statutCol + 1).setValue('rappel_envoye');
    }
  }
}
