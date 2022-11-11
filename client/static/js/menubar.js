// 메뉴 바 보이기/숨기기
const menuIcon = document.getElementsByClassName('bi-list');
const closeIcon = document.getElementsByClassName('bi-x');
const menuBar = document.getElementsByClassName("menu-bar");

// 메뉴 사용 환경
const menuArea = document.getElementsByClassName("menu-area");

// 오브젝트 선택 시 보이는 게시물 뷰
const objectPostViewFrame = document.getElementsByClassName("object-post-view-frame");
const objectPostView = document.getElementsByClassName("object-post-view");
const closePostButton = document.getElementsByClassName("close-post");

// 블로그명, 블로그 주인 닉네임, 블로그 주인 아이디 정보
const blogInfo = {'blogName': '블로그명', 'blogOwner': '블로거', 'ownerId': 'owner123'};
const blogNameText = document.getElementsByClassName("blog-name");
const blogOwnerText = document.getElementsByClassName("blog-owner");

// 방문자 id
const userId = 'owner123';

/* 오브젝트 추가 */
const addIcon = document.getElementsByClassName("bi-box");
const addView = document.getElementsByClassName("object-add");
const objectListView = document.getElementsByClassName("object-list");
const objectListShowButton = document.getElementsByClassName("list-show");
const ListCloseButton = document.getElementsByClassName("bi-caret-down-fill");
const ListOpenButton = document.getElementsByClassName("bi-caret-up-fill");
const objectLeftRotaion = document.getElementsByClassName("bi-arrow-counterclockwise");
const objectRightRotaion = document.getElementsByClassName("bi-arrow-clockwise");
const objectSelectCancle = document.getElementsByClassName("select-cancle");
const objectSelectComplete = document.getElementsByClassName("select-complete");

const pre = document.getElementsByClassName("bi-caret-left-fill");
const next = document.getElementsByClassName("bi-caret-right-fill");

const objectThumnail = document.getElementsByClassName("object-thumbnail");
// 오브젝트 id : {'thumbnail_path': 오브젝트 썸네일 파일 경로, 'placementLocation' : 배치 가능한 위치('floor': 바닥, wall: 벽, ceiling: 천장)}
// const objectTemplate = {'ob1': {'thumbnail_path': '../../object_thumbnail/Old_Bicycle.png', 'placementLocation': 'floor'}, 'ob2': {'thumbnail_path': '../../object_thumbnail/Plants_on_table.png', 'placementLocation': 'floor'},
//                     'ob3': {'thumbnail_path': '../../object_thumbnail/Evita_chandelier.png', 'placementLocation': 'ceiling'}, 'ob4': {'thumbnail_path': '../../object_thumbnail/angle_clock.png', 'placementLocation': 'wall'},
//                     'ob5': {'thumbnail_path': '../../object_thumbnail/Books_Magazines.png', 'placementLocation': 'floor'},'ob6':  {'thumbnail_path': '../../object_thumbnail/mouse_doll.png', 'placementLocation': 'floor'},
//                     'ob7': {'thumbnail_path': '../../object_thumbnail/air_jordan.png', 'placementLocation': 'floor'}};

let objectTemplate;
const blank = '../../object_thumbnail/blank.png';

// 게시물 작성 또는 연결
const postWriteOrLink = document.getElementsByClassName("post-write-or-link");
const postWriteView = document.getElementsByClassName("post-write-view");
const postLinkView = document.getElementsByClassName("post-link-view");
const linkPostListField = document.getElementsByClassName("link-post-list-view");

// 게시물 id : { 'postTitle' : 게시물 제목, 'postDate' : 게시물 작성일 }
// 날짜 데이터는 받아와서 string으로 바꿔서 저장하는 작업 필요
/* const postInfo = { 'po1' : {'postTitle' : '테스트를 해봅시다 1', 'postDate' : '2022.04.06 01:52'}, 'po2' : {'postTitle' : '테스트를 해봅시다 2', 'postDate' : '2022.04.06 14:52'},
                'po3' : {'postTitle' : '테스트를 해봅시다 3', 'postDate' : '2022.04.07 10:23'}, 'po4' : {'postTitle' : '테스트를 해봅시다 4', 'postDate' : '2022.04.08 03:23'},
                'po5' : {'postTitle' : '테스트를 해봅시다 5', 'postDate' : '2022.04.09 21:32'}}; */


/* 편집 모드 */
const editIcon = document.getElementsByClassName("bi-tools");
const editView = document.getElementsByClassName("edit-mode");
const objectEditButtons = document.getElementsByClassName("object-edit-buttons")
const objectMoveComplete = document.getElementsByClassName("object-move-complete");


// 썸네일 변경 확인창
const changeThumbnailView = document.getElementsByClassName("change-thumbnail");

/* 게시물 리스트 */
const listIcon = document.getElementsByClassName("bi-file-text");
const postListView = document.getElementsByClassName("post-list");
const postListField = document.getElementsByClassName("post-list-frame");

// 오브젝트 선택 시 보이는 게시물 뷰 닫기
const closePost = () => {
    menuArea[0].style.display = "none"; // 메뉴 사용 환경(반투명 배경) 비활성화
    //objectPostView[0].style.display = "none"; // 게시물 뷰 숨기기
    objectPostViewFrame[0].style.display = "none";
}

// 메뉴바 보이기
const showMenu = () => { 
    menuIcon[0].style.display = "none"; // 메뉴 아이콘 숨기기
    closeIcon[0].style.display = "block"; // 닫기 아이콘 보이기
    menuBar[0].style.left = "0vw"; // 메뉴 바 보이기

    addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
    editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
    listIcon[0].style.left = "0vh"; // 게시물 리스트 버튼 비활성화

    // blogNameText[0].innerHTML = blogInfo["blogName"];
    // blogOwnerText[0].innerHTML = blogInfo["blogOwner"];

    if(blogInfo["ownerId"] != userId) { // 자신의 블로그가 아니라 타인의 블로그인 경우
        addIcon[0].style.left = "-20vh"; // 추가하기 아이콘 숨기기
        editIcon[0].style.left = "-20vh"; // 편집모드 아이콘 숨기기
    }

    // 로그인 상태 -> 로그아웃 버튼 / 로그아웃 상태 -> 로그인 버튼
}

// 메뉴바 숨기기
const closeMenu = () => {
    menuIcon[0].style.display = "block"; // 메뉴 아이콘 보이기
    closeIcon[0].style.display = "none"; // 닫기 아이콘 숨기기
    menuBar[0].style.left = "-16vh"; // 메뉴 바 숨기기

    addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
    addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기

    editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
    editView[0].style.display = "none"; // 편집 모드 화면 숨기기

    listIcon[0].style.left = "0vh"; // 게시물 리스트 버튼 비활성화
    postListView[0].style.display = "none"; // 게시물 리스트 화면 비활성화
    menuArea[0].style.display = "none"; // 메뉴 사용 환경(반투명 배경) 비활성화
}

let page = 0; // 현재 페이지
const maxObject = 4; // 한 페이지에 최대로 배치될 수 있는 썸네일 수
// 오브젝트 추가
const objectAdd = () => {
    if(addIcon[0].style.left == "0vh") {
        // '오브젝트 편집' 또는 '게시물 리스트' 기능을 사용 중인 경우 해당 기능 종료 후 사용하라는 안내 문구
        if(editIcon[0].style.left != "0vh") {
            // 편집할 오브젝트를 선택하지 않은 경우 => 버튼 재클릭으로 기능 종료 가능
            if(objectEditButtons[0].style.opacity == 0.5) {
                alert("오브젝트 편집 기능 종료 후 다른 기능을 사용할 수 있습니다.\n(오브젝트 편집 버튼 재클릭 시 종료)")
            }
            // 편집할 오브젝트를 선택한 경우 = 편집 기능을 이용 중인 경우
            else {
                alert("오브젝트 편집 완료 후 다른 기능을 사용할 수 있습니다.");
            }
        }
        else if(listIcon[0].style.left != "0vh") {
            alert("게시물 리스트 기능 종료 후 다른 기능을 사용할 수 있습니다.\n(게시물 리스트 버튼 재클릭 시 종료)");
        }
        else {
            addIcon[0].style.left = "15vh"; // 오브젝트 추가 버튼 활성화
            addView[0].style.display = "block"; // 오브젝트 추가 화면 보이기
            openObjectList(); // 오브젝트 리스트 열기

            editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
            editView[0].style.display = "none"; // 편집 모드 화면 숨기기
            listIcon[0].style.left = "0vh"; // 게시물 리스트 버튼 비활성화
            postListView[0].style.display = "none"; // 게시물 리스트 화면 비활성화
            menuArea[0].style.display = "none"; // 메뉴 사용 환경(반투명 배경) 비활성화

            pre[0].style.opacity = "30%"; // 이전 버튼 비활성화
            page = 0; // 첫 페이지

            const conn = new XMLHttpRequest();
            conn.open("POST", "/api/object/getTemplate");
            conn.onload = () => {
                if(conn.status == 200){
                    objectTemplate = JSON.parse(conn.responseText);
                    if(Object.keys(objectTemplate).length <= maxObject) next[0].style.opacity = "30%"; // 다음 버튼 비활성화
                    objectList(); // 오브젝트 이미지 로드
                }
            }
            conn.send();
        }
    }
    // '오브젝트 추가' 버튼 활성화된 상태에서 클릭
    else {
        alert("기능 사용 완료 혹은 취소 버튼을 통해 종료할 수 있습니다.");
        //addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
        //addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기
    }
}
// 이전 버튼
const prePage = () => {
    if(page > 0) {
        page -= maxObject;
        objectList();
        if(page == 0) {
            pre[0].style.opacity = "30%";  // 이전 버튼 비활성화
        }
        next[0].style.opacity = "100%"; // 다음 버튼 활성화
    }
}
// 다음 버튼
const nextPage = () => {
    if((page + maxObject) < Object.keys(objectTemplate).length) {
        page += maxObject;
        objectList();
        pre[0].style.opacity = "100%";  // 이전 버튼 활성화
        if((page + maxObject) > Object.keys(objectTemplate).length) {
            next[0].style.opacity = "30%"; // 다음 버튼 비활성화
        }
    }
}
// 오브젝트 리스트
const objectList = () => {
    for(let i = 0; i < maxObject; i++) {
        const key = Object.keys(objectTemplate)[i + page];  // 오브젝트 id
        if(key) {
            objectThumnail[i].classList.remove(objectThumnail[i].classList.item(1)); // 이전에 추가된 object_template_id가 있다면 class 명에서 삭제
            objectThumnail[i].classList.add(key); // object_template_id를 class 명으로 추가
            objectThumnail[i].src = objectTemplate[key]['thumbnail_path'];
        }
        else {/* 더이상 오브젝트가 없는 경우 */
            objectThumnail[i].src = blank;
        }
    }
}
// 오브젝트 리스트 닫기
const closeObjectList = () => {
    ListCloseButton[0].style.display = "none"; // 리스트 닫기 버튼 비활성화
    ListOpenButton[0].style.display = "block"; // 리스트 열기 버튼 활성화

    objectListView[0].style.top = "100vh"; // 오브젝트 리스트 숨기기
    objectLeftRotaion[0].style.top = "65.5vh"; // 오브젝트 좌방향 회전 버튼 아래로 이동
    objectRightRotaion[0].style.top = "65.5vh"; // 오브젝트 우방향 회전 버튼 아래로 이동
    objectListShowButton[0].style.top = "65.5vh"; // 오브젝트 리스트 열기/닫기 버튼 아래로 이동
    objectSelectCancle[0].style.top = "67vh"; // 배치 취소 버튼 아래로 이동
    objectSelectComplete[0].style.top = "67vh"; // 배치 완료 버튼 아래로 이동
}
// 오브젝트 열기
const openObjectList = () => {
    ListCloseButton[0].style.display = "block"; // 리스트 닫기 버튼 활성화
    ListOpenButton[0].style.display = "none"; // 리스트 열기 버튼 비활성화

    objectListView[0].style.top = "70vh"; // 오브젝트 리스트 보이기
    objectLeftRotaion[0].style.top = "35.5vh"; // 오브젝트 좌방향 회전 버튼 위로 이동
    objectRightRotaion[0].style.top = "35.5vh"; // 오브젝트 우방향 회전 버튼 위로 이동
    objectListShowButton[0].style.top = "35.5vh"; // 오브젝트 리스트 열기/닫기 버튼 위로 이동
    objectSelectCancle[0].style.top = "37vh"; // 배치 취소 버튼 위로 이동
    objectSelectComplete[0].style.top = "37vh"; // 배치 완료 버튼 위로 이동
}
// 게시물 작성
const postWrite = () => {
    postWriteOrLink[0].style.display = "none"; // 게시물 작성 또는 연결 선택 페이지 비활성화
    postWriteView[0].style.display = "block"; // 게시물 작성 페이지 활성화

    const postWriteFrame = document.getElementsByClassName("post-write-frame");
    const iframeTag = document.createElement('iframe');
    iframeTag.setAttribute('src', '/post/write?attach=true');
    iframeTag.setAttribute('class', 'iframe-write-post');
    postWriteFrame[0].appendChild(iframeTag);
}



// 게시물 연결
const postLink = () => {
    postWriteOrLink[0].style.display = "none"; // 게시물 작성 또는 연결 선택 페이지 비활성화
    postLinkView[0].style.display = "block"; // 게시물 연결 페이지 활성화
    linkPostList(); // 연결할 게시물 리스트 가져오기
}

// 연결할 게시물 리스트 가져오기
const linkPostList = () => {
    const idSpan = document.getElementById("blog-id");
    const blogID = idSpan.innerText;
    xhrPromise('GET', `/api/post/getPostList/${blogID}`, null).then(postInfo => {
        const postListLen = Object.keys(postInfo).length; // 게시물 개수
        let checkRadio = "checked";
        for(let i = 0; i < postListLen; i++) {
            const postId = postInfo[i].post_id; // 게시물
            const postTextTitle = "<div class='post-text-title'>" + postInfo[i]['title'] + "</div>"; // 게시물 제목
            const postTextDate = "<div class='post-text-date'>" + "작성일 : " + dateFormating(postInfo[i]['timestamp']) + "</div>"; // 게시물 작성일자
            const postText = "<div class='post-text'>" + postTextTitle + postTextDate + "</div>"; // 게시물 제목 + 게시물 작성일자
            if(i != 0) checkRadio = ""; // 첫 번째 게시물에 radio checked를 하기 위해
            const postDiv = document.createElement('div'); // div 태그 생성
            postDiv.setAttribute('class', 'post-text-div'); // div 태그 class명 지정
            // radio 태그, label 태그 내용 작성
            const radioTag = "<input class='post-text-radio' type='radio' id='" + postId + "' name='postListRadio' value='" + postId + "' " + checkRadio + ">";
            let labelTag = "<label class='post-text-label'>" + radioTag + postText + "</label>";

            if(i != postListLen-1) { // 마지막 게시물이 아닌 경우
                const hrTag = "<hr class='post-text-hr'>"; // hr 태그
                labelTag += hrTag; // label 태그 뒤에 hr 태그 추가
            }

            postDiv.innerHTML = labelTag; // div 태그에 <label><radio></label> 추가
            linkPostListField[0].appendChild(postDiv); // 리스트에 div 태그 삽입
        }
    })
}

// 편집 모드
const editMode = () => {
    if(editIcon[0].style.left == "0vh") {
        // '오브젝트 추가' 또는 '게시물 리스트' 기능을 사용 중인 경우 해당 기능 종료 후 사용하라는 안내 문구
        if(addIcon[0].style.left != "0vh") {
            alert("오브젝트 추가 기능 완료 또는 취소 후 다른 기능을 사용할 수 있습니다.");
        }
        else if(listIcon[0].style.left != "0vh") {
            alert("게시물 리스트 기능 종료 후 다른 기능을 사용할 수 있습니다.\n(게시물 리스트 버튼 재클릭 시 종료)");
        }
        else {
            editIcon[0].style.left = "15vh"; // 편집 모드 버튼 활성화
            editView[0].style.display = "block"; // 편집 모드 화면 보이기
            objectEditButtons[0].style.opacity = "50%"; // 편집 모드 삭제, 이동, 변경 버튼 비활성화
            objectMoveComplete[0].style.display = "none"; // 편집 모드 이동 완료 버튼 숨기기

            addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
            addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기
            listIcon[0].style.left = "0vh"; // 게시물 리스트 버튼 비활성화
            postListView[0].style.display = "none"; // 게시물 리스트 화면 비활성화
            menuArea[0].style.display = "none"; // 메뉴 사용 환경(반투명 배경) 비활성화
        }
    }
    // 편집 모드가 활성화되어 있으나 편집할 오브젝트를 선택하지 않은 경우, 버튼 재클릭으로 기능 종료 가능
    else if(objectEditButtons[0].style.opacity == 0.5) {
        editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
        editView[0].style.display = "none"; // 편집 모드 화면 숨기기
    }
    // 편집할 오브젝트를 선택한 상태에서 종료하려고 할 경우
    else{
        alert("오브젝트 편집을 완료하지 않고 기능을 종료할 수 없습니다.");
    }
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
// 블로그 썸네일 변경 최종 확인
const thumbnailChangeComplete = () => {
    const conn = new XMLHttpRequest();
    conn.open('POST', '/api/image/thumbnail/uploadThumbnail');

    conn.onload = () => {
        if(conn.status == 200)
            alert("블로그 썸네일 변경이 완료되었습니다.");
        editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
        menuArea[0].style.display = "none"; // 메뉴 사용 환경(반투명 배경) 비활성화
        changeThumbnailView[0].style.display = "none"; // 썸네일 변경 이미지 확인 창 비활성화
    }
    const imageTag = document.querySelector('.change-thumbnail-image');
    
    const payload = new FormData();
    console.log(imageTag.src);
    payload.append('image', dataURLtoFile(imageTag.src, "image"));
    conn.send(payload);
}
// 블로그 썸네일 변경 취소
const thumbnailChangeCancle = () => {
    alert("블로그 썸네일 변경이 취소되었습니다.");
    editView[0].style.display = "block"; // 썸네일을 다시 촬영할 수 있도록 다시 편집 모드 활성화
    menuArea[0].style.display = "none"; // 메뉴 사용 환경(반투명 배경) 비활성화
    changeThumbnailView[0].style.display = "none"; // 썸네일 변경 이미지 확인 창 비활성화
}

// 게시물 리스트
const postList = () => {
    if(listIcon[0].style.left == "0vh") {
        // '오브젝트 추가' 또는 '오브젝트 편집' 기능을 사용 중인 경우 해당 기능 종료 후 사용하라는 안내 문구
        if(addIcon[0].style.left != "0vh") {
            alert("오브젝트 추가 기능 완료 또는 취소 후 다른 기능을 사용할 수 있습니다.");
        }
        else if(editIcon[0].style.left != "0vh") {
            // 편집할 오브젝트를 선택하지 않은 경우 => 버튼 재클릭으로 기능 종료 가능
            if(objectEditButtons[0].style.opacity == 0.5) {
                alert("오브젝트 편집 기능 종료 후 다른 기능을 사용할 수 있습니다.\n(오브젝트 편집 버튼 재클릭 시 종료)")
            }
            // 편집할 오브젝트를 선택한 경우 = 편집 기능을 이용 중인 경우
            else {
                alert("오브젝트 편집 완료 후 다른 기능을 사용할 수 있습니다.");
            }
        }
        else {
            listIcon[0].style.left = "15vh"; // 게시물 리스트 버튼 활성화
            postListView[0].style.display = "block"; // 게시물 리스트 화면 활성화
            menuArea[0].style.display = "block"; // 메뉴 사용 환경(반투명 배경) 활성화
            //postListLoad();

            addIcon[0].style.left = "0vh"; // 오브젝트 추가 버튼 비활성화
            addView[0].style.display = "none"; // 오브젝트 추가 화면 숨기기
            editIcon[0].style.left = "0vh"; // 편집 모드 버튼 비활성화
            editView[0].style.display = "none"; // 편집 모드 화면 숨기기
    
        }
    }
    // 버튼 재클릭 시 기능 종료
    else {
        listIcon[0].style.left = "0vh"; // 게시물 리스트 버튼 비활성화
        postListView[0].style.display = "none"; // 게시물 리스트 화면 비활성화
        menuArea[0].style.display = "none"; // 메뉴 사용 환경(반투명 배경) 비활성화
    }
}
// 게시물 리스트 나타나기
const postListLoad = () =>{
    const postListLen = Object.keys(postInfo).length; // 게시물 개수
    for(let i = 0; i < postListLen; i++) {
        const postId = Object.keys(postInfo)[i]; // 게시물
        const postTextTitle = "<div class='post-list-title'>" + postInfo[postId]['postTitle'] + "</div>"; // 게시물 제목
        const postTextDate = "<div class='post-list-date'>" + "작성일 : " + postInfo[postId]['postDate'] + "</div>"; // 게시물 작성일자

        const postText = document.createElement('div'); // div 태그 생성
        postText.setAttribute('class', 'post-list-text'); // div 태그 class명 지정
        postText.innerHTML = postTextTitle + postTextDate;

        postListField[0].appendChild(postText); // 리스트에 div 태그 삽입

        if(blogInfo["ownerId"] == userId) { // 타인의 블로그가 아니라 자신의 블로그인 경우
            const buttonSet = document.createElement('div');
            buttonSet.setAttribute('class', 'post-modify-and-delete'); // div 태그 class명 지정
            const modifyButton = "<div class='post-modify'>수정하기</div>";
            const deleteButton = "<div class='post-delete'>삭제하기</div>";
            buttonSet.innerHTML = modifyButton + deleteButton;
            postListField[0].appendChild(buttonSet);
        }

        if(i != postListLen-1) { // 마지막 게시물이 아닌 경우
            const hrTag = document.createElement('hr'); // hr 태그 생성
            hrTag.setAttribute('class', 'post-list-hr'); // hr 태그 class명 지정
            postListField[0].appendChild(hrTag); // 리스트에 hr 태그 삽입
        }
    }
}

