let WIDTH = 600*1.2
let HEIGHT = 350*1.2
let mouseMoved = 0
let time = 0
let amountMoved = 0
let svgMask = document.querySelector('svg')
let svgPath1 = "M2215.46,1305c-677.2,51-1353.67,51-2034.12,0-49.38-3.7-104-52.5-113.59-97.9-75.38-357.2-86.33-709.43,0-1064.14C80,93.27,132,48.84,181.34,45,861.79-7.46,1536.76-6,2215.46,45c49.38,3.71,101.76,48.13,113.59,97.9,85.16,358.08,83.66,713.56,0,1064.14C2317.18,1256.83,2264.8,1300.76,2215.46,1305Z"
let svgPath2 = "M2304,1347c-46,2-2023,0-2211,0-48.25,0-88.5-42.75-89-90C.14,892,1.72,458.06,4,93,4.33,39.67,44,3.72,93,3c68-1,2117-1,2211,0,53,.56,88.28,40,90,90,3,87,3,1018,0,1164C2393,1308,2352.45,1344.89,2304,1347Z"

var app = new PIXI.Application({ width: WIDTH, height: HEIGHT });
document.querySelector(".canvasContainer").appendChild(app.view);
app.ticker.add((delta)=>{
  if(mouseMoved <= 100){
    mouseMoved += 1
  }
  time+=delta/35
  if(playLight && !gameActive){
    playLight.brightness = playLight.brightness + (Math.cos(time)*.05)
  }
  
  if(warmLightContainer.children[0]){
    warmLightContainer.children[0].brightness = Math.cos(time) * 1.2
    warmLightContainer.children[1].brightness = Math.cos(time-.8) * 1.2
    warmLightContainer.children[2].brightness = Math.cos(time-1.6) * 1.2
  }
  
  let inc = .05
  if(bgm){
    if(amountMoved < 1){
      let lerpedColor = lerpColor(0xff7f00,0xff3300,amountMoved)
      amountMoved += inc
      playLight.color = 0xff3300
      lightR.color = 0xff3300
      lightL.color = 0xff3300
      lightC.color = 0xff0000
      bg.position.x = amountMoved * -WIDTH
      bg2.position.x = WIDTH - amountMoved * WIDTH
      warmLightContainer.children.forEach((e,i)=>{
        if (i>2){
          e.color = lerpedColor
        }else{
          e.position.x -= inc * WIDTH
        }
      }) 
      if(legato){
        legato=false
      }
      displayText.style.fill = lerpedColor
    }
  }else{
    if(amountMoved > 0){
      let lerpedColor = lerpColor(0xff7f00,0xff3300,amountMoved)
      amountMoved -= inc
      playLight.color = 0xff7f00
      lightR.color = 0xff7f00
      lightL.color = 0xff7f00
      lightC.color = 0xff0000
      bg.position.x = -WIDTH + (1-amountMoved) * WIDTH 
      bg2.position.x = (1-amountMoved) * WIDTH
      warmLightContainer.children.forEach((e,i)=>{
        if (i>2){
          e.color = lerpedColor
        }else{
          e.position.x += inc * WIDTH
        }
      }) 
      if(!legato){
        legato=true
      }
      displayText.style.fill = lerpedColor
    }
  }
})

var stage = (app.stage = new PIXI.display.Stage());
var warmLightContainer = new PIXI.Container();
var lightR = new PIXI.lights.PointLight(0xff7f00, 3);
var lightL = new PIXI.lights.PointLight(0xff7f00, 0);
var lightC = new PIXI.lights.PointLight(0xff3300, 0);
let bg,bg2,fg,play,playLight,pause,songButton,songText1,songText2
// var graphics = new PIXI.Graphics();
// stage.addChild(graphics)
 
let displayText,
    gameActive = false;

// Put all layers for deferred rendering of normals
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
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FAsset%2012.png?v=1575954688741"
  )
  .add(
    "pause_diffuse",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FAsset%2014.png?v=1575955374602"
  )
  .add(
    "pause_normal",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2Fdownload.png?v=1573973983373"
  )
  .add(
      "bg2",
      "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2Fbg2-02.jpg?v=1575853530852"
  )
  .add(
      "note1",
      "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FSingle-Note.png?v=1575954688617"
  )
  .add(
      "note2",
      "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FDouble-Note.png?v=1575954688592"
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
  bg = createPair(res.bg_diffuse.texture, res.bg_normal.texture);
  bg2 = createPair(res.bg2.texture, res.bg_normal.texture);
  fg = createPair(res.block_diffuse.texture, res.bg_normal.texture);
  play = createPair(res.play_diffuse.texture, res.bg_normal.texture);
  pause = createPair(res.pause_diffuse.texture, res.pause_normal.texture);
  playLight = new PIXI.lights.PointLight(0xff7f00, 6);
  songText1 = res.note1.texture
  songText2 = res.note2.texture
  songButton = createPair(songText2, res.pause_normal.texture);
  let scale = WIDTH/2390 ;
  
  [bg,bg2,fg,play,pause,songButton].forEach((e)=>{
    e.scale = new PIXI.Point(scale, scale)
  })

  bg.position.set(0, 0);
  bg2.position.set(WIDTH,0);
  fg.position.set(0, 0);
  play.position.set(WIDTH*.4, HEIGHT*.3);
  playLight.position.set(WIDTH*.5, HEIGHT*.5);
  pause.position.set(WIDTH*.045,HEIGHT*.83);
  songButton.position.set(WIDTH*.89,HEIGHT*.81);
  
  [bg,play].forEach(e=>{
    e.interactive = true;
    console.log(e)
  });
  
  [pause,lightR,lightL,lightC,songButton].forEach(e=>{
    e.visible = false;
  });
  
  stage.addChild(bg, bg2, fg, play, playLight, pause, songButton);

  stage.addChild(new PIXI.lights.AmbientLight(null, 1));
  stage.addChild(new PIXI.lights.DirectionalLight(null, 1, fg));
  stage.addChild(lightR, lightL, lightC, warmLightContainer);

  
  let playPause = event => {
    
    [play,playLight,pause,songButton,lightR,lightL,lightC].forEach(e=>{
      e.visible = !e.visible;
    });
    
    [play,pause,songButton].forEach(e=>{
      e.interactive = !e.interactive;
    });
    
    lightR.position.copy(event.data.global);
    updateTextAndAudio(event.data.global.x, event.data.global.y)
    getVideo();
    // if (!gameActive) {
    //   gainNode.gain.setTargetAtTime(
    //     calculateGain(0),
    //     context.currentTime,
    //     0.001
    //   );
    // }
    // if (oscillator === null) {
    //   createOscillator();
    // }
    // if (context && gameActive){
    //   context.resume()
    // }else{
    //   context.suspend()
    // }
  } 
  
  songButton.on('pointerdown', function(event){
    console.log('song')
    bgm = !bgm
    if (gameActive) {
      lightL.intensity = 0;
      lightR.position.copy(event.data.global);
      updateTextAndAudio(event.data.global.x, event.data.global.y) 
      if(bgm){
        pattern.start()
        songButton.children[0].texture = songText1
      }else{
        pattern.stop()
        songButton.children[0].texture = songText2
      }
    }
  })
  
  play.on("pointerdown", event => {
    gameActive = true;
    playPause(event);
    // Tone.context.resume()
    mainOsc.start()
    Tone.Transport.start();
    document.querySelector('#animation').setAttribute('from',svgPath1)
    document.querySelector('#animation').setAttribute('to',svgPath2)
    document.querySelector('#animation').beginElement();
    
    if(bgm === true){
      pattern.start()
    }

  });
  
  pause.on("pointerdown", event => {
    gameActive = false;
    console.log('pause')
    playPause(event)
    mainOsc.stop()
    Tone.Transport.stop();
    pattern.stop()
    document.querySelector('#animation').setAttribute('from',svgPath2)
    document.querySelector('#animation').setAttribute('to',svgPath1)
    document.querySelector('#animation').beginElement();
  });
  
  bg.on("pointermove", function(event) {
    if (gameActive) {
      mouseMoved = 0;
      lightL.intensity = 0;
      lightR.position.copy(event.data.global);
      updateTextAndAudio(event.data.global.x, event.data.global.y) 
    }
  });
  
  bg.on("pointerdown", function(event) {
    console.log('bg')
    if (gameActive) {
      lightL.intensity = 0;
      lightR.position.copy(event.data.global);
      updateTextAndAudio(event.data.global.x, event.data.global.y) 
    }
  });
  

  
  let warmLights = [ 
   {x: 0.23039276123046876 * WIDTH, y: 0.4809034459731158 * HEIGHT, color:0xff0000},
   {x: 0.40115692138671877 * WIDTH, y: 0.6336615169749541 * HEIGHT, color:0xff0000},
   {x: 0.9425523885091146 * WIDTH, y: 0.5915714039522059 * HEIGHT, color:0xff0000},
   {x: 0.8194022623697916 * WIDTH, y: 0.7614661721622242 * HEIGHT, color:0xff7f00},
   {x: 0.8256411743164063 * WIDTH, y: 0.0489926955279182 * HEIGHT, color:0xff7f00},
   {x: 0.11977320353190105 * WIDTH, y: 0.8508505428538603 * HEIGHT, color:0xff7f00},
   {x: 0.33254694620768227 * WIDTH, y: 0.9263327205882353 * HEIGHT, color:0xff7f00},
   {x: 0.7407407633463542 * WIDTH, y: 0.9326670927159927 * HEIGHT, color:0xff7f00},
   {x: 0.6591830444335938 * WIDTH, y: 0.7735333610983456 * HEIGHT, color:0xff7f00},
   {x: 0.39131688435872397 * WIDTH, y: 0.789508954216 * HEIGHT, color:0xff7f00}
  ];

  warmLights.forEach(e => {
    let warmpointLight = new PIXI.lights.PointLight(e.color, 1.2);
    warmpointLight.position.copy(e);
    warmLightContainer.addChild(warmpointLight);
  });

  document.fonts.load('10pt "IBM Plex Mono"').then(() => {
    displayText = new PIXI.Text("", {
      fontFamily: "IBM Plex Mono",
      fontSize: WIDTH/30,
      fill: 0xff7f00,
      align: "center"
    });
    displayText.position.set(WIDTH*.51 - displayText.width / 2, HEIGHT * .5);
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
 
const lerpColor = function(a, b, amount) {
    const ar = a >> 16,
          ag = a >> 8 & 0xff,
          ab = a & 0xff,

          br = b >> 16,
          bg = b >> 8 & 0xff,
          bb = b & 0xff,

          rr = ar + amount * (br - ar),
          rg = ag + amount * (bg - ag),
          rb = ab + amount * (bb - ab);

    return (rr << 16) + (rg << 8) + (rb | 0);
};
