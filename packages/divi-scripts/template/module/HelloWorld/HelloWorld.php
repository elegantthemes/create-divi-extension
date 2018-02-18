<?php


class __Prefix_HelloWorld extends ET_Builder_Module {

	public $name       = 'Hello World';
	public $slug       = '__prefix_pb_hello_world';
	public $vb_support = 'on';

	public function init() {
		$this->name = esc_html__( $this->name, '<GETTEXT_DOMAIN>' );
	}

	public function get_fields() {
		return array();
	}

	public function shortcode_callback( $attrs, $content = null, $function_name ) {

	}
}

new __Prefix_HelloWorld;
