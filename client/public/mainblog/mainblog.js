import * as THREE from '../three.js-master/build/three.module.js';
import { GLTFLoader } from '../three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from "../three.js-master/examples/jsm/controls/PointerLockControls.js";
import { DragControls } from "../three.js-master/examples/jsm/controls/DragControls.js";

// 배치 정보 => 배치 id : { 'objectId': 오브젝트id,  'objectPosition': 오브젝트 위치,  'objectRotaion': 오브젝트 방향,  'postId': 게시물id}
// 오브젝트 템플릿 파일 => 오브젝트 id : { 'objectUrl': 오브젝트 파일 경로, 'ablePosition': 배치 가능한 위치(0: 바닥, 1: 벽, 2: 천장)}
const objectTemplete = {'ob1': {'objectUrl': '../../object_files/Old_Bicycle.glb', 'ablePosition': 0}, 'ob2': {'objectUrl': '../../object_files/Plants_on_table.gltf', 'ablePosition': 0},
                    'ob3': {'objectUrl': '../../object_files/Stand_light.glb', 'ablePosition': 0}};
// 오브젝트 썸네일 파일 => 오브젝트 id : 오브젝트 썸네일 이미지 경로
const objectThumbnailUrl = {'ob1': '../../object_thumbnail/Old_Bicycle.png', 'ob2': '../../object_thumbnail/Plants_on_table.png', 'ob3': '../../object_thumbnail/Stand_light.png'};

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

    group.add(room);
    scene.add(group);
}

// 배치를 위해 선택된 오브젝트 = 바닥
function assignObjectFloor( url ) {
    selectRemove(); // 이전에 선택한 오브젝트 삭제
    let rotaionX = 1;
    let rotaionZ = 1;
    let checkXZ = false;

    // 카메라가 바라보고 있는 방향
    let lookCamera = new THREE.Vector3();
    camera.getWorldDirection(lookCamera);
    console.log(lookCamera);
    if(lookCamera.x < 0) rotaionX = -1;
    if(lookCamera.z < 0) rotaionZ = -1;
    if(Math.abs(lookCamera.x) > Math.abs(lookCamera.z)) checkXZ = true;


    // 사용자가 보고 있는 방향을 기준으로 오브젝트가 생성되도록
    prePosition[0] = camera.position.x + lookCamera.x * 2;
    prePosition[2] = camera.position.z + lookCamera.z * 4;


    const gltfloader = new GLTFLoader();
    const dragObject = [];
    let objectSize;
    
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
            root.position.set( prePosition[0], prePosition[1] + 0.3, prePosition[2] ); //모델 위치 지정

            selectGroup.add(objectRange);
            objectRange.position.set( prePosition[0], prePosition[1] + 0.001, prePosition[2] );
            objectRange.rotation.x = - Math.PI / 2;
        }
    );
    
    scene.add(selectGroup);
    renderer.render(scene, camera);
    requestAnimationFrame(setupModel);

    // 드래그 앤 드롭으로 오브젝트 옮기기
    const dragControls = new DragControls( dragObject, camera, divContainer);
    dragControls.transformGroup = true;

    dragControls.addEventListener( 'drag', function ( event ) {
        // 카메라 방향에서 x, z축 방향이 바뀌었을 경우
        if(checkXZ) {
            event.object.position.x = prePosition[0] - rotaionX * (prePosition[1] + 0.3 - event.object.position.y); // x축(앞뒤 거리) 이동
        }

        else {
            // 위로는 못 움직이게 제한(바닥 오브젝트 기준) + 마우스 위아래 이동을 z축에 적용
            event.object.position.z = prePosition[2] - rotaionZ * (prePosition[1] + 0.3 - event.object.position.y); // z축(앞뒤 거리) 이동
        }
        event.object.position.y = -1.7; // y축(높이) 고정

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
        prePosition[1] = event.object.position.y - 0.3;
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
let prePosition = [0, -2, -4]; // 배치 위치
let preRotation = 0; // 배치 방향 - 0: 정면, 1: 좌측: 2: 뒤, 3: 우측

// 오브젝트 썸네일 클릭
window.onload = () => {
    for(let i = 0; i < 4; i++) {
        selectObject[i].addEventListener( 'click', () => {
            key = selectObject[i].classList.item(1); // 오브젝트 아이디
            const url = objectTemplete[key]['objectUrl']; // 오브젝트 url
            if(objectTemplete[key]) {
                if(objectTemplete[key]['ablePosition'] == 0) assignObjectFloor( url );
            }
        })
    }
}
// 오브젝트 좌방향 회전
objectLeftRotaionButton[0].addEventListener( 'click', () => {
    if(key) { // 선택된 오브젝트가 있을 때만 작동
        const allChildren = selectGroup.children;
        const selectObject = allChildren[allChildren.length - 2];
        const objectRange = allChildren[allChildren.length - 1];

        preRotation = (preRotation + 1) % 4;
        selectObject.rotation.y += Math.PI / 2;
        objectRange.rotation.z += Math.PI / 2;
    }
});
// 오브젝트 우방향 회전
objectRightRotaionButton[0].addEventListener( 'click', () => {
    if(key) { // 선택된 오브젝트가 있을 때만 작동
        const allChildren = selectGroup.children;
        const selectObject = allChildren[allChildren.length - 2];
        const objectRange = allChildren[allChildren.length - 1];

        preRotation = (preRotation + 3) % 4;
        selectObject.rotation.y -= Math.PI / 2;
        objectRange.rotation.z -= Math.PI / 2;
    }
});
// 취소 버튼 => 오브젝트 추가하기 비활성화
cancleButton[0].addEventListener( 'click', () => {
    selectRemove();
    addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
    addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기
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
        postLinkImage[0].src = objectThumbnailUrl[key];

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
    let postId;
    const postTextRadio = document.getElementsByClassName('post-text-radio');
    for(let i = 0; i < postTextRadio.length; i++) {
        if(postTextRadio[i].checked) {
            postId = postTextRadio[i].value; // 연결할 게시물 id
        }
    }
    menuArea[0].style.display = "none"; // 메뉴 사용 환경 비활성화
    document.getElementsByClassName('post-link-view')[0].style.display = "none"; // 게시물 연결 페이지 비활성화
    addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화

    alert("오브젝트 배치 정보 + 게시물 연결 정보 db에 저장하기(console 확인)");
    console.log("오브젝트 id: " + key); // 오브젝트 id
    console.log("오브젝트 배치 위치: " + prePosition); // 위치 정보
    console.log("오브젝트 배치 방향: " + preRotation); // 방향 정보
    console.log("연결할 게시물 id: " + postId); // 게시물 id
    // 완료되면 object db에 해당 정보 저장하고 3d 공간 reload
}

// 썸네일 촬영하기 기능 구현
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
       const url = window.URL.createobjectTemplete(blob);
       a.href = url;
       a.download = fileName;
       a.click();
    };
}());

function render() {
    renderer.render(scene, camera);
}