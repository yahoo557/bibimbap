let searchKeyword = "";
const listDiv = document.getElementById("blogList");

const myBlogButton = document.getElementById("myBlogBtn");

document.getElementById("searchKeyword").addEventListener("keypress", (e) => {
    if(e.key == "Enter") {
        e.preventDefault();

        search();
    }
})

myBlogButton.addEventListener('click', (e) => {
    window.location.href="/blog/my";
})

function setBlogList(obj) {
    for(let v of obj) {
        const tempDom = document.createElement("div");
        tempDom.setAttribute("class", "blogItem");
        tempDom.innerHTML = `<img width="200" height="200" src="/api/image/thumbnail/getThumbnail/${v.thums_path}">
        <div class='blogText'><span>${v.blogname}</span> <span class="smallText">${v.nickname}</span></div>`
        tempDom.querySelector("img").setAttribute('onclick', `goBlog(${v.user_id})`);
        tempDom.querySelector("img").setAttribute('class', `btns`);
        listDiv.appendChild(tempDom);
    }
}

function goBlog(id) {
    window.location.href = `/blog?user_id=${id}`;
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

    document.querySelectorAll('.tabs')[0].dispatchEvent(new Event('click'));
}

function addAnimationListener() {
    const searchButton = document.getElementById("searchButton");
    searchButton.addEventListener('animationend', openSearchInput);
}

function setSearchFunctions() {
    const tabList = document.querySelectorAll('.tabs');
    const contentsList = document.querySelectorAll('.searchContents');
    const searchIn = document.getElementById("searchKeyword");

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
            const targetDom = document.querySelector(targetSelector);
            targetDom.style.display = "flex";

            targetDom.innerHTML = "";

            const conn = new XMLHttpRequest();
            conn.open("POST", `/api/search/${x.getAttribute('name')}`);
            conn.setRequestHeader("Content-Type", "application/json");
            conn.onload = () => {
                const res = JSON.parse(conn.responseText);
                if(res.msg) {
                    alert(res.msg);
                    return;
                }
                console.log(res.rows);

                if(x.getAttribute('name') == 'post') {
                    for(let v of res.rows) {
                        const tempDom = document.createElement("div");
                        const tempHeaderDom = document.createElement("div");
                        tempHeaderDom.setAttribute('class', 'postHeader');
                        tempHeaderDom.innerHTML = `<h2>${v.title}</h2>
                        <span>${v.blogname}</span>`;
                        tempDom.appendChild(tempHeaderDom);

                        const bodyDiv = document.createElement("div");
                        bodyDiv.innerText = parsePlainText(v.body);
                        tempDom.appendChild(bodyDiv);
                        targetDom.appendChild(tempDom);
                    }
                } else {
                    for(let v of res.rows) {
                        const tempDom = document.createElement("div");
                        tempDom.setAttribute("class", "blogItem");
                        tempDom.innerHTML = `<img width="200" height="200">
                        <div class='blogText'><span>${v.blogname}</span> <span class="smallText">${v.nickname}</span></div>`

                        const imageTag = tempDom.querySelector("img");
                        imageTag.setAttribute('onclick', `goBlog(${v.blog_id})`);
                        imageTag.setAttribute('class', `btns`);
                        imageTag.setAttribute('src', `/api/image/thumbnail/getThumbnail/${v.thums_path}`);
                        targetDom.appendChild(tempDom);
                    }
                }
            }

            conn.send(JSON.stringify({searchText: searchIn.value}));
        })
    });
}

function getBlogList(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/blog/getBlogList");
    xhr.onload = () => {
        callback(JSON.parse(xhr.response));
    };
    xhr.send();
}

function setLoginButtons() {
    const cookie = parseCookie(document.cookie);
    const flag = cookie?.hasOwnProperty('accessToken') && cookie?.hasOwnProperty('user');
    if(!flag) {
        const target = document.getElementById("accMenu_logout");
        target.parentNode.removeChild(target);
        return;
    }
    const target = document.getElementById("accMenu_login")
    target.parentNode.removeChild(target);
    document.querySelector("#accMenu_logout .whiteText").innerHTML = `${cookie.user}님 반갑습니다.`;
}

window.onload = () => {
    addAnimationListener();
    setSearchFunctions();
    getBlogList(setBlogList);
    setLoginButtons();
}

const parseCookie = str =>
    str.split(';').map(v => v.split('=')).reduce((acc, v) => {
        acc[decodeURIComponent(v[0]?.trim())] = decodeURIComponent(v[1]?.trim());
        return acc;
    }, {});


function parsePlainText(obj) {
    let resultStr = "";
    for(let v of JSON.parse(obj).ops) {
        if(v.insert instanceof Object) continue;
        resultStr += v.insert;
    }

    return resultStr;
}