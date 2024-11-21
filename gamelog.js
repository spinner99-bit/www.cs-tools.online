const tableData = [];

    document.addEventListener('contextmenu', event => event.preventDefault());

    document.addEventListener('keydown', function (e) {
        if (e.keyCode == 123) { // F12
            e.preventDefault();
        }
    });
    
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
                <button class="logout-btn" onclick="logout()"><i class="fa-solid fa-right-from-bracket"></i></button>
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

    function toggleScheduleInput(value) {
        // 显示或隐藏日期选择输入框
        const scheduleInput = document.getElementById('scheduleInput');
        scheduleInput.style.display = value === 'Schedule' ? 'block' : 'none';
    }
    
    function generateGameLog() {
        const gameSelect = document.getElementById('gameSelect');
        const game = gameSelect.value;
        const timeSelect = document.getElementById('timeSelect').value;
    
        // 检查 gameSelect 是否为空
        if (!game) {
            alert('Please select a game to generate.');
            gameSelect.focus(); // 将焦点设置到 gameSelect
            return;
        }
    
        let currentTime;
        if (timeSelect === 'Current') {
            currentTime = new Date(); // 使用当前时间
        } else {
            const scheduleInput = document.getElementById('scheduleInput');
            const scheduledDateTime = new Date(scheduleInput.value);
    
            if (!isNaN(scheduledDateTime)) {
                currentTime = scheduledDateTime; // 使用用户选择的时间
            } else {
                alert('Please select a valid date and time.');
                return;
            }
        }
    
        // 增加随机 55 到 129 秒
        const randomSeconds = Math.floor(Math.random() * (60 - 3 + 1)) + 55;
        currentTime.setSeconds(currentTime.getSeconds() + randomSeconds);
    
        // 调用 loadGameLog 函数，并传入 game 和修改后的 currentTime
        loadGameLog(game, currentTime);
    }

    function loadGameLog(game, currentTime) {
        // 显示加载指示器，隐藏游戏日志
        document.getElementById('loading').style.display = 'block';
        document.getElementById('gameLog').innerHTML = ''; // 清空表格内容
        document.getElementById('gameTable').style.display = 'none'; // 隐藏表格

        // 获取 Google Apps Script 链接
        const SHEET_URLS = {
            '918Kiss': 'https://script.google.com/macros/s/AKfycbxu-MlfcsiIC8l44C3cV9nxPJgufvHbW665QXI5Gu_oYpbFz5_zl-VvM6JzRa0wh8pt/exec',
            'Mega888': 'https://script.google.com/macros/s/AKfycbwvOmn9S5jpU7_Y6kMKDFctuwnU6B03WQMvHrCZGnU291vNrwp5oA3eqNfEotOzeMnBFQ/exec',
            'Pussy888': 'https://script.google.com/macros/s/AKfycbz-6F1XhUEmJGwco4LurZ0_Z9wg_mIl5tc9XWzuCzZxGn81bNxRh_YucJjFSj954Qo4/exec',
            '918Kaya': 'https://script.google.com/macros/s/AKfycbxso1F4RJSuXkqZ15GzXoHjGaqohmBpFZoO6Rj-AyacgmKh3m9GBbKFptkxnyzhQHQl/exec',
            'Xe88': 'https://script.google.com/macros/s/AKfycbw6jv_N1JlQw8aT7_6PE7334mmjvrq3Q9WzwQX0qiWr0ro7znFzTUKGfLCXW0J_Qqc2/exec',
            'Evo888': 'https://script.google.com/macros/s/AKfycbzx2k5ux6NwZsy8j0jgxCmR-0unk7nDpD2KyEuAL5HAUTakWj9YmtMXQ9WPoGwOeJ5edg/exec'
        };
    
        // 通过游戏的URL从数据源获取数据
        fetch(SHEET_URLS[game])
            .then(response => response.json())
            .then(data => {
                const gameName = data.gameName; // 获取游戏名称
                const row1Bet = parseFloat(data.bet); // 获取并转换第一行的投注金额
                const row1Win = `0.00`

                // 随机生成开始资金
                let randomBeginMoney;
                if (Math.random() < 0.1) {
                    // 10%概率生成2000到5000之间的随机金额
                    randomBeginMoney = (Math.random() * (20000 - 4000) + 4000).toFixed(2);
                } else {
                    // 90%概率生成500到2000之间的随机金额
                    randomBeginMoney = (Math.random() * (4000 - 500) + 500).toFixed(2);
                }

                // 第一行数据构造
                const row1 = {
                    gameName: gameName, // 游戏名称
                    tableID: 0, // 表格ID
                    bet: row1Bet.toFixed(2), // 投注金额
                    win: row1Win, // 赢利金额
                    beginMoney: randomBeginMoney, // 开始资金
                    endMoney: (parseFloat(randomBeginMoney) - row1Bet + parseFloat(row1Win)).toFixed(2), // 结束资金 = 开始资金 - 投注 + 赢利
                    dateTime: currentTime // 当前时间
                };

                // 清空并添加第一行数据
                tableData.length = 0;
                tableData.push(row1);

                // 设定总行数（不包括第一行）
                const totalRows = 11;
                // 随机生成3到5之间的数字表示赢家行数
                const randomRowsCount = Math.floor(Math.random() * 3) + 3;
                const winningRows = new Set(); // 用Set确保不重复选择中奖行

                // 随机选择赢家行
                while (winningRows.size < randomRowsCount) {
                    winningRows.add(Math.floor(Math.random() * totalRows));
                }

                // 生成后续的数据行
                for (let i = 1; i <= totalRows; i++) {
                    const previousRow = tableData[i - 1]; // 获取上一行数据
                    const bet = previousRow.bet; // 当前行投注金额
                    const beginMoney = previousRow.endMoney; // 当前行开始资金为上一行的结束资金

                    let win;
                    // 如果当前行是赢家行，生成随机的赢利金额
                    if (winningRows.has(i - 1)) {
                        win = (bet * (Math.random() * 10 + 0)).toFixed(2);
                        // win = Math.max((bet * (Math.random() * 10)), 0.10).toFixed(2);
                    } else {
                        win = "0.00"; // 否则赢利为0
                    }

                    // 计算当前行的结束资金
                    const endMoney = (parseFloat(beginMoney) - parseFloat(bet) + parseFloat(win)).toFixed(2);
                    const timeDifference = Math.floor(Math.random() * 5) + 3; // 随机生成3到7秒之间的时间差
                    const dateTime = new Date(previousRow.dateTime.getTime() + timeDifference * 1000); // 计算当前行的时间

                    // 当前行数据构造
                    const row = {
                        gameName: previousRow.gameName,
                        tableID: 0,
                        bet: bet,
                        win: win,
                        beginMoney: beginMoney,
                        endMoney: endMoney,
                        dateTime: dateTime
                    };

                    // 添加当前行数据
                    tableData.push(row);
                }

                // 最后一行数据处理
                const lastRow = tableData[tableData.length - 1];
                const scoreWithoutDecimal = Math.floor(lastRow.endMoney); // 取最后一行结束资金的整数部分作为得分
                const beginMoneyForRow13 = lastRow.endMoney; // 最后一行结束资金为第13行的开始资金
                const row13DateTime = new Date(lastRow.dateTime.getTime() + (Math.random() * (30 - 2) + 2) * 60000); // 生成一个随机的时间，表示第13行时间

                // 第13行数据构造
                const row13 = {
                    gameName: '-', // 游戏名称留空
                    tableID: `Set score：-${scoreWithoutDecimal}.00`, // 设置得分为最后一行的整数部分
                    bet: '-', // 不涉及投注金额
                    win: '-', // 不涉及赢利金额
                    beginMoney: beginMoneyForRow13, // 使用最后一行的结束资金作为开始资金
                    endMoney: (parseFloat(beginMoneyForRow13) - Math.floor(parseFloat(lastRow.endMoney))).toFixed(2), // 结束资金为开始资金减去整数部分的结束金额
                    dateTime: row13DateTime // 使用生成的时间
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
                
                // 保存 scoreWithoutDecimal 和 row13 的 dateTime 到 localStorage
                localStorage.setItem('scoreWithoutDecimal', scoreWithoutDecimal);
                localStorage.setItem('row13DateTime', row13DateTime.toISOString());
    
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
    

document.addEventListener('DOMContentLoaded', function() {
    // 在页面加载时确保 loading2 隐藏，resitContainer 也开始隐藏
    document.getElementById('loading2').style.display = 'none';
    document.getElementById('resitContainer').style.display = 'none';
});

document.getElementById('generateButton').addEventListener('click', function () {
    const selectedResitType = document.getElementById('resitTypeSelect').value;
    const resitContainer = document.getElementById('resitContainer');
    const loadingElement = document.getElementById('loading2');

    // 检查 resitTypeSelect 是否为空
    if (!selectedResitType) {
        alert('Please select a resit type to generate.');
        document.getElementById('resitTypeSelect').focus(); // 将焦点设置到 resitTypeSelect
        return;
    }

    resitContainer.innerHTML = ''; // 清空当前内容

    // 显示加载动画，隐藏 resitContainer
    loadingElement.style.display = 'block';
    resitContainer.style.display = 'none';

    if (selectedResitType === 'MBB 1') {
        // 生成 MAYBANK TO MAYBANK 和 MAYBANK TO OTHER BANK 的 HTML 内容
        const resitHTML = `
            <div class="resit-type-name">
                <h1>MAYBANK TO MAYBANK</h1>
            </div>
            <div class="content-mbb1">
                <div class="mbb-top-green">
                    <div class="mbb-top-left">
                        <div><div class="mbb-tick"><i class='bx bx-check'></i></div></div>
                        <div>
                            <div class="mbbName">Transfer To<span class="mbb-name" id="rst-name-1">0</span></div>
                            <span class="mbb-acc" id="rst-account1">0</span><br>
                            <span class="mbb-amount" id="rst-amount-1">0</span>
                        </div>
                    </div>
                    <img src="Element/mbb-add-favourite.png" class="mbb-add-favourite">
                </div>
                <div class="mbb-detail-cover">
                    <div class="mbb-per-detail"><label>Recipient's bank</label><span>Maybank / Maybank Islamic</span></div>
                    <div class="mbb-per-detail"><label>Effective date</label><span id="rst-Date-1">0</span></div>
                    <div class="mbb-per-detail"><label>Recipient's Reference</label><input type="text" value="payment"></div>
                    <div class="mbb-per-detail"><label>Status</label><span>Successful</span></div>
                    <div class="mbb-per-detail"><label>Reference ID</label><span id="rst-reference-1">0</span></div>
                </div>
                <div class="mbb-bottom-detail">
                    <label>Total Amount</label><span id="rst-amount-2">0</span>
                </div>
            </div>

            <div class="resit-type-name">
                <h1>MAYBANK TO OTHER BANK</h1>
            </div>
            <div class="content-mbb1">
                <div class="mbb-top-green">
                    <div class="mbb-top-left">
                        <div><div class="mbb-tick"><i class='bx bx-check'></i></div></div>
                        <div>
                            <div class="mbbName">Transfer To<span class="mbb-name" id="rst-name-2">0</span></div>
                            <span class="mbb-acc" id="rst-account2">0</span><br>
                            <span class="mbb-amount" id="rst-amount-3">0</span>
                        </div>
                    </div>
                    <img src="Element/mbb-add-favourite.png" class="mbb-add-favourite">
                </div>
                <div class="mbb-detail-cover">
                    <div class="mbb-per-detail"><label>Recipient's bank</label><span id="rst-bank-2"  class="mbbBankName">0</span></div>
                    <div class="mbb-per-detail"><label>Transaction Type</label><span>Funds Transfer</span></div>
                    <div class="mbb-per-detail"><label>Transfer Mode</label><span>DuitNow Transfer</span></div>
                    <div class="mbb-per-detail"><label>Effective date</label><span id="rst-Date-2">0</span></div>
                    <div class="mbb-per-detail"><label>Recipient's Reference</label><input type="text" value="payment"></div>
                    <div class="mbb-per-detail"><label>Status</label><span>Successful</span></div>
                    <div class="mbb-per-detail"><label>Reference ID</label><span id="rst-reference-2">0</span></div>
                </div>
                <div class="mbb-bottom-detail">
                    <label>Total Amount</label><span id="rst-amount-4">0</span>
                </div>
            </div>
        `;
        resitContainer.innerHTML = resitHTML;

        // 获取数据并填充内容
        fetchDataAndFill();
    }
});

function formatCurrency(amount) {
    const formattedAmount = parseFloat(amount).toFixed(2);
    return 'RM ' + formattedAmount.replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function fetchDataAndFill() {
    fetch('https://script.google.com/macros/s/AKfycbx7i8p2CoKTT6whGIb81cXhxrEQCDoQnmvuf8D9AsEljhRqm-pGSoUSmTxbZ9kRP-CL2g/exec')
        .then(response => response.json())
        .then(data => {
            const names = data.names;
            let accountE = data.accountE;
            let accountH = data.accountH;
            const banks = data.banks;

            accountE = accountE.filter(account => account && account !== 'Account Number');
            accountH = accountH.filter(account => account && account !== 'Account Number');

            const randomName1 = names[Math.floor(Math.random() * names.length)];
            const randomAccount1 = accountE[Math.floor(Math.random() * accountE.length)];
            const randomName2 = names[Math.floor(Math.random() * names.length)];
            const randomAccount2 = accountH[Math.floor(Math.random() * accountH.length)];

            const validBanks = banks.filter(bank => bank && bank !== ''); // 过滤空值和无效数据
            const bank2 = validBanks.length > 0 ? validBanks[Math.floor(Math.random() * validBanks.length)] : 'No Bank Info';
            
            const randomReferences = Array.from({ length: 10 }, () => Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000);

            const scoreWithoutDecimal = localStorage.getItem('scoreWithoutDecimal') || 1000;
            const formattedAmount = formatCurrency(scoreWithoutDecimal);

            // 获取并格式化 row13DateTime
            const row13DateTime = localStorage.getItem('row13DateTime');
            const formattedDateTime = row13DateTime ? new Date(row13DateTime).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : 'No Date';

            document.getElementById('rst-name-1').textContent = randomName1;
            document.getElementById('rst-account1').textContent = randomAccount1 || 'N/A';
            document.getElementById('rst-amount-1').textContent = formattedAmount;
            document.getElementById('rst-reference-1').textContent = randomReferences[0];
            document.getElementById('rst-Date-1').textContent = `Today ${formattedDateTime}`;

            document.getElementById('rst-name-2').textContent = randomName2;
            document.getElementById('rst-account2').textContent = randomAccount2;
            document.getElementById('rst-amount-2').textContent = formattedAmount;
            document.getElementById('rst-reference-2').textContent = randomReferences[1];
            document.getElementById('rst-Date-2').textContent = `Today ${formattedDateTime}`;

            document.getElementById('rst-bank-2').textContent = bank2;
            document.getElementById('rst-amount-3').textContent = formattedAmount;
            document.getElementById('rst-amount-4').textContent = formattedAmount;

            // 隐藏加载动画并显示 resitContainer
            document.getElementById('loading2').style.display = 'none';
            document.getElementById('resitContainer').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('loading2').style.display = 'none';
        });
}

    // 页面加载时，自动检查登录状态并加载游戏列表
    window.onload = function() {
        checkLoginStatus();
    };

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
