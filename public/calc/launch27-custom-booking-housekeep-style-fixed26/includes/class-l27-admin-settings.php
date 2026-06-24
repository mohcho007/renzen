<?php

class L27_Admin_Settings {
    public function __construct() {
        add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
        add_action( 'admin_init', array( $this, 'register_settings' ) );
    }

    public function add_admin_menu() {
        add_options_page(
            'Launch27 Booking Settings',
            'Launch27 Booking',
            'manage_options',
            'launch27-booking',
            array( $this, 'render_settings_page' )
        );
    }

    public function register_settings() {
        register_setting( 'l27_settings_group', 'l27_subdomain' );
        register_setting( 'l27_settings_group', 'l27_api_key' );
        register_setting( 'l27_settings_group', 'l27_stripe_public_key' );
        register_setting( 'l27_settings_group', 'l27_default_category_id' );
        register_setting( 'l27_settings_group', 'l27_default_service_id' );
        register_setting( 'l27_settings_group', 'l27_default_pricing_param_id' );
    }

    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>Launch27 Booking Settings</h1>
            <form method="post" action="options.php">
                <?php settings_fields( 'l27_settings_group' ); ?>
                <?php do_settings_sections( 'l27_settings_group' ); ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Launch27 Subdomain</th>
                        <td><input type="text" name="l27_subdomain" value="<?php echo esc_attr( get_option( 'l27_subdomain' ) ); ?>" placeholder="e.g. acme-sandbox" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Launch27 API Key (JWT)</th>
                        <td><input type="password" name="l27_api_key" value="<?php echo esc_attr( get_option( 'l27_api_key' ) ); ?>" class="regular-text" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Stripe Public Key</th>
                        <td><input type="text" name="l27_stripe_public_key" value="<?php echo esc_attr( get_option( 'l27_stripe_public_key' ) ); ?>" class="regular-text" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Default Category ID</th>
                        <td><input type="text" name="l27_default_category_id" value="<?php echo esc_attr( get_option( 'l27_default_category_id', '3' ) ); ?>" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Default Service ID</th>
                        <td><input type="text" name="l27_default_service_id" value="<?php echo esc_attr( get_option( 'l27_default_service_id', '180' ) ); ?>" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Default Pricing Param ID (m²)</th>
                        <td><input type="text" name="l27_default_pricing_param_id" value="<?php echo esc_attr( get_option( 'l27_default_pricing_param_id', '53' ) ); ?>" /></td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
            <div class="instructions">
                <h3>How to use</h3>
                <p>Use the shortcode <code>[launch27_booking_form]</code> on any page or post to display the custom booking form.</p>
            </div>
        </div>
        <?php
    }
}
