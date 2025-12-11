const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 配置中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// 连接数据库
const db = new sqlite3.Database('./game.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // 创建用户表
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            admin INTEGER DEFAULT 0,
            balance REAL DEFAULT 20,
            totalGames INTEGER DEFAULT 0,
            totalInput REAL DEFAULT 0,
            totalPrize REAL DEFAULT 0,
            netProfit REAL DEFAULT 0,
            winRate REAL DEFAULT 0,
            maxDebt REAL DEFAULT 0,
            debtStartGame INTEGER,
            debtDuration INTEGER DEFAULT 0,
            consecutiveGames INTEGER DEFAULT 0,
            hasSeenSkull INTEGER DEFAULT 0,
            hasSeenHighDebt INTEGER DEFAULT 0,
            registeredAt INTEGER DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // 创建游戏历史表
        db.run(`CREATE TABLE IF NOT EXISTS game_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            results TEXT NOT NULL,
            prize REAL NOT NULL,
            balance REAL NOT NULL,
            timestamp INTEGER DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (username) REFERENCES users(username)
        )`);
        
        // 初始化管理员账号
        db.run(`INSERT OR REPLACE INTO users (
            username, password, admin, balance, 
            totalGames, totalInput, totalPrize, netProfit, 
            winRate, maxDebt, debtStartGame, debtDuration, 
            consecutiveGames, registeredAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        ['XuChen', '12138', 1, 20, 0, 0, 0, 0, 0, 0, null, 0, 0, Date.now()]);
    }
});

// API 路由

// 用户注册
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: '请输入用户名和密码' });
    }
    
    const initialBalance = 20;
    
    db.run(`INSERT INTO users (username, password, balance, registeredAt) VALUES (?, ?, ?, ?)`, 
    [username, password, initialBalance, Date.now()], 
    function(err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({ error: '用户名已存在' });
            }
            return res.status(500).json({ error: '注册失败' });
        }
        
        // 返回新用户信息
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
            if (err) {
                return res.status(500).json({ error: '获取用户信息失败' });
            }
            res.json(user);
        });
    });
});

// 用户登录
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: '请输入用户名和密码' });
    }
    
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, user) => {
        if (err) {
            return res.status(500).json({ error: '登录失败' });
        }
        
        if (!user) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        res.json(user);
    });
});

// 获取用户信息
app.get('/api/user/:username', (req, res) => {
    const { username } = req.params;
    
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: '获取用户信息失败' });
        }
        
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        
        res.json(user);
    });
});

// 更新用户数据
app.put('/api/user/:username', (req, res) => {
    const { username } = req.params;
    const userData = req.body;
    
    // 构建更新字段和值
    const updateFields = [];
    const updateValues = [];
    
    Object.entries(userData).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'username' && key !== 'registeredAt') {
            updateFields.push(`${key} = ?`);
            updateValues.push(value);
        }
    });
    
    if (updateFields.length === 0) {
        return res.status(400).json({ error: '没有需要更新的字段' });
    }
    
    updateValues.push(username);
    
    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE username = ?`;
    
    db.run(sql, updateValues, function(err) {
        if (err) {
            return res.status(500).json({ error: '更新用户信息失败' });
        }
        
        // 返回更新后的用户信息
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
            if (err) {
                return res.status(500).json({ error: '获取更新后的用户信息失败' });
            }
            res.json(user);
        });
    });
});

// 保存游戏历史
app.post('/api/game-history', (req, res) => {
    const { username, results, prize, balance } = req.body;
    
    if (!username || !results || prize === undefined || balance === undefined) {
        return res.status(400).json({ error: '缺少必要的游戏数据' });
    }
    
    db.run(`INSERT INTO game_history (username, results, prize, balance, timestamp) VALUES (?, ?, ?, ?, ?)`, 
    [username, JSON.stringify(results), prize, balance, Date.now()], 
    function(err) {
        if (err) {
            return res.status(500).json({ error: '保存游戏历史失败' });
        }
        res.json({ success: true, id: this.lastID });
    });
});

// 获取排行榜
app.get('/api/leaderboard', (req, res) => {
    const { limit = 50 } = req.query;
    
    db.all(`SELECT username, balance FROM users ORDER BY balance DESC LIMIT ?`, [limit], (err, users) => {
        if (err) {
            return res.status(500).json({ error: '获取排行榜失败' });
        }
        res.json(users);
    });
});

// 获取所有用户列表（管理员用）
app.get('/api/users', (req, res) => {
    db.all(`SELECT * FROM users ORDER BY registeredAt DESC`, (err, users) => {
        if (err) {
            return res.status(500).json({ error: '获取用户列表失败' });
        }
        res.json(users);
    });
});

// 删除用户（管理员用）
app.delete('/api/user/:username', (req, res) => {
    const { username } = req.params;
    
    if (username === 'XuChen') {
        return res.status(403).json({ error: '不能删除管理员账号' });
    }
    
    db.run(`DELETE FROM users WHERE username = ?`, [username], function(err) {
        if (err) {
            return res.status(500).json({ error: '删除用户失败' });
        }
        res.json({ success: true, message: '用户已删除' });
    });
});

// 重置所有用户余额（管理员用）
app.post('/api/reset-balances', (req, res) => {
    const { newBalance = 20 } = req.body;
    
    db.run(`UPDATE users SET balance = ?`, [newBalance], function(err) {
        if (err) {
            return res.status(500).json({ error: '重置余额失败' });
        }
        res.json({ success: true, message: `所有用户余额已重置为 ${newBalance} 元` });
    });
});

// 首页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`游戏页面地址: http://localhost:${PORT}`);
});
