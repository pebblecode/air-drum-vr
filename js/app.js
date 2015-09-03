(function() {

  var scene,
    container,
    camera,
    renderer,
    ambientLight,
    directionalLight;

  function init() {

    scene = new THREE.Scene();

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );

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
    var cube1 = new THREE.Mesh( new THREE.BoxGeometry(100, 100, 100), new THREE.MeshBasicMaterial({color: 0xFF0000}));

    cube1.position.set(0, 0, 0);

    scene.add( cube1 );

    ambientLight = new THREE.AmbientLight( 0xFFFFFF );
    scene.add( ambientLight );

    // debug axes
    //To use enter the axis length
    initDebugAxes(100);

    window.addEventListener('resize', onResize, false);

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

    console.log('animate');

    renderer.render(scene, camera);

    camera.lookAt(new THREE.Vector3(0,0,0));

    requestAnimationFrame(animate);

  }

  init();
  animate();

})();