# 놀다가

## 최초 설정법
<br>

DB 스키마 설정 (ON Postgresql Shell)
```sql
\i '{PROJECT_DIR}\\server\\sql\\initialize.sql'
```
JWT Secret 설정
 
 {PROJECT_DIR} / server / config / auth.config.js 파일 생성
    
```javascript
module.exports = {
    secret : //암호화 키로 사용할 문자열 작성
};
```

Postgresql Library 설정

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