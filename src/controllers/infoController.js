import pool from '../db/db.js';

export const getInfo = async (req, res) => {
    console.log('Received request body:', req.body);
    let userId;
    try {
        userId = req.body.userId;
        console.log('Received userId:', userId, typeof userId);

        userId = parseInt(userId, 10);
        console.log('Parsed userId as integer:', userId, typeof userId);

        if (isNaN(userId)) {
            console.log('Invalid userId');
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const info = await pool.query('SELECT username, email FROM users WHERE id = $1', [userId]);
        if (info.rows.length === 0) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        };
        res.json(info.rows[0]);
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
}