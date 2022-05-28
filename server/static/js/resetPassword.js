const formElement = document.getElementById("container");
formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(formElement);
    const conn = new XMLHttpRequest();
    conn.open("POST", "/resetPassword");

    conn.onreadystatechange = () => {
        if(conn.readyState == XMLHttpRequest.DONE) {
            const obj = JSON.parse(conn.responseText);
            if(obj.hasOwnProperty("msg")) alert(obj.msg);
            if(obj.hasOwnProperty("redirect")) window.location.href = obj.redirect;
        }
    }
    
    //conn.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    conn.send(formData);
})