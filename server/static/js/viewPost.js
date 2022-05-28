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