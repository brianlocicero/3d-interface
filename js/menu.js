$(function() {

	//defaults. just use jquery for basic dom stuff
  $(".main .model img").hide();
  $(".main .model img:eq(0)").show();
  $("a#rotate").addClass("active");
  $(".main .model .imageHolder").addClass("rotate");

  //get this out of global scope
  var menu = {}

  //for hammer
  menu.rotateButton = document.getElementById("rotate");
  menu.materialsButton = document.getElementById("materials");
  menu.imageHolder = document.getElementById("imageHolder");

  //taps
  menu.rotateButtonTap = Hammer( menu.rotateButton ).on("tap", function(event) {
  	$("a").removeClass("active");
    $("a#rotate").addClass("active");
  	$(".main .model .imageHolder").addClass("rotate");
  	$(".main .model .imageHolder").removeClass("rotating");
  });

  menu.materialsButtonTap = Hammer( menu.materialsButton ).on("tap", function(event) {
		//materials button opens menu
		$.magnificPopup.open({
		  items: {
		    src: $(".materialsOverlay"), // can be a HTML string, jQuery object, or CSS selector
		    type: 'inline'
		  },
		  mainClass: 'mfp-fade',
		  removalDelay: 300,
		  callbacks: {
		  	close: function () {
		  		//may want something here
		  	}
		  }
		});

  });

  //drag events
  menu.imageHolderDragStart = Hammer( menu.imageHolder ).on("dragstart", function(event) {
  	//nothing yet
  });

  menu.imageHolderDragStart = Hammer( menu.imageHolder ).on("drag", function(event) {
  	$(".main .model .imageHolder").removeClass("rotate");
  	$(".main .model .imageHolder").addClass("rotating");
  });

  menu.imageHolderDragEnd = Hammer( menu.imageHolder ).on("dragend", function(event) {
  	$(".main .model .imageHolder").removeClass("rotating");
  	$(".main .model .imageHolder").addClass("rotate");
  });

});