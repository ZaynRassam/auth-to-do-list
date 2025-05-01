import {client} from "./postgres.js"

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

async function changeUserRole(newRole, username){
    try {
        const query = `UPDATE ${process.env.USER_TABLE_NAME} SET role = $1 WHERE username = $2 RETURNING *;`;
        const values = [newRole, username];

        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error changing user role:', err.message);
        return err.message;
    }
}

export { changeUserRole, updateUserPassword, deleteUser}