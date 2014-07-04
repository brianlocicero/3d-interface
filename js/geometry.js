/// <reference path="three.d.ts" />
var PCamera = (function () {
    function PCamera(screenWidth, screenHeight, near, far, angle, position) {
        this.screenHeight = screenHeight;
        this.screenWidth = screenWidth;
        this.near = near;
        this.far = far;
        this.angle = angle;
        this.position = position;
        this.aspect = screenWidth / screenWidth;
    }
    PCamera.prototype.addCamera = function (scene) {
        this.camera = new THREE.PerspectiveCamera(this.angle, this.aspect, this.near, this.far);
        this.camera.position.set(this.position[0], this.position[1], this.position[2]);
        this.scene = scene;
        this.scene.add(this.camera);
        this.camera.lookAt(this.scene.position);
    };

    PCamera.prototype.getCamera = function () {
        return this.camera;
    };
    return PCamera;
})();

var WebGLRenderer = (function () {
    function WebGLRenderer(color, opacity, shadowMapEnabled, screenWidth, screenHeight) {
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
    WebGLRenderer.prototype.getRenderer = function () {
        return this.renderer;
    };
    return WebGLRenderer;
})();

var SLight = (function () {
    function SLight(color, position, castShadow) {
        this.color = color;
        this.position = position;
        this.castShadow = castShadow;
        this.light = new THREE.SpotLight(color);
        this.light.position.set(this.position[0], this.position[1], this.position[2]);
        this.light.castShadow = this.castShadow;
    }
    SLight.prototype.addLight = function (scene) {
        this.scene = scene;
        this.scene.add(this.light);
    };

    SLight.prototype.getLight = function () {
        return this.light;
    };
    return SLight;
})();

var Floor = (function () {
    function Floor(texturePath, size, rotationX, positionY, rotationZ, receiveShadow) {
        this.texturePath = texturePath;
        this.size = size;
        this.rotationX = rotationX;
        this.positionY = positionY;
        this.rotationZ = rotationZ;
        this.receiveShadow = receiveShadow;
        this.texture = THREE.ImageUtils.loadTexture(this.texturePath);
        this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(10, 10);
        this.material = new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide });
        this.geometry = new THREE.PlaneGeometry(this.size[0], this.size[1], this.size[2], this.size[3]);
        this.floor = new THREE.Mesh(this.geometry, this.material);
        this.floor.rotation.x = this.rotationX;
        this.floor.position.y = this.positionY;
        this.floor.rotation.z = this.rotationZ;
        this.floor.receiveShadow = this.receiveShadow;
    }
    Floor.prototype.addFloor = function (scene) {
        this.scene = scene;
        this.scene.add(this.floor);
    };

    Floor.prototype.getFloor = function () {
        return this.floor;
    };
    return Floor;
})();

var myCamera = new PCamera(1024, 768, 0.1, 20000, 45, [0, 150, 400]);
var myRenderer = new WebGLRenderer(0xEEEEEE, 1.0, true, 1024, 768);
var myLight = new SLight(0xFFFFFF, [100, 550, 100], true);
var myFloor = new Floor('img/WoodFine0008_S.jpg', [1000, 1000, 10, 10], Math.PI / 2, -50, 67.5, true);

var container, scene, renderer, stats;
var mesh;

init();
animate();

// FUNCTIONS
function init() {
    // SCENE
    scene = new THREE.Scene();
    var axes = new THREE.AxisHelper(0);
    scene.add(axes);

    myCamera.addCamera(scene);
    myLight.addLight(scene);
    myFloor.addFloor(scene);

    container = document.getElementById('sceneHolder');
    container.appendChild(myRenderer.getRenderer().domElement);

    // SKYBOX
    var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });
    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    scene.add(skyBox);

    ////////////
    // CUSTOM //
    ////////////
    var geometry = new THREE.CubeGeometry(100, 100, 100, 1, 1, 1);
    var material = new THREE.MeshLambertMaterial({ color: 0xd6ccbe });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 60, 50);
    mesh.castShadow = true;
    scene.add(mesh);
}

//helpers
var rotObjectMatrix;
function rotateAroundObjectAxis(object, axis, radians) {
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

function updateMaterial(material) {
    var newMaterial = material;
    mesh.material = newMaterial;
    mesh.material.needsUpdate = true;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    myRenderer.getRenderer().render(scene, myCamera.getCamera());
}
