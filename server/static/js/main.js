const listDiv = document.getElementById("blogList");

function de_MakeList(cnt) {
    for(let i = 0;i < cnt; i++) {
        const tempDom = document.createElement("div", {id: `blog${i}`});
        tempDom.innerHTML = `<img width="200" height="200">
        <div><span>테스트입니다</span> <span>테스터</span></div>`

        listDiv.appendChild(tempDom);
    }
}