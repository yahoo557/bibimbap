import * as THREE from '../build/three.module.js';


class App {
    //_로 시작하는 핃드, 메소드는 App 클래스 내에서만 쓰이는 private 필드, 메소드임
    //js에서는 필드, 메소드를 정의할 때 private 속성을 주는 기능이 없음 
    //_은 개발자들간의 약속
    constructor() {
        //div요소를 가져옴
        const divContainer = document.querySelector("#webgl-container");
        //divContainer를 클래스 필드로 지정하는 이유는 divContainer를 this._divContainer로 다른 메소드에서 참조하기 위함
        this._divContainer = divContainer;

        //Renderer 생성
        //생성 시 옵션을 줄 수 있음 antialias : 3차원 장면이 렌더링될 때 오브젝트에 계단 현상 없이 표현됨
        const renderer = new THREE.WebGLRenderer({ antialias: true });

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
        this._setupControls();

        //renderer랑 crama는 창 크기가 바뀔 때마다 그 크기에 맞게 재정의 되어야 함
        //resize이벤트에 resize메소드를 bind를 사용해서 지정 -> resize 안에서 this가 가리키는 객체가 이벤트객체가 아닌 이 앱 클래스의 객체가 되게 하기 위해
        window.onresize = this.resize.bind(this);
        //resize이벤트와는 상관없이 한 번 실행 -> renderer나 camera의 속성을 창 크기에 맞게 설정
        this.resize();

        //3차원 그래픽 장면을 만들어주는 메소드
        requestAnimationFrame(this.render.bind(this));
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
        camera.position.z = 5;
        //생성된 camera 객체를 다른 메소드에서 사용할 수 있도록
        this._camera = camera;
    }
    _setupLight() {
        //광원의 색상
        const color = 0xffffff;
        //광원의 세기
        const intensity = 1;
        //광원 생성
        const light = new THREE.DirectionalLight(color, intensity);
        //위치 잡아줌
        light.position.set(-1, 2, 2);
        //_scene객체에 넣어줌
        this._scene.add(light);
    }
    // 파란색 계열의 정육면제 mesh를 생성
    _setupModel() {
        //정육면체 형상을 정의
        //인자(가로, 세로, 깊이)
        const geometry = new THREE.BoxGeometry(5, 3, 10);
        //파란색 계열의 재질을 생성
        const material = new THREE.MeshPhongMaterial({color: 0x44a88});
        const cube = new THREE.Mesh(geometry, material);

        this._scene.add(cube);
        this._cube = cube;
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
        this._renderer.setSize(window.innerWidth, window.innerHeight);
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
    }
    update(time) {
        //밀리세컨단위를 세컨단위로 바꿈
        time *= 0.001;
        //x, y축의 회전값을 time값으로 준다.
        // this._cube.rotation.x = time;
        // this._cube.rotation.y = time;
    }
}

//window에서 App 클래스를 생성
window.onload = function() {
    new App();
}