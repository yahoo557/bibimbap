const url = new URL(window.location.href);
const params = url.searchParams;
console.log(url);
const redirectURL = params.has('redirect') ? params.get('redirect') : '/';

if(redirectURL) {
    const loginForm = document.getElementById("loginForm");
    loginForm.setAttribute('action', `/api/account/login?redirect=${redirectURL}`);
}

const loginButton = document.getElementById("loginBtn");
const userIDInput = document.getElementById("userID");
const userPWInput = document.getElementById("userPassword");

loginButton.addEventListener('click', e =>{
    doLogin();
});

const keyboardEvent = (event) => {
    if(event.keyCode == 13)
        doLogin();
}

userIDInput.addEventListener('keydown', keyboardEvent);
userPWInput.addEventListener('keydown', keyboardEvent);

function doLogin() {
    const errorDiv = document.getElementById("errorMessage");

    if(userIDInput.value.length < 1) {
        errorDiv.innerText = "아이디를 입력해주세요";
        userIDInput.select();
        return;
    }

    if(userPWInput.value.length < 1) {
        errorDiv.innerText = "비밀번호를 입력해주세요";
        userPWInput.select();
        return;
    }

    const payload = {
        userID: userIDInput.value,
        userPassword: userPWInput.value
    }

    xhrPromise('POST', '/api/account/login', JSON.stringify(payload)).then(result => {
        console.log('!');
        location.href = redirectURL;
    }).catch(rea => {
        errorDiv.innerText = rea.msg;
        userIDInput.value = "";
        userPWInput.value = "";
        userIDInput.select();
    })
}