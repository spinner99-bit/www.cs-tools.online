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
        "Mega H5": "Element/GameLogo/MegaH5.png",
        "V Power": "Element/GameLogo/VPower.png",
        "King855": "Element/GameLogo/King855.png",
        "C8Play": "Element/GameLogo/C8Play.png",
        "Lion King": "Element/GameLogo/LionKing.png",
        "3Win8": "Element/GameLogo/3Win8.png"
      };
    
// 加载产品信息的函数
async function fetchProducts() {
  // 显示加载动画，隐藏产品列表
  document.getElementById('loading').style.display = 'grid';
  document.getElementById('products').style.display = 'none';

  try {
      const response = await fetch(API_URL);
      const products = await response.json();

      const productContainer = document.getElementById('products');
      products.forEach(product => {
          const productDiv = document.createElement('div');
          productDiv.classList.add('product');

          // 获取对应的图片路径
          const imageUrl = imageMap[product.name] || ''; 

          productDiv.innerHTML = `
              <div class="image-group">
                <img src="${imageUrl}" alt="${product.name}">
              </div>
              <div class="link-group">
                  <label>Download</label>
                  <input type="text" value="${product.download}" readonly id="download-link-${product.name}">
                  <button class="copy-btn" onclick="copyLink('download-link-${product.name}')"><i class="fa-solid fa-copy"></i></button>
                  <button class="open-btn" onclick="openLink('download-link-${product.name}')"><i class="fa-solid fa-up-right-from-square"></i></button>
              </div>
              <div class="link-group">
                  <label>Web</label>
                  <input type="text" value="${product.web}" readonly id="web-link-${product.name}">
                  <button class="copy-btn" onclick="copyLink('web-link-${product.name}')"><i class="fa-solid fa-copy"></i></button>
                  <button class="open-btn" onclick="openLink('web-link-${product.name}')"><i class="fa-solid fa-up-right-from-square"></i></button>
              </div>
              <div class="link-group">
                  <label>Kiosk</label>
                  <input type="text" value="${product.kiosk}" readonly id="kiosk-link-${product.name}">
                  <button class="copy-btn" onclick="copyLink('kiosk-link-${product.name}')"><i class="fa-solid fa-copy"></i></button>
                  <button class="open-btn" onclick="openLink('kiosk-link-${product.name}')"><i class="fa-solid fa-up-right-from-square"></i></button>
              </div>
          `;

          productContainer.appendChild(productDiv);
      });
  } catch (error) {
      console.error('Error fetching products:', error);
  } finally {
      // 隐藏加载动画，显示产品列表
      document.getElementById('loading').style.display = 'none';
      document.getElementById('products').style.display = 'flex';
  }
}

// 复制链接功能
function copyLink(inputId) {
  const copyText = document.getElementById(inputId);
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand("copy");
  alert("Copied: " + copyText.value);
}

// 打开链接功能
function openLink(inputId) {
  let link = document.getElementById(inputId).value.trim();

  // 正则表达式检查 URL 格式
  const urlPattern = /^(http:\/\/|https:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

  // 如果链接不符合格式，则提示用户
  if (!urlPattern.test(link)) {
    alert("Blank ! !");
    return;
  }

  // 如果没有前缀，则添加 http://
  if (!link.startsWith('http://') && !link.startsWith('https://')) {
    link = 'http://' + link;
  }

  window.open(link);
}


// 加载产品信息
fetchProducts();
