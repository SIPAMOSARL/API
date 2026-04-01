
// api/send-order-email.js
// Fonction Vercel Serverless — Envoi des emails de commande via Resend
// Dépendance : npm install resend

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

  // ── 1. Méthode HTTP ──────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // ── 2. Token secret (sécurité basique) ───────────────────────────
  const secretToken = req.headers['x-secret-token'];
  if (secretToken !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  // ── 3. Validation des données reçues ─────────────────────────────
  const order = req.body;
  if (!order || !order.client || !order.cart) {
    return res.status(400).json({ error: 'Données manquantes' });
  }

  const {
    client,
    cart,
    ref,
    totalAPayer,
    sousTotal,
    deliveryDate,
    deliveryTime,
    fraisLivraison,
    detailsArticles,
    bonLink,
    factureLink,
  } = order;

  // ── 4. Email administrateur (complet) ────────────────────────────
  const adminHtml = `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1a1a2e; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">📦 SIPAMO — Nouvelle commande</h1>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #eee;">
            <td style="padding: 8px 12px; font-weight: bold;">Référence</td>
            <td style="padding: 8px 12px;">${ref}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold;">Client</td>
            <td style="padding: 8px 12px;">${client.name}</td>
          </tr>
          <tr style="background: #eee;">
            <td style="padding: 8px 12px; font-weight: bold;">WhatsApp</td>
            <td style="padding: 8px 12px;">${client.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold;">Email</td>
            <td style="padding: 8px 12px;">${client.email}</td>
          </tr>
          <tr style="background: #eee;">
            <td style="padding: 8px 12px; font-weight: bold;">Adresse</td>
            <td style="padding: 8px 12px;">
              ${client.city}
              ${client.quartier ? ` — ${client.quartier}` : ''}
              ${client.street ? `, ${client.street}` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold;">Livraison</td>
            <td style="padding: 8px 12px;">${deliveryDate} à ${deliveryTime}h</td>
          </tr>
        </table>

        <h3 style="border-bottom: 2px solid #1a1a2e; padding-bottom: 6px;">🛒 Articles commandés</h3>
        <pre style="background: #fff; padding: 12px; border: 1px solid #ddd; border-radius: 4px; white-space: pre-wrap; font-size: 13px;">${detailsArticles}</pre>

        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 6px 12px;">Sous-total produits</td>
            <td style="padding: 6px 12px; text-align: right;">${sousTotal}</td>
          </tr>
          <tr>
            <td style="padding: 6px 12px;">Frais de livraison</td>
            <td style="padding: 6px 12px; text-align: right;">${fraisLivraison}</td>
          </tr>
          <tr style="background: #1a1a2e; color: white; font-weight: bold; font-size: 16px;">
            <td style="padding: 10px 12px;">TOTAL À PAYER</td>
            <td style="padding: 10px 12px; text-align: right;">${totalAPayer}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="${bonLink}" style="background: #1a1a2e; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin: 0 8px; display: inline-block;">
            📄 Bon de commande
          </a>
          <a href="${factureLink}" style="background: #e67e22; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin: 0 8px; display: inline-block;">
            🧾 Facture
          </a>
        </div>

      </div>
    </body>
    </html>
  `;

  // ── 5. Email client (confirmation, plus court) ───────────────────
  const clientHtml = `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1a1a2e; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">✅ Commande confirmée — SIPAMO</h1>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">

        <p style="font-size: 16px;">Bonjour <strong>${client.name}</strong>,</p>
        <p>Merci pour votre commande ! Nous avons bien reçu votre demande et nous vous contacterons dans les 48h sur WhatsApp pour confirmer la disponibilité et organiser la livraison.</p>

        <div style="background: #e8f5e9; border-left: 4px solid #2ecc71; padding: 12px 16px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Référence :</strong> ${ref}</p>
          <p style="margin: 6px 0 0;"><strong>Livraison prévue :</strong> ${deliveryDate} à ${deliveryTime}h</p>
          <p style="margin: 6px 0 0;"><strong>Total à payer :</strong> ${totalAPayer}</p>
        </div>

        <p>Pour toute question, contactez-nous sur WhatsApp ou par email.</p>

        <div style="margin-top: 24px; text-align: center;">
          <a href="${bonLink}" style="background: #1a1a2e; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin: 0 8px; display: inline-block;">
            📄 Mon bon de commande
          </a>
          <a href="${factureLink}" style="background: #e67e22; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin: 0 8px; display: inline-block;">
            🧾 Ma facture
          </a>
        </div>

        <p style="margin-top: 32px; font-size: 13px; color: #999; text-align: center;">
          L'équipe SIPAMO — <a href="https://www.sipamo.site" style="color: #999;">sipamo.site</a>
        </p>

      </div>
    </body>
    </html>
  `;

  // ── 6. Envoi des deux emails ──────────────────────────────────────
  try {
    // Email → Administrateur
    await resend.emails.send({
      from: `SIPAMO <noreply@${process.env.DOMAIN}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `[SIPAMO] Nouvelle commande — ${ref}`,
      html: adminHtml,
    });

    // Email → Client
    await resend.emails.send({
      from: `SIPAMO <noreply@${process.env.DOMAIN}>`,
      to: client.email,
      subject: `Confirmation de votre commande SIPAMO — ${ref}`,
      html: clientHtml,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Erreur Resend :', error);
    return res.status(500).json({ error: "Échec de l'envoi des emails", details: error.message });
  }
    }
