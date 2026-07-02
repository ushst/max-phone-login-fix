(function () {
  'use strict';

  // The site uses &nbsp; (U+00A0) instead of regular spaces inside this
  // label, so normalize whitespace before comparing.
  const LABEL = 'sign in with phone number';

  function normalize(text) {
    return text.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function findPhoneLink() {
    const leaf = [...document.querySelectorAll('*')].find(
      (e) => e.children.length === 0 && e.textContent && normalize(e.textContent).includes(LABEL)
    );
    if (!leaf) return null;
    return leaf.closest('button,a,[role="button"],[tabindex]') || leaf;
  }

  function unblock(el) {
    el.style.setProperty('position', 'relative', 'important');
    el.style.setProperty('z-index', '2147483647', 'important');
    el.style.setProperty('pointer-events', 'auto', 'important');
    el.style.setProperty('opacity', '1', 'important');
    el.style.setProperty('visibility', 'visible', 'important');
  }

  let floatingBtn = null;

  function createFloatingButton() {
    const btn = document.createElement('button');
    btn.textContent = '📱 Войти по номеру телефона';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '2147483647',
      padding: '12px 20px',
      background: '#4a90e2',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontFamily: 'sans-serif',
      cursor: 'pointer',
      boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
    });
    btn.addEventListener('click', () => {
      const el = findPhoneLink();
      if (el) {
        unblock(el);
        el.click();
      }
    });
    return btn;
  }

  // Re-attach on every tick rather than appending once, in case the SPA
  // re-renders its root and drops our node.
  function ensureFloatingButton() {
    if (!floatingBtn) floatingBtn = createFloatingButton();
    if (!document.body.contains(floatingBtn)) {
      document.body.appendChild(floatingBtn);
    }
  }

  function hideFloatingButton() {
    if (floatingBtn) floatingBtn.remove();
  }

  function tick() {
    const el = findPhoneLink();
    if (el) {
      unblock(el);
      ensureFloatingButton();
    } else {
      hideFloatingButton();
    }
  }

  const observer = new MutationObserver(tick);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  tick();
  setInterval(tick, 1000);
})();
