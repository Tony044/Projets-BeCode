//file globalRouters.js
import express from 'express';
// Diana's imports
import {showMessages, createLobby} from '../Controller/LobbyController.js';
import{editMessageByAdmin, deleteMessage} from '../Controller/EditingMessagesbyAdmin.js'

// Antoine's imports
import { postMessage } from '../Controller/postMessage.js';
import { editMessage } from '../Controller/editMessage.js';
import { pagination } from '../Controller/pagination.js';

// Mohab's imports
import {loginUser, registerUser} from "../Controller/user_controller.js";


const router = express.Router();

// Diana's routes
router.get('/lobby/:lobbyId', showMessages);
router.post('/lobby/create', createLobby);

router.patch('/lobby/message/:messageId', editMessageByAdmin);
router.delete('/lobby/message/:messageId', deleteMessage);

// Antoine's routes
router.post('/lobby/sendMessage', postMessage);
router.patch('/lobby/editMessage', editMessage);
// Root for pagination file
router.get('/lobby/:lobbyId/messages', pagination);


// Mohab's routes
router.post('/register', registerUser);
router.post('/login', loginUser);


export default router;