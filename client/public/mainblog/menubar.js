// 메뉴 바 보이기/숨기기
const menuIcon = document.getElementsByClassName('bi-list');
const closeIcon = document.getElementsByClassName('bi-x');
const menuBar = document.getElementsByClassName("menu-bar");

/* 오브젝트 추가 */
const addIcon = document.getElementsByClassName("bi-box");
const addView = document.getElementsByClassName("object-add");

const listView = document.getElementsByClassName("object-list");
const thumnails = ['../../object_thumbnail/Old_Bicycle.png', '../../object_thumbnail/Plants_on_table.png', '../../object_thumbnail/Stand_light_png', '../../object_thumbnail/angle_clock.png',
                    '../../object_thumbnail/Books_Magazines.png', '../../object_thumbnail/mouse_doll.png'];

/* 편집 모드 */
const editIcon = document.getElementsByClassName("bi-tools");

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

// 오브젝트 추가
const objectAdd = () => {
    if(addIcon[0].style.left == "0vh") {
        addIcon[0].style.left = "15vh"; // 오브젝트 추가 버튼 활성화
        addView[0].style.display = "block"; // 오브젝트 추가 화면 보이기
        //objectList();
    }
    else {
        addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
        addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기
    }
}
// 오브젝트 리스트
const objectList = () => {
    const N = 3;
    for(let i = 0; i < N; i++) {
        addView.write("<img class='thumbnail' src='"+thumnails[i]+"'>");
    }
}

// 편집 모드
const editMode = () => {
    if(editIcon[0].style.left == "0vh")
        editIcon[0].style.left = "15vh"; // 편집 모드 버튼 활성화
    else
        editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
}

// 게시물 리스트
const postList = () => {
    if(listIcon[0].style.left == "0vh")
        listIcon[0].style.left = "15vh"; // 게시물 리스트 버튼 활성화
    else
        listIcon[0].style.left = "0vh"; // 게시물 리스트 버튼 비활성화
}