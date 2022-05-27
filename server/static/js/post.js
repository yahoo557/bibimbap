const sizeStyle = Quill.import('attributors/style/size');

let sizeList = [];
const qlSize = document.querySelector("#toolbar>.ql-size");
const styleCode = document.createElement("style");
for(let i = 10;i <= 24;i++) {
    sizeList.push(`${i}px`);

    const tempOption = document.createElement("option");
    tempOption.setAttribute('value', `${i}px`);
    if(i == 13) tempOption.setAttribute('selected', true);
    qlSize.append(tempOption);
    
    styleCode.innerHTML += `.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="${i}px"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="${i}px"]::before {
        content: "${i}px";
        font-size: "${i}px !important"
    }`
}
document.querySelector("head").append(styleCode);
sizeStyle.whitelist = sizeList;

const Font = Quill.import('formats/font');
Font.whitelist = ['Cafe24SsurroundAir', 'nanum-gothic'];

Quill.register(Font, true);
Quill.register(sizeStyle, true);

const unloadListener = (e) =>{
    e.returnValue = '정말로 이동하시겠습니까?\n작성한 내용을 모두 잃게 됩니다.';
}

let qEditor = new Quill('#editor', {
    modules: {
        toolbar: {
            container: '#toolbar',
            handlers: {
                image: imageHandler
            }
        },
        imageResize: {}
    },
    placeholder: '여기서 본문 작성을 시작하세요',
    theme: 'snow'
});

window.onload = (e) => {
    const titleInput = document.getElementById("postTitle");
    titleInput.addEventListener('input', (e) => {
        titleInput.setCustomValidity('');
    });

    window.addEventListener('beforeunload', unloadListener);
}

// window.addEventListener('unload', (e) => {
//     const imgList = [];
//     const contents = qEditor.getContents().ops;
//     for (let i of contents){
//         if(i.insert.hasOwnProperty("image")) {
//             const imageId = i.insert.image.split("/")[3];
//             imgList.push(imageId);
//         }
//     }
    
//     for(let i in imgList) {
//         const conn = new XMLHttpRequest();
//         conn.open("post", `/image/delete/${i}`);
//         conn.send();
//     }
// });

function imageHandler() {
    const imageInput = document.createElement("input");
    imageInput.setAttribute('type', 'file');
    imageInput.setAttribute('accept', 'image/*');
    imageInput.click();

    const titleInput = document.getElementById("postTitle");
    titleInput.setAttribute('readonly', true);

    qEditor.disable();

    const conn = new XMLHttpRequest();
    conn.open('POST', '/image/upload');

    conn.onreadystatechange = () => {
        if(conn.readyState == XMLHttpRequest.DONE) {
            const res = JSON.parse(conn.responseText);
            switch(conn.status) {
                case 200:
                    qEditor.insertEmbed(qEditor.getSelection().index, 'image', `/image/raw/${res.id}`);
                    break;
                default:
                    alert(res.msg);
                    break;
            }
            qEditor.enable();
            titleInput.setAttribute('readonly', false);
        }
    }

    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        const payloadForm = new FormData();
        payloadForm.append('image', file);
        console.log(payloadForm.get('image'));
        conn.send(payloadForm);
    });
}

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
        window.removeEventListener('beforeunload', unloadListener);
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
                if(res.redirect) {
                    window.location.href = res.redirect;
                }
            }
        }
        xhr.send(body);
    }
}