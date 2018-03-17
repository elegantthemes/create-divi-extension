// External Dependencies
import $ from 'jquery';

// Internal Dependencies
import '../../scripts/frontend.js';
import HelloWorld from './modules/HelloWorld/HelloWorld';

$(window).on('et_builder_api_ready', (event, API) => {
  API.registerModule('__prefix_hello_world', HelloWorld);
});
