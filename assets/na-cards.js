/* ═══════════════════════════════════════════════════════════════
   NORDIC ATHLETE — Quick-add til produktkort (globalt)
   Loades med defer fra layout/theme.liquid. Flyttet fra
   sections/na-gamepatch-skin.liquid i fase 4, så quick-add også
   virker på forsiden, i søgning og i "måske du mangler"-lister.
   Bruger temaets cart:update-protokol (se docs/HANDOFF-PHASE4 §6).
   ═══════════════════════════════════════════════════════════════ */
(function () {
  if (window.__naQaBound) return;
  window.__naQaBound = true;

  /* Brug temaets egne cart-ruter når de findes */
  function cartAddUrl() {
    try {
      if (window.Theme && Theme.routes && Theme.routes.cart_add_url) return Theme.routes.cart_add_url;
    } catch (e) {}
    return '/cart/add.js';
  }

  /* Saml sektions-id'er for alle cart-items-component (samme mønster som product-form.js),
     så vi kan bede serveren rendere den opdaterede kurv-skuffe med i svaret. */
  function cartSectionIds() {
    var ids = [];
    document.querySelectorAll('cart-items-component[data-section-id]').forEach(function (el) {
      var id = el.getAttribute('data-section-id');
      if (id && ids.indexOf(id) === -1) ids.push(id);
    });
    return ids;
  }

  document.addEventListener(
    'click',
    function (e) {
      var btn = e.target.closest('.na-qa-btn[data-variant-id]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      if (btn.disabled || btn.classList.contains('is-loading')) return;

      var qa = btn.closest('[data-na-qa]');
      btn.classList.add('is-loading');

      var ids = cartSectionIds();
      var form = new FormData();
      form.append('id', btn.getAttribute('data-variant-id'));
      form.append('quantity', '1');
      if (ids.length) {
        form.append('sections', ids.join(','));
        form.append('sections_url', window.location.pathname);
      }

      fetch(cartAddUrl(), {
        method: 'POST',
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: form
      })
        .then(function (r) {
          if (!r.ok) return r.json().then(function (err) { throw err; });
          return r.json();
        })
        .then(function (added) {
          return fetch('/cart.js', { headers: { Accept: 'application/json' } })
            .then(function (r) { return r.json(); })
            .then(function (cart) {
              /* Dispatch temaets egen cart:update-event, så cart-icon (antal),
                 cart-items-component (skuffe-indhold) og cart-drawer reagerer.
                 source !== 'product-form-component' => cart-icon SÆTTER antallet
                 til cart.item_count (fuld total), ikke additivt. */
              document.dispatchEvent(new CustomEvent('cart:update', {
                bubbles: true,
                detail: {
                  resource: cart,
                  sourceId: 'na-quick-add',
                  data: {
                    source: 'na-quick-add',
                    itemCount: cart.item_count,
                    variantId: btn.getAttribute('data-variant-id'),
                    sections: added.sections
                  }
                }
              }));

              if (qa) {
                qa.classList.add('is-added');
                qa.querySelectorAll('.na-qa-btn').forEach(function (b) { b.classList.remove('is-active'); });
                btn.classList.add('is-active');
                var hint = qa.querySelector('[data-na-qa-hint]');
                if (hint) {
                  hint.textContent = '\u2713 Tilf\u00f8jet til kurv' + (btn.dataset.naSize ? ' \u2014 str. ' + btn.dataset.naSize : '');
                  hint.style.display = 'block';
                }
              }
            });
        })
        .catch(function (err) {
          if (qa) {
            var hint = qa.querySelector('[data-na-qa-hint]');
            if (hint) {
              hint.textContent = (err && (err.description || err.message)) ? (err.description || err.message) : 'Kunne ikke tilf\u00f8je \u2014 pr\u00f8v igen';
              hint.style.display = 'block';
            }
          }
        })
        .finally(function () {
          btn.classList.remove('is-loading');
        });
    },
    true
  );
})();
