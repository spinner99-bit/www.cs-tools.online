    // Google Apps Script 部署的 API URL
    const apiUrl = 'https://script.google.com/macros/s/AKfycbwmkWcv84RNd9ObMLs294jHK4kfxcq79UyVzZg0CyD1ybTyNY8kwb6rhfDTykJhaNvO/exec';

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
                <button class="logout-btn" onclick="logout()"><i class='bx bx-log-out' ></i></button>
            `;
        }
    }

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

    // 刷新游戏列表
    function fetchGames() {
        const loadingIndicator = document.getElementById('loading'); // 获取加载指示器
        loadingIndicator.style.display = 'block'; // 显示加载指示器
        console.log("Loading indicator shown."); // 调试信息
    
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok'); // 抛出错误以进行处理
                }
                return response.json();
            })
            .then(data => {
                const gameList = document.getElementById('game-list');
                gameList.innerHTML = '';  // 清空游戏列表
    
                data.forEach(game => {
                    const gameItem = document.createElement('div');
                    gameItem.className = 'game-item';
    
                    const gameTitle = document.createElement('div');
                    gameTitle.className = 'game-title';
                    gameTitle.innerHTML = `Product Type : ${game.gameType}`;
    
                    const gameBox = document.createElement('div');
                    gameBox.className = 'game-box';
    
                    // 构建6个游戏名称及百分比的文本
                    let gameContent = '';
                    let isMaintenance = false;  // 标记是否为 Maintenance
    
                    game.games.forEach(g => {
                        if (g.gameName === "Maintenance") {
                            isMaintenance = true;  // 如果任何一个游戏为 Maintenance，标记为 Maintenance
                        }
                        // 添加游戏名称和概率（去掉引号）
                        gameContent += `• ${g.gameName} 💥 ${g.percentage}%\n`;
                    });
    
                    // 如果为 Maintenance，显示相应内容
                    if (isMaintenance) {
                        gameBox.innerText = "Maintenance";  // 只显示 Maintenance
                        gameBox.classList.add('maintenance');  // 添加 Maintenance 样式
                    } else {
                        // 组装格子内的内容
                        const extraContentAbove = `🎰 Product Type : ${game.gameType}\n\n`;  // 添加额外内容
                        const extraContentBelow = `\n\n⚠️ Attention : Tips Game Ini Hanya Untuk Providers MB33 Sahaje \nSemoga Tips Game Ini Dapat Bantu🔥`;  // 添加额外内容
                        // 设置最终显示内容
                        gameBox.innerText = extraContentAbove + gameContent.trim() + extraContentBelow;  
                    }
    
                    // 添加点击复制功能
                    gameBox.addEventListener('click', function() {
                        const copyContent = `🎰 **Product Type : ${game.gameType}**\n\n${gameContent.trim()}\n\n⚠️ Attention : Tips Game Ini Hanya Untuk Providers MB33 Sahaje \n **Semoga Tips Game Ini Dapat Bantu** 🔥`;  // 获取要复制的内容
                        const tempInput = document.createElement('textarea');
                        tempInput.value = copyContent;  // 修改为所需格式
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);
    
                        // 改变背景颜色为青色
                        gameBox.classList.add('copied');
    
                        // 显示已复制的提示
                        const copiedText = document.createElement('div');
                        copiedText.className = 'copied-text';
                        copiedText.innerText = 'Copied!';
                        gameItem.appendChild(copiedText);
    
                        setTimeout(() => {
                            gameItem.removeChild(copiedText);
                        }, 500);
                    });
    
                    gameItem.appendChild(gameTitle);
                    gameItem.appendChild(gameBox);  // 只插入游戏框
                    gameList.appendChild(gameItem);
                });
    
                // 隐藏加载指示器
                loadingIndicator.style.display = 'none';
                console.log("Loading indicator hidden."); // 调试信息
            })
            .catch(error => {
                console.error('Error fetching games:', error);
                loadingIndicator.style.display = 'none'; // 在发生错误时也隐藏加载指示器
                gameList.style.display = 'none'; // 确保在错误情况下也隐藏游戏列表
                console.log("Loading indicator hidden due to error."); // 调试信息
            });
    }

    // 发送消息函数
async function sendMessage() {
    const username = localStorage.getItem('username');
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message === "") {
        document.getElementById('responseMessage').textContent = "Please enter a message.";
        return;
    }

    const botToken = '6414565524:AAGY2obKsjvpfyH8rnq4t9OWMPDgKHM8ddI';
    const chatId = '-4585176626';
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // 发送请求到 Telegram Bot
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: `( ${username} ) Report The Problem : ${message}`,
        }),
    });

    const result = await response.json();

    if (result.ok) {
        document.getElementById('reportResponseMessage').textContent = "Message sent successfully!";
        messageInput.value = ""; // 清空输入框
    } else {
        document.getElementById('reportResponseMessage').textContent = "Error sending message.";
    }
}

    // 页面加载时，自动检查登录状态并加载游戏列表
    window.onload = function() {
        checkLoginStatus();
        fetchGames();
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
