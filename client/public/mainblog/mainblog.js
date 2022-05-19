import * as THREE from '../three.js-master/build/three.module.js';
import { GLTFLoader } from '../three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from "../three.js-master/examples/jsm/controls/PointerLockControls.js";

let camera;

const Constants = {
    "Camera": {
        "FOV": 50,
        "Speed" : 50
    }
}
let objParentTransform = [];
let controls, raycaster;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let prevTime = performance.now();

//div요소를 가져옴
const divContainer = document.querySelector("#webgl-container");
//divContainer를 클래스 필드로 지정하는 이유는 divContainer를 this._divContainer로 다른 메소드에서 참조하기 위함


//Renderer 생성
//생성 시 옵션을 줄 수 있음 antialias : 3차원 장면이 렌더링될 때 오브젝트에 계단 현상 없이 표현됨
const renderer = new THREE.WebGLRenderer({ antialias: true });
const canvas = renderer.domElement;
//장치 픽셀 비율을 설정, 캔버스가 흐려지는 것을 방지
renderer.setPixelRatio(window.devicePixelRatio);
//renderer.domElement를 divContainer에 자식으로 추가
//renderer.domElement : canvas 타입의 dom객체
divContainer.appendChild(renderer.domElement);





const scene = new THREE.Scene();


//밑의 3개는 정의되어 있지 않음
setupCamera(); //Camera객체를 구성하는 메소드 호출
setupLight(); //Ligth 설정
setupModel(); //3차원 Model 설정
resize();
animate();
//제일 처음 기본 썸네일 저장
//썸네일을 저장하기 전엔 항상 rendering을 해준 후에 해야 함
render();
  canvas.toBlob((blob) => {
    saveBlob(blob, `screencapture-${ canvas.width }x${ canvas.height }.png`);
  });
// this._setupControls();

//renderer랑 camera는 창 크기가 바뀔 때마다 그 크기에 맞게 재정의 되어야 함
//resize이벤트에 resize메소드를 bind를 사용해서 지정 -> resize 안에서 this가 가리키는 객체가 이벤트객체가 아닌 이 앱 클래스의 객체가 되게 하기 위해
// window.onresize = this.resize.bind(this);
//resize이벤트와는 상관없이 한 번 실행 -> renderer나 camera의 속성을 창 크기에 맞게 설정

//3차원 그래픽 장면을 만들어주는 메소드
// requestAnimationFrame(this.render.bind(this));



function setupModel() {
    //정육면체 형상을 정의
    //인자(가로, 세로, 깊이)
    const geometry = new THREE.BoxGeometry(7, 4, 10);
    
    const fillmaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.BackSide});
    const cube = new THREE.Mesh(geometry, fillmaterial);
    objParentTransform.push(cube);
    const group = new THREE.Group()

    group.add(cube);

    scene.add(group);
    const gltfloader = new GLTFLoader();
    const url = '../../object_files/Old_Bicycle.glb';

    
    gltfloader.load(
        url,
        ( gltf ) => {
            const root = gltf.scene;
            group.add( root ); //group 없으면 _scene.add( root );
            objParentTransform.push( root );
            root.position.set( 1, -1.7, -3 ); //모델 위치 지정

            // 오브젝트 배치할 때 아래에 배치 위치 표시되는 그림자?
            const boundingBox = new THREE.Box3().setFromObject( root ); // 모델의 바운딩 박스 생성
            const objectSize = boundingBox.getSize(new THREE.Vector3()); // 바운딩 박스 사이즈 정보
            
            const rangeGeometry = new THREE.PlaneGeometry(objectSize.x, objectSize.z);
            const rangeMaterial = new THREE.MeshBasicMaterial( {color: "#858585"} );
            const objectRange = new THREE.Mesh( rangeGeometry, rangeMaterial );

            group.add( objectRange );
            objectRange.position.set( 1, -1.9, -3 );
            objectRange.rotation.x = - Math.PI / 2;

        }
    );

}


function setupCamera() {
    
    // const width = this._divContainer.clientWidth;
    // const height = this._divContainer.clientHeight;
    // const camera = new THREE.PerspectiveCamera(
    //     75,
    //     width / height,
    //     0.1,
    //     100
    // );
    camera = new THREE.PerspectiveCamera(75, 
        window.innerWidth / window.innerHeight, 0.1, 2000);
    
    camera.position.set(0, -1, 0);
    //생성된 camera 객체를 다른 메소드에서 사용할 수 있도록
    controls = new PointerLockControls(camera, divContainer);
    scene.add(controls.getObject());

    raycaster = new THREE.Raycaster();
    
    document.body.addEventListener( 'click', function() {
        controls.lock();
    })

    const onKeyDown = (event) => {
        switch(event.code) {
            case 'KeyW':
                moveForward = true;
                break;
            case 'KeyS':
                moveBackward = true;
                break;
            case 'KeyA':
                moveLeft = true;
                break;
            case 'KeyD':
                moveRight = true;
                break;
        }
    };

    const onKeyUp = (event) => {
        switch(event.code) {
            case 'KeyW':
                moveForward = false;
                break;
            case 'KeyS':
                moveBackward = false;
                break;
            case 'KeyA':
                moveLeft = false;
                break;
            case 'KeyD':
                moveRight = false;
                break;
        }
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    window.addEventListener('resize', resize);
}

function boolToInt(b) {
    if(b === true) {
        return 1;
    } return 0;
}


function animate () {
    

    const time = performance.now();
    const delta = ( time - prevTime ) / 20000;
    cameraMovement(delta);

    //console.log(`${controls.isLocked}
    //x : ${camera.position.x}
    //y : ${camera.position.y}
    //z : ${camera.position.z}`);
    
    prevTime = time;

    drawRay();

    render();
    requestAnimationFrame(animate);
          
}
// function thumbnailFilming () {
//     render();
//     canvas.toBlob((blob) => {
//     saveBlob(blob, `screencapture-${ canvas.width }x${ canvas.height }.png`);
    
//     });    
    
//     // html2canvas(document.body).then(canvas => {
//     //     document.body.appendChild(canvas);
//     //     const link = document.createElement('a')
//     //     link.download = 'filename.jpg'
//     //     link.href = canvas.toDataURL()
//     //     document.body.appendChild(link)
//     //     link.click()
//     // });
//     // divContainer.toBlob((blob) => {

//     //   saveBlob(blob, `screencapture-${divContainer.width}x${divContainer.height}.png`);
//     // });    
// }


// 썸네일 촬영하기 버튼 구현
const thumbnailButton = document.querySelector('#thumbnailButton');
thumbnailButton.addEventListener('click', () => {
    //thumbnail을 촬영하기 전엔 항상 rendering을 해주어야 함
    render();
    canvas.toBlob((blob) => {
        saveBlob(blob, `screencapture-${ canvas.width }x${ canvas.height }.png`);
    });
});
const saveBlob = (function() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    return function saveData(blob, fileName) {
       const url = window.URL.createObjectURL(blob);
       a.href = url;
       a.download = fileName;
       a.click();
    };
  }());

function render() {
    renderer.render(scene, camera);
}

function drawRay() {
    let camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    raycaster.set(camera.position, camDir);

    const intersects = raycaster.intersectObjects( objParentTransform, false );
    
    // console.log(intersects.length);
	// if(intersects.length > 0) {
    //     rayMesh.visible = true;
    //     rayMesh.position.copy(intersects[0].point);
    //     //console.log(intersects[0].point);
    // } else {
    //     rayMesh.visible = false;
    // }

    //console.log(debug);
}

function cameraMovement(deltaTime) {
    let camVec = new THREE.Vector3();
    camera.getWorldDirection(camVec);
    camVec.y = 0;
    camVec.normalize();

    const dirZ = boolToInt(moveForward) - boolToInt(moveBackward);
    const dirX = boolToInt(moveLeft) - boolToInt(moveRight);
    
    let camVecLeft = new THREE.Vector3();
    camVecLeft.copy(camVec);
    camVec.multiplyScalar(dirZ);
    
    let temp = camVecLeft.x;
    camVecLeft.x = camVecLeft.z;
    camVecLeft.z = -1 * temp;
    camVecLeft.multiplyScalar(dirX);

    camVec.add(camVecLeft);
    camVec.normalize();
    camera.position.add(camVec.multiplyScalar(deltaTime * Constants.Camera.Speed));
}

    
function setupLight() {
    //광원의 색상
    const color = 0xffffff;
    //광원의 세기
    const intensity = 1;
    //광원 생성
    const leftlight = new THREE.DirectionalLight(color, intensity);
    const rightlight = new THREE.DirectionalLight(color, intensity);
    const underlight = new THREE.DirectionalLight(color, 0.7);
    //위치 잡아줌
    leftlight.position.set(-10, 2.5, 11);
    rightlight.position.set(3.5, 2.5, -3);
    underlight.position.set(0, -2.5, 0);
    //_scene객체에 넣어줌
    scene.add(rightlight);
    scene.add(leftlight);
    scene.add(underlight);
    // objParentTransform.add(leftlight);
    // objParentTransform.add(rightlight);
}

//창크기가 변경될 때 호출되는 메소드

function resize () {
    //this._divContainer의 크기를 얻어옴
    const width = divContainer.clientWidth;
    const height = divContainer.clientHeight;

    //camera의 속성을 설정
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    //renderer의 크기를 설정
    renderer.setSize(width, height);
}
