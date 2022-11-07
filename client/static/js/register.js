// 아이디, 비밀번호, 비밀번호 확인, 닉네임, (질문 & 답변) 제목
const flags = [false, false, false, false, false, false];

const inputTags = document.querySelectorAll("#registerForm input");
const formButtons = document.querySelectorAll("#registerForm button");
const alertTags = document.querySelectorAll(".alertMsg");

const pwRegex = /^[a-zA-z0-9]{8,16}$/;

const setAlertVisibility = (index, isVisible) => {
    alertTags[index].style.visibility = (isVisible) ? "visible" : "hidden";
}
const setAlertText = (index, text) => {
    alertTags[index].innerHTML = text;
}
const setAlertColor = (index, colorname) => {
    alertTags[index].style.color = colorname;
}

const ALERT_RED = "#FF6C6C";
const ALERT_GREEN = "forestgreen";

formButtons[0].addEventListener('click', (e) => {
    const i = 0;

    if(flags[i])
        return;

    if(inputTags[i].value.length < 1) {
        setAlertVisibility(i, true);
        setAlertText(i, "아이디를 입력하세요");
        setAlertColor(i, ALERT_RED);

        inputTags[i].focus();
    } else {
        inputTags[i].setAttribute('readonly', true);

        const conn = new XMLHttpRequest();
        conn.open("POST", "/api/account/duplicateCheck/username");
        conn.setRequestHeader("Content-Type", "application/json");

        conn.onload = () => {
            const res = JSON.parse(conn.responseText);
            switch(res.code) {
                case -1:
                    break;
                case 1:
                    setAlertVisibility(i, true);
                    setAlertText(i, "이미 사용중인 아이디입니다.");
                    setAlertColor(i, ALERT_RED);
                    inputTags[i].removeAttribute('readonly');
                    break;
                case 0:
                    setAlertVisibility(i, true);
                    setAlertText(i, "사용 가능한 아이디입니다.");
                    setAlertColor(i, ALERT_GREEN);
                    inputTags[i].style.backgroundColor = "gray";
                    flags[i] = true;
                    break;
            }
        }

        const req = {username: inputTags[i].value};
        conn.send(JSON.stringify(req));
    }
});

inputTags[0].addEventListener('input', (e) => {
    const i = 0;

    if(inputTags[i].value.length > 0) {
        setAlertVisibility(i, false);
    } 
});


inputTags[1].addEventListener('input', (e) => {
    const i = 1;

    inputTags[2].dispatchEvent(new Event('input'));

    if(!pwRegex.test(inputTags[i].value) && inputTags[i].value.length > 0) {
        setAlertVisibility(i, true);
        setAlertText(i, "8~16자 영소/대문자 + 숫자의 조합으로 지정하세요.");
        setAlertColor(i, ALERT_RED);
        flags[i] = false;
    } else {
        if(inputTags[i].value.length > 0) {
            setAlertVisibility(i, true);
            setAlertText(i, "사용 가능한 비밀번호 입니다.");
            setAlertColor(i, ALERT_GREEN);
            flags[i] = true;
        } else {
            flags[i] = false;
            setAlertVisibility(i, false);
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

inputTags[3].addEventListener('input', (e) => {
    const i = 3;

    if(inputTags[i].value.length > 0) {
        setAlertVisibility(i, false);
    } 
});

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
        
        conn.send(JSON.stringify({nickname: inputTags[i].value}));
    }
});

inputTags[4].addEventListener('input', (e) => {
    const i = 4;

    if(inputTags[i].value.length > 0) {
        flags[i] = true;
    } else {
        flags[i] = false;
    }
});

inputTags[5].addEventListener('input', (e) => {
    const i = 5;

    if(inputTags[i].value.length > 0) {
        setAlertVisibility(i, false);
    } 
});

formButtons[2].addEventListener('click', (e) => {
    const i = 5;

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
        
        conn.send(JSON.stringify({blogname: inputTags[i].value}));
    }
});

function applyRegister() {
    const msgArr = [
        "아이디 중복확인을 해주세요.",
        "비밀번호를 확인해주세요.",
        "비밀번호를 확인해주세요.",
        "닉네임 중복체크를 해주세요.",
        "비밀번호 찾기 답변을 입력해주세요.",
        "블로그 제목 중복체크를 해주세요."
    ];

    for(let i = 0;i < flags.length;i++) {
        if(!flags[i]) {
            alert(msgArr[i]);
            return false;
        }
    }

    if(confirm("회원가입 하시겠습니까?")) {
        return true;
    }
    return false;
}