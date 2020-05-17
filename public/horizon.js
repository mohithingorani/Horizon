// Horizon.js

// essentials
// var gui = new dat.GUI();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100000 );
var renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
const loader = new THREE.TextureLoader();
var spriteMap = loader.load("assets/circle-64.png" );
const skyBoxTexture = loader.load('assets/outrun-small3.jpg');

var perlin = new THREE.ImprovedNoise();

var strDownloadMime = "image/octet-stream";

// set time and clocks
var date = new Date();

var currentTime = date.getTime();
var clock = new THREE.Clock();
clock.start();

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.gammaInput = true;
renderer.gammaOutput = true;
// renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild( renderer.domElement );
var trackBallControls = new THREE.TrackballControls( camera, renderer.domElement );

// dat.gui

// intialize three

var sphere = new THREE.SphereBufferGeometry( 1, 16, 8 );
var pointLight = new THREE.PointLight( 0xEE77DD, 2, 0 ,2 );
pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x111111 } ) ) );
scene.add( pointLight );

var spotLight = new THREE.SpotLight( 0x770000, 2);
spotLight.position.set( 0,0,200 );
spotLight.target.position.set( 0 , 0 , -400 );
spotLight.castShadow = true;
scene.add( spotLight.target );
scene.add( spotLight );



var cylinderTerrainMaterial = new THREE.MeshLambertMaterial( { color: 0x449911, emissive: 0x6677DD,  side: THREE.DoubleSide, transparent: true, opacity: 1.0, wireframe: false } );
var cylinderTerrainGeometry = new THREE.CylinderGeometry(30,30,900,32,60,true); // - 1 since it uses segments - keeps the math straight // 300,300,2000,100,100
var cylinderTerrainMesh = new THREE.Mesh( cylinderTerrainGeometry, cylinderTerrainMaterial );
cylinderTerrainMesh.rotateX( - Math.PI / 2 );
var backupGeometry = cylinderTerrainGeometry.clone();

init();
animate();

// threejs init function

function init(){
    camera.position.set(0,0,100);
    trackBallControls.rotateSpeed = 4;
    trackBallControls.zoomSpeed = 1;

    scene.add(cylinderTerrainMesh);
}

// threejs animate function

function animate() {
    requestAnimationFrame(animate);
    trackBallControls.update();
    scene.background = new THREE.Color(0xFFFFFF);

    var time = Date.now() * 0.0005;
    pointLight.position.x = Math.sin( time * 0.7 ) * 60;
    pointLight.position.y = Math.cos( time * 0.5 ) * 60;
    pointLight.position.z = Math.cos( time * 0.3 ) * 200;


    // cylinderTerrainGeometry.vertices = newCylinderVertices;
    for ( var i = 0; i < cylinderTerrainGeometry.vertices.length; i ++ ) {
        // var startMillis = date.getMilliseconds();
        var CNFrequency = Date.now()/100000 * 100;
        var CNAmplitude = 0.5;
        var CNDistortion = 600;

        var x = 0.5 + 0.5 * Math.sin(CNFrequency + i%CNDistortion);
        var y = 0.5 + 0.5 * Math.cos(CNFrequency + i/CNDistortion);
        var z = x * y / 3;

        var perlinNoise = CNAmplitude * perlin.noise(x, y, z);

        cylinderTerrainGeometry.vertices[i].x = backupGeometry.vertices[i].x * (1 + perlinNoise);
        cylinderTerrainGeometry.vertices[i].z = backupGeometry.vertices[i].z * (1 + perlinNoise);
    }

    cylinderTerrainGeometry.verticesNeedUpdate = true;
    cylinderTerrainGeometry.computeVertexNormals();
    cylinderTerrainGeometry.computeFaceNormals();
    render();
};

// threejs render function

function render() { 
    renderer.render( scene, camera );
}

window.addEventListener( 'resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}, false );
