(function( $ ){

	var methods = {};
	
	methods.init = function( options ) {  
		
		return this.each(
			function() {
				
				var defaults = { 
					'url': false,
					'placeholder': null,
					'pfx': 'selector',
					'z': '99',
					'fade': true,
					'fadeSpeed': 100
				}

				var settings = $.extend(defaults, options);
				
				$this = $(this);
				if ( $this.is( 'select' )  ) {
					
					var select, build, blocks;
					var data = $this.data('select');
					
					select = {
						name: $this.attr('name'),
						id: $this.attr('id'),
						options: $this.find('option')
					}
					
					data = {
						settings: settings,
						select: select
					}
					
					data.build = _build( data );
					data.blocks = _blocks( data );
					data = _setup( data );
					
					blocks.title.bind( 'click',
						function( e ) {
							e.preventDefault();
							if ( blocks.list.parent().css('display') == 'none' ) {
								if( settings.fade ) {
									blocks.list.parent().stop().fadeIn( options.fadeSpeed );
								} else {
									blocks.list.parent().css('display', 'block');
								}
								build.addClass( settings.pfx + '-open' );
								if ( settings.placeholder == null ) {
									blocks.items.parent().filter('[data-value="' + blocks.input.val() + '"]').css('display', 'none');
								} else {
									blocks.title.html( settings.placeholder );
								}
								$(document).bind('click',
									function( e ) {
										e.preventDefault();
										if ( build.has( e.target ).length === 0 ) {
											blocks.title.click();
										}
									}
								)
							} else {
								if( settings.fade ) {
									blocks.list.parent().stop().fadeOut( options.fadeSpeed );
								} else {
									blocks.list.parent().css('display', 'none');
								}
								build.removeClass( settings.pfx + '-open' );
								blocks.items.parent().css('display', 'block');
								$(document).unbind( 'click' );
							}
						}
					)
					
					blocks.items.bind( 'click',
						function() {
							var parent = $(this).parent(),
								key = parent.attr('data-value'),
								value = $(this).html();
							blocks.title.html( value );
							blocks.input.val( key );
							if( settings.url == true ) {
								window.location = key;
							}
							if ( blocks.list.parent().css('display') !== 'none' ) {
								blocks.title.click();
							}
						}
					)
					
					if ( settings.placeholder !== null ) {
						blocks.title.html( settings.placeholder );
					}else{
						blocks.items.first().click();
					}
					
					$this.replaceWith( build );
					
				} else {
					return false;
				}
			}
		);
		
  };

	$.fn.select = function( method ) {  
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		}
	}
	
	function _build( data ) {
		var build;
		build = $('<ul class="' + data.settings.pfx + '" />');
		build.html( '<li class="' + data.settings.pfx + '-title"><a href="#"></a></li>' );
		build.prepend( '<input type="hidden" />' );
		build.append( '<li class="' + data.settings.pfx + '-list"><ul></ul></li>' );
		return build;
	}
	
	function _blocks( data ) {
		var blocks;
		blocks = {
			title: data.build.find('.' + data.settings.pfx + '-title a'),
			list: data.build.find('.' + data.settings.pfx + '-list ul'),
			input: data.build.find('input')
		}
		return blocks;
	}
	
	function _setup( data ) {
		
		data.blocks.list.parent().css( { 
			'display': 'none', 
			'position': 'absolute', 
			'z-index': data.settings.z,
			'margin': 0,
			'padding': 0,
			'border': 0
		} )
		
		if ( data.select.name.length > 0 ) {
			data.blocks.input.attr( 'name', data.select.name );
			data.build.attr( 'data-name', data.select.name );
		}
		
		if ( data.select.options.length > 0 ) {
			data.select.options.each(
				function() {
					var key = $(this).attr('value'),
						value = $(this).html();
					item = $( '<li><a href="#"></a></li>' );
					item.attr( 'data-value', key );
					item.find('a').html( value );
					data.blocks.list.append( item );
				}
			)
						
		}
		
		data.blocks.items = data.blocks.list.find('li a');
		return data;
		
	}

})( jQuery );