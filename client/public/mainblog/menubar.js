// 메뉴 바 보이기/숨기기
const menuIcon = document.getElementsByClassName('bi-list');
const closeIcon = document.getElementsByClassName('bi-x');
const menuBar = document.getElementsByClassName("menu-bar");

/* 오브젝트 추가 */
const addIcon = document.getElementsByClassName("bi-box");
const addView = document.getElementsByClassName("object-add");

const pre = document.getElementsByClassName("bi-caret-left-fill");
const next = document.getElementsByClassName("bi-caret-right-fill");

const listView = document.getElementsByClassName("object-list");
const objectThumnail = document.getElementsByClassName("object-thumbnail");
const thumnailsUrl = ['../../object_thumbnail/Old_Bicycle.png', '../../object_thumbnail/Plants_on_table.png', '../../object_thumbnail/Stand_light.png',
                    '../../object_thumbnail/angle_clock.png', '../../object_thumbnail/Books_Magazines.png', '../../object_thumbnail/mouse_doll.png',
                    '../../object_thumbnail/air_jordan.png'];
const blank = '../../object_thumbnail/blank.png';

/* 편집 모드 */
const editIcon = document.getElementsByClassName("bi-tools");
const editView = document.getElementsByClassName("edit-mode");

/* 게시물 리스트 */
const listIcon = document.getElementsByClassName("bi-file-text");

// 메뉴바 보이기
const showMenu = () => { 
    menuIcon[0].style.display = "none"; // 메뉴 아이콘 숨기기
    closeIcon[0].style.display = "block"; // 닫기 아이콘 보이기
    menuBar[0].style.left = "0vw"; // 메뉴 바 보이기
}
// 메뉴바 숨기기
const closeMenu = () => {
    menuIcon[0].style.display = "block"; // 메뉴 아이콘 보이기
    closeIcon[0].style.display = "none"; // 닫기 아이콘 숨기기
    menuBar[0].style.left = "-16vh"; // 메뉴 바 숨기기

    addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
    addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기

    editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화

    listIcon[0].style.left = "0vh"; // 게시물 리스트 버튼 비활성화
}

let page = 0; // 현재 페이지
const maxObject = 4; // 한 페이지에 최대로 배치될 수 있는 썸네일 수
// 오브젝트 추가
const objectAdd = () => {
    if(addIcon[0].style.left == "0vh") {
        addIcon[0].style.left = "15vh"; // 오브젝트 추가 버튼 활성화
        addView[0].style.display = "block"; // 오브젝트 추가 화면 보이기

        editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
        editView[0].style.display = "none"; // 편집 모드 화면 숨기기
        listIcon[0].style.left = "0vh"; // 게시물 리스트 버튼 비활성화

        pre[0].style.opacity = "30%"; // 이전 버튼 비활성화
        if(thumnailsUrl.length <= maxObject) next[0].style.opacity = "30%"; // 다음 버튼 비활성화
        page = 0; // 첫 페이지
        objectList(); // 오브젝트 이미지 로드
    }
    else {
        addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
        addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기
    }
}
// 이전 버튼
const prePage = () => {
    if(page > 0) {
        page -= maxObject;
        objectList();
        if(page == 0) {
            pre[0].style.opacity = "30%";  // 이전 버튼 비활성화
        }
        next[0].style.opacity = "100%"; // 다음 버튼 활성화
    }
}
// 다음 버튼
const nextPage = () => {
    if((page + maxObject) < thumnailsUrl.length) {
        page += maxObject;
        objectList();
        pre[0].style.opacity = "100%";  // 이전 버튼 활성화
        if((page + maxObject) > thumnailsUrl.length) {
            next[0].style.opacity = "30%"; // 다음 버튼 비활성화
        }
    }
}
// 오브젝트 리스트
const objectList = () => {
    for(let i = 0; i < maxObject; i++) {
        if(thumnailsUrl[i + page]) {
            objectThumnail[i].src = thumnailsUrl[i + page];
        }
        else {/* 더이상 오브젝트가 없는 경우 */
            objectThumnail[i].src = blank;
        }
    }
}

// 편집 모드
const editMode = () => {
    if(editIcon[0].style.left == "0vh") {
        editIcon[0].style.left = "15vh"; // 편집 모드 버튼 활성화
        editView[0].style.display = "block"; // 편집 모드 화면 보이기

        addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
        addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기
        listIcon[0].style.left = "0vh"; // 게시물 리스트 버튼 비활성화
    }
    else {
        editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
        editView[0].style.display = "none"; // 편집 모드 화면 숨기기
    }
}

// 게시물 리스트
const postList = () => {
    if(listIcon[0].style.left == "0vh") {
        listIcon[0].style.left = "15vh"; // 게시물 리스트 버튼 활성화

        addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
        addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기
        editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
        editView[0].style.display = "none"; // 편집 모드 화면 숨기기
    }
    else {
        listIcon[0].style.left = "0vh"; // 게시물 리스트 버튼 비활성화
    }
}