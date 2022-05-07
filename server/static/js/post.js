var sizeStyle = Quill.import('attributors/style/size');
Quill.register(sizeStyle, true);

let qEditor = new Quill('#editor', {
    modules: {
        toolbar: '#toolbar'
    },
    placeholder: '여기서 본문 작성을 시작하세요',
    theme: 'snow'
});

function applyPost() {
    let contentsArray = {};
    if(confirm('작성한 글을 등록하시겠습니까?')) {
        const currentDate = new Date(Date.now());
        contentsArray.title = document.getElementById("postTitle").value;
        contentsArray.createdTime = currentDate.toLocaleString('ja-JP');
        contentsArray.contents = qEditor.getContents();
        console.log(JSON.stringify(contentsArray));
        

        //quill에서 받아온 데이터를 HTTP POST로 서버에 넘기는 코드
        const xhr = new XMLHttpRequest();
        const method = "post";
        const url = "/post";
        xhr.open(method, url);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        const body = JSON.stringify(contentsArray)
        xhr.send(body);

    } else {
        console.log('canceled');
    }
}