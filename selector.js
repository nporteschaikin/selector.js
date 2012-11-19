(function( $ ){
	
	var defaults = { 
		'url': false,
		'pfx': 'selector',
		'z': '99',
		'fade': false,
		'sp': 100
	}

	var methods = {
		
		init: function ( settings ) {
			settings = $.extend( {}, defaults, settings, this.data() );
			return this.each( 
				function() {
					
					// $(this) must be <select> and have a "name" attr
					if( $( this ).is( 'select' ) 
					&& $( this ).attr( 'name' ) ) {
						
						// select
						var select = {
							el: $( this ),
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
						
						// open first
						$build.select( 'change', { eq: 0 } );
						
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
						data.build.addClass( data.settings.pfx + '-open' );
						
						// bind
						$(document).bind('click', 
							function( e ) { 
								e.preventDefault();
								if ( data.build.has( e.target ).length === 0 ) {
									data.build.select( 'close' );
								}
							} 
						);
						
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
						data.build.removeClass( data.settings.pfx + '-open' );
						
					} else {
						return false;
					}
					
				}
			)
			
		},
		
		change: function( settings ) {
			
			return this.each(
				function() {
					
					var data = $( this ).data( 'select' ),
					item;
					
					if( data.name && ( settings.eq >= 0 || settings.val ) ) {
						item = data.build.find( '.' + data.settings.pfx + '-list li' );
						
						// eq or val?
						if ( settings.eq >= 0 ) {
							item = item.eq( settings.eq );
						} else {
							item = item.filter( '[data-value="' + settings.val + '"]' );
						}
						
						item = {
							title: item.find( 'a' ).html(),
							value: item.data( 'value' )
						}
						
						// change
						data.el.val( item.value );
						data.build.find( '.' + data.settings.pfx + '-title a' ).html( item.title );
						
						// URL
						if( data.settings.url && item.value !== '' ) {
							window.location = item.value;
						}
						
					}
					
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
		css = { 
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
		$build.append( '<li class="' + data.settings.pfx + '-list"><ul></ul></li>' );
				
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
		$build.find( '.' + data.settings.pfx + '-list' ).css( css );
		
		// done
		return $build;
		
	}
	
	function binder ( data ) {
		
		var build = data.build;
		
		// click title
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
		
		// click list item
		build.find( '.' + data.settings.pfx + '-list a' ).bind( 'click', 
			function( e ) {
				e.preventDefault();
				build.select( 'change', { eq: $(this).parent().index() } );
				build.select( 'close' );
			}
		)
		
	}


})( jQuery );