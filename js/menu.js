/// <reference path="jquery.d.ts" />
/// <reference path="three.d.ts" />
/// <reference path="hammer.d.ts" />
/// <reference path="geometry.ts" />
var RotateMenu = (function () {
    function RotateMenu(zoomValue) {
        this.zoomValue = 1;
        this.pinched = false;
        this.zooming = false;
        //hammer
        this.sceneHolderDrag = Hammer(document.getElementById("sceneHolder")).on("drag", function (event) {
            if (event.gesture.direction == "up") {
                var xAxisUp = new THREE.Vector3(1, 0, 0);
                rotateAroundWorldAxis(mesh, xAxisUp, -(Math.PI / 180) * 2);
            }

            if (event.gesture.direction == "down") {
                var xAxisDown = new THREE.Vector3(1, 0, 0);
                rotateAroundWorldAxis(mesh, xAxisDown, Math.PI / 180 * 2);
            }

            if (event.gesture.direction == "right") {
                var yAxisRight = new THREE.Vector3(0, 1, 0);
                rotateAroundWorldAxis(mesh, yAxisRight, Math.PI / 180 * 2);
            }

            if (event.gesture.direction == "left") {
                var yAxisLeft = new THREE.Vector3(0, 1, 0);
                rotateAroundWorldAxis(mesh, yAxisLeft, -(Math.PI / 180) * 2);
            }
        });
        this.sceneHolderDragEnd = Hammer(document.getElementById("sceneHolder")).on("dragend", function (event) {
            //nothing at the moment
        });
        this.sceneHolderDoubleTap = Hammer(document.getElementById("sceneHolder")).on("doubletap", function (event) {
            if (this.pinched) {
                camera.fov = 45;
                camera.updateProjectionMatrix();
                this.pinched = false;
                return;
            }

            if (!this.zooming) {
                if (this.zoomValue === 1) {
                    this.zoomInterval = setInterval(this.zoomIn, 10);
                    this.zooming = true;
                } else {
                    this.zoomInterval = setInterval(this.zoomOut, 10);
                    this.zooming = true;
                }
            }
        });
        this.sceneHolderPinchIn = Hammer(document.getElementById("sceneHolder")).on("pinchin", function (event) {
            //$("#pinchScale").val( "" + event.gesture.scale + "");
            camera.fov = fov * event.gesture.scale;
            camera.updateProjectionMatrix();
            this.pinched = true;
        });
        this.sceneHolderPinchOut = Hammer(document.getElementById("sceneHolder")).on("pinchout", function (event) {
            //$("#pinchScale").val( "" + event.gesture.scale + "");
            camera.fov = fov * event.gesture.scale;
            camera.updateProjectionMatrix();
            this.pinched = true;
        });
        this.zoomValue = zoomValue;
    }
    RotateMenu.prototype.zoomIn = function () {
        this.zoomValue -= .01;

        if (this.zoomValue <= .5) {
            clearInterval(this.zoomInterval);
            this.zooming = false;
            return;
        }
        camera.fov = fov * this.zoomValue;
        camera.updateProjectionMatrix();
    };

    RotateMenu.prototype.zoomOut = function () {
        this.zoomValue += .01;
        if (this.zoomValue >= 1) {
            clearInterval(this.zoomInterval);
            this.zooming = false;
            return;
        }
        camera.fov = fov * this.zoomValue;
        camera.updateProjectionMatrix();
    };
    return RotateMenu;
})();

var rotateMenu = new RotateMenu(1);

//disable "bounce"
$(document).bind('touchmove', function (e) {
    e.preventDefault();
});
