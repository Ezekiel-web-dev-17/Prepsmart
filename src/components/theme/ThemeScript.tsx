export default function ThemeScript() {
  const code = `
    (function() {
      try {
        var key = 'prepsmart-theme';
        var stored = localStorage.getItem(key);
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = stored === 'dark' || ((!stored || stored === 'system') && prefersDark);
        var root = document.documentElement;
        if (isDark) {
          root.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
          root.style.colorScheme = 'dark';
        } else {
          root.classList.remove('dark');
          root.setAttribute('data-theme', 'light');
          root.style.colorScheme = 'light';
        }
      } catch (e) {}
    })();
  `;

  return (
    <script
      id="theme-initializer"
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
