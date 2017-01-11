'use strict';

import  { Texture, Vector2, RawShaderMaterial, OrthographicCamera, Scene, WebGLRenderer, PlaneGeometry, Clock, ShaderMaterial, Mesh, MeshBasicMaterial} from 'three';
import CamTexture from "../lib/webcam"


const dat = require('dat.gui/build/dat.gui.js');
const TweenMax = require('gsap');
const glslify = require('glslify');
const Stats = require('stats.js');
const THREE = require('three');

const imageSrcs = [
    'app.jpg'
];
let loadedCnt = 0, texture;

export default class App {
    constructor(params){
        this.params = params || {};
        this.camera = new OrthographicCamera( -window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, 0.1, 1000);

        this.scene = new Scene();
        this.scene.add(this.camera)


        this.renderer = new WebGLRenderer({
            antialias: true
        });
        this.renderer.setClearColor(0x000);
        this.dom = this.renderer.domElement;

        if(this.params.isDebug){
            this.stats = new Stats();
            document.body.appendChild(this.stats.dom);
            this._addGui();
        }

        this.clock = new Clock();

        this.resize();
    }
    
    _addGui(){
        this.gui = new dat.GUI();
    }
    
    createMesh(){
        let geo = new THREE.PlaneBufferGeometry(1, 1);

        let mat = new RawShaderMaterial({
            uniforms : {
                tMain : {value : this.camTexture},
                uResolution : {value : new Vector2( this.camTexture.image.width, this.camTexture.image.height )}
            },
            defines: {
                RAD: 5,
            },
            vertexShader : glslify('../shaders/shader.vert'),
            fragmentShader : glslify('../shaders/shader.frag'),
            side : THREE.DoubleSide
        });

        let mesh = new Mesh(geo, mat);
        mesh.scale.set( this.camTexture.image.width, this.camTexture.image.height, 1 );

        return mesh;
    }

    animateIn(){
        this.camTexture = new CamTexture({width: 800, height: 600});
        this._onCamReady = this._onCamReady.bind(this);
        this.camTexture.eventDispatcher.addEventListener("textuer:ready", this._onCamReady.bind(this));
    }
    _onCamReady(){
        this.camTexture.eventDispatcher.removeEventListener("textuer:ready", this._onCamReady);
        this.mesh = this.createMesh();
        this.scene.add(this.mesh);
        this.mesh.position.z = -10;

        TweenMax.ticker.addEventListener('tick', this.loop, this);
    }
    loop(){
        this.camTexture.updateTexture();
        this.renderer.render(this.scene, this.camera);
        if(this.stats) this.stats.update();

    }

    animateOut(){
        TweenMax.ticker.removeEventListener('tick', this.loop, this);
    }

    onMouseMove(mouse){

    }

    onKeyDown(ev){
        switch(ev.which){
            case 27:
                this.isLoop = !this.isLoop;
                if(this.isLoop){
                    this.clock.stop();
                    TweenMax.ticker.addEventListener('tick', this.loop, this);
                }else{
                    this.clock.start();
                    TweenMax.ticker.removeEventListener('tick', this.loop, this);
                }
                break;
        }
    }

    resize(){
        this.camera.left   = -window.innerWidth/2;
        this.camera.right  = window.innerWidth/2;
        this.camera.top    =  window.innerHeight/2;
        this.camera.bottom = -window.innerHeight/2;
        this.camera.updateProjectionMatrix();


        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    destroy(){

    }

}
