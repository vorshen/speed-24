import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let themeExtend: Record<string, unknown> = {};
try {
  const themePath = path.resolve(__dirname, 'src/data/theme.json');
  if (fs.existsSync(themePath)) {
    themeExtend = JSON.parse(fs.readFileSync(themePath, 'utf-8'));
  }
} catch {
  // theme.json 不存在或解析失败时使用空对象
}

/**
 * 将 theme.colors 扁平化为 --color-* 的 CSS 变量并注入 :root，
 * 这样页面内使用 var(--color-primary) 等时能拿到值（Tailwind 标准做法）。
 */
function flattenColorsToVars(
  colors: Record<string, unknown>,
  prefix = ''
): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) {
    if (value == null) continue;
    // DEFAULT 键对应主色，变量名用 prefix（如 primary），不用 primary-DEFAULT
    const name = key === 'DEFAULT' && prefix ? prefix : (prefix ? `${prefix}-${key}` : key);
    if (typeof value === 'string') {
      vars[name] = value;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(vars, flattenColorsToVars(value as Record<string, unknown>, name));
    }
  }
  return vars;
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx,js,jsx,html}'],
  theme: {
    extend: themeExtend,
  },
  plugins: [
    function ({ addBase, theme }: { addBase: (styles: Record<string, Record<string, string>>) => void; theme: (path: string) => unknown }) {
      const colors = theme('colors') as Record<string, unknown> | undefined;
      if (!colors || typeof colors !== 'object') return;
      const vars = flattenColorsToVars(colors);
      const root: Record<string, string> = {};
      for (const [name, value] of Object.entries(vars)) {
        root[`--color-${name}`] = value;
      }
      if (Object.keys(root).length > 0) {
        addBase({ ':root': root });
      }
    },
  ],
};
