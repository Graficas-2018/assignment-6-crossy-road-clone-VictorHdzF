var container;
var camera, scene, raycaster, renderer;
var mouse = new THREE.Vector2(), INTERSECTED, CLICKED;
var radius = 100, theta = 0;
var robot;
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
                    {x: xpos + 42, y: ypos, z: zpos},
                    {x: xpos + 42, y: ypos, z: zpos - 3},
                    {x: xpos, y: ypos, z: zpos - 3},
                    {x: xpos, y: ypos, z: zpos},
                ],
                target: object.position
            }
            ],
        loop: true,
        duration: duration * 5200,
    });
    animator.start();
}

function createLand(y)
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

    for (let i = 0; i < 7; i++)
    {
        tree_clone = tree.clone();

        posx = Math.floor(Math.random() * 12) + 1;
        posx *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        posy = Math.floor(Math.random() * 4) + 1;
        posy *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  
        tree_clone.position.set(posx, posy + y, 1.5);
        treeBox = new THREE.Box3().setFromObject(tree_clone);
        tree_clone.tag = "tree";
    
        scene.add( tree_clone );
    }
}

function createRoad(y)
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
    var car1 = new THREE.Mesh( chasis, material_c );
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
    var car2 = new THREE.Mesh( chasis, material_c );
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

function createRiver(y)
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
     
     // Add the mesh to our group
     scene.add( mesh );
     mesh.castShadow = false;
     mesh.receiveShadow = true;

    first = new THREE.Object3D;
    second = new THREE.Object3D;
    third = new THREE.Object3D;

    var tronco = new THREE.BoxGeometry( 2, 2, 0.25 );
    var material_t = new THREE.MeshBasicMaterial( {color: 0x683000} );
    var log = new THREE.Mesh( tronco, material_t );
    log.rotation.set(THREE.Math.degToRad(0),
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(90));
    log.scale.set(1.5, 1.5, 1.5);
    log.position.set(-14, y - 3.51, 0);
    first.add(log);
    log2 = log.clone();
    log2.position.set(-21, y - 3.51, 0);
    first.add(log2);
    log3 = log.clone();
    log3.position.set(-28, y - 3.51, 0);
    first.add(log3);

    log4 = log.clone();
    log4.position.set(-21, y , 0);
    log4.scale.set(2, 5, 1.5);
    second.add(log4);

    third = first.clone();
    third.position.set(0, 7, 0);

    scene.add(first);
    scene.add(second);
    scene.add(third);

    logAnimation(first);
    logAnimation(second);
    logAnimation(third);
}

function createScene(canvas) 
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

    
    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 100 );
    scene.add( light );

    createLand(0);
    createRoad(10);
    createLand(20);
    createRiver(30);
    createLand(40);

    score_l = $("#score");
    reset = $("#reset");
    $("#reset").click(() =>{
        score = 0;
        reset.addClass("hidden");
        score_l.text("Score:0");
    });
        
    document.addEventListener('keydown', onDocumentKeyDown);
    
    window.addEventListener( 'resize', onWindowResize);

    console.log(scene.children);
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
        Up(robot);
        score += 1;
        score_l.text("Score:" + score);
    }
    else if (keyCode == 37)
        Left(robot);
    else if (keyCode == 39)
        Right(robot);
}

function collisionDetector()
{
    robot.box = new THREE.Box3().setFromObject(robot);
    if(robot.box.intersect(treeBox))
    {
        console.log("collision");
        Up(robot);
    }
        
    /*for ( var j = 0; j < scene.children.length; j++)
    {
        if(scene.children[j].tag == "tree" )
           if(robot.box.intersect(scene.children[j].box))
           {
               console.log("collision");
                Up(robot);
           }
    }*/
}

function run() 
{
    requestAnimationFrame(function() { run(); });
    renderer.render( scene, camera );

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;

    if(robot && robot_mixer[animation])
    {
        robot_mixer[animation].update(deltat*0.001);
        camera.position.y = robot.position.y;
        //collisionDetector();
        KF.update();
    }  

    
    //console.log(scene.children[i].position)

    /*if (count > 200 && rand != last)
    {
        console.log("Robot moving: " + rand);
        UpAnimation(robots[rand]);
        count = 0;
        last = rand;
    }*/
    

/*    if (Date.now() >= timer)
    {
        reset.removeClass("hidden");
    }*/
    //
}