import * as THREE from './three.js-master/build/three.module.js';
import { OrbitControls } from "./three.js-master/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from './three.js-master/examples/jsm/loaders/GLTFLoader.js';
//import { PointerLockControls } from "./three.js-master/examples/jsm/controls/PointerLockControls.js";
import { FirstPersonControls } from './three.js-master/examples/jsm/controls/FirstPersonControls.js';


// const objects = [];

// let prevTime = performance.now();
// const velocity = new THREE.Vector3();
// const direction = new THREE.Vector3();
// const vertex = new THREE.Vector3();
// const color = new THREE.Color();

class App {
    //_로 시작하는 핃드, 메소드는 App 클래스 내에서만 쓰이는 private 필드, 메소드임
    //js에서는 필드, 메소드를 정의할 때 private 속성을 주는 기능이 없음 
    //_은 개발자들간의 약속
    //constructor은 클래스의 인스턴스 객체를 생성하고 초기화하는 메서드
    
    constructor() {
        //div요소를 가져옴
        const divContainer = document.querySelector("#webgl-container");
        //divContainer를 클래스 필드로 지정하는 이유는 divContainer를 this._divContainer로 다른 메소드에서 참조하기 위함
        this._divContainer = divContainer;


        //Renderer 생성
        //생성 시 옵션을 줄 수 있음 antialias : 3차원 장면이 렌더링될 때 오브젝트에 계단 현상 없이 표현됨
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        //장치 픽셀 비율을 설정, 캔버스가 흐려지는 것을 방지
        renderer.setPixelRatio(window.devicePixelRatio);
        //renderer.domElement를 divContainer에 자식으로 추가
        //renderer.domElement : canvas 타입의 dom객체
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;


        const scene = new THREE.Scene();
        this._scene = scene;

        //밑의 3개는 정의되어 있지 않음
        this._setupCamera(); //Camera객체를 구성하는 메소드 호출
        this._setupLight(); //Ligth 설정
        this._setupModel(); //3차원 Model 설정
        // this._setupControls();

        //renderer랑 camera는 창 크기가 바뀔 때마다 그 크기에 맞게 재정의 되어야 함
        //resize이벤트에 resize메소드를 bind를 사용해서 지정 -> resize 안에서 this가 가리키는 객체가 이벤트객체가 아닌 이 앱 클래스의 객체가 되게 하기 위해
        window.onresize = this.resize.bind(this);
        //resize이벤트와는 상관없이 한 번 실행 -> renderer나 camera의 속성을 창 크기에 맞게 설정
        this.resize();

        //3차원 그래픽 장면을 만들어주는 메소드
        requestAnimationFrame(this.render.bind(this));
        
    }

    //_setupControls() {
    //     //OrbitControls객체를 생성하려면 camera객체와 마우스 이벤트를 받는 dom요소가 필요
    //     new OrbitControls(this._camera, this._divContainer);
    //}

    _setupModel() {
        //정육면체 형상을 정의
        //인자(가로, 세로, 깊이)
        const geometry = new THREE.BoxGeometry(7, 4, 10);
        
        const fillmaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.BackSide});
        const cube = new THREE.Mesh(geometry, fillmaterial);

        const group = new THREE.Group()

        group.add(cube);
        // objects.push( cube );

        this._scene.add(group);
        this._cube = group;
        const gltfloader = new GLTFLoader();
        const url = './object_files/Stand_light.glb';
        
        gltfloader.load(
            url,
            ( gltf ) => {
                const root = gltf.scene;
                group.add( root ); //group 없으면 _scene.add( root );
                gltf.scene.position.set(2, -2, -4); //모델 위치
            }
        );

    }


    _setupCamera() {
        //three.js가 3차원 영역을 출력할 부분의 가로, 세로
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );

        //생성된 camera 객체를 다른 메소드에서 사용할 수 있도록
        this._camera = camera;
        this._camera.position.set(0, -1, 0);
        this._camera.lookAt(0, -1, 0);

        //const controls = new PointerLockControls(this._camera, this._divContainer);
        const controls = new FirstPersonControls(this._camera, this._renderer.domElement);
        this._controls = controls;
        this._controls.movementSpeed = 0.000001; // 카메라의 이동 속도
        this._controls.lookSpeed = 0.00000015; // 카메라의 look around 속도
        this._controls.heightMax = 10;

        /*
        document.body.addEventListener( 'click', function() {
            controls.lock();
            // animate();
        })

        controls.addEventListener( 'lock', function () {

        } );

        controls.addEventListener( 'unlock', function () {

        } );*/
    }

    _setupLight() {
        //광원의 색상
        const color = 0xffffff;
        //광원의 세기
        const intensity = 1;
        //광원 생성
        const leftlight = new THREE.DirectionalLight(color, intensity);
        const rightlight = new THREE.DirectionalLight(color, intensity);
        //위치 잡아줌
        leftlight.position.set(-10, 2.5, 11);
        rightlight.position.set(3.5, 2.5, -3);
        //_scene객체에 넣어줌
        this._scene.add(rightlight);
        this._scene.add(leftlight);
    }

    //창크기가 변경될 때 호출되는 메소드
    resize() {
        //this._divContainer의 크기를 얻어옴
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        //camera의 속성을 설정
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        //renderer의 크기를 설정
        this._renderer.setSize(width, height);
    }
    //time : 렌더링이 처음 시작된 이후에 경과된 값, 단위 : 밀리초
    //time 인자를 장면의 애니메이션에 이용할 수 있음
    render(time){
        //renderer가 scene을 camera의 시점을 이용해서 rendering 하라
        this._renderer.render(this._scene, this._camera);
        //time을 인자로 주면 메소드가 속성값을 변화시켜 애니메이션 효과를 발생
        this.update(time);
        //생성자에서 호출했던 코드와 동일
        //render 메소드가 무한으로 반복해서 호출이 됨
        //적당한 시점에 최대한 빠르게 툴을 해준다.
        requestAnimationFrame(this.render.bind(this));
        this._controls.update(time);
    }
    update(time) {
        //밀리세컨단위를 세컨단위로 바꿈
        time *= 0.001;
    }
}

//window에서 App 클래스를 생성
window.onload = function() {
    new App();
}