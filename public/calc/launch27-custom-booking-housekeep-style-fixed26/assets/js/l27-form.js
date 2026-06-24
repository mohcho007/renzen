var promoApplied = false;
var promoCode = "";
var promoDiscountAmount = 0;
var promoCapture = false;
var promoPendingCode = "";
var lastNoPromoBaseTotal = null;
var lastNoPromoSelectedTotal = null;

jQuery(document).ready(function($) {
    console.log('L27 Plugin Initialized. Vars:', l27_vars);

    /**
     * Format minutes since midnight to HH:MM.
     * Accepts values beyond 24h and normalizes to 0-23:59.
     */
    function formatTime(totalMinutes) {
        var m = parseInt(totalMinutes, 10);
        if (isNaN(m)) m = 0;
        m = ((m % 1440) + 1440) % 1440;
        var hh = String(Math.floor(m / 60)).padStart(2, '0');
        var mm = String(m % 60).padStart(2, '0');
        return hh + ':' + mm;
    }

    // Stripe initialization
    var stripe, elements, card;
    if (l27_vars.stripe_public_key) {
        stripe = Stripe(l27_vars.stripe_public_key);
        elements = stripe.elements();
        card = elements.create('card');
        card.mount('#stripe-card-element');
    } else {
        console.warn('L27: Stripe Public Key is missing. Payment will not work.');
        $('#stripe-card-element').html('<p style="color:orange;">Stripe ikke konfigureret.</p>');
    }

    // Promo code state (globals)

    // Get form values
    var serviceId = $('input[name="service_id"]').val();
    var pricingParamId = $('input[name="pricing_param_id"]').val();


// Extras (service add-ons)
var servicesCache = null;
var extrasMetaById = {}; // { [extraId]: { recurring: bool, quantity_based: bool, price: number, name: string } }
var selectedExtras = {}; // { [extraId]: quantity }
var adminFeeExtraId = null;
var clubExtraId = null;
var clubSelected = false; // Renzen Klub selection (does NOT affect cleaning price)

function fetchServices() {
    return $.ajax({
        url: l27_vars.ajax_url,
        type: 'POST',
        dataType: 'json',
        data: {
            action: 'l27_get_services',
            nonce: l27_vars.nonce
        }
    });
}

function hydrateExtrasMeta(serviceObj) {
    extrasMetaById = {};
    adminFeeExtraId = null;
    clubExtraId = null;
    if (!serviceObj || !Array.isArray(serviceObj.extras)) return;
    serviceObj.extras
        .slice()
        .sort(function(a,b){ return (a.ordering||0) - (b.ordering||0); })
        .forEach(function(ex){
            if (!ex || !ex.id) return;
            var idStr = String(ex.id);
            var name = ex.name || ('Extra #' + ex.id);
            var price = parseFloat(ex.price) || 0;
            // Detect special extras
            if (/administrationsgebyr/i.test(name) && Math.abs(price - 5) < 0.01) {
                adminFeeExtraId = idStr;
            }
            if (/renzen\s*klub/i.test(name)) {
                clubExtraId = idStr;
            }

            extrasMetaById[idStr] = {
                id: ex.id,
                name: name,
                price: price,
                description: ex.description || '',
                image: ex.image || '',
                icon: ex.icon || '',
                recurring: !!ex.recurring,
                quantity_based: !!ex.quantity_based
            };
        });
}

function renderExtras() {
    var $wrap = $('#l27-extras-list');
    if (!$wrap.length) return;

    var ids = Object.keys(extrasMetaById);
    if (!ids.length) {
        $wrap.html('<p class="l27-muted">Ingen tilvalg tilgængelige.</p>');
        return;
    }

    // Club card
    if (clubExtraId && extrasMetaById[clubExtraId]) {
        var club = extrasMetaById[clubExtraId];
        $('#l27-club-card').show();
        $('#l27-club-price').text('+' + (Number(club.price)||0).toLocaleString('da-DK',{minimumFractionDigits:0,maximumFractionDigits:0}) + ' kr/md');
        var isClubSelected = !!clubSelected;
        $('#l27-club-card').toggleClass('active', isClubSelected);
        $('#l27-club-toggle').text(isClubSelected ? 'Fjern medlemskab' : 'Tilføj medlemskab');
    } else {
        $('#l27-club-card').hide();
    }

    var pills = [];
    ids
      .map(function(id){ return extrasMetaById[id]; })
      .filter(function(ex){
          if (!ex) return false;
          var idStr = String(ex.id);
          if (idStr === adminFeeExtraId) return false; // hidden always-included
          if (idStr === clubExtraId) return false; // in separate card
          return true;
      })
      .sort(function(a,b){
          // recurring first, then ordering by price asc
          if (a.recurring !== b.recurring) return a.recurring ? -1 : 1;
          return (a.price||0) - (b.price||0);
      })
      .forEach(function(ex){
          var idStr = String(ex.id);
          var qty = selectedExtras[idStr] || 0;
          var selected = qty > 0;

          var iconSrc = getExtraIconUri(ex);
          var displayName = getShortExtraLabel(ex);
          var priceTxt = '+' + (Number(ex.price)||0).toLocaleString('da-DK',{minimumFractionDigits:0,maximumFractionDigits:0}) + ' kr';

          var html = '';
          html += '<div class="l27-extra-pill-btn ' + (selected ? 'selected' : '') + (ex.quantity_based ? ' has-qty' : '') + '" data-extra-id="' + ex.id + '" role="button" tabindex="0">';
          if (iconSrc) {
              html += '<img class="l27-extra-icon" src="' + escapeHtml(iconSrc) + '" alt="" />';
          }
          html +=   '<div class="l27-extra-name">' + escapeHtml(displayName) + '</div>';
          html +=   '<div class="l27-extra-price">' + escapeHtml(priceTxt) + '</div>';

          if (ex.quantity_based) {
              var displayQty = selected ? qty : 1;
              html += '<div class="l27-pill-qty" aria-hidden="true">';
              html +=   '<button type="button" class="l27-pill-qty-btn l27-qty-minus">−</button>';
              html +=   '<span class="l27-pill-qty-val">' + displayQty + '</span>';
              html +=   '<button type="button" class="l27-pill-qty-btn l27-qty-plus">+</button>';
              html += '</div>';
          }

          html += '</div>';
          pills.push(html);
      });

    $wrap.html(pills.join(''));
    syncExtrasHidden();
    updateSummaryExtras();
}


function escapeHtml(str){
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
}


function stripPriceFromName(name){
    var s = String(name||'');
    // remove anything after ' +', and also any trailing 'kr.' if present
    var parts = s.split(' +');
    return parts[0].trim();
}

function getShortExtraLabel(ex){
    var id = String(ex && ex.id || '');
    var map = {
        '52': 'Køleskab',
        '53': 'Ovn & emhætte',
        '54': 'Køkkenskabe',
        '56': 'Fodpaneler',
        '57': 'Sofagruppe',
        '58': 'Kæledyr',
        '93': 'Afkalkning'
    };
    if (map[id]) return map[id];
    return stripPriceFromName(ex && ex.name);
}

function svgDataUri(svg){
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function getExtraIconUri(ex){
    if (!ex) return '';
    var id = String(ex.id || '');

    // Preferred Renzen icons (override)
    var map = {
        '52': 'https://renzen.dk/wp-content/uploads/2025/05/fridge-1.png',
        '53': 'https://renzen.dk/wp-content/uploads/2025/05/oven.png',
        '54': 'https://renzen.dk/wp-content/uploads/2025/05/kitchen_9263039.png',
        '93': 'https://renzen.dk/wp-content/uploads/2025/05/bath_13134933.png',
        '57': 'https://renzen.dk/wp-content/uploads/2025/05/sofa-1.png',
        '58': 'https://renzen.dk/wp-content/uploads/2025/05/dog.png'
    };
    if (map[id]) return map[id];

    // Fodpaneler (custom simple icon)
    if (id === '56') {
        return svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><g fill="none" stroke="#111827" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10 46h44"/><path d="M12 46v6h40v-6"/><path d="M14 26h36"/><path d="M14 26v14"/><path d="M50 26v14"/><path d="M22 34h20"/></g></svg>`);
    }

    // Prefer embedded data-uri icon if present
    if (ex.icon && String(ex.icon).indexOf('data:image') === 0) return ex.icon;

    // If Launch27 provides an image URL, use it
    if (ex.image && typeof ex.image === 'string' && ex.image.length) return ex.image;

    // Generic sparkle icon
    return svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><g fill="none" stroke="#111827" stroke-width="3" stroke-linecap="round"><path d="M32 10v10M32 44v10M10 32h10M44 32h10"/><path d="M18 18l7 7M39 39l7 7M46 18l-7 7M25 39l-7 7"/></g></svg>`);
}


function syncExtrasHidden() {
    var $freq = $('input[name="frequency_id"]:checked');
    var frequencyType = ($freq.length ? $freq.data('type') : 'oneoff') || 'oneoff';
    var isRecurringBooking = frequencyType !== 'oneoff';
    var payload = buildExtrasPayload(isRecurringBooking);
    $('#l27-extras-json').val(JSON.stringify(payload));
    updateSummaryExtras();
}

function updateSummaryExtras() {
    // Optional selected extras only. Mandatory fee and membership are shown separately in the summary.
    var items = [];
    Object.keys(selectedExtras).forEach(function(id){
        var qty = parseInt(selectedExtras[id],10) || 0;
        if (qty <= 0) return;
        if (adminFeeExtraId && String(id) === String(adminFeeExtraId)) return;
        if (clubExtraId && String(id) === String(clubExtraId)) return;
        var meta = extrasMetaById[id];
        if (!meta) return;
        items.push({ name: meta.name, qty: qty, price: meta.price });
    });

    function renderList($wrap, $ul) {
        if (!$wrap.length || !$ul.length) return;
        $ul.empty();
        if (!items.length) {
            $wrap.hide();
            return;
        }
        items.forEach(function(i){
            var nameTxt = i.name + (i.qty>1 ? ' ×' + i.qty : '');
            var priceTxt = '+' + (Number(i.price)||0).toLocaleString('da-DK',{minimumFractionDigits:0,maximumFractionDigits:0}) + ' kr';
            $ul.append(
                '<li>' +
                  '<span class="l27-summary-extra-name">' + escapeHtml(nameTxt) + '</span>' +
                  '<span class="l27-summary-extra-price">' + escapeHtml(priceTxt) + '</span>' +
                '</li>'
            );
        });
        $wrap.show();
    }

    renderList($('#l27-summary-extras-wrap'), $('#l27-summary-extras-list'));
    renderList($('#l27-mobile-summary-extras-wrap'), $('#l27-mobile-summary-extras-list'));

    // If mobile dropdown is open, recompute height so it doesn't cut off content.
    updateMobileSummaryDropdownHeight();
}

function buildExtrasPayload(isRecurringBooking) {
    var payload = [];
    Object.keys(selectedExtras).forEach(function(id){
        var qty = parseInt(selectedExtras[id], 10) || 0;
        if (qty <= 0) return;
        var meta = extrasMetaById[id] || {};
        var recurringFlag = !!(isRecurringBooking && meta.recurring);
        payload.push({
            id: parseInt(id, 10),
            quantity: qty,
            recurring: recurringFlag
        });
    });

    // Always include mandatory administrationsgebyr (hidden from extras UI)
    if (adminFeeExtraId && extrasMetaById[String(adminFeeExtraId)]) {
        var adminMeta = extrasMetaById[String(adminFeeExtraId)] || {};
        payload.push({
            id: parseInt(adminFeeExtraId, 10),
            quantity: 1,
            recurring: !!(isRecurringBooking && adminMeta.recurring)
        });
    }

    // Include Renzen Klub when selected (it should affect totals)
    if (clubSelected && clubExtraId && extrasMetaById[String(clubExtraId)]) {
        var clubMeta = extrasMetaById[String(clubExtraId)] || {};
        payload.push({
            id: parseInt(clubExtraId, 10),
            quantity: 1,
            recurring: !!(isRecurringBooking && clubMeta.recurring)
        });
    }
    return payload;
}
    var priceLoaded = false;
    var currentBasePrice = 0;
    var currentDiscount = 0;
    var currentFrequencyType = 'recurring';
    var lastRecurringFinalPrice = null;
    var lastRecurringBasePrice = null;
    var lastRecurringDiscountPercent = null;
    var lastOneoffPrice = null;

    function updateMobileSummaryDropdownHeight() {
        var $dropdown = $('#l27-mobile-summary-dropdown');
        if (!$dropdown.length) return;

        if (!$dropdown.hasClass('open')) {
            // Keep it fully collapsed when closed
            $dropdown.css('max-height', '0px');
            return;
        }

        // Use scrollHeight so it expands exactly to content (extras can change height)
        var h = $dropdown[0].scrollHeight || 0;
        // Safety cap so it doesn't go off-screen on very long lists
        var maxCap = Math.floor(window.innerHeight * 0.85);
        $dropdown.css('max-height', Math.min(h, maxCap) + 'px');
    }

    // Mobile summary toggle
    $('#l27-toggle-summary').on('click', function() {
        $('.l27-mobile-summary-header').toggleClass('open');
        $('#l27-mobile-summary-dropdown').toggleClass('open');
        updateMobileSummaryDropdownHeight();
    });

    // Close mobile summary when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.l27-mobile-summary-header, .l27-mobile-summary-dropdown').length) {
            $('.l27-mobile-summary-header').removeClass('open');
            $('#l27-mobile-summary-dropdown').removeClass('open');
            updateMobileSummaryDropdownHeight();
        }
    });

    // Recalculate on resize
    $(window).on('resize', function(){
        updateMobileSummaryDropdownHeight();
    });

    // --- 3-step UI (1: home+freq+extras, 2: date, 3: contact+payment) ---
    var currentStep = 1;

    function updateStepUI() {
        $('.l27-step').hide();
        $('.l27-step[data-step="' + currentStep + '"]').show();

        $('.l27-step-dot').removeClass('active');
        $('.l27-step-dot[data-step="' + currentStep + '"]').addClass('active');

        $('#l27-step-back').prop('disabled', currentStep === 1);

        if (currentStep === 3) {
            $('#l27-step-next').hide();
            $('#l27-submit-button').show();
        } else {
            $('#l27-step-next').show();
            $('#l27-submit-button').hide();
        }
    }

    function step1Valid() {
        var m2 = parseInt($('#l27-m2-input').val(), 10);
        if (!m2 || m2 <= 0) return false;
        if (!$('input[name="frequency_id"]:checked').length) return false;
        return true;
    }

    function step2Valid() {
        var dt = ($('#l27-selected-datetime').val() || '').trim();
        return dt.length > 0;
    }

    function goStep(n) {
        currentStep = Math.max(1, Math.min(3, n));
        updateStepUI();
        window.scrollTo({ top: $('#l27-booking-form-container').offset().top - 20, behavior: 'smooth' });
    }

    $('#l27-step-back').on('click', function(){
        goStep(currentStep - 1);
    });

    $('#l27-step-next').on('click', function(){
        if (currentStep === 1 && !step1Valid()) {
            $('#l27-m2-input').focus();
            return;
        }
        if (currentStep === 2 && !step2Valid()) {
            $('#l27-time-slots').addClass('l27-shake');
            setTimeout(function(){ $('#l27-time-slots').removeClass('l27-shake'); }, 400);
            return;
        }
        goStep(currentStep + 1);
    });

    // Allow clicking dots backwards (and forwards only if valid)
    $('.l27-step-dot').on('click', function(){
        var target = parseInt($(this).data('step'), 10) || 1;
        if (target <= currentStep) {
            goStep(target);
            return;
        }
        // forward navigation requires validations
        if (target === 2 && step1Valid()) goStep(2);
        if (target === 3 && step1Valid() && step2Valid()) goStep(3);
    });

    updateStepUI();

    // Select first frequency if none selected
    if (!$('input[name="frequency_id"]:checked').length) {
        $('input[name="frequency_id"]').first().prop('checked', true);
    }

    // Initialize card selection
    updateCardSelection();

    // Clicking the card itself should activate the relevant first option
    $('#l27-recurring-card').on('click', function(e) {
        // Ignore clicks on inputs/labels (they handle themselves)
        if ($(e.target).closest('input, label').length) return;
        var $checkedRecurring = $('input[name="frequency_id"][data-type="recurring"]:checked');
        if ($checkedRecurring.length) {
            $checkedRecurring.trigger('change');
        } else {
            $('input[name="frequency_id"][data-type="recurring"]').first().prop('checked', true).trigger('change');
        }
    });

    $('#l27-oneoff-card').on('click', function(e) {
        if ($(e.target).closest('input, label').length) return;
        var $checkedOneoff = $('input[name="frequency_id"][data-type="oneoff"]:checked');
        if ($checkedOneoff.length) {
            $checkedOneoff.trigger('change');
        } else {
            $('input[name="frequency_id"][data-type="oneoff"]').first().prop('checked', true).trigger('change');
        }
    });

    // Format price in Danish format
    function formatPrice(price) {
        var n = Number(price) || 0;
        return n.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kr';
    }

    // Format discount amount (prefer whole kroner when possible)
    function formatDiscount(amount) {
        var n = Number(amount) || 0;
        var isWhole = Math.abs(n - Math.round(n)) < 0.005;
        var opts = isWhole ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
        return n.toLocaleString('da-DK', opts) + ' kr';
    }

    // Normalize discount values coming from API/template.
    // Some Launch27 setups return discount as 20 (percent), others as 0.20 (fraction),
    // and sometimes the numeric value is missing but present in the label ("- 20%").
    function getDiscountPercentFromSelected() {
        var $selected = $('input[name="frequency_id"]:checked');
        if (!$selected.length) return 0;

        var raw = $selected.data('discount');
        var n = raw !== undefined && raw !== null ? parseFloat(raw) : NaN;

        // If missing/NaN/0, attempt to parse from the displayed label (e.g. "Hver uge - 20%")
        if (!isFinite(n) || n === 0) {
            var label = ($selected.data('name') || '').toString();
            var m = label.match(/(\d+(?:[\.,]\d+)?)\s*%/);
            if (m && m[1]) {
                n = parseFloat(m[1].replace(',', '.'));
            } else {
                return 0;
            }
        }

        // Convert fractional (0.20) to percent (20)
        if (n > 0 && n <= 1) n = n * 100;

        // Clamp to sensible range
        if (n < 0) n = 0;
        if (n > 90) n = 90;
        return n;
    }

    // Update card selection (recurring vs one-off)
    function updateCardSelection() {
        var $checked = $('input[name="frequency_id"]:checked');
        var frequencyType = $checked.data('type') || 'recurring';
        
        currentFrequencyType = frequencyType;

        // Update card active state
        if (frequencyType === 'recurring') {
            $('#l27-recurring-card').addClass('active');
            $('#l27-oneoff-card').removeClass('active');
        } else {
            $('#l27-recurring-card').removeClass('active');
            $('#l27-oneoff-card').addClass('active');
        }

        // Update button selection within the active card
        // NOTE: Extras pills reuse `.l27-freq-option` for styling, so we must NOT
        // clear their selected state when switching frequency.
        var $allButtons = $('.l27-freq-option').filter(function(){
            return $(this).data('extra-id') === undefined;
        });
        $allButtons.removeClass('selected');
        $checked.closest('.l27-freq-option').addClass('selected');

        console.log('Card selection updated:', frequencyType);
    }

    // Update summary frequency text
    function updateFrequencyText() {
        var $selected = $('input[name="frequency_id"]:checked');
        var selectedFrequency = $selected.data('name') || '-';
        $('#l27-summary-frequency').text(selectedFrequency);
        $('#l27-mobile-summary-frequency').text(selectedFrequency);
    }

    // Generate a default future date for price estimation
    function getDefaultServiceDate() {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        var year = tomorrow.getFullYear();
        var month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        var day = String(tomorrow.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day + 'T10:00:00';
    }

    // Display price breakdown
    function displayPriceBreakdown(basePrice, discountPercent, frequencyType) {
        currentBasePrice = basePrice;
        currentDiscount = discountPercent;

        var finalPrice;
        var discountAmount = 0;
        
        console.log('Display price breakdown:', { basePrice, discountPercent, frequencyType });

        if (frequencyType === 'oneoff') {
            // One-off: show base price without discount
            finalPrice = basePrice;
            discountAmount = 0;
        } else {
            // Recurring: apply discount
            discountAmount = basePrice * (discountPercent / 100);
            finalPrice = basePrice - discountAmount;
        }

        // Update desktop sidebar
        // Subtotal should ALWAYS be the base price (before discount)
        $('#l27-price-before').text(formatPrice(basePrice));

        // Rabat row: show only when recurring + has discount, and display in kroner (not %)
        if (frequencyType === 'recurring' && discountPercent > 0) {
            $('#l27-discount').text('-' + formatDiscount(discountAmount));
            $('#l27-discount').closest('.l27-summary-row').show();
        } else {
            $('#l27-discount').text('-');
            $('#l27-discount').closest('.l27-summary-row').hide();
        }

        // Total is the final price (after discount when recurring)
        $('#l27-total-price').text(formatPrice(finalPrice));

        // Update mobile summary
        $('#l27-mobile-price-before').text(formatPrice(basePrice));

        if (frequencyType === 'recurring' && discountPercent > 0) {
            $('#l27-mobile-discount').text('-' + formatDiscount(discountAmount));
            $('#l27-mobile-discount').closest('.l27-summary-row').show();
        } else {
            $('#l27-mobile-discount').text('-');
            $('#l27-mobile-discount').closest('.l27-summary-row').hide();
        }

        $('#l27-mobile-final-price').text(formatPrice(finalPrice));
        $('#l27-mobile-price').text(formatPrice(finalPrice));

        // Cache the values so both cards stay correct when user switches between them
        if (frequencyType === 'recurring') {
            lastRecurringFinalPrice = finalPrice;
            lastRecurringBasePrice = basePrice;
            lastRecurringDiscountPercent = discountPercent;
            // One-off price is the base price (no discount)
            lastOneoffPrice = basePrice;
        } else {
            lastOneoffPrice = basePrice;
        }

        // Update frequency card prices
        if (lastRecurringFinalPrice !== null) {
            $('#l27-recurring-price').text(formatPrice(lastRecurringFinalPrice));
        }
        if (lastOneoffPrice !== null) {
            $('#l27-oneoff-price').text(formatPrice(lastOneoffPrice));
        }
    }

    // Reset price display
    function resetPriceDisplay() {
        $('#l27-price-before').text('- kr');
        // Keep the Rabat row visible with a dash before the user has entered m²,
        // matching the desired "-" placeholder UI.
        $('#l27-discount').text('-').closest('.l27-summary-row').show();
        $('#l27-total-price').text('- kr');
        
        $('#l27-mobile-price-before').text('- kr');
        $('#l27-mobile-discount').text('-').closest('.l27-summary-row').show();
        $('#l27-mobile-final-price').text('- kr');
        $('#l27-mobile-price').text('- kr');

        $('#l27-recurring-price').text('- kr');
        $('#l27-oneoff-price').text('- kr');

        lastRecurringFinalPrice = null;
        lastRecurringBasePrice = null;
        lastRecurringDiscountPercent = null;
        lastOneoffPrice = null;
    }

    // Update price from API
    function updatePrice() {
        var m2Input = $('#l27-m2-input').val();
        var m2 = parseInt(m2Input) || 0;

        if (!m2Input || m2 < 70) {
            resetPriceDisplay();
            $('#l27-summary-m2').text('-');
            $('#l27-mobile-summary-m2').text('-');
            priceLoaded = false;
            return;
        }

        var $selectedFreq = $('input[name="frequency_id"]:checked');
        var frequencyId = $selectedFreq.val();
        var serviceDate = $('#l27-selected-datetime').val() || getDefaultServiceDate();
        var frequencyType = $selectedFreq.data('type') || 'recurring';
        var discountPercent = getDiscountPercentFromSelected();

        // One-off frequency id is used to fetch the true base/subtotal price.
        // This avoids unreliable "reverse-calculation" from discounted totals,
        // and ensures Subtotal + Engangs card are always correct.
        var oneoffFrequencyId = ($('input[name="frequency_id"][data-type="oneoff"]').first().val()) || null;

        $('#l27-total-price').text('Beregner...');
        $('#l27-mobile-price').text('...');
        $('#l27-summary-m2').text(m2 + ' m²');
        $('#l27-mobile-summary-m2').text(m2 + ' m²');

        // Build extras payloads up front (used both for logging + requests)
        var extrasPayloadBase = buildExtrasPayload(false); // base/engangs estimate should treat extras as one-off
        var extrasPayloadSelected = buildExtrasPayload(frequencyType !== 'oneoff');

        console.log('L27 Price Request:', {
            service_id: serviceId,
            pricing_param_id: pricingParamId,
            pricing_param_quantity: m2,
            frequency_id: frequencyId,
            service_date: serviceDate,
            extras_base: extrasPayloadBase,
            extras_selected: extrasPayloadSelected,
            discount_percent: discountPercent,
            frequency_type: frequencyType
        });

        function estimatePrice(freqId, extrasPayload) {
            return $.ajax({
                url: l27_vars.ajax_url,
                type: 'POST',
                dataType: 'json',
                data: {
                    action: 'l27_estimate_price',
                    nonce: l27_vars.nonce,
                    service_id: serviceId,
                    pricing_param_id: pricingParamId,
                    pricing_param_quantity: m2,
                    frequency_id: freqId,
                    service_date: serviceDate,
                    discount_code: (promoApplied ? promoCode : ''),
                    extras_json: JSON.stringify(extrasPayload || [])
                }
            });
        }

        // Strategy:
        // - Always fetch one-off total to use as Subtotal/base price.
        // - If user selected recurring, also fetch recurring total and compute rabat in kroner.
        // This matches the desired UI:
        // Subtotal = Engangs price, Rabat = base - recurringTotal, Total = recurringTotal.
        var reqBase = oneoffFrequencyId ? estimatePrice(oneoffFrequencyId, extrasPayloadBase) : $.Deferred().reject('missing_oneoff');
        var reqSelected = estimatePrice(frequencyId, extrasPayloadSelected);

        $.when(reqBase, reqSelected)
            .done(function(baseRespWrap, selRespWrap) {
                // jQuery returns [data, statusText, jqXHR]
                function unwrap(resp){
                    if (!resp) return null;
                    // WP AJAX often returns {success:true,data:{...}}
                    if (resp.success !== undefined && resp.data !== undefined) {
                        return resp.success ? resp.data : resp;
                    }
                    return resp;
                }

                var baseResp = unwrap(baseRespWrap && baseRespWrap[0] ? baseRespWrap[0] : null);
                var selResp  = unwrap(selRespWrap && selRespWrap[0] ? selRespWrap[0] : null);

                console.log('L27 Base Price Response:', baseResp);
                console.log('L27 Selected Price Response:', selResp);

                if (!baseResp || baseResp.total === undefined || !selResp || selResp.total === undefined) {
                    resetPriceDisplay();
                    priceLoaded = false;
                    return;
                }

                var basePrice = parseFloat(baseResp.total);
                var selectedTotal = parseFloat(selResp.total);

                // If we're capturing baseline (no-promo) totals, store and then re-run with promo
                if (promoCapture) {
                    lastNoPromoBaseTotal = basePrice;
                    lastNoPromoSelectedTotal = selectedTotal;
                    promoCapture = false;

                    // Apply promo and re-run estimation
                    promoApplied = true;
                    promoCode = promoPendingCode || promoCode;
                    syncPromoUI();
                    updatePrice();
                    return;
                }

                // Promo discount row (computed as difference between no-promo totals and current totals)
                var promoDiscount = 0;
                if (promoApplied && promoCode && lastNoPromoBaseTotal !== null && lastNoPromoSelectedTotal !== null) {
                    if (frequencyType === 'oneoff') {
                        promoDiscount = Math.max(0, lastNoPromoBaseTotal - basePrice);
                    } else {
                        promoDiscount = Math.max(0, lastNoPromoSelectedTotal - selectedTotal);
                    }
                }
                if (promoApplied && promoDiscount > 0.01) {
                    $('#l27-promo-discount-amount').text('-' + formatPrice(promoDiscount));
                    $('#l27-promo-discount-row').show();
                    $('#l27-mobile-promo-discount-amount').text('-' + formatPrice(promoDiscount));
                    $('#l27-mobile-promo-discount-row').show();
                } else {
                    $('#l27-promo-discount-row').hide();
                    $('#l27-mobile-promo-discount-row').hide();
                }

                // Mandatory/admin fee and optional membership (Renzen Klub)
                var adminFee = 0;
                if (adminFeeExtraId && extrasMetaById[adminFeeExtraId]) {
                    adminFee = parseFloat(extrasMetaById[adminFeeExtraId].price) || 0;
                }
                var clubFee = 0;
                if (clubSelected && clubExtraId && extrasMetaById[clubExtraId]) {
                    clubFee = parseFloat(extrasMetaById[clubExtraId].price) || 0;
                }

                // Subtotal shown in UI should represent the cleaning (incl. optional extras), excluding mandatory fee + membership.
                var displaySubtotal = Math.max(0, basePrice - adminFee - clubFee);

                // Fee rows (positioned between Subtotal and Rabat)
                if (adminFee > 0.001) {
                    $('#l27-admin-fee').text('+' + formatDiscount(adminFee));
                    $('#l27-admin-fee-row').show();
                    $('#l27-mobile-admin-fee').text('+' + formatDiscount(adminFee));
                    $('#l27-mobile-admin-fee-row').show();
                } else {
                    $('#l27-admin-fee-row').hide();
                    $('#l27-mobile-admin-fee-row').hide();
                }

                if (clubFee > 0.001) {
                    $('#l27-club-fee').text('+' + formatDiscount(clubFee));
                    $('#l27-club-fee-row').show();
                    $('#l27-mobile-club-fee').text('+' + formatDiscount(clubFee));
                    $('#l27-mobile-club-fee-row').show();
                } else {
                    $('#l27-club-fee-row').hide();
                    $('#l27-mobile-club-fee-row').hide();
                }

                // Update cached one-off always from base (includes mandatory fee + membership when selected)
                lastOneoffPrice = basePrice;
                $('#l27-oneoff-price').text(formatPrice(basePrice));

                // Subtotal shown in sidebar/mobile (excludes mandatory fee + membership)
                $('#l27-price-before').text(formatPrice(displaySubtotal));
                $('#l27-mobile-price-before').text(formatPrice(displaySubtotal));

                if (frequencyType === 'oneoff') {
                    // One-off selected: no discount row
                    $('#l27-discount').text('-');
                    $('#l27-discount').closest('.l27-summary-row').hide();
                    $('#l27-mobile-discount').text('-');
                    $('#l27-mobile-discount').closest('.l27-summary-row').hide();

                    // Total is basePrice (includes mandatory fee + membership)
                    $('#l27-total-price').text(formatPrice(basePrice));
                    $('#l27-mobile-final-price').text(formatPrice(basePrice));
                    $('#l27-mobile-price').text(formatPrice(basePrice));
                } else {
                    // Recurring selected: show discount in kroner based on API totals
                    var discountAmount = Math.max(0, basePrice - selectedTotal);

                    // Rabat shown as kroner (keep decimals)
                    if (discountAmount > 0.01) {
                        $('#l27-discount').text('-' + formatPrice(discountAmount));
                        $('#l27-discount').closest('.l27-summary-row').show();
                        $('#l27-mobile-discount').text('-' + formatPrice(discountAmount));
                        $('#l27-mobile-discount').closest('.l27-summary-row').show();
                    } else {
                        $('#l27-discount').text('-');
                        $('#l27-discount').closest('.l27-summary-row').hide();
                        $('#l27-mobile-discount').text('-');
                        $('#l27-mobile-discount').closest('.l27-summary-row').hide();
                    }

                    // Total is selectedTotal (includes mandatory fee + membership)
                    $('#l27-total-price').text(formatPrice(selectedTotal));
                    $('#l27-mobile-final-price').text(formatPrice(selectedTotal));
                    $('#l27-mobile-price').text(formatPrice(selectedTotal));

                    // Recurring card price is selectedTotal
                    lastRecurringFinalPrice = selectedTotal;
                    $('#l27-recurring-price').text(formatPrice(selectedTotal));

                    // Keep caches coherent
                    lastRecurringBasePrice = basePrice;
                    lastRecurringDiscountPercent = discountPercent;
                }

                priceLoaded = true;
            })
            .fail(function(xhr) {
                console.error('L27 Price Ajax Error:', xhr && xhr.responseText ? xhr.responseText : xhr);
                resetPriceDisplay();
                priceLoaded = false;
            });
    }

    // Fetch available spots from API
    var spotsCache = {}; // { 'YYYY-MM-DD': dayData }

    function fetchSpotsChunk(date, days) {
        return $.ajax({
            url: l27_vars.ajax_url,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'l27_get_spots',
                nonce: l27_vars.nonce,
                date: date,
                days: days || 7
            }
        }).then(function(response) {
            if (Array.isArray(response)) {
                response.forEach(function(d) {
                    if (d && d.date) spotsCache[d.date] = d;
                });
            }
            return response;
        });
    }

    function renderTimesForDate(date) {
        $('#l27-time-slots').html('<p class="l27-hint">Henter ledige tider...</p>');

        var ensure = spotsCache[date] ? $.Deferred().resolve([spotsCache[date]]) : fetchSpotsChunk(date, 7);

        ensure.then(function() {
            var dayData = spotsCache[date];
            var html = '';

            if (dayData && Array.isArray(dayData.spots) && dayData.spots.length) {
                var freeSpots = dayData.spots.filter(function(spot) {
                    return spot.free === true && spot.past === false;
                });

                if (freeSpots.length) {
            // Build slot objects + de-duplicate identical time ranges
            var slots = [];
            var seen = {};

            // Helper: Normalize Launch27 spot time fields.
            // API docs/observations show spots use `hours` + `minutes`, but older code used `start_hour` + `start_minute`.
            function getSpotHour(spot) {
                var h = (spot && spot.start_hour !== undefined) ? spot.start_hour : (spot && spot.hours !== undefined ? spot.hours : (spot && spot.hour !== undefined ? spot.hour : undefined));
                h = parseInt(h, 10);
                return isNaN(h) ? null : h;
            }
            function getSpotMinute(spot) {
                var m = (spot && spot.start_minute !== undefined) ? spot.start_minute : (spot && spot.minutes !== undefined ? spot.minutes : (spot && spot.minute !== undefined ? spot.minute : undefined));
                m = parseInt(m, 10);
                return isNaN(m) ? null : m;
            }
            freeSpots.forEach(function(spot){
                var sh = getSpotHour(spot);
                var sm = getSpotMinute(spot);
                // If we can't read a start time, skip this spot to avoid "undefined" service_date.
                if (sh === null || sm === null) return;

                var startMin = sh * 60 + sm;
                var windowMin = parseInt(spot.arrival_window || 0, 10) || 0;
                var endMin = startMin + windowMin;

                // If no arrival window, attempt to infer from next spot (fallback 60)
                if (!windowMin) {
                    var next = freeSpots.find(function(s){
                        var nh = getSpotHour(s);
                        var nm2 = getSpotMinute(s);
                        if (nh === null || nm2 === null) return false;
                        var nm = nh * 60 + nm2;
                        return nm > startMin;
                    });
                    if (next) {
                        var neh = getSpotHour(next);
                        var nem = getSpotMinute(next);
                        endMin = (neh === null || nem === null) ? (startMin + 60) : (neh * 60 + nem);
                    } else {
                        endMin = startMin + 60;
                    }
                    windowMin = endMin - startMin;
                }

                var startLabel = formatTime(startMin);
                var endLabel = formatTime(endMin);
                var label = startLabel + ' - ' + endLabel;

                var key = startMin + '-' + endMin;
                if (seen[key]) return;
                seen[key] = true;

                slots.push({
                    spot: spot,
                    startHour: sh,
                    startMinute: sm,
                    startMin: startMin,
                    endMin: endMin,
                    windowMin: windowMin,
                    label: label
                });
            });

            // Sort by start
            slots.sort(function(a,b){ return a.startMin - b.startMin; });

            // Pick "Hele dagen" as the widest window (typically 08:00-16:00)
            var allDay = null;
            slots.forEach(function(s){
                if (!allDay || s.windowMin > allDay.windowMin || (s.windowMin === allDay.windowMin && s.startMin < allDay.startMin)) {
                    allDay = s;
                }
            });

            // Remove allDay from other lists (avoid duplicate)
            var rest = slots.filter(function(s){ return !allDay || (s.startMin !== allDay.startMin || s.endMin !== allDay.endMin); });

            // Split morning/afternoon at 12:00
            var noon = 12 * 60;
            var morning = rest.filter(function(s){ return s.startMin < noon; });
            var afternoon = rest.filter(function(s){ return s.startMin >= noon; });

            function slotHtml(s, extraClass, badgeText){
                var cls = 'l27-time-slot' + (extraClass ? (' ' + extraClass) : '');
                var badge = badgeText ? ('<span class="l27-badge-best">'+badgeText+'</span>') : '';
                // Store normalized start time + ISO datetime to avoid undefined values.
                var hh = String(s.startHour).padStart(2, '0');
                var mm = String(s.startMinute).padStart(2, '0');
                var iso = date + 'T' + hh + ':' + mm + ':00';
                var isWide = extraClass && extraClass.indexOf('l27-time-slot--wide') !== -1;
                var textHtml = isWide
                    ? ('<div class="l27-time-slot-inner"><div class="l27-time-slot-title">Hele dagen</div><div class="l27-time-slot-range">'+s.label+'</div></div>')
                    : ('<span class="l27-time-slot-text">'+s.label+'</span>');
                return '<div class="'+cls+'" data-hours="'+s.startHour+'" data-minutes="'+s.startMinute+'" data-iso="'+iso+'" data-window="'+(s.spot.arrival_window || s.windowMin)+'">' +
                         textHtml + badge +
                       '</div>';
            }

            var out = '<div class="l27-time-groups">';

            if (allDay) {
                out += '<div class="l27-time-all-day">';
                out += slotHtml(allDay, 'l27-time-slot--wide l27-time-slot--best', 'Best');
                out += '</div>';
            }

            out += '<div class="l27-time-columns">';
            out += '<div class="l27-time-col"><div class="l27-time-group-title">Morgen</div>';
            if (morning.length) {
                morning.forEach(function(s){ out += slotHtml(s); });
            } else {
                out += '<p class="l27-hint">Ingen tider</p>';
            }
            out += '</div>';

            out += '<div class="l27-time-col"><div class="l27-time-group-title">Eftermiddag</div>';
            if (afternoon.length) {
                afternoon.forEach(function(s){ out += slotHtml(s); });
            } else {
                out += '<p class="l27-hint">Ingen tider</p>';
            }
            out += '</div>';

            out += '</div>'; // columns
            out += '</div>'; // groups

            html = out;
        } else {
            html = '<p class="l27-hint">Ingen ledige tider denne dag.</p>';
        }
            } else {
                html = '<p class="l27-hint">Ingen tider tilgængelige for denne dato.</p>';
            }

            $('#l27-time-slots').html(html);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('L27 Spots Ajax Error:', {
                textStatus: textStatus,
                errorThrown: errorThrown,
                status: jqXHR && jqXHR.status,
                responseText: jqXHR && jqXHR.responseText
            });
            $('#l27-time-slots').html('<p class="l27-hint">Forbindelsesfejl ved hentning af tider.</p>');
        });
    }

    // Handle time slot selection
    $(document).on('click', '.l27-time-slot', function() {
        $('.l27-time-slot').removeClass('selected');
        $(this).addClass('selected');
        
        var date = $('#l27-selected-date').val();
        var iso = $(this).data('iso');
        var hours, minutes;

        // Prefer the precomputed ISO datetime from the spot renderer.
        if (typeof iso === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(iso)) {
            // Ensure we also have the date string for UI formatting.
            if (!date) date = iso.substring(0, 10);
            hours = iso.substring(11, 13);
            minutes = iso.substring(14, 16);
        } else {
            // Fallback: build from data-hours/data-minutes (guard against undefined)
            var hRaw = $(this).data('hours');
            var mRaw = $(this).data('minutes');
            if (hRaw === undefined || mRaw === undefined || date === undefined || !date) {
                console.warn('L27: Missing time data for selected spot', { date: date, hours: hRaw, minutes: mRaw, iso: iso });
                return;
            }
            hours = String(hRaw).padStart(2, '0');
            minutes = String(mRaw).padStart(2, '0');
            iso = date + 'T' + hours + ':' + minutes + ':00';
        }
        var arrivalWindow = $(this).data('window');
        
        var fullDateTime = iso;
        
        $('#l27-selected-datetime').val(fullDateTime);
        $('#l27-selected-arrival-window').val(arrivalWindow);
        
        // Format date for display
        var dateObj = new Date(date);
        var options = { day: 'numeric', month: 'long', year: 'numeric' };
        var formattedDate = dateObj.toLocaleDateString('da-DK', options);
        var dateDisplay = formattedDate + ' kl. ' + hours + ':' + minutes;
        
        $('#l27-summary-date').text(dateDisplay);
        $('#l27-mobile-summary-date').text(dateDisplay);
        
        updatePrice();
    });

    // Open calendar UI (always visible)
    function ymd(d) {
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + day;
    }

    function addDays(date, days) {
        var d = new Date(date.getTime());
        d.setDate(d.getDate() + days);
        return d;
    }

    function startOfWeekMonday(date) {
        var d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var day = (d.getDay() + 6) % 7; // Mon=0
        d.setDate(d.getDate() - day);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function isoWeekNumber(date) {
        var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    var calendarState = {
        viewDate: new Date(),
        selected: null
    };

    function formatDateLong(dateStr) {
        var d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function dayHasFreeSpots(dateStr) {
        var d = spotsCache[dateStr];
        if (!d || !Array.isArray(d.spots)) return false;
        return d.spots.some(function(s) { return s.free === true && s.past === false; });
    }

    function fetchAvailabilityForRange(startDate, totalDays) {
        var reqs = [];
        for (var i = 0; i < totalDays; i += 7) {
            var chunkStart = ymd(addDays(startDate, i));
            var chunkDays = Math.min(7, totalDays - i);
            reqs.push(fetchSpotsChunk(chunkStart, chunkDays));
        }
        return $.when.apply($, reqs);
    }

    function renderCalendar() {
        var $cal = $('#l27-open-calendar');
        if (!$cal.length) return;

        var year = calendarState.viewDate.getFullYear();
        var month = calendarState.viewDate.getMonth();
        var firstOfMonth = new Date(year, month, 1);
        var start = startOfWeekMonday(firstOfMonth);
        var end = addDays(start, 41); // 6 weeks grid

        // Preload availability for the grid
        fetchAvailabilityForRange(start, 42).always(function() {
            var monthName = calendarState.viewDate.toLocaleDateString('da-DK', { month: 'long', year: 'numeric' });
            var html = '';
            html += '<div class="l27-cal-header">'
                 +  '<button type="button" class="l27-cal-nav" data-dir="prev" aria-label="Forrige måned">‹</button>'
                 +  '<div class="l27-cal-month">' + monthName + '</div>'
                 +  '<button type="button" class="l27-cal-nav" data-dir="next" aria-label="Næste måned">›</button>'
                 + '</div>';

            html += '<div class="l27-cal-grid">';
            html += '<div class="l27-cal-dow l27-cal-week">#</div>';
            ['Ma','Ti','On','To','Fr','Lø','Sø'].forEach(function(n){ html += '<div class="l27-cal-dow">'+n+'</div>'; });

            for (var w = 0; w < 6; w++) {
                var weekStart = addDays(start, w * 7);
                html += '<div class="l27-cal-week">' + isoWeekNumber(weekStart) + '</div>';
                for (var d = 0; d < 7; d++) {
                    var cur = addDays(weekStart, d);
                    var dateStr = ymd(cur);
                    var isInMonth = cur.getMonth() === month;
                    var isPast = cur < startOfWeekMonday(new Date()); // rough past check by day
                    var hasSpots = dayHasFreeSpots(dateStr);
                    var isSelected = calendarState.selected === dateStr;

                    var cls = 'l27-cal-day';
                    if (!isInMonth) cls += ' is-out';
                    if (!hasSpots) cls += ' is-disabled';
                    if (isSelected) cls += ' is-selected';

                    html += '<button type="button" class="' + cls + '" data-date="' + dateStr + '" ' + (hasSpots ? '' : 'disabled') + '>'
                         +  '<span class="l27-cal-num">' + cur.getDate() + '</span>'
                         + '</button>';
                }
            }
            html += '</div>';
            $cal.html(html);
        });
    }

    // Calendar interactions
    $(document).on('click', '.l27-cal-nav', function() {
        var dir = $(this).data('dir');
        var d = new Date(calendarState.viewDate.getFullYear(), calendarState.viewDate.getMonth(), 1);
        d.setMonth(d.getMonth() + (dir === 'prev' ? -1 : 1));
        calendarState.viewDate = d;
        renderCalendar();
    });

    $(document).on('click', '.l27-cal-day', function() {
        var dateStr = $(this).data('date');
        if (!dateStr) return;
        calendarState.selected = dateStr;
        $('#l27-selected-date').val(dateStr);
        $('#l27-times-label').text('Ledige tider den ' + formatDateLong(dateStr));
        // Reset time selection
        $('#l27-selected-datetime').val('');
        $('#l27-selected-arrival-window').val('');
        $('#l27-summary-date').text('-');
        $('#l27-mobile-summary-date').text('-');
        renderCalendar();
        renderTimesForDate(dateStr);
    });

    // Init calendar on load
    renderCalendar();

    
// Load service extras (Almindelig rengøring etc.)
fetchServices()
    .done(function(resp){
        if (!resp || !resp.success) return;
        servicesCache = resp.data || resp;
        // Some WP AJAX returns {success:true,data:[...]}
        var arr = Array.isArray(servicesCache) ? servicesCache : (servicesCache.services || servicesCache.items || servicesCache.data || []);
        if (!Array.isArray(arr) && arr && typeof arr === 'object') {
        // Some APIs return an object keyed by IDs
        arr = Object.keys(arr).map(function(k){ return arr[k]; });
    }
    if (!Array.isArray(arr)) arr = [];
        var sid = parseInt(serviceId, 10);
        var serviceObj = arr.find(function(s){ return parseInt(s.id,10) === sid; });
        if (serviceObj) {
            hydrateExtrasMeta(serviceObj);
            renderExtras();
        } else {
            // fallback: no extras
            hydrateExtrasMeta(null);
            renderExtras();
        }
    })
    .fail(function(){
        console.warn('L27: Could not load services/extras');
    });

// Extras interactions (frequency-style pills)
$('#l27-extras-list').on('click', '.l27-extra-pill-btn', function(e){
    // Don't toggle when clicking quantity buttons
    if ($(e.target).closest('.l27-pill-qty-btn').length) return;
    var $pill = $(this);
    var id = String($pill.data('extra-id'));
    var meta = extrasMetaById[id] || {};
    var currentQty = Number(selectedExtras[id] || 0);

    // Quantity-based extras: clicking the pill should toggle selection and reveal +/-
    if (meta.quantity_based) {
        if (currentQty > 0) {
            delete selectedExtras[id];
            $pill.removeClass('selected');
        } else {
            selectedExtras[id] = 1;
            $pill.addClass('selected');
            $pill.find('.l27-pill-qty-val').text('1');
        }
        syncExtrasHidden();
        updateSummaryExtras();
        updatePrice();
        return;
    }

    if (currentQty > 0) {
        delete selectedExtras[id];
        $pill.removeClass('selected');
    } else {
        selectedExtras[id] = 1;
        $pill.addClass('selected');
    }
    syncExtrasHidden();
    updateSummaryExtras();
    updatePrice();
});



// Keyboard support for extras tiles
$('#l27-extras-list').on('keydown', '.l27-extra-pill-btn', function(e){
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).trigger('click');
    }
});

// Quantity buttons inside pills
$('#l27-extras-list').on('click', '.l27-qty-minus, .l27-qty-plus', function(e){
    e.preventDefault();
    e.stopPropagation();
    var $pill = $(this).closest('.l27-extra-pill-btn');
    var id = String($pill.data('extra-id'));
    var meta = extrasMetaById[id] || {};
    if (!meta.quantity_based) return;
    var v = parseInt(selectedExtras[id], 10) || 1;
    if ($(this).hasClass('l27-qty-minus')) v = Math.max(1, v-1);
    else v = v + 1;
    selectedExtras[id] = v;
    $pill.find('.l27-pill-qty-val').text(String(v));
    syncExtrasHidden();
    updateSummaryExtras();
    updatePrice();
});

// Renzen Klub card toggle
$('#l27-club-toggle').on('click', function(){
    if (!clubExtraId) return;
    clubSelected = !clubSelected;
    renderExtras();           // update card state/button text
    syncExtrasHidden();       // include membership in payload
    updateSummaryExtras();    // extras list (optional extras only)
    updatePrice();            // membership affects totals
});

// Handle m2 input change
    $('#l27-m2-input').on('input change', function() {
        updatePrice();
    });

    // Handle frequency change
    $('input[name="frequency_id"]').on('change', function() {
        console.log('Frequency changed to:', $(this).val());
        
        // Update card selection
        updateCardSelection();
        
        // Update frequency text
        updateFrequencyText();

        // Ensure hidden extras payload reflects recurring vs. oneoff
        syncExtrasHidden();
        
        // Update price
        updatePrice();
    });

    // Initialize frequency text
    updateFrequencyText();

    // Form submission
    $('#l27-booking-form').on('submit', function(e) {
        e.preventDefault();
        
        var m2 = parseInt($('#l27-m2-input').val()) || 0;
        if (m2 < 70) {
            alert('Indtast venligst boligens størrelse (minimum 70 m²).');
            return;
        }

        if (!$('#l27-selected-datetime').val()) {
            alert('Vælg venligst en dato og tid.');
            return;
        }

        $('#l27-submit-button').prop('disabled', true).text('Behandler...');

        if (!stripe) {
            alert('Stripe er ikke konfigureret.');
            $('#l27-submit-button').prop('disabled', false).text('Fortsæt');
            return;
        }

        stripe.createToken(card).then(function(result) {
            if (result.error) {
                $('#stripe-card-errors').text(result.error.message);
                $('#l27-submit-button').prop('disabled', false).text('Fortsæt');
            } else {
                submitBooking(result.token.id);
            }
        });
    });

    

  
  // Custom fields: render option radios as selectable buttons + show 'Andet' input
  $(document).on('change', '.l27-custom-field input[type=radio]', function(){
    var $radio = $(this);
    var $field = $radio.closest('.l27-custom-field');

    // selected class
    $field.find('.l27-custom-btn').removeClass('selected');
    $radio.closest('.l27-custom-btn').addClass('selected');

    // toggle Other input
    var $other = $field.find('.l27-custom-other-input');
    if ($other.length) {
      var showOther = ($radio.data('has-other') == 1);
      if (showOther) {
        $other.show();
        $other.attr('required', true);
      } else {
        $other.val('');
        $other.hide();
        $other.removeAttr('required');
      }
    }
  });

function collectCustomFields(){
    var out = [];
    var $fields = $('.l27-custom-field');
    if (!$fields.length) return out;

    $fields.each(function(){
      var $f = $(this);
      var fieldId = parseInt($f.data('field-id'), 10);
      if (!fieldId) return;
      var mode = String($f.data('field-mode') || 'text');

      if (mode === 'options') {
        var $checked = $f.find('input[type=radio]:checked');
        if (!$checked.length) return;

        var optVal = $checked.val();
        var optId = parseInt(optVal, 10);
        var valueObj = { id: isNaN(optId) ? optVal : optId };

        if ($checked.data('has-other') === 1) {
          var other = ($f.find('.l27-custom-other-input').val() || '').trim();
          if (other) valueObj.other = other;
        }

        out.push({ id: fieldId, values: [ valueObj ] });
      } else {
        var $input = $f.find('input, textarea, select').first();
        var val = ($input.val() || '').trim();
        if (!val) return;
        out.push({ id: fieldId, value: val });
      }
    });

    return out;
  }
function submitBooking(stripeToken) {
        var m2 = $('#l27-m2-input').val();

        var formData = {
            first_name: $('input[name="first_name"]').val(),
            last_name: $('input[name="last_name"]').val(),
            email: $('input[name="email"]').val(),
            phone: $('input[name="phone"]').val(),
            address: $('input[name="address"]').val(),
            city: $('input[name="city"]').val(),
            zip: $('input[name="zip"]').val(),
            frequency_id: $('input[name="frequency_id"]:checked').val(),
            service_date: $('#l27-selected-datetime').val(),
            arrival_window: $('#l27-selected-arrival-window').val() || 0,
            extras_json: $('#l27-extras-json').val() || '[]',
            custom_fields_json: JSON.stringify(collectCustomFields()),
            service_id: serviceId,
            pricing_param_id: pricingParamId,
            pricing_param_quantity: m2,
            stripe_token: stripeToken,
            discount_code: (promoApplied ? promoCode : '')
        };

        $.ajax({
            url: l27_vars.ajax_url,
            type: 'POST',
            data: {
                action: 'l27_submit_booking',
                nonce: l27_vars.nonce,
                form_data: formData
            },
            success: function(response) {
                if (response.success) {
                    $('#l27-booking-form').hide();
                    $('.l27-sidebar').hide();
                    $('.l27-mobile-summary-header').hide();
                    $('.l27-mobile-summary-dropdown').hide();
                    $('#l27-booking-form-container').html('<div class="l27-success-message"><h2>Tak for din bestilling!</h2><p>Vi har modtaget din booking og sender en bekræftelse til din e-mail.</p></div>');
                } else {
                    var errorMsg = response.data.message;
                    if (response.data.details) {
                        console.error('Booking Error Details:', response.data.details);
                    }
                    $('#l27-message').html('<div class="error">' + errorMsg + '</div>');
                    $('#l27-submit-button').prop('disabled', false).text('Fortsæt');
                }
            },
            error: function(xhr, status, error) {
                console.error('Booking Ajax Error:', error);
                $('#l27-message').html('<div class="error">Der opstod en fejl. Prøv venligst igen.</div>');
                $('#l27-submit-button').prop('disabled', false).text('Fortsæt');
            }
        });
    }

    // ===== Promo code UI (summary) =====
    function syncPromoUI() {
        if ($('#l27-promo-input').length === 0) return;
        if (promoApplied && promoCode) {
            $('#l27-promo-input').val(promoCode).prop('disabled', true);
            $('#l27-promo-btn').text('Fjern').addClass('is-remove');
            $('#l27-mobile-promo-input').val(promoCode).prop('disabled', true);
            $('#l27-mobile-promo-btn').text('Fjern').addClass('is-remove');
        } else {
            $('#l27-promo-input').prop('disabled', false);
            $('#l27-promo-btn').text('Tilføj').removeClass('is-remove');
            $('#l27-mobile-promo-input').prop('disabled', false);
            $('#l27-mobile-promo-btn').text('Tilføj').removeClass('is-remove');
        }
    }

    function setPromoMessage(msg, isError) {
        var $m = $('#l27-promo-msg');
        var $mm = $('#l27-mobile-promo-msg');
        if (!msg) { $m.hide(); $mm.hide(); return; }
        $m.text(msg).toggleClass('is-error', !!isError).show();
        $mm.text(msg).toggleClass('is-error', !!isError).show();
    }

    function applyOrRemovePromo(fromMobile) {
        console.log('Promo action', { fromMobile: !!fromMobile, promoApplied: promoApplied, promoCode: promoCode });
        if (!$('#l27-promo-input').length) return;

        if (promoApplied) {
            // Remove promo
            promoApplied = false;
            promoCode = '';
            promoPendingCode = '';
            lastNoPromoBaseTotal = null;
            lastNoPromoSelectedTotal = null;
            setPromoMessage('', false);
            syncPromoUI();
            updatePrice();
            return;
        }

        var code = (fromMobile ? $('#l27-mobile-promo-input').val() : $('#l27-promo-input').val()) || '';
        code = code.trim();
        if (!code) {
            setPromoMessage('Indtast en rabatkode.', true);
            return;
        }

        // Capture baseline totals first (no promo), then re-run with promo in the estimate callback
        promoPendingCode = code;
        promoCapture = true;
        promoApplied = false;
        promoCode = '';
        setPromoMessage('Tjekker rabatkoden…', false);
        syncPromoUI();
        updatePrice();
    }

    $(document).on('click', '#l27-promo-btn', function(){ applyOrRemovePromo(false); });
    $(document).on('click', '#l27-mobile-promo-btn', function(){ applyOrRemovePromo(true); });

    $(document).on('keydown', '#l27-promo-input, #l27-mobile-promo-input', function(e){
        if (e.key === 'Enter') { e.preventDefault(); applyOrRemovePromo($(this).attr('id').indexOf('mobile') !== -1); }
    });

    syncPromoUI();

});