/// <reference path="three.d.ts" />

var container, scene, camera, renderer, stats;
var mesh;

init();
animate();

// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();

	        var axes = new THREE.AxisHelper( 0 );
        scene.add(axes);

	// CAMERA
	var SCREEN_WIDTH = 1024, SCREEN_HEIGHT = 768;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,400);
	camera.lookAt(scene.position);

	// RENDERER
  renderer = new THREE.WebGLRenderer();
	renderer.setClearColorHex(0xEEEEEE, 1.0);
	renderer.shadowMapEnabled = true;
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	container = document.getElementById( 'sceneHolder' );
	container.appendChild( renderer.domElement );

	// LIGHT
	var light = new THREE.SpotLight(0xffffff);
	light.position.set(100,550,100);
	light.castShadow = true;
	scene.add(light);

	// FLOOR
	//var floorTexture = new THREE.ImageUtils.loadTexture('img/WoodFine0008_S.jpg');
	//floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	//floorTexture.repeat.set( 10, 10 );
	//var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -50;
	floor.rotation.x = Math.PI / 2;
	floor.rotation.z = 67.5;
	floor.receiveShadow  = true;
	scene.add(floor);

	// SKYBOX
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	scene.add(skyBox);
	
	////////////
	// CUSTOM //
	////////////
	
	var geometry = new THREE.CubeGeometry( 100, 100, 100, 1, 1, 1 );
	var material = new THREE.MeshLambertMaterial( { color: 0xd6ccbe } );
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.set(0,60,50);
	mesh.castShadow = true;
	scene.add(mesh);
	
}

//helpers
var rotObjectMatrix;
function rotateAroundObjectAxis (object, axis, radians) {
  rotObjectMatrix = new THREE.Matrix4();
  rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
  object.matrix.multiply(rotObjectMatrix);
  object.rotation.setFromRotationMatrix(object.matrix);
}

var rotWorldMatrix;      
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
}

function updateMaterial (material) {
	var newMaterial = material;
	mesh.material = newMaterial;
	mesh.material.needsUpdate = true;
}

function animate() 
{

  requestAnimationFrame( animate );
  render();		
}

var fov = camera.fov, zoom = 1.0, inc = -0.01;

function render() 
{
	/*
  camera.fov = fov * zoom;
  camera.updateProjectionMatrix();
  zoom += inc;
  if ( zoom <= 0.2 || zoom >= 1.0 ) {
     inc = -inc;
  }
  */
	renderer.render( scene, camera );
}