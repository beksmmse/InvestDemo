
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

app.post('/api/save-game', async (req, res) => {
    try {
        const { groupName, userEmail, rounds, finalTotal } = req.body;

        console.log(`Received game data from ${groupName} - ${rounds ? rounds.length : 0} rounds`);

        if (!Array.isArray(rounds) || rounds.length === 0) {
            return res.status(400).json({ error: 'Invalid data format. Expected rounds array.' });
        }

        // --- Transformation Logic ---

        // 1. Profit Calculation (Plain String)
        const initialCash = 1000000;
        const profitValue = finalTotal - initialCash;
        const profitDisplay = new Intl.NumberFormat('en-US').format(profitValue);

        // 2. Rounds Log Transformation
        const roundsLogFormatted = rounds.map(r => {
            // Actions
            const actionsList = r.stocks
                .filter(s => s.buyQty !== 0 && s.buyQty !== null)
                .map(s => ({
                    symbol: s.symbol,
                    type: s.buyQty > 0 ? 'BUY' : 'SELL',
                    qty: Math.abs(s.buyQty),
                    total: s.price * Math.abs(s.buyQty)
                }));

            return {
                round: r.round,
                situation: r.situation || "—",
                decision: r.decision.type,
                actions: actionsList.length > 0 ? actionsList : "NO_ACTION",
                snapshot: {
                    cash: r.cash,
                    port: r.portfolio
                }
            };
        });

        // 3. Prepare DB Record (Remove group_name as it is implied by table)
        const dbRecord = {
            user_email: userEmail,
            net_worth: new Intl.NumberFormat('en-US').format(finalTotal),
            profit: profitDisplay,
            rounds_log: roundsLogFormatted // JSONB column
        };

        if (!supabase) {
            console.log('Supabase not configured. Mock save:', JSON.stringify(dbRecord, null, 2));
            return res.status(200).json({ message: 'Game data received (Mock mode)', count: 1 });
        }

        // 4. Determine Table Name dynamically
        // Expected groupName: "Group1", "Group2", etc. -> "group1_logs", "group2_logs"
        const tableName = `${groupName.toLowerCase()}_logs`;

        console.log(`Inserting into table: ${tableName}`);

        // 5. Insert into Specific Group Table
        const { data, error } = await supabase
            .from(tableName)
            .insert([dbRecord]);

        if (error) throw error;

        res.status(200).json({ message: 'Game session saved successfully', count: 1 });
    } catch (error) {
        console.error('Error saving game logs:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/leaderboard/:groupName', async (req, res) => {
    try {
        const { groupName } = req.params;
        const tableName = `${groupName.toLowerCase()}_logs`;

        console.log(`Fetching leaderboard for ${tableName}`);

        if (!supabase) {
            return res.status(200).json([]);
        }

        // Fetch all records (assuming manageable size, otherwise use RPC for server-side sort)
        const { data, error } = await supabase
            .from(tableName)
            .select('user_email, net_worth, profit');

        if (error) {
            // Table might not exist yet if no one played
            if (error.code === '42P01') return res.json([]);
            throw error;
        }

        // Sort in Javascript because net_worth is stored as formatted string "1,000,000"
        const sortedData = data
            .map(item => ({
                email: item.user_email || 'Anonymous',
                netWorthDisplay: item.net_worth,
                profitDisplay: item.profit,
                rawVal: parseInt(item.net_worth.replace(/,/g, ''), 10) || 0
            }))
            .sort((a, b) => b.rawVal - a.rawVal)
            .slice(0, 10);

        res.status(200).json(sortedData);
    } catch (error) {
        console.error('Error fetching leaderboard:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
