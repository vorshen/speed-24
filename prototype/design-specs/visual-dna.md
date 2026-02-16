# Visual DNA - Design Specifications

> **Auto-generated design specifications for code implementation**
> 
> This document contains technical design tokens and component recipes.
> It is intended for the write-code tool and should not be included in user-facing PRD.

---

## 1. Visual Style & Material Metaphor

**设计理念：数字禅意 (Digital Zen)**
- **核心隐喻**: 博朗计算器 (Braun Calculator) —— 实体按键的触感，克制的色彩，极致的功能主义。
- **材质**: 哑光磨砂 (Matte Finish)。没有玻璃的油腻感，只有干燥、细腻的磨砂质感。
- **光影**: 柔和的漫反射光 (Soft Ambient Light)。不使用强烈的投影，依靠微弱的边框高光 (1px border highlight) 来区分层级。
- **氛围**: 沉浸、专注、心流。背景退后，数字向前。
- **形状**: 适度的圆角 (Rounded-lg/xl)，既不尖锐伤人，也不过于圆润幼稚，保持工具的专业感。

---

## 2. Color System (OKLCH)

**主题：暗夜霓虹 (Midnight Neon)**
- **背景色 (Canvas)**: oklch(0.18 0.006 285) - #18181B (Zinc-900) - 极致哑光黑，减少发光，专注内容。
- **卡片/容器 (Surface)**: oklch(0.23 0.012 284) - #27272A (Zinc-800) - 微弱的提升感。
- **主色 (Primary)**: oklch(0.68 0.18 35) - #F97316 (Orange-500) - 用于倒计时、Check按钮、选中状态。活力且警示。
- **次要色 (Secondary)**: oklch(0.55 0.12 245) - #6366F1 (Indigo-500) - 用于辅助功能或连胜标记。
- **文字 (Text-Primary)**: oklch(0.95 0.01 285) - #F4F4F5 (Zinc-100) - 几乎纯白，高对比度。
- **文字 (Text-Secondary)**: oklch(0.65 0.02 285) - #A1A1AA (Zinc-400) - 用于非关键信息。
- **错误 (Error)**: oklch(0.63 0.22 29) - #EF4444 (Red-500) - 倒计时结束或计算错误。
- **成功 (Success)**: oklch(0.72 0.15 155) - #10B981 (Emerald-500) - 计算成功时的微妙光晕。

### Tailwind Configuration

```javascript
// Add to tailwind.config.js theme.extend.colors
// Extract OKLCH values from the color system above
```

---

## 3. Typography System

**字体家族**:
- **数字/算式**: "JetBrains Mono", "Roboto Mono", monospace - 核心体验，等宽对齐，传达计算的严谨感。
- **UI 文本**: "Inter", "system-ui", sans-serif - 界面标签，清晰易读。

**字号系统**:
- **Display (牌面数字)**: text-4xl (36px) / leading-none / font-bold
- **Heading (算式)**: text-2xl (24px) / leading-tight / font-mono
- **Body (常规)**: text-base (16px) / font-medium
- **Caption (标签)**: text-xs (12px) / text-zinc-500 / tracking-wider uppercase

### Tailwind Configuration

```javascript
// Add to tailwind.config.js theme.extend
// fontFamily, fontSize, lineHeight, letterSpacing
```

---

## 4. Component Recipes (Tailwind Class Composition)

**1. 扑克牌 (Card)**
- base: "relative w-full aspect-[3/4] rounded-xl bg-zinc-800 border border-zinc-700/50 flex flex-col items-center justify-center transition-all duration-200"
- selected: "ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-900 -translate-y-2 shadow-lg shadow-orange-500/10"
- typography: "font-mono text-3xl font-bold text-zinc-100"

**2. 运算符按钮 (Operator Button)**
- base: "w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl text-zinc-300 hover:bg-zinc-700 active:scale-95 transition-all"
- active: "bg-zinc-700 text-white border-zinc-600"

**3. 全局功能按钮 (Action Button - Check/Reset)**
- primary (Check): "px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-wide shadow-lg shadow-orange-900/20 active:translate-y-0.5 transition-all"
- secondary (Reset/Undo): "px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-700/50 active:bg-zinc-750 transition-all"

**4. 倒计时条 (Progress Bar)**
- container: "w-full h-2 bg-zinc-800 rounded-full overflow-hidden"
- fill: "h-full bg-orange-500 transition-all duration-1000 ease-linear"

### Example Component Classes

```
Button Primary: "px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-600 transition-colors"
Card: "bg-white rounded-xl shadow-sm border border-gray-200 p-6"
Input: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
```

---

## 5. Animation Guidelines & Spring Physics

**核心原则：机械微动 (Mechanical Micro-interaction)**
- 并不是像果冻一样软弹，而是像机械键盘一样干脆利落。
- **点击反馈**: scale(0.96) + duration(100ms) + ease-out-quart。按下时瞬间缩小，松手时迅速回弹。
- **数字合并**: 当计算成功时，数字合并动画要有冲击力 (Scale up 1.1 -> 1.0)，伴随白色闪光。
- **错误震动**: 类似 iOS 密码错误的水平震动 (shake-x)，频率高，幅度小。
- **页面切换**: 极简的层级推移 (Slide Over)，不使用淡入淡出，保持硬切的利落感。

### Framer Motion Spring Presets

```javascript
// Recommended spring configurations
const springConfigs = {
  gentle: { tension: 120, friction: 14, mass: 1 },
  bouncy: { tension: 300, friction: 10, mass: 1 },
  snappy: { tension: 400, friction: 30, mass: 1 },
};
```

---

## Usage Notes

- **For write-code tool**: Read this file to understand the complete design system
- **Colors**: Use OKLCH format for better perceptual uniformity
- **Components**: Apply the class recipes consistently across all UI elements
- **Animations**: Use the spring physics parameters for natural, delightful motion
- **Consistency**: Maintain design token consistency throughout the entire application

---

*Generated at: 2026-02-16T04:10:11.118Z*
