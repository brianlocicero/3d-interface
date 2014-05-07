$(function() {

	//defaults
  $("a#rotate").addClass("active");
  $(".main .model .imageHolder").addClass("rotate");

  //disable "bounce"
  $(document).bind(
        'touchmove',
            function(e) {
              e.preventDefault();
            }
  );

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
		//nothing at the moment
  });

  $('a#materials').magnificPopup({ 
      items: {
        src: $(".materialsOverlay"), // can be a HTML string, jQuery object, or CSS selector
        type: 'inline'
      },
      mainClass: 'mfp-fade',
      removalDelay: 300,
      callbacks: {
        open: function () {
          $("a").removeClass("active");
          $("a#materials").addClass("active");
        },
        close: function () {
          $("a").removeClass("active");
          $("a#rotate").addClass("active");
        }
      }
  });

  //materials
  $("ul.materials li").click( function(index) {
    console.log( $(this).data("material") );
    var myMaterialName = $(this).data("material");

    $("ul.materials li").removeClass("selected");
    $(this).addClass("selected");
    $(".main .model .imageHolder img").removeClass("selected");
    $(".main .model .imageHolder img." + myMaterialName + "").addClass("selected");
  });

  //drag events
  menu.imageHolderDragStart = Hammer( menu.imageHolder ).on("dragstart", function(event) {
  	//nothing yet
  });

  menu.imageHolderDragStart = Hammer( menu.imageHolder ).on("drag", function(event) {
  	$(".main .model .imageHolder").removeClass("rotate");
  	$(".main .model .imageHolder").addClass("rotating");
    $("#dragDistance").val( "" + Math.floor( event.gesture.distance ) + "");
    $("#dragAngle").val( "" + Math.floor( event.gesture.angle ) + "");
    $("#dragDirection").val( "" + event.gesture.direction + "");
  });

  menu.imageHolderDragEnd = Hammer( menu.imageHolder ).on("dragend", function(event) {
  	$(".main .model .imageHolder").removeClass("rotating");
  	$(".main .model .imageHolder").addClass("rotate");
  });

});