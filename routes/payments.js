import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { getDB } from './db.js'; // Assure-toi d'avoir un module db.js qui exporte getDB()

dotenv.config();

const router = express.Router();

// Création paiement
router.post('/create', async (req, res) => {
  const { points, type } = req.body;
  const userId = req.session.userId; // ID utilisateur connecté
  const db = getDB();

  if (!userId) return res.status(401).json({ success: false, message: 'Utilisateur non connecté' });

  try {
    // Création paiement selon type
    let paymentUrl = '';
    if (type === 'points' || type === 'weekly' || type === 'panel') {
      // Exemple PayPal
      const paypalResp = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_CLIENT_SECRET).toString('base64')}`
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{ amount: { currency_code: 'EUR', value: calculateAmount(points, type) } }]
        })
      });
      const data = await paypalResp.json();
      paymentUrl = data.links.find(l => l.rel === 'approve')?.href;
    }

    // Stocker la transaction temporaire
    await db.collection('transactions').insertOne({
      userId: ObjectId(userId),
      points,
      type,
      status: 'pending',
      createdAt: new Date(),
      paymentUrl
    });

    res.json({ success: true, paymentUrl });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Erreur création paiement' });
  }
});

// Capture paiement PayPal (après redirection)
router.get('/capture/:id', async (req, res) => {
  const { id } = req.params;
  const db = getDB();

  try {
    const txn = await db.collection('transactions').findOne({ _id: ObjectId(id), status: 'pending' });
    if (!txn) return res.status(404).send('Transaction non trouvée');

    // Exemple capture PayPal (à adapter selon SDK ou API utilisée)
    // const captureResp = await capturePayPal(txn.paymentId);
    // if(captureResp.status === 'COMPLETED'){

    // Ajouter points ou panel
    if(txn.type === 'points'){
      await db.collection('users').updateOne(
        { _id: ObjectId(txn.userId) },
        { $inc: { points: txn.points } }
      );
    } else if(txn.type === 'panel'){
      const panelName = `Panel-${Date.now()}`;
      await db.collection('panels').insertOne({
        userId: ObjectId(txn.userId),
        name: panelName,
        pointsUsed: txn.points,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7*24*3600*1000), // 7j
        status: 'active'
      });
    } else if(txn.type === 'weekly'){
      await db.collection('users').updateOne(
        { _id: ObjectId(txn.userId) },
        { $inc: { points: txn.points }, $set: { subscription: true } }
      );
    }

    // Mettre à jour transaction
    await db.collection('transactions').updateOne({ _id: ObjectId(id) }, { $set: { status: 'completed', completedAt: new Date() } });

    res.send('Paiement réussi ! Vos points / panels ont été ajoutés.');
  } catch(err){
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Fonction utilitaire pour calculer le prix en €
function calculateAmount(points, type){
  if(type === 'points'){
    if(points === 100) return '1';
    if(points === 200) return '2';
    if(points === 300) return '2.5';
    if(points === 400) return '4';
    if(points === 500) return '5';
  } else if(type === 'weekly'){
    return '8.99';
  } else if(type === 'panel'){
    if(points === 15) return '1.5';
    if(points === 30) return '3';
    if(points === 60) return '6';
    if(points === 100) return '10';
    if(points === 150) return '15';
  }
  return '1';
}

export default router;
