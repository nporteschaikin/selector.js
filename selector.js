/*

* selector.js
* The most functional custom <select> plugin on Earth.
* @author Noah Portes Chaikin
* @requires jQuery 1.6+

*/

(function($){
  
  var defaults = {
    prefix: 'select',
    hide: true
  },
  
  methods = {
    
    init: function (settings) {
      
      settings = $.extend({}, defaults, settings, this.data());
      
      var data;
      
      return this.each( 
        function() {
          
          if($(this).data('name')) {
            
            // create data
            data = {
              name: $(this).data('name'),
              options: $(this).find('[data-value]'),
              settings: settings
            };
            
            // build
            select = __create(data);
            data.select = select;
            
            // place
            $(this).after(select);
            if (settings.hide) select.hide();
            
            // save data
            $(this).data('select', data);
            
            // bind
            __bind($(this));
            
            // set title
            __title($(this));
            
            
          } else {
            return false;
          }
          
        }
      )
    },
    
    open: function() {
      
      return this.each(
        function () {
          
          var data = $(this).data('select');
          $(this).addClass(__class(data, 'open'));
          
        }
      )
      
    },
    
    close: function() {
      
      return this.each(
        function () {
          
          var data = $(this).data('select');
          $(this).removeClass(__class(data, 'open'));
          
        }
      )
      
    },
    
    toggle: function () {
      
      return this.each(
        function () {
          
          var data = $(this).data('select');
          $(this).toggleClass(__class(data, 'open'));
          
        }
      )
      
    },
    
    change: function(value) {
      
      return this.each(
        function () {
          
          var data = $(this).data('select'),
              select = data.select,
              options = data.options,
              option = options.filter(function(){return $(this).data('value') == value});
          
          select.val(value);
          options.not(option).removeClass(__class(data, 'selected'));
          option.addClass(__class(data, 'selected'));
          
          __title($(this));
          
          $(this).select('close');
          
        }
      )
      
    }
    
  }

  $.fn.select = function(method) {  
    
    if (methods[method]) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    }
    
  };

  function __create (data) {
    
    var options = data.options,
        select,
        option;
        
    select = $('<select />');
    select.attr('name', data.name);
    
    options.each (
      function () {
        option = $('<option />');
        option.html($(this).html());
        option.attr('value', $(this).data('value'));
        select.append(option);
      }
    )
    
    return select;
    
  }
  
  function __bind (el) {
    
    var data = el.data('select'),
        options = data.options,
        title = el.find('[data-title]');
    
    // click item
    options.bind('click',
      function () {
        el.select('change', $(this).data('value'));
      }
    )
    
    // toggle title
    title.bind('click',
      function () {
        el.select('toggle');
      }
    )
    
    // close when click outside
    el.bind('click',
      function (e) {
        e.stopPropagation();
      }
    )
    
    $('html').bind('click',
      function (e) {
        el.select('close');
      }
    )
    
  }
  
  function __title (el) {
    
    var data = el.data('select'),
        title = el.find('[data-title]'),
        options = el.find('[data-value]'),
        selected = options.filter(function(){return $(this).hasClass(__class(data, 'selected'))});
        
    if (selected.length) {
      title.html(selected.html());
    } else {
      title.html(options.first().html());
    }
    
  }
  
  function __class (data, name) {
    if (data.settings.prefix.length) {
      return data.settings.prefix + '-' + name;
    }
    return name;
  }


})( jQuery );