<?php

class __Prefix_ET_Builder_Module_HelloWorld extends ET_Builder_Module {

	public function init() {
		$this->name       = esc_html__( 'Hello World', '<GETTEXT_DOMAIN>' );
		$this->slug       = '__prefix_pb_hello_world';
		$this->fb_support = true;
	}

	public function get_fields() {
		return array();
	}

	public function shortcode_callback( $attrs, $content = null, $function_name ) {

	}
}

new __Prefix_ET_Builder_Module_HelloWorld();
