/* =========================================================
   Radiance Studio — Services page
   - builds the price list dynamically from services-data.js
   - category tabs (ARIA tablist) + live search + sorting
   - "Details" modal for each service
   DOM is built with createElement/.text(), never HTML strings
   containing user input.
   ========================================================= */

(function ($) {
  'use strict';

  var data = window.RADIANCE_SERVICES;
  var $root = $('#services-app');
  if (!data || !$root.length) { return; }

  var state = { category: 'all', query: '', sort: 'default' };

  var $tabs = $('#svc-tabs');
  var $search = $('#svc-search');
  var $sort = $('#svc-sort');
  var $out = $('#svc-results');
  var $count = $('#svc-count');

  function priceLabel(item) {
    if (item.price === null) { return 'Price on consultation'; }
    var amount = 'R' + String(item.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (item.from ? 'from ' : '') + amount;
  }

  function categoryName(id) {
    for (var i = 0; i < data.categories.length; i++) {
      if (data.categories[i].id === id) { return data.categories[i].name; }
    }
    return '';
  }

  /* ---------- tabs ---------- */
  function buildTabs() {
    var tabs = [{ id: 'all', name: 'All services' }].concat(data.categories);
    tabs.forEach(function (t, i) {
      $('<button type="button" role="tab" class="tab"></button>')
        .text(t.name)
        .attr({ id: 'tab-' + t.id, 'data-cat': t.id, 'aria-selected': i === 0, tabindex: i === 0 ? 0 : -1, 'aria-controls': 'svc-results' })
        .toggleClass('is-active', i === 0)
        .appendTo($tabs);
    });
  }

  function selectTab($tab) {
    $tabs.find('.tab').removeClass('is-active').attr({ 'aria-selected': 'false', tabindex: -1 });
    $tab.addClass('is-active').attr({ 'aria-selected': 'true', tabindex: 0 });
    state.category = $tab.data('cat');
    $out.attr('aria-labelledby', $tab.attr('id'));
    render();
  }

  $tabs.on('click', '.tab', function () { selectTab($(this)); });
  $tabs.on('keydown', '.tab', function (e) {
    var $all = $tabs.find('.tab');
    var i = $all.index(this);
    var next = null;
    if (e.key === 'ArrowRight') { next = $all.eq((i + 1) % $all.length); }
    else if (e.key === 'ArrowLeft') { next = $all.eq((i - 1 + $all.length) % $all.length); }
    else if (e.key === 'Home') { next = $all.eq(0); }
    else if (e.key === 'End') { next = $all.eq($all.length - 1); }
    if (next) { e.preventDefault(); next.trigger('focus'); selectTab(next); }
  });

  /* ---------- filter + sort ---------- */
  function visibleItems(categoryId) {
    var q = state.query.trim().toLowerCase();
    var list = data.items.filter(function (it) {
      if (it.category !== categoryId) { return false; }
      if (!q) { return true; }
      return (it.name + ' ' + it.description + ' ' + categoryName(it.category)).toLowerCase().indexOf(q) !== -1;
    });

    var by = {
      'name-asc':   function (a, b) { return a.name.localeCompare(b.name); },
      'name-desc':  function (a, b) { return b.name.localeCompare(a.name); },
      // items with no fixed price ("on consultation") always go last
      'price-asc':  function (a, b) { return (a.price === null) - (b.price === null) || (a.price - b.price); },
      'price-desc': function (a, b) { return (a.price === null) - (b.price === null) || (b.price - a.price); }
    }[state.sort];
    if (by) { list = list.slice().sort(by); }
    return list;
  }

  /* ---------- render ---------- */
  function render() {
    $out.empty();
    var total = 0;

    data.categories.forEach(function (cat) {
      if (state.category !== 'all' && state.category !== cat.id) { return; }
      var items = visibleItems(cat.id);
      if (!items.length) { return; }
      total += items.length;

      var $sec = $('<section class="svc-group"></section>').attr('id', 'group-' + cat.id);
      $('<h3></h3>').text(cat.name).appendTo($sec);

      var $table = $('<table></table>');
      var $head = $('<thead><tr><th scope="col">Service</th><th scope="col">Price</th><th scope="col"><span class="sr-only">Details</span></th></tr></thead>').appendTo($table);
      var $body = $('<tbody></tbody>').appendTo($table);

      items.forEach(function (it) {
        var $tr = $('<tr></tr>');
        $('<td></td>').text(it.name).appendTo($tr);
        $('<td class="price"></td>').text(priceLabel(it)).appendTo($tr);
        var $btn = $('<button type="button" class="link-btn">Details</button>')
          .attr('aria-label', 'Details for ' + it.name)
          .on('click', function () { openDetails(it, this); });
        $('<td class="action"></td>').append($btn).appendTo($tr);
        $body.append($tr);
      });

      $sec.append($table).hide().appendTo($out).fadeIn(reducedMotion() ? 0 : 220);
    });

    if (!total) {
      $('<p class="empty"></p>').text('No services match “' + state.query + '”. Try a different word, such as “locs”, “colour” or “bridal”.').appendTo($out);
    }
    $count.text(total + (total === 1 ? ' service' : ' services') + ' shown');
  }

  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------- details modal ---------- */
  function openDetails(item, trigger) {
    var $desc = $('<p></p>').text(item.description);
    var $meta = $('<dl class="modal-meta"></dl>');
    $('<dt>Category</dt>').appendTo($meta);
    $('<dd></dd>').text(categoryName(item.category)).appendTo($meta);
    $('<dt>Price</dt>').appendTo($meta);
    $('<dd></dd>').text(priceLabel(item)).appendTo($meta);

    var $note = $('<p class="small"></p>').text(
      item.price === null
        ? 'This service is quoted after a free consultation so we can see your hair first.'
        : 'Prices may vary slightly depending on hair length and condition.'
    );

    var $enquire = $('<a class="btn"></a>')
      .attr('href', 'enquiry.html?service=' + encodeURIComponent(item.id))
      .text('Enquire about this service');
    var $close = $('<button type="button" class="btn btn-outline">Close</button>').on('click', RS.modal.close);

    RS.modal.open({ title: item.name, body: [$desc, $meta, $note], actions: [$enquire, $close] });
  }

  /* ---------- wire up ---------- */
  buildTabs();

  var searchTimer;
  $search.on('input', function () {
    var v = this.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { state.query = v; render(); }, 120);
  });
  $sort.on('change', function () { state.sort = this.value; render(); });
  $('#svc-reset').on('click', function () {
    $search.val(''); $sort.val('default');
    state.query = ''; state.sort = 'default';
    selectTab($tabs.find('.tab').first());
  });

  // deep link: services.html#colouring opens that tab
  var hash = window.location.hash.replace('#', '');
  var $initial = $tabs.find('.tab[data-cat="' + hash + '"]');
  if ($initial.length) { selectTab($initial); } else { render(); }

  $root.addClass('is-ready');
  $('#svc-fallback').remove();

})(jQuery);
