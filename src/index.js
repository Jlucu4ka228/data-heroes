const fs = require('fs');
const pg = require('pg');

//Did this on local machine, so no yandex postgres server :)
const pg_config = {
    connectionString: "postgres://work:123@localhost/work",
    // ssl: {
    //     rejectUnauthorized: true,
    //     ca: fs
    //         .readFileSync("./root.crt")
    //         .toString(),

    // }
}

const conn = new pg.Client(pg_config);

conn.connect((err) => {
    if (err) throw err;
});

const start = async () => {

    conn.query(`
        CREATE TABLE IF NOT EXISTS lecam (
            ID SERIAL,
            name TEXT,
            data JSONB
        );
    `);

    let pages = (await (await fetch('https://rickandmortyapi.com/api/character')).json()).info.pages;

    for (let i = 0; i < pages; i ++) {
        let data_from_page = (await (await fetch(`https://rickandmortyapi.com/api/character?page=${i}`)).json()).results
        data_from_page.forEach(character => {
            conn.query(`INSERT INTO lecam (name, data) VALUES ($1::text, $2::jsonb)`, [character.name, character])
        });
    }  
    console.log("Done.")
}

start()