require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/create/user", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // 1️⃣ Ensure table exists
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "Users" (
          id SERIAL PRIMARY KEY,
          name TEXT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
  
      // 2️⃣ Insert user
      const insertResult = await pool.query(
        `INSERT INTO "Users" (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, name, email`,
        [name, email, password]
      );
  
      res.status(201).json(insertResult.rows[0]);
  
    } catch (error) {
      // handle duplicate email error
      if (error.code === "23505") {
        return res.status(409).json({ message: "Email already exists" });
      }
  
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


app.get("/api/users",async (req,res)=>{
    const users = await pool.query(
        'SELECT name, email FROM "Users"'
      );
    if(users.rows.length === 0){
        return res.status(400).json({ message: "No users found" });
    }
    res.send(users.rows);   
});

app.get("/api/hello",(req,res)=>{
    res.send("Hello Sonu")
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
