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


// 获取元素
const usernameInput = document.getElementById('username');
const oldPasswordInput = document.getElementById('old-password');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const editButton = document.getElementById('edit-btn');
const passSample = document.getElementById('settingPassSample');
const oldPassWrapper = document.getElementById('settingOldPassword');
const NewPassWrapper = document.getElementById('settingNewPassword');
const ComfirmPassWrapper = document.getElementById('settingComfirmPassword');

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
    passSample.style.display = 'none';
    oldPassWrapper.style.display = 'block';
    NewPassWrapper.style.display = 'block';
    ComfirmPassWrapper.style.display = 'block';
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

    // 更新按钮文本为 Updating... 并禁用按钮
    editButton.textContent = 'Updating...';
    editButton.style.cursor = 'not-allowed';
    editButton.disabled = true;

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

      passSample.style.display = 'block';
      oldPassWrapper.style.display = 'none';
      NewPassWrapper.style.display = 'none';
      ComfirmPassWrapper.style.display = 'none';

      // 重置输入框并禁用
      oldPasswordInput.value = '';
      newPasswordInput.value = '';
      confirmPasswordInput.value = '';
      oldPasswordInput.disabled = true;
      newPasswordInput.disabled = true;
      confirmPasswordInput.disabled = true;

      // 恢复按钮状态
      editButton.textContent = 'Change Password';
      editButton.style.cursor = 'pointer';
      editButton.disabled = false;
      isEditable = false;
    } else {
      alert(result.message);  // 显示后端返回的错误信息

      // 如果失败，恢复按钮状态
      editButton.textContent = 'Update';
      editButton.style.cursor = 'pointer';
      editButton.disabled = false;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('There was an error updating the password.');

    // 如果失败，恢复按钮状态
    editButton.textContent = 'Update';
    editButton.style.cursor = 'pointer';
    editButton.disabled = false;
  });
}

const changeCompanyBtn = document.getElementById('changeCompanyBtn');
const companyInput = document.getElementById('company');
const username = localStorage.getItem('username'); // 从 localStorage 获取 username

// Function to save to Google Sheets
async function saveToGoogleSheets(username, companyName) {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzzbpfcuUQvxSvblEj57Xep7L1cYKzBhSByRmLCErPo7h54wb1vvonGlroyQXHpck0Sag/exec?action=updateCompany', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateCompany',
        username: username,
        value: companyName,
      }),
    });

    if (!response.ok) throw new Error('Failed to save');
    const result = await response.json();
    return result.status === 'success';
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Button click handler
changeCompanyBtn.addEventListener('click', async () => {
  if (!username) {
    alert('No username found. Please log in.');
    return;
  }

  if (changeCompanyBtn.textContent === 'Change Company') {
    changeCompanyBtn.textContent = 'Update Company';
    companyInput.disabled = false;
    companyInput.focus();
  } else if (changeCompanyBtn.textContent === 'Update Company') {
    changeCompanyBtn.textContent = 'Updating...';
    changeCompanyBtn.style.cursor = 'not-allowed';
    changeCompanyBtn.disabled = true;
    companyInput.disabled = true;

    const success = await saveToGoogleSheets(username, companyInput.value);

    if (success) {
      changeCompanyBtn.textContent = 'Change Company';
      changeCompanyBtn.disabled = false;
      companyInput.disabled = true;
      changeCompanyBtn.style.cursor = 'pointer';
      alert('Your new company name is updated!');
      localStorage.setItem("company", companyInput.value);
    } else {
      alert('Failed to update. Please try again.');
      changeCompanyBtn.textContent = 'Update Company';
      changeCompanyBtn.disabled = false;
      companyInput.disabled = false;
    }
  }
});


function getBankInfo() {
    const mbbNo = localStorage.getItem("mbbNo");
    const cimbName = localStorage.getItem("cimbName");
    const cimbNo = localStorage.getItem("cimbNo");
    const hlbNo = localStorage.getItem("hlbNo");
    const rhbNo = localStorage.getItem("rhbNo");
    const company = localStorage.getItem("company");
  
    // 填充到页面
    if (mbbNo) document.getElementById("mbbNo").value = mbbNo;
    if (cimbName) document.getElementById("cimbName").value = cimbName;
    if (cimbNo) document.getElementById("cimbNo").value = cimbNo;
    if (hlbNo) document.getElementById("hlbNo").value = hlbNo;
    if (rhbNo) document.getElementById("rhbNo").value = rhbNo;
    if (company) document.getElementById("company").value = company;
};

// 点击编辑按钮时
document.getElementById("editBankButton").addEventListener("click", function() {
    const button = this;

    if (button.textContent === "Change Information") {
      button.textContent = "Update";
      document.querySelectorAll("textarea, select").forEach(input => input.disabled = false);
    } else {
      updateBankAccountInfo(button);  // 将按钮传递给更新函数
    }
});

// 更新银行信息并保存到 Google Sheets
function updateBankAccountInfo(button) {
    // 禁用按钮并更改文本为 Updating...，设置光标为 not-allowed
    button.disabled = true;
    button.textContent = "Updating...";
    button.style.cursor = "not-allowed";  // 设置光标为 not-allowed

    const mbbNo = document.getElementById("mbbNo").value;
    const cimbName = document.getElementById("cimbName").value;
    const cimbNo = document.getElementById("cimbNo").value;
    const hlbNo = document.getElementById("hlbNo").value;
    const rhbNo = document.getElementById("rhbNo").value;
    const username = localStorage.getItem("username");  // 获取用户名

    // 保存数据到 localStorage
    localStorage.setItem("mbbNo", mbbNo);
    localStorage.setItem("cimbName", cimbName);
    localStorage.setItem("cimbNo", cimbNo);
    localStorage.setItem("hlbNo", hlbNo);
    localStorage.setItem("rhbNo", rhbNo);

    // 调用 Google Apps Script 更新数据到 Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbwALdZ7s81bW6QMRelXiVq8aXogc3fB0KJUXn4uy3d93NDdyrydX4TbIMBN5YoUI9J1-A/exec?action=updateBankInfo", {  // 添加 action 查询参数
        method: "POST",
        body: JSON.stringify({ username, mbbNo, cimbName, cimbNo, hlbNo, rhbNo }),  // 发送包含 username 和银行信息的数据
      })
      .then(response => response.json())
      .then(data => {
        alert("Your bank info is updated!");

        // 恢复按钮文本为 Change Information
        button.textContent = "Change Information";
        button.style.cursor = "pointer";  // 恢复光标为 pointer
        button.disabled = false;  // 恢复按钮为可点击状态

        // 禁用输入框
        document.querySelectorAll("textarea, select").forEach(input => input.disabled = true);
      })
      .catch(error => {
        alert("Something went wrong, please try again later.");
        console.error("Update failed", error);

        // 如果发生错误，恢复按钮状态
        button.textContent = "Change Information";
        button.style.cursor = "pointer";  // 恢复光标为 pointer
        button.disabled = false;  // 恢复按钮为可点击状态
      });
}

// 页面加载时，自动检查登录状态并加载游戏列表
window.onload = function() {
    checkLoginStatus();
    getBankInfo();
};
