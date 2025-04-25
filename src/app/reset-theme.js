// Script per forzare il reset del tema
console.log('[RESET-THEME] Resetting theme state');
try {
  // Forza la classe dark sull'HTML per corrispondere al tema predefinito
  document.documentElement.classList.add('dark');
  
  // Rimuovi il tema da localStorage perché verrà usato quello predefinito
  localStorage.removeItem('theme');
  
  // Forza aggiornamento stile
  document.body.style.backgroundColor = '#000';
  document.body.style.color = 'white';
  
  console.log('[RESET-THEME] Theme reset to default dark theme completed');
} catch (e) {
  console.error('[RESET-THEME] Error:', e);
} 