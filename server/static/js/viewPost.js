var sizeStyle = Quill.import('attributors/style/size');
Quill.register(sizeStyle, true);

let qViewer = new Quill("#viewer", {
    theme: 'bubble',
    readOnly: true
})

function setData(str) {
    str = str.replace(/\r/gi, '\\r').replace(/\n/gi, '\\n').replace(/\t/gi, '\\t').replace(/\f/gi, '\\f');
    const obj = JSON.parse(str);
    const titleDiv = document.getElementById("title");
    const createdTimeDiv = document.getElementById("createdTime");
    titleDiv.innerText = obj.title;
    createdTimeDiv.innerText = obj.createdTime;
    qViewer.setContents(obj.contents);
}