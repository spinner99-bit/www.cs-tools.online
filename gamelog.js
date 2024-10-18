const tableData = [];
    
    // 检查用户登录状态
    function checkLoginStatus() {
        const username = localStorage.getItem('username');
        const headerDiv = document.getElementById('header');

        if (!username) {
            // 如果未登录，跳转到 login.html
            window.location.href = 'login.html';
        } else {
            // 如果已登录，显示欢迎信息和登出按钮
            const welcomeMessage = `Welcome, ${username}`;
            headerDiv.innerHTML = `
                <div class="welcome-message">${welcomeMessage}</div>
                <button class="logout-btn" onclick="logout()"><i class='bx bx-log-out-circle'></i></button>
            `;
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        const currentPath = window.location.pathname;

        // 检查路径是否以 .html 结尾
        if (currentPath.endsWith('.html')) {
            const newPath = currentPath.slice(0, -5);
            history.replaceState(null, '', newPath);
        }

        // 判断用户是否为 admin
        const loggedInUser = localStorage.getItem("username"); // 假设存储了用户名
        if (loggedInUser === "admin") {
            document.getElementById("avatarMenu").style.display = "block";
        } else {
            document.getElementById("avatarMenu").style.display = "none";
        }
    });

    // 退出登录功能
    function logout() {
        // 清除登录信息
        localStorage.removeItem('username');
        localStorage.removeItem('fullName');
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('option1');
        localStorage.removeItem('number2');
        localStorage.removeItem('option2');

        // 跳转回登录页面
        window.location.href = 'login.html';
    }

    function loadGameLog(game, button) {
        // 显示加载指示器，隐藏游戏日志
        document.getElementById('loading').style.display = 'block';
        document.getElementById('gameLog').innerHTML = ''; // 清空表格内容
        document.getElementById('gameTable').style.display = 'none'; // 隐藏表格
        
        // 重置所有按钮的颜色
        const buttons = document.querySelectorAll('.game-button');
        buttons.forEach(btn => {
            btn.classList.remove('selected'); // 移除选择样式
        });
        
        // 设置被点击的按钮为选中状态
        button.classList.add('selected');
    
        // 根据游戏名称获取对应的 Google Apps Script 链接
        const SHEET_URLS = {
            '918Kiss': 'https://script.google.com/macros/s/AKfycbxu-MlfcsiIC8l44C3cV9nxPJgufvHbW665QXI5Gu_oYpbFz5_zl-VvM6JzRa0wh8pt/exec',
            'Mega888': 'https://script.google.com/macros/s/AKfycbwvOmn9S5jpU7_Y6kMKDFctuwnU6B03WQMvHrCZGnU291vNrwp5oA3eqNfEotOzeMnBFQ/exec',
            'Pussy888': 'https://script.google.com/macros/s/AKfycbz-6F1XhUEmJGwco4LurZ0_Z9wg_mIl5tc9XWzuCzZxGn81bNxRh_YucJjFSj954Qo4/exec',
            '918Kaya': 'https://script.google.com/macros/s/AKfycbxso1F4RJSuXkqZ15GzXoHjGaqohmBpFZoO6Rj-AyacgmKh3m9GBbKFptkxnyzhQHQl/exec',
            'Xe88': 'https://script.google.com/macros/s/AKfycbw6jv_N1JlQw8aT7_6PE7334mmjvrq3Q9WzwQX0qiWr0ro7znFzTUKGfLCXW0J_Qqc2/exec',
            'Evo888': 'https://script.google.com/macros/s/AKfycbzx2k5ux6NwZsy8j0jgxCmR-0unk7nDpD2KyEuAL5HAUTakWj9YmtMXQ9WPoGwOeJ5edg/exec'
        };
    
        fetch(SHEET_URLS[game])
            .then(response => response.json())
            .then(data => {
                const gameName = data.gameName;
                const row1Bet = parseFloat(data.bet); // 获取 Bet 值
                const row1Win = (row1Bet * (Math.random() * 50 + 1)).toFixed(2); // random number between 1 to 50
                
                let randomBeginMoney;
                if (Math.random() < 0.1) {
                    randomBeginMoney = (Math.random() * (5000 - 2000) + 2000).toFixed(2); // 2000 到 5000
                } else {
                    randomBeginMoney = (Math.random() * (2000 - 500) + 500).toFixed(2); // 500 到 2000
                }
    
                const currentTime = new Date(); // 获取当前时间
    
                const row1 = {
                    gameName: gameName,
                    tableID: 0,
                    bet: row1Bet.toFixed(2),
                    win: row1Win,
                    beginMoney: randomBeginMoney,
                    endMoney: (parseFloat(randomBeginMoney) - row1Bet + parseFloat(row1Win)).toFixed(2),
                    dateTime: currentTime
                };
                tableData.length = 0; // 清空现有数据
                tableData.push(row1);
    
                const totalRows = 11; // 总行数（不包括第1行）
                const randomRowsCount = Math.floor(Math.random() * 3) + 3; // 随机生成3到5之间的数字
                const winningRows = new Set();
    
                while (winningRows.size < randomRowsCount) {
                    winningRows.add(Math.floor(Math.random() * totalRows));
                }
    
                for (let i = 1; i <= totalRows; i++) {
                    const previousRow = tableData[i - 1];
                    const bet = previousRow.bet;
                    const beginMoney = previousRow.endMoney;
    
                    let win;
                    if (winningRows.has(i - 1)) {
                        win = (bet * (Math.random() * 50 + 1)).toFixed(2);
                    } else {
                        win = "0.00";
                    }
    
                    const endMoney = (parseFloat(beginMoney) - parseFloat(bet) + parseFloat(win)).toFixed(2);
                    const timeDifference = Math.floor(Math.random() * 5) + 3;
                    const dateTime = new Date(previousRow.dateTime.getTime() + timeDifference * 1000);
    
                    const row = {
                        gameName: previousRow.gameName,
                        tableID: 0,
                        bet: bet,
                        win: win,
                        beginMoney: beginMoney,
                        endMoney: endMoney,
                        dateTime: dateTime
                    };
                    tableData.push(row);
                }
    
                const lastRow = tableData[tableData.length - 1];
                const scoreWithoutDecimal = Math.floor(lastRow.endMoney);
                const beginMoneyForRow13 = lastRow.endMoney;
                const row13 = {
                    gameName: '-',
                    tableID: `Set score：-${scoreWithoutDecimal}.00`,
                    bet: '-',
                    win: '-',
                    beginMoney: beginMoneyForRow13,
                    endMoney: (parseFloat(beginMoneyForRow13) - Math.floor(parseFloat(lastRow.endMoney))).toFixed(2),
                    dateTime: new Date(lastRow.dateTime.getTime() + (Math.random() * (30 - 2) + 2) * 60000)
                };
    
                // 给最后一行 TableID 标记红色
                row13.isTableIDRed = true; 
    
                // 如果是 Mega888，给最后一行整体标记红色，并设置 BeginMoney 和 EndMoney 为 '-'
                if (game === 'Mega888') {
                    row13.isRed = true;
                    row13.beginMoney = '-';
                    row13.endMoney = '-';
                }
    
                tableData.push(row13);
                tableData.reverse(); 
    
                function formatDateTime(date) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const seconds = String(date.getSeconds()).padStart(2, '0');
                    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                }
    
                const gameLog = document.getElementById('gameLog');
                const tableHeader = document.getElementById('tableHeader');
                gameLog.innerHTML = '';
                tableHeader.className = `header-${game}`;
                tableData.forEach((row, index) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${row.isRed ? '<span class="red-text">-</span>' : row.gameName}</td>
                        <td>${row.isTableIDRed ? '<span class="red-text">' + row.tableID + '</span>' : row.tableID === 0 ? `<span class="bg-gray">${row.tableID}</span>` : row.tableID}</td>
                        <td>${row.isRed ? '<span class="red-text">-</span>' : row.bet}</td>
                        <td>${row.isRed ? '<span class="red-text">-</span>' : row.win}</td>
                        <td>${row.isRed ? '<span class="red-text">-</span>' : parseFloat(row.beginMoney).toFixed(2)}</td>
                        <td>${row.isRed ? '<span class="red-text">-</span>' : parseFloat(row.endMoney).toFixed(2)}</td>
                        <td>${formatDateTime(row.dateTime)}</td>
                    `;
                    gameLog.appendChild(tr);
                });
    
                document.getElementById('gameTable').style.display = 'table';
                document.getElementById('loading').style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                document.getElementById('loading').style.display = 'none';
            });
    }

// 获取所有按钮和内容容器
const buttons = document.querySelectorAll('.rst-button'); // 修改选择器
const containers = document.querySelectorAll('.content, .content-mbb1'); // 匹配所有内容容器

buttons.forEach(button => {
    button.addEventListener('click', () => {
        // 移除所有按钮的 'active' 类
        buttons.forEach(btn => btn.classList.remove('active'));
        
        // 为点击的按钮添加 'active' 类
        button.classList.add('active');

        // 获取目标容器的 ID
        const target = button.getAttribute('data-target');

        // 隐藏所有内容容器
        containers.forEach(container => {
            container.style.display = 'none';
        });

        // 显示目标容器
        document.getElementById(target).style.display = 'block';
    });
});

// 默认选中第一个按钮
document.querySelector('.rst-button').classList.add('active');
document.getElementById('mbb1-1').style.display = 'block'; // 默认显示第一个内容

    // 页面加载时，自动检查登录状态并加载游戏列表
    window.onload = function() {
        checkLoginStatus();
    };

// 初始化默认游戏日志
loadGameLog('918Kiss', document.querySelector('.game-button')); // 传入初始按钮

    // 控制侧边栏的显示和隐藏
    const menuBtn = document.querySelector('.menuBtnC');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active'); // 点击按钮切换侧边栏显示状态
    });

    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('active'); // 点击关闭按钮隐藏侧边栏
    });