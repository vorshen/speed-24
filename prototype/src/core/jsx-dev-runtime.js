// design-template code, don't change this file.
// 提供 jsxDEV 函数，从全局 React 对象获取
// 注意：我们使用生产版本的 React CDN，但通过自定义 jsxDEV 函数来注入 __source 属性
// SWC 的 development: true 会生成 source 信息并调用我们的 jsxDEV 函数

// 全局唯一 ID 计数器
let sourceIdCounter = 0;

// 生成全局唯一的 source ID
const generateSourceId = () => {
  return ++sourceIdCounter;
};

// 从完整路径中提取 /workspace 开头的路径部分
const extractWorkspacePath = (fullPath) => {
  if (!fullPath) return fullPath;
  const match = fullPath.match(/(\/workspace\/.+)/);
  return match ? match[1] : fullPath;
};

// 确保在模块加载时 React 已经可用
const getReact = () => {
  if (typeof window !== 'undefined' && window.React) {
    return window.React;
  }
  // 如果 React 还没加载，抛出错误
  throw new Error(
    'React is not loaded. Please ensure React development CDN is loaded before this script.'
  );
};

// jsx 函数用于单个子元素
export function jsx(type, config, maybeKey) {
  const React = getReact();
  
  let propName;
  const props = {};
  let key = null;
  let ref = null;

  if (maybeKey !== undefined) {
    key = '' + maybeKey;
  }

  if (config != null) {
    if (config.key !== undefined) {
      key = '' + config.key;
    }
    if (config.ref !== undefined) {
      ref = config.ref;
    }
    for (propName in config) {
      if (
        Object.prototype.hasOwnProperty.call(config, propName) &&
        propName !== 'key' &&
        propName !== 'ref'
      ) {
        props[propName] = config[propName];
      }
    }
  }

  if (key) {
    props.key = key;
  }
  if (ref) {
    props.ref = ref;
  }

  return React.createElement(type, props);
}

// jsxs 函数用于静态子元素（多个子元素）
export function jsxs(type, config, maybeKey) {
  return jsx(type, config, maybeKey);
}

// React 18 开发版本的 UMD 构建不直接暴露 jsxDEV
// 我们需要使用 React.createElement 并手动添加 __source 属性
export function jsxDEV(type, props, key, isStaticChildren, source, self) {
  const React = getReact();
  const { children, ...restProps } = props || {};
  
  // 构建 source 对象
  const sourceObj = source || null;
  
  // 创建元素并添加 __source 属性（用于 React DevTools）
  // 同时将 source 信息添加到 data-source 属性中（用于在 DOM 中可见）
  const elementProps = {
    ...restProps,
    key,
    __source: sourceObj, // React 内部属性，用于 DevTools
    __self: self,
  };
  
  // 为每个元素生成全局唯一的 source ID
  elementProps['data-source-id'] = generateSourceId();
  
  // 将 source 信息添加到 data 属性中，这样可以在 DOM 中看到
  if (sourceObj && (sourceObj.fileName || sourceObj.lineNumber)) {
    const fileName = extractWorkspacePath(sourceObj.fileName);
    elementProps['data-source'] = `${fileName || ''}:${sourceObj.lineNumber || ''}:${sourceObj.columnNumber || ''}`;
    if (fileName) {
      elementProps['data-source-file'] = fileName;
    }
    if (sourceObj.lineNumber) {
      elementProps['data-source-line'] = String(sourceObj.lineNumber);
    }
    if (sourceObj.columnNumber) {
      elementProps['data-source-column'] = String(sourceObj.columnNumber);
    }
  }
  
  const element = React.createElement(
    type,
    elementProps,
    children
  );
  
  return element;
}

// Fragment 从 React 获取
export const Fragment = (() => {
  const React = getReact();
  return React.Fragment;
})();
