<?php

class L27_API_Client {
    private $subdomain;
    private $api_key;
    private $base_url;

    public function __construct() {
        $this->subdomain = get_option( 'l27_subdomain' );
        $this->api_key = get_option( 'l27_api_key' );
        $this->base_url = "https://{$this->subdomain}.launch27.com/v1/";
    }

    public function get( $endpoint, $params = array() ) {
        $url = $this->base_url . $endpoint;
        if ( ! empty( $params ) ) {
            $url = add_query_arg( $params, $url );
        }

        $response = wp_remote_get( $url, array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type'  => 'application/json',
            ),
        ) );

        if ( is_wp_error( $response ) ) {
            error_log( 'L27 API GET Error: ' . $response->get_error_message() );
            return $response;
        }

        return json_decode( wp_remote_retrieve_body( $response ), true );
    }

    public function post( $endpoint, $data = array() ) {
        $url = $this->base_url . $endpoint;

        $response = wp_remote_post( $url, array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type'  => 'application/json',
                'Accept'        => 'application/json',
            ),
            'body' => json_encode( $data ),
        ) );

        if ( is_wp_error( $response ) ) {
            error_log( 'L27 API POST Error: ' . $response->get_error_message() );
            return $response;
        }

        $body = wp_remote_retrieve_body( $response );
        $decoded = json_decode( $body, true );

        if ( empty( $decoded ) && ! empty( $body ) ) {
            error_log( 'L27 API Decode Error. Body: ' . $body );
        }

        return $decoded;
    }
}
