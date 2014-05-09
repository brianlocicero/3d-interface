$(function() {

	//defaults
  $("a#rotate").addClass("active");
  $(".main .model .sceneHolder").addClass("rotate");

  //disable "bounce"
  $(document).bind(
        'touchmove',
            function(e) {
              e.preventDefault();
            }
  );

  //get this out of global scope
  menu = {};

  //for hammer
  menu.rotateButton = document.getElementById("rotate");
  menu.materialsButton = document.getElementById("materials");
  menu.sceneHolder = document.getElementById("sceneHolder");

  //taps
  menu.rotateButtonTap = Hammer( menu.rotateButton ).on("tap", function(event) {
  	$("a").removeClass("active");
    $("a#rotate").addClass("active");
  	$(".main .model .sceneHolder").addClass("rotate");
  	$(".main .model .sceneHolder").removeClass("rotating");
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
    $(".main .model .sceneHolder img").removeClass("selected");
    $(".main .model .sceneHolder img." + myMaterialName + "").addClass("selected");
  });

  //drag events
  menu.sceneHolderDragStart = Hammer( menu.sceneHolder ).on("dragstart", function(event) {
  	//nothing yet
  });

  menu.sceneHolderDragStart = Hammer( menu.sceneHolder ).on("drag", function(event) {
  	$(".main .model .sceneHolder").removeClass("rotate");
  	$(".main .model .sceneHolder").addClass("rotating");
    $("#dragDistance").val( "" + Math.floor( event.gesture.distance ) + "");
    $("#dragAngle").val( "" + Math.floor( event.gesture.angle ) + "");
    $("#dragDirection").val( "" + event.gesture.direction + "");

    var dragAngle = Math.floor( event.gesture.angle );

    if ( dragAngle < 0 ) {
      mesh.rotation.x -= .1;
    } 

    if ( dragAngle > 0 ) {
      mesh.rotation.x += .1;
    }

    if ( event.gesture.direction == "right" ) {
      mesh.rotation.y -= .1;
    }

    if ( event.gesture.direction == "left" ) {
      mesh.rotation.y += .1;
    }

  });

  menu.sceneHolderDragEnd = Hammer( menu.sceneHolder ).on("dragend", function(event) {
  	$(".main .model .sceneHolder").removeClass("rotating");
  	$(".main .model .sceneHolder").addClass("rotate");
  });

});