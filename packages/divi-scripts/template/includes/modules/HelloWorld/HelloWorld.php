<?php


class __Prefix_HelloWorld extends ET_Builder_Module {

	public $name       = 'Hello World';
	public $slug       = '__prefix_hello_world';
	public $vb_support = 'on';

	public function init() {
		$this->name = esc_html__( $this->name, '<GETTEXT_DOMAIN>' );

		// Module Settings Modal - Custom Tabs
		$this->options_tabs = array(
			'__prefix_custom_tab' => array(
				'name' => esc_html__( 'Custom Tab', '<GETTEXT_DOMAIN>' ),
			),
		);

		// Module Settings Modal Tabs - Settings Groups
		$this->options_toggles = array(
			'general'       => array(
				'toggles' => array(
					'main_content' => esc_html__( 'Text', 'et_builder' ),
				),
			),
			'my_custom_tab' => array(
				'toggles' => array(
					'my_custom_toggle' => esc_html__( 'My Custom Options Set', 'et_builder' ),
				),
			),
			'advanced'      => array(
				'toggles' => array(
					'text'   => array(
						'title'             => esc_html__( 'Text', 'et_builder' ),
						'priority'          => 45,
						'tabbed_subtoggles' => true,
						'bb_icons_support'  => true,
						'sub_toggles'       => array(
							'p'     => array(
								'name' => 'P',
								'icon' => 'text-left',
							),
							'a'     => array(
								'name' => 'A',
								'icon' => 'text-link',
							),
							'ul'    => array(
								'name' => 'UL',
								'icon' => 'list',
							),
							'ol'    => array(
								'name' => 'OL',
								'icon' => 'numbered-list',
							),
							'quote' => array(
								'name' => 'QUOTE',
								'icon' => 'text-quote',
							),
						),
					),
					'header' => array(
						'title'             => esc_html__( 'Heading Text', 'et_builder' ),
						'priority'          => 49,
						'tabbed_subtoggles' => true,
						'sub_toggles'       => array(
							'h1' => array(
								'name' => 'H1',
								'icon' => 'text-h1',
							),
							'h2' => array(
								'name' => 'H2',
								'icon' => 'text-h2',
							),
							'h3' => array(
								'name' => 'H3',
								'icon' => 'text-h3',
							),
							'h4' => array(
								'name' => 'H4',
								'icon' => 'text-h4',
							),
							'h5' => array(
								'name' => 'H5',
								'icon' => 'text-h5',
							),
							'h6' => array(
								'name' => 'H6',
								'icon' => 'text-h6',
							),
						),
					),
					'width'  => array(
						'title'    => esc_html__( 'Sizing', 'et_builder' ),
						'priority' => 65,
					),
				),
			),
		);
	}

	public function get_fields() {
		return array();
	}

	public function shortcode_callback( $attrs, $content = null, $function_name ) {

	}
}

new __Prefix_HelloWorld;
