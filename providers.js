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

    const API_URL = 'https://script.google.com/macros/s/AKfycbzii0hhmAd5qdo5lKsluO6xlXoox4YPkh0Uz30UDM49w4zjyhsIzMmc6b8Lh6Eg90gebw/exec'; // 替换为你在 Apps Script 部署的 Web 应用程序的 URL
  
    // 替换为你在 Apps Script 部署的 Web 应用程序的 URL
    
      // 图片映射
      const imageMap = {
        "918Kiss": "Element/GameLogo/918Kiss.png",
        "Mega888": "Element/GameLogo/Mega888.png",
        "Pussy888": "Element/GameLogo/Pussy888.png",
        "Xe88": "Element/GameLogo/Xe88.png",
        "Evo888": "Element/GameLogo/Evo888.png",
        "918Kaya": "Element/GameLogo/918Kaya.png",
        "Playboy2": "Element/GameLogo/Playboy2.png",
        "Ace333": "Element/GameLogo/Ace333.png",
        "Live22": "Element/GameLogo/Live22.png",
        "Joker123": "Element/GameLogo/Joker123.png",
        "SunCity2": "Element/GameLogo/SunCity2.png",
        "Greatwall99": "Element/GameLogo/Greatwall99.png",
        "Newtown": "Element/GameLogo/Newtown.png",
        "Rollex11": "Element/GameLogo/Rollex11.png",
        "918Kiss 2": "Element/GameLogo/918Kiss2.png",
        "918Kiss Html5": "Element/GameLogo/918KissHtml5.png",
        "V Power": "Element/GameLogo/VPower.png",
        "King855": "Element/GameLogo/King855.png",
        "C8Play": "Element/GameLogo/C8Play.png",
        "Lion King": "Element/GameLogo/LionKing.png"
      };
    
      async function fetchProducts() {
        const response = await fetch(API_URL);
        const products = await response.json();
        
        const productContainer = document.getElementById('products');
        products.forEach(product => {
          const productDiv = document.createElement('div');
          productDiv.classList.add('product');
    
          // 获取对应的图片路径
          const imageUrl = imageMap[product.name] || ''; 
    
          productDiv.innerHTML = `
            <img src="${imageUrl}" alt="${product.name}">
            <div class="link-group">
              <label>Download</label>
              <input type="text" value="${product.download}" readonly id="download-link-${product.name}">
              <button class="copy-btn" onclick="copyLink('download-link-${product.name}')"><i class='bx bxs-copy'></i></button>
            </div>
            <div class="link-group">
              <label>Web</label>
              <input type="text" value="${product.web}" readonly id="web-link-${product.name}">
              <button class="copy-btn" onclick="copyLink('web-link-${product.name}')"><i class='bx bxs-copy'></i></button>
            </div>
            <div class="link-group">
              <label>Kiosk</label>
              <input type="text" value="${product.kiosk}" readonly id="kiosk-link-${product.name}">
              <button class="copy-btn" onclick="copyLink('kiosk-link-${product.kiosk}')"><i class='bx bxs-copy'></i></button>
            </div>
          `;
    
          productContainer.appendChild(productDiv);
        });
      }
    
      // 复制链接功能
      function copyLink(inputId) {
        const copyText = document.getElementById(inputId);
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */
        document.execCommand("copy");
        alert("Copied: " + copyText.value);
      }
    
      // 加载产品信息
      fetchProducts();
