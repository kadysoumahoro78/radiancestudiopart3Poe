/* =========================================================
   Radiance Studio — shared interactivity (jQuery)
   Loaded on every page. Page-specific scripts:
     services.js  -> dynamic price list, tabs, search, sort
     forms.js     -> enquiry + contact forms
     map.js       -> Leaflet map on the contact page
   Everything here is progressive enhancement: with JavaScript
   switched off the site still reads and navigates normally.
   ========================================================= */

(function ($) {
  'use strict';

  var RS = (window.RS = window.RS || {});
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('html').addClass('js');

  /* ---------------------------------------------------------
     Focus helpers shared by the modal and the lightbox
     --------------------------------------------------------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function trapFocus($container, e) {
    if (e.key !== 'Tab') { return; }
    var $items = $container.find(FOCUSABLE).filter(':visible');
    if (!$items.length) { return; }
    var first = $items[0], last = $items[$items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------------------------------------------------------
     1. Mobile navigation toggle
     --------------------------------------------------------- */
  $(function () {
    var $toggle = $('.nav-toggle');
    var $nav = $('#site-nav');
    $toggle.on('click', function () {
      var open = $nav.toggleClass('is-open').hasClass('is-open');
      $toggle.attr('aria-expanded', open);
    });
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $nav.hasClass('is-open')) {
        $nav.removeClass('is-open');
        $toggle.attr('aria-expanded', false).trigger('focus');
      }
    });
  });

  /* ---------------------------------------------------------
     2. Header shrink + back-to-top button (DOM created in JS)
     --------------------------------------------------------- */
  $(function () {
    var $header = $('header').first();
    var $top = $('<button type="button" class="to-top" aria-label="Back to top">&uarr;</button>').appendTo('body');

    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      $header.toggleClass('is-scrolled', y > 40);
      $top.toggleClass('is-visible', y > 600);
    }
    $(window).on('scroll', onScroll);
    onScroll();

    $top.on('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------------------------------------------------------
     3. Scroll-reveal animations (IntersectionObserver)
        Elements are tagged by JS, so no markup is needed.
     --------------------------------------------------------- */
  $(function () {
    var $targets = $(
      'main section > h2, main section > h3, main section > p, main section > ul, main section > .cta-row,' +
      '.stat, #services-preview > div, #team > div, #why-us li, .gallery figure, .locations > div,' +
      '.acc-item, form, .result-panel, .svc-toolbar'
    );
    if (!('IntersectionObserver' in window) || reduceMotion) { return; }

    $targets.addClass('reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var $el = $(entry.target).addClass('is-in');
          io.unobserve(entry.target);
          // once revealed, drop the helper classes so hover effects work normally
          setTimeout(function () {
            $el.removeClass('reveal is-in').css('transition-delay', '');
          }, 1200);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    $targets.each(function (i, el) {
      // small stagger for siblings in the same grid
      var idx = $(el).index();
      el.style.transitionDelay = Math.min(idx * 70, 350) + 'ms';
      io.observe(el);
    });
  });

  /* ---------------------------------------------------------
     4. Animated counters (stats band on the home page)
     --------------------------------------------------------- */
  $(function () {
    var $nums = $('.stat-num[data-count]');
    if (!$nums.length) { return; }

    function run($el) {
      var end = parseInt($el.data('count'), 10);
      var suffix = $el.data('suffix') || '';
      if (reduceMotion) { $el.text(end + suffix); return; }
      $({ n: 0 }).animate({ n: end }, {
        duration: 1400,
        easing: 'swing',
        step: function (now) { $el.text(Math.round(now) + suffix); },
        complete: function () { $el.text(end + suffix); }
      });
    }

    if (!('IntersectionObserver' in window)) { $nums.each(function () { run($(this)); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run($(entry.target)); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    $nums.each(function () { io.observe(this); });
  });

  /* ---------------------------------------------------------
     5. Accordion (FAQ on the home page)
        Markup: .accordion > .acc-item > h3 > button.acc-trigger
                                       + .acc-panel
     --------------------------------------------------------- */
  $(function () {
    $('.accordion').each(function () {
      var $acc = $(this);
      $acc.find('.acc-item').each(function (i) {
        var $item = $(this);
        var $btn = $item.find('.acc-trigger');
        var $panel = $item.find('.acc-panel');
        var id = 'acc-panel-' + i;
        $panel.attr({ id: id, role: 'region' }).hide();
        $btn.attr({ 'aria-expanded': 'false', 'aria-controls': id });
      });

      $acc.on('click', '.acc-trigger', function () {
        var $btn = $(this);
        var $item = $btn.closest('.acc-item');
        var opening = $btn.attr('aria-expanded') !== 'true';

        // only one panel open at a time
        $acc.find('.acc-item.is-open').not($item).each(function () {
          $(this).removeClass('is-open').find('.acc-trigger').attr('aria-expanded', 'false');
          $(this).find('.acc-panel').stop(true, true).slideUp(220);
        });

        $item.toggleClass('is-open', opening);
        $btn.attr('aria-expanded', opening);
        $item.find('.acc-panel').stop(true, true)[opening ? 'slideDown' : 'slideUp'](reduceMotion ? 0 : 240);
      });
    });
  });

  /* ---------------------------------------------------------
     6. Modal dialog (reusable): RS.modal.open({title, body, actions})
        Used by the Services page for "details".
        All content is inserted with .text() / DOM nodes — never
        raw HTML strings — so nothing can inject markup.
     --------------------------------------------------------- */
  RS.modal = (function () {
    var $overlay, $dialog, lastFocus;

    function build() {
      $overlay = $('<div class="modal-overlay" hidden></div>');
      $dialog = $(
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">' +
          '<button type="button" class="modal-close" aria-label="Close dialog">&times;</button>' +
          '<h2 id="modal-title"></h2>' +
          '<div class="modal-body"></div>' +
          '<div class="modal-actions"></div>' +
        '</div>'
      ).appendTo($overlay);
      $overlay.appendTo('body');

      $overlay.on('click', function (e) { if (e.target === $overlay[0]) { close(); } });
      $dialog.on('click', '.modal-close', close);
      $overlay.on('keydown', function (e) {
        if (e.key === 'Escape') { close(); }
        trapFocus($dialog, e);
      });
    }

    function open(opts) {
      if (!$overlay) { build(); }
      lastFocus = document.activeElement;
      $dialog.find('#modal-title').text(opts.title || '');
      var $body = $dialog.find('.modal-body').empty();
      (opts.body || []).forEach(function (node) { $body.append(node); });
      var $actions = $dialog.find('.modal-actions').empty();
      (opts.actions || []).forEach(function (node) { $actions.append(node); });

      $overlay.prop('hidden', false);
      $('body').addClass('no-scroll');
      requestAnimationFrame(function () { $overlay.addClass('is-open'); $dialog.trigger('focus'); });
    }

    function close() {
      if (!$overlay) { return; }
      $overlay.removeClass('is-open');
      $('body').removeClass('no-scroll');
      setTimeout(function () { $overlay.prop('hidden', true); }, reduceMotion ? 0 : 220);
      if (lastFocus) { $(lastFocus).trigger('focus'); }
    }

    return { open: open, close: close };
  })();

  /* ---------------------------------------------------------
     7. Gallery: category filter + lightbox
     --------------------------------------------------------- */
  $(function () {
    var $gallery = $('.gallery');
    if (!$gallery.length) { return; }

    /* ---- category filter chips ---- */
    var $figures = $gallery.find('figure');
    var $chips = $('.chip[data-filter]');
    $chips.on('click', function () {
      var f = $(this).data('filter');
      $chips.removeClass('is-active').attr('aria-pressed', 'false');
      $(this).addClass('is-active').attr('aria-pressed', 'true');
      $figures.each(function () {
        var show = f === 'all' || $(this).data('category') === f;
        $(this).toggleClass('is-hidden', !show);
      });
      $('#gallery-count').text($figures.not('.is-hidden').length + ' of ' + $figures.length + ' photos shown');
    });

    /* ---- lightbox ---- */
    var $lb = $(
      '<div class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" hidden>' +
        '<button type="button" class="lb-close" aria-label="Close image viewer">&times;</button>' +
        '<button type="button" class="lb-nav lb-prev" aria-label="Previous image">&#10094;</button>' +
        '<figure class="lb-figure"><img alt=""><figcaption></figcaption></figure>' +
        '<button type="button" class="lb-nav lb-next" aria-label="Next image">&#10095;</button>' +
        '<p class="lb-count" aria-live="polite"></p>' +
      '</div>'
    ).appendTo('body');
    var $img = $lb.find('img'), $cap = $lb.find('figcaption'), $count = $lb.find('.lb-count');
    var current = 0, lastFocus, $visible;

    function show(i) {
      $visible = $figures.not('.is-hidden').find('a.lightbox-link');
      if (!$visible.length) { return; }
      current = (i + $visible.length) % $visible.length;
      var $a = $visible.eq(current);
      $lb.addClass('is-loading');
      $img.off('load.lb').one('load.lb', function () { $lb.removeClass('is-loading'); });
      $img.attr({ src: $a.attr('href'), alt: $a.find('img').attr('alt') || '' });
      $cap.text($a.closest('figure').find('figcaption').text());
      $count.text((current + 1) + ' / ' + $visible.length);
    }

    function open(i) {
      lastFocus = document.activeElement;
      $lb.prop('hidden', false);
      $('body').addClass('no-scroll');
      show(i);
      requestAnimationFrame(function () { $lb.addClass('is-open'); $lb.find('.lb-close').trigger('focus'); });
    }

    function close() {
      $lb.removeClass('is-open');
      $('body').removeClass('no-scroll');
      setTimeout(function () { $lb.prop('hidden', true); $img.attr('src', ''); }, reduceMotion ? 0 : 220);
      if (lastFocus) { $(lastFocus).trigger('focus'); }
    }

    $gallery.on('click', 'a.lightbox-link', function (e) {
      e.preventDefault();
      var $vis = $figures.not('.is-hidden').find('a.lightbox-link');
      open($vis.index(this));
    });
    $lb.on('click', '.lb-close', close);
    $lb.on('click', '.lb-prev', function () { show(current - 1); });
    $lb.on('click', '.lb-next', function () { show(current + 1); });
    $lb.on('click', function (e) { if (e.target === $lb[0]) { close(); } });
    $(document).on('keydown', function (e) {
      if ($lb.prop('hidden')) { return; }
      if (e.key === 'Escape') { close(); }
      else if (e.key === 'ArrowLeft') { show(current - 1); }
      else if (e.key === 'ArrowRight') { show(current + 1); }
      else { trapFocus($lb, e); }
    });

    // touch swipe
    var startX = null;
    $lb.on('touchstart', function (e) { startX = e.originalEvent.touches[0].clientX; });
    $lb.on('touchend', function (e) {
      if (startX === null) { return; }
      var dx = e.originalEvent.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) { show(current + (dx < 0 ? 1 : -1)); }
      startX = null;
    });
  });

  /* ---------------------------------------------------------
     8. Share links: point them at the page being viewed
     --------------------------------------------------------- */
  $(function () {
    var url = encodeURIComponent(window.location.href.split('#')[0]);
    var text = encodeURIComponent(document.title);
    var map = {
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
      x: 'https://twitter.com/intent/tweet?url=' + url + '&text=' + text,
      whatsapp: 'https://wa.me/?text=' + text + '%20' + url,
      pinterest: 'https://pinterest.com/pin/create/button/?url=' + url + '&description=' + text
    };
    $('[data-share]').each(function () {
      var net = $(this).data('share');
      if (map[net]) { $(this).attr('href', map[net]); }
    });
  });

})(jQuery);
// Live date and time in the footer
function updateDateTime() {
    const el = document.getElementById('datetime');
    if (!el) return;                       // page has no footer clock, do nothing
    const options = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    el.textContent = new Date().toLocaleString('en-ZA', options);
}
updateDateTime();                          // show it immediately
setInterval(updateDateTime, 1000);         // then refresh every second
