(function() {
  //var audio = new Audio('inception.mp3');
  //var audio = new Audio('99752__menegass__bongo2.wav');
  var ambientLight,
    spotLight,
    objLoader = new THREE.OBJLoader(),
    objMtlLoader = new THREE.OBJMTLLoader(),
    sounds = {
      hiHat: new Audio('audio/CHINESE TD_2.wav'),
      drumDeep: new Audio('audio/218458__thomasjaunism__pacific-island-drum-2 (1).wav'),
      drumKick: new Audio('audio/190551__nabz871__kick-drum-hard-3.wav'),
      drumSnare: new Audio('audio/82238__kevoy__snare-drum.wav')
    };

  function initModels() {

    loadDrum('red', [-200, 80, 30]);
    loadDrum('blue', [-70, 90, 0]);
    loadDrum('red', [70, 90, 30]);

    loadHiHat([250, 140, -20]);

  }

  function loadDrum(color, posArray) {

    var drumMaterialOutsideRed = new THREE.MeshLambertMaterial({color: 0xfe0000});
    var drumMaterialOutsideBlue = new THREE.MeshLambertMaterial({color: 0x4669dd});
    var drumMaterialMetal = new THREE.MeshPhongMaterial({color: 0xb08a6e});
    var drumMaterialSkinWhite = new THREE.MeshLambertMaterial({color: 0xfcfcfc});

    var tempChildNames = [];

    objLoader.load( 'models/drum2.obj', function ( object ) {

      console.log('Loaded drum model', object);

      object.traverse( function ( child ) {

        if ( child instanceof THREE.Mesh ) {

          //console.log('child mesh', child);

          if (child.name.indexOf('Circle') > -1) {
            child.material = drumMaterialSkinWhite;

          } else if (child.name.indexOf('Sphere') > -1) {
            child.material = drumMaterialMetal;

          } else if (child.name.indexOf('Line') > -1) {
            child.material = drumMaterialMetal;

          } else if (child.name.indexOf('Rectangle') > -1) {
            child.material = drumMaterialSkinWhite;

          } else {
            child.material = color === 'red' ? drumMaterialOutsideRed : drumMaterialOutsideBlue;
          }

          if( child.name === 'Object03' ) {
            child.material = drumMaterialSkinWhite;
          }

          tempChildNames.push( child.name );

        }

      } );

      console.log(tempChildNames);

      object.scale.set(4, 4, 4);
      object.position.set(posArray[0], posArray[1], posArray[2]);

      scene.add(object);

    });

  }

  function loadHiHat(posArray) {

    var hiHatMaterialSilver = new THREE.MeshPhongMaterial({color: 0xcccccc});
    var hiHatMaterialGold = new THREE.MeshPhongMaterial({color: 0xb08a6e});

    var count = 0;

    objMtlLoader.load( 'models/hihat.obj', 'models/hihat.mtl', function ( object ) {

      console.log('Loaded hi hat model', object);

      object.traverse( function ( child ) {

        console.log('Hi hat child', child);

        if ( child instanceof THREE.Mesh ) {

          if (count === 0) {
            child.material = hiHatMaterialSilver;
          } else {
            child.material = hiHatMaterialGold;
          }

          count++;
        }
      });

      object.scale.set(30, 25, 30);
      object.position.set(posArray[0], posArray[1], posArray[2]);

      scene.add(object);

    });

  }

  function initLights() {

    ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add( ambientLight );

    spotLight = new THREE.SpotLight( 0xFFFFFF, 1.0 );

    spotLight.castShadow = true;
    //spotLight.onlyShadow = true;
    spotLight.shadowCameraNear = camera.near;

    spotLight.position.set( 0, 1000, 700);
    spotLight.target.position.set( 0, 0, -100 );
    //spotLight.shadowCameraVisible = true;

    scene.add( spotLight );
    scene.add( spotLight.target );

  }

  var controller = Leap.loop({enableGestures: true})
    .use('boneHand', {
      targetEl: document.body,
      arm: true,
      opacity: 0.5
    })
      .on('frame', function(frame){
    if(frame.valid && frame.gestures.length > 0){
    frame.gestures.forEach(function(gesture){
        switch (gesture.type){
          case "circle":
              console.log("Circle Gesture");
              break;
          case "keyTap":
              console.log("Key Tap Gesture");
              break;
          case "screenTap":
              console.log("Screen Tap Gesture");
              break;
          case "swipe":
              if (gesture.state == "start")
              {
                sounds['hiHat'].play();
                console.log("Swipe Gesture start");
              }
              else
              {
                console.log("Swipe Gesture update or stop");
              }
              break;
        }
      });
    }});

  /* attempting to keep showing frames when not active, not working for some reason:*/
  controller.setBackground(true);

  /* if trying to get to work in head mounted mode:
  - maybe set optimizeHMD in controller options
  - maybe use transform plugin with 'vr' option
  */

  // Set up scene

  var scene    = Leap.loopController.plugins.boneHand.scene;
  var camera   = Leap.loopController.plugins.boneHand.camera;
  var renderer = Leap.loopController.plugins.boneHand.renderer;

  console.log('renderer', renderer);

  renderer.setClearColor( 0x000000 );

  var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(80,80),
    new THREE.MeshPhongMaterial({wireframe: false})
  );


  plane.scale.set(2,2,2);
  plane.position.set(0,200,-100);

  camera.lookAt( plane.position );

//  scene.add(plane);

  //var axisHelper = new THREE.AxisHelper( 100 );
  //scene.add( axisHelper );

  initModels();

  initLights();

})();