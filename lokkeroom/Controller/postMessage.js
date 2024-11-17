import pool from '../Model/connectDB.js';

export async function postMessage(req, res) {
    let conn;
    try {
        const {lobbyId, userId, message} = req.body;

        // Get a connection from de pool
        conn = await pool.getConnection()


        //Query that will send the message to the message table by creating the messageId 
        // of the message and the creation date with the userId and the lobbyId
        
        const query = `INSERT INTO Message (lobbyId, userId, message) 
        VALUES (?, ?, ?)`;
        await conn.query(query, [lobbyId, userId, message]); //Replace the question marks in the request with these values

        // Send a message saying that the user has sent a message
        res.send('Vôtre message à bien été envoyé!');

    } catch(err) {
        console.log('Error: ', err.message); // Afficher le message d'erreur
        res.status(500).json({error: err.message}); // Sent a message to the client
    } finally {
        if (conn) {
            console.log('Releasing connection...')
            await conn.release();
            
        }
    }
}