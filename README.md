![추가하기 - 오브젝트 선택](https://github.com/yahoo557/bibimbap/assets/76805879/5aedfc9d-3c70-4988-8f43-0ce1b63e0ac0)
# 놀다가
```
📆 2022.03 ~ 2022.06
🏫 2022 경상국립대학교 컴퓨터과학과 전공 소프트웨어설계PBL
👏🏻 2022 경상국립대학교 컴퓨터과학과 소프트웨어전시회 출품
```

---

## 🍚 비빔밥 팀
###### (이름 가나다순입니다) 
| 고수민 | 김남혁 | 이승백 | 조정미 |                                                                                                          
| :---: | :---: | :---: | :---: |
| <img width="160px" src="https://avatars.githubusercontent.com/u/72858039?v=4" /> | <img width="160px" src="https://avatars.githubusercontent.com/u/11703271?v=4" /> | <img width="160px" src="https://avatars.githubusercontent.com/u/77774331?v=4" /> | <img width="160px" src="https://avatars.githubusercontent.com/u/76805879?v=4" /> |
| [@wpslxm20](https://github.com/wpslxm20) | [@los56](https://github.com/los56) | [@yahoo557](https://github.com/yahoo557) | [@jung0115](https://github.com/jung0115) |
| 경상대학교<br/>컴퓨터과학과 20학번 | 경상대학교<br/>컴퓨터과학과 17학번 | 경상대학교<br/>컴퓨터과학과 17학번 | 경상대학교<br/>컴퓨터과학과 20학번 |

<hr>

## 공통

### JWT Secret 설정
 
 {PROJECT_DIR} / server / config / auth.config.js 파일 생성
    
```javascript
module.exports = {
    secret : //암호화 키로 사용할 문자열 작성
};
```

### Postgresql Library 설정

 {PROJECT_DIR} / server / config / db.config.js 파일 생성
```javascript
const { Pool, Client } = require('pg')
const Query = require('pg').Query
const client = new Client({
    user: //username,
    host: '127.0.0.1',
    database: 'noldaga',
    password: //password,
    port: //port
});
client.connect();

module.exports = client;
```

<hr>

## Docker

### Docker 이미지 빌드
```shell
// Require superuser
sh docker-build.sh
```

### Docker 이미지 Import & Run
```shell
// Require superuser

// Import & Create container & Run
sh run.sh

// Only import
docker load -i (db | server | client).tar

// Only run (Import)
docker-compose up -d

// Stop
docker-compose stop
```

### Let's Encrypt 활용
 - 호스트 /usr/src/cert 폴더 아래에 인증서 저장 필요
 - 인증서를 찾을 수 없으면 http로 동작

<hr>

## Without Docker

### 서버 구동
```shell
// Run Server & Client
npm run dev

// Run Server
npm run server

// Run Client
npm run client
```

### DB 스키마 설정 (ON Postgresql Shell)
- Docker 사용 시 실행할 필요 없음
```sql
\i '{PROJECT_DIR}\\server\\sql\\initialize.sql'
```

## TroubleShoot
 - 접속이 안됨 : 호스트 방화벽 확인

