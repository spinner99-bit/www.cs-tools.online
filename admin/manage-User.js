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
    } else {
        // 跳转到 index 页面
        window.location.href = "https://www.cs-tools.online/index";
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

    const addUserBtn = document.getElementById("addUserBtn");
    const cancelAddUserBtn = document.getElementById("cancelAddUser");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const fullNameInput = document.getElementById("fullName");
    const addUserContainer = document.getElementById('addUserContainer');
    
    // 清空输入框函数
    function clearForm() {
      usernameInput.value = "";
      passwordInput.value = "";
      fullNameInput.value = "";
    }
    
    // 保存到 Google Sheets 函数
    async function saveToGoogleSheets(username, password, fullName) {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbzp2Ia8B9DQ5Qja9SImzjcWxvC2_znrk73KzlcZIpexFySVCF3BknUg8qWJ1Jv85pdCHw/exec",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `action=register&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&fullName=${encodeURIComponent(fullName)}`
          }
        );
    
        const result = await response.json();
        return result.success;
      } catch (error) {
        console.error("Error:", error);
        return false;
      }
    }
    
    // 处理 "Add User" 按钮点击事件
    addUserBtn.addEventListener("click", async () => {
      if (addUserBtn.textContent === "Add User") {
        addUserContainer.style.display = "block";
        addUserBtn.textContent = "Add";
        usernameInput.disabled = false;
        passwordInput.disabled = false;
        fullNameInput.disabled = false;
        cancelAddUserBtn.style.display = "inline";
      } else if (addUserBtn.textContent === "Add") {
        if (!usernameInput.value || !passwordInput.value) {
          alert("Username and Password are required!");
          return;
        }
    
        // 如果 fullName 为空，设置默认值
        const fullName = fullNameInput.value.trim() || "Company Name";
    
        addUserBtn.textContent = "Adding...";
        addUserBtn.disabled = true;
        addUserBtn.style.cursor = 'not-allowed';
        cancelAddUserBtn.disabled = true;
        cancelAddUserBtn.style.cursor = 'not-allowed';
        usernameInput.disabled = true;
        passwordInput.disabled = true;
        fullNameInput.disabled = true;
    
        const success = await saveToGoogleSheets(
          usernameInput.value,
          passwordInput.value,
          fullName
        );
    
        if (success) {
          alert("New User ID Added!");
          addUserContainer.style.display = "none";
          addUserBtn.textContent = "Add User";
          addUserBtn.disabled = false;
          addUserBtn.style.cursor = 'pointer';
          cancelAddUserBtn.style.display = "none";
          cancelAddUserBtn.disabled = false;
          cancelAddUserBtn.style.cursor = 'pointer';
          clearForm();
          fetchData()
        } else {
          alert("Failed to add user. Please try again.");
          addUserBtn.textContent = "Add";
          addUserBtn.disabled = false;
          addUserBtn.style.cursor = 'pointer';
          cancelAddUserBtn.disabled = false;
          cancelAddUserBtn.style.cursor = 'pointer';
          usernameInput.disabled = false;
          passwordInput.disabled = false;
          fullNameInput.disabled = false;
        }
      }
    });
    
    // 处理 "Cancel" 按钮点击事件
    cancelAddUserBtn.addEventListener("click", () => {
      clearForm();
      addUserContainer.style.display = "none";
      usernameInput.disabled = true;
      passwordInput.disabled = true;
      fullNameInput.disabled = true;
      addUserBtn.textContent = "Add User";
      cancelAddUserBtn.style.display = "none";
    });

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

async function fetchData() {
    const tableBody = document.getElementById("dataTable");
    const loadingElement = document.getElementById("loading");

    // 隐藏表格，显示 loading
    tableBody.style.display = "none";
    loadingElement.style.display = "block";

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbyQeWUCxThTyVKhEMxn08Dv4ej9WhsRJpc-gCp3OEhJ2_zDyJzPxVCxJ8Hx8wPFT2srlA/exec");
        const data = await response.json();

        tableBody.innerHTML = ""; // 清空表格

        data.forEach((row, rowIndex) => {
            const tr = document.createElement("tr");

            // 遍历每一列，创建表格单元格
            row.forEach((cell, cellIndex) => {
                const td = document.createElement("td");

                if (cellIndex === 1) {
                    // 第二列（密码列）内容显示为 *
                    const cellValue = String(cell); // 确保 cell 是字符串
                    td.textContent = "*".repeat(cellValue.length);
                } else if (cellIndex === 4) {
                    // 第五列（时间列）格式化时间
                    td.textContent = formatDate(cell);
                } else {
                    td.textContent = cell;
                }

                tr.appendChild(td);
            });

            // 添加编辑按钮
            const actionTd = document.createElement("td");
            const editButton = document.createElement("i");
            editButton.className = "fa-solid fa-pen-to-square";
            editButton.style.cursor = "pointer";
            editButton.addEventListener("click", () => openEditPopup(row, rowIndex));
            actionTd.appendChild(editButton);
            tr.appendChild(actionTd);

            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        // 显示表格，隐藏 loading
        loadingElement.style.display = "none";
        tableBody.style.display = "table-row-group"; // 恢复表格显示
    }
}

// 时间格式化函数
function formatDate(dateString) {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        // 如果无法解析日期，返回原始字符串
        return dateString;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
  
// 打开编辑弹窗
function openEditPopup(row, rowIndex) {
    document.getElementById("editUsername").value = row[0];
    document.getElementById("editPassword").value = row[1];
    document.getElementById("editPassword").setAttribute('type', 'password');  // 确保密码输入框显示为星号
    document.getElementById("editCompany").value = row[2];
    document.getElementById("editStatus").value = row[3] === "Active" ? "1" : "2";  // 根据传入的状态值设定选择框

    // 确保最后登录时间格式化
    const formattedDate = formatDate(row[4]);
    document.getElementById("editLastLoginTime").value = formattedDate;

    // 显示弹窗
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    // 保存编辑内容
    document.getElementById("editForm").onsubmit = async (event) => {
        event.preventDefault();
        await saveEdit(rowIndex);
        closePopup();
    };
}


async function saveEdit(rowIndex) {
    const updatedData = {
        action: "UpdateUserInfo",
        username: document.getElementById("editUsername").value, // 获取实际用户名
        password: document.getElementById("editPassword").value,
        company: document.getElementById("editCompany").value,
        status: document.getElementById("editStatus").value === "1" ? "Active" : "Suspended", // 根据选择的值设置状态
        lastLoginTime: document.getElementById("editLastLoginTime").value,
    };

    // 将数据转换为 URL 编码格式
    const urlEncodedData = new URLSearchParams(updatedData).toString();

    const response = await fetch("https://script.google.com/macros/s/AKfycbzaLlO1YQoHpbWwRYV7loN-Cr8zEjrvk5mp9KzWm77kb94iHZATAgmk92uD4GOgDrcsqQ/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded" // 指定 URL 编码格式
        },
        body: urlEncodedData, // 发送 URL 编码数据
    });

    const result = await response.json();
    if (result.success) {
        alert("Successfully update User Info !");
        fetchData();
    } else {
        alert("Failed to update : " + result.message);
    }
}

// 关闭弹窗
function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

document.getElementById("cancelButton").addEventListener("click", closePopup);
  

window.onload = function() {
    checkLoginStatus();
    fetchData();
};
  
