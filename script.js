// 全局变量
let currentUser = null;
let users = [];
let gameHistory = [];
let isGameRunning = false;
let currentLang = localStorage.getItem('currentLang') || 'zh'; // 默认中文
const API_URL = 'http://localhost:3000/api'; // 后端API地址

// 语言资源对象
const langResources = {
    zh: {
        // 登录/注册页
        loginTitle: '幸运拉杆 - 概率实验室',
        username: '用户名',
        password: '密码',
        login: '登录',
        register: '注册',
        websiteIntro: '这是一个数学教育工具，通过虚拟赌博游戏，让用户直观理解"数学期望为负"的概念。',
        coreProbability: '核心概率',
        zeroProbability: '57.81% 直接归零',
        expectedValue: '期望值 -3.4元/局',
        leaderboardPreview: '🏆 财富榜预览',
        
        // 游戏页
        gameTitle: '幸运拉杆',
        logout: '退出登录',
        startGame: '开始游戏',
        currentBalance: '当前余额：',
        realTimeLeaderboard: '🏆 实时财富榜',
        yourRank: '你的排名：',
        personalData: '📊 个人数据',
        totalGames: '总游戏：',
        totalInput: '总投入：',
        totalPrize: '总奖金：',
        netProfit: '净收益：',
        winRate: '胜率：',
        debtAnalysis: '💸 负债分析',
        maxDebt: '最大负债：',
        debtStartGame: '负债开始局数：',
        debtDuration: '负债持续：',
        probability公示: '概率公示',
        prizeTable: '奖金表',
        expectedValueCalculator: '期望值计算器',
        calculate: '计算',
        expectedResult: '预期亏损：',
        gameCount: '输入局数',
        adminBtn: '管理面板',
        symbolProbability: '🎲 图案概率',
        symbol: '图案',
        probability: '概率',
        
        // 破产分析页
        bankruptcyTitle: '💥 破产分析报告',
        gameSummary: '1. 你的游戏总结',
        initialFunds: '初始资金：',
        finalBalance: '最终余额：',
        totalLoss: '总损失：',
        avgLoss: '平均每局损失：',
        mathPrinciple: '2. 数学原理',
        whatIf: '3. "如果"对比',
        conclusion: '4. 教育结论',
        restartGame: '重新开始',
        returnGame: '返回游戏',
        
        // 管理员页面
        adminPageTitle: '🔧 管理员控制面板',
        backToGame: '返回游戏',
        systemSettings: '系统设置',
        initialBalance: '初始资金：',
        debtLimit: '欠款下限：',
        save: '保存',
        userManagement: '用户管理',
        refreshUsers: '刷新用户列表',
        deleteTestUsers: '删除测试数据',
        usernameCol: '用户名',
        passwordCol: '密码',
        balanceCol: '余额',
        gamesCol: '游戏局数',
        registerTime: '注册时间',
        adminCol: '管理员',
        actions: '操作',
        edit: '编辑',
        delete: '删除',
        resetBalances: '重置所有用户余额',
        resetToInitial: '重置为当前初始资金',
        
        // 按钮文本
        confirm: '确定',
        cancel: '取消',
        
        // 提示信息
        loginFailed: '用户名或密码错误',
        usernameExists: '用户名已存在',
        pleaseEnter: '请输入用户名和密码',
        adminOnly: '只有管理员可以访问此页面',
        userUpdated: '用户信息已更新',
        userDeleted: '用户已删除',
        initialBalanceSaved: '初始资金已保存',
        debtLimitSaved: '负债上限已保存',
        balancesReset: '所有用户的余额已重置为 X 元',
        resetCancelled: '已取消重置操作',
        testUsersDeleted: '测试用户已删除'
    },
    en: {
        // 登录/注册页
        loginTitle: 'Lucky Slot - Probability Lab',
        username: 'Username',
        password: 'Password',
        login: 'Login',
        register: 'Register',
        websiteIntro: 'This is a math education tool that allows users to intuitively understand the concept of "negative mathematical expectation" through virtual gambling games.',
        coreProbability: 'Core Probability',
        zeroProbability: '57.81% Directly zero',
        expectedValue: 'Expected Value -3.4 yuan/game',
        leaderboardPreview: '🏆 Leaderboard Preview',
        
        // 游戏页
        gameTitle: 'Lucky Slot',
        logout: 'Logout',
        startGame: 'Start Game',
        currentBalance: 'Current Balance: ',
        realTimeLeaderboard: '🏆 Real-time Leaderboard',
        yourRank: 'Your Rank: ',
        personalData: '📊 Personal Data',
        totalGames: 'Total Games: ',
        totalInput: 'Total Input: ',
        totalPrize: 'Total Prize: ',
        netProfit: 'Net Profit: ',
        winRate: 'Win Rate: ',
        debtAnalysis: '💸 Debt Analysis',
        maxDebt: 'Max Debt: ',
        debtStartGame: 'Debt Start Game: ',
        debtDuration: 'Debt Duration: ',
        probability公示: 'Probability Disclosure',
        prizeTable: 'Prize Table',
        expectedValueCalculator: 'Expected Value Calculator',
        calculate: 'Calculate',
        expectedResult: 'Expected Loss: ',
        gameCount: 'Enter Game Count',
        adminBtn: 'Admin Panel',
        symbolProbability: '🎲 Symbol Probability',
        symbol: 'Symbol',
        probability: 'Probability',
        
        // 破产分析页
        bankruptcyTitle: '💥 Bankruptcy Analysis Report',
        gameSummary: '1. Your Game Summary',
        initialFunds: 'Initial Funds: ',
        finalBalance: 'Final Balance: ',
        totalLoss: 'Total Loss: ',
        avgLoss: 'Average Loss per Game: ',
        mathPrinciple: '2. Mathematical Principle',
        whatIf: '3. "What If" Comparison',
        conclusion: '4. Educational Conclusion',
        restartGame: 'Restart Game',
        returnGame: 'Return to Game',
        
        // 管理员页面
        adminPageTitle: '🔧 Admin Control Panel',
        backToGame: 'Back to Game',
        systemSettings: 'System Settings',
        initialBalance: 'Initial Balance: ',
        debtLimit: 'Debt Lower Limit: ',
        save: 'Save',
        userManagement: 'User Management',
        refreshUsers: 'Refresh User List',
        deleteTestUsers: 'Delete Test Data',
        usernameCol: 'Username',
        passwordCol: 'Password',
        balanceCol: 'Balance',
        gamesCol: 'Total Games',
        registerTime: 'Register Time',
        adminCol: 'Admin',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        resetBalances: 'Reset All Balances',
        resetToInitial: 'Reset to Current Initial Balance',
        
        // 按钮文本
        confirm: 'Confirm',
        cancel: 'Cancel',
        
        // 提示信息
        loginFailed: 'Invalid username or password',
        usernameExists: 'Username already exists',
        pleaseEnter: 'Please enter username and password',
        adminOnly: 'Only administrators can access this page',
        userUpdated: 'User information updated',
        userDeleted: 'User deleted',
        initialBalanceSaved: 'Initial balance saved',
        debtLimitSaved: 'Debt limit saved',
        balancesReset: 'All users balances have been reset to X yuan',
        resetCancelled: 'Reset operation cancelled',
        testUsersDeleted: 'Test users deleted'
    }
};

// 图案定义
const SYMBOLS = ['❌', '7️⃣', '💰', '🍒', '⭐', '🍀'];

// 初始化页面
async function init() {
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化语言设置
    initLanguage();
    
    // 获取用户列表
    await fetchUsers();
    
    // 加载财富榜预览
    updateLeaderboardPreview();
    
    // 检查本地存储中的登录状态
    checkLoginStatus();
}

// 绑定事件监听器
function bindEventListeners() {
    // 登录/注册页
    document.getElementById('loginBtn').addEventListener('click', login);
    document.getElementById('registerBtn').addEventListener('click', register);
    
    // 游戏页
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('calculateBtn').addEventListener('click', calculateExpectedValue);
    document.getElementById('adminBtn').addEventListener('click', showAdminPage);
    
    // 破产分析页
    document.getElementById('restartGameBtn').addEventListener('click', restartGame);
    document.getElementById('returnGameBtn').addEventListener('click', returnToGame);
    
    // 管理员页
    document.getElementById('backToGameBtn').addEventListener('click', showGamePage);
    document.getElementById('refreshUsersBtn').addEventListener('click', refreshUsersList);
    document.getElementById('deleteTestUsersBtn').addEventListener('click', deleteTestUsers);
    document.getElementById('saveInitialBtn').addEventListener('click', saveInitialBalance);
    document.getElementById('saveDebtLimitBtn').addEventListener('click', saveDebtLimit);
    document.getElementById('resetBalancesBtn').addEventListener('click', resetBalances);
    
    // 教育提示弹窗
    document.getElementById('closeModal').addEventListener('click', closeModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('educationModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 语言切换按钮
    document.querySelectorAll('#lang-zh').forEach(btn => {
        btn.addEventListener('click', () => switchLanguage('zh'));
    });
    document.querySelectorAll('#lang-en').forEach(btn => {
        btn.addEventListener('click', () => switchLanguage('en'));
    });
}

// 切换语言
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('currentLang', lang);
    
    // 更新所有语言切换按钮的激活状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll(`#lang-${lang}`).forEach(btn => {
        btn.classList.add('active');
    });
    
    // 更新页面文本
    updatePageText();
    
    // 如果在游戏页面，刷新游戏数据显示
    if (document.getElementById('gamePage').classList.contains('active')) {
        updateGamePage();
    }
    
    // 如果在管理员页面，刷新用户列表
    if (document.getElementById('adminPage').classList.contains('active')) {
        refreshUsersList();
    }
}

// 更新页面文本
function updatePageText() {
    const resources = langResources[currentLang];
    
    // 更新登录/注册页文本
    document.querySelector('#loginPage h1').textContent = resources.loginTitle;
    document.querySelector('#loginPage label[for="username"]').textContent = resources.username;
    document.querySelector('#loginPage #username').placeholder = resources.username + ' ' + resources.pleaseEnter;
    document.querySelector('#loginPage label[for="password"]').textContent = resources.password;
    document.querySelector('#loginPage #password').placeholder = resources.password + ' ' + resources.pleaseEnter;
    document.querySelector('#loginBtn').textContent = resources.login;
    document.querySelector('#registerBtn').textContent = resources.register;
    document.querySelector('#loginPage .about h3').textContent = resources.websiteIntro;
    document.querySelector('#loginPage .probability h3').textContent = resources.coreProbability;
    document.querySelectorAll('#loginPage .probability p')[0].textContent = resources.zeroProbability;
    document.querySelectorAll('#loginPage .probability p')[1].textContent = resources.expectedValue;
    document.querySelector('#loginPage .leaderboard-preview h3').textContent = resources.leaderboardPreview;
    
    // 更新游戏页文本
    document.querySelector('#gamePage .logo').textContent = resources.gameTitle;
    document.querySelector('#logoutBtn').textContent = resources.logout;
    document.querySelector('#startGameBtn').textContent = resources.startGame;
    
    // 更新余额显示
    if (document.querySelector('.balance-display span')) {
        document.querySelector('.balance-display span').textContent = resources.currentBalance;
    }
    document.querySelector('#balance').textContent = currentUser?.balance + '元' || '';
    
    document.querySelector('#gamePage .left-sidebar h2').textContent = resources.realTimeLeaderboard;
    
    // 更新用户排名（仅更新前缀，实际排名在updateUserRank中处理）
    
    document.querySelector('#gamePage .right-sidebar h2:nth-child(1)').textContent = resources.personalData;
    document.querySelectorAll('#gamePage .stat-item .label')[0].textContent = resources.currentBalance;
    document.querySelectorAll('#gamePage .stat-item .label')[1].textContent = resources.totalGames;
    document.querySelectorAll('#gamePage .stat-item .label')[2].textContent = resources.totalInput;
    document.querySelectorAll('#gamePage .stat-item .label')[3].textContent = resources.totalPrize;
    document.querySelectorAll('#gamePage .stat-item .label')[4].textContent = resources.netProfit;
    document.querySelectorAll('#gamePage .stat-item .label')[5].textContent = resources.winRate;
    document.querySelector('#gamePage .right-sidebar h2:nth-child(3)').textContent = resources.debtAnalysis;
    document.querySelectorAll('#gamePage .stat-item .label')[6].textContent = resources.maxDebt;
    document.querySelectorAll('#gamePage .stat-item .label')[7].textContent = resources.debtStartGame;
    document.querySelectorAll('#gamePage .stat-item .label')[8].textContent = resources.debtDuration;
    
    // 更新概率公示和奖金表
    document.querySelector('#gamePage .probability公示 h3').textContent = resources.probability公示;
    document.querySelector('#gamePage .prize-table h3').textContent = resources.prizeTable;
    
    // 更新概率公示表格
    const probabilityTable = document.querySelector('.probability公示 table');
    if (probabilityTable) {
        const headers = probabilityTable.querySelectorAll('th');
        if (headers.length >= 3) {
            headers[0].textContent = currentLang === 'zh' ? '事件' : 'Event';
            headers[1].textContent = currentLang === 'zh' ? '奖金' : 'Prize';
            headers[2].textContent = currentLang === 'zh' ? '概率' : 'Probability';
        }
        
        const rows = probabilityTable.querySelectorAll('tr');
        if (rows.length >= 6) {
            // 三个7️⃣
            rows[1].querySelectorAll('td')[0].textContent = currentLang === 'zh' ? '三个7️⃣' : 'Three 7️⃣';
            // 三个相同非7️⃣图案
            rows[2].querySelectorAll('td')[0].textContent = currentLang === 'zh' ? '三个相同非7️⃣图案' : 'Three same non-7️⃣ symbols';
            // 两个7️⃣
            rows[3].querySelectorAll('td')[0].textContent = currentLang === 'zh' ? '两个7️⃣' : 'Two 7️⃣';
            // 一个❌
            rows[4].querySelectorAll('td')[0].textContent = currentLang === 'zh' ? '一个❌' : 'One ❌';
            // 其他
            rows[5].querySelectorAll('td')[0].textContent = currentLang === 'zh' ? '其他' : 'Other';
        }
    }
    
    // 更新图案概率表格
    const symbolProbabilityTitle = document.querySelector('.symbol-probability h2');
    if (symbolProbabilityTitle) {
        symbolProbabilityTitle.textContent = resources.symbolProbability;
    }
    
    const symbolProbabilityTable = document.getElementById('symbolProbabilityTable');
    if (symbolProbabilityTable) {
        const symbolHeaders = symbolProbabilityTable.querySelectorAll('th');
        if (symbolHeaders.length >= 2) {
            symbolHeaders[0].textContent = resources.symbol;
            symbolHeaders[1].textContent = resources.probability;
        }
    }
    
    // 更新奖金表
    const prizeList = document.querySelector('.prize-table ul');
    if (prizeList) {
        const items = prizeList.querySelectorAll('li');
        if (items.length >= 5) {
            items[0].textContent = currentLang === 'zh' ? '三个7️⃣：50元' : 'Three 7️⃣: 50 yuan';
            items[1].textContent = currentLang === 'zh' ? '三个相同非7️⃣：16元' : 'Three same non-7️⃣: 16 yuan';
            items[2].textContent = currentLang === 'zh' ? '两个7️⃣：8元' : 'Two 7️⃣: 8 yuan';
            items[3].textContent = currentLang === 'zh' ? '任意图案为❌：0元' : 'Any ❌: 0 yuan';
            items[4].textContent = currentLang === 'zh' ? '其他情况：3元' : 'Other cases: 3 yuan';
        }
    }
    
    document.querySelector('#gamePage .expected-value h3').textContent = resources.expectedValueCalculator;
    document.querySelector('#calculateBtn').textContent = resources.calculate;
    document.querySelector('#gameCount').placeholder = resources.gameCount;
    document.querySelector('#expectedResult').textContent = resources.expectedResult + '0元';
    document.querySelector('#adminBtn').textContent = resources.adminBtn;
    
    // 更新破产分析页文本
    document.querySelector('#bankruptcyPage h1').textContent = resources.bankruptcyTitle;
    document.querySelectorAll('#bankruptcyPage h2')[0].textContent = resources.gameSummary;
    document.querySelectorAll('#bankruptcyPage .summary-item .label')[0].textContent = resources.initialFunds;
    document.querySelectorAll('#bankruptcyPage .summary-item .label')[1].textContent = resources.finalBalance;
    document.querySelectorAll('#bankruptcyPage .summary-item .label')[2].textContent = resources.totalLoss;
    document.querySelectorAll('#bankruptcyPage .summary-item .label')[3].textContent = resources.avgLoss;
    document.querySelectorAll('#bankruptcyPage h2')[1].textContent = resources.mathPrinciple;
    document.querySelectorAll('#bankruptcyPage h2')[2].textContent = resources.whatIf;
    document.querySelectorAll('#bankruptcyPage h2')[3].textContent = resources.conclusion;
    document.querySelector('#restartGameBtn').textContent = resources.restartGame;
    document.querySelector('#returnGameBtn').textContent = resources.returnGame;
    
    // 更新管理员页面文本
    document.querySelector('#adminPage h1').textContent = resources.adminPageTitle;
    document.querySelector('#backToGameBtn').textContent = resources.backToGame;
    
    // 系统设置文本
    if (document.querySelector('#adminPage .admin-section:nth-child(1) h2')) {
        document.querySelector('#adminPage .admin-section:nth-child(1) h2').textContent = resources.systemSettings;
    }
    
    // 使用唯一id来精确定位每个label元素
    if (document.getElementById('initialBalanceLabel')) {
        document.getElementById('initialBalanceLabel').textContent = resources.initialBalance;
    }
    if (document.getElementById('debtLimitLabel')) {
        document.getElementById('debtLimitLabel').textContent = resources.debtLimit;
    }
    if (document.getElementById('resetBalancesLabel')) {
        document.getElementById('resetBalancesLabel').textContent = resources.resetBalances;
    }
    if (document.querySelector('#saveInitialBtn')) {
        document.querySelector('#saveInitialBtn').textContent = resources.save;
    }
    if (document.querySelector('#saveDebtLimitBtn')) {
        document.querySelector('#saveDebtLimitBtn').textContent = resources.save;
    }
    if (document.querySelector('#resetBalancesBtn')) {
        document.querySelector('#resetBalancesBtn').textContent = resources.resetToInitial;
    }
    
    // 用户管理文本
    if (document.querySelector('#adminPage .admin-section:nth-child(2) h2')) {
        document.querySelector('#adminPage .admin-section:nth-child(2) h2').textContent = resources.userManagement;
    }
    if (document.querySelector('#refreshUsersBtn')) {
        document.querySelector('#refreshUsersBtn').textContent = resources.refreshUsers;
    }
    if (document.querySelector('#deleteTestUsersBtn')) {
        document.querySelector('#deleteTestUsersBtn').textContent = resources.deleteTestUsers;
    }
    
    // 用户表格列标题
    const tableHeaders = document.querySelectorAll('#adminPage .users-table th');
    if (tableHeaders.length >= 7) {
        tableHeaders[0].textContent = resources.usernameCol;
        tableHeaders[1].textContent = resources.passwordCol;
        tableHeaders[2].textContent = resources.balanceCol;
        tableHeaders[3].textContent = resources.gamesCol;
        tableHeaders[4].textContent = resources.registerTime;
        tableHeaders[5].textContent = resources.adminCol;
        tableHeaders[6].textContent = resources.actions;
    }
}

// 初始化语言设置
function initLanguage() {
    // 更新语言切换按钮的激活状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll(`#lang-${currentLang}`).forEach(btn => {
        btn.classList.add('active');
    });
    
    // 更新页面文本
    updatePageText();
}

// 显示管理员页面
async function showAdminPage() {
    if (!currentUser || !currentUser.admin) {
        alert('只有管理员可以访问此页面');
        showLoginPage();
        return;
    }
    
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('gamePage').classList.remove('active');
    document.getElementById('bankruptcyPage').classList.remove('active');
    document.getElementById('adminPage').classList.add('active');
    
    // 更新页面文本
    updatePageText();
    
    // 加载用户列表
    await refreshUsersList();
}

// 刷新用户列表
async function refreshUsersList() {
    // 检查管理员权限
    if (!currentUser || !currentUser.admin) {
        alert(langResources[currentLang].adminOnly);
        showLoginPage();
        return;
    }
    
    const usersTableBody = document.getElementById('usersTableBody');
    
    try {
        // 1. 先从后端获取最新的用户数据，避免清空表格后等待
        const response = await fetch(`${API_URL}/users`);
        let updatedUsers = [];
        if (response.ok) {
            updatedUsers = await response.json();
            users = updatedUsers; // 更新全局用户列表
        }
        
        // 获取当前语言资源
        const resources = langResources[currentLang];
        
        // 2. 构建新的表格内容
        let newTableContent = '';
        updatedUsers.forEach(user => {
            const encryptedPassword = '•••••••'; // 用7个圆点替代真实密码
            newTableContent += `
                <tr>
                    <td>${user.username}</td>
                    <td>
                        <span id="pass-text-${user.username}">${encryptedPassword}</span>
                        <input type="text" id="pass-input-${user.username}" value="${user.password}" style="display: none; width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;">
                    </td>
                    <td>
                        <span id="bal-text-${user.username}">${user.balance}元</span>
                        <input type="number" id="bal-input-${user.username}" value="${user.balance}" style="display: none; width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;">
                    </td>
                    <td>
                        <span id="games-text-${user.username}">${user.totalGames}局</span>
                        <input type="number" id="games-input-${user.username}" value="${user.totalGames}" style="display: none; width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;">
                    </td>
                    <td>${new Date(user.registeredAt).toLocaleString()}</td>
                    <td>
                        <span id="admin-text-${user.username}">${user.admin ? (currentLang === 'zh' ? '是' : 'Yes') : (currentLang === 'zh' ? '否' : 'No')}</span>
                        <select id="admin-input-${user.username}" style="display: none; width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;">
                            <option value="false">${currentLang === 'zh' ? '否' : 'No'}</option>
                            <option value="true" ${user.admin ? 'selected' : ''}>${currentLang === 'zh' ? '是' : 'Yes'}</option>
                        </select>
                    </td>
                    <td>
                        <button id="edit-${user.username}" class="btn edit" onclick="toggleEditMode('${user.username}')">${resources.edit}</button>
                        <button id="save-${user.username}" class="btn save" onclick="saveUserChanges('${user.username}')" style="display: none;">${resources.save}</button>
                        <button class="btn delete-small" onclick="deleteUser('${user.username}')">${resources.delete}</button>
                    </td>
                </tr>
            `;
        });
        
        // 3. 一次性更新表格内容，避免闪烁
        usersTableBody.innerHTML = newTableContent;
        
    } catch (error) {
        console.error('获取用户列表失败:', error);
    }
}

// 切换编辑模式
function toggleEditMode(username) {
    // 切换密码的显示/编辑状态
    const passText = document.getElementById(`pass-text-${username}`);
    const passInput = document.getElementById(`pass-input-${username}`);
    passText.style.display = passText.style.display === 'none' ? 'inline' : 'none';
    passInput.style.display = passInput.style.display === 'none' ? 'block' : 'none';
    
    // 切换余额的显示/编辑状态
    const balText = document.getElementById(`bal-text-${username}`);
    const balInput = document.getElementById(`bal-input-${username}`);
    balText.style.display = balText.style.display === 'none' ? 'inline' : 'none';
    balInput.style.display = balInput.style.display === 'none' ? 'block' : 'none';
    
    // 切换游戏局数的显示/编辑状态
    const gamesText = document.getElementById(`games-text-${username}`);
    const gamesInput = document.getElementById(`games-input-${username}`);
    gamesText.style.display = gamesText.style.display === 'none' ? 'inline' : 'none';
    gamesInput.style.display = gamesInput.style.display === 'none' ? 'block' : 'none';
    
    // 切换管理员权限的显示/编辑状态
    const adminText = document.getElementById(`admin-text-${username}`);
    const adminInput = document.getElementById(`admin-input-${username}`);
    adminText.style.display = adminText.style.display === 'none' ? 'inline' : 'none';
    adminInput.style.display = adminInput.style.display === 'none' ? 'block' : 'none';
    
    // 切换编辑/保存按钮
    const editBtn = document.getElementById(`edit-${username}`);
    const saveBtn = document.getElementById(`save-${username}`);
    editBtn.style.display = editBtn.style.display === 'none' ? 'inline' : 'none';
    saveBtn.style.display = saveBtn.style.display === 'none' ? 'inline' : 'none';
}

// 保存用户编辑的信息
async function saveUserChanges(username) {
    // 检查管理员权限
    if (!currentUser || !currentUser.admin) {
        alert('只有管理员可以执行此操作');
        showLoginPage();
        return;
    }
    
    // 获取用户输入的新值
    const newPassword = document.getElementById(`pass-input-${username}`).value;
    const newBalance = parseInt(document.getElementById(`bal-input-${username}`).value);
    const newTotalGames = parseInt(document.getElementById(`games-input-${username}`).value);
    const newAdmin = document.getElementById(`admin-input-${username}`).value === 'true';
    
    // 验证输入
    if (isNaN(newBalance) || isNaN(newTotalGames)) {
        alert('余额和游戏局数必须是有效的数字');
        return;
    }
    
    // 构建更新数据
    const updateData = {
        password: newPassword,
        balance: newBalance,
        totalGames: newTotalGames
    };
    
    // 防止修改管理员自己的管理员权限，避免失去管理员权限
    if (username !== currentUser.username) {
        updateData.admin = newAdmin;
    }
    
    try {
        // 发送更新请求到后端
        const response = await fetch(`${API_URL}/user/${username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            // 更新成功，刷新用户列表
            await refreshUsersList();
            
            // 更新当前用户的信息（如果编辑的是当前用户）
            if (username === currentUser.username) {
                const updatedUser = await response.json();
                currentUser = updatedUser;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            // 显示成功提示
            alert('用户信息已更新');
        } else {
            alert('更新用户信息失败');
        }
    } catch (error) {
        console.error('更新用户信息失败:', error);
        alert('更新用户信息失败');
    }
}

// 删除用户
async function deleteUser(username) {
    // 检查管理员权限
    if (!currentUser || !currentUser.admin) {
        alert(langResources[currentLang].adminOnly);
        showLoginPage();
        return;
    }
    
    const resources = langResources[currentLang];
    
    if (username === 'XuChen') {
        alert('不能删除管理员账号');
        return;
    }
    
    if (confirm(`${resources.confirm} ${resources.delete} ${username}?`)) {
        try {
            // 发送删除请求到后端
            const response = await fetch(`${API_URL}/user/${username}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // 删除成功，刷新用户列表
                await refreshUsersList();
                alert(resources.userDeleted);
            } else {
                alert('删除用户失败');
            }
        } catch (error) {
            console.error('删除用户失败:', error);
            alert('删除用户失败');
        }
    }
}

// 删除测试数据
function deleteTestUsers() {
    // 检查管理员权限
    if (!currentUser || !currentUser.admin) {
        alert(langResources[currentLang].adminOnly);
        showLoginPage();
        return;
    }
    
    const resources = langResources[currentLang];
    
    if (confirm(`${resources.confirm} ${resources.deleteTestUsers}?`)) {
        users = users.filter(user => user.admin);
        localStorage.setItem('users', JSON.stringify(users));
        refreshUsersList();
        alert(resources.testUsersDeleted);
    }
}

// 保存初始余额
function saveInitialBalance() {
    // 检查管理员权限
    if (!currentUser || !currentUser.admin) {
        alert(langResources[currentLang].adminOnly);
        showLoginPage();
        return;
    }
    
    // 获取当前语言资源
    const resources = langResources[currentLang];
    
    // 获取当前保存的初始资金（旧值），默认20
    const oldInitialBalance = parseInt(localStorage.getItem('initialBalance')) || 20;
    // 获取用户输入的新初始资金（新值）
    const newInitialBalance = parseInt(document.getElementById('initialBalance').value);
    
    // 计算差值
    const difference = newInitialBalance - oldInitialBalance;
    
    // 如果差值不为0（有变化），给所有现有用户的余额加上差值（差值为负时就是减少）
    if (difference !== 0) {
        // 遍历所有用户
        users.forEach(user => {
            user.balance += difference;
        });
        
        // 更新localStorage中的用户数据
        localStorage.setItem('users', JSON.stringify(users));
        
        // 更新当前用户的余额显示
        if (currentUser) {
            // 重新获取当前用户的最新数据
            const updatedUser = users.find(user => user.username === currentUser.username);
            if (updatedUser) {
                currentUser = updatedUser;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        }
    }
    
    // 保存新的初始资金到localStorage
    localStorage.setItem('initialBalance', newInitialBalance);
    
    // 刷新用户列表，显示最新的余额
    refreshUsersList();
    
    // 显示成功提示
    if (difference > 0) {
        alert(`初始资金已从 ${oldInitialBalance} 上调至 ${newInitialBalance}，所有玩家余额增加 ${difference} 元`);
    } else if (difference < 0) {
        // 差值为负，取绝对值显示
        const absDifference = Math.abs(difference);
        alert(`初始资金已从 ${oldInitialBalance} 下调至 ${newInitialBalance}，所有玩家余额减少 ${absDifference} 元`);
    } else {
        alert(`初始资金已保存为 ${newInitialBalance} 元`);
    }
}

// 保存负债上限
function saveDebtLimit() {
    // 检查管理员权限
    if (!currentUser || !currentUser.admin) {
        alert(langResources[currentLang].adminOnly);
        showLoginPage();
        return;
    }
    
    const debtLimit = document.getElementById('debtLimit').value;
    localStorage.setItem('debtLimit', debtLimit);
    alert(langResources[currentLang].debtLimitSaved);
}

// 重置所有用户余额
function resetBalances() {
    // 检查管理员权限
    if (!currentUser || !currentUser.admin) {
        alert(langResources[currentLang].adminOnly);
        showLoginPage();
        return;
    }
    
    // 获取当前设置的初始资金
    const currentInitialBalance = parseInt(document.getElementById('initialBalance').value) || 20;
    
    // 确认操作 - 只有点击确认才会执行后续操作
    const isConfirmed = confirm(langResources[currentLang].confirm + ' ' + langResources[currentLang].resetBalances + ' ' + currentInitialBalance + '元？');
    
    // 只有在用户点击确认之后才执行重置操作
    if (isConfirmed) {
        // 遍历所有用户，重置余额
        users.forEach(user => {
            user.balance = currentInitialBalance;
        });
        
        // 更新localStorage中的用户数据
        localStorage.setItem('users', JSON.stringify(users));
        
        // 更新当前用户的余额（如果当前用户是普通玩家）
        if (currentUser) {
            // 重新获取当前用户的最新数据
            const updatedUser = users.find(user => user.username === currentUser.username);
            if (updatedUser) {
                currentUser = updatedUser;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        }
        
        // 刷新用户列表
        refreshUsersList();
        
        // 显示成功提示
        alert(langResources[currentLang].balancesReset.replace('X', currentInitialBalance));
    } else {
        // 用户取消了操作
        alert(langResources[currentLang].resetCancelled);
    }
}

// 检查登录状态
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        
        // 确保管理员账号有正确的admin属性
        if (currentUser.username === 'XuChen') {
            currentUser.admin = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        showGamePage();
    }
}

// 用户注册
async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert(langResources[currentLang].pleaseEnter);
        return;
    }
    
    try {
        // 发送注册请求到后端
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            // 注册成功，获取用户数据
            const newUser = await response.json();
            
            // 更新本地用户列表
            await fetchUsers();
            
            // 自动登录
            currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // 显示游戏页面
            showGamePage();
        } else {
            // 注册失败，显示错误信息
            const errorData = await response.json();
            alert(errorData.error || '注册失败');
        }
    } catch (error) {
        console.error('注册失败:', error);
        alert('注册失败，请稍后重试');
    }
}

// 用户登录
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert(langResources[currentLang].pleaseEnter);
        return;
    }
    
    try {
        // 发送登录请求到后端
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            // 登录成功，获取用户数据
            const user = await response.json();
            
            // 更新本地用户列表
            await fetchUsers();
            
            // 保存登录状态
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // 显示游戏页面
            showGamePage();
        } else {
            // 登录失败，显示错误信息
            const errorData = await response.json();
            alert(errorData.error || '登录失败');
        }
    } catch (error) {
        console.error('登录失败:', error);
        alert('登录失败，请稍后重试');
    }
}

// 用户登出
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showLoginPage();
}

// 显示登录页面
function showLoginPage() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('gamePage').classList.remove('active');
    document.getElementById('bankruptcyPage').classList.remove('active');
    document.getElementById('adminPage').classList.remove('active');
    
    // 清空输入框
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// 显示游戏页面
function showGamePage() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('gamePage').classList.add('active');
    document.getElementById('bankruptcyPage').classList.remove('active');
    document.getElementById('adminPage').classList.remove('active');
    
    // 更新页面数据
    updateGamePage();
    
    // 显示教育提示（首次游戏）
    if (currentUser.totalGames === 0) {
        showEducationModal('欢迎！每局成本5元，平均回报1.6元，期望损失3.4元');
    }
}

// 显示破产分析页面
function showBankruptcyPage() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('gamePage').classList.remove('active');
    document.getElementById('bankruptcyPage').classList.add('active');
    document.getElementById('adminPage').classList.remove('active');
    
    // 更新破产报告
    updateBankruptcyReport();
}

// 更新游戏页面
async function updateGamePage() {
    // 更新用户名
    document.getElementById('currentUsername').textContent = currentUser.username;
    
    // 显示/隐藏管理员按钮 - 确保管理员账号始终显示管理按钮
    const adminBtn = document.getElementById('adminBtn');
    if (currentUser.username === 'XuChen' || currentUser.admin) {
        adminBtn.style.display = 'inline-block';
    } else {
        adminBtn.style.display = 'none';
    }
    
    // 更新余额显示
    updateBalanceDisplay();
    
    // 更新统计数据
    updateStats();
    
    // 更新财富榜
    await updateLeaderboard();
    
    // 更新用户排名
    await updateUserRank();
}

// 更新余额显示
function updateBalanceDisplay() {
    const balanceElement = document.getElementById('balance');
    const statsBalanceElement = document.getElementById('statsBalance');
    const balance = currentUser.balance;
    
    // 移除所有类
    balanceElement.className = 'balance';
    statsBalanceElement.className = 'value';
    
    // 添加相应的类
    if (balance > 0) {
        balanceElement.classList.add('positive');
        statsBalanceElement.classList.add('positive');
    } else if (balance === 0) {
        balanceElement.classList.add('zero');
        statsBalanceElement.classList.add('zero');
    } else {
        balanceElement.classList.add('negative');
        statsBalanceElement.classList.add('negative');
        if (Math.abs(balance) > 50) {
            balanceElement.classList.add('large');
            statsBalanceElement.classList.add('large');
        }
    }
    
    // 更新余额文本
    balanceElement.textContent = balance + '元';
    statsBalanceElement.textContent = balance + '元';
}

// 更新统计数据
function updateStats() {
    document.getElementById('totalGames').textContent = currentUser.totalGames + '局';
    document.getElementById('totalInput').textContent = currentUser.totalInput + '元';
    document.getElementById('totalPrize').textContent = currentUser.totalPrize + '元';
    document.getElementById('netProfit').textContent = currentUser.netProfit + '元';
    document.getElementById('winRate').textContent = currentUser.winRate + '%';
    document.getElementById('maxDebt').textContent = currentUser.maxDebt + '元';
    document.getElementById('debtStartGame').textContent = currentUser.debtStartGame || '-';
    document.getElementById('debtDuration').textContent = currentUser.debtDuration + '局';
}

// 开始游戏
function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    const startBtn = document.getElementById('startGameBtn');
    startBtn.disabled = true;
    startBtn.textContent = '游戏进行中...';
    
    // 扣除5元成本
    currentUser.balance -= 5;
    currentUser.totalInput += 5;
    
    // 更新连续游戏次数
    currentUser.consecutiveGames++;
    
    // 旋转转盘
    spinWheels();
    
    // 显示连续游戏提示
    if (currentUser.consecutiveGames === 10) {
        showEducationModal('您已连续游戏10局。赌博成瘾往往从"再玩一局"开始');
    }
}

// 旋转转盘
function spinWheels() {
    const wheels = [
        document.getElementById('wheel1'),
        document.getElementById('wheel2'),
        document.getElementById('wheel3')
    ];
    
    // 添加旋转动画
    wheels.forEach(wheel => {
        wheel.classList.add('spinning');
    });
    
    // 生成随机结果
    const results = [
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol()
    ];
    
    // 设置延迟停止转盘
    setTimeout(() => {
        stopWheel(wheels[0], results[0], 0);
    }, 1000);
    
    setTimeout(() => {
        stopWheel(wheels[1], results[1], 1);
    }, 2000);
    
    setTimeout(() => {
        stopWheel(wheels[2], results[2], 2, results);
    }, 3000);
}

// 停止转盘
function stopWheel(wheel, symbol, index, allResults = []) {
    wheel.classList.remove('spinning');
    wheel.innerHTML = `<div class="symbol">${symbol}</div>`;
    
    // 如果是最后一个转盘，计算结果
    if (index === 2) {
        setTimeout(() => {
            calculateResult(allResults);
        }, 500);
    }
}

// 获取随机图案
function getRandomSymbol() {
    const r = Math.random();
    if (r < 0.25) return SYMBOLS[0]; // ❌ 25%
    if (r < 0.3333) return SYMBOLS[1]; // 7️⃣ 8.33%
    if (r < 0.5) return SYMBOLS[2]; // 💰 16.67%
    if (r < 0.6667) return SYMBOLS[3]; // 🍒 16.67%
    if (r < 0.8333) return SYMBOLS[4]; // ⭐ 16.67%
    return SYMBOLS[5]; // 🍀 16.67%
}

// 计算游戏结果
async function calculateResult(results) {
    let prize = 0;
    
    // 检查任意图案为❌
    if (results.includes('❌')) {
        prize = 0;
        // 第一次出现❌时显示提示
        if (!currentUser.hasSeenSkull) {
            showEducationModal('这就是57.81%的直接归零概率，庄家主要利润来源');
            currentUser.hasSeenSkull = true;
        }
    } 
    // 检查三个7️⃣
    else if (results[0] === '7️⃣' && results[1] === '7️⃣' && results[2] === '7️⃣') {
        prize = 50;
    } 
    // 检查三个相同非7️⃣
    else if (results[0] === results[1] && results[1] === results[2]) {
        prize = 16;
    } 
    // 检查两个7️⃣
    else if (results.filter(symbol => symbol === '7️⃣').length === 2) {
        prize = 8;
    } 
    // 其他情况
    else {
        prize = 3;
    }
    
    // 更新余额
    currentUser.balance += prize;
    currentUser.totalPrize += prize;
    currentUser.totalGames++;
    
    // 更新净收益
    currentUser.netProfit = currentUser.balance - 20;
    
    // 更新胜率
    const wins = currentUser.gameHistory.filter(game => game.prize > 0).length + (prize > 0 ? 1 : 0);
    currentUser.winRate = Math.round((wins / currentUser.totalGames) * 100);
    
    // 更新最大负债
    if (currentUser.balance < currentUser.maxDebt) {
        currentUser.maxDebt = currentUser.balance;
    }
    
    // 更新负债相关数据
    updateDebtData();
    
    // 保存游戏历史
    const gameRecord = {
        results: results,
        prize: prize,
        balance: currentUser.balance,
        timestamp: Date.now()
    };
    currentUser.gameHistory.push(gameRecord);
    
    // 更新游戏历史
    gameHistory.push({
        username: currentUser.username,
        ...gameRecord
    });
    
    // 保存游戏历史到后端
    await saveGameHistory({
        username: currentUser.username,
        results: results,
        prize: prize,
        balance: currentUser.balance
    });
    
    // 保存数据到后端
    await saveData();
    
    // 更新游戏页面
    updateGamePage();
    
    // 检查是否触发破产条件
    checkBankruptcyCondition();
    
    // 重置游戏状态
    isGameRunning = false;
    const startBtn = document.getElementById('startGameBtn');
    startBtn.disabled = false;
    startBtn.textContent = '开始游戏';
}

// 更新负债相关数据
function updateDebtData() {
    // 首次负债
    if (currentUser.balance < 0 && currentUser.debtStartGame === null) {
        currentUser.debtStartGame = currentUser.totalGames;
        showEducationModal('您已开始负债。真实赌博中，很多人因此借钱继续赌');
    }
    
    // 负债超过-50元
    if (currentUser.balance < -50 && !currentUser.hasSeenHighDebt) {
        showEducationModal('债务积累中。数学上，每多玩一局平均多亏3.4元');
        currentUser.hasSeenHighDebt = true;
    }
    
    // 更新负债持续局数
    if (currentUser.balance < 0) {
        currentUser.debtDuration = currentUser.totalGames - currentUser.debtStartGame + 1;
    } else {
        currentUser.debtDuration = 0;
    }
}

// 检查破产条件
function checkBankruptcyCondition() {
    // 获取保存的负债上限，默认为-100
    const debtLimit = parseInt(localStorage.getItem('debtLimit')) || -100;
    
    if (currentUser.balance <= debtLimit || currentUser.consecutiveGames >= 50) {
        showBankruptcyPage();
    }
}

// 计算期望值
function calculateExpectedValue() {
    const gameCount = parseInt(document.getElementById('gameCount').value);
    if (isNaN(gameCount) || gameCount <= 0) {
        alert(langResources[currentLang].pleaseEnter);
        return;
    }
    
    const expectedLoss = gameCount * 3.4;
    document.getElementById('expectedResult').textContent = langResources[currentLang].expectedResult + expectedLoss.toFixed(1) + '元';
}

// 更新财富榜预览
async function updateLeaderboardPreview() {
    const leaderboardPreview = document.getElementById('leaderboardPreview');
    
    // 从后端获取排行榜数据
    const leaderboardData = await fetchLeaderboard();
    
    // 只显示前3名
    const topUsers = leaderboardData.slice(0, 3);
    
    // 清空列表
    leaderboardPreview.innerHTML = '';
    
    // 添加用户
    topUsers.forEach((user, index) => {
        const userDiv = document.createElement('div');
        userDiv.textContent = `${index + 1}. ${user.username}: ${user.balance}元`;
        leaderboardPreview.appendChild(userDiv);
    });
}

// 更新财富榜
async function updateLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    
    // 从后端获取排行榜数据
    const leaderboardData = await fetchLeaderboard();
    
    // 只显示前50名
    const topUsers = leaderboardData.slice(0, 50);
    
    // 清空列表
    leaderboard.innerHTML = '';
    
    // 添加用户
    topUsers.forEach((user, index) => {
        const userDiv = document.createElement('div');
        userDiv.textContent = `${index + 1}. ${user.username}: ${user.balance}元`;
        leaderboard.appendChild(userDiv);
    });
}

// 更新用户排名
async function updateUserRank() {
    // 从后端获取排行榜数据
    const leaderboardData = await fetchLeaderboard();
    
    // 查找当前用户的排名
    const rank = leaderboardData.findIndex(user => user.username === currentUser.username) + 1;
    
    // 更新排名显示
    const resources = langResources[currentLang];
    const rankPrefix = currentLang === 'zh' ? `你的排名：第${rank}名` : `Your Rank: ${rank}`;
    document.getElementById('userRank').textContent = `${rankPrefix} (${currentUser.balance}元)`;
}

// 更新破产报告
function updateBankruptcyReport() {
    document.getElementById('summaryInitial').textContent = '20元';
    document.getElementById('summaryFinal').textContent = currentUser.balance + '元';
    document.getElementById('summaryLoss').textContent = (20 - currentUser.balance) + '元';
    document.getElementById('summaryAvgLoss').textContent = (3.4).toFixed(1) + '元';
}

// 重启游戏
function restartGame() {
    // 重置用户数据
    currentUser.balance = 20;
    currentUser.totalGames = 0;
    currentUser.totalInput = 0;
    currentUser.totalPrize = 0;
    currentUser.netProfit = 0;
    currentUser.winRate = 0;
    currentUser.maxDebt = 0;
    currentUser.debtStartGame = null;
    currentUser.debtDuration = 0;
    currentUser.consecutiveGames = 0;
    currentUser.gameHistory = [];
    currentUser.hasSeenSkull = false;
    currentUser.hasSeenHighDebt = false;
    
    // 保存数据
    saveData();
    
    // 返回游戏页面
    showGamePage();
}

// 返回游戏
function returnToGame() {
    currentUser.consecutiveGames = 0;
    saveData();
    showGamePage();
}

// 显示教育提示
function showEducationModal(message) {
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('educationModal').classList.add('show');
}

// 关闭教育提示
function closeModal() {
    document.getElementById('educationModal').classList.remove('show');
}

// 保存数据到本地存储
// 从后端获取用户列表
async function fetchUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (response.ok) {
            users = await response.json();
        }
    } catch (error) {
        console.error('获取用户列表失败:', error);
    }
}

// 从后端获取排行榜数据
async function fetchLeaderboard() {
    try {
        const response = await fetch(`${API_URL}/leaderboard`);
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error('获取排行榜失败:', error);
        return [];
    }
}

// 保存用户数据到后端
async function saveUserData(user) {
    try {
        const response = await fetch(`${API_URL}/user/${user.username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (response.ok) {
            return await response.json();
        }
        throw new Error('保存用户数据失败');
    } catch (error) {
        console.error('保存用户数据失败:', error);
    }
}

// 保存游戏历史到后端
async function saveGameHistory(gameData) {
    try {
        const response = await fetch(`${API_URL}/game-history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        });
        return response.ok;
    } catch (error) {
        console.error('保存游戏历史失败:', error);
        return false;
    }
}

async function saveData() {
    // 更新用户列表中的当前用户数据
    const userIndex = users.findIndex(user => user.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
    }
    
    // 保存到本地存储（作为备份）
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    
    // 保存到后端
    await saveUserData(currentUser);
    
    // 实时更新游戏页面显示，确保数据同步
    updateGamePage();
}

// 初始化
window.addEventListener('DOMContentLoaded', init);
