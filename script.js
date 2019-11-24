let WIDTH = 600*1.5
let HEIGHT = 340*1.5

var app = new PIXI.Application({ width: WIDTH, height: HEIGHT });
document.querySelector(".canvasContainer").appendChild(app.view);

var stage = (app.stage = new PIXI.display.Stage());
var lightR = new PIXI.lights.PointLight(0xffbf00, 6);
var lightL = new PIXI.lights.PointLight(0xffbf00, 0);
var lightC = new PIXI.lights.PointLight(0xff3300, 0);

let displayText;
let gameActive = false;

// put all layers for deferred rendering of normals
stage.addChild(new PIXI.display.Layer(PIXI.lights.diffuseGroup));
stage.addChild(new PIXI.display.Layer(PIXI.lights.normalGroup));
stage.addChild(new PIXI.display.Layer(PIXI.lights.lightGroup));

PIXI.loader
  .add(
    "bg_diffuse",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FBG.png?v=1573973578540"
  )
  .add(
    "bg_normal",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FNormalMap.png?v=1573974228592"
  )
  .add(
    "block_diffuse",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FTheremin.png?v=1573977008542"
  )
  .add(
    "play_diffuse",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2Fplay.png?v=1574390546582"
  )
  .add(
    "pause_diffuse",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2Fpause.png?v=1574394242058"
  )
  .add(
    "pause_normal",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2Fdownload.png?v=1573973983373"
  )
  .load(onAssetsLoaded);

function createPair(diffuseTex, normalTex) {
  var container = new PIXI.Container();
  var diffuseSprite = new PIXI.Sprite(diffuseTex);
  diffuseSprite.parentGroup = PIXI.lights.diffuseGroup;
  var normalSprite = new PIXI.Sprite(normalTex);
  normalSprite.parentGroup = PIXI.lights.normalGroup;
  container.addChild(diffuseSprite);
  container.addChild(normalSprite);
  return container;
}

function onAssetsLoaded(loader, res) {
  var bg = createPair(res.bg_diffuse.texture, res.bg_normal.texture);
  var fg = createPair(res.block_diffuse.texture, res.bg_normal.texture);
  var play = createPair(res.play_diffuse.texture, res.bg_normal.texture);
  var pause = createPair(res.pause_diffuse.texture, res.pause_normal.texture);
  var playLight = new PIXI.lights.PointLight(0xff7f00, 3);
  let scale = WIDTH/2390 ;
  // 0.252;
  
  [bg,fg,play,pause].forEach((e)=>{
    e.scale = new PIXI.Point(scale, scale)
  })
  bg.interactive = true
  play.interactive = true
  bg.position.set(0, 0);
  fg.position.set(0, HEIGHT*-.0125);
  play.position.set(WIDTH*.45, HEIGHT*.395);
  playLight.position.set(WIDTH*.45, HEIGHT*.395);
  pause.position.set(WIDTH*.0125,HEIGHT*.825);
  
  [pause,lightR,lightL,lightC].forEach(e=>{
    e.visible = false;
  })
  
  stage.addChild(bg, fg, play, playLight, pause);

  stage.addChild(new PIXI.lights.AmbientLight(null, 1));
  stage.addChild(new PIXI.lights.DirectionalLight(null, 1, fg));
  stage.addChild(lightR, lightL, lightC);

  
  let playPause = event => {
    play.visible = !play.visible;
    play.interactive = !play.interactive
    pause.visible = !pause.visible;
    pause.interactive = !pause.interactive
    playLight.visible = !playLight.visible;
    lightR.visible = !lightR.visible;
    lightL.visible = !lightL.visible;
    lightC.visible = !lightC.visible;
    lightR.position.copy(event.data.global);
    updateTextAndAudio(event.data.global.x, event.data.global.y)
    getVideo();
    if (!gameActive) {
      gainNode.gain.setTargetAtTime(
        calculateGain(0),
        context.currentTime,
        0.001
      );
    }
    if (oscillator === null) {
      createOscillator();
    }
    if (context && gameActive){
      context.resume()
    }else{
      context.suspend()
    }
  } 
  
  play.on("pointerdown", event => {
    gameActive = true;
    playPause(event);
  });
  
  pause.on("pointerdown", event => {
    gameActive = false;
    console.log('pause')
    playPause(event)
  });
  
  bg.on("pointermove", function(event) {
    if (gameActive) {
      lightL.intensity = 0;
      lightR.position.copy(event.data.global);
      updateTextAndAudio(event.data.global.x, event.data.global.y) 
    }
  });
  
  bg.on("pointerdown", function(event) {
    if (gameActive) {
      lightL.intensity = 0;
      lightR.position.copy(event.data.global);
      updateTextAndAudio(event.data.global.x, event.data.global.y) 
    }
  });
  
  let warmLights = [ 
   {x: 0.23039276123046876 * WIDTH, y: 0.4809034459731158 * HEIGHT},
   {x: 0.40115692138671877 * WIDTH, y: 0.6336615169749541 * HEIGHT},
   {x: 0.9425523885091146 * WIDTH, y: 0.5915714039522059 * HEIGHT},
   {x: 0.8194022623697916 * WIDTH, y: 0.7614661721622242 * HEIGHT},
   {x: 0.8256411743164063 * WIDTH, y: 0.0489926955279182 * HEIGHT},
   {x: 0.11977320353190105 * WIDTH, y: 0.8508505428538603 * HEIGHT},
   {x: 0.33254694620768227 * WIDTH, y: 0.9263327205882353 * HEIGHT},
   {x: 0.7407407633463542 * WIDTH, y: 0.9326670927159927 * HEIGHT},
   {x: 0.6591830444335938 * WIDTH, y: 0.7735333610983456 * HEIGHT},
   {x: 0.39131688435872397 * WIDTH, y: 0.789508954216 * HEIGHT}
  ];

  warmLights.forEach(e => {
    let warmpointLight = new PIXI.lights.PointLight(0xff7f00);
    warmpointLight.position.copy(e);
    stage.addChild(warmpointLight);
  });

  document.fonts.load('10pt "IBM Plex Mono"').then(() => {
    displayText = new PIXI.Text("G|0", {
      fontFamily: "IBM Plex Mono",
      fontSize: WIDTH/30,
      fill: 0xe68a00,
      align: "center"
    });
    displayText.position.set(WIDTH*.51 - displayText.width / 2, HEIGHT * .745);
    stage.addChild(displayText);
    // console.log(displayText)
  });

  //For staging new lights
  //                 let lightPos = []

  //                 bg.on('pointerdown', function (event) {
  //                     var clickLight = new PIXI.lights.PointLight(0xff7f00);
  //                     clickLight.position.copy(event.data.global);
  //                     lightPos.push(JSON.stringify(event.data.global))
  //                     console.log(lightPos)
  //                     stage.addChild(clickLight);

  //                 });
}

const updateTextAndAudio = (x,y) => {
  let formatedNote = generateNote(x,y);
  displayText.text = formatedNote.scale + "|" + formatedNote.level;
  displayText.position.set(WIDTH*.51 - displayText.width / 2, HEIGHT * .745);
  changeFrequency(formatedNote.scaleNum, formatedNote.level);
}