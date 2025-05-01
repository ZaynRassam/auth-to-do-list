import {client} from "./postgres.js"

async function changeTaskCompletedStatus(newCompletedStatus, task_id){
    try {
        const query = `UPDATE ${process.env.TASK_TABLE_NAME} SET completed = $1 WHERE task_id = $2 RETURNING *;`;
        const values = [newCompletedStatus, task_id];

        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error changing task completed status:', err.message);
        return err.message;
    }
}

export { changeTaskCompletedStatus }