var sizeStyle = Quill.import('attributors/style/size');
Quill.register(sizeStyle, true);

let qViewer = new Quill("#viewer", {
    theme: 'bubble',
    readOnly: true
});