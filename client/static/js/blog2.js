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
        return;
    }
    loginButton.parentNode.removeChild(loginButton);

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

setLoginButtons();

window.onload = () => {
    getBlogID().then((result) => {
        result = JSON.parse(result);
        const blog_id = result.blog_id;
        const idSpan = document.getElementById("blog-id");
        idSpan.innerText = blog_id;
        getBlogData(blog_id).then((innerResult) => {
            innerResult = JSON.parse(innerResult);
            console.log(innerResult);

            document.querySelector('title').innerText = `${innerResult.blogname} - 놀다가`;

            const divBlogName = document.getElementsByClassName('blog-name');
            const divBlogOwner = document.getElementsByClassName('blog-owner');
            divBlogName[0].innerText = innerResult.blogname;
            divBlogOwner[0].innerText = innerResult.nickname;
        });
    });
}

