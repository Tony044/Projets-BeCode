import pool from '../Model/connectDB.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Function to create a new user
async function createUser(name, surname, login, password) {
    try {
        // const {name, surname, login, password} =req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(`INSERT INTO User(name, surname, login, password) VALUES (?, ?, ?, ?)`, [name, surname, login, hashedPassword]);
    } catch (err) {
        throw new Error('Error creating user');
    }
}

// Function to check if a user already exists
async function checkIfUserAlreadyExists(login) {
    try {
        // Query the database for the user
        const check=`SELECT * FROM User WHERE login = ?`;

        const rows = await pool.query(check, [login]);
console.log(check);
        // Log the rows for debugging
        console.log('Query Result Rows:', rows);

       
        
        // const thissss =  rows.length > 0;
        // console.log(thissss);
        return rows.length > 0;


    } catch (err) {
        console.log(login);
        console.error('Database error:', err.message); // Log error message
        throw new Error('Database error'); // Rethrow with a generic message
    }
}

// Function to handle user registration
export const registerUser = async (req, res) => {
    const { name, surname, login, password } = req.body;

    if (!name || !surname || !login || !password) {
        return res.status(400).send('Missing mandatory fields.');
    }

    try {
        const userExists = await checkIfUserAlreadyExists(login);
        if (userExists) {
            return res.status(400).send('User already exists');
        }

        await createUser(name, surname, login, password);
        res.status(201).send(`User ${name} successfully registered!`);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during registration.');
    }
};

// Function to handle user login
export const loginUser = async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).send('Missing mandatory fields.');
    }

    try {
        const checkUser = `SELECT * FROM User WHERE login = ?`;

        const result = await pool.query(checkUser, [login]);
        if (result.length == 0) {
            return res.status(400).send('User not found');
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid login or password');
        }

        const token = jwt.sign({ id: user.userId, name: user.name }, JWT_SECRET, { expiresIn: '5h' });
        res.status(200).send("Logged in ");
      
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during login.');
    }
};

// Middleware for authentication
export function authentication(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).send('Not authorized');
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(403).send(`${error.message}`);
    }
}



