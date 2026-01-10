
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');
} else {
    console.warn('Supabase credentials missing in .env');
}

// Routes
app.get('/', (req, res) => {
    res.send('InvestDemo Backend is running');
});

app.post('/api/save-action', async (req, res) => {
    try {
        const { groupName, round, decision, cash, portfolio, totalValue } = req.body;
        
        console.log(`Received data from ${groupName} - Round ${round}`);

        if (!supabase) {
            console.log('Data received but Supabase not configured:', req.body);
            return res.status(200).json({ message: 'Data received (Mock mode)', data: req.body });
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from('transaction_logs')
            .insert([
                { 
                    group_name: groupName, 
                    round: round, 
                    decision_type: decision.type, // 'AI' or 'SELF'
                    cash_balance: cash, 
                    portfolio_value: portfolio,
                    total_value: totalValue,
                    details: req.body 
                }
            ]);

        if (error) throw error;

        res.status(200).json({ message: 'Log saved successfully', data });
    } catch (error) {
        console.error('Error saving log:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
