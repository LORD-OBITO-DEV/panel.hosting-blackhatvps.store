async function payWithPayPal(amount) {
  try {
    const res = await fetch("/api/payments/paypal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    if (data.approvalUrl) {
      window.location.href = data.approvalUrl;
    } else {
      alert("❌ Erreur paiement PayPal");
    }
  } catch (err) {
    console.error("Erreur PayPal :", err);
  }
}

async function payWithPaysky(amount) {
  try {
    const res = await fetch("/api/payments/paysky", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    if (data.paymentUrl) {
      window.location.href = data.paymentUrl;
    } else {
      alert("❌ Erreur paiement Paysky");
    }
  } catch (err) {
    console.error("Erreur Paysky :", err);
  }
}
