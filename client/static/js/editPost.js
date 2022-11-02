//----- ONLOAD

const xhrParam = new URL(location.href).searchParams;
if(!xhrParam.has('id')) {
    alert("잘못된 접근입니다.");
    location.href = "/";
}

const loginStatus = checkLoginStatus();

if(!loginStatus.flag) {
    alert("로그인이 필요합니다.");
    location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`;
}

const applyBtn = document.getElementById('applyBtn');
applyBtn.removeAttribute('onclick');
applyBtn.setAttribute('onclick', `applyPost({edit: true, id:${xhrParam.get('id')}})`);

xhrPromise('POST', `/api/post/getPostData/${xhrParam.get('id')}`, null).then(res => {
    const decodedToken = decodeToken(loginStatus.token);
    if(res.username !== decodedToken.username) {
         alert("권한이 없습니다.");
         location.href = `/post/read${location.pathname}`;
         return;
    }

    const titleInput = document.getElementById("postTitle");
    titleInput.setAttribute('value', res.title);
    qEditor.setContents(JSON.parse(res.body));
}).catch(res => {
    showMessageRedirect(res);
});