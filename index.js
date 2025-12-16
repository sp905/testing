import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pool from "./db.js"; 
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/create/user",async (req,res)=>{
    const { name, email, password } = req.body;
   
    const insertResult = await pool.query(
        'INSERT INTO "Users" (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, password]
      );
      const user = {
        name: insertResult.rows[0].name,
        email: insertResult.rows[0].email
      };
      res.send(user);
});

app.get("/api/users",async (req,res)=>{
    const users = await pool.query("SELECT * FROM Users");
    if(users.rows.length === 0){
        return res.status(400).json({ message: "No users found" });
    }
    res.send(users.rows);   
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});