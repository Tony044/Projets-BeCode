//file LobbyController.js

//EVERYONE WILL HAVE THIS IMPORT IN EACH FILE YOU DO 
import pool from '../Model/connectDB.js';

//It will be your own code
export async function showMessages(req, res) {
    let conn;
    try {
        //http://localhost:3000/api/lobby/2?userId=4

        const  { lobbyId }  = req.params; //(2)
        const { userId } = req.query; //(4)
        
        // Get a connection from the pool
        conn = await pool.getConnection();

        const checkUserQuery = `
            SELECT COUNT(*) AS count
            FROM LobbyUsers 
            WHERE userId = ? AND lobbyId = ?
        `;
        const checkUserResult = await conn.query(checkUserQuery, [userId, lobbyId]);
         // If the user is not a member of the lobby, deny access
         if (checkUserResult[0].count == 0) {
            return res.status(403).json({ message: 'Access denied: You do not have access to this lobby.' });
        }  
        // Query to fetch all messages from the Message table for the specific lobby
        const printLobby = "SELECT name, message FROM Message inner join User on Message.userId =User.userId where lobbyId=? order by date asc";   

        const rows = await conn.query(printLobby, [lobbyId]); // Utiliser lobbyId dans la requête

        // Envoyer les messages récupérés comme réponse
        res.json(rows);
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Server Error'); // Envoyer une réponse d'erreur au client
    } finally {
        // Toujours libérer la connexion au pool
        if (conn) conn.release();
    }
}



export async function createLobby(req, res){
    let conn;
    try {
        // Extracting data from request body in a POST request
        const { lobbyname, userId } = req.body;
        
        // Get a connection from the pool
        conn = await pool.getConnection();

        const newLobby = `INSERT INTO Lobby (adminId, name)
                        VALUES (?, ?)`;

        const createdlobby = await conn.query(newLobby, [userId, lobbyname]);
      
        res.json("Lobby created successfully!");
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Something went wrong, try again!'); 
    } finally {
        if (conn) conn.release();
    }
}