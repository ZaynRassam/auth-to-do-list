import { Client } from 'pg'

var conString = process.env.CONSTRING

var client = new Client(conString);
await client.connect();

async function queryAll(tableName) {
    try {
        const res = await client.query(`SELECT * FROM ${tableName};`);
        return res.rows;
    } catch (err) {
        console.log(err.message);
        return err.message
    }
}

async function insertRecord(tableName, dataObj) {
    try {
        const keys = Object.keys(dataObj);
        const values = Object.values(dataObj);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

        const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *;`;

        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error(`Error inserting into ${tableName}:`, err.message);
        return err.message;
    }
}

async function deleteRecord(tableName, dataObj) {
    try {
        const keys = Object.keys(dataObj);
        const values = Object.values(dataObj);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

        const query = `DELETE FROM ${tableName} WHERE (${keys.join(', ')}) = ${placeholders} RETURNING *;`;

        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error deleting user:', err.message);
        return err.message;
    }
}



export {queryAll, insertRecord, deleteRecord, client }