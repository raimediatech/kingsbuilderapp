/* 
  KingsBuilder – Visual Page Builder
  ===================================================================
  This is a pared‑down, LOCAL version of the builder script that
  boots without relying on remote CDNs. Hook your existing 
  KingsBuilder logic here or replace this file with the compiled
  bundle from your build system.
*/
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ KingsBuilder local scaffolding loaded.');
  const root = document.getElementById('kingsbuilder-app');
  root.innerHTML = '<h2 style="font-family:Arial, sans-serif; text-align:center;">KingsBuilder – Visual Page Builder<br><small>(local sandbox)</small></h2>';
});
