// Script per forzare il reset del tema
console.log('[RESET-THEME] Resetting theme state');
try {
  // Rimuovi la classe dark dall'HTML
  document.documentElement.classList.remove('dark');
  
  // Rimuovi il tema da localStorage
  localStorage.removeItem('darkMode');
  
  // Forza aggiornamento stile
  document.body.style.backgroundColor = 'white';
  document.body.style.color = 'black';
  
  console.log('[RESET-THEME] Theme reset completed');
} catch (e) {
  console.error('[RESET-THEME] Error:', e);
} 