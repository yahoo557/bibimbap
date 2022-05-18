// 메뉴 바 보이기/숨기기
const menuIcon = document.getElementsByClassName('bi-list');
const closeIcon = document.getElementsByClassName('bi-x');
const menuBar = document.getElementsByClassName("menu-bar");

// 메뉴바 열기
const showMenu = () => { 
    menuIcon[0].style.display = "none"; // 메뉴 아이콘 숨기기
    closeIcon[0].style.display = "block"; // 닫기 아이콘 보이기
    menuBar[0].style.left = "0vw"; // 메뉴 바 보이기
}
// 메뉴바 닫기
const closeMenu = () => {
    menuIcon[0].style.display = "block"; // 메뉴 아이콘 보이기
    closeIcon[0].style.display = "none"; // 닫기 아이콘 숨기기
    menuBar[0].style.left = "-16vh"; // 메뉴 바 숨기기
}

// 오브젝트 추가
const objectAdd = () => {
    const addIcon = document.getElementsByClassName("bi-box");
    if(addIcon[0].style.left == "0vh")
        addIcon[0].style.left = "15vh"; // 오브젝트 추가 버튼 활성화
    else
        addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
}

// 편집 모드
const editMode = () => {
    const editIcon = document.getElementsByClassName("bi-tools");
    if(editIcon[0].style.left == "0vh")
        editIcon[0].style.left = "15vh"; // 편집 모드 버튼 활성화
    else
        editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
}

// 게시물 리스트
const postList = () => {
    const listIcon = document.getElementsByClassName("bi-file-text");
    if(listIcon[0].style.left == "0vh")
        listIcon[0].style.left = "15vh"; // 게시물 리스트 버튼 활성화
    else
        listIcon[0].style.left = "0vh"; // 게시물 리스트 버튼 비활성화
}