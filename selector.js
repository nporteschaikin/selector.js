(function( $ ){
	
	var defaults = { 
		'url': false,
		'pfx': 'selector',
		'z': '99',
		'fade': false,
		'sp': 100,
		'caret': false
	},
	
	keys = {
		uarr: 38,
		darr: 40,
		enter: 13,
		esc: 27,
		tab: 9
	},
	
	letters = {
		65: 'a',
		66: 'b',
		67: 'c',
		68: 'd',
		69: 'e',
		70: 'f',
		71: 'g',
		72: 'h',
		73: 'i',
		74: 'j',
		75: 'k',
		76: 'l',
		77: 'm',
		78: 'n',
		79: 'o',
		80: 'p',
		81: 'q',
		82: 'r',
		83: 's',
		84: 't',
		85: 'u',
		86: 'v',
		87: 'w',
		88: 'x',
		89: 'y',
		90: 'z'
	},
	
	methods = {
		
		init: function ( settings ) {
			settings = $.extend( {}, defaults, settings, this.data() );
			return this.each( 
				function() {
					
					// $(this) must be <select> and have a "name" attr
					if( $( this ).is( 'select' ) 
					&& $( this ).attr( 'name' )
					&& !$( this ).data( 'select' ) ) {
						
						// select
						var select = {
							el: $( this ),
							name: $( this ).attr( 'name' ),
							options: $( this ).find( 'option' ),
							id: $( this ).find( 'id' ),
							tabindex: $( this ).attr('tabindex') || 0,
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
						if ( $( this ).has(':selected') ) {
							$build.select( 'change', { eq: $( this ).find(':selected').index() } );
						} else {
							$build.select( 'change', { eq: 0 } );
						}
						
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
						var options = data.build.find( '.' + data.settings.pfx + '-list' ),
						title = data.build.find( '.' + data.settings.pfx + '-title' );
						
						// set list width
						options.width( title.width() );
						
						// fade in or show
						if ( data.settings.fade ) {
							options.stop().fadeIn( data.settings.sp );
						} else {
							options.css( 'display', 'block' );
						}
						
						// add open class
						data.build.addClass( data.settings.pfx + '-open' );
						
						// focus 
						data.build.focus();
						
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
							value: item.data( 'value' ),
							eq: item.index()
						}
						
						// set selected
						selected ( data, item.eq );
						
						// change
						data.el.val( item.value );
						data.build.find( '.' + data.settings.pfx + '-title a span:first' ).html( item.title );
						
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
		$build.html( '<li class="' + data.settings.pfx + '-title"><a href="#"><span></span></a></li>' );
		if( data.settings.caret ) {
			$build.find('.' + data.settings.pfx + '-title a').append('<i class="' + data.settings.pfx + '-caret"></i>');
		}
		$build.append( '<li class="' + data.settings.pfx + '-list"><ul></ul></li>' );
		
		// tabindex
		if( data.tabindex >= 0 ) {
			$build.attr( 'tabindex', data.tabindex );
		}
				
		// options
		data.options.each (
			function() {
				var key = $( this ).attr('value'),
				value = $( this ).html(),
				item = $( '<li><a href="#"></a></li>' );
				item.attr( { 'data-value': key } );
				item.find('a').html( value );
				$build.find( '.' + data.settings.pfx + '-list ul' ).append( item );
			}
		)
		
		// add css to list
		$build.find( '.' + data.settings.pfx + '-list' ).css( css );
		
		// done
		return $build;
		
	}
	
	function selected ( data, eq ) {
		var 
		
		// the selected element
		th = data.build.find( '.' + data.settings.pfx + '-list li' ).eq( eq ),
		
		// list
		list = data.build.find( '.' + data.settings.pfx + '-list ul' ),
		
		// position
		pos = list.scrollTop() + th.position().top;
		
		data.build.find( '.selected' ).removeClass( 'selected' );
		th.addClass( 'selected' );
		list.scrollTop( pos );
		
	}
	
	function letter ( data, key ) {
		
		// letter to search by
		var letter = letters[key],
		
		// element
		el;
		
		// all options
		all = data.build.find('.' + data.settings.pfx + '-list li'),
		
		// find options with matching first letter
		options = all.filter(
			function( key, value ) {
				return $(value).find('a').html().substring(0, 1) == letter.toUpperCase();
			}
		),
		
		// find if there is selected element in this group
		current = options.filter( '.selected' );
		
		if ( current.length && options.index( current.next( 'li' ) ) >= 0 ) {
			el = all.index( current.next( 'li' ) );
		} else {
			el = all.index( options.first() );
		}
		
		selected ( data, el );
		data.build.select( 'change', { eq: el } );
		
	}
	
	function binder ( data ) {
		
		var build = data.build;
		
		// click title
		build.find( '.' + data.settings.pfx + '-title' ).bind( 'click', 
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
		
		// focus
		build.bind('focus', 
			function() { 
				build.addClass( data.settings.pfx + '-focus' );
			} 
		);
		
		build.bind('blur', 
			function() { 
				build.removeClass( data.settings.pfx + '-focus' );
				build.select( 'close' );
				$( document ).unbind( 'keydown.select' );
			} 
		);
		
		// keys
		$( document ).bind( 'keydown.select',
			function( e ) {
				
				var focus = data.settings.pfx + '-focus',
				open = data.settings.pfx + '-open',
				current = data.build.find('.selected'),
				next = current.next( 'li' ),
				prev = current.prev( 'li' ),
				last = build.find('.' + data.settings.pfx + '-list li').last();
				
				if ( build.hasClass( focus ) ) {
					if ( e.which == keys.enter ) {
						if ( build.hasClass ( open ) ) {
							build.select( 'close' );
							build.select( 'change', { eq: current.index() } );
						} else {
							build.select( 'open' );
						}
					} else if ( e.which == keys.darr ) {
						e.preventDefault();
						if ( !build.hasClass ( open ) ) {
							build.select( 'open' );
						} else {	
							if ( next.length ) {
								selected ( data, next.index() );
							} else {
								selected ( data, 0 );
							}
						}
					} else if ( e.which == keys.uarr ) {
						if ( build.hasClass ( open ) ) {	
							if ( prev.length ) {
								selected ( data, prev.index() );
							} else {
								selected ( data, last.index() );
							}
						}
					} else if ( e.which == keys.esc || e.which == keys.tab ) {
						data.build.blur();
						build.select( 'close' );
					}	else if ( e.which >= 65 && e.which <= 90 ) {
						letter ( data, e.which );
					}
				}
				
			}
		)
		
	}


})( jQuery );