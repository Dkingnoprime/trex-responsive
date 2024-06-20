var PLAY = 1
var END = 0
var gamestate = PLAY
var morri
var jump
var point
var score = 0 

var trex, trex_running, edges;
var trexcollide
var groundImage;
var cloud, cloudImg

var cac1, cac2, cac3, cac4, cac5, cac5
var gameover, gameoverimg, restart, restartimg

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexcollide = loadImage("trexdead.png")
  groundImage = loadImage("ground2.png")
  cloudImg = loadImage("cloud.png")
  cac1 = loadImage("obstacle1.png")
  cac2 = loadImage("obstacle2.png")
  cac3 = loadImage("obstacle3.png")
  cac4 = loadImage("obstacle4.png")
  cac5 = loadImage("obstacle5.png")
  cac6 = loadImage("obstacle6.png")
  gameoverimg = loadImage("gameOver.png")
  restartimg = loadImage("restart.png")
  jump = loadSound("jump.mp3")
  point = loadSound("checkpoint.mp3")
  morri = loadSound("morri-meme-1_eajUyjwb.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //criando o trex
  trex = createSprite(50, height -70, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("dead", trexcollide);
 // trex.debug = true
  edges = createEdgeSprites();
  trex.setCollider("circle", 0, 0, 42)

  ground = createSprite(width/2, height -20, 1879, 962);
  ground.addImage(groundImage)
  ground.x = ground.width /2

  //chão invisível 
  invisibleGround = createSprite(width/2, height -10, width, 10);
  invisibleGround.visible = false;

  obstaculesGroup = new Group()
  cloudsGroup = new Group()
  gameover = createSprite(width/2, height/2)
  gameover.addImage(gameoverimg)
  gameover.visible = false
  gameover.scale = 0.7
  restart = createSprite(width/2, height/2 +50)
  restart.addImage(restartimg)
  restart.visible = false
  restart.scale = 0.5




  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50
}


function draw() {
  //definir a cor do plano de fundo 
  background(300);
  //pontos
  fill ("black")
  text("Score: " +score, width/2 +400, height/2 )


  if (gamestate === PLAY) {

    score=score +Math.round(getFrameRate()/60)
    if (score>0 && score%500===0){
     //point.play()
    }
    //movimento do chão
    ground.velocityX = -(3 + 3*score/100)
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }
    trex.velocityY = trex.velocityY + 0.5;
    //pular quando tecla de espaço for pressionada
    if (keyDown("space") && trex.y >= height-60 || (touches.length>0 && trex.y >= height-60)) {
      trex.velocityY = -10;
      //jump.play()]
      touches=[] 
    }
    if (obstaculesGroup.isTouching(trex)) {
      gamestate = END
      morri.play()
    }
    spawnClouds()
    spawnCac()
    


  } else if (gamestate === END) {
    ground.velocityX = 0
    obstaculesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    trex.changeAnimation("dead", trexcollide)
    trex.scale = 0.1
    obstaculesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)
    trex.velocityY = 0
    gameover.visible = true 
    restart.visible = true
    if (mousePressedOver(restart) || touches.length >0){
      touches=[]
      reset()
    }
  }

  //registrando a posição y do trex
  //console.log(trex.y)

  //impedir que o trex caia
  trex.collide(invisibleGround)
  drawSprites();
}

function spawnClouds() {
  if (frameCount % 45 === 0) {
    cloud = createSprite(width, height, 25, 25);
    cloud.velocityX = -3;
    cloud.addImage(cloudImg);
    cloud.scale = 0.4;
    cloud.y = Math.round(random(height, height/2 -300));
    cloud.lifetime = 800
    cloudsGroup.add(cloud)
  }
}
function spawnCac() {
  if (frameCount % 120 === 0) {
    cacs = createSprite(width, height-30, 30, 30);
    cacs.velocityX = -(4 + score/100);
    var num = Math.round(random(1, 6));
    switch (num) {
      case 1: cacs.addImage(cac1)
        break;
      case 2: cacs.addImage(cac2)
        break;
      case 3: cacs.addImage(cac3)
        break;
      case 4: cacs.addImage(cac4)
        break;
      case 5: cacs.addImage(cac5)
        break;
      case 6: cacs.addImage(cac6)
        break;
      default:
        break;
    }
    cacs.scale = 0.4
    cacs.lifetime = 800
    obstaculesGroup.add(cacs)
  }
}
function reset() {
  gamestate = PLAY
  gameover.visible = false 
  restart.visible = false
  cloudsGroup.destroyEach()
  obstaculesGroup.destroyEach()
  trex.changeAnimation("running")
  trex.scale=0.5
  score=0
}