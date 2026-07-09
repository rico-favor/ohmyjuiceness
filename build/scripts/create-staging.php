<?php
/**
 * Create/update OMJ staging pages without touching the live Home/About/Contact page IDs.
 *
 * Usage:
 *   wp eval-file ~/create-staging.php
 */

defined('ABSPATH') || exit;

$home_dir = rtrim((string) getenv('HOME'), '/');
$pages_dir = $home_dir ? $home_dir . '/omj-staging-pages' : '';
if (!$pages_dir || !is_dir($pages_dir)) {
    $pages_dir = dirname(__DIR__) . '/pages';
}

if (!function_exists('omj_ensure_page') || !function_exists('omj_set_page_html')) {
    throw new RuntimeException('OMJ build helpers are not loaded.');
}

function omj_stage_read(string $path): string {
    if (!is_readable($path)) {
        throw new RuntimeException("Missing staging source: {$path}");
    }
    return file_get_contents($path);
}

function omj_stage_publish_page(string $slug, string $title, string $html): int {
    $page_id = omj_ensure_page($slug, $title);
    wp_update_post([
        'ID' => $page_id,
        'post_title' => $title,
        'post_name' => $slug,
        'post_status' => 'publish',
        'comment_status' => 'closed',
        'ping_status' => 'closed',
    ]);
    update_post_meta($page_id, '_wp_page_template', 'elementor_header_footer');
    echo omj_set_page_html($page_id, $html);
    return $page_id;
}

function omj_stage_find_form_widget(array $elements): ?array {
    foreach ($elements as $element) {
        if (($element['elType'] ?? '') === 'widget' && ($element['widgetType'] ?? '') === 'form') {
            return $element;
        }
        if (!empty($element['elements']) && is_array($element['elements'])) {
            $found = omj_stage_find_form_widget($element['elements']);
            if ($found) {
                return $found;
            }
        }
    }
    return null;
}

function omj_stage_new_ids(array $element): array {
    $element['id'] = substr(md5(uniqid('', true)), 0, 7);
    if (!empty($element['elements']) && is_array($element['elements'])) {
        $element['elements'] = array_map('omj_stage_new_ids', $element['elements']);
    }
    return $element;
}

function omj_stage_text_section(string $html): array {
    return [
        'id' => substr(md5(uniqid('', true)), 0, 7),
        'elType' => 'section',
        'settings' => [],
        'elements' => [[
            'id' => substr(md5(uniqid('', true)), 0, 7),
            'elType' => 'column',
            'settings' => ['_column_size' => 100],
            'elements' => [[
                'id' => substr(md5(uniqid('', true)), 0, 7),
                'elType' => 'widget',
                'widgetType' => 'text-editor',
                'settings' => ['editor' => $html],
                'elements' => [],
            ]],
        ]],
    ];
}

function omj_stage_widget_section(array $widget): array {
    $widget = omj_stage_new_ids($widget);
    return [
        'id' => substr(md5(uniqid('', true)), 0, 7),
        'elType' => 'section',
        'settings' => [],
        'elements' => [[
            'id' => substr(md5(uniqid('', true)), 0, 7),
            'elType' => 'column',
            'settings' => ['_column_size' => 100],
            'elements' => [$widget],
        ]],
    ];
}

$home_id = omj_stage_publish_page(
    'home-staging',
    'Home Staging',
    omj_stage_read($pages_dir . '/home-staging.html')
);

$about_id = omj_stage_publish_page(
    'about-staging',
    'About Staging',
    omj_stage_read($pages_dir . '/about-staging.html')
);

$contact_id = omj_ensure_page('contact-staging', 'Contact Staging');
wp_update_post([
    'ID' => $contact_id,
    'post_title' => 'Contact Staging',
    'post_name' => 'contact-staging',
    'post_status' => 'publish',
    'comment_status' => 'closed',
    'ping_status' => 'closed',
]);
update_post_meta($contact_id, '_wp_page_template', 'elementor_header_footer');

$source_data_raw = get_post_meta(21, '_elementor_data', true);
$source_data = json_decode($source_data_raw, true);
if (!is_array($source_data)) {
    throw new RuntimeException('Could not decode live Contact page Elementor data.');
}
$form_widget = omj_stage_find_form_widget($source_data);
if (!$form_widget) {
    throw new RuntimeException('Could not find Elementor Pro form widget on Contact page ID 21.');
}

$contact_html = omj_stage_read($pages_dir . '/contact-staging.html');
$contact_data = [
    omj_stage_text_section($contact_html),
    omj_stage_widget_section($form_widget),
];

update_post_meta($contact_id, '_elementor_data', wp_slash(wp_json_encode($contact_data)));
update_post_meta($contact_id, '_elementor_edit_mode', 'builder');
update_post_meta($contact_id, '_elementor_version', defined('ELEMENTOR_VERSION') ? ELEMENTOR_VERSION : '4.1.4');

$doc = \Elementor\Plugin::$instance->documents->get($contact_id);
if ($doc) {
    $doc->save(['elements' => $contact_data]);
}

echo "Contact staging page {$contact_id} updated with cloned Elementor Pro form.\n";
echo "Staging URLs:\n";
echo get_permalink($home_id) . "\n";
echo get_permalink($about_id) . "\n";
echo get_permalink($contact_id) . "\n";
