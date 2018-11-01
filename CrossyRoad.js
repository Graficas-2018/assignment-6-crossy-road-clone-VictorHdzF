var container;
var camera, scene, raycaster, renderer;
var mouse = new THREE.Vector2(), INTERSECTED, CLICKED;
var radius = 100, theta = 0;
var robot;
var cube;
var car1, car2;
var logs = [];
var treeboxes = [];
var riverBox;
var riverBoxS;
var robot_mixer = {};
var currentTime = Date.now();
var animation = "run";
var tag = null;
var animator = null;
var score = 0;
var reset = null;
var count = 0;
var grass = "images/grass.jpg";
var road = "images/road.jpg";
var water = "images/water.jpg";
var fall = null;
var i = 0;
var j = 0;
var y = 0;

function Up(object)
{
   // animation = "run"
    animator = new KF.KeyFrameAnimator;
    var ypos = object.position.y;
    animator.init({ 
        interps: [
            {
                keys: [0, 1],
                values: [
                    {y: ypos},
                    {y: ypos + 1},
                ],
                target: object.position
            }
            ],
        loop: false,
        duration: 250,
    });
    animator.start();
}

function Left(object)
{
    animator = new KF.KeyFrameAnimator;
    var xpos = object.position.x;
    animator.init({ 
        interps: [
            {
                keys: [0, 1.0],
                values: [
                    {x: xpos},
                    {x: xpos - 1},
                ],
                target: object.position
            }
            ],
        loop: false,
        duration: 250,
    });
    animator.start();
}

function Right(object)
{
    animator = new KF.KeyFrameAnimator;
    var xpos = object.position.x;
    animator.init({ 
        interps: [
            {
                keys: [0, 1.0],
                values: [
                    {x: xpos},
                    {x: xpos + 1},
                ],
                target: object.position
            }
            ],
        loop: false,
        duration: 250,
    });
    animator.start();
}

function carAnimation(object)
{
    duration = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
    animator = new KF.KeyFrameAnimator;
    var xpos = object.position.x;
    var ypos = object.position.y;
    var zpos = object.position.z;
    animator.init({ 
        interps: [
            {
                keys: [0, 0.7, 0.8, 0.9, 1],
                values: [
                    {x: xpos, y: ypos, z: zpos},
                    {x: xpos + 30, y: ypos, z: zpos},
                    {x: xpos + 30, y: ypos, z: zpos - 3},
                    {x: xpos, y: ypos, z: zpos - 3},
                    {x: xpos, y: ypos, z: zpos},
                ],
                target: object.position
            }
            ],
        loop: true,
        duration: duration * 2200,
    });
    animator.start();
}

function logAnimation(object)
{
    duration = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
    animator = new KF.KeyFrameAnimator;
    var xpos = object.position.x;
    var ypos = object.position.y;
    var zpos = object.position.z;
    animator.init({ 
        interps: [
            {
                keys: [0, 0.7, 0.8, 0.9, 1],
                values: [
                    {x: xpos, y: ypos, z: zpos},
                    {x: xpos + 42, y: ypos, z: zpos},
                    {x: xpos + 42, y: ypos, z: zpos - 3},
                    {x: xpos, y: ypos, z: zpos - 3},
                    {x: xpos, y: ypos, z: zpos},
                ],
                target: object.position
            }
            ],
        loop: true,
        duration: duration * 12000,
    });
    animator.start();
}

async function createLand(y)
{
    console.log("creating land");

    // Create a texture map
    var map = new THREE.TextureLoader().load(grass);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(25, 10, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0xffffff, map:map, side:THREE.DoubleSide}));

    mesh.position.set(0, y, 0);
    
    // Add the mesh to our group
    scene.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    tree = new THREE.Object3D;

    var trunk = new THREE.CylinderGeometry( 8, 5, 30, 32 );
    var material_t = new THREE.MeshBasicMaterial( {color: 0x683000} );
    var trunk_tree = new THREE.Mesh( trunk, material_t );

    var foliage = new THREE.DodecahedronGeometry(13);
    var material_f = new THREE.MeshBasicMaterial( {color: 0x148700} );
    var foliage_tree = new THREE.Mesh(foliage, material_f);

    trunk_tree.scale.set(0.1, 0.1, 0.1);
    trunk_tree.rotation.set(THREE.Math.degToRad(90),
    THREE.Math.degToRad(180),
    THREE.Math.degToRad(0));

    foliage_tree.scale.set(0.1, 0.1, 0.1);
    foliage_tree.position.set(0, 0, 1);

    tree.add(trunk_tree);
    tree.add(foliage_tree);

    for ( i = 0; i < 7; i++)
    {
        tree_clone = tree.clone();

        posx = Math.floor(Math.random() * 12) + 1;
        posx *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        posy = Math.floor(Math.random() * 4) + 1;
        posy *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  
        tree_clone.position.set(posx, posy + y, 1.5);
        treeBox = new THREE.Box3().setFromObject(tree_clone);
        tree_clone.tag = "tree";
    
        treeboxes.push(treeBox);
        scene.add( tree_clone );
    }
}

async function createRoad(y)
{
    console.log("creating road");

    // Create a texture map
    var map = new THREE.TextureLoader().load(road);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(25, 10, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0xffffff, map:map, side:THREE.DoubleSide}));

    mesh.position.set(0, y, 0);
    
    // Add the mesh to our group
    scene.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    car = new THREE.Object3D;
    bus = new THREE.Object3D;

    var chasis = new THREE.BoxGeometry( 1, 2, 1 );
    var material_c = new THREE.MeshBasicMaterial( {color: 0xbf0d0d} );
    car1 = new THREE.Mesh( chasis, material_c );
    car1.rotation.set(THREE.Math.degToRad(0),
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(90));
    car1.scale.set(1.5, 1.5, 1.5);
    car1.position.set(0, 0, 1.1);
    var wheels = new THREE.CylinderGeometry( 3, 3, 20, 32 );
    var material_w = new THREE.MeshBasicMaterial( {color: 0x191919} );
    var wheels_front = new THREE.Mesh(wheels, material_w);
    wheels_front.scale.set(0.1, 0.1, 0.1);
    wheels_front.position.set(0.9, 0, 0.4)
    var wheels_rear = wheels_front.clone();
    wheels_rear.position.set(-0.9, 0, 0.4)

    car.add(car1);
    car.add(wheels_front);
    car.add(wheels_rear);
    car.position.set(-15, y + 3, 0);
    
    var chasis = new THREE.BoxGeometry( 2, 3, 1 );
    var material_c = new THREE.MeshBasicMaterial( {color: 0xffdd00} );
    car2 = new THREE.Mesh( chasis, material_c );
    car2.rotation.set(THREE.Math.degToRad(0),
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(90));
    car2.scale.set(1.5, 1.5, 1.5);
    car2.position.set(0, 0, 1.1);
    var wheels2 = new THREE.CylinderGeometry( 3, 3, 35, 32 );
    var material_w2 = new THREE.MeshBasicMaterial( {color: 0x191919} );
    var wheels_front2 = new THREE.Mesh(wheels2, material_w2);
    wheels_front2.scale.set(0.1, 0.1, 0.1);
    wheels_front2.position.set(1.2, 0, 0.4)
    var wheels_rear2 = wheels_front2.clone();
    wheels_rear2.position.set(-1.2, 0, 0.4)

    bus.add(car2);
    bus.add(wheels_front2);
    bus.add(wheels_rear2);
    bus.position.set(-15, y - 3, 0);
    
    scene.add( car );
    scene.add( bus );

    carAnimation(car);
    carAnimation(bus);
}

async function createRiver(y)
{
    console.log("creating river");

     // Create a texture map
     var map = new THREE.TextureLoader().load(water);
     map.wrapS = map.wrapT = THREE.RepeatWrapping;
     map.repeat.set(8, 8);
 
     // Put in a ground plane to show off the lighting
     geometry = new THREE.PlaneGeometry(25, 10, 50, 50);
     var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0xffffff, map:map, side:THREE.DoubleSide}));
 
     mesh.position.set(0, y, 0);
     riverBox = new THREE.Box3().setFromObject(mesh);
     //riverBox.max.z = riverBox.max.z + 0.5;
     riverBoxS = new THREE.Box3().setFromObject(mesh);
     riverBoxS.max.z = riverBox.max.z + 5;
     
     // Add the mesh to our group
     scene.add( mesh );
     mesh.castShadow = false;
     mesh.receiveShadow = true;

    first = new THREE.Object3D;
    second = new THREE.Object3D;
    third = new THREE.Object3D;

    var tronco = new THREE.BoxGeometry( 2.1, 2.1, 0.25 );
    var material_log = new THREE.MeshBasicMaterial( {color: 0x683000} );
    log = new THREE.Mesh( tronco, material_log );
    log.rotation.set(THREE.Math.degToRad(0),
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(90));
    log.scale.set(1.5, 1.8, 1.5);
    log.position.set(-14, y - 3.51, 0.5);
    first.add(log);
    log2 = log.clone();
    log2.position.set(-21, y - 3.51, 0.5);
    first.add(log2);
    log3 = log.clone();
    log3.position.set(-28, y - 3.51, 0.5);
    first.add(log3);

    log4 = log.clone();
    log4.position.set(-21, y , 0.5);
    log4.scale.set(2, 5.5, 1.5);
    second.add(log4);

    log5 = log.clone();
    log5.position.set(-14, y + 3.51 , 0.5);
    third.add(log5);
    log6 = log.clone();
    log6.position.set(-21, y + 3.51 , 0.5);
    third.add(log6);
    log7 = log.clone();
    log7.position.set(-28, y + 3.51 , 0.5);
    third.add(log7);

    logs.push(log);
    logs.push(log2);
    logs.push(log3);
    logs.push(log4);
    logs.push(log5);
    logs.push(log6);
    logs.push(log7);

    scene.add(first);
    scene.add(second);
    scene.add(third);

    logAnimation(first);
    logAnimation(second);
    logAnimation(third);
}

async function createCube()
{
    var c = new THREE.BoxGeometry( 2, 2, 1 );
    var material_cube = new THREE.MeshBasicMaterial( {color: 0xb2006a} );
    cube = new THREE.Mesh( c, material_cube );
    cube.position.set(0, 0, 1.1);
    cube.tag = "cube";
    scene.add(cube);  
}

async function createRobot()
{
    var loader = new THREE.FBXLoader();
    loader.load( 'Robot/robot_idle.fbx', function ( object ) 
    {
        robot_mixer["idle"] = new THREE.AnimationMixer( scene );
        object.scale.set(0.0045, 0.0045, 0.0045);
        object.rotation.set(THREE.Math.degToRad(90),
        THREE.Math.degToRad(180),
        THREE.Math.degToRad(0));
        object.position.set(0, -3, 0);
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );

        robot = object;
        robot.box = new THREE.Box3().setFromObject(robot);
        robot.tag = "robot";
        scene.add( robot );
              
        robot_mixer["idle"].clipAction( object.animations[ 0 ], robot ).play();

        loader.load( 'Robot/robot_run.fbx', function ( object ) 
        {
            robot_mixer["run"] = new THREE.AnimationMixer( scene );
            robot_mixer["run"].clipAction( object.animations[ 0 ], robot ).play();
        });
    });
}

async function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);
        
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    
    // Camera setup
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set(0, 0, 16);
    camera.rotation.set(0,0,0)
    scene.add(camera);

    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 100 );
    scene.add( light );

    await createCube();

    await createLand(0);
    await createRoad(10);
    await createLand(20);
    await createRiver(30);
    await createLand(40);

    result = $("#result");
    score_l = $("#score");
    reset = $("#reset");
    $("#reset").click(() =>{
        score = 0;
        reset.addClass("hidden");
        score_l.text("Score:0");
        scene.add(cube);
        cube.position.set(0, 0, 1.1);
        result.text("");
    });
        
    document.addEventListener('keydown', onDocumentKeyDown);
    
    window.addEventListener( 'resize', onWindowResize);
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentKeyDown(event)
{
    var keyCode = event.which;

    if (keyCode == 38)
    {
        Up(cube);
        score += 1;
        score_l.text("Score:" + score);
    }
    else if (keyCode == 37)
        Left(cube);
    else if (keyCode == 39)
        Right(cube);
}

function collisionDetector()
{
    cube.box = new THREE.Box3().setFromObject(cube);
    car1.box = new THREE.Box3().setFromObject(car1);
    car2.box = new THREE.Box3().setFromObject(car2);

    for( let box of treeboxes )
    {
        if(cube.box.intersectsBox(box))
        {
            console.log("collision with tree");
            Up(cube);
        }
    }

    for ( i = 0; i < logs.length; i++)
    {
        logs[i].box = new THREE.Box3().setFromObject(logs[i]);
    }

    for ( j = 0; j < logs.length; j++)
    {
        if (cube.box.intersectsBox(logs[j].box))
        {
            console.log("collision with log");
            //cube.position.x = logs[j].position.x;
            cube.position.x += 0.045;
            cube.position.z += 0.045;
        }
    }

    if (cube.box.intersectsBox(riverBoxS))
        cube.position.z -= 0.045;

    if(cube.box.intersectsBox(car1.box) || cube.box.intersectsBox(car2.box) || cube.box.intersectsBox(riverBox) )
    {
        reset.removeClass("hidden");
        scene.remove(cube);
        console.log("lethal collision");
        result.text(" YOU LOST !")
    }
}

function run() 
{
    requestAnimationFrame(function() { run(); });
    renderer.render( scene, camera );

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;

    if(cube)
    {
        camera.position.y = cube.position.y;
        collisionDetector();
        KF.update();
    }
    
    if (score >= 55)
    {
        result.text(" YOU WIN !")
        reset.removeClass("hidden");
        scene.remove(cube);   
    }
}