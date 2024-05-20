import pool from "@/lib/dp";

export default async (req, res) => {
    const { IdCard, Password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE IdCard = ? AND Password = ?', [IdCard, Password]);
        if (rows.length === 1) {
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid ID or password' });
        }
      } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  };