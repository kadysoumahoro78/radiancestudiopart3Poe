/* =========================================================
   Radiance Studio — interactive studio map (Leaflet)
   - one map with a marker + popup for each studio
   - "Show on map" buttons fly to a studio
   - "Find my nearest studio" uses the browser's geolocation
     (the position is used only in the browser, never sent anywhere)
   Map tiles: © OpenStreetMap contributors.
   ========================================================= */

(function ($) {
  'use strict';

  var el = document.getElementById('studio-map');
  if (!el || typeof L === 'undefined') { return; }

  var studios = {
    sandton:  { name: 'Sandton Studio',  address: '14 Rivonia Road, Sandton', tel: '011 555 0182', lat: -26.1076, lng: 28.0567 },
    rosebank: { name: 'Rosebank Studio', address: '22 Baker Street, Rosebank', tel: '011 555 0247', lat: -26.1467, lng: 28.0436 }
  };

  L.Icon.Default.imagePath = 'js/vendor/leaflet/images/';

  var map = L.map(el, { scrollWheelZoom: false }).setView([-26.127, 28.05], 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer">OpenStreetMap</a> contributors'
  }).addTo(map);

  var markers = {};
  Object.keys(studios).forEach(function (key) {
    var s = studios[key];
    // popup content built from DOM nodes (no HTML strings)
    var box = document.createElement('div');
    var h = document.createElement('strong'); h.textContent = s.name;
    var a = document.createElement('div'); a.textContent = s.address;
    var t = document.createElement('div'); t.textContent = 'Tel: ' + s.tel;
    box.appendChild(h); box.appendChild(a); box.appendChild(t);

    markers[key] = L.marker([s.lat, s.lng], { title: s.name, alt: s.name }).addTo(map).bindPopup(box);
  });

  var group = L.featureGroup(Object.keys(markers).map(function (k) { return markers[k]; }));
  map.fitBounds(group.getBounds().pad(0.35));

  function focusStudio(key) {
    var s = studios[key];
    if (!s) { return; }
    map.flyTo([s.lat, s.lng], 15, { duration: 1.1 });
    markers[key].openPopup();
    $('.locations > div').removeClass('is-active');
    $('.locations > div[data-studio="' + key + '"]').addClass('is-active');
  }

  $(document).on('click', '[data-show-studio]', function () {
    focusStudio($(this).data('show-studio'));
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  $('#show-both').on('click', function () {
    map.flyToBounds(group.getBounds().pad(0.35));
    $('.locations > div').removeClass('is-active');
  });

  /* ---------- nearest studio ---------- */
  function distanceKm(lat1, lng1, lat2, lng2) {
    var R = 6371, rad = Math.PI / 180;
    var dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  var $status = $('#nearest-status');
  $('#find-nearest').on('click', function () {
    if (!navigator.geolocation) { $status.text('Your browser does not support location lookup.'); return; }
    $status.text('Finding your location…');
    navigator.geolocation.getCurrentPosition(function (pos) {
      var best = null, bestD = Infinity;
      Object.keys(studios).forEach(function (k) {
        var d = distanceKm(pos.coords.latitude, pos.coords.longitude, studios[k].lat, studios[k].lng);
        if (d < bestD) { bestD = d; best = k; }
      });
      $status.text('Your nearest studio is ' + studios[best].name + ' (about ' + bestD.toFixed(1) + ' km away).');
      focusStudio(best);
    }, function () {
      $status.text('We could not get your location. You can still pick a studio below.');
    }, { timeout: 8000 });
  });

})(jQuery);
