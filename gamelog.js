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
        // const loggedInUser = localStorage.getItem("username"); // 假设存储了用户名
        // if (loggedInUser === "admin") {
            // document.getElementById("avatarMenu").style.display = "block";
        // } else {
            // document.getElementById("avatarMenu").style.display = "none";
        // }
    });

    // 退出登录功能
    function logout() {
        // 清除登录信息
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('company');
        localStorage.removeItem('mbbNo');
        localStorage.removeItem('cimbName');
        localStorage.removeItem('cimbNo');
        localStorage.removeItem('hlbNo');
        localStorage.removeItem('rhbNo');

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
    } else if (selectedResitType === 'CIMB 1') {
                // 生成 CIMB 的 HTML 内容
        const cimbHTML = `
            <div class="cimbFullWrapper" id="cimbContainer">
                <div class="resit-type-name">
                    <h1>CIMB BANK TO CIMB BANK</h1>
                </div>
                <!-- 第一部分 -->
                <div class="cimbPerResit-wrapper">
                    <div class="cimbTopContainer">
                        <div class="cimbTop-leftWrapper">
                            <img src="Element/cimb-tick.png">
                            <span id="cimbSuccessful">Successful</span>
                            <span id="cimbOneRef">0</span>
                        </div>
                        <div>
                            <span class="cimbTop-time" id="cimbOneTime">0</span>
                        </div>
                    </div>
                    <div class="cimbCenterContainer">
                        <div class="cimbCenter-left">
                            <h1>To</h1>
                            <div class="cimbCenter-perRowDetail">
                                <p>Account Number</p>
                                <span id="cimbOneAcc">0</span>
                            </div>
                            <div class="cimbCenter-perRowDetail">
                                <p>Account Name</p>
                                <span id="cimbOneAccName">0</span>
                            </div>
                            <div class="cimbCenter-perRowDetail">
                                <p>Recipient Name</p>
                                <span id="cimbOneName">0</span>
                            </div>
                        </div>
                        <div class="cimbCenter-right cimbAmount-firstOne">
                            <h1>Amount</h1>
                            <div class="cimbCanterRight-rowOne">
                                <p>MYR</p><span id="cimbOneAmount1">0</span><p>00</p>
                            </div>
                            <img src="Element/cimb-charges-cimb.png">
                        </div>
                    </div>
                    <div class="cimbBeforeBottom">
                        <img src="Element/cimb-more-detail.png">
                    </div>
                    <div class="cimbBottomContainer">
                        <div class="cimbBottomContainer-wrapper">
                            <h1>Total</h1>
                            <div class="cimbBottom-Amount">
                                <p>MYR</p><span id="cimbOneAmount2">0</span><p>00</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="resit-type-name">
                    <h1>CIMB BANK TO OTHER BANK</h1>
                </div>
                <!-- 第二部分 -->
                <div class="cimbPerResit-wrapper">
                    <div class="cimbTopContainer">
                        <div class="cimbTop-leftWrapper">
                            <img src="Element/cimb-tick.png">
                            <span id="cimbSuccessful">Successful</span>
                            <span id="cimbTwoRef">0</span>
                        </div>
                        <div>
                            <span class="cimbTop-time" id="cimbTwoTime">0</span>
                        </div>
                    </div>
                    <div class="cimbCenterContainer">
                        <div class="cimbCenter-left">
                            <h1>To</h1>
                            <div class="cimbCenter-perRowDetail">
                                <p>Account Number</p>
                                <span id="cimbTwoAcc">0</span>
                            </div>
                            <div class="cimbCenter-perRowDetail">
                                <p>Recipient Name</p>
                                <span id="cimbTwoName">0</span>
                            </div>
                        </div>
                        <div class="cimbCenter-right cimbAmount-firstOne">
                            <h1>Amount</h1>
                            <div class="cimbCanterRight-rowOne">
                                <p>MYR</p><span id="cimbTwoAmount1">0</span><p>00</p>
                            </div>
                            <img src="Element/cimb-charges.png">
                        </div>
                    </div>
                    <div class="cimbBeforeBottom">
                        <img src="Element/cimb-more-detail.png">
                    </div>
                    <div class="cimbBottomContainer">
                        <div class="cimbBottomContainer-wrapper">
                            <h1>Total</h1>
                            <div class="cimbBottom-Amount">
                                <p>MYR</p><span id="cimbTwoAmount2">0</span><p>00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resitContainer.innerHTML = cimbHTML;

        // 获取数据并填充内容
        fetchDataAndFillCIMB();
    }
});

function formatCurrency(amount) {
    const formattedAmount = parseFloat(amount).toFixed(2);
    return 'RM ' + formattedAmount.replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function fetchDataAndFill() {
    fetch('https://script.google.com/macros/s/AKfycbwc4yBA699DcJ9WYwEahMYl9Ld6GGds5srGtaLY3IaYvzgxJDUPTgDQros7oqiy_DG1aA/exec')
        .then(response => response.json())
        .then(data => {
            const names = data.names;
            let accountE = data.accountE;
            let accountH = data.accountH;
            let banks = data.banks;

            // 过滤掉 accountE, accountH, banks 中的无效数据
            accountE = accountE.filter(account => account && account !== 'Account Number');
            accountH = accountH.filter(account => account && account !== 'Account Number');
            banks = banks.filter(bank => bank && bank !== '');

            // 计算有效数据的条数
            // console.log('Valid accountH count:', accountH.length);
            // console.log('Valid banks count:', banks.length);

            // 保证 accountH 和 banks 的长度一致，取最小长度
            const length = Math.min(accountH.length, banks.length);

            // 确保 accountH 和 banks 的数据一一对应
            const accountBankPairs = [];
            for (let i = 0; i < length; i++) {
                accountBankPairs.push({
                    account: accountH[i],
                    bank: banks[i] || 'No Bank Info'  // 如果没有银行信息，则使用默认值
                });
            }

            const randomName1 = names[Math.floor(Math.random() * names.length)];
            const randomAccount1 = accountE[Math.floor(Math.random() * accountE.length)];
            const randomName2 = names[Math.floor(Math.random() * names.length)];

            // 从配对数组中随机选择一对 account 和 bank
            const randomPair = accountBankPairs[Math.floor(Math.random() * accountBankPairs.length)];
            const randomAccount2 = randomPair.account;
            const bank2 = randomPair.bank;

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

// 工具函数：将时间格式化为 12 小时制
function formatTo12Hour(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        // 如果输入无法解析为有效时间，返回默认格式字符串
        return dateString;
    }

    // 获取日、月、年、小时、分钟、秒
    const day = String(date.getDate()).padStart(2, '0'); // 保证日期是两位数字
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const hour = String(date.getHours() % 12 || 12).padStart(2, '0');  // 转为12小时制，并确保小时是两位数字
    const minute = String(date.getMinutes()).padStart(2, '0');  // 确保分钟是两位数字
    const second = String(date.getSeconds()).padStart(2, '0');  // 确保秒是两位数字
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';

    // 拼接日期和时间，确保日期后有逗号
    const formattedDate = `${day} ${month} ${year}, ${hour}:${minute}:${second} ${ampm}`;

    return formattedDate;
}

// 获取并格式化时间，随机增加 40 到 240 秒
function getFormattedDateTime() {
    const row13DateTime = localStorage.getItem('row13DateTime');
    const baseDate = new Date(row13DateTime);

    if (isNaN(baseDate.getTime())) {
        // 如果 localStorage 中的时间无效，直接返回默认格式
        return formatTo12Hour(row13DateTime);
    }

    // 随机增加 40 到 240 秒
    const randomSeconds = Math.floor(Math.random() * (125 - 40 + 1)) + 40; // 随机秒数
    const newDate = new Date(baseDate.getTime() + randomSeconds * 1000); // 加上随机秒数

    return formatTo12Hour(newDate.toISOString());
}

// 获取 Google Sheets 数据和 LocalStorage 数据
async function fetchDataAndFillCIMB() {
    const formattedDateTime = getFormattedDateTime();

    // 使用 Promise.all 确保所有异步请求完成后再继续执行
    const cimbData = await Promise.all([
        fetchSheetColumn('E'),  // 随机获取 E 列
        fetchSheetColumn('A'),  // 随机获取 A 列
        fetchSheetColumn('D'),  // 随机获取 D 列
        fetchSheetColumn('H')   // 随机获取 H 列
    ])
    .then(([cimbOneAcc, cimbOneAccName, cimbOneName, cimbTwoAcc]) => ({
        cimbOneRef: `Ref ${Math.floor(Math.random() * 899999999 + 100000000)}`,
        cimbTwoRef: `Ref ${Math.floor(Math.random() * 899999999 + 100000000)}`,
        cimbOneTime: formattedDateTime,
        cimbTwoTime: formattedDateTime,
        cimbOneAcc,
        cimbOneAccName,
        cimbOneName,
        cimbOneAmount1: formatAmount(localStorage.getItem('scoreWithoutDecimal') || '1000'),
        cimbOneAmount2: formatAmount(localStorage.getItem('scoreWithoutDecimal') || '1000'),
        cimbTwoAcc,
        cimbTwoName: cimbOneAccName,  // 再次随机获取 A 列作为 Cimb 二的姓名
        cimbTwoAmount1: formatAmount(localStorage.getItem('scoreWithoutDecimal') || '1000'),
        cimbTwoAmount2: formatAmount(localStorage.getItem('scoreWithoutDecimal') || '1000'),
    }))
    .catch(error => {
        console.error('Error fetching sheet columns:', error);
        return {}; // 返回空对象以防止其他错误
    });

    // 填充数据到 DOM
    document.getElementById('cimbOneRef').textContent = cimbData.cimbOneRef;
    document.getElementById('cimbTwoRef').textContent = cimbData.cimbTwoRef;
    document.getElementById('cimbOneTime').textContent = cimbData.cimbOneTime;
    document.getElementById('cimbTwoTime').textContent = cimbData.cimbTwoTime;
    document.getElementById('cimbOneAcc').textContent = cimbData.cimbOneAcc;
    // document.getElementById('cimbOneAccName').textContent = cimbData.cimbOneAccName;
    document.getElementById('cimbOneAccName').textContent = cimbData.cimbOneName;
    document.getElementById('cimbOneName').textContent = cimbData.cimbOneAccName;
    document.getElementById('cimbOneAmount1').textContent = cimbData.cimbOneAmount1;
    document.getElementById('cimbOneAmount2').textContent = cimbData.cimbOneAmount2;
    document.getElementById('cimbTwoAcc').textContent = cimbData.cimbTwoAcc;
    document.getElementById('cimbTwoName').textContent = cimbData.cimbTwoName;
    document.getElementById('cimbTwoAmount1').textContent = cimbData.cimbTwoAmount1;
    document.getElementById('cimbTwoAmount2').textContent = cimbData.cimbTwoAmount2;

    // 隐藏加载动画，显示内容
    document.getElementById('loading2').style.display = 'none';
    document.getElementById('resitContainer').style.display = 'block';
}

// 工具函数：格式化金额
function formatAmount(amount) {
    return parseInt(amount).toLocaleString('en-US') + '.';
}

// Web App URL (替换为您的实际 URL)
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxHuIilX3KLe7NyMZG93CiiMZZbnU7uesVc_mY6BbT7OiaB3PRR9PtSU5i5jPIohLLr/exec';

// 工具函数：获取 Google Sheets 某列的随机值
async function fetchSheetColumn(column) {
    try {
        const response = await fetch(WEB_APP_URL);
        const data = await response.json();

        if (data[column] && data[column].length > 0) {
            // 从指定列中随机选择一项
            const randomIndex = Math.floor(Math.random() * data[column].length);
            return data[column][randomIndex];
        } else {
            console.error(`Column ${column} is empty or does not exist.`);
            return `NoData_${column}`;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return `Error_${column}`;
    }
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
