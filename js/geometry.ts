/// <reference path="three.d.ts" />

class PCamera {
	private camera:any;
	private screenWidth:number;
	private screenHeight:number;
	private near:number;
	private far:number;
	private angle:number;
	private position:number[];
	private aspect:number;
	public scene:any;

	constructor (screenWidth:number, screenHeight:number, near:number, far:number, angle:number, position:number[]) {
		this.screenHeight = screenHeight;
		this.screenWidth = screenWidth;
		this.near = near;
		this.far = far;
		this.angle = angle;
		this.position = position;
		this.aspect = screenWidth/screenWidth;
	}

	addCamera(scene:any):void {
		this.camera = new THREE.PerspectiveCamera(this.angle, this.aspect, this.near, this.far);
		this.camera.position.set( this.position[0], this.position[1], this.position[2] );
		this.scene = scene;
		this.scene.add(this.camera);
		this.camera.lookAt(this.scene.position);
	}

	getCamera():any {
		return this.camera;
	}
}

class WebGLRenderer {
	private renderer:any;
	private color:any;
	private opacity:number;
	private shadowMapEnabled:boolean;
	private screenWidth:number;
	private screenHeight:number;

	constructor (color:any, opacity:number, shadowMapEnabled:boolean, screenWidth:number, screenHeight:number) {
		this.color = color;
		this.opacity = opacity;
		this.shadowMapEnabled = shadowMapEnabled;
		this.screenWidth = screenWidth;
		this.screenHeight = screenHeight;
  	this.renderer = new THREE.WebGLRenderer();
  	this.renderer.setClearColorHex(this.color, this.opacity);
  	this.renderer.shadowMapEnabled = true;
  	this.renderer.setSize(this.screenWidth, this.screenHeight);
	}

	getRenderer():any {
		return this.renderer;
	}
}

class SLight {
	private light:any;
	private color:any;
	private position:number[];
	private castShadow:boolean;
	private scene:any;

	constructor(color:any, position:number[], castShadow:boolean) {
		this.color = color;
		this.position = position;
		this.castShadow = castShadow;
		this.light = new THREE.SpotLight(color);
		this.light.position.set( this.position[0], this.position[1], this.position[2] );
		this.light.castShadow = this.castShadow;
	}

	addLight(scene:any):void {
		this.scene = scene;
		this.scene.add(this.light);
	}

	getLight():any {
		return this.light;
	}
}

class Floor {

	private floor:any;
	private texture:any;
	private texturePath:string;
	private material:any;
	private geometry:any;
	private size:number[];
	private receiveShadow:boolean;
	private rotationX:number;
	private positionY:number;
	private rotationZ:number;
	private scene:any;

	constructor (texturePath:string, size:number[], rotationX:number, positionY:number, rotationZ:number, receiveShadow:boolean) {
		this.texturePath = texturePath;
		this.size = size;
		this.rotationX = rotationX;
		this.positionY = positionY;
		this.rotationZ = rotationZ;
		this.receiveShadow = receiveShadow;
		this.texture = THREE.ImageUtils.loadTexture(this.texturePath);
		this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
		this.texture.repeat.set(10, 10);
		this.material = new THREE.MeshBasicMaterial( {map: this.texture, side: THREE.DoubleSide} );
		this.geometry = new THREE.PlaneGeometry(this.size[0], this.size[1], this.size[2], this.size[3]);
		this.floor = new THREE.Mesh(this.geometry, this.material);
		this.floor.rotation.x = this.rotationX;
		this.floor.position.y = this.positionY;
		this.floor.rotation.z = this.rotationZ;
		this.floor.receiveShadow = this.receiveShadow;
	}

	addFloor(scene:any) {
		this.scene = scene;
		this.scene.add(this.floor);
	}

	getFloor():any {
		return this.floor;
	}

}

var myCamera = new PCamera(1024, 768, 0.1, 20000, 45, [0, 150, 400]);
var myRenderer = new WebGLRenderer(0xEEEEEE, 1.0, true, 1024, 768);
var myLight = new SLight(0xFFFFFF, [100, 550, 100], true);
var myFloor = new Floor('img/WoodFine0008_S.jpg', [1000, 1000, 10, 10], Math.PI/2, -50, 67.5, true);

var container, scene, renderer, stats;
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

	myCamera.addCamera(scene);
	myLight.addLight(scene);
	myFloor.addFloor(scene);

	container = document.getElementById( 'sceneHolder' );
	container.appendChild( myRenderer.getRenderer().domElement );



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

function render() 
{
	myRenderer.getRenderer().render( scene, myCamera.getCamera() );
}