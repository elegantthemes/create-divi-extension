<?php

if ( ! class_exists( 'ET_Builder_Module' ) ) {
	return;
}

if ( ! $module_dirs = glob( __DIR__ . '/*', GLOB_ONLYDIR ) ) {
	return;
}

// Load custom Divi Builder modules
foreach ( $module_dirs as $module_dir ) {
	$module_file = basename( $module_dir ) . '.php';

	require_once __DIR__ . "/{$module_file}";
}
