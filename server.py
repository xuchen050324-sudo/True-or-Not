from http.server import HTTPServer, SimpleHTTPRequestHandler
import sqlite3
import json
import datetime
from urllib.parse import urlparse, parse_qs

# 数据库初始化
conn = sqlite3.connect('game.db', check_same_thread=False)
cursor = conn.cursor()

# 创建用户表
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
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
)
''')

# 创建游戏历史表
cursor.execute('''
CREATE TABLE IF NOT EXISTS game_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    results TEXT NOT NULL,
    prize REAL NOT NULL,
    balance REAL NOT NULL,
    timestamp INTEGER DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username)
)
''')

# 初始化管理员账号
try:
    cursor.execute('''
    INSERT OR REPLACE INTO users (
        username, password, admin, balance, 
        totalGames, totalInput, totalPrize, netProfit, 
        winRate, maxDebt, debtStartGame, debtDuration, 
        consecutiveGames, registeredAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', ('XuChen', '12138', 1, 20, 0, 0, 0, 0, 0, 0, None, 0, 0, int(datetime.datetime.now().timestamp() * 1000)))
    conn.commit()
except sqlite3.Error as e:
    print(f"初始化管理员账号失败: {e}")

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        SimpleHTTPRequestHandler.end_headers(self)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        if self.path.startswith('/api/'):
            self.handle_api_get()
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path.startswith('/api/'):
            self.handle_api_post()
        else:
            super().do_POST()
    
    def do_PUT(self):
        if self.path.startswith('/api/'):
            self.handle_api_put()
        else:
            super().do_PUT()
    
    def do_DELETE(self):
        if self.path.startswith('/api/'):
            self.handle_api_delete()
        else:
            super().do_DELETE()
    
    def handle_api_get(self):
        path = self.path.split('/api/')[1]
        
        if path == 'users':
            # 获取所有用户
            cursor.execute('SELECT * FROM users ORDER BY registeredAt DESC')
            users = cursor.fetchall()
            user_list = []
            for user in users:
                user_dict = {
                    'id': user[0],
                    'username': user[1],
                    'password': user[2],
                    'admin': bool(user[3]),
                    'balance': user[4],
                    'totalGames': user[5],
                    'totalInput': user[6],
                    'totalPrize': user[7],
                    'netProfit': user[8],
                    'winRate': user[9],
                    'maxDebt': user[10],
                    'debtStartGame': user[11],
                    'debtDuration': user[12],
                    'consecutiveGames': user[13],
                    'hasSeenSkull': bool(user[14]),
                    'hasSeenHighDebt': bool(user[15]),
                    'registeredAt': user[16]
                }
                user_list.append(user_dict)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(user_list).encode('utf-8'))
        
        elif path.startswith('user/'):
            # 获取单个用户
            username = path.split('user/')[1]
            cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
            user = cursor.fetchone()
            
            if user:
                user_dict = {
                    'id': user[0],
                    'username': user[1],
                    'password': user[2],
                    'admin': bool(user[3]),
                    'balance': user[4],
                    'totalGames': user[5],
                    'totalInput': user[6],
                    'totalPrize': user[7],
                    'netProfit': user[8],
                    'winRate': user[9],
                    'maxDebt': user[10],
                    'debtStartGame': user[11],
                    'debtDuration': user[12],
                    'consecutiveGames': user[13],
                    'hasSeenSkull': bool(user[14]),
                    'hasSeenHighDebt': bool(user[15]),
                    'registeredAt': user[16]
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(user_dict).encode('utf-8'))
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '用户不存在'}).encode('utf-8'))
        
        elif path == 'leaderboard':
            # 获取排行榜
            cursor.execute('SELECT username, balance FROM users ORDER BY balance DESC LIMIT 50')
            leaderboard = cursor.fetchall()
            leaderboard_list = []
            for entry in leaderboard:
                leaderboard_list.append({
                    'username': entry[0],
                    'balance': entry[1]
                })
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(leaderboard_list).encode('utf-8'))
        
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': '接口不存在'}).encode('utf-8'))
    
    def handle_api_post(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        data = json.loads(post_data)
        
        path = self.path.split('/api/')[1]
        
        if path == 'register':
            # 用户注册
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '请输入用户名和密码'}).encode('utf-8'))
                return
            
            try:
                cursor.execute('''
                INSERT INTO users (username, password, balance, registeredAt) 
                VALUES (?, ?, ?, ?)
                ''', (username, password, 20, int(datetime.datetime.now().timestamp() * 1000)))
                conn.commit()
                
                # 返回新用户信息
                cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
                user = cursor.fetchone()
                if user:
                    user_dict = {
                        'id': user[0],
                        'username': user[1],
                        'password': user[2],
                        'admin': bool(user[3]),
                        'balance': user[4],
                        'totalGames': user[5],
                        'totalInput': user[6],
                        'totalPrize': user[7],
                        'netProfit': user[8],
                        'winRate': user[9],
                        'maxDebt': user[10],
                        'debtStartGame': user[11],
                        'debtDuration': user[12],
                        'consecutiveGames': user[13],
                        'hasSeenSkull': bool(user[14]),
                        'hasSeenHighDebt': bool(user[15]),
                        'registeredAt': user[16]
                    }
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(user_dict).encode('utf-8'))
                else:
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': '注册失败'}).encode('utf-8'))
            except sqlite3.IntegrityError:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '用户名已存在'}).encode('utf-8'))
            except sqlite3.Error as e:
                print(f"注册失败: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '注册失败'}).encode('utf-8'))
        
        elif path == 'login':
            # 用户登录
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '请输入用户名和密码'}).encode('utf-8'))
                return
            
            cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password))
            user = cursor.fetchone()
            
            if user:
                user_dict = {
                    'id': user[0],
                    'username': user[1],
                    'password': user[2],
                    'admin': bool(user[3]),
                    'balance': user[4],
                    'totalGames': user[5],
                    'totalInput': user[6],
                    'totalPrize': user[7],
                    'netProfit': user[8],
                    'winRate': user[9],
                    'maxDebt': user[10],
                    'debtStartGame': user[11],
                    'debtDuration': user[12],
                    'consecutiveGames': user[13],
                    'hasSeenSkull': bool(user[14]),
                    'hasSeenHighDebt': bool(user[15]),
                    'registeredAt': user[16]
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(user_dict).encode('utf-8'))
            else:
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '用户名或密码错误'}).encode('utf-8'))
        
        elif path == 'game-history':
            # 保存游戏历史
            username = data.get('username')
            results = data.get('results')
            prize = data.get('prize')
            balance = data.get('balance')
            
            if not username or not results or prize is None or balance is None:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '缺少必要的游戏数据'}).encode('utf-8'))
                return
            
            try:
                cursor.execute('''
                INSERT INTO game_history (username, results, prize, balance, timestamp) 
                VALUES (?, ?, ?, ?, ?)
                ''', (username, json.dumps(results), prize, balance, int(datetime.datetime.now().timestamp() * 1000)))
                conn.commit()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'id': cursor.lastrowid}).encode('utf-8'))
            except sqlite3.Error as e:
                print(f"保存游戏历史失败: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '保存游戏历史失败'}).encode('utf-8'))
        
        elif path == 'reset-balances':
            # 重置所有用户余额
            new_balance = data.get('newBalance', 20)
            
            try:
                cursor.execute('UPDATE users SET balance = ?', (new_balance,))
                conn.commit()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'message': f'所有用户余额已重置为 {new_balance} 元'}).encode('utf-8'))
            except sqlite3.Error as e:
                print(f"重置余额失败: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '重置余额失败'}).encode('utf-8'))
        
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': '接口不存在'}).encode('utf-8'))
    
    def handle_api_put(self):
        content_length = int(self.headers['Content-Length'])
        put_data = self.rfile.read(content_length).decode('utf-8')
        data = json.loads(put_data)
        
        path = self.path.split('/api/')[1]
        
        if path.startswith('user/'):
            # 更新用户信息
            username = path.split('user/')[1]
            
            # 构建更新语句
            update_fields = []
            update_values = []
            
            for key, value in data.items():
                if key not in ['id', 'username', 'registeredAt']:
                    if isinstance(value, bool):
                        value = 1 if value else 0
                    update_fields.append(f"{key} = ?")
                    update_values.append(value)
            
            if not update_fields:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '没有需要更新的字段'}).encode('utf-8'))
                return
            
            update_values.append(username)
            
            try:
                cursor.execute(f"UPDATE users SET {', '.join(update_fields)} WHERE username = ?", update_values)
                conn.commit()
                
                # 返回更新后的用户信息
                cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
                user = cursor.fetchone()
                if user:
                    user_dict = {
                        'id': user[0],
                        'username': user[1],
                        'password': user[2],
                        'admin': bool(user[3]),
                        'balance': user[4],
                        'totalGames': user[5],
                        'totalInput': user[6],
                        'totalPrize': user[7],
                        'netProfit': user[8],
                        'winRate': user[9],
                        'maxDebt': user[10],
                        'debtStartGame': user[11],
                        'debtDuration': user[12],
                        'consecutiveGames': user[13],
                        'hasSeenSkull': bool(user[14]),
                        'hasSeenHighDebt': bool(user[15]),
                        'registeredAt': user[16]
                    }
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(user_dict).encode('utf-8'))
                else:
                    self.send_response(404)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': '用户不存在'}).encode('utf-8'))
            except sqlite3.Error as e:
                print(f"更新用户信息失败: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '更新用户信息失败'}).encode('utf-8'))
        
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': '接口不存在'}).encode('utf-8'))
    
    def handle_api_delete(self):
        path = self.path.split('/api/')[1]
        
        if path.startswith('user/'):
            # 删除用户
            username = path.split('user/')[1]
            
            if username == 'XuChen':
                self.send_response(403)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '不能删除管理员账号'}).encode('utf-8'))
                return
            
            try:
                cursor.execute('DELETE FROM users WHERE username = ?', (username,))
                conn.commit()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'message': '用户已删除'}).encode('utf-8'))
            except sqlite3.Error as e:
                print(f"删除用户失败: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '删除用户失败'}).encode('utf-8'))
        
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': '接口不存在'}).encode('utf-8'))

# 启动服务器
PORT = 3000
server_address = ('', PORT)
httpd = HTTPServer(server_address, CORSRequestHandler)

print(f"服务器运行在 http://localhost:{PORT}")
print(f"游戏页面地址: http://localhost:{PORT}")
httpd.serve_forever()
