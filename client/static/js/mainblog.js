import * as THREE from '../lib/three.js-master/build/three.module.js';
import { GLTFLoader } from '../lib/three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from "../lib/three.js-master/examples/jsm/controls/PointerLockControls.js";
import { DragControls } from "../lib/three.js-master/examples/jsm/controls/DragControls.js";

// import path from 'path';

// 배치 정보 => 배치 id : { 'template_id': 오브젝트id,  'model_position': 오브젝트 위치,  'objectRotaion': 오브젝트 방향,  'post_id': 게시물id}
// object.name에 배치id 적을 것

//div요소를 가져옴
const divContainer = document.querySelector("#webgl-container");
//divContainer를 클래스 필드로 지정하는 이유는 divContainer를 this._divContainer로 다른 메소드에서 참조하기 위함

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {

    console.log("onStart");
	LoadingWithMask();

};

loadingManager.onLoad = function ( ) {

	closeLoadingWithMask();

};


loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

	// console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

loadingManager.onError = function ( url ) {

	// console.log( 'There was an error loading ' + url );

};

function LoadingWithMask() {
    var maskHeight = $(document).height();
    var maskWidth  = window.document.body.clientWidth;

    var loadingImg = '';

    loadingImg += "<div id='mask' style='position:absolute; z-index:125000; background-color:#000000; display:none; left:0; top:0;'>";
    loadingImg += " <img id='loadingImg' src='http://localhost/static/images/LoadingImg.gif' style='position: relative; display: block; margin: 0px auto;'/>";
    loadingImg += "</div>";  
  
    //화면에 레이어 추가
    $('body')
        // .append(mask)
        .append(loadingImg)
        
    //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채웁니다.
    $('#loadingImg').css({
        'width' : maskWidth
        , 'height': maskHeight
        // , 'opacity' : '0.3'
}); 
    $('#mask').css({
            'width' : maskWidth
            , 'height': maskHeight
            // , 'opacity' : '0.3'
    }); 
  
    //마스크 표시
    $('#mask').show();   
  
    //로딩중 이미지 표시
    $('#loadingImg').show();

}
function closeLoadingWithMask() {
    $('#mask, #loadingImg').hide();
    $('#mask, #loadingImg').remove();  
}


// 블로그로 이동하면 cookie에 블로그 오브젝트 리스트를 저장하고 main.html을 로드함
const parseCookie = str => 
            str.split(';').map(v => v.split('=')).reduce((acc, v) => {
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                return acc;
            }, {});
var cookie = document.cookie;

// 해당 블로그의 오브젝트 리스트, 이것을 반복문 돌려서 각 오브젝트들을 렌더
let object_list = parseCookie(cookie).object_list.split(":")[1].slice(1,-1).replace(/\"/g, "").split(",");
console.log(object_list);
let object_info = [];
let object_scene = [];
const gltfloader = new GLTFLoader();
const getObject = (function(id){
    const xhr = new XMLHttpRequest();
    const method = "get";
    const targetURL = "http://localhost/api/object/getObjectByID/"+id;
    xhr.open(method, targetURL);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () =>{
        // console.log(JSON.parse(xhr.response).path);
        gltfloader.load(
            JSON.parse(xhr.response).path,
            ( gltf ) => {
                const root = gltf.scene;
                object_scene.push(root);
                group.add(root);
                objParentTransform.push( root );
                var objectPosi = JSON.parse(xhr.response).data.model_position;
                var objectRota = JSON.parse(xhr.response).data.model_rotation;
                root.position.set( objectPosi[0], objectPosi[1], objectPosi[2] ); //모델 위치
                root.rotation.y = objectRota * Math.PI / 2; // 모델 방향
                root.name = id; // 오브젝트 이름: 배치 id
                setObjectName( root, id );
            }
        );

        const infoBody = JSON.parse(xhr.response);
        object_info[infoBody.data.object_id] = infoBody;
    }
    xhr.send();
});

function initBlogObjects() {
    object_list.forEach(element => {
        if(!element) return;
        getObject(element);
    });
}

   
// const objectAssign = {'as1': { 'template_id': 'ob1',  'model_position': [0, -2, 3],  'model_rotation': 0,  'post_id': 'po2' },
//                     'as2': { 'template_id': 'ob4',  'model_position': [2, 1, 4.9],  'model_rotation': 2,  'post_id': null },
//                     'as3': { 'template_id': 'ob3',  'model_position': [-2, -1.1, 3],  'model_rotation': 2,  'post_id': 'po1' }};

// 오브젝트 템플릿 파일 => 오브젝트 id : { 'model_path': 오브젝트 파일 경로, 'thumbnail_path': 오브젝트 썸네일 파일 경로, 'placementLocation' : 배치 가능한 위치('floor': 바닥, wall: 벽, ceiling: 천장)}
let objectTemplate; //= {'ob1': {'model_path': '../../object_files/Old_Bicycle.glb', 'thumbnail_path': '../../object_thumbnail/Old_Bicycle.png', 'placementLocation': 'floor'},
//                     'ob2': {'model_path': '../../object_files/Plants_on_table.gltf', 'thumbnail_path': '../../object_thumbnail/Plants_on_table.png', 'placementLocation': 'floor'},
//                     'ob3': {'model_path': '../../object_files/Evita_chandelier.gltf', 'thumbnail_path': '../../object_thumbnail/Evita_chandelier.png', 'placementLocation': 'ceiling'},
//                     'ob4': {'model_path': '../../object_files/angle_clock.glb', 'thumbnail_path': '../../object_thumbnail/angle_clock.png', 'placementLocation': 'wall'}};
const blank = '../../object_thumbnail/blank.png';

let camera;
const group = new THREE.Group();
const selectGroup = new THREE.Group();
const Constants = {
    "Camera": {
        "FOV": 50,
        "Speed" : 50
    }
};
let objParentTransform = [];
let controls, raycaster;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// 오브젝트 선택을 위한 부분
let clickRaycaster;
const clickPointer = new THREE.Vector2();
let INTERSECTED;

// 새로운 오브젝트 배치 & 드래그로 이동을 위한 변수들

let dragControls;
let rotationX;
let rotationZ;
let checkXY;
let checkXZ;
let objectSize;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let prevTime = performance.now();


//Renderer 생성
//생성 시 옵션을 줄 수 있음 antialias : 3차원 장면이 렌더링될 때 오브젝트에 계단 현상 없이 표현됨
const renderer = new THREE.WebGLRenderer({ antialias: true });
const canvas = renderer.domElement;
//장치 픽셀 비율을 설정, 캔버스가 흐려지는 것을 방지
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.domElement를 divContainer에 자식으로 추가
//renderer.domElement : canvas 타입의 dom객체
divContainer.appendChild( renderer.domElement );

const scene = new THREE.Scene();

//밑의 3개는 정의되어 있지 않음
setupCamera(); //Camera객체를 구성하는 메소드 호출
setupLight(); //Ligth 설정
setupModel(); //3차원 Model 설정
resize();
animate();

// window.onload = () => {
    initBlogObjects();
    initTemplates();
// }

// iframe post_id listener
window.addEventListener('message', e => {
    if(e.data.code == 1) { // 글 작성 완료
        objectAndWrittenPostLink(e.data.post_id);
    } else if(e.data.code == 2) { // 글 수정 완료
        postEditComplete();
    }
});


// renderer랑 camera는 창 크기가 바뀔 때마다 그 크기에 맞게 재정의 되어야 함
// resize이벤트에 resize메소드를 bind를 사용해서 지정 -> resize 안에서 this가 가리키는 객체가 이벤트객체가 아닌 이 앱 클래스의 객체가 되게 하기 위해
// window.onresize = this.resize.bind(this);
// resize이벤트와는 상관없이 한 번 실행 -> renderer나 camera의 속성을 창 크기에 맞게 설정

// 3차원 그래픽 장면을 만들어주는 메소드
// requestAnimationFrame(this.render.bind(this));

function objectAndWrittenPostLink(post_id) {
    sendObjectData(post_id);
    const iframeTag = document.getElementsByClassName("iframe-write-post");
    iframeTag[0].parentNode.removeChild(iframeTag[0]);
    const postWriteView = document.getElementsByClassName("post-write-view");
    postWriteView[0].style.display = "none";
    menuArea[0].style.display = "none"; // 메뉴 사용 환경 비활성화
    document.getElementsByClassName('post-link-view')[0].style.display = "none"; // 게시물 연결 페이지 비활성화
    addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
}

function setupModel() {
    //정육면체 형상을 정의
    //인자(가로, 세로, 깊이)
    const geometry = new THREE.BoxGeometry(7, 4, 10);
    
    const fillmaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.BackSide});
    const room = new THREE.Mesh(geometry, fillmaterial);
    objParentTransform.push(room);
    room.name = "room";

    group.add(room);

    // setObjectInBlog();
    object_list.forEach(element => {
        getObject(element);
    });
    
    scene.add(group);

    clickRaycaster = new THREE.Raycaster();
}

// object DB에서 배치된 오브젝트 불러와서 배치
// function setObjectInBlog() {
//     const objectAssignLen = Object.keys(objectAssign).length; // 오브젝트 배치 개수
//     const gltfloader = new GLTFLoader();

//     for(let i = 0; i < objectAssignLen; i++) {
//         const key = Object.keys(objectAssign)[i]; // 배치 아이디
//         const objectKey = objectAssign[key]['template_id']; // 오브젝트 id
//         const url = objectTemplate[objectKey]['model_path']; // 오브젝트 url
//         const objectPosi = objectAssign[key]['model_position']; // 오브젝트 위치
//         const objectRota = objectAssign[key]['model_rotation']; // 오브젝트 방향
//         gltfloader.load(
//             url,
//             ( gltf ) => {
//                 const root = gltf.scene; 
//                 group.add(root);
//                 objParentTransform.push( root );
    
//                 root.position.set( objectPosi[0], objectPosi[1], objectPosi[2] ); //모델 위치
//                 root.rotation.y = objectRota * Math.PI / 2; // 모델 방향
//                 root.name = key; // 오브젝트 이름: 배치 id

//                 setObjectName( root, key );
//             }
//         );
//     }
// }
// // 오브젝트 name을 배치 id(=object DB key값)로 설정
function setObjectName( nameObjects, key ) {
    const allChildren = nameObjects.children;
    for(let i = 0; i < allChildren.length; i++) {
        allChildren[i].name = key;
        if(allChildren[i].children.length > 0) {
            setObjectName( allChildren[i], key );
        }
    }
}

const dragSpeed = 0.7;
// 새롭게 배치를 위해 선택된 오브젝트 = 바닥
function assignObjectFloor( url ) {
    selectRemove(); // 이전에 선택한 오브젝트 삭제

    // 카메라가 바라보고 있는 방향
    let lookCamera = new THREE.Vector3();
    camera.getWorldDirection(lookCamera);
    assignSetFloor( lookCamera ); // 배치하기 전 설정해야 하는 내용
    

    // 사용자가 보고 있는 방향을 기준으로 오브젝트가 생성되도록
    prePosition[0] = camera.position.x + lookCamera.x * 4;
    prePosition[1] = -2;
    prePosition[2] = camera.position.z + lookCamera.z * 4;

    const gltfloader = new GLTFLoader();
    const dragObject = [];
    gltfloader.load(
        url,
        ( gltf ) => {
            const root = gltf.scene;
            selectGroup.add(root);
            dragObject.push(root);

            // 오브젝트 배치할 때 아래에 위치 표시
            const boundingBox = new THREE.Box3().setFromObject( root ); // 모델의 바운딩 박스 생성
            objectSize = boundingBox.getSize(new THREE.Vector3()); // 바운딩 박스 사이즈 정보
            
            const rangeGeometry = new THREE.PlaneGeometry(objectSize.x, objectSize.z);
            const rangeMaterial = new THREE.MeshBasicMaterial({ color: "#858585" });
            const objectRange = new THREE.Mesh( rangeGeometry, rangeMaterial );

            // 최초 배치 위치가 벽을 벗어나는 경우 방 안으로 배치되도록
            if(prePosition[0] < -3.5 + objectSize.x/2) {
                prePosition[0] = -3.5 + objectSize.x/2;
            }
            if(prePosition[0] > 3.5 - objectSize.x/2) {
                prePosition[0] = 3.5 - objectSize.x/2;
            }
            if(prePosition[2] < -5 + objectSize.z/2) {
                prePosition[2] = -5 + objectSize.z/2;
            }
            if(prePosition[2] > 5 - objectSize.z/2) {
                prePosition[2] = 5 - objectSize.z/2;
            }
            root.position.set( prePosition[0], prePosition[1] + 0.1, prePosition[2] ); //모델 위치 지정

            selectGroup.add(objectRange);
            objectRange.position.set( prePosition[0], prePosition[1] + 0.001, prePosition[2] );
            objectRange.rotation.x = - Math.PI / 2;
        }
    );
    
    scene.add(selectGroup);
    renderer.render(scene, camera);
    requestAnimationFrame(setupModel);

    assignDragFloor( dragObject );
}
// 편집 모드에서 이동 선택된 오브젝트 = 바닥
function moveObjectFloor( moveObject ) {
    // 카메라가 바라보고 있는 방향
    let lookCamera = new THREE.Vector3();
    camera.getWorldDirection(lookCamera);
    assignSetFloor( lookCamera );

    const dragObject = [];
    dragObject.push(moveObject);

    // 오브젝트 이동할 때 아래에 위치 표시
    const boundingBox = new THREE.Box3().setFromObject( moveObject ); // 모델의 바운딩 박스 생성
    objectSize = boundingBox.getSize(new THREE.Vector3()); // 바운딩 박스 사이즈 정보

    const rangeGeometry = new THREE.PlaneGeometry(objectSize.x, objectSize.z);
    const rangeMaterial = new THREE.MeshBasicMaterial({ color: "#858585" });
    const objectRange = new THREE.Mesh( rangeGeometry, rangeMaterial );

    moveObject.position.set( prePosition[0], prePosition[1] + 0.1, prePosition[2] ); //모델 위치 지정

    selectGroup.add(objectRange);
    objectRange.position.set( prePosition[0], prePosition[1] + 0.001, prePosition[2] );
    objectRange.rotation.x = - Math.PI / 2;

    scene.add(selectGroup);
    renderer.render(scene, camera);

    assignDragFloor( dragObject );
}
// 배치하기 전 설정해야 하는 내용 = 바닥
function assignSetFloor( lookCamera ) {
    rotationX = 1;
    rotationZ = 1;
    checkXZ = false;

    if(lookCamera.x < 0) rotationX = -1;
    if(lookCamera.z < 0) rotationZ = -1;
    if(Math.abs(lookCamera.x) > Math.abs(lookCamera.z)) checkXZ = true;
}
// 드래그 앤 드롭으로 오브젝트 옮기기 = 바닥
function assignDragFloor( dragObject ) {
    dragControls = new DragControls( dragObject, camera, divContainer);

    let pastPositionY = -2;
    dragControls.transformGroup = true;
    dragControls.addEventListener( 'drag', function ( event ) {
        // 카메라 방향에서 x, z축 방향이 바뀌었을 경우
        if(checkXZ) {
            event.object.position.x = prePosition[0] - rotationX * (pastPositionY + 0.1 - event.object.position.y); // x축(앞뒤 거리) 이동
        }
        else {
            // 위로는 못 움직이게 제한(바닥 오브젝트 기준) + 마우스 위아래 이동을 z축에 적용
            event.object.position.z = prePosition[2] - rotationZ * (pastPositionY - event.object.position.y); // z축(앞뒤 거리) 이동
        }
        pastPositionY = event.object.position.y; // y축 좌표 기억
        event.object.position.y = -1.9; // y축(높이) 고정

        // x축이 벽 밖으로 나가지 않도록
        if(event.object.position.x < -3.5 + objectSize.x/2) event.object.position.x = -3.5 + objectSize.x/2;
        if(event.object.position.x > 3.5 - objectSize.x/2) event.object.position.x = 3.5 - objectSize.x/2;

        // z축이 벽 밖으로 나가지 않도록
        if(event.object.position.z < -5 + objectSize.z/2) event.object.position.z = -5 + objectSize.z/2;
        if(event.object.position.z > 5 - objectSize.z/2) event.object.position.z = 5 - objectSize.z/2;

        // 아래 그림자도 같이 움직임
        const allChildren = selectGroup.children;
        const objectRange = allChildren[allChildren.length - 1];
        objectRange.position.set(event.object.position.x, prePosition[1] + 0.001, event.object.position.z);

        prePosition[0] = event.object.position.x;
        prePosition[1] = event.object.position.y - 0.1;
        prePosition[2] = event.object.position.z;
    } );
}

// 새롭게 배치를 위해 선택된 오브젝트 = 벽
function assignObjectWall( url ) {
    selectRemove(); // 이전에 선택한 오브젝트 삭제

    // 카메라가 바라보고 있는 방향
    let lookCamera = new THREE.Vector3();
    camera.getWorldDirection(lookCamera);
    assignSetWall( lookCamera ); // 배치하기 전 설정해야 하는 내용

    // 사용자가 보고 있는 방향을 기준으로 오브젝트가 생성되도록
    prePosition[1] = camera.position.y + lookCamera.y * 2 + 2;

    const gltfloader = new GLTFLoader();
    const dragObject = [];
    
    gltfloader.load(
        url,
        ( gltf ) => {
            const root = gltf.scene;
            selectGroup.add(root);
            dragObject.push(root);

            // 오브젝트 배치할 때 벽에 위치 표시
            const boundingBox = new THREE.Box3().setFromObject( root ); // 모델의 바운딩 박스 생성
            objectSize = boundingBox.getSize(new THREE.Vector3()); // 바운딩 박스 사이즈 정보
            
            const rangeGeometry = new THREE.PlaneGeometry(objectSize.x, objectSize.y);
            const rangeMaterial = new THREE.MeshBasicMaterial({ color: "#858585" });
            const objectRange = new THREE.Mesh( rangeGeometry, rangeMaterial );

            // 최초 배치 위치가 벽을 벗어나는 경우 방 안으로 배치되도록
            if(prePosition[0] < -3.5 + objectSize.x/2) {
                prePosition[0] = -3.5 + objectSize.x/2;
            }
            if(prePosition[0] > 3.5 - objectSize.x/2) {
                prePosition[0] = 3.5 - objectSize.x/2;
            }
            if(prePosition[1] < -2 + objectSize.y/2) {
                prePosition[1] = -2 + objectSize.y/2;
            }
            if(prePosition[1] > 2 - objectSize.y/2) {
                prePosition[1] = 2 - objectSize.y/2;
            }
            if(prePosition[2] < -5 + objectSize.z/2) {
                prePosition[2] = -5 + objectSize.z/2;
            }
            if(prePosition[2] > 5 - objectSize.z/2) {
                prePosition[2] = 5 - objectSize.z/2;
            }
            
            selectGroup.add(objectRange);
            

            if(checkXY) { // x, y축 방향이 바뀌었을 때
                if(rotationX == 1) {
                    root.rotation.y = - Math.PI/2;
                    objectRange.rotation.y = - Math.PI/2
                    preRotation = (preRotation + 3) % 4;
                }
                else {
                    root.rotation.y = Math.PI/2;
                    objectRange.rotation.y = Math.PI/2
                    preRotation = (preRotation + 1) % 4;
                }
                prePosition[0] = rotationX * (3.5 - objectSize.z/2);
                prePosition[2] = camera.position.z + lookCamera.z * 2;
                root.position.set( prePosition[0] - rotationX * 0.1, prePosition[1], prePosition[2] ); //모델 위치 지정
                objectRange.position.set( prePosition[0] + rotationX * (objectSize.z/2 - 0.001), prePosition[1], prePosition[2] ); // 그림자 위치 지정
            }
            else {
                if(rotationZ == 1) {
                    root.rotation.y = Math.PI;
                    objectRange.rotation.x = Math.PI;
                    preRotation = (preRotation + 2) % 4;
                }
                prePosition[0] = camera.position.x + lookCamera.x * 2;
                prePosition[2] = rotationZ * (5 - objectSize.z/2);
                root.position.set( prePosition[0], prePosition[1], prePosition[2] - rotationZ * 0.1 ); //모델 위치 지정
                objectRange.position.set( prePosition[0], prePosition[1], prePosition[2] + rotationZ * (objectSize.z/2 - 0.001) ); // 그림자 위치 지정
            }
        }
    );
    
    scene.add(selectGroup);
    renderer.render(scene, camera);
    requestAnimationFrame(setupModel);
    
    assignDragWall( dragObject );
}
// 편집 모드에서 이동 선택된 오브젝트 = 벽
function moveObjectWall( moveObject ) {
    // 카메라가 바라보고 있는 방향
    let lookCamera = new THREE.Vector3();
    camera.getWorldDirection(lookCamera);
    assignSetWall( lookCamera );

    const dragObject = [];
    dragObject.push(moveObject);

    // 오브젝트 이동할 때 벽에 위치 표시
    const boundingBox = new THREE.Box3().setFromObject( moveObject ); // 모델의 바운딩 박스 생성
    objectSize = boundingBox.getSize(new THREE.Vector3()); // 바운딩 박스 사이즈 정보

    const rangeGeometry = new THREE.PlaneGeometry(objectSize.x, objectSize.y);
    const rangeMaterial = new THREE.MeshBasicMaterial({ color: "#858585" });
    const objectRange = new THREE.Mesh( rangeGeometry, rangeMaterial );

    selectGroup.add(objectRange);

    if(checkXY) { // x, y축 방향이 바뀌었을 때
        if(rotationX == 1) {
            objectRange.rotation.y = - Math.PI/2
        }
        else {
            objectRange.rotation.y = Math.PI/2
        }
        moveObject.position.set( prePosition[0] - rotationX * 0.1, prePosition[1], prePosition[2] ); //모델 위치 지정
        objectRange.position.set( prePosition[0] + rotationX * (objectSize.z/2 - 0.001), prePosition[1], prePosition[2] ); // 그림자 위치 지정
    }
    else {
        if(rotationZ == 1) {
            objectRange.rotation.x = Math.PI;
        }
        moveObject.position.set( prePosition[0], prePosition[1], prePosition[2] - rotationZ * 0.1 ); //모델 위치 지정
        objectRange.position.set( prePosition[0], prePosition[1], prePosition[2] + rotationZ * (objectSize.z/2 - 0.001) ); // 그림자 위치 지정
    }

    scene.add(selectGroup);
    renderer.render(scene, camera);

    assignDragWall( dragObject );

}
// 배치하기 전 설정해야 하는 내용 = 벽
function assignSetWall( lookCamera ) {
    rotationX = 1;
    rotationZ = 1;
    checkXY = false;

    if(lookCamera.x < 0) rotationX = -1;
    if(lookCamera.z < 0) rotationZ = -1;
    if(Math.abs(lookCamera.x) > Math.abs(lookCamera.y)) checkXY = true;
}
// 드래그 앤 드롭으로 오브젝트 옮기기 = 벽
function assignDragWall( dragObject ) {
    dragControls = new DragControls( dragObject, camera, divContainer);
    dragControls.transformGroup = true;

    dragControls.addEventListener( 'drag', function ( event ) {
        // x축이 벽 밖으로 나가지 않도록
        if(event.object.position.y < -2  + objectSize.y/2) event.object.position.y = -2 + objectSize.y/2;
        if(event.object.position.y > 2 - objectSize.y/2) event.object.position.y = 2 - objectSize.y/2;
        
        // 아래 그림자도 같이 움직임
        const allChildren = selectGroup.children;
        const objectRange = allChildren[allChildren.length - 1];

        // 카메라 방향에서 x, y축 방향이 바뀌었을 경우
        if(checkXY) { // z축이 벽 밖으로 나가지 않도록
            event.object.position.x = rotationX * (3.4 - objectSize.z/2); // x축 고정
            if(event.object.position.z < -5 + objectSize.x/2) event.object.position.z = -5 + objectSize.x/2;
            if(event.object.position.z > 5 - objectSize.x/2) event.object.position.z = 5 - objectSize.x/2;
            objectRange.position.set(event.object.position.x + rotationX * (objectSize.z/2 + 0.099), event.object.position.y, event.object.position.z);
        }
        else { // x축이 벽 밖으로 나가지 않도록
            event.object.position.z = rotationZ * (4.9 - objectSize.z/2); // z축 고정
            if(event.object.position.x < -3.5 + objectSize.x/2) event.object.position.x = -3.5 + objectSize.x/2;
            if(event.object.position.x > 3.5 - objectSize.x/2) event.object.position.x = 3.5 - objectSize.x/2;
            objectRange.position.set(event.object.position.x, event.object.position.y, event.object.position.z + rotationZ * (objectSize.z/2 + 0.099));
        }

        prePosition[1] = event.object.position.y;
        if(checkXY) {
            prePosition[0] = event.object.position.x;
            prePosition[2] = event.object.position.z;
        }
        else {
            prePosition[0] = event.object.position.x;
            prePosition[2] = event.object.position.z;
        }
    } );
}

// 새롭게 배치를 위해 선택된 오브젝트 = 천장
function assignObjectCeiling( url ) {
    selectRemove(); // 이전에 선택한 오브젝트 삭제

    // 카메라가 바라보고 있는 방향
    let lookCamera = new THREE.Vector3();
    camera.getWorldDirection(lookCamera);
    assignSetCeiling( lookCamera ); // 배치하기 전 설정해야 하는 내용


    // 사용자가 보고 있는 방향을 기준으로 오브젝트가 생성되도록
    prePosition[0] = camera.position.x + lookCamera.x * 4;
    prePosition[1] = -1.1;
    prePosition[2] = camera.position.z + lookCamera.z * 4;


    const gltfloader = new GLTFLoader();
    const dragObject = [];
    
    gltfloader.load(
        url,
        ( gltf ) => {
            const root = gltf.scene;
            selectGroup.add(root);
            dragObject.push(root);

            // 오브젝트 배치할 때 위에 위치 표시
            const boundingBox = new THREE.Box3().setFromObject( root ); // 모델의 바운딩 박스 생성
            objectSize = boundingBox.getSize(new THREE.Vector3()); // 바운딩 박스 사이즈 정보
            
            const rangeGeometry = new THREE.PlaneGeometry(objectSize.x, objectSize.z);
            const rangeMaterial = new THREE.MeshBasicMaterial({ color: "#858585" });
            const objectRange = new THREE.Mesh( rangeGeometry, rangeMaterial );

            // 최초 배치 위치가 벽을 벗어나는 경우 방 안으로 배치되도록
            if(prePosition[0] < -3.5 + objectSize.x/2) {
                prePosition[0] = -3.5 + objectSize.x/2;
            }
            if(prePosition[0] > 3.5 - objectSize.x/2) {
                prePosition[0] = 3.5 - objectSize.x/2;
            }
            if(prePosition[2] < -5 + objectSize.z/2) {
                prePosition[2] = -5 + objectSize.z/2;
            }
            if(prePosition[2] > 5 - objectSize.z/2) {
                prePosition[2] = 5 - objectSize.z/2;
            }
            root.position.set( prePosition[0], prePosition[1] + 0.1, prePosition[2] ); //모델 위치 지정

            selectGroup.add(objectRange);
            objectRange.position.set( prePosition[0], 1.999, prePosition[2] );
            objectRange.rotation.x = + Math.PI / 2;
        }
    );
    
    scene.add(selectGroup);
    renderer.render(scene, camera);
    requestAnimationFrame(setupModel);

    assignDragCeiling( dragObject );
}
// 편집 모드에서 이동 선택된 오브젝트 = 천장
function moveObjectCeiling( moveObject ) {
    // 카메라가 바라보고 있는 방향
    let lookCamera = new THREE.Vector3();
    camera.getWorldDirection(lookCamera);
    assignSetCeiling( lookCamera );

    const dragObject = [];
    dragObject.push(moveObject);

    // 오브젝트 이동할 때 위에 위치 표시
    const boundingBox = new THREE.Box3().setFromObject( moveObject ); // 모델의 바운딩 박스 생성
    objectSize = boundingBox.getSize(new THREE.Vector3()); // 바운딩 박스 사이즈 정보

    const rangeGeometry = new THREE.PlaneGeometry(objectSize.x, objectSize.z);
    const rangeMaterial = new THREE.MeshBasicMaterial({ color: "#858585" });
    const objectRange = new THREE.Mesh( rangeGeometry, rangeMaterial );

    selectGroup.add(objectRange);

    moveObject.position.set( prePosition[0], prePosition[1] + 0.1, prePosition[2] ); //모델 위치 지정

    selectGroup.add(objectRange);
    objectRange.position.set( prePosition[0], 1.999, prePosition[2] );
    objectRange.rotation.x = + Math.PI / 2;

    scene.add(selectGroup);
    renderer.render(scene, camera);

    assignDragCeiling( dragObject );

}
// 배치하기 전 설정해야 하는 내용 = 천장
function assignSetCeiling( lookCamera ) {
    rotationX = 1;
    rotationZ = 1;
    checkXZ = false;

    if(lookCamera.x < 0) rotationX = -1;
    if(lookCamera.z < 0) rotationZ = -1;
    if(Math.abs(lookCamera.x) > Math.abs(lookCamera.z)) checkXZ = true;
}
// 드래그 앤 드롭으로 오브젝트 옮기기 = 천장
function assignDragCeiling( dragObject ) {
    dragControls = new DragControls( dragObject, camera, divContainer);
    dragControls.transformGroup = true;

    let pastPositionY = -1.1;
    dragControls.addEventListener( 'drag', function ( event ) {
        // 카메라 방향에서 x, z축 방향이 바뀌었을 경우
        if(checkXZ) {
            event.object.position.x = prePosition[0] + rotationX * (pastPositionY - event.object.position.y); // x축(앞뒤 거리) 이동
        }
        else {
            // 위로는 못 움직이게 제한(바닥 오브젝트 기준) + 마우스 위아래 이동을 z축에 적용
            event.object.position.z = prePosition[2] + rotationZ * (pastPositionY - event.object.position.y); // z축(앞뒤 거리) 이동
        }
        pastPositionY = event.object.position.y;
        event.object.position.y = -1.0; // y축(높이) 고정

        // x축이 벽 밖으로 나가지 않도록
        if(event.object.position.x < -3.5 + objectSize.x/2) event.object.position.x = -3.5 + objectSize.x/2;
        if(event.object.position.x > 3.5 - objectSize.x/2) event.object.position.x = 3.5 - objectSize.x/2;

        // z축이 벽 밖으로 나가지 않도록
        if(event.object.position.z < -5 + objectSize.z/2) event.object.position.z = -5 + objectSize.z/2;
        if(event.object.position.z > 5 - objectSize.z/2) event.object.position.z = 5 - objectSize.z/2;

        // 아래 그림자도 같이 움직임
        const allChildren = selectGroup.children;
        const objectRange = allChildren[allChildren.length - 1];
        objectRange.position.set(event.object.position.x, 1.999, event.object.position.z);

        prePosition[0] = event.object.position.x;
        prePosition[1] = event.object.position.y - 0.1;
        prePosition[2] = event.object.position.z;
    } );
}

// 편집 모드에서 오브젝트 변경을 위한 모델 로드
const changeSelectGroup = new THREE.Group();;
function loadChangeObject (key, url) {
    changeSelectGroup.clear();
    const gltfloader = new GLTFLoader();

    gltfloader.load(
        url,
        ( gltf ) => {
            const root = gltf.scene;
            group.add(root);
            //objParentTransform.push( root );

            root.position.set( prePosition[0], prePosition[1], prePosition[2] ); //모델 위치
            root.rotation.y = preRotation * Math.PI / 2; // 모델 방향
            root.name = key; // 오브젝트 이름: 배치 id

            setObjectName( root, key );
        }
    );

    renderer.render(scene, camera);
}

function setupCamera() {
    camera = new THREE.PerspectiveCamera(75, 
        window.innerWidth / window.innerHeight, 0.1, 2000);
    
    camera.position.set(0, -1, 0);
    camera.lookAt(0, -1, 1);
    //생성된 camera 객체를 다른 메소드에서 사용할 수 있도록
    controls = new PointerLockControls(camera, divContainer);
    scene.add(controls.getObject());

    raycaster = new THREE.Raycaster();
    
    divContainer.addEventListener( 'click', function() {
        // 오브젝트 배치 중일 때는 pointer lock 안 됨
        if(addView[0].style.display == "block") {
            return;
        }
        if(moveObjectKey) {
            return;
        }


        // pointer lock
        controls.lock();

        // pointer lock 시 가운데 표시
        targetPointer[0].style.display = "block";

        objectEditButtons[0].style.opacity = "50%"; // 편집모드 삭제, 이동, 변경 버튼 비활성화

        // 이미 pointer lock인 상태에서 오브젝트를 선택해서 클릭
        if(controls.isLocked && INTERSECTED) {
            console.log("object(배치) id: " + INTERSECTED.name);
            controls.unlock(); // pointer lock 비활성화

            // 편집 모드가 비활성화 되어있는 동안 = 게시물 열람
            if(editIcon[0].style.left != "15vh") {

                objectPostView[0].classList.remove(objectPostView[0].classList.item(1)); // 이전에 추가된 object_id가 있다면 class 명에서 삭제
                objectPostView[0].classList.add(INTERSECTED.name); // object_id를 class 명으로 추가
                menuArea[0].style.display = "block"; // 메뉴 사용 환경 활성화
                objectPostView[0].style.display = "block"; // 게시물 열람 화면 활성화
                objectPostView[0].children[1].style.display = "block"; // iframe 활성화
                objectPostViewFrame[0].style.display = "block";
                // console.log(INTERSECTED.name);
                const id = INTERSECTED.name; // 클릭한 오브젝트의 db 아이디
                // // const id = 1 // 클릭한 오브젝트의 아이디
                getPost(object_info[id].data.post_id);

                unSelectObjectGroup( group, INTERSECTED.name); // 오브젝트 선택 해제
            }
            // 편집 모드가 활성화 되어있는 동안 = 오브젝트 편집 기능
            else {
                objectEditButtons[0].style.opacity = "100%"; // 편집모드 삭제, 이동, 변경 버튼 활성화
                objectEditButtons[0].classList.remove(objectEditButtons[0].classList.item(1)); // 이전에 추가된 object_id가 있다면 class 명에서 삭제
                objectEditButtons[0].classList.add(INTERSECTED.name); // object_id를 class 명으로 추가
            }
        }
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

function animate() {
    const time = performance.now();
    const delta = ( time - prevTime ) / 20000;
    cameraMovement(delta);
    
    prevTime = time;

    drawRay();

    render();
    requestAnimationFrame(animate);      
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
    camVec.y = 0; // 높이는 고정
    camVec.normalize();

    const dirZ = boolToInt(moveForward) - boolToInt(moveBackward);
    const dirX = boolToInt(moveLeft) - boolToInt(moveRight);
    
    let camVecLeft = new THREE.Vector3();
    camVecLeft.copy(camVec);
    camVec.multiplyScalar(dirZ); // 앞뒤
    
    let temp = camVecLeft.x;
    camVecLeft.x = camVecLeft.z;
    camVecLeft.z = -1 * temp;
    camVecLeft.multiplyScalar(dirX); // 좌우

    camVec.add(camVecLeft);
    camVec.normalize();

    // 벽 통과 막기
    // 이동하기 전에 카메라 위치가 벽 범위를 넘어가는 좌표에 해당되면 이동하지 않도록
    const checkX = camera.position.x + camVec.x * deltaTime * Constants.Camera.Speed;
    const checkZ = camera.position.z + camVec.z * deltaTime * Constants.Camera.Speed;
    if(checkX >= 3.5 || checkX <= -3.5) camVec.x = 0;
    if(checkZ >= 5.0 || checkZ <= -5.0) camVec.z = 0;

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

function render() {
    // pointer lock 종료시 가운데 표시 숨김
    if( !controls.isLocked ) {
        const targetPointer = document.getElementsByClassName("target-pointer"); // 중심 나타내는 + 모양
        targetPointer[0].style.display = "none";
        targetPointer[0].style.left = divContainer.clientWidth / 2 + "px";
        targetPointer[0].style.top = divContainer.clientHeight / 2 + "px";
    }
    // pointer lock 실행 시 오브젝트 선택 가능
    else {
        // 카메라가 바라보고 있는 방향
        let lookCamera = new THREE.Vector3();
        camera.getWorldDirection(lookCamera);
        
        // 오브젝트 선택을 위한 중심 좌표 위치
        clickPointer.x = 0;
        clickPointer.y = 0;

        //console.log(clickPointer);
        
        // 오브젝트 선택을 위한 부분
        clickRaycaster.setFromCamera(clickPointer, camera);

        const intersects = clickRaycaster.intersectObjects( scene.children );
        if( intersects[0].object.name != "room") { // 가리키는 오브젝트가 방이 아닌 경우
            if(INTERSECTED) {
                INTERSECTED.material.emissive.setHex( 0x000000 );
                unSelectObjectGroup( group, INTERSECTED.name);
            }
            INTERSECTED = intersects[0].object;
            selectObjectGroup( group, INTERSECTED.name);
        }
        else if(INTERSECTED) {
            INTERSECTED.material.emissive.setHex( 0x000000 );
            unSelectObjectGroup( group, INTERSECTED.name);
            INTERSECTED = null;
        }
    }
    renderer.render(scene, camera);
}
// 같은 그룹에 속한 object를 함께 표시
function selectObjectGroup( selectObjects, key ) {
    let allChildren = selectObjects.children;
    for(let i = 0; i < allChildren.length; i++) {
        if(allChildren[i].children.length > 0) {
            selectObjectGroup( allChildren[i], key );
        }
        else if(allChildren[i].name == key) {
            allChildren[i].material.emissive.set( 0xaaaaaa );
        }
    }
}
// 같은 그룹에 속한 object를 함께 리셋
function unSelectObjectGroup( selectObjects, key ) {
    let allChildren = selectObjects.children;
    for(let i = 0; i < allChildren.length; i++) {
        if(allChildren[i].children.length > 0) {
            unSelectObjectGroup( allChildren[i], key );
        }
        else if(allChildren[i].name == key) {
            allChildren[i].material.emissive.set( 0x000000 );
        }
    }
}

// 오브젝트 선택 + 게시물 열람
const targetPointer = document.getElementsByClassName("target-pointer"); // pointer lock 가운데 표시
const objectPostViewFrame = document.getElementsByClassName("object-post-view-frame");
const objectPostView = document.getElementsByClassName("object-post-view"); // 오브젝트 선택 시 보이는 게시물 열람 화면

// 배치하고 싶은 오브젝트 선택 시
const selectObject = document.getElementsByClassName("object-thumbnail"); // 오브젝트 썸네일
const menuBar = document.getElementsByClassName("menu-bar"); // 메뉴 버튼
const objectLeftRotaionButton = document.getElementsByClassName("bi-arrow-counterclockwise"); // 오브젝트 좌방향 회전 버튼
const objectRightRotaionButton = document.getElementsByClassName("bi-arrow-clockwise"); // 오브젝트 우방향 회전 버튼
const cancleButton = document.getElementsByClassName("select-cancle"); // 취소 버튼
const completeButton = document.getElementsByClassName("select-complete"); // 완료 버튼
const addIcon = document.getElementsByClassName("bi-box"); // 오브젝트 추가 버튼
const addView = document.getElementsByClassName("object-add"); // 오브젝트 추가 기능
const menuArea = document.getElementsByClassName("menu-area"); // 메뉴 사용 환경
const postWriteOrLink = document.getElementsByClassName("post-write-or-link"); // 게시물 작성 또는 연결 선택 페이지

let key; // 오브젝트 id
let prePosition = []; // 배치 위치
let preRotation = 0; // 배치 방향 - 0: 정면, 1: 좌측: 2: 뒤, 3: 우측

// 오브젝트 썸네일 클릭

function onloadCallback() {
    for(let i = 0; i < 4; i++) { // 한 페이지에 오브젝트 썸네일 4개
        // 오브젝트 추가하기 기능에서 썸네일 클릭
        selectObject[i].addEventListener( 'click', () => {
            if(!objectEditButtons[0].classList.item(1)) {
                key = selectObject[i].classList.item(1); // 오브젝트 아이디
                const url = objectTemplate[key]['model_path']; // 오브젝트 url
                console.log(objectTemplate[key]);
                if(objectTemplate[key]) {
                    if(objectTemplate[key]['placement_location'] == 'floor') assignObjectFloor( url ); // 바닥 배치
                    if(objectTemplate[key]['placement_location'] == 'wall') assignObjectWall( url ); // 벽 배치
                    if(objectTemplate[key]['placement_location'] == 'ceiling') assignObjectCeiling( url ); // 바닥 배치
                }
            }
        })

        // 편집 모드 기능의 오브젝트 변경에서 썸네일 클릭
        objectChangeThumnail[i].addEventListener( 'click', () => {
            key = objectChangeThumnail[i].classList.item(1); // object_template_id
            const url = objectTemplate[key]['model_path']; // 오브젝트 url
            group.remove(changeSelectObjects); // 원래 배치되어있던 오브젝트 삭제
            loadChangeObject (key, url);
        })
    }
}
// 오브젝트 배치 중에 오브젝트 좌방향 회전
objectLeftRotaionButton[0].addEventListener( 'click', () => {
    if(key) { // 선택된 오브젝트가 있을 때만 작동
        const allChildren = selectGroup.children;
        const selectObject = allChildren[allChildren.length - 2];
        const objectRange = allChildren[allChildren.length - 1];
       
        preRotation = (preRotation + 1) % 4;
        leftRotaion(selectObject, 'y');
        leftRotaion(objectRange, 'z');

        // 회전하면 x, z 길이 바뀜 - 벽 범위 벗어나는 거 막을 때 체크하려면 값 변경 필요
        const saveX = objectSize.x;
        objectSize.x = objectSize.z;
        objectSize.z = saveX;
    }
});
// 좌방향 회전
const leftRotaion = ( turnObject, line ) => {
    if(line == 'x') turnObject.rotation.x += Math.PI / 2;
    if(line == 'y') turnObject.rotation.y += Math.PI / 2;
    if(line == 'z') turnObject.rotation.z += Math.PI / 2;
}
// 오브젝트 배치 중에 우방향 회전
objectRightRotaionButton[0].addEventListener( 'click', () => {
    if(key) { // 선택된 오브젝트가 있을 때만 작동
        const allChildren = selectGroup.children;
        const selectObject = allChildren[allChildren.length - 2];
        const objectRange = allChildren[allChildren.length - 1];

        preRotation = (preRotation + 3) % 4;
        rightRotaion(selectObject, 'y');
        rightRotaion(objectRange, 'z');

        // 회전하면 x, z 길이 바뀜 - 벽 범위 벗어나는 거 막을 때 체크하려면 값 변경 필요
        const saveX = objectSize.x;
        objectSize.x = objectSize.z;
        objectSize.z = saveX;
    }
});
// 오브젝트 좌방향 회전
const rightRotaion = ( turnObject, line ) => {
    if(line == 'x') turnObject.rotation.x -= Math.PI / 2;
    if(line == 'y') turnObject.rotation.y -= Math.PI / 2;
    if(line == 'z') turnObject.rotation.z -= Math.PI / 2;
}
// 취소 버튼 => 오브젝트 추가하기 비활성화
cancleButton[0].addEventListener( 'click', () => {
    selectRemove();
    key = "";
    addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
    addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기
});
// 오브젝트 배치 중에 메뉴바 선택 => 오브젝트 추가하기 비활성화
menuBar[0].addEventListener( 'click', () => {
    if(key) { // 선택된 오브젝트가 있을 때만 작동
        selectRemove();
        key = "";
        addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
        addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기
    }
});
// 이전에 선택한 오브젝트 제거
const selectRemove = () => {
    selectGroup.clear();
}
// 완료 버튼 선택 => 오브젝트 배치 완료
completeButton[0].addEventListener( 'click', () => {
    if(!key) {
        alert("물건을 선택 후 배치해주세요.");
    }
    else {
        selectRemove();
        // 게시물 연결 페이지에서 보일 오브젝트 썸네일 이미지 경로 설정
        const postLinkImage = document.getElementsByClassName('post-link-image');
        postLinkImage[0].src = objectTemplate[key]['thumbnail_path'];

        addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기
        menuArea[0].style.display = "block"; // 메뉴 사용 환경 활성화
        postWriteOrLink[0].style.display = "block"; // 게시물 작성 또는 연결 선택 페이지 활성화

        // 게시물 연결 건너뛰기를 선택한 경우 = 게시물 연결 없이 오브젝트만 배치
        const postPassButton = document.getElementsByClassName('post-pass-button');
        postPassButton[0].onclick = ObjectAssignNullPost;
        
        // 게시물 작성이 완료된 경우도 추가 필요

        // 연결할 게시물 선택이 완료된 경우
        const postLinkCompleteButton = document.getElementsByClassName('post-link-complete-button');
        postLinkCompleteButton[0].onclick = objectAndPostLink;
        //key = "";
    }
});
const ObjectAssignNullPost = () => {
    //alert("오브젝트 배치 정보 db에 저장하기(console 확인)");
    console.log("오브젝트 id: " + key); // 오브젝트 id
    console.log("오브젝트 배치 위치: " + prePosition); // 위치 정보
    console.log("오브젝트 배치 방향: " + preRotation); // 방향 정보
    // 완료되면 object db에 해당 정보 저장하고 3d 공간 reload

    menuArea[0].style.display = "none"; // 메뉴 사용 환경 비활성화
    postWriteOrLink[0].style.display = "none"; // 게시물 작성 또는 연결 선택 페이지 비활성화
    addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
    
    sendObjectData(-1)
}
const objectAndPostLink = () => {
    let post_id;
    const postTextRadio = document.getElementsByClassName('post-text-radio');
    for(let i = 0; i < postTextRadio.length; i++) {
        if(postTextRadio[i].checked) {
            post_id = postTextRadio[i].value; // 연결할 게시물 id
        }
    }
    menuArea[0].style.display = "none"; // 메뉴 사용 환경 비활성화
    document.getElementsByClassName('post-link-view')[0].style.display = "none"; // 게시물 연결 페이지 비활성화
    addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화

    //alert("오브젝트 배치 정보 + 게시물 연결 정보 db에 저장하기(console 확인)");
    console.log("오브젝트 id: " + key); // 오브젝트 id
    console.log("오브젝트 배치 위치: " + prePosition); // 위치 정보
    console.log("오브젝트 배치 방향: " + preRotation); // 방향 정보
    console.log("연결할 게시물 id: " + post_id); // 게시물 id
    // 완료되면 object db에 해당 정보 저장하고 3d 공간 reload

    sendObjectData(post_id);
}

const sendObjectData = (post_id) => {
    const conn = new XMLHttpRequest();
    conn.open('POST', '/api/object/placeObject');
    conn.setRequestHeader('Content-Type', 'application/json');
    const payload = {
        model_path: objectTemplate[key].model_path,
        model_rotation: preRotation,
        model_position: prePosition,
        post_id: post_id,
        username: window.location.pathname.split('/')[2],
        template_id: objectTemplate[key].template_id
    }
    console.log(payload);
    conn.onload = () => {
        const objId = parseInt(conn.response);
        object_list.push(objId);
        getObject(objId);
    }

    conn.send(JSON.stringify(payload));
}

// 편집 모드
const editIcon = document.getElementsByClassName("bi-tools"); // 편집 모드 버튼
const editView = document.getElementsByClassName("edit-mode"); // 편집 모드 공간
const objectEditButtons = document.getElementsByClassName("object-edit-buttons"); // 편집모드에서의 삭제, 이동, 변경 버튼
const removeObjectButton = document.getElementsByClassName('object-delete'); // 편집 모드 - 오브젝트 삭제 버튼
const objectRemoveView = document.getElementsByClassName("remove-object"); // 편집 모드 - 오브젝트 삭제 확인 창
const objectDeleteCancle = document.getElementsByClassName("bi-x-object"); // 편집 모드 - 오브젝트 삭제 취소 버튼
const objectDeleteComplete = document.getElementsByClassName("object-thumbnail-check"); // 편집 모드 - 오브젝트 삭제 완료 버튼
const objectMoveButton = document.getElementsByClassName("bi-arrows-move"); // 편집 모드 - 오브젝트 이동 버튼
const objectMoveComplete = document.getElementsByClassName("object-move-complete"); // 편집 모드 - 오브젝트 이동 완료 버튼
const objectChangeButton = document.getElementsByClassName("bi-arrow-left-right"); // 편집 모드 - 오브젝트 변경 버튼
const objectChangeView = document.getElementsByClassName("object-change-view"); // 편집 모드 - 오브젝트 변경을 위한 오브젝트 리스트
const objectChangeleft = document.getElementsByClassName("change-list-left"); // 편집 모드 - 오브젝트 변경 리스트 이전 버튼
const objectChangeRight = document.getElementsByClassName("change-list-right"); // 편집 모드 - 오브젝트 변경 리스트 이전 버튼
const objectChangeThumnail = document.getElementsByClassName("object-change-thumbnail"); // 편집 모드 - 오브젝트 변경 리스트 썸네일
const objectChangeComplete = document.getElementsByClassName("change-complete"); // 편집 모드 - 오브젝트 변경 완료 버튼

// 오브젝트 삭제 버튼 선택 시
let removeObjectKey;
removeObjectButton[0].addEventListener('click', () => {
    if(objectEditButtons[0].classList.item(1)) {
        const removeObjectImage = document.getElementsByClassName("remove-object-image");
        
        removeObjectKey = objectEditButtons[0].classList.item(1);
        const removeObjectTemplateId = object_info[removeObjectKey]['data']['template_id'];

        let templateIndex = -1;
        for(let i = 0;i < objectTemplate.length;i++) {
            if(removeObjectTemplateId == objectTemplate[i].template_id) {
                templateIndex = i;
                break;
            }
        }
        console.log(object_list, object_info, objectTemplate);
        console.log(templateIndex);

        const removeObjectThumbnailUrl = objectTemplate[templateIndex]['thumbnail_path'];
        removeObjectImage[0].src = removeObjectThumbnailUrl;

        const removeObject = document.getElementsByClassName("remove-object");

        removeObject[0].style.display = "block";
        menuArea[0].style.display = "block";
    }
});
// 오브젝트 삭제 취소 버튼 선택 시
objectDeleteCancle[0].addEventListener('click', () => {
    unSelectObjectGroup( group, INTERSECTED.name ); //선택 해제
    INTERSECTED = null;
    objectEditButtons[0].classList.remove(objectEditButtons[0].classList.item(1)); // 이전에 추가한 object_id를 class 명에서 삭제

    alert("오브젝트 삭제가 취소되었습니다.");
    editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
    editView[0].style.display = "none"; // 편집 모드 화면 숨기기
    menuArea[0].style.display = "none"; // 메뉴 사용 환경(반투명 배경) 비활성화
    objectRemoveView[0].style.display = "none"; // 오브젝트 삭제 확인 창 비활성화
});
// 오브젝트 삭제 완료 버튼 선택 시
objectDeleteComplete[0].addEventListener('click', () => {
    const allChildren = group.children;
    for(let i = 0; i < allChildren.length; i++) {
        if(allChildren[i].name == removeObjectKey) {
            group.remove(allChildren[i]);
        }
    }

    unSelectObjectGroup( group, INTERSECTED.name); //선택 해제
    INTERSECTED = null;
    console.log("삭제할 object_id: "+ objectEditButtons[0].classList.item(1));
    objectDeletePost(objectEditButtons[0].classList.item(1));
    objectEditButtons[0].classList.remove(objectEditButtons[0].classList.item(1)); // 이전에 추가한 object_id를 class 명에서 삭제

    alert("오브젝트 삭제가 완료되었습니다.");
    editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
    editView[0].style.display = "none"; // 편집 모드 화면 숨기기
    menuArea[0].style.display = "none"; // 메뉴 사용 환경(반투명 배경) 비활성화
    objectRemoveView[0].style.display = "none"; // 오브젝트 삭제 확인 창 비활성화
});

// 오브젝트 이동 버튼 선택 시
let moveObjectKey;
let moveSelectObjects;
objectMoveButton[0].addEventListener('click', () => {
    if(objectEditButtons[0].classList.item(1)) { // 오브젝트가 선택된 경우
        objectMoveComplete[0].style.display = "block";
        moveObjectKey = objectEditButtons[0].classList.item(1); // 선택된 오브젝트의 object_id
        const moveObjectTemplateKey = objectAssign[moveObjectKey]['template_id']; // 배치된 오브젝트의 template_id
        prePosition = objectAssign[moveObjectKey]['model_position'];

        const allChildren = group.children;
        for(let i = 0; i < allChildren.length; i++) {
            if(allChildren[i].name == moveObjectKey) {
                moveSelectObjects = allChildren[i];
                if(objectTemplate[moveObjectTemplateKey]['placementLocation'] == 'floor') {
                    moveObjectFloor( moveSelectObjects );
                    break;
                }
                if(objectTemplate[moveObjectTemplateKey]['placementLocation'] == 'wall') {
                    moveObjectWall( moveSelectObjects );
                    break;
                }
                if(objectTemplate[moveObjectTemplateKey]['placementLocation'] == 'ceiling') {
                    moveObjectCeiling( moveSelectObjects );
                    break;
                }
            }
        }
    }
});
// 오브젝트 이동 완료 버튼 선택 시
objectMoveComplete[0].addEventListener('click', () => {
    if(moveObjectKey) {
        unSelectObjectGroup( moveSelectObjects, moveSelectObjects.name ); // 선택 해제
        INTERSECTED = null;
        objectEditButtons[0].classList.remove(objectEditButtons[0].classList.item(1)); // 이전에 추가한 object_id를 class 명에서 삭제

        selectRemove(); // 그림자 제거
        dragControls.enabled = false; // 드래그 비활성화
        objectMoveComplete[0].style.display = "none"; // 편집 모드 이동 완료 버튼 숨기기
        objectEditButtons[0].style.opacity = "50%"; // 편집모드 삭제, 이동, 변경 버튼 비활성화
        editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
        editView[0].style.display = "none"; // 편집 모드 화면 숨기기

        // 바닥, 벽, 천장이랑 거리 띄운 거 다시 원래대로
        moveSelectObjects.position.set(prePosition[0], prePosition[1], prePosition[2]);

        alert("오브젝트 이동이 완료되었습니다.");
        console.log("object_id: " + moveObjectKey);
        console.log("이동 좌표: " + prePosition);
        moveObjectKey = "";
    }
});
// 오브젝트 변경 버튼 선택 시
let changeObjectKey;
let changeSelectObjects;
let changeObjectTemplateKey;
objectChangeButton[0].addEventListener('click', () => {
    if(objectEditButtons[0].classList.item(1)) { // 오브젝트가 선택된 경우
        changeObjectKey = objectEditButtons[0].classList.item(1); // 선택된 오브젝트의 object_id
        changeObjectTemplateKey = objectAssign[changeObjectKey]['template_id']; // 배치된 오브젝트의 template_id
        prePosition = objectAssign[changeObjectKey]['model_position'];
        preRotation = objectAssign[changeObjectKey]['model_rotation'];

        objectEditButtons[0].style.display = "none"; // 오브젝트 삭제, 이동, 변경 버튼 숨기기
        thumbnailButton[0].style.display = "none"; // 썸네일 촬영 버튼 숨기기
        objectChangeView[0].style.display = "block"; // 오브젝트 변경을 위한 리스트
        objectChangeleft[0].style.opacity = "30%"; // 이전 버튼 비활성화
        if(Object.keys(objectTemplate).length <= maxObject) objectChangeRight[0].style.opacity = "30%"; // 다음 버튼 비활성화
        notLocationCnt = 0;
        objectChangeList(); // 리스트에 썸네일 이미지 불러오기

        const allChildren = group.children;
        for(let i = 0; i < allChildren.length; i++) {
            if(allChildren[i].name == changeObjectKey) {
                changeSelectObjects = allChildren[i];
            }
        }
    }
});
let page = 0; // 현재 페이지
const maxObject = 4; // 한 페이지에 최대로 배치될 수 있는 썸네일 수
let notLocationCnt = 0;
// 이전 버튼
objectChangeleft[0].addEventListener('click', () => {
    if(page > 0) {
        page -= maxObject;
        objectChangeList();
        if(page == 0) {
            objectChangeleft[0].style.opacity = "30%";  // 이전 버튼 비활성화
        }
        objectChangeRight[0].style.opacity = "100%"; // 다음 버튼 활성화
    }
});
// 다음 버튼
objectChangeRight[0].addEventListener('click', () => {
    if((page + maxObject) < Object.keys(objectTemplate).length) {
        page += maxObject;
        objectChangeList();
        objectChangeleft[0].style.opacity = "100%";  // 이전 버튼 활성화
        if((page + maxObject + notLocationCnt) > Object.keys(objectTemplate).length) {
            objectChangeRight[0].style.opacity = "30%"; // 다음 버튼 비활성화
        }
    }
});
// 오브젝트 리스트
const objectChangeList = () => {
    for(let i = 0; i < maxObject; i++) {
        const key = Object.keys(objectTemplate)[i + page + notLocationCnt];  // 오브젝트 id
        if(key) {
            // 배치되어있던 오브젝트랑 동일한 위치에 배치 가능한 오브젝트 목록만 불러오기
            if(objectTemplate[key]['placementLocation'] != objectTemplate[changeObjectTemplateKey]['placementLocation']) {
                i--;
                notLocationCnt++;
                continue;
            }
            objectChangeThumnail[i].classList.remove(objectChangeThumnail[i].classList.item(1)); // 이전에 추가된 object_template_id가 있다면 class 명에서 삭제
            objectChangeThumnail[i].classList.add(key); // object_template_id를 class 명으로 추가
            objectChangeThumnail[i].src = objectTemplate[key]['thumbnail_path'];
        }
        else {/* 더이상 오브젝트가 없는 경우 */
            objectChangeThumnail[i].src = blank;
        }
    }
}
// 오브젝트 변경 완료 버튼 선택 시
objectChangeComplete[0].addEventListener('click', () => {
    INTERSECTED = null;
    objectEditButtons[0].classList.remove(objectEditButtons[0].classList.item(1)); // 이전에 추가한 object_id를 class 명에서 삭제

    alert("오브젝트가 변경되었습니다.");
    console.log("변경 된 object_id: " + changeObjectKey);
    console.log("변경할 object_template_id: " + key);

    objectEditButtons[0].style.display = "block"; // 오브젝트 삭제, 이동, 변경 버튼 보이기
    thumbnailButton[0].style.display = "grid"; // 썸네일 촬영 버튼 보이기
    objectChangeView[0].style.display = "none"; // 오브젝트 변경을 위한 리스트 숨기기
    editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
    editView[0].style.display = "none"; // 편집 모드 화면 숨기기
});

// 블로그 썸네일 촬영
const thumbnailButton = document.getElementsByClassName('capture-button');
thumbnailButton[0].addEventListener('click', async () => {
    //thumbnail을 촬영하기 전엔 항상 rendering을 해주어야 함
    render();
    canvas.toBlob((blob) => {
        //saveBlob(blob, `screencapture-${ canvas.width }x${ canvas.height }.png`);

        let reader = new FileReader();
        reader.readAsDataURL(blob);
    
        reader.onload = () => {
            const thumbnailImageUrl = reader.result;
            const changeThumbnailImage = document.getElementsByClassName('change-thumbnail-image');
            changeThumbnailImage[0].src = thumbnailImageUrl;
        }
        //"../../images/test-thumnail.png"; // 썸네일 이미지 파일 경로
    
        // 편집모드 비활성화
        const editMode = document.getElementsByClassName('edit-mode');
        editMode[0].style.display = "none";
    
        // 썸네일 변경 확인 페이지 활성화
        const changeThumbnailCheck = document.getElementsByClassName('change-thumbnail');
        changeThumbnailCheck[0].style.display = "block";
        menuArea[0].style.display = "block";
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

// 모델 db에 저장
const XMLrequest = (function() {
    const xhr = new XMLHttpRequest();
    const method = "post";
    const targetURL = "http://localhost:8000/getPost";
    xhr.open(method, targetURL);
    xhr.setRequestHeader("Content-Type", "application/json");
    const res = XMLHttpRequest.response
    return res;
})

// 클릭시 게시글 가져오기
const getPost = (function(id) {
    objectPostView[0].children[1].src = `http://localhost/post/read?id=${id}`;
    // const xhr = new XMLHttpRequest();
    // const method = "get";
    // const targetURL = `http://localhost/post/read?id=${id}`;
    // xhr.open(method, targetURL)
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.onload = () =>{
    //     objectPostView[0].children[1].src = `http://localhost:8000/viewpost/${JSON.parse(xhr.response).post_id}`;
    // };
    // xhr.send();
});


// ---- Add by NamHyeok Kim

function getObjectInfo(objID){
    const xhr = new XMLHttpRequest();
    const method = "get"
    const targetURL = "/getObjectById/"
}

function initTemplates() {
    const conn = new XMLHttpRequest();
    conn.open('POST', '/api/object/getTemplate');
    conn.onload = () => {
        if(conn.status == 200) {
            objectTemplate = JSON.parse(conn.responseText);
        }
        onloadCallback();
    }
    conn.send();
}


function objectDeletePost(targetID) {
    console.log(targetID);
    const conn = new XMLHttpRequest();
    conn.open('POST', '/api/object/deleteObject');
    conn.setRequestHeader("Content-Type", "application/json");
    conn.onload = () => {
        if(conn.status == 200) {
            const idx = object_list.indexOf(targetID);
            object_scene[idx].parent.remove(object_scene[idx]);
            object_scene.splice(idx, 1);
            object_list.splice(idx, 1);
        }
    };
    conn.send(JSON.stringify({objectID: targetID}));
}
            
async function getObjectList() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/blog/')
}

