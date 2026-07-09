<?php
/**
 * Create staging preview pages for the OMJ revision round.
 *
 * This intentionally does not update the live Home, About, Contact, header, or
 * footer. Elementor Theme Builder owns the site header/footer.
 * Run with: wp eval-file ~/create-staging.php
 */

$home = getenv('HOME');

$pages = [
    [
        'slug' => 'home-staging',
        'title' => 'OMJ Home Staging — New Design Preview',
        'file' => 'home-staging.html',
    ],
    [
        'slug' => 'about-staging',
        'title' => 'OMJ About Staging — New Design Preview',
        'file' => 'about-staging.html',
    ],
    [
        'slug' => 'contact-staging',
        'title' => 'OMJ Contact Staging — New Design Preview',
        'file' => 'contact-staging.html',
    ],
];

foreach ($pages as $page) {
    $body = file_get_contents($home . '/' . $page['file']);
    if (!$body) {
        echo "ERROR: Cannot read {$page['file']} from HOME.\n";
        exit(1);
    }

    $page_id = omj_ensure_page($page['slug'], $page['title']);
    echo "Staging page {$page['slug']} ID: {$page_id}\n";
    echo omj_set_page_html($page_id, $body);

    wp_update_post([
        'ID' => $page_id,
        'comment_status' => 'closed',
    ]);
    delete_post_meta($page_id, '_elementor_element_cache');
    delete_post_meta($page_id, '_elementor_controls_usage');
    delete_post_meta($page_id, '_elementor_css');
}

\Elementor\Plugin::$instance->files_manager->clear_cache();

echo "Staging pages deployed:\n";
echo "- /home-staging/\n";
echo "- /about-staging/\n";
echo "- /contact-staging/\n";
