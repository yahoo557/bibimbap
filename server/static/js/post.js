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
    } else {
        console.log('canceled');
    }
}