(function( $ ){
	
	var defaults = { 
		'url': false,
		'placeholder': null,
		'pfx': 'selector',
		'z': '99',
		'fade': true,
		'sp': 100
	}

	var methods = {
		
		init: function ( settings ) {
			settings = $.extend( {}, defaults, settings );
			return this.each( 
				function() {
					
					// $(this) must be <select> and have a "name" attr
					if( $( this ).is( 'select' ) 
					&& $( this ).attr( 'name' ) ) {
						
						// select
						var select = {
							name: $( this ).attr( 'name' ),
							options: $( this ).find( 'option' ),
							id: $( this ).find( 'id' ),
							settings: settings
						},
						// data
						data = $( this ).data( 'select' ) || select;
						
						// build
						$build = build( data );
						data.build = $build;
						
						// place
						$( this ).hide();
						$( this ).after( $build );
										
						// save data
						$( this ).data( 'select', data );
						$build.data( 'select', data );
						
						// set binds
						binder( data );
						
					} else {
						return false;
					}
					
				}
			)
		},
		
		open: function() {
			
			return this.each(
				function() {
					
					var data = $( this ).data( 'select' );
					if ( data.name ) {
						
						// find options
						var options = data.build.find( '.' + data.settings.pfx + '-list' );
						
						// fade in or show
						if ( data.settings.fade ) {
							options.stop().fadeIn( data.settings.sp );
						} else {
							options.css( 'display', 'block' );
						}
						
						// add open class
						data.build.toggleClass( data.settings.pfx + '-open' );
						
					} else {
						return false;
					}
					
				}
			)
			
		},
		
		close: function() {
			
			return this.each(
				function() {
					
					var data = $( this ).data( 'select' );
					if ( data.name ) {
						
						// find options
						var options = data.build.find( '.' + data.settings.pfx + '-list' );
						
						// fade out or hide
						if ( data.settings.fade ) {
							options.stop().fadeOut( data.settings.sp );
						} else {
							options.css( 'display', 'none' );
						}
						
						// remove open class
						data.build.toggleClass( data.settings.pfx + '-open' );
						
					} else {
						return false;
					}
					
				}
			)
			
		},
		
		change: function() {
			
			return this.each(
				function() {
					
					alert('test');
					
				}
			);
			
		}
		
	}

	$.fn.select = function( method ) {  
		
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		}
		
  };

	function build ( data ) {
		
		var $build,
		// list css
		listCSS = { 
			'display': 'none', 
			'position': 'absolute', 
			'z-index': data.settings.z,
			'margin': 0,
			'padding': 0,
			'border': 0
		};
		
		// structure
		$build = $('<ul class="' + data.settings.pfx + '" />');
		$build.html( '<li class="' + data.settings.pfx + '-title"><a href="#"></a></li>' );
		$build.prepend( '<input type="hidden" />' );
		$build.append( '<li class="' + data.settings.pfx + '-list"><ul></ul></li>' );
		
		// give name
		$build.find( 'input' ).attr( 'name', data.name );
		
		// options
		data.options.each (
			function() {
				var key = $( this ).attr('value'),
				value = $( this ).html(),
				item = $( '<li><a href="#"></a></li>' );
				item.attr( 'data-value', key );
				item.find('a').html( value );
				$build.find( '.' + data.settings.pfx + '-list ul' ).append( item );
			}
		)
		
		// add css to list
		$build.find( '.' + data.settings.pfx + '-list' ).css( listCSS );
		
		// done
		return $build;
		
	}
	
	function binder ( data ) {
		
		var build = data.build;
		
		build.find( '.' + data.settings.pfx + '-title a' ).bind( 'click', 
			function( e ) {
				e.preventDefault();
				if( build.hasClass( data.settings.pfx + '-open' ) ) {
					build.select( 'close' );
				} else {
					build.select( 'open' );
				}
			}
		)
		
		build.find( '.' + data.settings.pfx + '-list a' ).bind( 'click', 
			function( e ) {
				e.preventDefault();
				build.select( 'change' );
				build.select( 'close' );
			}
		)
		
	}


})( jQuery );