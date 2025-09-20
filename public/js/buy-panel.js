document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('buyPanelForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const panelName = document.getElementById('panelName').value.trim();
    const panelLang = document.getElementById('panelLang').value;
    const panelSize = document.getElementById('panelSize').value;

    try {
      const response = await fetch('/panels/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panelName, panelLang, panelSize })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Panel créé avec succès ! Lien : ${data.panelUrl}`);
        window.location.href = '/dashboard.html';
      } else {
        alert(`Erreur : ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue, veuillez réessayer plus tard.');
    }
  });
});
