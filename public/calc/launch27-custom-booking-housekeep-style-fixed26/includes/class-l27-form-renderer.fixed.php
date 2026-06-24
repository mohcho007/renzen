<?php

class L27_Form_Renderer {
    public function __construct() {
        add_shortcode( 'launch27_booking_form', array( $this, 'render_shortcode' ) );
        add_action( 'wp_ajax_l27_submit_booking', array( $this, 'handle_booking_submission' ) );
        add_action( 'wp_ajax_nopriv_l27_submit_booking', array( $this, 'handle_booking_submission' ) );
        add_action( 'wp_ajax_l27_estimate_price', array( $this, 'handle_price_estimation' ) );
        add_action( 'wp_ajax_nopriv_l27_estimate_price', array( $this, 'handle_price_estimation' ) );
        add_action( 'wp_ajax_l27_get_services', array( $this, 'handle_get_services' ) );
        add_action( 'wp_ajax_nopriv_l27_get_services', array( $this, 'handle_get_services' ) );

        add_action( 'wp_ajax_l27_get_spots', array( $this, 'handle_get_spots' ) );
        add_action( 'wp_ajax_nopriv_l27_get_spots', array( $this, 'handle_get_spots' ) );
    }

    public function render_shortcode() {
        $api = new L27_API_Client();
        
        $services = $api->get( 'booking/services' );
        $frequencies = $api->get( 'booking/frequencies' );
        $custom_fields = $api->get( 'booking/custom_fields' );

        $default_service_id = get_option( 'l27_default_service_id', '180' );
        $default_pricing_param_id = get_option( 'l27_default_pricing_param_id', '53' );

        $target_service = null;
        if ( ! empty( $services ) ) {
            foreach ( $services as $service ) {
                if ( $service['id'] == $default_service_id ) {
                    $target_service = $service;
                    break;
                }
            }
        }

        ob_start();
        include L27_PLUGIN_DIR . 'templates/booking-form-template.php';
        return ob_get_clean();
    }

    public function handle_price_estimation() {
        check_ajax_referer( 'l27_booking_nonce', 'nonce' );
        $api = new L27_API_Client();
        
        $service_id = intval( $_POST['service_id'] );
        $pricing_param_id = intval( $_POST['pricing_param_id'] );
        $pricing_param_quantity = intval( $_POST['pricing_param_quantity'] );
        
        $extras_json = isset($_POST['extras_json']) ? wp_unslash($_POST['extras_json']) : '[]';
        $extras = json_decode($extras_json, true);
        if (!is_array($extras)) { $extras = array(); }
$frequency_id = intval( $_POST['frequency_id'] );
        $service_date = sanitize_text_field( $_POST['service_date'] );

        // Build the correct API payload format
        $payload = array(
            'service_date' => $service_date,
            'frequency_id' => $frequency_id,
            'services'     => array(
                array(
                    'id' => $service_id,
                    'pricing_parameters' => array(
                        array(
                            'id' => $pricing_param_id,
                            'quantity' => $pricing_param_quantity
                        )
                    ),
                    'extras' => $this->sanitize_extras($extras)
                )
            )
        );

        error_log( 'L27 Price Estimation Request: ' . json_encode( $payload ) );

        $response = $api->post( 'booking/estimate_price', $payload );

        error_log( 'L27 Price Estimation Response: ' . json_encode( $response ) );

        wp_send_json( $response );
    }

    public function handle_get_spots() {
        check_ajax_referer( 'l27_booking_nonce', 'nonce' );
        $api = new L27_API_Client();
        
        $date = sanitize_text_field( $_POST['date'] );
        // Allow client to request more than 7 days (used by the open calendar UI).
        $days = isset($_POST['days']) ? intval($_POST['days']) : 7;
        if ($days < 1) $days = 7;
        if ($days > 42) $days = 42; // safety cap
        
        // Build the correct API payload format
        $payload = array(
            'date' => $date,
            'days' => $days,
            'mode' => 'new'
        );

        error_log( 'L27 Spots Request: ' . json_encode( $payload ) );

        $response = $api->post( 'booking/spots', $payload );

        error_log( 'L27 Spots Response: ' . json_encode( $response ) );

        wp_send_json( $response );
    }

    public function handle_booking_submission() {
        check_ajax_referer( 'l27_booking_nonce', 'nonce' );

        $api = new L27_API_Client();
        $form_data = $_POST['form_data'];
        
        $service_id = intval( $form_data['service_id'] );
        $pricing_param_id = intval( $form_data['pricing_param_id'] );
        $pricing_param_quantity = intval( $form_data['pricing_param_quantity'] );

        
        $extras = array();
        if (isset($form_data['extras_json'])) {
            $extras_json = wp_unslash($form_data['extras_json']);
            $decoded = json_decode($extras_json, true);
            if (is_array($decoded)) { $extras = $decoded; }
        }
$booking_payload = array(
            'user' => array(
                'email'      => sanitize_email( $form_data['email'] ),
                'first_name' => sanitize_text_field( $form_data['first_name'] ),
                'last_name'  => sanitize_text_field( $form_data['last_name'] ),
            ),
            'address'        => sanitize_text_field( $form_data['address'] ),
            'city'           => sanitize_text_field( $form_data['city'] ),
            'zip'            => sanitize_text_field( $form_data['zip'] ),
            'phone'          => sanitize_text_field( $form_data['phone'] ),
            'frequency_id'   => intval( $form_data['frequency_id'] ),
            'service_date'   => sanitize_text_field( $form_data['service_date'] ),
            'arrival_window' => intval( $form_data['arrival_window'] ),
            'services'       => array(
                array(
                    'id' => $service_id,
                    'pricing_parameters' => array(
                        array(
                            'id' => $pricing_param_id,
                            'quantity' => $pricing_param_quantity
                        )
                    ),
                    'extras' => $this->sanitize_extras($extras)
                )
            ),
            'payment_method' => 'stripe',
            'stripe_token'   => sanitize_text_field( $form_data['stripe_token'] ),
        );

        $response = $api->post( 'booking', $booking_payload );

        if ( isset( $response['id'] ) ) {
            wp_send_json_success( array( 'message' => 'Booking created successfully!', 'booking_id' => $response['id'] ) );
        } else {
            wp_send_json_error( array( 'message' => 'Error creating booking.', 'details' => $response ) );
        }
    }



    public function handle_get_services() {
        check_ajax_referer( 'l27_booking_nonce', 'nonce' );
        $api = new L27_API_Client();

        // Cache services for 10 minutes to reduce API load
        $cache_key = 'l27_services_cache_v1';
        $cached = get_transient( $cache_key );
        if ( $cached ) {
            wp_send_json_success( $cached );
        }

        $response = $api->get( 'booking/services' );
        if ( is_array( $response ) ) {
            set_transient( $cache_key, $response, 10 * MINUTE_IN_SECONDS );
            wp_send_json_success( $response );
        }

        wp_send_json_error( array( 'message' => 'Could not fetch services', 'details' => $response ) );
    }

    private function sanitize_extras( $extras ) {
        $out = array();
        if ( ! is_array( $extras ) ) {
            return $out;
        }

        foreach ( $extras as $ex ) {
            if ( ! is_array( $ex ) ) {
                continue;
            }

            $id = isset( $ex['id'] ) ? intval( $ex['id'] ) : 0;
            if ( $id <= 0 ) {
                continue;
            }

            $qty = isset( $ex['quantity'] ) ? intval( $ex['quantity'] ) : 1;
            if ( $qty <= 0 ) {
                $qty = 1;
            }

            $rec = isset( $ex['recurring'] ) ? (bool) $ex['recurring'] : false;

            $item = array(
                'id'        => $id,
                'quantity'  => $qty,
                'recurring' => $rec,
            );

            if ( isset( $ex['other'] ) && $ex['other'] !== '' ) {
                $item['other'] = sanitize_text_field( $ex['other'] );
            }

            $out[] = $item;
        }

        return $out;
    }
}
