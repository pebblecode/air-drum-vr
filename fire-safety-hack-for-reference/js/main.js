//
// CREATE THE SCENE
//

var TARGET_BOUNDS_TO_HAND_THRESHOLD = 0.5;

var isVRMode = false,
    isCompleted = false,
    isFirstExtinguisherSpray = true;

var scene = new THREE.Scene(),
    overlayScene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);

var canvas = document.getElementById('scene');
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;

var renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
    clearColor: new THREE.Color(0xCCCCCC)
});

renderer.autoClear = false;

var objLoader = new THREE.OBJLoader(),
    objMtlLoader = new THREE.OBJMTLLoader(),
    objectLoader = new THREE.ObjectLoader();

renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);

onResize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', onResize, false);


var ambientLight = new THREE.AmbientLight( 0xFFFFFF );
scene.add( ambientLight );

var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.1 );

directionalLight.position.set( 45, 45, 0 );
directionalLight.target.position.set( 25, -10, 0 );

directionalLight.castShadow = true;
//directionalLight.onlyShadow = true;

directionalLight.shadowCameraNear = camera.near;
directionalLight.shadowCameraFar = camera.far;
directionalLight.shadowCameraFov = 50;
directionalLight.shadowCameraLeft = -40;
directionalLight.shadowCameraRight = 40;
directionalLight.shadowCameraTop = 25;
directionalLight.shadowCameraBottom = -60;
//directionalLight.shadowCameraVisible = true;

directionalLight.shadowDarkness = 0.35;

scene.add( directionalLight );
scene.add( directionalLight.target );

var spotLight1 = new THREE.SpotLight( 0xFFFFFF, 0.8, Math.PI / 3),
    spotLight2 = new THREE.SpotLight( 0xFFFFFF, 0.1, Math.PI / 2);

spotLight1.castShadow = true;
spotLight1.onlyShadow = true;
spotLight1.shadowCameraNear = camera.near;

spotLight1.position.set( 10, 15, 0);
spotLight1.target.position.set( -5, -10, 0 );
//spotLight1.shadowCameraVisible = true;

/*
spotLight2.castShadow = true;
spotLight2.onlyShadow = true;
spotLight2.shadowCameraNear = camera.near;

spotLight2.position.set( 90, 55, 0 );
spotLight2.target.position.set( 70, -10, 0 );
spotLight2.shadowCameraVisible = true;
*/

scene.add( spotLight1 );
scene.add( spotLight1.target );

/*
scene.add( spotLight2 );
scene.add( spotLight2.target );
*/

/*
var overlay = document.getElementById('overlay'),
    startButton = document.getElementById('startButton'),
    timer = document.getElementById('timer'),
    timerInterval,
    timeLeft = 60;

startButton.onclick = function() {
    isRunning = true;
    overlay.style.display = 'none';
    timer.innerHTML = timeLeft;
    timerInterval = window.setInterval(function() {
        if( timeLeft > 0 ) {
            timeLeft--;
            timer.innerHTML = timeLeft;
        }
    }, 1000);
};

function completed() {
    overlay.innerHTML = '<h2>Well done!</h2><button>Next stage</button>';
    overlay.style.display = 'block';
    clearInterval(timerInterval);
}
*/

var successTextGeo = new THREE.TextGeometry( 'Well done!', {

    size: 1,
    height: 0.01,
    curveSegments: 4,

    font: 'droid sans',
    weight: 'normal',
    style: 'normal'

    //bevelThickness: 0.1,
    //bevelSize: 0.05,
    //bevelEnabled: true

});

var nextRoundTextGeo = new THREE.TextGeometry( 'Thumbs up to proceed to next stage', {
    size: 0.6,
    height: 0.01,
    curveSegments: 4,
    font: 'droid sans',
    weight: 'normal',
    style: 'normal'
});

var successText = new THREE.Mesh( successTextGeo, new THREE.MeshBasicMaterial({color: 0xff6b2a})),
    nextRoundText = new THREE.Mesh( nextRoundTextGeo, new THREE.MeshBasicMaterial({color: 0xff6b2a}));

successTextGeo.computeBoundingBox();
nextRoundTextGeo.computeBoundingBox();

var successTextCenterOffset = -0.5 * ( successTextGeo.boundingBox.max.x - successTextGeo.boundingBox.min.x ),
    nextRoundTextCenterOffset = -0.5 * ( nextRoundTextGeo.boundingBox.max.x - nextRoundTextGeo.boundingBox.min.x );


function completed() {

    FireEmitter.disable();

    updateCompletedTextPosition();

    overlayScene.add( successText );
    overlayScene.add( nextRoundText );

    isCompleted = true;

}

function updateCompletedTextPosition() {

    var vector = new THREE.Vector3( 0, 0, -15 );
    vector.applyQuaternion( camera.quaternion );

    successText.position.copy( vector );
    nextRoundText.position.copy( vector );

    successText.rotation.copy( camera.rotation );
    nextRoundText.rotation.copy( camera.rotation );

    successText.translateX( successTextCenterOffset );
    successText.translateY( 0.5 );

    nextRoundText.translateX( nextRoundTextCenterOffset );
    nextRoundText.translateY( -0.5 );

}

// XXX testing
/*
window.setTimeout(function() {
    completed();
}, 4000);
*/

//
// TODO Loading progress
//
//

/*
THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {

    console.log( item, loaded, total );

};
*/

//
// ADD SCENE MODELS
//
//

// Office (walls, floor, ceiling)

var textureWall1 = new THREE.ImageUtils.loadTexture('models/room/wall1.png'),
    textureWall2 = new THREE.ImageUtils.loadTexture('models/room/wall2.png'),
    textureWall3 = new THREE.ImageUtils.loadTexture('models/room/wall3.png'),
    textureWall4 = new THREE.ImageUtils.loadTexture('models/room/wall4.png'),
    textureFloor = new THREE.ImageUtils.loadTexture('models/room/carpet.png'),
    textureCeiling = new THREE.ImageUtils.loadTexture('models/room/ceiling.png');

textureFloor.wrapS = THREE.RepeatWrapping;
textureFloor.wrapT = THREE.RepeatWrapping;
//textureFloor.repeat.set(2, 2);

objectLoader.load( 'models/room/office-scene.json', function( obj ) {

    console.log( 'Scene load:', obj );
    scene.add( obj );

    for( var i=0; i < obj.children.length; i++ ) {

        // Move everything across and down
        var child = obj.children[i];
        child.position.x += 58;
        child.position.y -= 10;

        if( child.material ) {
            child.material.ambient = new THREE.Color(0x444444);
        }

        if( child.name == 'Wall1' ) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.map = textureWall1;
        } else if( child.name == 'Wall2' ) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.map = textureWall2;
        } else if( child.name == 'Wall3' ) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.map = textureWall3;
        } else if( child.name == 'Wall4' ) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.map = textureWall4;
        } else if( child.name == 'Floor' ) {
            //child.castShadow = true;
            child.receiveShadow = true;
            child.material.map = textureFloor;
        } else if( child.name == 'Ceiling' ) {
            child.material.map = textureCeiling;
        }

    }

});

// Wastepaper bin

var bin;

objLoader.load( 'models/furniture/bin.obj', function ( object ) {

    bin = object.children[0];

    bin.scale.set( 5, 5, 5 );
    bin.position.set( 3, -11.5, -30 );
    bin.material = new THREE.MeshPhongMaterial( {color: new THREE.Color(0xAAAAAA),
        ambient: new THREE.Color(0x333333), emissive: new THREE.Color(0x111111),
        metal: true } );
    bin.castShadow = true;
    bin.receiveShadow = true;

    scene.add( bin );

});

// Tables

var tables;

objMtlLoader.load( 'models/furniture/tables-few.obj', 'models/furniture/tables-few.mtl', function( object ) {

    tables = object.children[0];

    tables.scale.set( 35, 40, 25 );
    tables.position.set( 55, -9.8, 20 );

    tables.castShadow = true;
    tables.receiveShadow = true;

    tables.traverse( function ( child ) {

        child.castShadow = true;
        child.receiveShadow = true;

    } );

    scene.add( tables );

});


// Fire extinguishers

var extinguisherWater = null,
    extinguisherFoam = null,
    extinguisherPowder = null,
    extinguisherCo2 = null,
    extinguishers;

var textureExtinguisherWater = new THREE.ImageUtils.loadTexture('models/extinguisher/fireextinguisher_col-water.jpg'),
    textureExtinguisherFoam = new THREE.ImageUtils.loadTexture('models/extinguisher/fireextinguisher_col-foam.jpg'),
    textureExtinguisherPowder = new THREE.ImageUtils.loadTexture('models/extinguisher/fireextinguisher_col-powder.jpg'),
    textureExtinguisherCo2 = new THREE.ImageUtils.loadTexture('models/extinguisher/fireextinguisher_col-co2.jpg');

function applyTextureToChildren( mesh, texture ) {
    mesh.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material.map = texture;
        }

    } );
}

objLoader.load( 'models/extinguisher/Fireextinguisher_BI.obj', function ( object ) {

    var mesh = object.children[0];

    mesh.geometry.computeBoundingBox();

    extinguisherWater = new THREE.Mesh( mesh.geometry, mesh.material.clone() );
    extinguisherFoam = new THREE.Mesh( mesh.geometry, mesh.material.clone() );
    extinguisherPowder = new THREE.Mesh( mesh.geometry, mesh.material.clone() );
    extinguisherCo2 = new THREE.Mesh( mesh.geometry, mesh.material.clone() );

    applyTextureToChildren( extinguisherWater, textureExtinguisherWater );
    applyTextureToChildren( extinguisherFoam, textureExtinguisherFoam );
    applyTextureToChildren( extinguisherPowder, textureExtinguisherPowder );
    applyTextureToChildren( extinguisherCo2, textureExtinguisherCo2 );

    extinguisherWater.position.z = -6;
    extinguisherFoam.position.z = -2;
    extinguisherPowder.position.z = 2;
    extinguisherCo2.position.z = 6;

    extinguishers = [
        extinguisherWater,
        extinguisherFoam,
        extinguisherPowder,
        extinguisherCo2
    ];

    for( var i=0; i < extinguishers.length; i++ ) {

        var extinguisher = extinguishers[i];

        extinguisher.scale.set(6, 6, 6);
        extinguisher.position.x = -3.5;
        extinguisher.position.y = -10;
        extinguisher.rotation.y = 1.5;

        extinguisher.castShadow = true;
        extinguisher.receiveShadow = true;

        scene.add( extinguisher );
    }

});


//
// FIRE
//
//

// Create particle group - see docs at: https://github.com/squarefeet/ShaderParticleEngine
var particleGroup = new SPE.Group({
    texture: THREE.ImageUtils.loadTexture("data:image/png;base64,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"),
    //maxAge: 20,
    hasPerspective: true,
    colorize: 1,
    transparent: false,//true,
    alphaTest: 0.5,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending
});

/*
 * These settings might make for more of a firework/sparkler kind of effect
 */
/*
    type: 'cube',
    acceleration: new THREE.Vector3(0, 0.2, 0),
    accelerationSpread: new THREE.Vector3(0.2, 0.2, 0.2),
    velocity: new THREE.Vector3(0.1, 0.2, 0,1),
    velocitySpread: new THREE.Vector3(0.2, 0.2, 0.2),
    particleCount: 1000,
    position: new THREE.Vector3( 5, -11, -25 ),
    colorStart: new THREE.Color( 0x662100 ),
    colorStartSpread: new THREE.Vector3( 0, 0, 0 ),
    colorMiddle: new THREE.Color( 0x632700 ),
    colorMiddleSpread: new THREE.Vector3( 0, 0, 0 ),
    colorEnd: new THREE.Color( 0xff2b18 ),
    colorEndSpread: new THREE.Vector3( 0, 0, 0 ),
    radius: 50
*/

// Create particle emitter
var FireEmitter = new SPE.Emitter( {
    type: 'sphere',
    particleCount: 1000,
    position: new THREE.Vector3( 6.5, -9, -24 ),
    colorStart: new THREE.Color( 0x662100 ),
    colorStartSpread: new THREE.Vector3( 0, 0, 0 ),
    colorMiddle: new THREE.Color( 0x632700 ),
    colorMiddleSpread: new THREE.Vector3( 0, 0, 0 ),
    colorEnd: new THREE.Color( 0xff2b18 ),
    colorEndSpread: new THREE.Vector3( 0, 0, 0 ),
    radius: 1.3,
    radiusSpread: 2.0,
    radiusSpreadClamp: 0,
    speed: 0.1,
    //alive: 0.6
    radiusScale: new THREE.Vector3( 0.5, 1.0, 0.5 ),
    //speedSpread: 0,
    sizeStart: 4.2222222222222223,
    sizeStartSpread: 0,
    sizeMiddle: 5.333333333333334,
    sizeMiddleSpread: 0,
    sizeEnd: 2.8333333333333317,
    sizeEndSpread: 0
} );


particleGroup.addEmitter( FireEmitter );

//
// FOAM
//
//

var FoamEmitter = new SPE.Emitter( {
    type: 'cube',
    acceleration: new THREE.Vector3(0, -0.2, -2.5),
    accelerationSpread: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, -0.2, -2.5),
    velocitySpread: new THREE.Vector3(0, 0, 0),
    particleCount: 80,
    colorStart: new THREE.Color( 0xFFFFFF ),
    colorStartSpread: new THREE.Vector3( 0, 0, 0 ),
    colorMiddle: new THREE.Color( 0xFFFFFF ),
    colorMiddleSpread: new THREE.Vector3( 0, 0, 0 ),
    colorEnd: new THREE.Color( 0xFFFFFF ),
    colorEndSpread: new THREE.Vector3( 0, 0, 0 ),
    radius: 1.3,
    radiusSpread: 2.0,
    radiusSpreadClamp: 0,
    speed: 0.4,
    sizeStart: 1,
    sizeStartSpread: 0,
    sizeMiddle: 5,
    sizeMiddleSpread: 1,
    sizeEnd: 7,
    sizeEndSpread: 3
} );

FoamEmitter.disable();

particleGroup.addEmitter( FoamEmitter );

scene.add( particleGroup.mesh );



var rayCaster = new THREE.Raycaster( new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0) );

function updateFoam( extinguisher ) {

    FoamEmitter.position.copy( extinguisher.position ).add( new THREE.Vector3(0.5, 8, -2) );

    // See: http://stackoverflow.com/questions/14813902/three-js-get-the-direction-in-which-the-camera-is-looking
    var vector = new THREE.Vector3( 0, 0, -1 );
    vector.applyQuaternion( camera.quaternion );

    FoamEmitter.velocity.copy( vector ).setZ( vector.z * 2 );
    FoamEmitter.acceleration.copy( vector ).setZ( vector.z * 2 );

    if( !isCompleted ) {


        rayCaster.ray.origin.copy( FoamEmitter.position );
        rayCaster.ray.direction.copy( FoamEmitter.velocity.normalize() );

        var intersects = rayCaster.intersectObject( bin );

        if( intersects && intersects.length > 0 ) {
            console.log( 'hit bin!' );
            FireEmitter.radiusScale.x -= 0.005;
            FireEmitter.radiusScale.y -= 0.01;
            FireEmitter.radiusScale.z -= 0.005;

            if( FireEmitter.radiusScale.y <= 0.1 ) {
                console.log('Completed');
                completed();
            }
        }

    }

}


//
// ADD LEAP MOTION
//
//

/*
var arrowHelper = new THREE.ArrowHelper( new THREE.Vector3(0, 0, -1), camera.position, 2, 0xFF0000 );
scene.add( arrowHelper );
*/

var extinguisherBeingHeld = null,
    handPos = new THREE.Vector3(),
    targetBoundsBox = new THREE.Box3(),
    dist;

Leap.loop(function(frame) {

    if( frame.hands.length < 1 ) {
        extinguisherBeingHeld = null;
        FoamEmitter.disable();
    }

    frame.hands.forEach(function(hand, index) {

        // TODO fix for 2 hands!!
        if( index == 0 ) {

            //console.log('hand.data(handMesh)', hand.data('handMesh'));

            var grabbing = hand.grabStrength > 0.2;

            if( extinguisherBeingHeld ) {

                extinguisherBeingHeld.position.fromArray( hand.palmPosition );
                extinguisherBeingHeld.position.y -= 7;

                updateFoam( extinguisherBeingHeld );

                if( !grabbing ) {

                    // Drop extinguisher
                    extinguisherBeingHeld = null;
                    FoamEmitter.disable();

                }

            } else {

                if( grabbing ) {

                    for( var i=0; i < extinguishers.length; i++ ) {

                        var extinguisher = extinguishers[i];

                        if( extinguisher ) {

                            handPos.fromArray( hand.palmPosition );

                            targetBoundsBox.setFromObject( extinguisher );

                            dist = targetBoundsBox.distanceToPoint( handPos );

                            if( dist <= TARGET_BOUNDS_TO_HAND_THRESHOLD ) {

                                // XXX Just for now we only allow the foam extinguisher to be picked up!
                                if( extinguisher === extinguisherFoam ) {

                                    extinguisherBeingHeld = extinguisher;

                                    updateFoam( extinguisherBeingHeld );

                                    // Bit of a hacky tweak - don't want it to fire straight away when we pick up the first time
                                    if( isFirstExtinguisherSpray ) {
                                        window.setTimeout(function() {
                                            FoamEmitter.enable();
                                        }, 1000);
                                        isFirstExtinguisherSpray = false;
                                    } else {
                                        FoamEmitter.enable();
                                    }

                                }

                            }

                        }

                    }

                }

            }

        }

    });

});

// Docs: http://leapmotion.github.io/leapjs-plugins/main/transform/
Leap.loopController.use('transform', {

    // This matrix flips the x, y, and z axis, scales to meters, and offsets the hands by -8cm.
    vr: true,

    // This causes the camera's matrix transforms (position, rotation, scale) to be applied to the hands themselves
    // The parent of the bones remain the scene, allowing the data to remain in easy-to-work-with world space.
    // (As the hands will usually interact with multiple objects in the scene.)
    effectiveParent: camera

});

// Docs: http://leapmotion.github.io/leapjs-plugins/main/bone-hand/
Leap.loopController.use('boneHand', {

    // If you already have a scene or want to create it yourself, you can pass it in here
    // Alternatively, you can pass it in whenever you want by doing
    // Leap.loopController.plugins.boneHand.scene = myScene.
    scene: scene,

    // Display the arm
    arm: true,

    //boneColor: new THREE.Color(0xFF0000),
    //jointColor: new THREE.Color(0xFF0000)

    boneScale: 1/5,
    jointScale: 1/4

});

Leap.loopController.use('handHold', function(hand) {

    console.log('hand hold', hand);

});

// Experimenting with rigged hands
/*
Leap.loopController.use('riggedHand', {
    scale: 1.3,
    initScene: function() { this.scene = scene }
});
*/

//
// ADD VIRTUAL REALITY
//
//

console.log('Set up VR controls');

// Moves (translates and rotates) the camera
var vrControls = new THREE.VRControls(camera, function(success, message) {
    console.log('VRControls result:', success, message);
    isVRMode = success;
    if( isVRMode ) {
        console.log('Enable VR controls');
    }
});

var vrEffect = new THREE.VREffect(renderer);

// And keyboard controls for testing without a VR device
var flyControls = new THREE.FlyControls(camera);
flyControls.movementSpeed = 0.01;
flyControls.rollSpeed = 0.0005;
flyControls.dragToLook = true;

var onkey = function (event) {
    if (event.key === 'z') {
        vrControls.zeroSensor();
    }
    if (event.key === 'f') {
        return vrEffect.setFullScreen(true);
    }
};

window.addEventListener("keypress", onkey, true);


//
// MAKE IT GO
//
//

var boneHand = Leap.loopController.plugins.boneHand,
    lastTime = 0,
    fireRendered = false;

boneHand.render = function(time) {

    if( isVRMode ) {
        vrControls.update();
    }

    if( time ) {

        var delta = time - lastTime;

        if( !isVRMode ) {
            flyControls.update(delta);
        }

        particleGroup.tick( delta / 100 ); // seconds?
        fireRendered = true;

        lastTime = time;

    }

    if( isCompleted ) {
        updateCompletedTextPosition();
    }

    vrEffect.render(scene, camera, overlayScene);

    // Make flames increase gradually...?
    //FireEmitter.radiusScale.x += 0.0005;
    //FireEmitter.radiusScale.y += 0.001;
    //FireEmitter.radiusScale.z += 0.0005;

    //requestAnimationFrame(render);
};

//render();


//
// Add a debug message Real quick
// Prints out when receiving oculus data.
//
//

var receivingPositionalData = false;
var receivingOrientationData = false;

var timerID = setInterval(function () {

    if (camera.position.x !== 0 && !receivingPositionalData) {
        receivingPositionalData = true;
        console.log("Receiving positional data!");
    }

    if (camera.quaternion.x !== 0 && !receivingOrientationData) {
        receivingOrientationData = true;
        console.log("Receiving orientation data!");
    }

    if (receivingOrientationData && receivingPositionalData) {
        clearInterval(timerID);
    }

}, 2000);
