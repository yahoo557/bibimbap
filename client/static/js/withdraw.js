document.getElementById("applyBtn").addEventListener('click', (e) => {
    const inputTag = document.getElementById("password");

    if(inputTag.value.length < 1) {
        alert("비밀번호를 입력해주세요");
        inputTag.focus();
        return;
    }

    if(!confirm("탈퇴하시겠습니까?")) return;

    const conn = new XMLHttpRequest();
    conn.open("POST", "/api/account/withdraw");
    conn.setRequestHeader("Content-Type", "application/json");

    conn.onload = () => {
        const res = JSON.parse(conn.responseText);
        alert(res.msg);
        if(res.redirect) {
            window.location.href = res.redirect;
        }
    }
    
    const req = {password: inputTag.value};
    conn.send(JSON.stringify(req));
});