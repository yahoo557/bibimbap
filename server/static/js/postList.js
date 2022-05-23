function de_MakeList(num) {
    const conDiv = document.getElementById("container");
    
    for(let i = 1;i <= num;i++) {
        const tempDiv = document.createElement("div");
        tempDiv.setAttribute("class", "element");
        tempDiv.innerHTML = `        
            <img src="/static/img/noldaga_logo.png" width="140">
            <div class="postDetail">
                <h2>테스트</h2>
                <div>작성일 : 2022-</div>
                <div class="btnsContainer"><button id="editBtn">수정하기</button><button id="delBtn">삭제하기</button></div>
            </div>`;
        conDiv.appendChild(tempDiv);

        if(i !== num) {
            const hrTag = document.createElement("hr");
            conDiv.appendChild(hrTag);
        }
    }
}