const client = require('./server/config/db.config.js');
const fs = require('fs');

const sql = "INSERT INTO object_template(model_path, thumbnail_path, placement_location) VALUES ($1, $2, 'floor')";

fs.readdir('./client/static/object_files', (err, objList) => {
    fs.readdir('./client/static/object_thumbnail', (err, thumbList) => {
        let i;
        for(i = 0;i < objList.length;i++) {
            const fileName = objList[i].split('.')[0];
            let thumbName;
            let flag = false;
            let j;
            for(j = 0;j < thumbList.length;j++) {
                thumbName = thumbList[j].split('.')[0];
                if(thumbName == fileName){
                    flag = true;
                    break;
                }
            }

            if(flag) {
                client.query(sql, [`/static/object_files/${objList[i]}`, `/static/object_thumbnail/${thumbList[j]}`], (err, rows) => {
                    if(err) console.log(err);
                });
            }
        }
        console.log(objList, thumbList);
        //client.query(sql)
    });
});