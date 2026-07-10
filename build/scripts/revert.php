<?php
/**
 * Revert script: Restore all pages and templates to pre-revision state.
 * Run with: wp eval-file ~/revert.php
 */

echo "=== REVERTING LIVE SITE ===\n\n";

// 1. Restore Home page (ID 35) — was raw HTML in post_content, NOT Elementor
$rev_id = 479;
$home_rev = wp_get_post_revision($rev_id);
if ($home_rev) {
    wp_update_post([
        'ID'           => 35,
        'post_content' => $home_rev->post_content,
    ]);
    // Clear the Elementor data we added
    delete_post_meta(35, '_elementor_data');
    delete_post_meta(35, '_elementor_edit_mode');
    delete_post_meta(35, '_elementor_version');
    delete_post_meta(35, '_elementor_element_cache');
    delete_post_meta(35, '_elementor_controls_usage');
    delete_post_meta(35, '_elementor_css');
    // Re-enable comments
    wp_update_post(['ID' => 35, 'comment_status' => 'open']);
    echo "1. Home (35) restored from revision 479 (" . strlen($home_rev->post_content) . " chars post_content)\n";
} else {
    echo "1. ERROR: Could not find home revision 479\n";
}

// 2. Restore About page (ID 25) — was Elementor
$rev_id = 456;
$about_rev = wp_get_post_revision($rev_id);
if ($about_rev) {
    $about_data = get_post_meta(456, '_elementor_data', true);
    wp_update_post(['ID' => 25, 'post_content' => $about_rev->post_content]);
    if ($about_data) {
        update_post_meta(25, '_elementor_data', wp_slash($about_data));
    }
    delete_post_meta(25, '_elementor_element_cache');
    delete_post_meta(25, '_elementor_controls_usage');
    delete_post_meta(25, '_elementor_css');
    echo "2. About (25) restored from revision 456\n";
} else {
    echo "2. ERROR: Could not find about revision 456\n";
}

// 3. Restore Contact page (ID 21) — was Elementor
$rev_id = 468;
$contact_rev = wp_get_post_revision($rev_id);
if ($contact_rev) {
    $contact_data = get_post_meta(468, '_elementor_data', true);
    wp_update_post(['ID' => 21, 'post_content' => $contact_rev->post_content]);
    if ($contact_data) {
        update_post_meta(21, '_elementor_data', wp_slash($contact_data));
    }
    delete_post_meta(21, '_elementor_element_cache');
    delete_post_meta(21, '_elementor_controls_usage');
    delete_post_meta(21, '_elementor_css');
    echo "3. Contact (21) restored from revision 468\n";
} else {
    echo "3. ERROR: Could not find contact revision 468\n";
}

// 4. Restore Header template (ID 79)
$header_rev_data = get_post_meta(342, '_elementor_data', true);
if ($header_rev_data) {
    update_post_meta(79, '_elementor_data', wp_slash($header_rev_data));
    delete_post_meta(79, '_elementor_element_cache');
    delete_post_meta(79, '_elementor_controls_usage');
    delete_post_meta(79, '_elementor_css');
    echo "4. Header (79) _elementor_data restored from revision 342\n";
} else {
    echo "4. ERROR: Could not find header revision data\n";
}

// 5. Restore Footer template (ID 241)
$footer_rev_data = get_post_meta(470, '_elementor_data', true);
if ($footer_rev_data) {
    update_post_meta(241, '_elementor_data', wp_slash($footer_rev_data));
    delete_post_meta(241, '_elementor_element_cache');
    delete_post_meta(241, '_elementor_controls_usage');
    delete_post_meta(241, '_elementor_css');
    echo "5. Footer (241) _elementor_data restored from revision 470\n";
} else {
    echo "5. ERROR: Could not find footer revision data\n";
}

// 6. Revert Elementor Kit green from #167A45 back to #2D8762
$settings = get_post_meta(9, '_elementor_page_settings', true);
if (is_array($settings)) {
    $changed = false;
    if (isset($settings['custom_colors']) && is_array($settings['custom_colors'])) {
        foreach ($settings['custom_colors'] as &$color) {
            if (isset($color['_id']) && $color['_id'] === 'dcf100f' && $color['color'] === '#167A45') {
                $color['color'] = '#2D8762';
                $changed = true;
            }
        }
    }
    if (isset($settings['system_colors']) && is_array($settings['system_colors'])) {
        foreach ($settings['system_colors'] as &$color) {
            if (isset($color['_id']) && $color['_id'] === 'accent' && $color['color'] === '#167A45') {
                $color['color'] = '#2D8762';
                $changed = true;
            }
        }
    }
    if ($changed) {
        update_post_meta(9, '_elementor_page_settings', $settings);
        echo "6. Elementor Kit green reverted to #2D8762\n";
    } else {
        echo "6. Kit green already at #2D8762 (no change needed)\n";
    }
}

// 7. Clear all caches
\Elementor\Plugin::$instance->files_manager->clear_cache();
echo "7. Elementor file cache cleared\n";

echo "\n=== REVERT COMPLETE ===\n";
echo "Note: Deleted templates (326 Order Now popup, 155 Coming After Summer, 313 Contact Us Popup) were force-deleted and cannot be restored from revisions.\n";
echo "If those are needed, they must be recreated manually in Elementor.\n";
