// 메뉴 바 보이기/숨기기
const showMenu = () => {
    const menuIcon = document.getElementsByClassName('bi-list'); // 메뉴 아이콘 숨기기
    menuIcon[0].style.display = "none";

    const closeIcon = document.getElementsByClassName('bi-x-lg'); // 닫기 아이콘 보이기
    closeIcon[0].style.display = "block";

    const menuBar = document.getElementsByClassName("menu-bar"); // 메뉴 바 보이기
    menuBar[0].style.left = "0vw";
}
const closeMenu = () => {
    const menuIcon = document.getElementsByClassName('bi-list'); // 메뉴 아이콘 보이기
    menuIcon[0].style.display = "block";

    const closeIcon = document.getElementsByClassName('bi-x-lg'); // 닫기 아이콘 숨기기
    closeIcon[0].style.display = "none";

    const menuBar = document.getElementsByClassName("menu-bar"); // 메뉴 바 숨기기
    menuBar[0].style.left = "-8vw";
}