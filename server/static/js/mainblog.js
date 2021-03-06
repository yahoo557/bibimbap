import * as THREE from '../three.js-master/build/three.module.js';
import { GLTFLoader } from '../three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from "../three.js-master/examples/jsm/controls/PointerLockControls.js";
import { DragControls } from "../three.js-master/examples/jsm/controls/DragControls.js";




// 배치 정보 => 배치 id : { 'object_id': 오브젝트id,  'model_position': 오브젝트 위치,  'objectRotaion': 오브젝트 방향,  'post_id': 게시물id}
// object.name에 배치id 적을 것
const objectAssign = {'as1': { 'object_id': 'ob1',  'model_position': [0, -2, 3],  'object_rotation': 0,  'post_id': 'po2' },
                    'as2': { 'object_id': 'ob4',  'model_position': [2, 1, 4.9],  'object_rotation': 2,  'post_id': null },
                    'as3': { 'object_id': 'ob2',  'model_position': [-2, -2, 3],  'object_rotation': 2,  'post_id': 'po1' }};

// 오브젝트 템플릿 파일 => 오브젝트 id : { 'model_path': 오브젝트 파일 경로, 'thumbnail_path': 오브젝트 썸네일 파일 경로, 'placementLocation' : 배치 가능한 위치('floor': 바닥, wall: 벽, ceiling: 천장)}
const objectTemplate = {'ob1': {'model_path': '../object_files/Old_Bicycle.glb', 'thumbnail_path': '../../object_thumbnail/Old_Bicycle.png', 'placementLocation': 'floor'},
                    'ob2': {'model_path': '../object_files/Plants_on_table.gltf', 'thumbnail_path': '../../object_thumbnail/Plants_on_table.png', 'placementLocation': 'floor'},
                    'ob3': {'model_path': '../object_files/Evita_chandelier.gltf', 'thumbnail_path': '../../object_thumbnail/Evita_chandelier.png', 'placementLocation': 'ceiling'},
                    'ob4': {'model_path': '../object_files/angle_clock.glb', 'thumbnail_path': '../../object_thumbnail/angle_clock.png', 'placementLocation': 'wall'}};
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

// 오브젝트 선택을 위한 부분
let clickRaycaster;
const clickPointer = new THREE.Vector2();
let INTERSECTED;

// 새로운 오브젝트 배치 & 드래그로 이동을 위한 변수들
let rotationX;
let rotationZ;
let checkXY;
let checkXZ;
let objectSize;

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


// renderer랑 camera는 창 크기가 바뀔 때마다 그 크기에 맞게 재정의 되어야 함
// resize이벤트에 resize메소드를 bind를 사용해서 지정 -> resize 안에서 this가 가리키는 객체가 이벤트객체가 아닌 이 앱 클래스의 객체가 되게 하기 위해
// window.onresize = this.resize.bind(this);
// resize이벤트와는 상관없이 한 번 실행 -> renderer나 camera의 속성을 창 크기에 맞게 설정

// 3차원 그래픽 장면을 만들어주는 메소드
// requestAnimationFrame(this.render.bind(this));

function setupModel() {
    //정육면체 형상을 정의
    //인자(가로, 세로, 깊이)
    const geometry = new THREE.BoxGeometry(7, 4, 10);
    
    const fillmaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.BackSide});
    const room = new THREE.Mesh(geometry, fillmaterial);
    objParentTransform.push(room);
    room.name = "room";

    group.add(room);
    setObjectInBlog();
    scene.add(group);

    clickRaycaster = new THREE.Raycaster();
}

// object DB에서 배치된 오브젝트 불러와서 배치
function setObjectInBlog() {
    const objectAssignLen = Object.keys(objectAssign).length; // 오브젝트 배치 개수
    const gltfloader = new GLTFLoader();

    for(let i = 0; i < objectAssignLen; i++) {
        const key = Object.keys(objectAssign)[i]; // 배치 아이디
        const objectKey = objectAssign[key]['object_id']; // 오브젝트 id
        const url = objectTemplate[objectKey]['model_path']; // 오브젝트 url
        const objectPosi = objectAssign[key]['model_position']; // 오브젝트 위치
        const objectRota = objectAssign[key]['object_rotation']; // 오브젝트 방향
        gltfloader.load(
            url,
            ( gltf ) => {
                const root = gltf.scene;
                group.add(root);
                objParentTransform.push( root );
    
                root.position.set( objectPosi[0], objectPosi[1], objectPosi[2] ); //모델 위치
                root.rotation.y = objectRota * Math.PI / 2; // 모델 방향
                root.name = key; // 오브젝트 이름: 배치 id

                setObjectName( root, key );
            }
        );
    }
}
// 오브젝트 name을 배치 id(=object DB key값)로 설정
function setObjectName( nameObjects, key ) {
    const allChildren = nameObjects.children;
    for(let i = 0; i < allChildren.length; i++) {
        allChildren[i].name = key;
        if(allChildren[i].children.length > 0) {
            setObjectName( allChildren[i], key );
        }
    }
}

// 새롭게 배치를 위해 선택된 오브젝트 = 바닥
function assignObjectFloor( url ) {
    selectRemove(); // 이전에 선택한 오브젝트 삭제
    rotationX = 1;
    rotationZ = 1;
    checkXZ = false;

    // 카메라가 바라보고 있는 방향
    let lookCamera = new THREE.Vector3();
    camera.getWorldDirection(lookCamera);
    //console.log(lookCamera);
    if(lookCamera.x < 0) rotationX = -1;
    if(lookCamera.z < 0) rotationZ = -1;
    if(Math.abs(lookCamera.x) > Math.abs(lookCamera.z)) checkXZ = true;


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
            objParentTransform.push( root );

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
// 드래그 앤 드롭으로 오브젝트 옮기기 = 바닥
function assignDragFloor( dragObject ) {
    const dragControls = new DragControls( dragObject, camera, divContainer);
    dragControls.transformGroup = true;

    dragControls.addEventListener( 'drag', function ( event ) {
        // 카메라 방향에서 x, z축 방향이 바뀌었을 경우
        if(checkXZ) {
            event.object.position.x = prePosition[0] - rotationX * (prePosition[1] + 0.1 - event.object.position.y); // x축(앞뒤 거리) 이동
        }
        else {
            // 위로는 못 움직이게 제한(바닥 오브젝트 기준) + 마우스 위아래 이동을 z축에 적용
            event.object.position.z = prePosition[2] - rotationZ * (prePosition[1] + 0.1 - event.object.position.y); // z축(앞뒤 거리) 이동
        }
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
    rotationX = 1;
    rotationZ = 1;
    checkXY = false;

    // 카메라가 바라보고 있는 방향
    let lookCamera = new THREE.Vector3();
    camera.getWorldDirection(lookCamera);
    //console.log(lookCamera);
    if(lookCamera.x < 0) rotationX = -1;
    if(lookCamera.z < 0) rotationZ = -1;
    if(Math.abs(lookCamera.x) > Math.abs(lookCamera.y)) checkXY = true;

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
            objParentTransform.push( root );

            // 오브젝트 배치할 때 아래에 위치 표시
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
// 드래그 앤 드롭으로 오브젝트 옮기기 = 벽
function assignDragWall( dragObject ) {
    const dragControls = new DragControls( dragObject, camera, divContainer);
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
    rotationX = 1;
    rotationZ = 1;
    checkXZ = false;

    // 카메라가 바라보고 있는 방향
    let lookCamera = new THREE.Vector3();
    camera.getWorldDirection(lookCamera);
    //console.log(lookCamera);
    if(lookCamera.x < 0) rotationX = -1;
    if(lookCamera.z < 0) rotationZ = -1;
    if(Math.abs(lookCamera.x) > Math.abs(lookCamera.z)) checkXZ = true;


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
            objParentTransform.push( root );

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
            objectRange.position.set( prePosition[0], 1.999, prePosition[2] );
            objectRange.rotation.x = + Math.PI / 2;
        }
    );
    
    scene.add(selectGroup);
    renderer.render(scene, camera);
    requestAnimationFrame(setupModel);

    assignDragCeiling( dragObject );
}
// 드래그 앤 드롭으로 오브젝트 옮기기 = 천장
function assignDragCeiling( dragObject ) {
    const dragControls = new DragControls( dragObject, camera, divContainer);
    dragControls.transformGroup = true;

    dragControls.addEventListener( 'drag', function ( event ) {
        // 카메라 방향에서 x, z축 방향이 바뀌었을 경우
        if(checkXZ) {
            event.object.position.x = prePosition[0] + rotationX * (prePosition[1] + 0.1 - event.object.position.y); // x축(앞뒤 거리) 이동
        }
        else {
            // 위로는 못 움직이게 제한(바닥 오브젝트 기준) + 마우스 위아래 이동을 z축에 적용
            event.object.position.z = prePosition[2] + rotationZ * (prePosition[1] + 0.1 - event.object.position.y); // z축(앞뒤 거리) 이동
        }
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

        // pointer lock
        controls.lock();

        // pointer lock 시 가운데 표시
        targetPointer[0].style.display = "block";

        // 이미 pointer lock인 상태에서 오브젝트를 선택해서 클릭
        if(controls.isLocked && INTERSECTED) {
            console.log("object(배치) id: " + INTERSECTED.name);
            controls.unlock(); // pointer lock 비활성화

            // 편집 모드가 비활성화 되어있는 동안 = 게시물 열람
            if(editIcon[0].style.left != "15vh") {
                console.log("post(게시물) id: " + objectAssign[INTERSECTED.name]['post_id']);
                objectPostView[0].classList.remove(objectPostView[0].classList.item(1)); // 이전에 추가된 object_id가 있다면 class 명에서 삭제
                objectPostView[0].classList.add(INTERSECTED.name); // object_id를 class 명으로 추가
                
                menuArea[0].style.display = "block"; // 메뉴 사용 환경 활성화
                objectPostView[0].style.display = "block"; // 게시물 열람 화면 활성화
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
const objectPostView = document.getElementsByClassName("object-post-view"); // 오브젝트 선택 시 보이는 게시물 열람 화면

// 편집 모드
const editIcon = document.getElementsByClassName("bi-tools"); // 편집 모드 버튼
const objectEditButtons = document.getElementsByClassName("object-edit-buttons"); // 편집모드에서의 삭제, 이동, 변경 버튼

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
window.onload = () => {
    for(let i = 0; i < 4; i++) { // 한 페이지에 오브젝트 썸네일 4개
        selectObject[i].addEventListener( 'click', () => {
            key = selectObject[i].classList.item(1); // 오브젝트 아이디
            const url = objectTemplate[key]['model_path']; // 오브젝트 url
            if(objectTemplate[key]) {
                if(objectTemplate[key]['placementLocation'] == 'floor') assignObjectFloor( url ); // 바닥 배치
                if(objectTemplate[key]['placementLocation'] == 'wall') assignObjectWall( url ); // 벽 배치
                if(objectTemplate[key]['placementLocation'] == 'ceiling') assignObjectCeiling( url ); // 바닥 배치
            }
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
        key = "";
    }
});
const ObjectAssignNullPost = () => {
    alert("오브젝트 배치 정보 db에 저장하기(console 확인)");
    console.log("오브젝트 id: " + key); // 오브젝트 id
    console.log("오브젝트 배치 위치: " + prePosition); // 위치 정보
    console.log("오브젝트 배치 방향: " + preRotation); // 방향 정보
    // 완료되면 object db에 해당 정보 저장하고 3d 공간 reload

    menuArea[0].style.display = "none"; // 메뉴 사용 환경 비활성화
    postWriteOrLink[0].style.display = "none"; // 게시물 작성 또는 연결 선택 페이지 비활성화
    addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
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

    alert("오브젝트 배치 정보 + 게시물 연결 정보 db에 저장하기(console 확인)");
    console.log("오브젝트 id: " + key); // 오브젝트 id
    console.log("오브젝트 배치 위치: " + prePosition); // 위치 정보
    console.log("오브젝트 배치 방향: " + preRotation); // 방향 정보
    console.log("연결할 게시물 id: " + post_id); // 게시물 id
    // 완료되면 object db에 해당 정보 저장하고 3d 공간 reload
}

const thumbnailButton = document.getElementsByClassName('capture-button');
thumbnailButton[0].addEventListener('click', () => {
    //thumbnail을 촬영하기 전엔 항상 rendering을 해주어야 함
    render();
    canvas.toBlob((blob) => {
        saveBlob(blob, `screencapture-${ canvas.width }x${ canvas.height }.png`);
    });

    const thumbnailImageUrl = "../../images/test-thumnail.png"; // 썸네일 이미지 파일 경로

    // 편집모드 비활성화
    const editMode = document.getElementsByClassName('edit-mode');
    editMode[0].style.display = "none";

    // 썸네일 변경 확인 페이지 활성화
    const changeThumbnailCheck = document.getElementsByClassName('change-thumbnail');
    changeThumbnailCheck[0].style.display = "block";
    menuArea[0].style.display = "block";

    // 변경된 이미지 보여주기
    const changeThumbnailImage = document.getElementsByClassName('change-thumbnail-image');
    changeThumbnailImage[0].src = thumbnailImageUrl;
});
const saveBlob = (function() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    return function saveData(blob, fileName) {
       const url = window.URL.createmodel_path(blob);
       a.href = url;
       a.download = fileName;
       a.click();
    };
}());