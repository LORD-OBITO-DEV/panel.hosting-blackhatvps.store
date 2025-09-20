import express from 'express';
import User from '../models/User.js';
import { ensureAuth } from '../utils/authMiddleware.js';

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById('startAd');
  const counterEl = document.getElementById('adCounter');
  const resultEl = document.getElementById('adResult');
  let userPoints = parseInt(localStorage.getItem('userPoints')) || 0;

  // Affiche les points actuels au chargement
  function updatePointsDisplay() {
    document.getElementById('userPoints')?.textContent = userPoints;
  }

  updatePointsDisplay();

  startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    resultEl.textContent = '';
    let timeLeft = 10; // secondes à regarder la pub
    counterEl.textContent = `Temps restant : ${timeLeft}s`;

    const interval = setInterval(() => {
      timeLeft--;
      counterEl.textContent = `Temps restant : ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(interval);
        // Créditer les points
        fetch('/ads/watch', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              userPoints += 2; // +2 points par pub
              localStorage.setItem('userPoints', userPoints);
              resultEl.textContent = `+2 points ! Total points : ${userPoints}`;
              updatePointsDisplay();
            } else {
              resultEl.textContent = `Erreur : ${data.message || 'Impossible de créditer les points.'}`;
            }
            startBtn.disabled = false;
          })
          .catch(err => {
            console.error(err);
            resultEl.textContent = 'Erreur réseau, réessayez plus tard.';
            startBtn.disabled = false;
          });
      }
    }, 1000);
  });
});
