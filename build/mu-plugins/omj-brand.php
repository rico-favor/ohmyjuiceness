<?php
/**
 * Plugin Name: OMJ Brand
 * Description: Enqueues the Oh My Juiceness design system CSS site-wide.
 * Version: 0.1.0
 */

defined('ABSPATH') || exit;

add_action('wp_enqueue_scripts', function () {
    $css = __DIR__ . '/omj-assets/omj-brand.css';
    if (file_exists($css)) {
        wp_enqueue_style(
            'omj-brand',
            content_url('mu-plugins/omj-assets/omj-brand.css'),
            [],
            filemtime($css)
        );
    }
});
