const sizeStyle = Quill.import('attributors/style/size');
const Font = Quill.import('formats/font');
Font.whitelist = ['Cafe24SsurroundAir', 'nanum-gothic'];

let sizeList = [];
const styleCode = document.createElement("style");
for(let i = 10;i <= 24;i++) {
    sizeList.push(`${i}px`);
    
    styleCode.innerHTML += `.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="${i}px"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="${i}px"]::before {
        content: "${i}px";
        font-size: "${i}px !important"
    }`
}

Quill.register(sizeStyle, true);
Quill.register(Font, true);

let qViewer = new Quill("#viewer", {
    theme: 'bubble',
    readOnly: true
});

initPost();

function initPost() {
    const urlParams = new URL(location.href).searchParams;
    if(!urlParams.has('id') || urlParams.get('id') < 0) {
        qViewer.setContents({"ops":[{"insert":"글이 없습니다.\n"}]});
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/post/getPostData/${urlParams.get('id')}`);
    xhr.onload = () => {
        if(xhr.status == 200) {
            setPostData(xhr.response);
        }
    }
    xhr.send();
}

function setPostData(e) {
    const data = JSON.parse(e);
    const titleDiv = document.getElementById("title");
    const ctDiv = document.getElementById("createdTime");

    titleDiv.innerText = data.title;
    ctDiv.innerText = data.timestamp;
    qViewer.setContents(JSON.parse(decodeURI(data.body)));
}