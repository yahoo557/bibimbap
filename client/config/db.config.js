const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'noldaga_object',
    password: '5539',
    port: 5432,
});

client.connect();