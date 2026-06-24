<?php
/**
 * Plugin Name: Launch27 Custom Booking Form
 * Description: A custom booking form for Launch27 that replaces the iframe with a native API-driven form.
 * Version: 1.1.2
 * Author: Manus
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'L27_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'L27_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once L27_PLUGIN_DIR . 'includes/class-l27-api-client.php';
require_once L27_PLUGIN_DIR . 'includes/class-l27-form-renderer.php';
require_once L27_PLUGIN_DIR . 'includes/class-l27-admin-settings.php';

class Launch27_Custom_Booking {
    public function __construct() {
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
        new L27_Admin_Settings();
        new L27_Form_Renderer();
    }

    public function enqueue_assets() {
        // Use file modification time as version to avoid browser/edge caches during rapid iteration.
        $css_rel = 'assets/css/l27-form.css';
        $js_rel  = 'assets/js/l27-form.js';
        $css_path = L27_PLUGIN_DIR . $css_rel;
        $js_path  = L27_PLUGIN_DIR . $js_rel;
        $css_ver  = file_exists( $css_path ) ? filemtime( $css_path ) : time();
        $js_ver   = file_exists( $js_path ) ? filemtime( $js_path ) : time();

        wp_enqueue_style( 'l27-form-style', L27_PLUGIN_URL . $css_rel, array(), $css_ver );
        wp_enqueue_script( 'stripe-js', 'https://js.stripe.com/v3/', array(), null, true );
        wp_enqueue_script( 'l27-form-script', L27_PLUGIN_URL . $js_rel, array( 'jquery' ), $js_ver, true );

        $stripe_key = get_option( 'l27_stripe_public_key' );
        $subdomain = get_option( 'l27_subdomain' );
        
        wp_localize_script( 'l27-form-script', 'l27_vars', array(
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'stripe_public_key' => $stripe_key ? $stripe_key : '',
            'subdomain' => $subdomain ? $subdomain : '',
            'nonce' => wp_create_nonce( 'l27_booking_nonce' )
        ) );
    }
}

new Launch27_Custom_Booking();
