import pool from '../Model/connectDB.js';

export async function editMessage(req, res) {
    let conn;
    try {
        // router.patch('/lobby/:message-id', editMessage);
        const { message, messageId } = req.body;
        
        // Get connection from the pool
        conn = await pool.getConnection();

        const checkQuery = `SELECT count(*) FROM Message`;
        await conn.query(checkQuery);

        const editQuery = `UPDATE Message SET message = ? WHERE messageId = ?`;
        await conn.query(editQuery, [message, messageId]);

        // Send a message saying that the message has been modified
        res.send (`Votre message à bien été modifié.`);
    
    } catch (err) { 
        console.log('Error: ', err.message); // Afficher le message d'erreur
        res.status(500).json({error: err.message}); // Sent a message to the client
    } finally {
        if (conn) {
            console.log('Releasing connection...');
            conn.release();
        }
    }
}