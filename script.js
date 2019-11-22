 var app = new PIXI.Application({ width: 600, height: 340 });
            document.querySelector('.canvasContainer').appendChild(app.view);

            var stage = app.stage = new PIXI.display.Stage();
            var lightR = new PIXI.lights.PointLight(0xffbf00, 3);
            var lightL = new PIXI.lights.PointLight(0xffbf00, 3);
            let displayText
            let gameActive = false

            // put all layers for deferred rendering of normals
            stage.addChild(new PIXI.display.Layer(PIXI.lights.diffuseGroup));
            stage.addChild(new PIXI.display.Layer(PIXI.lights.normalGroup));
            stage.addChild(new PIXI.display.Layer(PIXI.lights.lightGroup));

            PIXI.loader
                .add('bg_diffuse', 'https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FBG.png?v=1573973578540')
                .add('bg_normal', 'https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FNormalMap.png?v=1573974228592')
                .add('block_diffuse', 'https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FTheremin.png?v=1573977008542')
                .add('block_normal', 'https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FNormalMap.png?v=1573974228592')
                .add('play_diffuse', 'https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2Fplay.png?v=1574390546582')
                .add('play_normal', 'https://cdn.glitch.com/e352d3ca-2e03-47f1-acfd-675dff041f5f%2FNormalMap.png?v=1573974228592')
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
                var block = createPair(res.block_diffuse.texture, res.block_normal.texture);
                var play = createPair(res.play_diffuse.texture, res.play_normal.texture);
                var playLight = new PIXI.lights.PointLight(0xff7f00, 3);
                let scale = .252
                bg.scale = new PIXI.Point(scale,scale)
                block.scale = new PIXI.Point(scale,scale)
                play.scale = new PIXI.Point(scale,scale)
                bg.position.set(0,0)
                block.position.set(0,-6);
                play.position.set(270,140);
                playLight.position.set(280,140);
                lightR.visible = false
                lightL.visible = false
                stage.addChild(bg,block,play,playLight);

                stage.addChild(new PIXI.lights.AmbientLight(null, 1));
                stage.addChild(new PIXI.lights.DirectionalLight(null, 1, block));
                stage.addChild(lightR,lightL);
              
                stage.interactive = true
              
              
                stage.on('pointerdown',(event)=>{
                  play.visible = !play.visible
                  playLight.visible = !playLight.visible
                  lightR.visible = !lightR.visible
                  lightL.visible = !lightL.visible
                  lightR.position.copy(event.data.global);
                  lightL.position.copy(event.data.global);
                  gameActive = !gameActive
                  getVideo()
                  if(!gameActive){
                    gainNode.gain.setTargetAtTime(calculateGain(0), context.currentTime, 0.001);
                  }
                  if(oscillator === null){
                     createOscillator()
                  }
                })
                              
                stage.on('mouseover',()=>{
                  mouseOver = true
                })
                stage.on('mouseout',()=>{
                  mouseOver = false
                  
                })
                stage.on('pointermove', function (event) {
                  if(gameActive){
                    lightR.position.copy(event.data.global);
                    lightL.position.copy(event.data.global);
                    let formatedNote = generateNote(event.data.global.x,event.data.global.y)
                    displayText.text = formatedNote.scale + '|' + formatedNote.level
                    displayText.position.set(308-displayText.width/2,249)
                    changeFrequency(formatedNote.scaleNum,formatedNote.level)
                  }
                });

                let warmLights= [{"x":138.23565673828125,"y":163.50717163085938}, {"x":240.69415283203125,"y":215.44491577148438}, {"x":565.5314331054688,"y":201.13427734375}, {"x":491.641357421875,"y":258.89849853515625}, {"x":495.38470458984375,"y":16.657516479492188}, {"x":71.86392211914062,"y":289.2891845703125}, {"x":199.52816772460938,"y":314.953125}, {"x":444.4444580078125,"y":317.1068115234375}, {"x":395.50982666015625,"y":263.0013427734375}, {"x":234.79013061523438,"y":268.43304443359375}]
                
                warmLights.forEach(e=>{
                  let warmpointLight = new PIXI.lights.PointLight(0xff7f00);
                    warmpointLight.position.copy(e);
                    stage.addChild(warmpointLight);
                })
              
                document.fonts.load('10pt "IBM Plex Mono"').then(()=>{
                  displayText = new PIXI.Text('G|0',{fontFamily : 'IBM Plex Mono', fontSize: 22,fill : 0xe68a00, align : 'center'});
                  displayText.position.set(308-displayText.width/2,249)
                  stage.addChild(displayText);
                  // console.log(displayText)
                })
                
              
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