/**
 * Docsify 5 轻量级亮/暗主题切换插件
 * 适用于 core.min.css 与 core-dark.min.css 的组合
 */
(function () {
  // 防止重复初始化
  if (window.__docsifyThemeSwitchLoaded) return;
  window.__docsifyThemeSwitchLoaded = true;

  const DARK_THEME_ID = 'docsify-dark-theme';
  const STORAGE_KEY = 'docsify-theme';

  // 获取当前主题状态
  function getCurrentTheme() {
    const link = document.getElementById(DARK_THEME_ID);
    return link && !link.disabled ? 'dark' : 'light';
  }

  // 设置主题
  function setTheme(theme) {
    const link = document.getElementById(DARK_THEME_ID);
    if (!link) {
      console.warn('[Theme-Switch] 未找到 id="docsify-dark-theme" 的 link 标签，请检查 index.html 配置');
      return;
    }

    const isDark = theme === 'dark';
    link.disabled = !isDark;
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, theme);

    // 更新按钮状态
    updateButton(isDark);
  }

  // 切换主题
  function toggleTheme() {
    const current = getCurrentTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  // 更新按钮显示
  function updateButton(isDark) {
    const btn = document.getElementById('theme-switch-btn');
    if (btn) {
      btn.textContent = isDark ? '☀️' : '🌙';
      btn.title = isDark ? '切换到亮色模式' : '切换到暗色模式';
      btn.setAttribute('aria-label', btn.title);
    }
  }

  // 初始化按钮
  function initButton() {
    // 如果按钮已存在则跳过
    if (document.getElementById('theme-switch-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'theme-switch-btn';
    btn.type = 'button';
    btn.style.cssText = `
      position: fixed;
      top: 15px;
      right: 15px;
      z-index: 9999;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid rgba(128,128,128,0.3);
      background: rgba(255,255,255,0.8);
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 0;
      line-height: 1;
    `;

    btn.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });

    btn.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    });

    btn.addEventListener('click', toggleTheme);

    document.body.appendChild(btn);
    updateButton(getCurrentTheme() === 'dark');
  }

  // 初始化逻辑
  function init() {
    // 读取存储的主题，如果没有则检测系统偏好
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTheme(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    // 初始化按钮
    initButton();

    // 监听系统主题变化（仅在用户未手动设置过时跟随）
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    // 键盘快捷键 Ctrl/Cmd + D
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleTheme();
      }
    });

    // 支持 URL 参数 ?theme=dark 或 ?theme=light
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get('theme');
    if (urlTheme === 'dark' || urlTheme === 'light') {
      setTheme(urlTheme);
    }
  }

  // 确保 DOM 就绪后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();