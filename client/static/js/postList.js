// function de_MakeList(num) {
//     const conDiv = document.getElementById("container");
//
//     for(let i = 1;i <= num;i++) {
//         const tempDiv = document.createElement("div");
//         tempDiv.setAttribute("class", "element");
//         tempDiv.innerHTML = `
//             <img src="/static/img/noldaga_logo.png" width="140">
//             <div class="postDetail">
//                 <h2>테스트</h2>
//                 <div>작성일 : 2022-</div>
//                 <div class="btnsContainer"><button id="editBtn">수정하기</button><button id="delBtn">삭제하기</button></div>
//             </div>`;
//         conDiv.appendChild(tempDiv);
//
//         if(i !== num) {
//             const hrTag = document.createElement("hr");
//             conDiv.appendChild(hrTag);
//         }
//     }
// }

function setPostList(postObject) {
    const containerDiv = document.getElementById("container");
    postObject.forEach(element => {
        const tempDiv = document.createElement("div");
        tempDiv.setAttribute("class", "element");
        tempDiv.innerHTML = `        
            <div class="postDetail">
                <h2>${element.title}</h2>
                <div>작성일 : ${element.timestamp}</div>
                <div class="btnsContainer"><button id="editBtn">수정하기</button><button id="delBtn">삭제하기</button></div>
            </div>`;
        containerDiv.appendChild(tempDiv);
        const horizontalLine = document.createElement("hr");
        container.appendChild(horizontalLine);
    })
}

function getPostList(blogID, callback) {
    const conn = new XMLHttpRequest();
    conn.open("POST", "/postList");
    conn.setRequestHeader("Content-Type", "application/json");
    conn.onload = () => {
        if(conn.status == 200) {
            const postObject = JSON.parse(conn.response);
            callback(postObject);
        }
    }
    conn.send(JSON.stringify({"blog_id": blogID}));
}

function getBlogIDFromParameter() {
    const urlString = window.location.href;
    const urlObject = new URL(urlString);
    const urlParams = urlObject.searchParams;

    return urlParams.get("blog_id");
}

window.onload = () => {
    const blogID = getBlogIDFromParameter();
    getPostList(blogID, setPostList);
}