'use strict';
async function run(command) {
  const status=document.querySelector('#status');
  try {
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    if (!tab?.id || !/^https:\/\/(chatgpt\.com|chat\.openai\.com)\//.test(tab.url || '')) {
      status.textContent='Bitte zuerst den ChatGPT-Tab öffnen.';return;
    }
    const reply=await chrome.tabs.sendMessage(tab.id,{type:'JH24',command});
    status.textContent=reply?.status || 'Befehl ausgeführt.';
  } catch (_) { status.textContent='ChatGPT-Seite neu laden und erneut versuchen.'; }
}
for (const btn of document.querySelectorAll('button[data-command]')) btn.addEventListener('click',()=>run(btn.dataset.command));
