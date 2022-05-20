// import { render } from "./mainblog";

const divContainer = document.querySelector("#webgl-container");
// var canvas = document.querySelector("#canvas");

// divContainer.addEventListener('click', () => {
//     // drawScene();
//     canvas.toBlob((blob) => {

//       saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
//     });
// });
   

// const thumbnailFilming = () => {
//     render();
//     html2canvas(document.body).then(canvas => {
//         document.body.appendChild(canvas);
//         const link = document.createElement('a')
//         link.download = 'filename.jpg'
//         link.href = canvas.toDataURL()
//         document.body.appendChild(link)
//         link.click()
//     });
//     // divContainer.toBlob((blob) => {

//     //   saveBlob(blob, `screencapture-${divContainer.width}x${divContainer.height}.png`);
//     // });    
// }
// const saveBlob = (function() {
//     const a = document.createElement('a');
//     document.body.appendChild(a);
//     a.style.display = 'none';
//     return function saveData(blob, fileName) {
//         const url = window.URL.createObjectURL(blob);
//         a.href = url;
//         a.download = fileName;
//         a.click();
//     };
// }());
