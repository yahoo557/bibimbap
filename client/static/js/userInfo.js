const flags = [false, false, false, true, true, true];
const alertMsg = [
    "현재 비밀번호를 입력하세요.",
    "비밀번호를 확인하세요.",
    "비밀번호를 확인하세요.",
    "닉네임 중복체크를 해주세요.",
    "블로그 제목 중복체크를 해주세요.",
    "비밀번호 찾기 답변을 입력해주세요"
]

const original = [];

const inputTags = document.querySelectorAll("input");
const formButtons = document.querySelectorAll("button");
const alertTags = document.querySelectorAll(".alertMsg");

const pwRegex = /^[a-zA-z0-9]{8,16}$/;

const setAlertVisibility = (index, isVisible) => {
    alertTags[index].style.visibility = (isVisible) ? "visible" : "hidden";
}
const setAlertText = (index, text) => {
    alertTags[index].innerHTML = text;
}
const setAlertColor = (index, colorName) => {
    alertTags[index].style.color = colorName;
}

const ALERT_RED = "#FF6C6C";
const ALERT_GREEN = "forestgreen";

inputTags[1].addEventListener('input', (e) => {
    const i = 1;

    inputTags[2].dispatchEvent(new Event('input'));

    if(inputTags[i].value.length < 1) {
        setAlertVisibility(i, false);
        flags[i] = false;
    } else {
        setAlertVisibility(i, true);
        if(pwRegex.test(inputTags[i].value)) {
            setAlertColor(i, ALERT_GREEN);
            setAlertText(i, "사용 가능한 비밀번호 입니다.");
            flags[i] = true;
        } else {
            setAlertColor(i, ALERT_RED);
            setAlertText(i, "8~16자 영소/대문자 + 숫자의 조합으로 지정하세요.");
            flags[i] = false;
        }
    }
});

inputTags[2].addEventListener('input', (e) => {
    const i = 2;

    if(inputTags[i].value.length < 1){
        setAlertVisibility(i, false);
        flags[i] = false;
    } else {
        setAlertVisibility(i, true);
        if(inputTags[i].value == inputTags[1].value) {
            setAlertVisibility(i, true);
            setAlertText(i, "비밀번호 확인이 일치합니다.");
            setAlertColor(i, ALERT_GREEN);
            flags[i] = true;
        } else {
            setAlertVisibility(i, true);
            setAlertText(i, "비밀번호 확인이 일치하지 않습니다.");
            setAlertColor(i, ALERT_RED);
            flags[i] = false;
        }
    }
});

function applyPwChange() {
    flags[0] = (inputTags[0].value.length < 1) ? false : true;
    
    for(let i = 0;i < 4;i++) {
        if(!flags[i]){
            alert(alertMsg[i]);
            inputTags[i].focus();
            return false;
        }
    }

    if(!confirm("비밀번호를 변경하시겠습니까?")) return false;
    return true;
}

formButtons[1].addEventListener('click', (e) => {
    const i = 3;

    if(flags[i])
        return;

    if(inputTags[i].value.length < 1) {
        setAlertVisibility(i, true);
        setAlertText(i, "닉네임을 입력하세요");
        setAlertColor(i, ALERT_RED);

        inputTags[i].focus();
    } else {
        inputTags[i].setAttribute('readonly', true);

        const conn = new XMLHttpRequest();
        conn.open("POST", "/api/account/duplicateCheck/nickname");
        conn.setRequestHeader("Content-Type", "application/json");

        conn.onload = () => {
            const res = JSON.parse(conn.responseText);
            switch(res.code) {
                case -1:
                    break;
                case 1:
                    setAlertVisibility(i, true);
                    setAlertText(i, "이미 사용중인 닉네임입니다.");
                    setAlertColor(i, ALERT_RED);
                    inputTags[i].removeAttribute('readonly');
                    break;
                case 0:
                    setAlertVisibility(i, true);
                    setAlertText(i, "사용 가능한 닉네임입니다.");
                    setAlertColor(i, ALERT_GREEN);
                    inputTags[i].style.backgroundColor = "gray";
                    flags[i] = true;
                    break;
            }
        }

        const req = {nickname: inputTags[i].value};
        conn.send(JSON.stringify(req));
    }
});


formButtons[2].addEventListener('click', (e) => {
    const i = 4;

    if(flags[i])
        return;

    if(inputTags[i].value.length < 1) {
        setAlertVisibility(i, true);
        setAlertText(i, "블로그 제목을 입력하세요");
        setAlertColor(i, ALERT_RED);

        inputTags[i].focus();
    } else {
        inputTags[i].setAttribute('readonly', true);

        const conn = new XMLHttpRequest();
        conn.open("POST", "/api/account/duplicateCheck/blogname");
        conn.setRequestHeader("Content-Type", "application/json");

        conn.onload = () => {
            const res = JSON.parse(conn.responseText);
            switch(res.code) {
                case -1:
                    break;
                case 1:
                    setAlertVisibility(i, true);
                    setAlertText(i, "이미 사용중인 블로그 제목입니다.");
                    setAlertColor(i, ALERT_RED);
                    inputTags[i].removeAttribute('readonly');
                    break;
                case 0:
                    setAlertVisibility(i, true);
                    setAlertText(i, "사용 가능한 블로그 제목입니다.");
                    setAlertColor(i, ALERT_GREEN);
                    inputTags[i].style.backgroundColor = "gray";
                    flags[i] = true;
                    break;
            }
        }

        const req = {blogname: inputTags[i].value};
        conn.send(JSON.stringify(req));
    }
});

inputTags[3].addEventListener('input', (e) => {
    const i = 3;

    flags[i] = false;

    if(inputTags[i].value.length > 0) {
        setAlertVisibility(i, false);
    } 

    // if(inputTags[i].value == original[0]) {
    //     flags
    // }
});

inputTags[4].addEventListener('input', (e) => {
    const i = 4;

    flags[i] = false;

    if(inputTags[i].value.length > 0) {
        setAlertVisibility(i, false);
    } 
});

function applyInfoChange() {
    flags[5] = (inputTags[5].value.length < 1) ? false : true;

    for(let i = 3; i < 6;i++) {
        if(!flags[i]) {
            alert(alertMsg[i]);
            inputTags[i].focus();
            return false;
        }
    }

    if(!confirm('수정하시겠습니까?')) return false;
    return true;
}

window.onload = () => {
    const loginStatus = checkLoginStatus();

    if(!loginStatus.flag) {
        alert("로그인이 필요합니다");
        location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`;
    }

    xhrPromise('POST', '/api/account/getUserInfo', null).then(res => {
        inputTags[3].value = res.nickname;
        inputTags[4].value = res.blogname;
        inputTags[5].value = res.passworda;

        const passwordq = document.querySelectorAll('option');
        passwordq.forEach(item => {
            if(item.value == res.passwordq) {
                item.selected = true;
            }
        })


        original.push(inputTags[3].value);
        original.push(inputTags[4].value);
    }).catch(res => {
        showMessageRedirect(res);
    })
}