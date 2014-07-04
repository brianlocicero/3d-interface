/// <reference path="jquery.d.ts" />
/// <reference path="three.d.ts" />
/// <reference path="geometry.ts" />
/// <reference path="hammer.d.ts" />

declare var menu;

class RotateMenu {

  private rotateButton:any;

  constructor (rotateButton:any) {
    this.rotateButton = rotateButton;
  }

}

var rotateMenu = new RotateMenu( document.getElementById("rotate") );
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

  /*
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
  */

  //materials
  $("ul.materials li").click( function(index) {
    var myMaterialName = $(this).data("material");
    var myMaterialColor = Number( $(this).data("color") );

    var newMaterial = new THREE.MeshLambertMaterial( { color: myMaterialColor } );
    updateMaterial( newMaterial );

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
    //$("#dragDistance").val( "" + Math.floor( event.gesture.distance ) + "");
    //$("#dragAngle").val( "" + Math.floor( event.gesture.angle ) + "");
    //$("#dragDirection").val( "" + event.gesture.direction + "");

    //var yAxis = new THREE.Vector3(0,1,0);
    //rotateAroundObjectAxis(mesh, yAxis, -(Math.PI / 180) );

    if ( event.gesture.direction == "up" ) {
      var xAxisUp = new THREE.Vector3(1,0,0);
      rotateAroundWorldAxis(mesh, xAxisUp, -(Math.PI / 180) * 2);
    } 

    if ( event.gesture.direction == "down" ) {
      var xAxisDown = new THREE.Vector3(1,0,0);
      rotateAroundWorldAxis(mesh, xAxisDown, Math.PI / 180 * 2);
    }

    if ( event.gesture.direction == "right" ) {
      var yAxisRight = new THREE.Vector3(0,1,0);
      rotateAroundWorldAxis(mesh, yAxisRight, Math.PI / 180 * 2 );
    }

    if ( event.gesture.direction == "left" ) {
      var yAxisLeft = new THREE.Vector3(0,1,0);
      rotateAroundWorldAxis(mesh, yAxisLeft, -(Math.PI / 180) * 2);
    }

  });

  menu.sceneHolderDragEnd = Hammer( menu.sceneHolder ).on("dragend", function(event) {
  	$(".main .model .sceneHolder").removeClass("rotating");
  	$(".main .model .sceneHolder").addClass("rotate");
  });

  menu.zoomValue = 1;
  menu.pinched = false;
  menu.zooming = false;

  menu.zoomIn = function () {

    menu.zoomValue -= .01;
    if (menu.zoomValue <= .5) {
      clearInterval(menu.zoomInterval);
      menu.zooming = false;
      return;
    }
    camera.fov = fov * menu.zoomValue;
    camera.updateProjectionMatrix();
  }

  menu.zoomOut = function () {
    menu.zoomValue += .01;
    if (menu.zoomValue >= 1) {
      clearInterval(menu.zoomInterval);
      menu.zooming = false;
      return;
    }
    camera.fov = fov * menu.zoomValue;
    camera.updateProjectionMatrix(); 
  }

  menu.sceneHolderDoubleTap = Hammer( menu.sceneHolder ).on("doubletap", function(event) {

    if (menu.pinched) {
      camera.fov = 45;
      camera.updateProjectionMatrix();
      menu.pinched = false;
      return;
    }


    if ( !menu.zooming ) {
      if (menu.zoomValue === 1) {
        menu.zoomInterval = setInterval(menu.zoomIn, 10);
        menu.zooming = true;
      } else {
        menu.zoomInterval = setInterval(menu.zoomOut, 10);
        menu.zooming = true;
      }
    }

  });

  menu.sceneHolderDoubleTap = Hammer( menu.sceneHolder ).on("pinchin", function(event) {
    //$("#pinchScale").val( "" + event.gesture.scale + "");
    camera.fov = fov * event.gesture.scale;
    camera.updateProjectionMatrix();
    menu.pinched = true;
  });

  menu.sceneHolderDoubleTap = Hammer( menu.sceneHolder ).on("pinchout", function(event) {
    //$("#pinchScale").val( "" + event.gesture.scale + "");
    camera.fov = fov * event.gesture.scale;
    camera.updateProjectionMatrix();
    menu.pinched = true;
  });

