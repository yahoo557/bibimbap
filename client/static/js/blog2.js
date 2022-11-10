const loginButton = document.querySelector('.login-button');
const logoutButton = document.querySelector('.logout-button');
const redirectURL = encodeURIComponent(window.location.pathname);

if(loginButton) {
    loginButton.addEventListener('click', (e) => {
        window.location.href = `/login?redirect=${redirectURL}`
    });
}

if(logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        console.log('test');
        window.location.href = `/logout?redirect=${redirectURL}`;
    }); 
}

const parseCookie2 = str =>
    str.split(';').map(v => v.split('=')).reduce((acc, v) => {
        acc[decodeURIComponent(v[0]?.trim())] = decodeURIComponent(v[1]?.trim());
        return acc;
    }, {});

const setLoginButtons = () => {
    const cookie = parseCookie2(document.cookie);
    const flag = cookie?.hasOwnProperty('accessToken') && cookie?.hasOwnProperty('user');
    if(!flag) {
        logoutButton.parentNode.removeChild(logoutButton);
        removeOwnerButton();
        return false;
    }
    loginButton.parentNode.removeChild(loginButton);
    const tokenPayload = cookie.accessToken.split('.')[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    const params = location.pathname.split('/');
    if(decodedPayload.username != params[params.length - 1]) {
        removeOwnerButton();
        return false;
    }
    return true;
}

function removeOwnerButton() {
    const placeButton = document.querySelector('.bi-box');
    const editButton = document.querySelector('.bi-tools');

    placeButton.parentNode.removeChild(placeButton);
    editButton.parentNode.removeChild(editButton);
}

const xhrPromise = (method, url, body) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        if(method.toUpperCase() == 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }

        xhr.onload = () => {
            if(xhr.status == 200)
                resolve(xhr.response);
            else
                reject();
        }
        xhr.send(body);
    })
}

function getBlogID() {
    const pathname = location.pathname.split('/');
    const reqArray = {
        username: pathname[2]
    };
    return xhrPromise("POST", "/api/blog/getBlogIDFromUsername", JSON.stringify(reqArray));
}

function getBlogData(blogID) {
    const reqArray = {
        'blog_id': blogID
    }
    return xhrPromise("POST", "/api/blog/getBlogData", JSON.stringify(reqArray));
}

window.onload = () => {
    const flag = setLoginButtons();
    getBlogID().then((result) => {
        result = JSON.parse(result);
        const blog_id = result.blog_id;
        const idSpan = document.getElementById("blog-id");
        idSpan.innerText = blog_id;
        getBlogData(blog_id).then((innerResult) => {
            innerResult = JSON.parse(innerResult);
            //console.log(innerResult);

            document.querySelector('title').innerText = `${innerResult.blogname} - 놀다가`;

            const divBlogName = document.getElementsByClassName('blog-name');
            const divBlogOwner = document.getElementsByClassName('blog-owner');
            divBlogName[0].innerText = innerResult.blogname;
            divBlogOwner[0].innerText = innerResult.nickname;

            xhrPromise('GET', `/api/post/getPostList/${blog_id}`, null).then(res => {
                res = JSON.parse(res);
                const frame = document.createElement('div');
                frame.setAttribute('class', 'post-list-frame');
                document.querySelector('.post-list').append(frame);
                res.forEach(data => {
                   addList(data, flag);
                });
            })
        });
    });
}

const genModifyBtns = () => {
    const doc = document.createElement('div')
    doc.setAttribute('class', 'post-modify-and-delete');

    const mod = document.createElement('div');
    mod.setAttribute('class', 'post-modify');
    mod.innerText = "수정하기";
    const del = document.createElement('div');
    del.setAttribute('class', 'post-delete');
    del.innerText = "삭제하기";

    doc.append(mod, del);

    return doc;
}

const addList = (data, flag) => {
    const date = new Date(data.timestamp);

    const frame = document.querySelector('.post-list-frame');
    const text = document.createElement('div');
    text.setAttribute('class', 'post-list-text');
    text.setAttribute('value', data.post_id);
    const title = document.createElement('div');
    title.setAttribute('class', 'post-list-title');
    title.innerText = data.title;
    const writeDate = document.createElement('div')
    writeDate.setAttribute('class', 'post-list-date');
    writeDate.innerText = `작성일 : ${dateFormating(date)}`;
    const hr = document.createElement('hr');
    hr.setAttribute('class', 'post-list-hr');

    text.appendChild(title);
    text.appendChild(writeDate);
    frame.appendChild(text);

    if(flag) {
        frame.appendChild(genModifyBtns());
    }
    frame.appendChild(hr);


    text.addEventListener('click', (e) => {
        const postID = text.getAttribute('value');
        frame.setAttribute('style', 'display: none');

        const iframeFrame = document.createElement('div');
        iframeFrame.setAttribute('class', 'post-read-frame');
        const iframeTag = document.createElement('iframe');
        iframeTag.setAttribute('class', 'iframe-read-post');
        iframeTag.setAttribute('src', `/post/read?id=${postID}`);
        iframeFrame.appendChild(iframeTag);

        document.querySelector('.post-list').appendChild(iframeFrame);
        const pageTitle = document.querySelector('.post-list-page-title')
        pageTitle.innerHTML = "게시물 리스트 - 게시물 읽기" +
            `<button class='prev-button'>목록으로</button>`;

        document.querySelector('.prev-button').addEventListener('click', e => {
           iframeFrame.parentNode.removeChild(iframeFrame);
           frame.removeAttribute('style');
           pageTitle.innerHTML = "게시물 리스트";
        });
    });
};

const dateFormating = (date) => {
    const dateString = date.toISOString().split('T');
    const ymd = dateString[0].replaceAll('-', '.');
    const hms = dateString[1].split('.')[0];

    return `${ymd} ${hms}`;
}