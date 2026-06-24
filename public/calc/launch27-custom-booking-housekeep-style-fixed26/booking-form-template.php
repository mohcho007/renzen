<div id="l27-booking-form-container">
    <!-- Mobile Summary Header (collapsible) -->
    <div class="l27-mobile-summary-header">
        <span class="l27-mobile-summary-price" id="l27-mobile-price">- kr</span>
        <button type="button" class="l27-mobile-summary-toggle" id="l27-toggle-summary">
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

            <hr class="l27-divider">

            <div class="l27-summary-row">
                <span class="l27-summary-label">Pris før rabat</span>
                <span id="l27-mobile-price-before" class="l27-summary-value">- kr</span>
            </div>

            <div class="l27-summary-row">
                <span class="l27-summary-label">Rabat</span>
                <span id="l27-mobile-discount" class="l27-summary-value l27-discount">-</span>
            </div>

            <div class="l27-summary-row">
                <span class="l27-summary-label">Fradrag (26%)</span>
                <span id="l27-mobile-fradrag" class="l27-summary-value l27-fradrag">- kr</span>
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
<div class="l27-summary-row l27-price-row">
                <span class="l27-summary-label l27-final-price-label">Din pris efter rabat og fradrag</span>
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

                        <!-- ALL frequencies from API displayed here -->
                        <div class="l27-frequency-options" id="l27-frequency-options">
                            <?php if ( ! empty( $frequencies ) ) : ?>
                                <?php 
                                $first = true;
                                foreach ( $frequencies as $freq ) : 
                                    // Check if this should be pre-selected (biweekly or first one)
                                    $is_biweekly = (stripos($freq['name'], '2') !== false || stripos($freq['name'], 'hver anden') !== false || stripos($freq['name'], 'hver 2') !== false);
                                    $is_selected = $is_biweekly || ($first && !$is_biweekly);
                                    if ($is_biweekly) $first = false; // If we found biweekly, don't select first
                                    
                                    // Get discount from frequency data
                                    $discount = isset($freq['discount']) ? floatval($freq['discount']) : 0;
                                ?>
                                    <label class="l27-freq-option <?php echo $is_selected && $is_biweekly ? 'selected' : ''; ?>">
                                        <input type="radio" name="frequency_id" value="<?php echo esc_attr( $freq['id'] ); ?>" <?php echo $is_selected && $is_biweekly ? 'checked' : ''; ?> data-discount="<?php echo esc_attr( $discount ); ?>" data-name="<?php echo esc_attr( $freq['name'] ); ?>">
                                        <span class="l27-freq-option-text"><?php echo esc_html( $freq['name'] ); ?></span>
                                    </label>
                                <?php 
                                    if (!$is_biweekly) $first = false;
                                endforeach; 
                                ?>
                                <?php 
                                // If no biweekly was found, select the first one
                                $has_biweekly = false;
                                foreach ($frequencies as $freq) {
                                    if (stripos($freq['name'], '2') !== false || stripos($freq['name'], 'hver anden') !== false || stripos($freq['name'], 'hver 2') !== false) {
                                        $has_biweekly = true;
                                        break;
                                    }
                                }
                                ?>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>

            <div class="l27-form-section">
                <h2>Hvornår skal vi komme?</h2>
                
                <div class="l27-field-group">
                    <label for="l27-date-picker">Vælg dato*</label>
                    <input type="date" id="l27-date-picker" name="booking_date" required min="<?php echo date('Y-m-d'); ?>">
                </div>

                <div class="l27-field-group">
                    <label>Vælg tidspunkt*</label>
                    <div id="l27-time-slots" class="l27-time-grid">
                        <p class="l27-hint">Vælg en dato for at se ledige tider</p>
                    </div>
                    <input type="hidden" id="l27-selected-datetime" name="service_date">
                    <input type="hidden" id="l27-selected-arrival-window" name="arrival_window">
                </div>
            </div>

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

            <button type="submit" id="l27-submit-button">Fortsæt</button>
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

            <hr class="l27-divider">

            <div class="l27-summary-row">
                <span class="l27-summary-label">Pris før rabat</span>
                <span id="l27-price-before" class="l27-summary-value">- kr</span>
            </div>

            <div class="l27-summary-row">
                <span class="l27-summary-label">Rabat</span>
                <span id="l27-discount" class="l27-summary-value l27-discount">-</span>
            </div>

            <div class="l27-summary-row">
                <span class="l27-summary-label">Fradrag (26%)</span>
                <span id="l27-fradrag" class="l27-summary-value l27-fradrag">- kr</span>
            </div>

            <hr class="l27-divider">

            <div class="l27-summary-row l27-price-row">
                <span class="l27-summary-label l27-final-price-label">Din pris efter rabat og fradrag</span>
                <span id="l27-total-price" class="l27-summary-value l27-price">- kr</span>
            </div>

            <div id="l27-message"></div>
        </div>
    </aside>
</div>
