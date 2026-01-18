// 登錄功能
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("login-msg");
    if(!username || !password) { msg.textContent = "請填寫完整賬號密碼！"; return; }
    const user = ACCOUNTS.find(item => item.username === username && item.password === password);
    if(user) {
        localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
        msg.textContent = "登入成功！正在跳轉首頁...";
        msg.className = "msg success";
        setTimeout(() => window.location.href = "index.html", 1500);
    } else {
        msg.textContent = "賬號或密碼錯誤！";
    }
}
// 登出功能
function logout() {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    window.location.href = "index.html";
}
// 權限渲染 - 頁面加載時自動執行
window.addEventListener("DOMContentLoaded", () => {
    const loginStatus = document.getElementById("login-status");
    const adminEls = document.querySelectorAll(".admin-only");
    const userEls = document.querySelectorAll(".user-only");
    const currentUser = getCurrentUser();
    if(currentUser) {
        loginStatus.innerHTML = `歡迎, ${currentUser.nickname} | <a href="javascript:logout()">登出</a>`;
        if(isAdmin()) {
            adminEls.forEach(el => el.style.display = "block");
            userEls.forEach(el => el.style.display = "block");
            if(window.location.pathname.includes("misc.html") === false && document.querySelector(".misc-link")) {
                document.querySelector(".misc-link").style.display = "inline";
            }
        }
        if(isUser() && !isAdmin()) userEls.forEach(el => el.style.display = "block");
    } else {
        loginStatus.innerHTML = "未登入 | <a href='login.html'>立即登入</a>";
    }
});