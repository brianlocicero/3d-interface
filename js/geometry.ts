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
	private scene:any;
	private fov:number; 

	constructor (screenWidth:number, screenHeight:number, near:number, far:number, angle:number, position:number[]) {
		this.screenHeight = screenHeight;
		this.screenWidth = screenWidth;
		this.near = near;
		this.far = far;
		this.angle = angle;
		this.position = position;
		this.aspect = screenWidth/screenWidth;
	}

	public addCamera(scene:any):void {
		this.camera = new THREE.PerspectiveCamera(this.angle, this.aspect, this.near, this.far);
		this.camera.position.set( this.position[0], this.position[1], this.position[2] );
		this.scene = scene;
		this.scene.add(this.camera);
		this.camera.lookAt(this.scene.position);
		this.fov = this.camera.fov;
	}

	public getCamera():any {
		return this.camera;
	}

	public getFov():number {
		return this.camera.fov;
	}

	public setFov(fov:number) {
		this.camera.fov = fov;
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

class CGeometry {

	private cubeVars:number[];
	private cubeGeometry:any;

	constructor(cubeVars:number[]) {
		this.cubeVars = cubeVars;
		this.cubeGeometry = new THREE.CubeGeometry( 100, 100, 100, 1, 1, 1 );
		return this.cubeGeometry;
	}
}

class LMaterial {

	private lambertMaterial:any;
	private materialColor:any;

	constructor(materialColor:any) {
		this.materialColor = materialColor;
		this.lambertMaterial = new THREE.MeshLambertMaterial( { color: this.materialColor } );
		return this.lambertMaterial;
	}
}

class Mesh {

	private mesh:any;
	private geometry:any;
	private material:any;
	private castShadow:boolean;
	private position:number[];
	private scene:any;

	constructor(geometry:any, material:any, castShadow:boolean) {
		this.geometry = geometry;
		this.material = material;
		this.castShadow = castShadow;
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.castShadow = this.castShadow;
	}

	addMesh(scene:any) {
		this.scene = scene;
		scene.add(this.mesh);
	}

	getMesh():any {
		return this.mesh;
	}

	setPosition(position:number[]) {
		this.position = position;
		this.mesh.position.set(position[0], position[1], position[2]);
	}
}

class Scene {
	private scene;
	private axes;
	private axesHelper:boolean;

	constructor(axesHelper:boolean) {
		this.scene = new THREE.Scene();
		this.axesHelper = axesHelper;
		if (axesHelper) {
			this.axes = new THREE.AxisHelper( 0 );
			this.scene.add(this.axes);
		}
		return this.scene;
	}

	public addToScene(mesh:any):any {
		this.scene.add(mesh);
	}
}
