<?php


class __Prefix___PluginName extends DiviExtension {

	/**
	 * The gettext domain for the extension's translations.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $gettext_domain = '__prefix___plugin_name';

	/**
	 * The extension's WP Plugin name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $name = '__plugin_name';

	/**
	 * __Prefix___PluginName constructor.
	 *
	 * @param string $name
	 * @param array  $args
	 */
	public function __construct( $name = '__plugin_name', $args = array() ) {
		$this->plugin_dir = dirname( plugin_dir_path( __FILE__ ) );

		parent::__construct( $name, $args );
	}
}

new __Prefix___PluginName;
