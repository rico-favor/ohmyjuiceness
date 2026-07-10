<?php
/**
 * Update the HTML fragment (script + IGQR section) on the live Contact page
 * (ID 530, promoted from staging at go-live) without touching the cloned
 * Elementor Pro form widget that follows it.
 *
 * Usage:
 *   scp build/pages/contact-staging.html omj:~/contact-staging.html
 *   scp build/scripts/update-contact-fragment.php omj:~/update-contact-fragment.php
 *   wp eval-file ~/update-contact-fragment.php
 */

defined('ABSPATH') || exit;

const OMJ_LIVE_CONTACT_ID = 530;

$home_dir = rtrim((string) getenv('HOME'), '/');
$fragment_path = $home_dir . '/contact-staging.html';
if (!is_readable($fragment_path)) {
    $fragment_path = dirname(__DIR__) . '/pages/contact-staging.html';
}
if (!is_readable($fragment_path)) {
    throw new RuntimeException("Missing contact fragment: {$fragment_path}");
}
$fragment = file_get_contents($fragment_path);

$data_raw = get_post_meta(OMJ_LIVE_CONTACT_ID, '_elementor_data', true);
$data = json_decode($data_raw, true);
if (!is_array($data)) {
    throw new RuntimeException('Could not decode Contact page Elementor data.');
}

$replaced = false;
$replace_first_text_editor = function (array $elements) use (&$replace_first_text_editor, &$replaced, $fragment): array {
    foreach ($elements as $i => $element) {
        if ($replaced) {
            break;
        }
        if (($element['elType'] ?? '') === 'widget' && ($element['widgetType'] ?? '') === 'text-editor') {
            $elements[$i]['settings']['editor'] = $fragment;
            $replaced = true;
            break;
        }
        if (!empty($element['elements']) && is_array($element['elements'])) {
            $elements[$i]['elements'] = $replace_first_text_editor($element['elements']);
        }
    }
    return $elements;
};

$data = $replace_first_text_editor($data);
if (!$replaced) {
    throw new RuntimeException('No text-editor widget found on Contact page ' . OMJ_LIVE_CONTACT_ID . '.');
}

update_post_meta(OMJ_LIVE_CONTACT_ID, '_elementor_data', wp_slash(wp_json_encode($data)));

$doc = \Elementor\Plugin::$instance->documents->get(OMJ_LIVE_CONTACT_ID);
if ($doc) {
    $doc->save(['elements' => $data]);
}

echo 'Contact fragment updated on page ' . OMJ_LIVE_CONTACT_ID . ": " . get_permalink(OMJ_LIVE_CONTACT_ID) . "\n";
