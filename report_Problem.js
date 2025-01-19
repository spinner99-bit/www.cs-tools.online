document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', function (e) {
    if (e.keyCode == 123) { // F12
        e.preventDefault();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // 从 localStorage 获取用户名
    const username = localStorage.getItem("username");

    // 检查用户名是否为 admin 或 MB33
    if (username === "admin" || username === "MB33") {
        // 显示管理员菜单
        document.getElementById("menuForAdmin").style.display = "block";
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

    // 无操作时间限制（秒）
    const IDLE_TIMEOUT = 14400; // 4小时
    let idleTime = 0; // 计时器

    // 重置计时器的函数
    function resetIdleTime() {
        idleTime = 0; // 每次用户操作时重置计时器
    }

    // 定时器每秒检查用户无操作时间
    setInterval(() => {
        idleTime++;
        if (idleTime >= IDLE_TIMEOUT) {
          alert("Session expired please login again.");
          logout();
        }
    }, 1000); // 每秒递增计时器

    // 监听用户操作的事件，重置计时器
    document.addEventListener("mousemove", resetIdleTime);
    document.addEventListener("keydown", resetIdleTime);
    document.addEventListener("scroll", resetIdleTime);
    document.addEventListener("click", resetIdleTime);
    document.addEventListener("touchstart", resetIdleTime);

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
        window.location.href = 'login';
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

window.onload = function() {
    checkLoginStatus();
};
