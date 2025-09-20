document.addEventListener("DOMContentLoaded", () => {
  const packsDiv = document.getElementById('packs');
  const weeklyBtn = document.getElementById('weeklySub');
  const panelPlansDiv = document.getElementById('panelPlans');
  let userPoints = parseInt(localStorage.getItem('userPoints')) || 0;

  // Affichage des points
  function updatePointsDisplay() {
    document.getElementById('userPoints')?.textContent = userPoints;
  }
  updatePointsDisplay();

  // Fonction pour lancer le paiement
  function pay(points, type) {
    // Ouvre la page de paiement correspondante
    // Pour l'instant, simulé par alert
    const confirmPay = confirm(`Voulez-vous payer pour ${points} points via votre méthode de paiement ?`);
    if(confirmPay){
      fetch('/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points, type })
      })
      .then(res => res.json())
      .then(data => {
        if(data.success){
          alert(`Redirection vers le paiement : ${data.paymentUrl}`);
        } else {
          alert(`Erreur : ${data.message}`);
        }
      })
      .catch(err => {
        console.error(err);
        alert('Erreur réseau, réessayez plus tard.');
      });
    }
  }

  // Événements pour packs
  packsDiv.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const points = parseInt(btn.dataset.points);
      pay(points, 'points');
    });
  });

  // Événement abonnement hebdo
  weeklyBtn?.addEventListener('click', () => {
    pay(200, 'weekly'); // 200p/semaine → 8.99€/mois
  });

  // Panels plans
  panelPlansDiv.querySelectorAll('p').forEach(p => {
    p.addEventListener('click', () => {
      const text = p.textContent;
      const match = text.match(/→ (\d+)p/);
      if(match){
        const points = parseInt(match[1]);
        pay(points, 'panel');
      }
    });
  });
});
