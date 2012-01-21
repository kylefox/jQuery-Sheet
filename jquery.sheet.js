(function($) {
  
  var sheet;
  
  function trigger() {
    $(document).trigger("sheet:" + arguments[0]);
  };
  
  $.fn.sheet = function(options) {
    
    var element = $($(this)[0]); // We can only sheet one element.
    
    function block() {
      sheet.blocker = $('<div id="jquery-sheet-blocker"></div>').css({
        top: 0, right: 0, bottom: 0, left: 0,
        width: "100%", height: "100%",
        position: "fixed",
        background: "url(" + sheet.options.directory + "overlay.png)"
      });
      $('body').append(sheet.blocker);
    };
    
    function load() {
      sheet.loader = $("<img>").attr('src', sheet.options.directory + "loader.gif").css({
        width: 32, height: 32,
        position: 'fixed',
        top: "50%", left: "50%",
        marginTop: -16, marginLeft: -16,
        padding: "8px",
        background: "#000",
        '-webkit-border-radius': 8
      });
      sheet.blocker.append(sheet.loader);
    };

    function open() {
      sheet.loader.remove();
      sheet.container = $('<div id="jquery-sheet-dropdown"></div>').css({
        position: 'fixed',
        left: "50%",
        '-webkit-box-shadow': '0px 3px 20px rgba(0,0,0,.75)',
        '-moz-box-shadow': '0px 3px 20px rgba(0,0,0,.75)'
      });
      sheet.element.show();
      if(sheet.element.parent()) {
        sheet.element.data('sheet:original_parent', sheet.element.parent());
      }
      sheet.container.append(sheet.element);
      sheet.blocker.append(sheet.container);
      var width = sheet.options.width,
          height = sheet.element.height();
      sheet.container.css({
        width: width,
        top: -height,
        marginLeft: -width/2,
      });
      sheet.container.animate({top:0}, sheet.options.duration, sheet.options.easing);
    };
    
    function onEscPress(event) {
      if (event.keyCode == 27) {
        $.fn.sheet.cancel();
      }
    };
    
    function init(e, o) {
      if(sheet) {
        // Close the existing sheet and when finished re-run this initializer.
        $.fn.sheet.close(function() { init(e, o); });
      } else {
        // No existing sheet.  Just open it already!
        sheet = {
          element: e,
          options: $.extend({}, $.fn.sheet.defaults, o)
        };
        block();
        load();
        open();
        $.fn.sheet.current = sheet;
      }
      
      $(document).bind('keyup', onEscPress);

    };
    
    init(element, options);
    
    return element;
    
  };
  
  $.fn.sheet.close = function(callback) {
    if(sheet === null) return;
    sheet.container.animate({top: -sheet.container.height()}, sheet.options.duration, sheet.options.easing, function() {
      if(sheet === null) return;
      if(sheet.element.data('sheet:original_parent')) {
        sheet.element.hide();
        sheet.element.appendTo(sheet.element.data('sheet:original_parent'));
      }
      sheet.container.remove();
      sheet.blocker.fadeOut(250, function() {
        if(sheet === null) return;
        sheet.blocker.remove();
        sheet = null;
        if(callback) callback();
        trigger('close');
      });
    });
  };
  
  $.fn.sheet.cancel = function() {
    trigger('cancel');
    $.fn.sheet.close();
  };
  
  // Default options
  $.fn.sheet.defaults = {
    directory: "",
    width: 600,
    minHeight: 20,
    duration: 300,
    easing: "swing"
  };
  
})(jQuery);