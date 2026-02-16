// design-template code, don't change this file.
// 通用页面入口，自动处理渲染逻辑和协议层加载

// 自动导入协议层，确保加载逻辑存在
import './app';

/**
 * 初始化页面渲染
 * @param PageComponent - 页面组件（React 组件）
 */
export function initPage(PageComponent: any) {
  // 渲染函数
  const renderPage = () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('Root element not found');
      return;
    }

    // 使用 React 18 的 createRoot API
    // @ts-ignore - ReactDOM from CDN may not have types
    if (typeof window.ReactDOM !== 'undefined' && window.ReactDOM.createRoot) {
      // @ts-ignore
      const root = window.ReactDOM.createRoot(rootElement);
      // @ts-ignore - React from CDN may not have types
      root.render(window.React.createElement(PageComponent));
    } else {
      console.error('ReactDOM is not available');
    }
  };

  // 重写 App.renderCurrentPage 方法
  if (typeof window !== 'undefined' && window.App) {
    window.App.renderCurrentPage = renderPage;
    
    // 始终调用 initPage 来初始化 currentState
    // initPage 会检测数据是否已存在，避免重复加载
    window.App.initPage();
  } else {
    console.error('window.App is not available');
  }
}
