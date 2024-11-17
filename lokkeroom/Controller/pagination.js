import pool from '../Model/connectDB.js';

export async function pagination(req, res) {
    let conn;
    try {
        // router.get('/lobby/users', pagination');
        const { lobbyId } = req.params;
        // https://localhost:3000/api/lobby/1/messages?page=1&limit=10

        const { page=1, limit=10 } = req.query;

        // The next parameter tell how informations per page we have
        const offset = (page - 1) * limit

        // Get a connection from the pool
        conn = await pool.getConnection();
        

        // A query that select and joins the tables from the database
        const selectInfos = `SELECT Message.lobbyId, Message.message, Message.date FROM Message INNER JOIN User ON Message.userId=User.userId WHERE Message.lobbyId = ? LIMIT ? OFFSET ?`;
        await conn.query(selectInfos, [lobbyId, parseInt(limit), parseInt(offset)]);

        // Get total number of message per page
        const totalQuery = `SELECT COUNT(*) AS totalItems FROM Message WHERE lobbyId = ?`;
        const totalItems = await conn.query(totalQuery, [lobbyId]);

        // js method that telling me how many pages we have
        const totalPages = Math.ceil(totalItems/limit);

        // Send a message with a json format with the informations overs every user

        res.json({
            data: selectInfos,
            meta: {
                currentPage: parseInt(page),
                totalPages,
                totalItems,
                perPage: limit,
            }
        });

    } catch (err) {
        console.log('Error: ', err.message); // A message saying that I have a error
        res.status(500).json({error: err.message}); // Send a message to the client
    } finally {
        if (conn) {
            console.log('Releasing message...');
            conn.release();
        }
    }
}


// !!! Important le code précente une erreur !!!