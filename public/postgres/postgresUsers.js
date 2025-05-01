import {client} from "./postgres.js"

async function insertUser(username, passwordHash, role) {
    try {
        const query = `INSERT INTO ${process.env.USER_TABLE_NAME} (username, hashed_password, role) VALUES ($1, $2, $3) RETURNING *;`;
        const values = [username, passwordHash, role];

        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error inserting user:', err.message);
        return err.message;
    }
}

async function updateUserPassword(username, newPassword) {
    try {
        const query = `UPDATE ${process.env.USER_TABLE_NAME} SET hashed_password = $1 WHERE username = $2 RETURNING *;`;
        const values = [newPassword, username];

        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error updating user:', err.message);
        return err.message;
    }
}

async function deleteUser(username) {
    try {
        const query = `DELETE FROM ${process.env.USER_TABLE_NAME} WHERE username = $1 RETURNING *;`;
        const values = [username];
        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error updating user:', err.message);
        return err.message;
    }
}

async function changeUserRole(newRole, username){
    try {
        const query = `UPDATE ${process.env.USER_TABLE_NAME} SET role = $1 WHERE username = $2 RETURNING *;`;
        const values = [newRole, username];

        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error updating role:', err.message);
        return err.message;
    }
}

export {insertUser, changeUserRole, updateUserPassword, deleteUser}