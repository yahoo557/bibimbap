import * as THREE from '../three.js-master/build/three.module.js';
import { GLTFLoader } from '../three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from "../three.js-master/examples/jsm/controls/PointerLockControls.js";
import { DragControls } from "../three.js-master/examples/jsm/controls/DragControls.js";

// 오브젝트 id : 오브젝트 파일 경로
const objectUrl = {'ob1': '../../object_files/Old_Bicycle.glb', 'ob2': '../../object_files/Plants_on_table.gltf', 'ob3': '../../object_files/Stand_light.glb'};

/* 배치하고 싶은 오브젝트 선택 시 */
const selectObject = document.getElementsByClassName("object-thumbnail"); // 오브젝트 썸네일
//const menuButton = document.getElementsByClassName("menu-button"); // 메뉴 버튼
const cancleButton = document.getElementsByClassName("select-cancle"); // 취소 버튼
const addIcon = document.getElementsByClassName("bi-box"); // 오브젝트 추가 버튼
const addView = document.getElementsByClassName("object-add"); // 오브젝트 추가 기능

window.onload = function () {
    for(let i = 0; i < 4; i++) {
        selectObject[i].addEventListener( 'click', function() {
            const key = selectObject[i].classList.item(1); // 오브젝트 아이디
            const url = objectUrl[key]; // 오브젝트 url
            if(objectUrl[key])
                assignObject( url );
        })
    }
    //menuButton[0].onclick = cancle;
    cancleButton[0].onclick = cancle;
}
function cancle() { // 오브젝트 추가하기 비활성화
    selectRemove();
    addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
    addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기
}
function selectRemove() { // 이전에 선택한 오브젝트 제거
    const allChildren = selectGroup.children;
    const lastObject = [allChildren[allChildren.length - 1], allChildren[allChildren.length - 2]];
    selectGroup.remove(lastObject[0]);
    selectGroup.remove(lastObject[1]);
}

let camera;
const group = new THREE.Group();
const selectGroup = new THREE.Group();
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
// //제일 처음 기본 썸네일 저장
// //썸네일을 저장하기 전엔 항상 rendering을 해준 후에 해야 함
// render();
//   canvas.toBlob((blob) => {
//     saveBlob(blob, `screencapture-${ canvas.width }x${ canvas.height }.png`);
//   });
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
    const room = new THREE.Mesh(geometry, fillmaterial);
    objParentTransform.push(room);

    group.add(room);
    scene.add(group);
}

// 선택된 오브젝트
function assignObject( url ) {
    selectRemove(); // 이전에 선택한 오브젝트 삭제

    const gltfloader = new GLTFLoader();
    const dragObject = [];
    
    gltfloader.load(
        url,
        ( gltf ) => {
            const root = gltf.scene;
            selectGroup.add( root ); //group 없으면 _scene.add( root );
            objParentTransform.push( root );
            root.position.set( 1, -1.7, -3 ); //모델 위치 지정

            // 오브젝트 배치할 때 아래에 위치 표시
            const boundingBox = new THREE.Box3().setFromObject( root ); // 모델의 바운딩 박스 생성
            const objectSize = boundingBox.getSize(new THREE.Vector3()); // 바운딩 박스 사이즈 정보
            
            const rangeGeometry = new THREE.PlaneGeometry(objectSize.x, objectSize.z);
            const rangeMaterial = new THREE.MeshBasicMaterial({ color: "#858585" });
            const objectRange = new THREE.Mesh( rangeGeometry, rangeMaterial );

            selectGroup.add( objectRange );
            objectRange.position.set( 1, -1.9, -3 );
            objectRange.rotation.x = - Math.PI / 2;
        }
    );
    
    scene.add(selectGroup);
    renderer.render(scene, camera);
    requestAnimationFrame(setupModel);

    // 드래그 앱 드롭으로 오브젝트 옮기기
    dragObject.push(selectGroup);
    const dragControls = new DragControls( [... dragObject], camera, divContainer);
    dragControls.addEventListener( 'dragstart', function ( event ) {

        event.object.material.emissive.set( 0xaaaaaa );
    
    } );

    dragControls.dragControls.addEventListener('drag', (event) => {
        event.object.parent.position.copy(event.object.postion);
        event.object.position.set(0, 0, 0);
    });
    
    dragControls.addEventListener( 'dragend', function ( event ) {
        event.object.material.emissive.set( 0x000000 );
    } );
}

function setupCamera() {
    camera = new THREE.PerspectiveCamera(75, 
        window.innerWidth / window.innerHeight, 0.1, 2000);
    
    camera.position.set(0, -1, 0);
    //생성된 camera 객체를 다른 메소드에서 사용할 수 있도록
    controls = new PointerLockControls(camera, divContainer);
    scene.add(controls.getObject());

    raycaster = new THREE.Raycaster();
    
    divContainer.addEventListener( 'click', function() {
        if(addView[0].style.display == "block") { // 오브젝트 배치 중일 때는 포인트 락 안 됨
            return;
        }
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
    
    prevTime = time;

    drawRay();

    render();
    requestAnimationFrame(animate);      
}



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
