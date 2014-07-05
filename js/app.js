/// <reference path="jquery.d.ts" />
/// <reference path="three.d.ts" />
/// <reference path="hammer.d.ts" />
/// <reference path="geometry.ts" />
var pinched = false;
var zooming = false;
var zoomValue = 1.0;
var zoomInterval;
var container;

// geometry classes
var myCamera = new PCamera(1024, 768, 0.1, 20000, 45, [0, 150, 400]);
var myRenderer = new WebGLRenderer(0xEEEEEE, 1.0, true, 1024, 768);
var myLight = new SLight(0xFFFFFF, [100, 550, 100], true);
var myFloor = new Floor('img/WoodFine0008_S.jpg', [1000, 1000, 10, 10], Math.PI / 2, -50, 67.5, true);
var myCube = new CGeometry([100, 100, 100]);
var myMaterial = new LMaterial(0xf2f2f2);
var myMesh = new Mesh(myCube, myMaterial, true);
var myScene = new Scene(true);

//geometry instances
myCamera.addCamera(myScene);
myLight.addLight(myScene);
myFloor.addFloor(myScene);
myMesh.setPosition([0, 60, 50]);
myMesh.addMesh(myScene);

//DOM
container = document.getElementById('sceneHolder');
container.appendChild(myRenderer.getRenderer().domElement);

//Three.JS
function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    myRenderer.getRenderer().render(myScene, myCamera.getCamera());
}

//Rotate & Zoom Helpers
function rotateAroundWorldAxis(axis, radians) {
    var rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(myMesh.getMesh().matrix);
    myMesh.getMesh().matrix = rotWorldMatrix;
    myMesh.getMesh().rotation.setFromRotationMatrix(myMesh.getMesh().matrix);
}

function zoomIn() {
    /*
    zoomValue -= .01;
    
    if (zoomValue <= .5) {
    clearInterval(zoomInterval);
    zooming = false;
    return;
    }
    myCamera.setFov(myCamera.getFov() * zoomValue);
    myCamera.getCamera().updateProjectionMatrix();
    */
    myCamera.setFov(45);
}

function zoomOut() {
    /*
    zoomValue += .01;
    if (zoomValue >= 1) {
    clearInterval(zoomInterval);
    zooming = false;
    return;
    }
    myCamera.setFov(myCamera.getFov() * zoomValue);
    myCamera.getCamera().updateProjectionMatrix();
    */
}

//Hammer Touch Menu
var sceneHolderDrag = Hammer(document.getElementById("sceneHolder")).on("drag", function (event) {
    //problem: cannot access mesh within Hammer, forcing hard-code
    if (event.gesture.direction == "up") {
        var xAxisUp = new THREE.Vector3(1, 0, 0);
        rotateAroundWorldAxis(xAxisUp, -(Math.PI / 180) * 2);
    }

    if (event.gesture.direction == "down") {
        var xAxisDown = new THREE.Vector3(1, 0, 0);
        rotateAroundWorldAxis(xAxisDown, Math.PI / 180 * 2);
    }

    if (event.gesture.direction == "right") {
        var yAxisRight = new THREE.Vector3(0, 1, 0);
        rotateAroundWorldAxis(yAxisRight, Math.PI / 180 * 2);
    }

    if (event.gesture.direction == "left") {
        var yAxisLeft = new THREE.Vector3(0, 1, 0);
        rotateAroundWorldAxis(yAxisLeft, -(Math.PI / 180) * 2);
    }
});

var sceneHolderDoubleTap = Hammer(document.getElementById("sceneHolder")).on("doubletap", function (event) {
    if (pinched) {
        myCamera.setFov(45);
        myCamera.getCamera().updateProjectionMatrix();
        pinched = false;
        return;
    }

    if (!zooming) {
        if (zoomValue === 1) {
            zoomInterval = setInterval(zoomIn, 10);
            zooming = true;
        } else {
            zoomInterval = setInterval(zoomOut, 10);
            zooming = true;
        }
    }
});

var sceneHolderPinchIn = Hammer(document.getElementById("sceneHolder")).on("pinchin", function (event) {
    //$("#pinchScale").val( "" + event.gesture.scale + "");
    myCamera.setFov(myCamera.getFov() * event.gesture.scale);
    myCamera.getCamera().updateProjectionMatrix();
    pinched = true;
});

var sceneHolderPinchOut = Hammer(document.getElementById("sceneHolder")).on("pinchout", function (event) {
    //$("#pinchScale").val( "" + event.gesture.scale + "");
    myCamera.setFov(myCamera.getFov() * event.gesture.scale);
    myCamera.getCamera().updateProjectionMatrix();
    pinched = true;
});

//disable "bounce"
$(document).bind('touchmove', function (e) {
    e.preventDefault();
});

//begin
animate();
