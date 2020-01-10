const isMobile = (/Mobi|Android/i.test(navigator.userAgent))
let WIDTH = 600*1.5
let HEIGHT = 350*1.5
let stageScale = WIDTH/2390 ;
let mouseMoved = 0
let time = 0
let timeFreq = 50
let amountMoved = 0
let svgMask = document.querySelector('svg')
let svgPath1 = "M2215.46,1305c-677.2,51-1353.67,51-2034.12,0-49.38-3.7-104-52.5-113.59-97.9-75.38-357.2-86.33-709.43,0-1064.14C80,93.27,132,48.84,181.34,45,861.79-7.46,1536.76-6,2215.46,45c49.38,3.71,101.76,48.13,113.59,97.9,85.16,358.08,83.66,713.56,0,1064.14C2317.18,1256.83,2264.8,1300.76,2215.46,1305Z"
let svgPath2 = "M2304,1347c-46,2-2023,0-2211,0-48.25,0-88.5-42.75-89-90C.14,892,1.72,458.06,4,93,4.33,39.67,44,3.72,93,3c68-1,2117-1,2211,0,53,.56,88.28,40,90,90,3,87,3,1018,0,1164C2393,1308,2352.45,1344.89,2304,1347Z"

var app = new PIXI.Application({ width: WIDTH, height: HEIGHT });
document.querySelector(".canvasContainer").appendChild(app.view);
app.ticker.add((delta)=>{
  time+=delta/timeFreq
  let inc = .05
  let lerpedColor = lerpColor(0xff7f00,0xff3300,amountMoved)
  
  if(mouseMoved <= 100){
    mouseMoved += 1
  }
  
  
  if(playLight && !gameActive){
    playLight.brightness = 6 + (Math.cos(time)*2)
  }
  
  if(theremin){

    if(gameActive && theremin.scale.x < stageScale * 1.15){
      theremin.scale = new PIXI.Point(theremin.scale.x+stageScale*.0125, theremin.scale.y+stageScale*.0125)
      theremin.position.set((WIDTH-theremin.width)/1.8, (HEIGHT-theremin.height)/2);
      
      fg.scale = new PIXI.Point(theremin.scale.x+stageScale*.015, theremin.scale.y+stageScale*.015)
      fg.position.set((WIDTH-fg.width)/2, (HEIGHT-fg.height)/1.8);
      
      if(bgm){
          bg2.scale = new PIXI.Point(bg2.scale.x-stageScale*.0025, bg2.scale.y-stageScale*.0025)
          bg2.position.x = (WIDTH-bg2.width)/2;
      }else{
          bg.scale = new PIXI.Point(bg.scale.x-stageScale*.0025, bg.scale.y-stageScale*.0025)
          bg.position.x = (WIDTH-bg.width)/2;
        
      }

      
      
      
    }else if(!gameActive && theremin.scale.x > stageScale * .99){
      console.log(theremin.scale.x)
      theremin.scale = new PIXI.Point(theremin.scale.x-stageScale*.0125, theremin.scale.y-stageScale*.0125)
      theremin.position.set((WIDTH-theremin.width)/1.8, (HEIGHT-theremin.height)/2);
      
      fg.scale = new PIXI.Point(theremin.scale.x-stageScale*.02, theremin.scale.y-stageScale*.02)
      fg.position.set((WIDTH-fg.width)/2, (HEIGHT-fg.height)/2);
      
      if(bgm){
        bg2.scale = new PIXI.Point(bg2.scale.x+stageScale*.0025, bg2.scale.y+stageScale*.0025)
        bg2.position.x = (WIDTH-bg2.width)/2;
      }else{
        bg.scale = new PIXI.Point(bg.scale.x+stageScale*.0025, bg.scale.y+stageScale*.0025)
        bg.position.x = (WIDTH-bg.width)/2;
      }
    }
    
  }
  
  if(warmLightContainer.children[0]){
    warmLightContainer.children[0].brightness = 1+Math.cos(time) * 1
    warmLightContainer.children[1].brightness = 1+Math.cos(time-.8) * 1
    warmLightContainer.children[2].brightness = 1+Math.cos(time-1.6) * 1
    warmLightContainer.children[3].brightness = 1+Math.cos(time-.4) * 1
  }

  if(bgm){
    if(amountMoved < 1){  
      amountMoved += inc
      playLight.color = 0xff3300
      lightR.color = 0xff3300
      lightL.color = 0xff3300
      lightC.color = 0xff0000
      bg2.position.x = WIDTH - amountMoved * WIDTH
      songCred.alpha += inc
      warmLightContainer.children.forEach((e,i)=>{
        if(i>3){
          e.color = lerpedColor
        }else{
        }
      }) 
      if(legato){
        legato=false
      }
      [displayText,displayText2,displayText3].forEach(e=>{
        e.style.fill = lerpedColor
      });
    }
  }else{
    if(amountMoved > 0){
      amountMoved -= inc
      playLight.color = 0xff7f00
      lightR.color = 0xff7f00
      lightL.color = 0xff7f00
      lightC.color = 0xff0000
      // bg.position.x = -WIDTH + (1-amountMoved) * WIDTH 
      bg2.position.x = (1-amountMoved) * WIDTH
      songCred.alpha -= inc
      warmLightContainer.children.forEach((e,i)=>{
        if(i>3){
          e.color = lerpedColor
        }else{
        }
      }) 
      if(!legato){
        legato=true
      }
      [displayText,displayText2,displayText3].forEach(e=>{
        e.style.fill = lerpedColor
      });
    }
  }
})

var stage = (app.stage = new PIXI.display.Stage());
var warmLightContainer = new PIXI.Container();
var lightR = new PIXI.lights.PointLight(0xff7f00, 3, 40);
var lightL = new PIXI.lights.PointLight(0xff7f00, 0, 40);
var lightC = new PIXI.lights.PointLight(0xff3300, 0);
let bg,bg2,fg,theremin,
    play,playLight,
    pause,songButton,videoButton,cameraLight,songCred,
    knob1,knob2,knob3,knob4
 
let displayText,displayText2,displayText3,displayText4
    gameActive = false;

// Put all layers for deferred rendering of normals
stage.addChild(new PIXI.display.Layer(PIXI.lights.diffuseGroup));
stage.addChild(new PIXI.display.Layer(PIXI.lights.normalGroup));
stage.addChild(new PIXI.display.Layer(PIXI.lights.lightGroup));

PIXI.loader
  .add(
    "bg_diffuse",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FMoog2.jpg?v=1577159332224"
  )
  .add(
    "bg_normal",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FNormalMap.png?v=1573974228592"
  )
  .add(
    "block_diffuse",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FTheremin.png?v=1578116116353"
  )
  .add(
    "fg_diffuse",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FFG.png?v=1578116118337"
  )
  .add(
    "play_diffuse",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FAsset%2012.png?v=1575954688741"
  )
  .add(
    "pause_diffuse",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FPause.png?v=1576389309779"
  )
  .add(
    "buttonNormal",
    "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FButtonNormalMap.png?v=1576389309693"
  )
  .add(
      "bg2",
      "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FBG2-2.jpg?v=1578135634873"
  )
  .add(
      "wholeNote",
      "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FWholeNote.png"
  )
  .add(
      "eigthNote",
      "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FEightNote.png"
  )
  .add(
      "video",
      "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FVideoPlay.png"
  )
  .add(
      "videoPause",
      "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FVideoPause.png"
  )
  .add(
      "knob_normal",
      "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FKnob_normal.jpg?v=1578116121032"
  )
  .add(
      "knob_diffuse",
      "https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FKnob.png?v=1578209346680"
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
  fg = createPair(res.fg_diffuse.texture, res.bg_normal.texture);
  theremin = createPair(res.block_diffuse.texture, res.bg_normal.texture);
  play = createPair(res.play_diffuse.texture, res.bg_normal.texture);
  pause = createPair(res.pause_diffuse.texture, res.buttonNormal.texture);
  playLight = new PIXI.lights.PointLight(0xff7f00, 6);
  songButton = createPair(res.eigthNote.texture, res.buttonNormal.texture);
  videoButton = createPair(res.video.texture, res.buttonNormal.texture);
  
//   knob1 = createPair(res.knob_diffuse.texture, res.knob_normal.texture);
//   knob2 = createPair(res.knob_diffuse.texture, res.knob_normal.texture);
//   knob3 = createPair(res.knob_diffuse.texture, res.knob_normal.texture);
  
  knob1 = new PIXI.Sprite(res.knob_diffuse.texture);
  knob2 = new PIXI.Sprite(res.knob_diffuse.texture);
  knob3 = new PIXI.Sprite(res.knob_diffuse.texture);
  knob4 = new PIXI.Sprite(res.knob_diffuse.texture);
  
  [bg2,fg,theremin,play,pause,songButton,videoButton].forEach((e)=>{
    e.scale = new PIXI.Point(stageScale, stageScale)
  })
  
  bg.scale = new PIXI.Point(stageScale*1.05, stageScale*1.05)
  bg.position.set((WIDTH-bg.width)/2, (HEIGHT-bg.height)/2);
  bg2.position.set(WIDTH,0);
  fg.position.set(0, 0);
  theremin.position.set(0,0);
  play.position.set(WIDTH*.4, HEIGHT*.3);
  playLight.position.x = play.width/2
  playLight.position.y = play.height/2
  pause.position.set(WIDTH*.015,HEIGHT*.74);
  songButton.position.set(WIDTH*.02,HEIGHT*.025);
  videoButton.position.set(WIDTH*.925,HEIGHT*.75);
  
  
  // knob1.position.set(WIDTH*.384,HEIGHT*.792);
  // knob2.position.set(WIDTH*.653,HEIGHT*.792);
  // knob3.position.set(WIDTH*.705,HEIGHT*.792);
  
  [knob1,knob2,knob3,knob4].forEach((e)=>{
    //Center Pivot Point
    e.anchor.set(0.5,0.5)
    e.x = e.width / 2;
    e.y = e.height / 2;
    e.rotation = -.8 * Math.PI;
    e.parentGroup = PIXI.lights.diffuseGroup;
    theremin.addChild(e)
  });
  
  knob1.position.set(theremin.children[0].width*.376,theremin.children[0].height*.8);
  knob2.position.set(theremin.children[0].width*.642,theremin.children[0].height*.8);
  knob3.position.set(theremin.children[0].width*.695,theremin.children[0].height*.8);
  knob4.position.set(theremin.children[0].width*.695,theremin.children[0].height*.8);

  
  [bg,play].forEach((e)=>{
    e.interactive = true;
  });
  
  [pause,lightR,lightL,lightC,songButton,videoButton].forEach(e=>{
    e.visible = false;
  });
  
  let playPause = event => {
    
    [play,playLight,pause,songButton,videoButton,lightR,lightL,lightC,songCred].forEach(e=>{
      e.visible = !e.visible;
    });
    
    [play,pause,songButton,videoButton,stage].forEach(e=>{
      e.interactive = !e.interactive;
    });
    
    lightR.position.copy(event.data.global);
    updateTextAndAudio(event.data.global.x, event.data.global.y)
    document.querySelector('.canvasContainer').classList.toggle('active')
    
  } 
  
  let warmLights = [ 
   {x: 0.13039276123046876 * WIDTH, y: 0.4809034459731158 * HEIGHT, color:0xff0000},
   {x: 0.40115692138671877 * WIDTH, y: 0.3336615169749541 * HEIGHT, color:0xff0000},
   {x: 0.9425523885091146 * WIDTH, y: 0.5915714039522059 * HEIGHT, color:0xff0000},
   {x: 0.7425523885091146 * WIDTH, y: 0.1915714039522059 * HEIGHT, color:0xff0000},
    
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
  
  cameraLight = new PIXI.lights.PointLight(0xff0000, 0, 40);
  cameraLight.position.x = videoButton.position.x + videoButton.width/2
  cameraLight.position.y = videoButton.position.y + videoButton.height/2

  stage.addChild(bg, bg2, fg, theremin, play, playLight, pause, songButton, videoButton);
  stage.addChild(new PIXI.lights.AmbientLight(null, 1.1));
  stage.addChild(new PIXI.lights.DirectionalLight(null, 1, bg));
  stage.addChild(lightR, lightL, lightC, warmLightContainer, cameraLight);
  
  document.fonts.load('10pt "America Mono"').then(() => {
    displayText = new PIXI.Text("", {
      fontFamily: "America Mono",
      fontSize: theremin.children[0].width/40,
      fill: 0xff7f00,
      align: "left"
    });
    displayText.position.set(theremin.children[0].texture.width*.513, theremin.children[0].texture.height * .762);
    displayText.alpha = .3
    
    displayText2 = new PIXI.Text("", {
      fontFamily: "America Mono",
      fontSize: theremin.children[0].width/40,
      fill: 0xff7f00,
      align: "left"
    });
    displayText2.position.set(theremin.children[0].texture.width*.44, theremin.children[0].texture.height * .762);
    
    document.fonts.load('10pt "Pose Font"').then(() => {
      displayText3 = new PIXI.Text("", {
        fontFamily: "Pose Font",
        fontSize: theremin.children[0].width/24,
        fill: 0xff7f00,
        align: "center",
        letterSpacing:-3
      });
      displayText3.position.set(theremin.children[0].texture.width*.562 - displayText3.width/2, theremin.children[0].texture.height * .792 - displayText3.height/2);
      theremin.addChild(displayText3);
    })
  
    
    
    theremin.addChild(displayText,displayText2);
    
    songCred = new PIXI.Text("Alice in 冷凍庫【Orangestar feat. IA】", {
      fontFamily: "America Mono",
      fontSize: WIDTH/45,
      fontStyle:"italic",
      fill: 0xffffff,
      align: "left"
    });
    
    songCred.position.set(WIDTH*.09, HEIGHT*.075 - songCred.height/2);
    songCred.alpha = 0;
    songCred.visible = false;
    
    songCred.parentGroup = PIXI.lights.diffuseGroup;
    console.log(songCred)
    stage.addChild(songCred)
  });
    // console.log(displayText)
    
    
  videoButton.on('pointerdown', function(event){
    console.log('video')
    if (gameActive) {
      getWebCam()
      if(this.children[0].texture === res.video.texture){
        this.children[0].texture = res.videoPause.texture
        cameraLight.brightness = 1
      }else{
        this.children[0].texture = res.video.texture
        cameraLight.brightness = 0
      }
    }
  })
  
  songButton.on('pointerdown', function(event){
    console.log('song')
    bgm = !bgm
    if (gameActive) {
      lightL.intensity = 0;
      lightR.position.copy(event.data.global);
      updateTextAndAudio(event.data.global.x, event.data.global.y) 
      if(bgm){
        pattern.start()
        songButton.children[0].texture = res.wholeNote.texture
        displayText.alpha = 1
      }else{
        pattern.stop()
        songButton.children[0].texture = res.eigthNote.texture
        displayText.alpha = .3
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
    

  //For staging new lights
//                   let lightPos = []

//                   bg.on('pointerdown', function (event) {
//                       var clickLight = new PIXI.lights.PointLight(0xff0000,6);
//                       clickLight.position.copy(event.data.global);
                    
//                       lightPos.push(JSON.stringify(event.data.global))
//                       console.log(lightPos)
//                       stage.addChild(clickLight);

//                   });
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

document.querySelector('nav .material-icons').addEventListener('pointerdown',(event)=>{
  document.querySelector('body').classList.toggle('dark')
})
