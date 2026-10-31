/* =========================================================
   Radiance Studio — forms (enquiry + contact)
   - client-side validation with inline, accessible error messages
   - enquiry.html : validated input is processed into a response
                    (estimated cost + availability) and submitted
                    asynchronously with AJAX
   - contact.html : validated input is compiled into an email that
                    the visitor sends to the recipient set in the
                    form's data-recipient attribute
   All output is written with .text(), so user input can never be
   interpreted as HTML (XSS-safe).
   ========================================================= */

(function ($) {
  'use strict';

  /* =======================================================
     Shared validation
     ======================================================= */

  var SA_PHONE = /^(?:\+27|0027|0)[1-9]\d{8}$/;          // 0821234567 / +27821234567
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var NAME = /^[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ '\-.]{1,59}$/;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function toKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseDate(str) {                               // "YYYY-MM-DD" -> local Date (no timezone shift)
    var p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str || '');
    if (!p) { return null; }
    var d = new Date(+p[1], +p[2] - 1, +p[3]);
    return d.getMonth() === +p[2] - 1 ? d : null;
  }
  function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); return x; }
  function fmtDate(d) {
    return d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function oneLine(s) { return String(s).replace(/[\r\n]+/g, ' ').trim(); }

  // each rule returns an error message, or '' when the value is fine
  var rules = {
    name: function (v) {
      v = $.trim(v);
      if (!v) { return 'Please enter your full name.'; }
      if (v.length < 2) { return 'Your name must be at least 2 characters.'; }
      if (v.length > 60) { return 'Your name must be 60 characters or fewer.'; }
      if (!NAME.test(v)) { return 'Use letters, spaces, hyphens or apostrophes only.'; }
      return '';
    },
    email: function (v) {
      v = $.trim(v);
      if (!v) { return 'Please enter your email address.'; }
      if (v.length > 254 || !EMAIL.test(v)) { return 'Enter a valid email address, e.g. name@example.com.'; }
      return '';
    },
    phone: function (v, optional) {
      v = String(v).replace(/[\s\-()]/g, '');
      if (!v) { return optional ? '' : 'Please enter your phone number.'; }
      if (!SA_PHONE.test(v)) { return 'Enter a South African number, e.g. 082 123 4567 or +27 82 123 4567.'; }
      return '';
    },
    required: function (v, label) {
      return $.trim(v) ? '' : 'Please choose ' + label + '.';
    },
    date: function (v) {
      if (!v) { return ''; }                              // optional
      var d = parseDate(v);
      if (!d) { return 'Enter a valid date.'; }
      if (d < today()) { return 'Please choose today or a future date.'; }
      if (d > addDays(today(), 365)) { return 'Please choose a date within the next 12 months.'; }
      if (d.getDay() === 0) { return 'We are closed on Sundays. Please choose Monday to Saturday.'; }
      return '';
    },
    message: function (v, opts) {
      v = $.trim(v);
      if (!v) { return opts.required ? 'Please type a message.' : ''; }
      if (v.length < opts.min) { return 'Please write at least ' + opts.min + ' characters (currently ' + v.length + ').'; }
      if (v.length > opts.max) { return 'Please keep your message to ' + opts.max + ' characters or fewer.'; }
      return '';
    },
    checked: function ($el, msg) { return $el.prop('checked') ? '' : msg; }
  };

  /* Attach validation behaviour to a form.
     fields: { fieldName: function($form) -> error string } */
  function attachValidation($form, fields) {
    function $field(name) { return $form.find('[name="' + name + '"]'); }

    // HTML5 attributes validate the form if JavaScript is off; with JS we
    // switch the browser's pop-ups off and show our own inline messages.
    $form.attr('novalidate', 'novalidate');

    function show($el, msg) {
      var id = $el.attr('id');
      var $err = $('#' + id + '-error');
      if (!$err.length) {
        $err = $('<p class="field-error" role="alert"></p>').attr('id', id + '-error');
        ($el.closest('.field').length ? $el.closest('.field') : $el.parent()).append($err);
      }
      $err.text(msg);
      $el.attr('aria-invalid', msg ? 'true' : 'false');
      if (msg) { $el.attr('aria-describedby', id + '-error'); } else { $el.removeAttr('aria-describedby'); }
      $el.closest('.field').toggleClass('has-error', !!msg);
      return !msg;
    }

    function check(name) {
      var $el = $field(name);
      if (!$el.length || !fields[name]) { return true; }
      return show($el, fields[name]($el));
    }

    $form.on('blur', 'input, select, textarea', function () {
      if (this.name && this.type !== 'checkbox') { check(this.name); }
    });
    $form.on('input change', 'input, select, textarea', function () {
      // once a field has been flagged, re-check as the user fixes it
      if (this.name && $(this).attr('aria-invalid') === 'true') { check(this.name); }
    });

    return {
      checkAll: function () {
        var firstBad = null;
        Object.keys(fields).forEach(function (n) {
          if (!check(n) && !firstBad) { firstBad = $field(n); }
        });
        if (firstBad) { firstBad.trigger('focus'); }
        return !firstBad;
      },
      reset: function () {
        $form.find('.field-error').text('');
        $form.find('[aria-invalid]').removeAttr('aria-invalid aria-describedby');
        $form.find('.has-error').removeClass('has-error');
      }
    };
  }

  /* character counter for textareas */
  function attachCounter($ta, max) {
    var $c = $('<span class="counter" aria-hidden="true"></span>');
    $ta.after($c);
    function upd() {
      var n = $ta.val().length;
      $c.text(n + ' / ' + max).toggleClass('is-over', n > max);
    }
    $ta.on('input', upd);
    upd();
    return upd;
  }

  function row(label, value) {
    return $('<div class="result-row"></div>')
      .append($('<dt></dt>').text(label))
      .append($('<dd></dd>').text(value));
  }

  /* =======================================================
     ENQUIRY FORM
     ======================================================= */
  var $enq = $('#enquiry-form-el');
  if ($enq.length) { initEnquiry($enq); }

  function initEnquiry($form) {
    var data = window.RADIANCE_SERVICES;
    var $panel = $('#enquiry-result');
    var $service = $('#service');
    var $lengthField = $('#hairlength-field');
    var $date = $('#date');
    var $btn = $form.find('button[type="submit"]');

    // earliest selectable date = today
    $date.attr('min', toKey(today())).attr('max', toKey(addDays(today(), 365)));

    /* ---- rebuild the service drop-down from the shared data ---- */
    if (data) {
      $service.empty().append($('<option value="">-- Select a service --</option>'));
      data.categories.forEach(function (cat) {
        var $g = $('<optgroup></optgroup>').attr('label', cat.name);
        data.items.filter(function (i) { return i.category === cat.id; }).forEach(function (it) {
          $('<option></option>').val(it.id).text(it.name).appendTo($g);
        });
        $service.append($g);
      });
      $service.append($('<option value="other">Other / not sure yet</option>'));
    }

    function findItem(v) {
      if (!data) { return null; }
      for (var i = 0; i < data.items.length; i++) { if (data.items[i].id === v) { return data.items[i]; } }
      return null;
    }
    function findCategory(v) {
      if (!data) { return null; }
      for (var i = 0; i < data.categories.length; i++) { if (data.categories[i].id === v) { return data.categories[i]; } }
      return null;
    }

    // show the hair-length field only for services whose price depends on length
    function syncLength() {
      var it = findItem($service.val());
      var needs = !!(it && it.scales);
      $lengthField.prop('hidden', !needs);
      if (!needs) { $('#hairlength').val(''); }
    }
    $service.on('change', syncLength);

    // pre-select when arriving from a Services "Enquire" button: enquiry.html?service=balayage
    var params = new URLSearchParams(window.location.search);
    var pre = params.get('service');
    if (pre && $service.find('option[value="' + pre.replace(/[^a-z0-9-]/gi, '') + '"]').length) {
      $service.val(pre.replace(/[^a-z0-9-]/gi, ''));
    }
    syncLength();

    var updCount = attachCounter($('#emessage'), 500);

    var v = attachValidation($form, {
      ename:  function ($e) { return rules.name($e.val()); },
      eemail: function ($e) { return rules.email($e.val()); },
      ephone: function ($e) { return rules.phone($e.val(), false); },
      service: function ($e) { return rules.required($e.val(), 'a service'); },
      hairlength: function ($e) { return $lengthField.prop('hidden') ? '' : rules.required($e.val(), 'your hair length'); },
      date:   function ($e) { return rules.date($e.val()); },
      location: function ($e) { return rules.required($e.val(), 'a studio'); },
      emessage: function ($e) { return rules.message($e.val(), { required: false, min: 0, max: 500 }); },
      econsent: function ($e) { return rules.checked($e, 'Please tick the box so we can contact you about this enquiry.'); }
    });

    /* ---------- cost estimate ---------- */
    var LENGTH_MULT = { short: 1, shoulder: 1.1, mid: 1.2, waist: 1.35 };
    var LENGTH_LABEL = { short: 'Short / ear length', shoulder: 'Shoulder length', mid: 'Mid-back', waist: 'Waist length or longer' };
    function r10(n) { return Math.round(n / 10) * 10; }
    function rand(n) { return 'R' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

    function estimate(serviceVal, len) {
      var it = findItem(serviceVal);
      if (it) {
        if (it.price === null) {
          return { name: it.name, cost: 'Price on consultation', note: 'We quote this after a free consultation so we can see your hair first.' };
        }
        var mult = it.scales ? (LENGTH_MULT[len] || 1) : 1;
        var low = r10(it.price * mult);
        if (it.from) {
          return { name: it.name, cost: rand(low) + ' – ' + rand(r10(low * 1.35)),
                   note: 'This is an estimate based on our “from” price' + (it.scales && len ? ' and your hair length' : '') + '. Your stylist confirms the final price at your consultation.' };
        }
        return { name: it.name, cost: rand(low), note: it.scales && len ? 'Adjusted for your hair length.' : 'Our standard price for this service.' };
      }
      var cat = findCategory(serviceVal);
      if (cat) {
        var prices = data.items.filter(function (i) { return i.category === cat.id && i.price !== null; }).map(function (i) { return i.price; });
        return { name: cat.name, cost: 'from ' + rand(Math.min.apply(null, prices)), note: 'Choose a specific service for a more accurate estimate.' };
      }
      return { name: 'Other / not sure yet', cost: 'Tailored quote', note: 'A stylist will review your request and reply with a quote.' };
    }

    /* ---------- availability (indicative, deterministic per date + studio) ---------- */
    var SLOTS = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00'];
    function hash(str) { var h = 5381; for (var i = 0; i < str.length; i++) { h = ((h << 5) + h + str.charCodeAt(i)) | 0; } return Math.abs(h); }
    function slotsFor(d, loc) {
      var key = toKey(d) + loc;
      var open = SLOTS.filter(function (s) { return hash(key + s) % 10 < 6; });
      return open.length >= 2 ? open : SLOTS.slice(0, 2);
    }
    function nextOpenDays(from, count) {
      var out = [], d = from;
      while (out.length < count) { if (d.getDay() !== 0) { out.push(d); } d = addDays(d, 1); }
      return out;
    }

    /* ---------- AJAX submission ---------- */
    function send($form) {
      var url = $form.attr('action') || '';
      // placeholder endpoint => demo mode (nothing is sent anywhere)
      if (url.indexOf('REPLACE_WITH') !== -1 || !/^https?:/i.test(url)) {
        return $.Deferred().resolve({ demo: true }).promise();
      }
      var payload = $form.serializeArray().filter(function (f) { return f.name !== 'website'; });
      return $.ajax({
        url: url, method: 'POST', data: $.param(payload), dataType: 'json', timeout: 10000,
        headers: { Accept: 'application/json' }
      });
    }

    /* ---------- render response ---------- */
    function showResult(vals, status) {
      var est = estimate(vals.service, vals.hairlength);
      var loc = vals.location === 'rosebank' ? 'Rosebank Studio, 22 Baker Street' : 'Sandton Studio, 14 Rivonia Road';
      var ref = 'RS-' + toKey(today()).replace(/-/g, '').slice(2) + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      var first = $.trim(vals.ename).split(/\s+/)[0];

      var $dl = $('<dl class="result-list"></dl>')
        .append(row('Service', est.name))
        .append(row('Estimated cost', est.cost));
      if (vals.hairlength && LENGTH_LABEL[vals.hairlength]) { $dl.append(row('Hair length', LENGTH_LABEL[vals.hairlength])); }
      $dl.append(row('Studio', loc));

      var $avail = $('<div class="avail"></div>');
      var chosen = parseDate(vals.date);
      if (chosen) {
        $avail.append($('<h4></h4>').text('Availability on ' + fmtDate(chosen)));
        $avail.append(slotList(slotsFor(chosen, vals.location)));
      } else {
        $avail.append($('<h4></h4>').text('Next available appointments'));
        nextOpenDays(addDays(today(), 1), 3).forEach(function (d) {
          $avail.append($('<p class="avail-day"></p>').text(fmtDate(d)));
          $avail.append(slotList(slotsFor(d, vals.location).slice(0, 4)));
        });
      }

      var $statusLine = $('<p class="status-line"></p>');
      if (status === 'demo') { $statusLine.text('Your details were processed in your browser only (demo mode, no email has been sent).'); }
      else if (status === 'sent') { $statusLine.text('Your enquiry has been sent to the studio.'); }
      else { $statusLine.addClass('is-warn').text('We could not reach our enquiry inbox just now, so please also call the studio or use the Contact page so we do not miss you.'); }

      $panel.empty()
        .append($('<p class="eyebrow">Enquiry received</p>'))
        .append($('<h3 tabindex="-1"></h3>').text('Thank you, ' + first + '!'))
        .append($('<p class="ref"></p>').text('Reference: ' + ref))
        .append($dl)
        .append($('<p class="small"></p>').text(est.note))
        .append($avail)
        .append($('<p class="small"></p>').text('Appointment times are indicative. A stylist will confirm your booking by email or phone within one working day.'))
        .append($statusLine)
        .append($('<button type="button" class="btn btn-outline" id="new-enquiry">Make another enquiry</button>'));

      $panel.prop('hidden', false).addClass('is-in');
      $panel.find('h3').trigger('focus');
      $form.closest('#enquiry-form').addClass('has-result');
      if (!window.matchMedia('(min-width: 901px)').matches) {
        $panel[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function slotList(slots) {
      var $ul = $('<ul class="slots"></ul>');
      slots.forEach(function (s) { $('<li></li>').text(s).appendTo($ul); });
      return $ul;
    }

    $panel.on('click', '#new-enquiry', function () {
      $panel.prop('hidden', true).empty();
      $form.closest('#enquiry-form').removeClass('has-result');
      $form[0].reset();
      v.reset(); syncLength(); updCount();
      $('#ename').trigger('focus');
    });

    /* ---------- submit ---------- */
    $form.on('submit', function (e) {
      e.preventDefault();
      if (!v.checkAll()) { return; }

      var vals = {
        ename: $('#ename').val(), service: $service.val(), hairlength: $('#hairlength').val(),
        date: $date.val(), location: $('#location').val()
      };

      // honeypot: real visitors never fill this hidden field, bots usually do
      if ($form.find('[name="website"]').val()) { return; }

      $btn.prop('disabled', true).text('Checking…');
      $form.attr('aria-busy', 'true');

      send($form).done(function (res) {
        showResult(vals, res && res.demo ? 'demo' : 'sent');
      }).fail(function () {
        showResult(vals, 'failed');
      }).always(function () {
        $btn.prop('disabled', false).text('Submit Enquiry');
        $form.removeAttr('aria-busy');
      });
    });
  }

  /* =======================================================
     CONTACT FORM  ->  compiled email
     ======================================================= */
  var $con = $('#contact-form-el');
  if ($con.length) { initContact($con); }

  function initContact($form) {
    var recipient = $form.data('recipient');               // the recipient is set in the HTML
    var $panel = $('#email-preview');
    var updCount = attachCounter($('#cmessage'), 1000);

    var TYPE_LABEL = {
      general: 'General message', booking: 'Booking question', pricing: 'Pricing question',
      feedback: 'Feedback or compliment', complaint: 'Complaint', careers: 'Careers or collaboration'
    };

    var v = attachValidation($form, {
      cname:  function ($e) { return rules.name($e.val()); },
      cemail: function ($e) { return rules.email($e.val()); },
      cphone: function ($e) { return rules.phone($e.val(), true); },
      ctype:  function ($e) { return rules.required($e.val(), 'a message type'); },
      cmessage: function ($e) { return rules.message($e.val(), { required: true, min: 20, max: 1000 }); },
      cconsent: function ($e) { return rules.checked($e, 'Please tick the box to confirm you are happy for us to reply.'); }
    });

    function compile(vals) {
      var type = TYPE_LABEL[vals.ctype] || 'General message';
      var subject = '[Radiance Studio website] ' + type + ' from ' + oneLine(vals.cname);
      var body = [
        'Hello Radiance Studio team,',
        '',
        $.trim(vals.cmessage),
        '',
        '— Contact details —',
        'Name: ' + oneLine(vals.cname),
        'Email: ' + oneLine(vals.cemail),
        'Phone: ' + (oneLine(vals.cphone) || 'not provided'),
        'Message type: ' + type,
        '',
        'Sent from the Radiance Studio website contact form.'
      ].join('\n');
      return { to: recipient, subject: subject, body: body };
    }

    function showEmail(mail) {
      var href = 'mailto:' + mail.to + '?subject=' + encodeURIComponent(mail.subject) + '&body=' + encodeURIComponent(mail.body);

      $panel.empty()
        .append($('<p class="eyebrow">Your email is ready</p>'))
        .append($('<h3 tabindex="-1">Review and send</h3>'))
        .append($('<dl class="result-list"></dl>').append(row('To', mail.to)).append(row('Subject', mail.subject)))
        .append($('<pre class="email-body"></pre>').text(mail.body))
        .append($('<p class="small">Pressing “Send email” opens your own email app with everything filled in. Press send there to deliver your message.</p>'));

      var $actions = $('<div class="cta-row"></div>')
        .append($('<a class="btn"></a>').attr('href', href).text('Send email'))
        .append($('<button type="button" class="btn btn-outline" id="copy-email">Copy email text</button>'))
        .append($('<button type="button" class="link-btn" id="edit-email">Edit message</button>'));
      $panel.append($actions).append($('<p class="status-line" id="copy-status" role="status"></p>'));

      $panel.data('mail', mail).prop('hidden', false).addClass('is-in');
      $panel.find('h3').trigger('focus');
      $panel[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    $panel.on('click', '#copy-email', function () {
      var m = $panel.data('mail');
      var text = 'To: ' + m.to + '\nSubject: ' + m.subject + '\n\n' + m.body;
      var done = function (ok) { $('#copy-status').text(ok ? 'Copied to your clipboard.' : 'Copy failed. Please select the text and copy it manually.'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else { done(false); }
    });
    $panel.on('click', '#edit-email', function () {
      $panel.prop('hidden', true);
      $('#cmessage').trigger('focus');
    });

    $form.on('submit', function (e) {
      e.preventDefault();
      if (!v.checkAll()) { return; }
      if ($form.find('[name="website"]').val()) { return; }  // honeypot
      showEmail(compile({
        cname: $('#cname').val(), cemail: $('#cemail').val(), cphone: $('#cphone').val(),
        ctype: $('#ctype').val(), cmessage: $('#cmessage').val()
      }));
    });
    $form.on('reset', function () { setTimeout(function () { v.reset(); updCount(); $panel.prop('hidden', true); }, 0); });
  }

})(jQuery);
