const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;

var floodedCityImg, building;
var supplyCrate_1, supplyCrate_2, supplyCrate_3; 
var supplyCrateOpened, supplyCrateClosed, isAttached = false, numberLost = 0, lostMessage, totalDelivered = 0;
var helicopter, startedMoving = false; 
var helicopterStill_Img, helicopterMoving_Img;
var strandedPerson1, strandedPerson2, strandedPerson3;
var strandedPerson1_Img, strandedPerson2_Img, strandedPerson3_Img;
var building1, building2, building3, building4, buildings = [];
var rope, rCreated = false;
var ground; 
var completeMessage;
var executed = false;
var gameState = 1;

let supplyCrates = [
  supplyCrate_1, 
  supplyCrate_2, 
  supplyCrate_3
];

let strandedPeople = [
  strandedPerson1,
  strandedPerson2,
  strandedPerson3
];

let strandedPeopleImg = [
  strandedPerson1_Img,
  strandedPerson2_Img,
  strandedPerson3_Img
];

function preload () {
  floodedCityImg = loadImage ("AssetsThisProject/floodedCity.jpg");
  
  supplyCrateOpened = loadImage ("AssetsThisProject/supplyCrateOpened_2.png");
  supplyCrateClosed = loadImage ("AssetsThisProject/supplyCrateClosed_2.png");
  
  helicopterStill_Img = loadImage ("AssetsThisProject/helicopterStill.png");
  helicopterMoving_Img = loadImage ("AssetsThisProject/helicopterMoving.png");

  strandedPeopleImg[0] = loadImage ("AssetsThisProject/strandedPeople/strandedPerson_1.png");
  strandedPeopleImg[1] = loadImage ("AssetsThisProject/strandedPeople/strandedPerson_2.png");
  strandedPeopleImg[2] = loadImage ("AssetsThisProject/strandedPeople/strandedPerson_3.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  // Create Ground & Buildings
  ground = Bodies.rectangle (width/2, height - 20, width, 40, {isStatic : true});
  World.add (world, ground);

  building1 = Bodies.rectangle (width/2 - 260, height/2 + 30, 150, 150, {isStatic: true});
  World.add (world, building1);

  building2 = Bodies.rectangle (width/2 + 135, height/2 + 10, 190, 60, {isStatic: true});
  World.add (world, building2);

  building3 = Bodies.rectangle (width/2 + 300, height/2 + 30, 125, 150, {isStatic: true});
  World.add (world, building3);

  building4 = Bodies.rectangle (width/2 + 425, height/2 + 30, 100, 130, {isStatic: true});
  World.add (world, building4);
 
  buildings = [building2, building3, building4];
  
  // Create Helicopter

  helicopter = createSprite (width/2 - 430, 170);
  helicopter.addImage ("still", helicopterStill_Img);
  helicopter.addImage ("moving", helicopterMoving_Img);
  helicopter.scale = 0.13;

  // Create Supply Crates
  var x = 220;
  for (var i = 0; i < supplyCrates.length; i++) {
    supplyCrates[i] = new SupplyCrate (
      width/2 - x,
      building1.position.y - 125,
      50, 
      50
    );
    x += 40;
  }

  lostMessage = createElement ("h3");
  lostMessage.position (width/2, 50);

  // Create sprites
  var posX = width/2 + 220;
  var posY = height/2 - 65;
  for (var i = 0; i < strandedPeople.length; i++) {
   if (i == 1) {
     posY = height/2 - 94
    } else if (i == 2) {
      posY = height/2 - 75;
    }

   strandedPeople[i] = createSprite (posX, posY);
   strandedPeople[i].addImage (strandedPeopleImg[i]);
   strandedPeople[i].scale = 0.067;

   posX += 100;
  }

  completeMessage = createElement ("h1");
  completeMessage.position (width/2 - 100, height/2 - 200);

  imageMode (CENTER);
  rectMode (CENTER);
}


function draw() {
  image (floodedCityImg, width/2, height/2, width, height);
  if (gameState == 1) {
    if (keyDown (UP_ARROW) && helicopter.position.y > 75) {
      helicopter.position.y -= 10;
      helicopter.changeImage ("moving");
      startedMoving = true;
    } else if (
      keyDown (LEFT_ARROW) && helicopter.position.x > 150 && startedMoving) {
      helicopter.position.x -= 10; 
    } else if  (keyDown (RIGHT_ARROW) &&  helicopter.position.x < width - 150 && startedMoving) {
      helicopter.position.x += 10;
    } else if (keyDown (DOWN_ARROW) && helicopter.position.y < height - 150 && startedMoving) {
      helicopter.position.y += 10;
    } else if (keyDown ("space") && startedMoving) {
      if (!rCreated) {
        var posX = helicopter.position.x;
        var posY = helicopter.position.y;
      
        var dist = supplyCrates[0].body.position.y - posY;
  
        if (helicopter.position.y < supplyCrates[0].body.position.y) {
          rope = new Rope (posX, posY, dist);
        }
  
        rCreated = true;
      }
    }  
  }

  // Check Collisions
  if (rope) {
    rope.display ();
    if (!isAttached) {
      for (var i = 0; i<supplyCrates.length; i++) {
        if (supplyCrates[i].body !== null && rope.body2 !== null) {
          rope.attachCrate (i);
        }
      }
    } 
    for (var i = 0; i < supplyCrates.length; i++) {
      for (var x = 0; x < buildings.length; x++) {
        if (supplyCrates[i].body !== null) {
          var collision = Matter.SAT.collides (supplyCrates[i].body, buildings[x]);
        
          if (collision.collided) {
            supplyCrates[i].sPosition = [
              supplyCrates[i].body.position.x,
              supplyCrates[i].body.position.y
            ];

            rope.deliver (i, supplyCrates[i].sPosition);
          }
        }
      }
    }
  }

  for (var i = 0; i < supplyCrates.length; i++) {    
    if (supplyCrates[i].body !== null) {
      supplyCrates[i].display ();
      supplyCrates[i].groundCollision (i);
    }

    if (supplyCrates[i].isDelivered) {
      var pos = supplyCrates[i].sPosition;

      image (supplyCrates[i].imgArray[1], pos[0], pos[1], 25, 25);
    } 
  }

  if (totalDelivered + numberLost === 3 && !executed) {
    gameState = 2;

    gameEnd ();
    executed = true;
  }

  

  Engine.update(engine);
  drawSprites ();  
}

function gameEnd () {
  lostMessage.hide ();

  delete supplyCrates, buildings, helicopter, rope;

  var w = "supply crate";
  
  if (totalDelivered > 1) {
    w = "supply crates";
  }

  var n;

  if (totalDelivered < 3) {
    n = totalDelivered;
  } else {
    n = "all";
  }
  completeMessage.html(`You've successfully delivered ${n} ${w}`);
}