// login.js
const apiBaseUrl = 'http://localhost:3000/api';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');
  
  try {
    const response = await fetch(`${apiBaseUrl}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // 登录成功，存储登录状态并跳转到首页
      localStorage.setItem('adminLoggedIn', 'true');
      window.location.href = 'index.html';
    } else {
      errorMessage.textContent = data.error || '登录失败，请检查用户名和密码';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.textContent = '登录失败，请重试';
  }
});
