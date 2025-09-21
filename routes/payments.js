import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Paiement PayPal
router.post("/paypal", async (req, res) => {
  const { amount } = req.body;

  try {
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET
    ).toString("base64");

    // Récupérer access_token
    const tokenRes = await fetch(`${process.env.PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();

    // Créer un paiement
    const paymentRes = await fetch(`${process.env.PAYPAL_API}/v1/payments/payment`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "sale",
        redirect_urls: {
          return_url: `${process.env.BASE_URL}/dashboard`,
          cancel_url: `${process.env.BASE_URL}/payments.html`,
        },
        payer: { payment_method: "paypal" },
        transactions: [
          {
            amount: { total: amount, currency: "EUR" },
            description: "Achat Panel BlackHatVPS",
          },
        ],
      }),
    });

    const paymentData = await paymentRes.json();

    const approvalUrl = paymentData.links.find(l => l.rel === "approval_url")?.href;
    res.json({ approvalUrl });
  } catch (err) {
    console.error("Erreur PayPal :", err);
    res.json({ error: true });
  }
});

// Paiement Paysky
router.post("/paysky", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentUrl = `https://paysky.com/pay?key=${process.env.PAYSKY_API_KEY}&amount=${amount}`;
    res.json({ paymentUrl });
  } catch (err) {
    console.error("Erreur Paysky :", err);
    res.json({ error: true });
  }
});

export default router;
