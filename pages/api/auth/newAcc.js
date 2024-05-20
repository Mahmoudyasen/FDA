import pool from "@/lib/dp";

export default async (req, res) => {
    if (req.method === 'POST') {
      const { IdCard, Fname, Lname, Password, Email} = req.body;
      try {
        await pool.query('INSERT INTO users (IdCard, Fname, Lname,Password, Email) VALUES (?, ?, ?, ?, ?)', [IdCard, Fname, Lname,Password,Email]);
        res.status(201).json({ message: 'User has been created' });
      } catch (error) {
        res.status(500).json({ error: "Coudln't Create new User" });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  };