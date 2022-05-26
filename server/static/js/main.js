let searchKeyword = "";
const listDiv = document.getElementById("blogList");

function setBlogList(obj) {
    for(let v of obj) {
        const tempDom = document.createElement("div");
        tempDom.setAttribute("class", "blogItem");
        tempDom.innerHTML = `<img width="200" height="200">
        <div><span>${v.blogname}</span> <span class="smallText">${v.nickname}</span></div>`
        tempDom.setAttribute('onclick', `goBlog(${v.blog_id})`);
        listDiv.appendChild(tempDom);
    }
}

function goBlog(id) {
    window.location.href = `/blog/${id}`;
}

function clickSearchButton() {
    const searchButton = document.getElementById("searchButton");
    searchButton.style.animation = "resize 1s";
}

function openSearchInput() {
    const searchInputDiv = document.getElementById("searchDiv");
    const searchButtonDiv = document.getElementById("searchButton");
    searchInputDiv.style.display = "flex";
    searchButtonDiv.style.display = "none";
}

function closeSearchInput() {
    const searchInputDiv = document.getElementById("searchDiv");
    const searchButtonDiv = document.getElementById("searchButton");
    
    searchInputDiv.style.display = "none";
    searchButtonDiv.style.display = "block";
    searchButtonDiv.style.animation = "none";

    const blogListDiv = document.getElementById("blogList");
    const searchResultDiv = document.getElementById("searchResult");

    blogListDiv.style.display = "flex";
    searchResultDiv.style.display = "none";
}

function search() {
    const blogListDiv = document.getElementById("blogList");
    const searchResultDiv = document.getElementById("searchResult");
    const keyword = document.getElementById("searchKeyword").value;

    searchKeyword = keyword;


    if(searchKeyword.length < 1) {
        alert("검색어를 입력해주세요!");
        return;
    }

    blogListDiv.style.display = "none";
    searchResultDiv.style.display = "block";

    const searchTitle = document.querySelector("#headLine");
    searchTitle.innerHTML = `${searchKeyword} 검색한 결과입니다`;
}

function addAnimationListener() {
    const searchButton = document.getElementById("searchButton");
    searchButton.addEventListener('animationend', openSearchInput);
}

window.onload = () => {
    addAnimationListener();

    const tabList = document.querySelectorAll('.tabs');
    const contentsList = document.querySelectorAll('.searchContents')

    tabList.forEach((x) => {
        x.addEventListener('click', (e) => {
            e.preventDefault();
            
            tabList.forEach((y) => {
                y.classList.remove('tabOn');
            })
            for(let y of contentsList) {
                y.style.display = "none";
            }

            x.classList.add('tabOn');
            const targetSelector = x.getAttribute("href");
            document.querySelector(targetSelector).style.display = "flex";
        })
    });
}
