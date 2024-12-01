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

document.getElementById("registrationForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // 防止表单刷新页面
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const fullName = document.getElementById("fullName").value;
  
    // 确保必填字段都有值
    if (!username || !password || !fullName) {
      alert("All fields are required!"); // 使用 alert 提示
      return;
    }
  
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyRjvG0T4bJxy4D1w1Xi8FnrVyTW2rpklvGZCYXYZ3mrTn_2W-tElnMVBCk_IPkFzJHww/exec", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=register&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&fullName=${encodeURIComponent(fullName)}`
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert("New User ID Added !"); // 使用 alert 提示成功信息
        clearForm(); // 清空表单
      } else {
        alert(`Error: ${result.message}`); // 使用 alert 提示错误信息
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
  
  // 清空表单字段
  function clearForm() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("fullName").value = "";
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

    async function fetchData() {
        const response = await fetch("https://script.google.com/macros/s/AKfycbyQeWUCxThTyVKhEMxn08Dv4ej9WhsRJpc-gCp3OEhJ2_zDyJzPxVCxJ8Hx8wPFT2srlA/exec");
        const data = await response.json();
    
        const tableBody = document.getElementById("dataTable");
        tableBody.innerHTML = ""; // 清空表格
    
        data.forEach((row, rowIndex) => {
            const tr = document.createElement("tr");
    
            // 遍历每一列，创建表格单元格
            row.forEach((cell, cellIndex) => {
                const td = document.createElement("td");
    
                // 如果是第二列（密码列），将内容显示为 *
                if (cellIndex === 1) {
                    td.textContent = "*".repeat(cell.length); // 用 * 号替代密码的实际字符
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
    }
  
// 打开编辑弹窗
function openEditPopup(row, rowIndex) {
    document.getElementById("editUsername").value = row[0];
    document.getElementById("editPassword").value = row[1];
    document.getElementById("editPassword").setAttribute('type', 'password');  // 确保密码输入框显示为星号
    document.getElementById("editCompany").value = row[2];
    document.getElementById("editStatus").value = row[3] === "Active" ? "1" : "2";  // 根据传入的状态值设定选择框
    document.getElementById("editLastLoginTime").value = row[4];

    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";

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
  