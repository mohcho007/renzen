<div id="l27-booking-form-container">
    <!-- Mobile Summary Header (collapsible) -->
    <div class="l27-mobile-summary-header">
        <div class="l27-mobile-brand">
            <img class="l27-mobile-logo" src="https://renzen.dk/wp-content/uploads/2024/05/renzen-logo-min.png" alt="Renzen">
        </div>
        <button type="button" class="l27-mobile-summary-toggle" id="l27-toggle-summary" aria-expanded="false">
            <span class="l27-mobile-summary-price" id="l27-mobile-price">- kr</span>
            <span class="l27-toggle-icon">▼</span>
        </button>
    </div>

    <!-- Mobile Summary Dropdown -->
    <div class="l27-mobile-summary-dropdown" id="l27-mobile-summary-dropdown">
        <div class="l27-mobile-summary-content">
            <h3>Booking oversigt</h3>
            
            <div class="l27-summary-row">
                <span class="l27-summary-label">Første rengøring</span>
                <span id="l27-mobile-summary-date" class="l27-summary-value">-</span>
            </div>

            <div class="l27-summary-row">
                <span class="l27-summary-label">Frekvens</span>
                <span id="l27-mobile-summary-frequency" class="l27-summary-value">-</span>
            </div>

            <div class="l27-summary-row">
                <span class="l27-summary-label">Størrelse</span>
                <span id="l27-mobile-summary-m2" class="l27-summary-value">-</span>
            </div>

            <div class="l27-summary-extras" id="l27-mobile-summary-extras-wrap" style="display:none">
                <div class="l27-summary-extras-title">Tilvalg</div>
                <ul id="l27-mobile-summary-extras-list" class="l27-summary-extras-list"></ul>
            </div>


            <hr class="l27-divider">

            <div class="l27-summary-row">
                <span class="l27-summary-label">Subtotal</span>
                <span id="l27-mobile-price-before" class="l27-summary-value">- kr</span>
            </div>

            <div class="l27-summary-row" id="l27-mobile-admin-fee-row">
                <span class="l27-summary-label">Administrationsgebyr</span>
                <span id="l27-mobile-admin-fee" class="l27-summary-value">+5 kr</span>
            </div>

            <div class="l27-summary-row" id="l27-mobile-club-fee-row" style="display:none">
                <span class="l27-summary-label">Renzen Klub</span>
                <span id="l27-mobile-club-fee" class="l27-summary-value">+119 kr</span>
            </div>

            <div class="l27-summary-row">
                <span class="l27-summary-label">Rabat</span>
                <span id="l27-mobile-discount" class="l27-summary-value l27-discount">-</span>
            </div>
            <hr class="l27-divider l27-promo-divider">

            <div class="l27-promo-section" id="l27-mobile-promo-section">
                <div class="l27-promo-title">Rabatkode</div>
                <div class="l27-promo-controls">
                    <input type="text" id="l27-mobile-promo-input" class="l27-promo-input" placeholder="Indtast kode">
                    <button type="button" id="l27-mobile-promo-btn" class="l27-promo-btn">Tilføj</button>
                </div>
                <div id="l27-mobile-promo-msg" class="l27-promo-msg" style="display:none;"></div>

                <div class="l27-summary-row" id="l27-mobile-promo-discount-row" style="display:none;">
                    <span class="l27-summary-label">Promorabat</span>
                    <span class="l27-summary-value l27-discount" id="l27-mobile-promo-discount-amount">-</span>
                </div>
            </div>

            <hr class="l27-divider l27-promo-divider">
<div class="l27-summary-row l27-price-row">
                <span class="l27-summary-label l27-final-price-label">Total per rengøring</span>
                <span id="l27-mobile-final-price" class="l27-summary-value l27-price">- kr</span>
            </div>
        </div>
    </div>

    <div class="l27-main-content">
        <div class="l27-header">
            <h1>Rengøring</h1>
            <div class="l27-badges">
                <span class="l27-badge">Fast månedlig pris</span>
                <span class="l27-badge">Professionelle rengøringsfolk</span>
                <span class="l27-badge">Fleksibel afbestilling</span>
            </div>
        </div>

        <form id="l27-booking-form">
            <input type="hidden" name="service_id" value="<?php echo esc_attr( $default_service_id ); ?>">
            <input type="hidden" name="pricing_param_id" value="<?php echo esc_attr( $default_pricing_param_id ); ?>">

            <!-- Step navigation -->
            <div class="l27-steps-header">
                <div class="l27-steps-progress" role="tablist" aria-label="Trin">
                    <button type="button" class="l27-step-dot active" data-step="1"><span>1</span><em><span class="l27-step-label-full">Dit hjem</span><span class="l27-step-label-short">Pris</span></em></button>
                    <div class="l27-step-line" aria-hidden="true"></div>
                    <button type="button" class="l27-step-dot" data-step="2"><span>2</span><em><span class="l27-step-label-full">Vælg tid</span><span class="l27-step-label-short">Tid</span></em></button>
                    <div class="l27-step-line" aria-hidden="true"></div>
                    <button type="button" class="l27-step-dot" data-step="3"><span>3</span><em><span class="l27-step-label-full">Dine oplysninger</span><span class="l27-step-label-short">Adresse</span></em></button>
                </div>

            </div>

            <div class="l27-step" data-step="1">

            <div class="l27-form-section">
                <h2>Rengøringsinformation</h2>
                
                <div class="l27-field-group">
                    <label for="l27-m2-input">Boligens størrelse (m²)*</label>
                    <input type="number" id="l27-m2-input" name="m2_quantity" min="70" max="200" placeholder="Indtast antal m²" required>
                </div>
            </div>

            <div class="l27-form-section">
                <h2>Hvor ofte?</h2>
                
                <div class="l27-frequency-selector">
                    <!-- Recurring Card - Shows ALL frequencies from API -->
                    <div class="l27-frequency-type-card l27-recurring-card active" id="l27-recurring-card">
                        <span class="l27-best-badge">Best</span>
                        <div class="l27-frequency-type-header">
                            <div class="l27-frequency-type-title">
                                <label>Tilbagevendende</label>
                            </div>
                            <span class="l27-frequency-type-price" id="l27-recurring-price">- kr</span>
                        </div>
                        
                        <div class="l27-frequency-benefits">
                            <div class="l27-benefit-item">
                                <span class="l27-benefit-title">Den rene følelse på repeat</span>
                                <span class="l27-benefit-desc">Få en 5-stjernet rengøring på samme tid hver uge eller hver anden uge.</span>
                            </div>
                            <div class="l27-benefit-item">
                                <span class="l27-benefit-title">Behold din foretrukne rengøringsassistent</span>
                                <span class="l27-benefit-desc">Få den samme dygtige rengøringsassistent hver gang.</span>
                            </div>
                            <div class="l27-benefit-item">
                                <span class="l27-benefit-title">Fleksibelt & uforpligtende</span>
                                <span class="l27-benefit-desc">Spring over, flyt eller annuller når som helst - ingen binding.</span>
                            </div>
                        </div>

                        <!-- Recurring frequencies - 2 rows layout -->
                        <div class="l27-frequency-options l27-frequency-grid" id="l27-recurring-options">
                            <?php 
                            if ( ! empty( $frequencies ) ) {
                                $recurring_freqs = array();
                                $oneoff_freqs = array();
                                
                                // Separate recurring from one-off
                                foreach ( $frequencies as $freq ) {
                                    $name_lower = strtolower($freq['name']);
                                    if (strpos($name_lower, 'engang') !== false || strpos($name_lower, 'one') !== false || strpos($name_lower, 'single') !== false) {
                                        $oneoff_freqs[] = $freq;
                                    } else {
                                        $recurring_freqs[] = $freq;
                                    }
                                }
                                
                                // Display recurring frequencies
                                $first = true;
                                foreach ( $recurring_freqs as $freq ) {
                                    $discount = isset($freq['discount']) ? floatval($freq['discount']) : 0;
                                    $is_selected = $first;
                                    $first = false;
                                    ?>
                                    <label class="l27-freq-option <?php echo $is_selected ? 'selected' : ''; ?>">
                                        <input type="radio" name="frequency_id" value="<?php echo esc_attr( $freq['id'] ); ?>" <?php echo $is_selected ? 'checked' : ''; ?> data-discount="<?php echo esc_attr( $discount ); ?>" data-name="<?php echo esc_attr( $freq['name'] ); ?>" data-type="recurring">
                                        <span class="l27-freq-option-text"><?php echo esc_html( $freq['name'] ); ?></span>
                                    </label>
                                    <?php
                                }
                            }
                            ?>
                        </div>
                    </div>

                    <!-- One-off Card -->
                    <div class="l27-frequency-type-card l27-oneoff-card" id="l27-oneoff-card">
                        <div class="l27-frequency-type-header">
                            <div class="l27-frequency-type-title">
                                <label>Engangs</label>
                            </div>
                            <span class="l27-frequency-type-price" id="l27-oneoff-price">- kr</span>
                        </div>
                        
                        <div class="l27-frequency-benefits">
                            <div class="l27-benefit-item">
                                <span class="l27-benefit-title">Perfekt til dybderengøring</span>
                                <span class="l27-benefit-desc">Ideel til større rengøringer der kræver ekstra tid.</span>
                            </div>
                            <div class="l27-benefit-item">
                                <span class="l27-benefit-title">Rengøring på efterspørgsel</span>
                                <span class="l27-benefit-desc">Få en rengøring når det passer dig.</span>
                            </div>
                        </div>

                        <!-- One-off frequencies -->
                        <div class="l27-frequency-options" id="l27-oneoff-options">
                            <?php 
                            if ( ! empty( $frequencies ) ) {
                                $oneoff_freqs = array();
                                
                                // Separate one-off frequencies
                                foreach ( $frequencies as $freq ) {
                                    $name_lower = strtolower($freq['name']);
                                    if (strpos($name_lower, 'engang') !== false || strpos($name_lower, 'one') !== false || strpos($name_lower, 'single') !== false) {
                                        $oneoff_freqs[] = $freq;
                                    }
                                }
                                
                                // Display one-off frequencies
                                if (empty($oneoff_freqs)) {
                                    // Fallback: show first frequency if no one-off found
                                    $oneoff_freqs = array_slice($frequencies, 0, 1);
                                }
                                
                                foreach ( $oneoff_freqs as $freq ) {
                                    $discount = isset($freq['discount']) ? floatval($freq['discount']) : 0;
                                    ?>
                                    <label class="l27-freq-option">
                                        <input type="radio" name="frequency_id" value="<?php echo esc_attr( $freq['id'] ); ?>" data-discount="<?php echo esc_attr( $discount ); ?>" data-name="<?php echo esc_attr( $freq['name'] ); ?>" data-type="oneoff">
                                        <span class="l27-freq-option-text"><?php echo esc_html( $freq['name'] ); ?></span>
                                    </label>
                                    <?php
                                }
                            }
                            ?>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Extras: placed AFTER frequencies and BEFORE date selection -->
            <div class="l27-form-section" id="l27-extras-section">
                <h2>Tilvalg</h2>
                <p class="l27-section-subtitle">Vælg ekstra ydelser til din rengøring.</p>

                <div id="l27-club-card" class="l27-club-card" style="display:none">
                    <div class="l27-club-card-head">
                        <div class="l27-club-card-title">Renzen Klub</div>
                        <div class="l27-club-card-price" id="l27-club-price">+119 kr/md</div>
                    </div>
                    <div class="l27-club-card-body">
                        <ul>
                            <li>Spar på faste rengøringer</li>
                            <li>Brug Zen-kreditter på flere services</li>
                            <li>Kan opsiges når som helst</li>
                        </ul>
                        <button type="button" class="l27-club-toggle" id="l27-club-toggle">Tilføj medlemskab</button>
                    </div>
                </div>

                <div id="l27-extras-list" class="l27-extras-pills"></div>
                <input type="hidden" id="l27-extras-json" name="extras_json" value="[]">
            </div>

            </div><!-- /step 1 -->

            <div class="l27-step" data-step="2" style="display:none">
            <div class="l27-form-section">
                <h2>Hvornår skal vi komme?</h2>
                
                <div class="l27-date-time-wrapper">
                    <div class="l27-calendar-container">
                        <div class="l27-open-calendar" id="l27-open-calendar"></div>
                        <input type="hidden" id="l27-selected-date" name="booking_date" required>
                    </div>

                    <div class="l27-field-group">
                        <label id="l27-times-label">Ledige tider</label>
                        <div id="l27-time-slots" class="l27-time-grid">
                            <p class="l27-hint">Vælg en dato for at se ledige tider</p>
                        </div>
                        <input type="hidden" id="l27-selected-datetime" name="service_date">
                        <input type="hidden" id="l27-selected-arrival-window" name="arrival_window">
                    </div>
                </div>

                <?php if (!empty($custom_fields) && is_array($custom_fields)): ?>
                  <div class="l27-custom-fields">
                    <?php foreach ($custom_fields as $cf):
                      $cf_id = isset($cf['id']) ? (int)$cf['id'] : 0;
                      if (!$cf_id) continue;

                      $cf_label = isset($cf['label']) ? (string)$cf['label'] : (isset($cf['name']) ? (string)$cf['name'] : '');
                      $cf_required = !empty($cf['required']) || !empty($cf['value_required']);

                      $cf_options = [];
                      foreach (['values','options','choices','field_values','select_values'] as $k) {
                        if (isset($cf[$k]) && is_array($cf[$k]) && count($cf[$k])) { $cf_options = $cf[$k]; break; }
                      }
                      $has_options = is_array($cf_options) && count($cf_options) > 0;
                    ?>

                    <div class="l27-field-group l27-custom-field" data-field-id="<?php echo esc_attr($cf_id); ?>" data-field-mode="<?php echo $has_options ? 'options' : 'text'; ?>">
                      <label><?php echo esc_html($cf_label); ?><?php if ($cf_required) echo ' *'; ?></label>

                      <?php if ($has_options): ?>
                        <div class="l27-custom-options">
                          <?php foreach ($cf_options as $opt):
                            $opt_id = '';
                            $opt_label = '';
                            if (is_array($opt)) {
                              $opt_id = isset($opt['id']) ? $opt['id'] : (isset($opt['value']) ? $opt['value'] : '');
                              $opt_label = isset($opt['label']) ? $opt['label'] : (isset($opt['name']) ? $opt['name'] : (isset($opt['value']) ? $opt['value'] : ''));
                            } else {
                              $opt_id = $opt;
                              $opt_label = $opt;
                            }
                            $opt_label_str = (string)$opt_label;
                            $is_other = (mb_strtolower($opt_label_str) === 'andet' || mb_strtolower($opt_label_str) === 'other');
                          ?>
                            <label class="l27-custom-btn">
                              <input type="radio" name="l27_custom_field_<?php echo esc_attr($cf_id); ?>" value="<?php echo esc_attr($opt_id); ?>" data-has-other="<?php echo $is_other ? '1' : '0'; ?>">
                              <span><?php echo esc_html($opt_label_str); ?></span>
                            </label>
                          <?php endforeach; ?>

                          <input type="text" class="l27-custom-other-input" placeholder="Skriv her..." style="display:none" />
                        </div>
                      <?php else: ?>
                        <input type="text" name="l27_custom_field_text_<?php echo esc_attr($cf_id); ?>" />
                      <?php endif; ?>
                    </div>

                    <?php endforeach; ?>
                  </div>
                <?php endif; ?>

            </div>

            </div><!-- /step 2 -->

            <div class="l27-step" data-step="3" style="display:none">
            <div class="l27-form-section">
                <h2>Dine oplysninger</h2>
                
                <div class="l27-field-row">
                    <div class="l27-field-group">
                        <label for="l27-first-name">Fornavn*</label>
                        <input type="text" id="l27-first-name" name="first_name" required>
                    </div>
                    <div class="l27-field-group">
                        <label for="l27-last-name">Efternavn*</label>
                        <input type="text" id="l27-last-name" name="last_name" required>
                    </div>
                </div>

                <div class="l27-field-row">
                    <div class="l27-field-group">
                        <label for="l27-email">E-mail*</label>
                        <input type="email" id="l27-email" name="email" required>
                    </div>
                    <div class="l27-field-group">
                        <label for="l27-phone">Telefon*</label>
                        <input type="text" id="l27-phone" name="phone" required>
                    </div>
                </div>

                <div class="l27-field-group">
                    <label for="l27-address">Adresse*</label>
                    <input type="text" id="l27-address" name="address" required>
                </div>

                <div class="l27-field-row">
                    <div class="l27-field-group">
                        <label for="l27-zip">Postnummer*</label>
                        <input type="text" id="l27-zip" name="zip" required>
                    </div>
                    <div class="l27-field-group">
                        <label for="l27-city">By*</label>
                        <input type="text" id="l27-city" name="city" required>
                    </div>
                </div>
            </div>

            <div class="l27-form-section">
                <h2>Betaling</h2>
                <div id="stripe-card-element"></div>
                <div id="stripe-card-errors" role="alert"></div>
            </div>

            </div><!-- /step 3 -->

            <button type="submit" id="l27-submit-button" style="display:none">Book nu</button>
            <div class="l27-steps-footer">
                <button type="button" class="l27-step-btn" id="l27-step-back" disabled>Tilbage</button>
                <button type="button" class="l27-step-btn l27-step-btn-primary" id="l27-step-next">Næste</button>
            </div>



        </form>
    </div>

<aside class="l27-sidebar">
        <div class="l27-summary-card">
            <h3>Booking oversigt</h3>
            
            <div class="l27-summary-row">
                <span class="l27-summary-label">Første rengøring</span>
                <span id="l27-summary-date" class="l27-summary-value">-</span>
            </div>

            <div class="l27-summary-row">
                <span class="l27-summary-label">Frekvens</span>
                <span id="l27-summary-frequency" class="l27-summary-value">-</span>
            </div>

            <div class="l27-summary-row">
                <span class="l27-summary-label">Størrelse</span>
                <span id="l27-summary-m2" class="l27-summary-value">-</span>
            </div>


            <div class="l27-summary-extras" id="l27-summary-extras-wrap" style="display:none">
                <div class="l27-summary-extras-title">Tilvalg</div>
                <ul id="l27-summary-extras-list" class="l27-summary-extras-list"></ul>
            </div>

            <hr class="l27-divider">

            <div class="l27-summary-row">
                <span class="l27-summary-label">Subtotal</span>
                <span id="l27-price-before" class="l27-summary-value">- kr</span>
            </div>

            <!-- Mandatory fee (hidden from the extras UI, but always charged) -->
            <div class="l27-summary-row" id="l27-admin-fee-row">
                <span class="l27-summary-label">Administrationsgebyr</span>
                <span id="l27-admin-fee" class="l27-summary-value">+5 kr</span>
            </div>

            <!-- Optional membership (shown when selected) -->
            <div class="l27-summary-row" id="l27-club-fee-row" style="display:none">
                <span class="l27-summary-label">Renzen Klub</span>
                <span id="l27-club-fee" class="l27-summary-value">+119 kr</span>
            </div>

            <div class="l27-summary-row">
                <span class="l27-summary-label">Rabat</span>
                <span id="l27-discount" class="l27-summary-value l27-discount">-</span>
            </div>

            <hr class="l27-divider l27-promo-divider">

            <div class="l27-promo-section" id="l27-promo-section">
                <div class="l27-promo-title">Rabatkode</div>
                <div class="l27-promo-controls">
                    <input type="text" id="l27-promo-input" class="l27-promo-input" placeholder="Indtast kode">
                    <button type="button" id="l27-promo-btn" class="l27-promo-btn">Tilføj</button>
                </div>
                <div id="l27-promo-msg" class="l27-promo-msg" style="display:none;"></div>

                <div class="l27-summary-row" id="l27-promo-discount-row" style="display:none;">
                    <span class="l27-summary-label">Promorabat</span>
                    <span class="l27-summary-value l27-discount" id="l27-promo-discount-amount">-</span>
                </div>
            </div>

            <hr class="l27-divider l27-promo-divider">

            <hr class="l27-divider">

            <div class="l27-summary-row l27-price-row">
                <span class="l27-summary-label l27-final-price-label">Total per rengøring</span>
                <span id="l27-total-price" class="l27-summary-value l27-price">- kr</span>
            </div>

            <div id="l27-message"></div>
        </div>
    </aside>
</div>