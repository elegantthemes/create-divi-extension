// External Dependencies
import ETBuilderComponentRegistry from 'et-builder-component-registry';

// Internal Dependencies
import HelloWorld from './HelloWorld/HelloWorld';


ETBuilderComponentRegistry.on( 'ready', event => {
	ETBuilderComponentRegistry.register( HelloWorld, '__prefix_pb_hello_world' );
} );
