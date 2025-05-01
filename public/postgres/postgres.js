import { Client } from 'pg'

var conString = process.env.CONSTRING

var client = new Client(conString);
await client.connect();

async function queryAll(tablename) {
    try {
        const res = await client.query(`SELECT * FROM ${tablename};`);
        return res.rows;
    } catch (err) {
        console.log(err.message);
        return err.message
    }
}



export {queryAll, client }