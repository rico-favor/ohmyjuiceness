<?php
/**
 * Plugin Name: OMJ Brand
 * Description: Enqueues the Oh My Juiceness design system CSS site-wide, plus the staging interaction layer (carousels/lightbox/map) on the staging preview pages.
 * Version: 0.2.0
 */

defined('ABSPATH') || exit;

const OMJ_STAGING_HOME_ID = 526;
const OMJ_STAGING_CONTACT_ID = 530;

// LiteSpeed "Delay JS" holds scripts until first user interaction, which
// leaves the entrance-animation content invisible on first paint. Opt our
// interaction layer out of JS optimization entirely.
add_filter('script_loader_tag', function ($tag, $handle) {
    if (in_array($handle, ['omj-preview', 'omj-map', 'omj-leaflet'], true)) {
        $tag = str_replace('<script ', '<script data-no-optimize="1" ', $tag);
    }
    return $tag;
}, 10, 2);

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

    // Staging interaction layer: entrance animations, carousels, lightbox.
    if (is_page([OMJ_STAGING_HOME_ID, OMJ_STAGING_CONTACT_ID])) {
        $preview = __DIR__ . '/omj-assets/omj-preview.js';
        if (file_exists($preview)) {
            wp_enqueue_script(
                'omj-preview',
                content_url('mu-plugins/omj-assets/omj-preview.js'),
                [],
                filemtime($preview),
                true
            );
        }
    }

    // Leaflet locations map: staging home only.
    if (is_page(OMJ_STAGING_HOME_ID)) {
        wp_enqueue_style(
            'omj-leaflet',
            content_url('mu-plugins/omj-assets/leaflet/leaflet.css'),
            [],
            '1.9.4'
        );
        wp_enqueue_script(
            'omj-leaflet',
            content_url('mu-plugins/omj-assets/leaflet/leaflet.js'),
            [],
            '1.9.4',
            true
        );
        $map = __DIR__ . '/omj-assets/omj-map.js';
        if (file_exists($map)) {
            wp_enqueue_script(
                'omj-map',
                content_url('mu-plugins/omj-assets/omj-map.js'),
                ['omj-leaflet'],
                filemtime($map),
                true
            );
        }
    }

    // Inquiry Type preselect on the contact page (live + staging clone)
    if (is_page([21, OMJ_STAGING_CONTACT_ID])) {
        wp_add_inline_script('jquery', '
document.addEventListener("DOMContentLoaded", function(){
  var p = new URLSearchParams(location.search).get("inquiry");
  if (!p) return;
  var sel = document.querySelector("form.elementor-form select");
  if (!sel) return;
  Array.from(sel.options).forEach(function(o){
    if (o.text.toLowerCase().indexOf(p.toLowerCase()) > -1) {
      sel.value = o.value;
      sel.dispatchEvent(new Event("change", {bubbles: true}));
    }
  });
});
        ');
    }
});
