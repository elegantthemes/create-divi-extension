<?php
/*
Plugin Name: <NAME>
Plugin URI:  <URI>
Description: <DESCRIPTION>
Version:     1.0.0
Author:      <AUTHOR>
Author URI:  <AUTHOR_URI>
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: <GETTEXT_DOMAIN>
Domain Path: /languages

<NAME> is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.

<NAME> is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with <NAME>. If not, see https://www.gnu.org/licenses/gpl-2.0.html.
*/


if ( ! function_exists( '__prefix_initialize_extension' ) ):
/**
 * Creates the extension's main class instance.
 *
 * @since 1.0.0
 */
function __prefix_initialize_extension() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/__PluginName.php';
}
add_action( 'divi_extensions_init', '__prefix_initialize_extension' );
endif;
