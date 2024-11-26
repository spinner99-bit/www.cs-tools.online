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
        localStorage.removeItem('password');
        localStorage.removeItem('company');

        // 跳转回登录页面
        window.location.href = 'login.html';
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


    // 获取元素
    const usernameInput = document.getElementById('username');
    const oldPasswordInput = document.getElementById('old-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const editButton = document.getElementById('edit-btn');

    // 模拟 Google Sheets API URL（替换为实际URL）
    const API_URL = 'https://script.google.com/macros/s/AKfycbzx6tqrEy1AjdH-QcYxuOtMZJLdmSWCookG-_7qSRs3izOCe22w9UczbZU5G1awDSuPIg/exec'; 

    // 从 localStorage 获取用户信息
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password'); // 假设密码也存储在 localStorage

    // 在第一个 input 中显示 username
    usernameInput.value = storedUsername;

    // 初始状态下所有 input 不可编辑
    let isEditable = false;

    // 当用户点击 Edit 按钮后，允许修改四个 input
    editButton.addEventListener('click', function() {
      if (!isEditable) {
        // 允许修改输入框
        oldPasswordInput.disabled = false;
        newPasswordInput.disabled = false;
        confirmPasswordInput.disabled = false;

        // 将按钮文字改为 Update
        editButton.textContent = 'Update';
        isEditable = true;
      } else {
        // 点击 Update 按钮后，执行密码修改逻辑
        const oldPassword = oldPasswordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // 检查旧密码是否正确
        if (oldPassword !== storedPassword) {
            alert('Old password is incorrect.');
            return;
        }

        // 检查新密码是否一致
        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
        }

        // 请求发送到 Google Sheets 保存新密码
        updatePassword(storedUsername, newPassword, oldPassword);  // 传递旧密码
    }
});

// 发送请求到 Google Sheets 保存新密码
function updatePassword(username, newPassword, oldPassword) {
  const formData = new URLSearchParams();
  formData.append('action', 'updatePassword');
  formData.append('username', username);
  formData.append('oldPassword', oldPassword);  // 添加旧密码
  formData.append('newPassword', newPassword);

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      alert('Password updated successfully!');

      // 更新 localStorage 中的密码
      localStorage.setItem('password', newPassword);

      // 重置输入框并禁用
      oldPasswordInput.value = '';
      newPasswordInput.value = '';
      confirmPasswordInput.value = '';
      oldPasswordInput.disabled = true;
      newPasswordInput.disabled = true;
      confirmPasswordInput.disabled = true;

      // 将按钮文字改回 Edit
      editButton.textContent = 'Edit';
      isEditable = false;
    } else {
      alert(result.message);  // 显示后端返回的错误信息
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('There was an error updating the password.');
  });
}
