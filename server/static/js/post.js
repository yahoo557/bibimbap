var sizeStyle = Quill.import('attributors/style/size');
Quill.register(sizeStyle, true);

window.onload = () => {
    const titleInput = document.getElementById("postTitle");
    titleInput.addEventListener('input', (e) => {
        titleInput.setCustomValidity('');
    });
}

let qEditor = new Quill('#editor', {
    modules: {
        toolbar: '#toolbar'
    },
    placeholder: '여기서 본문 작성을 시작하세요',
    theme: 'snow'
});

function applyPost(e) {
    let contentsArray = {};
    const confirmMsg = (e.edit) ? "수정하시겠습니까?" : "작성한 글을 등록하시겠습니까?";
    const targetURL = (e.edit) ? `/post/edit/${e.id}` : "/post";

    const titleInput = document.getElementById("postTitle");
    const errHelper = document.getElementById("errHelper");

    const title = titleInput.value.trim();

    if(title < 1) {
        titleInput.setCustomValidity("제목을 작성해주세요.");
        titleInput.reportValidity();
        return;
    }

    if(qEditor.getLength() < 2) {
        errHelper.setCustomValidity("본문을 작성해주세요.");
        errHelper.reportValidity();
        return;
    }

    if(confirm(confirmMsg)) {
        const currentDate = new Date(Date.now());
        contentsArray.title = title;
        //contentsArray.createdTime = currentDate.toLocaleString('ja-JP');
        contentsArray.contents = qEditor.getContents();

        //quill에서 받아온 데이터를 HTTP POST로 서버에 넘기는 코드
        const xhr = new XMLHttpRequest();
        const method = "post";
        xhr.open(method, targetURL);
        xhr.setRequestHeader("Content-Type", "application/json");
        const body = JSON.stringify(contentsArray)

        // Alert, Redirect 처리 리스너 
        xhr.onreadystatechange = () => {
            if(xhr.readyState == XMLHttpRequest.DONE) {
                const res = JSON.parse(xhr.responseText);
                alert(res.msg);
                if(res.redirect)
                    window.location.href = res.redirect;
            }
        }
        xhr.send(body);
    }
}