import pool from '../Model/connectDB.js';

export async function editMessageByAdmin(req, res) {
    let conn;
    try {
        //http://localhost:3000/api/lobby/2?userId=4
        //router.patch('/lobby/message/messageId?userId=1', editMessageByAdmin);

        const { messageId } = req.params;  // (messageId from URL)
        const { userId } = req.query;      // (userId from query parameters)
        const { message } = req.body;      // (message from request body)
        
        console.log("Received message body:", req.body);
        // Get a connection from the pool
        conn = await pool.getConnection();

        const checkAdminQuery  = `
            SELECT Lobby.adminId 
            FROM Message 
            INNER JOIN Lobby ON Message.lobbyId = Lobby.lobbyId
            WHERE Message.messageId = ?
            
        `;
        const adminResult = await conn.query(checkAdminQuery, [messageId]);

        if (adminResult.length == 0) {
            return res.status(404).json({ message: 'Message or Lobby not found.' });
        }
        const { adminId } = adminResult[0];
         // Step 2: Check if the userId matches the adminId
         if (adminId != userId) {
            return res.status(403).json({ message: 'Access denied: Only the lobby admin can edit messages.' });
        }
        // Step 3: Update the message if the user is the admin
        const editMessageQuery = "UPDATE Message set message= ? where messageId = ? ";
        const result = await conn.query(editMessageQuery, [message, messageId]);

        if (result.affectedRows == 0) {
            return res.status(404).json({ message: 'Message not found or no changes made.' });
        }
        
        
        res.json("Message was changed successfully!");
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Server Error');
    } finally {
        if (conn) conn.release();
    }
}


export async function deleteMessage(req, res) {
    let conn;
    try {
        
        //router.patch('/lobby/message/messageId?userId=1');

        const { messageId } = req.params;  // (messageId from URL)
        const { userId } = req.query;      // (userId from query parameters)
          
        
        conn = await pool.getConnection();

        const checkAdminQuery  = `
            SELECT Lobby.adminId
            FROM Message
            INNER JOIN Lobby ON Message.lobbyId = Lobby.lobbyId
            WHERE Message.messageId = ?
            
        `;
        const adminResult = await conn.query(checkAdminQuery, [messageId]);

        // If no admin is found, or the message/lobby doesn't exist
        if (adminResult.length == 0) {
            return res.status(404).json({ message: 'Message or Lobby not found.' });
        }

        const { adminId } = adminResult[0];

        // Step 2: Check if the userId matches the adminId
        if (adminId != userId) {
            return res.status(403).json({ message: 'Access denied: Only the lobby admin can delete messages.' });
        }

        // Step 3: Proceed with message deletion
        const deleteMessageQuery = "DELETE FROM Message where messageId = ? ";
        const result = await conn.query( deleteMessageQuery, [messageId]);

        if (result.affectedRows == 0) {
            return res.status(404).json({ message: 'Message not found or no changes made.' });
        }
        
        res.json("Message was deleted successfully!");
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Server Error');
    } finally {
        if (conn) conn.release();
    }
}

