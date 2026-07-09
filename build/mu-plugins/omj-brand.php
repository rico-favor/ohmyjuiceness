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

    // Inquiry Type preselect on the contact page
    if (is_page(21)) {
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
