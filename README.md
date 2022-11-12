# 놀다가
### 경상국립대학교 컴퓨터과학과 2022년 소프트웨어 전시회 비빔밥 팀

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

### Docker 이미지 빌드
```shell
// Require superuser
sh docker-build.sh
```

<hr>

## Docker

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

