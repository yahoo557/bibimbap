function apply() {
    const payloadArray = {
        userName: document.getElementById("userID").value,
        password: document.getElementById("userPassword").value,
        passwordConfirm: document.getElementById("confirmPassword").value,
        nickName: document.getElementById("userNickname").value,
        passwordQ: document.getElementById("passwordQuestion").value,
        passwordA: document.getElementById("passwordAnswer").value,
        blogName: document.getElementById("blogName").value
    }

    console.log(JSON.stringify(payloadArray));
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/register");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = () => {
        if(xhr.readyState == XMLHttpRequest.DONE) {
            alert(xhr.responseText);
            if(xhr.status == 200) {
                window.location.href = "/login";
            }
        }
    }

    xhr.send(JSON.stringify(payloadArray));
}