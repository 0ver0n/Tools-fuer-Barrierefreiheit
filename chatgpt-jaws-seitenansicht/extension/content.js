(() => {
  'use strict';
  // 2.4: Accessible transcript with streaming placeholder. Never moves focus.
  if (globalThis.__chatgptJaws23) return;
  globalThis.__chatgptJaws23 = true;

  const MODERN_TIMELINE = '[data-app-action-timeline-scroll][role="region"]';
  const MODERN_UNIT = '[data-content-search-unit-key$=":user"], [data-content-search-unit-key$=":assistant"], [data-chatgpt-search-unit-key$=":user"], [data-chatgpt-search-unit-key$=":assistant"]';
  const MODERN_FALLBACK_USER = '[data-user-message-bubble="true"]';
  const LEGACY_TURN = '[data-turn="user"], [data-turn="assistant"]';
  const LEGACY_ROLE = '[data-message-author-role="user"], [data-message-author-role="assistant"], [data-role="user"], [data-role="assistant"]';
  const COMPOSER = 'form[data-chatgpt-composer] [contenteditable="true"][role="textbox"], #prompt-textarea, [data-testid="prompt-textarea"], [contenteditable="true"][role="textbox"], textarea[name="prompt-textarea"]';
  const SIDEBAR = '#stage-slideover-sidebar, #stage-popover-sidebar, [data-testid="chat-history-sidebar"], [data-testid="nav-sidebar"], [data-testid="sidebar"], nav[aria-label="Chat history"], nav[aria-label="Chatverlauf"], [data-chatgpt-sidebar="true"]';
  const HEADING = 'h1,h2,h3,h4,h5,h6,[role="heading"]';
  const TURN_SELECTOR = `${MODERN_UNIT}, ${LEGACY_TURN}, ${LEGACY_ROLE}`;

  let active = true;
  let sidebarHidden = true;
  let controls = null;
  let status = null;
  let sidebarButton = null;
  let activeButton = null;
  let scheduled = null;
  let scannedOnce = false;
  let lastCount = {user: 0, assistant: 0, mode: 'keine'};
  let scans = 0;
  let repairs = 0;
  let muted = 0;
  let provisional = null; // Temporary H1 while the newest answer is being generated.
  let provisionalAdds = 0;
  // The heading sits next to the message unit, not inside its React-managed text.
  const owned = new Map();        // message node -> {heading, role, parent, place}
  const overwritten = new Map();  // native heading -> original ARIA state (for clean disable)

  function make(tag, content, className) {
    const node = document.createElement(tag);
    if (content !== undefined) node.textContent = content;
    if (className) node.className = className;
    return node;
  }
  const inControls = node => Boolean(node?.closest?.('#jh24-controls'));
  function isStatusHeading(node) {
    if (!node || !node.matches?.('h1,h2,h3,h4,h5,h6,[role="heading"]')) return false;
    const value = (node.textContent || '').trim().replace(/\s+/g, ' ').toLowerCase();
    return value.length <= 75 && /^(neueste antwort|chatgpt hat gesagt:?|latest response|chatgpt said:?|assistant response|aktuelle antwort)$/.test(value);
  }
  function isDecorativeHeading(node) {
    return isStatusHeading(node) && !node.querySelector('p,ul,ol,pre,code,button,input,textarea');
  }
  const invisible = node => Boolean(node?.closest?.('[inert], [aria-hidden="true"]'));
  const ignore = node => !node?.isConnected || inControls(node) || invisible(node) || Boolean(node?.closest?.('nav, aside, form, [role="dialog"], [aria-modal="true"], [role="menu"]'));

  function visibleTimelineRoot() {
    return [...document.querySelectorAll(MODERN_TIMELINE)]
      .find(region => !invisible(region) && !region.closest('[role="presentation"]')) || null;
  }
  function canonicalUnit(node) {
    while (node.parentElement?.matches(MODERN_UNIT)) node = node.parentElement;
    return node;
  }
  function roleFromUnit(node) {
    const key = node.getAttribute('data-content-search-unit-key') || node.getAttribute('data-chatgpt-search-unit-key') || '';
    return key.endsWith(':assistant') ? 'assistant' : key.endsWith(':user') ? 'user' : null;
  }
  function modernCandidates() {
    const root = visibleTimelineRoot();
    const scope = root || document.querySelector('main,[role="main"]');
    if (!scope) return [];
    const items = [], seen = new Set();
    for (const match of scope.querySelectorAll(MODERN_UNIT)) {
      const node = canonicalUnit(match);
      const role = roleFromUnit(node) || roleFromUnit(match);
      if (!role || seen.has(node) || ignore(node)) continue;
      seen.add(node);
      items.push({node, role, modern: true});
    }
    if (!items.some(item => item.role === 'user')) {
      for (const bubble of scope.querySelectorAll(MODERN_FALLBACK_USER)) {
        if (ignore(bubble)) continue;
        const node = bubble.closest('[data-content-search-unit-key], [data-chatgpt-search-unit-key]') || bubble;
        if (seen.has(node)) continue;
        seen.add(node);
        items.push({node, role: 'user', modern: true});
      }
    }
    return items;
  }
  function legacyCandidates() {
    const items = [], seen = new Set();
    for (const turn of document.querySelectorAll(LEGACY_TURN)) {
      if (ignore(turn) || turn.parentElement?.closest(LEGACY_TURN)) continue;
      seen.add(turn); items.push({node: turn, role: turn.getAttribute('data-turn'), modern: false});
    }
    if (items.length) return items;
    for (const marker of document.querySelectorAll(LEGACY_ROLE)) {
      if (ignore(marker) || marker.parentElement?.closest(LEGACY_ROLE)) continue;
      const role = marker.getAttribute('data-message-author-role') || marker.getAttribute('data-role');
      const node = marker.closest('[data-testid^="conversation-turn-"]') || marker;
      if (!seen.has(node) && (role === 'user' || role === 'assistant')) {
        seen.add(node); items.push({node, role, modern: false});
      }
    }
    return items;
  }
  function getTurns() {
    const modern = modernCandidates();
    const legacy = modern.length ? [] : legacyCandidates();
    const items = modern.length ? modern : legacy;
    items.sort((a,b) => {
      const x = a.node.compareDocumentPosition(b.node);
      return x & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : x & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
    });
    return {items, mode: modern.length ? 'Chat/Work' : legacy.length ? 'klassisch' : 'keine'};
  }

  function saveAttribute(node, name) {
    return node.hasAttribute(name) ? node.getAttribute(name) : null;
  }
  function restoreAttribute(node, name, prior) {
    if (prior === null) node.removeAttribute(name);
    else node.setAttribute(name, prior);
  }
  function suppressNative(node) {
    if (!active || !node.isConnected || inControls(node) || node.classList.contains('jh24-heading')) return;
    if (overwritten.has(node)) return;
    // ChatGPT may render its status h4 outside main while a response streams.
    if (!node.closest('main,[role="main"],[data-app-action-timeline-scroll]')) return;
    const old = {
      role: saveAttribute(node, 'role'),
      level: saveAttribute(node, 'aria-level'),
      hidden: saveAttribute(node, 'aria-hidden'),
      decor: node.classList.contains('jh24-decorative-heading')
    };
    overwritten.set(node, old);
    // role=presentation may be ignored for focusable headings or global ARIA states.
    // An explicit non-heading role preserves heading text for the screen reader.
    node.setAttribute('role', 'paragraph');
    node.removeAttribute('aria-level');
    if (isDecorativeHeading(node)) {
      node.classList.add('jh24-decorative-heading');
      node.setAttribute('aria-hidden', 'true');
    }
    muted++;
  }
  function clearProvisional() {
    if (provisional?.heading?.isConnected) provisional.heading.remove();
    provisional = null;
  }
  function ensureStreamingHeading(items) {
    const last = items.at(-1);
    // An assistant unit has appeared. Its regular H1 replaces the provisional one.
    if (!last || last.role !== 'user') { clearProvisional(); return; }
    const main = document.querySelector('main,[role="main"]');
    if (!main) { clearProvisional(); return; }
    const candidates = [...main.querySelectorAll('h4,h3,[role="heading"]')];
    const marker = candidates.reverse().find(n => isStatusHeading(n) &&
      !inControls(n) && !!(last.node.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING));
    if (!marker) { clearProvisional(); return; }
    if (provisional?.anchor === marker && provisional.heading.isConnected &&
        provisional.heading.nextSibling === marker) return;
    clearProvisional();
    const heading = make('h1', 'ChatGPT-Antwort (wird erstellt)', 'jh24-heading');
    heading.dataset.jh24Owned = 'streaming';
    marker.parentNode.insertBefore(heading, marker);
    provisional = {heading, anchor:marker};
    provisionalAdds++;
  }
  function suppressExisting() {
    const main = document.querySelector('main,[role="main"]');
    if (!main) return;
    for (const node of main.querySelectorAll(HEADING)) suppressNative(node);
  }
  function restoreNative() {
    for (const [node, old] of overwritten) {
      if (!node.isConnected) continue;
      restoreAttribute(node, 'role', old.role);
      restoreAttribute(node, 'aria-level', old.level);
      restoreAttribute(node, 'aria-hidden', old.hidden);
      if (!old.decor) node.classList.remove('jh24-decorative-heading');
    }
    overwritten.clear();
  }
  function forget(node) {
    const data = owned.get(node);
    if (data?.heading?.isConnected) data.heading.remove();
    owned.delete(node);
  }
  function clearOwned() {
    for (const node of [...owned.keys()]) forget(node);
  }
  function ensureHeading({node, role, modern}) {
    if (!node.isConnected || ignore(node)) return;
    const tag = role === 'assistant' ? 'H1' : 'H2';
    const label = role === 'assistant' ? 'ChatGPT-Antwort' : 'Deine Nachricht';
    const prior = owned.get(node);
    // No write if the heading is already in the correct location.
    if (prior?.heading?.isConnected && prior.heading.tagName === tag &&
        (prior.place === 'sibling' ? prior.heading.nextSibling === node : prior.heading === node.firstChild)) return;
    if (prior) forget(node);
    const heading = make(tag.toLowerCase(), label, 'jh24-heading');
    heading.dataset.jh24Owned = 'true';
    // Outside the unit is less likely to be replaced while ChatGPT streams text.
    if (modern && node.parentElement && node.parentElement.closest('main,[role="main"]')) {
      node.parentElement.insertBefore(heading, node);
      owned.set(node, {heading, role, place: 'sibling'});
    } else {
      node.insertBefore(heading, node.firstChild);
      owned.set(node, {heading, role, place: 'child'});
    }
    repairs++;
  }
  function markSidebar() {
    for (const n of document.querySelectorAll(SIDEBAR)) {
      if (n.closest('#jh24-controls') || n.closest('main,[role="main"]') || n.querySelector('[data-turn-key], [data-turn]')) continue;
      if (n.getAttribute('data-jh24-sidebar') !== 'true') n.setAttribute('data-jh24-sidebar','true');
    }
  }
  function sync() {
    if (!active) return;
    scannedOnce = true; scans++;
    const {items,mode} = getTurns();
    const now = new Set(items.map(item => item.node));
    for (const node of [...owned.keys()]) if (!now.has(node) || !node.isConnected) forget(node);
    let assistant = 0, user = 0;
    for (const item of items) {
      if (item.role === 'assistant') assistant++; else user++;
      ensureHeading(item);
    }
    lastCount = {user,assistant,mode};
    ensureStreamingHeading(items);
    if (items.length) suppressExisting();
    for (const node of [...overwritten.keys()]) if (!node.isConnected) overwritten.delete(node);
    markSidebar();
  }
  function setStatus(message) {
    // Only called after an explicit user action, never on streaming updates.
    if (status) status.textContent = message;
  }
  function applyView() {
    document.documentElement.classList.toggle('jh24-active',active);
    document.documentElement.classList.toggle('jh24-hide-sidebar',active && sidebarHidden);
    if (sidebarButton) sidebarButton.textContent = sidebarHidden ? 'Seitenleiste einblenden' : 'Seitenleiste ausblenden';
    if (activeButton) activeButton.textContent = active ? 'Vereinfachung ausschalten' : 'Vereinfachung einschalten';
    if (active) sync(); else {
      clearOwned(); clearProvisional(); restoreNative();
      setStatus('Vereinfachung ausgeschaltet.');
    }
  }
  function toggleActive() {
    active = !active;
    chrome.storage.local.set({jh24_active:active});
    applyView();
  }
  function toggleSidebar() {
    sidebarHidden = !sidebarHidden;
    chrome.storage.local.set({jh24_sidebarHidden:sidebarHidden});
    applyView();
  }
  function diagnosis() {
    const d = {
      version:'2.4.0',
      view:location.pathname.includes('/c/') ? 'Unterhaltung' : 'andere ChatGPT-Ansicht',
      timelineDetected:Boolean(visibleTimelineRoot()),
      turnKeys:document.querySelectorAll('[data-turn-key]').length,
      userUnits:document.querySelectorAll('[data-content-search-unit-key$=":user"]').length,
      assistantUnits:document.querySelectorAll('[data-content-search-unit-key$=":assistant"]').length,
      mainCount:document.querySelectorAll('main,[role="main"]').length,
      nativeHeadings:document.querySelectorAll('main h1,main h2,main h3,main h4,main h5,main h6').length,
      mutedNativeHeadings:[...overwritten.keys()].filter(n=>n.isConnected).length,
      markedMessageHeadings:[...owned.values()].filter(v=>v.heading.isConnected).length,
      inputFound:Boolean(document.querySelector(COMPOSER)),
      recognisedAssistant:lastCount.assistant,
      recognisedUser:lastCount.user,
      method:lastCount.mode,
      provisionalHeading: Boolean(provisional?.heading?.isConnected),
      provisionalAdds,
      scans, repairs
    };
    return JSON.stringify(d,null,2);
  }
  async function copyDiagnosis() {
    const value = diagnosis();
    try {
      await navigator.clipboard.writeText(value);
      setStatus('Diagnose kopiert. In ChatGPT einfügen.');
    } catch (_) {
      let field = controls.querySelector('.jh24-report');
      if (!field) {field=make('textarea');field.className='jh24-report';field.setAttribute('aria-label','Diagnosebericht');controls.append(field);}
      field.value=value;field.focus();field.select();
      setStatus('Diagnose markiert. Strg + C drücken.');
    }
  }
  function initControls() {
    if (controls?.isConnected) return;
    controls=make('nav');controls.id='jh24-controls';
    controls.setAttribute('aria-label','ChatGPT JAWS-Seitenansicht');
    const title=make('strong','ChatGPT JAWS-Seitenansicht');
    sidebarButton=make('button','Seitenleiste einblenden');
    sidebarButton.type='button';sidebarButton.addEventListener('click',toggleSidebar);
    const inputButton=make('button','Zum Eingabefeld');
    inputButton.type='button';inputButton.addEventListener('click',()=>{
      const input=document.querySelector(COMPOSER);
      if (input instanceof HTMLElement) input.focus(); else setStatus('Eingabefeld nicht gefunden.');
    });
    activeButton=make('button','Vereinfachung ausschalten');
    activeButton.type='button';activeButton.addEventListener('click',toggleActive);
    const diagnoseButton=make('button','Diagnose kopieren');
    diagnoseButton.type='button';diagnoseButton.addEventListener('click',copyDiagnosis);
    status=make('span','', 'jh24-status');
    controls.append(title,sidebarButton,inputButton,activeButton,diagnoseButton,status);
    document.body.prepend(controls);
  }
  function scheduleScan(delay=350) {
    if (!active || scheduled !== null) return;
    scheduled=setTimeout(()=>{scheduled=null;sync();},delay);
  }
  function containsSelector(node,selector) {
    return node.matches?.(selector) || Boolean(node.querySelector?.(selector));
  }
  function addedNode(node) {
    if (node.nodeType!==1 || inControls(node)) return false;
    if (node.classList?.contains('jh24-heading')) return false;
    // Semantic cleanup applies only to newly inserted native headings, not text chunks.
    if (scannedOnce && lastCount.user+lastCount.assistant > 0) {
      if (node.matches?.(HEADING)) suppressNative(node);
      for (const heading of node.querySelectorAll?.(HEADING) || []) suppressNative(heading);
    }
    if (containsSelector(node,TURN_SELECTOR) || containsSelector(node,MODERN_TIMELINE)) return true;
    // New transient h4 marks the start of an answer, before ChatGPT creates the unit.
    if (isStatusHeading(node)) return true;
    if (node.querySelector?.('h4,h3,[role="heading"]')) {
      for (const h of node.querySelectorAll('h4,h3,[role="heading"]')) {
        if (isStatusHeading(h)) return true;
      }
    }
    if (containsSelector(node,SIDEBAR)) markSidebar();
    return false;
  }

  initControls();
  chrome.storage.local.get({jh24_active:true,jh24_sidebarHidden:true}, values=>{
    active=values.jh24_active!==false;
    sidebarHidden=values.jh24_sidebarHidden!==false;
    applyView();
  });
  const observer=new MutationObserver(records=>{
    if (!active) return;
    let needsScan=false;
    for (const record of records) {
      if (inControls(record.target)) continue;
      if (record.type==='attributes') {
        if (record.target.matches?.(TURN_SELECTOR) || record.target.matches?.('[data-turn-key]')) needsScan=true;
        continue;
      }
      for (const node of record.addedNodes) if (addedNode(node)) needsScan=true;
      for (const node of record.removedNodes) {
        if (node.nodeType!==1) continue;
        if (provisional?.anchor && (node === provisional.anchor || node.contains?.(provisional.anchor))) needsScan = true;
        if (node.classList?.contains('jh24-heading')) {
          // A React rerender may remove a heading, but don't reinsert on every text token.
          // A single delayed repair is enough for the next stable state.
          if ([...owned.values()].some(v => v.heading === node)) needsScan=true;
          continue;
        }
        if (containsSelector(node,TURN_SELECTOR)) needsScan=true;
      }
    }
    if (needsScan) scheduleScan();
  });
  observer.observe(document.documentElement,{
    subtree:true, childList:true, attributes:true,
    attributeFilter:['data-turn','data-message-author-role','data-turn-key','data-content-search-unit-key','data-chatgpt-search-unit-key']
  });
  chrome.runtime.onMessage.addListener((msg,_sender,reply)=>{
    if (msg?.type!=='JH24') return;
    if (msg.command==='toggle') toggleActive();
    else if (msg.command==='sidebar') toggleSidebar();
    else if (msg.command==='rescan') sync();
    reply({ok:true,active,sidebarHidden,count:lastCount,status:status?.textContent||''});
  });
})();
