<?php
/**
 * Plugin Name: OMJ Build Helpers
 * Description: Build/deploy helpers for the Oh My Juiceness Elementor site.
 * Version: 0.1.0
 */

defined('ABSPATH') || exit;

/**
 * Set a page to a single full-width HTML widget containing $html.
 */
function omj_set_page_html(int $page_id, string $html): string {
    $data = [[
        'id'       => substr(md5(uniqid('', true)), 0, 7),
        'elType'   => 'section',
        'settings' => [],
        'elements' => [[
            'id'       => substr(md5(uniqid('', true)), 0, 7),
            'elType'   => 'column',
            'settings' => ['_column_size' => 100],
            'elements' => [[
                'id'       => substr(md5(uniqid('', true)), 0, 7),
                'elType'   => 'widget',
                'widgetType' => 'html',
                'settings' => ['code' => $html],
                'elements' => [],
            ]],
        ]],
    ]];

    update_post_meta($page_id, '_elementor_data', wp_slash(wp_json_encode($data)));
    update_post_meta($page_id, '_elementor_edit_mode', 'builder');
    update_post_meta($page_id, '_elementor_version', ELEMENTOR_VERSION);

    $doc = \Elementor\Plugin::$instance->documents->get($page_id);
    if ($doc) {
        $doc->save(['elements' => $data]);
    }

    return "Page {$page_id} updated.\n";
}

/**
 * Set a page from an ordered array of blocks.
 * Each block: ['type'=>'html'|'shortcode', 'content'=>string, 'css'=>string?]
 */
function omj_set_page_blocks(int $page_id, array $blocks): string {
    $elements = [];
    foreach ($blocks as $block) {
        $widget_type = $block['type'] === 'shortcode' ? 'shortcode' : 'html';
        $setting_key = $block['type'] === 'shortcode' ? 'shortcode' : 'code';
        $settings = [$setting_key => $block['content']];
        if (!empty($block['css'])) {
            $settings['custom_css'] = $block['css'];
        }
        $elements[] = [
            'id'       => substr(md5(uniqid('', true)), 0, 7),
            'elType'   => 'section',
            'settings' => [],
            'elements' => [[
                'id'       => substr(md5(uniqid('', true)), 0, 7),
                'elType'   => 'column',
                'settings' => ['_column_size' => 100],
                'elements' => [[
                    'id'         => substr(md5(uniqid('', true)), 0, 7),
                    'elType'     => 'widget',
                    'widgetType' => $widget_type,
                    'settings'   => $settings,
                    'elements'   => [],
                ]],
            ]],
        ];
    }

    update_post_meta($page_id, '_elementor_data', wp_slash(wp_json_encode($elements)));
    update_post_meta($page_id, '_elementor_edit_mode', 'builder');
    update_post_meta($page_id, '_elementor_version', ELEMENTOR_VERSION);

    $doc = \Elementor\Plugin::$instance->documents->get($page_id);
    if ($doc) {
        $doc->save(['elements' => $elements]);
    }

    return "Page {$page_id} updated with " . count($blocks) . " blocks.\n";
}

/**
 * Set an Elementor Theme Builder part (header/footer) from HTML.
 */
function omj_set_theme_part(string $title, string $type, string $html): string {
    return omj_set_theme_part_blocks($title, $type, [['type' => 'html', 'content' => $html]]);
}

/**
 * Set an Elementor Theme Builder part from blocks.
 */
function omj_set_theme_part_blocks(string $title, string $type, array $blocks): string {
    $post_id = wp_insert_post([
        'post_title'  => $title,
        'post_type'   => 'elementor_library',
        'post_status' => 'publish',
        'meta_input'  => [
            '_elementor_template_type' => $type,
        ],
    ]);

    if (is_wp_error($post_id)) {
        return "Error: " . $post_id->get_error_message();
    }

    omj_set_page_blocks($post_id, $blocks);

    // Update Theme Builder conditions
    $conditions = get_option('elementor_pro_theme_builder_conditions', []);
    if (!is_array($conditions)) $conditions = [];
    if (!isset($conditions[$type])) $conditions[$type] = [];
    $conditions[$type][$post_id] = ['include/general'];
    update_option('elementor_pro_theme_builder_conditions', $conditions);

    return "Theme part '{$title}' ({$type}) created as post {$post_id}.\n";
}

/**
 * Idempotently ensure a page exists by slug. Returns the page ID.
 */
function omj_ensure_page(string $slug, string $title): int {
    $existing = get_page_by_path($slug);
    if ($existing) {
        return $existing->ID;
    }
    return wp_insert_post([
        'post_name'   => $slug,
        'post_title'  => $title,
        'post_type'   => 'page',
        'post_status' => 'publish',
    ]);
}
