(function() {

  var scene = new THREE.Scene(),
    container = document.getElementById('container'),
    camera,
    renderer,
    ambientLight,
    spotLight,
    objLoader = new THREE.OBJLoader(),
    objMtlLoader = new THREE.OBJMTLLoader();

  function init() {

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );

    camera.position.y = 100;
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      clearColor: new THREE.Color(0xFFFFFF)
    });

    renderer.autoClear = false;
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild( renderer.domElement );

    // TEMP add cube for now
    var cube1 = new THREE.Mesh( new THREE.BoxGeometry(100, 100, 100), new THREE.MeshLambertMaterial({color: 0xFF0000}));
    cube1.position.set(0, 0, 0);
    //scene.add( cube1 );

    initModels();

    initLights();

    ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add( ambientLight );

    // Debug axes
    //initDebugAxes(100);

    window.addEventListener('resize', onResize, false);

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

        //if ( child instanceof THREE.Mesh ) {
        //
        //  child.material = hiHatMaterialSilver;
        //
        //}

      });

      object.scale.set(30, 30, 30);
      object.position.set(posArray[0], posArray[1], posArray[2]);

      scene.add(object);

    });

  }

  function initModels() {

    loadDrum('red', [-200, -70, 30]);
    loadDrum('blue', [-70, -50, 0]);
    loadDrum('red', [50, -50, 30]);

    loadHiHat([250, -10, 30]);

  }

  function initLights() {

    spotLight = new THREE.SpotLight( 0xFFFFFF, 2.0 );

    spotLight.castShadow = true;
    //spotLight.onlyShadow = true;
    spotLight.shadowCameraNear = camera.near;

    spotLight.position.set( 0, 500, 700);
    spotLight.target.position.set( 0, 0, -100 );
    //spotLight.shadowCameraVisible = true;

    scene.add( spotLight );
    scene.add( spotLight.target );

  }

  function initDebugAxes(axisLength) {

    // Shorthand function
    function v(x, y, z) {
      return new THREE.Vector3(x, y, z);
    }

    // Create axis (point1, point2, colour)
    function createAxis(p1, p2, color) {
      var line, lineGeometry = new THREE.Geometry(),
        lineMat = new THREE.LineBasicMaterial({color: color, lineWidth: 1});
      lineGeometry.vertices.push(p1, p2);
      line = new THREE.Line(lineGeometry, lineMat);
      scene.add(line);
    }

    createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000);
    createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00);
    createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {

    //console.log('animate');

    renderer.render(scene, camera);

    camera.lookAt(new THREE.Vector3(0,0,0));

    requestAnimationFrame(animate);

  }

  init();
  animate();

})();