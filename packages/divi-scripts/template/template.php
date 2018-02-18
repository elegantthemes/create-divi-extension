<?php
/*
Plugin Name: <NAME>
Plugin URI:  <URI>
Description: <DESCRIPTION>
Version:     0.1.0
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

define( '__PREFIX_PLUGIN_DIR', dirname( __FILE__ ) );


/**
 * Performs tasks when the plugin is activated.
 * {@see 'activate_$PLUGINNAME'}
 */
function __prefix_activate() {
	// Force the backend builder to reload its template cache.
	// This ensures that our custom modules are available for use right away.
	et_pb_force_regenerate_templates();
}
register_activation_hook( __FILE__, '__prefix_activate' );


/**
 * Performs tasks when the plugin is deactivated.
 * {@see 'deactivate_$PLUGINNAME'}
 */
function __prefix_deactivate() {

}
register_deactivation_hook( __FILE__, '__prefix_deactivate' );


/**
 * Performs initialization tasks. Once the plugin is activated, this function will be called
 * during every incoming HTTP request until the plugin is deactivated.
 * {@see 'plugins_loaded'}
 */
function __prefix_initialize() {
	// Setup translations
	load_plugin_textdomain( '<GETTEXT_DOMAIN>', false, basename( __PREFIX_PLUGIN_DIR ) . '/languages' );
}
add_action( 'plugins_loaded', '__prefix_initialize' );


/**
 * Loads custom modules when the builder is ready.
 * {@see 'et_builder_ready'}
 */
function __prefix_load_custom_builder_modules() {
	require_once __PREFIX_PLUGIN_DIR . '/module/loader.php';
}
add_action( 'et_builder_ready', '__prefix_load_custom_builder_modules' );
