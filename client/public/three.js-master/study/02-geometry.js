import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"

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

    _setupControls() {
        //OrbitControls객체를 생성하려면 camera객체와 마우스 이벤트를 받는 dom요소가 필요
        new OrbitControls(this._camera, this._divContainer);
    }
    _setupLight() {
        //광원의 색상
        const color = 0xffffff;
        //광원의 세기
        const intensity = 1;
        //광원 생성
        const light = new THREE.DirectionalLight(color, intensity);
        //위치 잡아줌
        light.position.set(-1, 2, 4);
        //_scene객체에 넣어줌
        this._scene.add(light);
    }
    //곡선 그리기
    _setupModel() {
        //curve를 t매개변수 방정식으로 정의함
        class CustomSinCurve extends THREE.Curve {
            constructor(scale) {
                super();
                this.scale = scale;
            }
            getPoint(t) {
                const tx = t * 3 - 1.5;
                const ty = Math.sin(2 * Math.PI * t);
                const tz = 0;
                return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
            }
        }
        //CustomSinCurve는 Curve를 t매개변수 방정식으로 정의
        const path = new CustomSinCurve(4);

        const geometry = new THREE.BufferGeometry();
        //곡선의 부드러움 : 숫자가 클수록 부드러워짐
        const points = path.getPoints();
        geometry.setFromPoints(points);

        const material = new THREE.LineBasicMaterial({color: 0xffff00});
        const line = new THREE.Line(geometry, material);

        this._scene.add(line);
    }
    //하트 매쉬 그리기
    // _setupModel() {
    //     const shape = new THREE.Shape();
    
    //     //더 복잡한 도형
    //     const x = -2.5, y = -5;
    //     shape.moveTo(x + 2.5, y + 2.5);
    //     shape.bezierCurveTo(x + 2.5, y + 2.5, x+2, y, x, y);
    //     shape.bezierCurveTo(x -3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    //     shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    //     shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5 , x + 8, y + 3.5);
    //     shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    //     shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
        
    //     const geometry = new THREE.ShapeGeometry(shape);
        
    //     const fillMaterial = new THREE.MeshPhongMaterial({color: 0x515151});
    //     const cube = new THREE.Mesh(geometry, fillMaterial);

    //     const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
    //     const line = new THREE.LineSegments(
    //         new THREE.WireframeGeometry(geometry), lineMaterial);

    //     const group = new THREE.Group();
    //     group.add(cube);
    //     group.add(line);

    //     this._scene.add(group);
    //     this._cube = group;
    // }
    // _setupModel() {
    //     //이 객체를 생성한 후엔 Shape에 대한 모양을 정의해줘야 모양이 생김
    //     const shape = new THREE.Shape();
    //     // //x, y 좌표로 모양을 생성할 수 있음
    //     // shape.moveTo(1, 1); //(1, 1)로 이동
    //     // shape.lineTo(1, -1);//(1, -1)까지 선을 그음
    //     // shape.lineTo(-1, -1);
    //     // shape.lineTo(-1, 1);
    //     // shape.closePath();//도형 마무리

    //     //더 복잡한 도형
    //     const x = -2.5, y = -5;
    //     shape.moveTo(x + 2.5, y + 2.5);
    //     shape.bezierCurveTo(x + 2.5, y + 2.5, x+2, y, x, y);
    //     shape.bezierCurveTo(x -3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    //     shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    //     shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5 , x + 8, y + 3.5);
    //     shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    //     shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    //     const geometry = new THREE.BufferGeometry();
    //     const points = shape.getPoints();
    //     geometry.setFromPoints(points);

    //     const material = new THREE.LineBasicMaterial({color: 0xffff00});
    //     const line = new THREE.Line(geometry, material);

    //     this._scene.add(line);
    // }
    _setupCamera() {
        //three.js가 3차원 영역을 출력할 부분의 가로, 세로
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        //카메라 시점의 거리 : 클수록 멀어짐
        camera.position.z = 15;
        //생성된 camera 객체를 다른 메소드에서 사용할 수 있도록
        this._camera = camera;
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