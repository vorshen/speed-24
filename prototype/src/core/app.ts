// design-template code, don't change this file.
import '../global.css';

interface Blueprint {
  states: Array<{
    id: string;
    name: string;
    page: string;
    params: Record<string, any>;
  }>;
  initialState?: string;
}

interface AppState {
  id: string;
  name: string;
  page: string;
  params: Record<string, any>;
}

interface AppInterface {
  blueprint: Blueprint;
  store: any;
  theme: any;
  currentState: AppState;
  initPage(): void;
  createStateFromParams(pageName: string, urlParams: URLSearchParams): AppState;
  transitionTo(targetStateId: string, runtimeParams?: Record<string, any>): void;
  goBack(): void;
  renderCurrentPage(): void;
  renderError(error: Error): void;
}

export const App: AppInterface = {
  blueprint: { states: [] },
  store: null,
  theme: null,
  currentState: { id: '', name: '', page: '', params: {} },

  initPage() {
    // Initialize page with URL parameters
    const urlParams = new URLSearchParams(location.search);
    const stateId = urlParams.get('state');
    const pageName = urlParams.get('page');
    if (!pageName) {
      throw new Error('Page name not found');
    }
    if (!stateId) {
      App.renderError(new Error('State id not found'));
      return;
    }

    const getParamsFromUrl = (params: URLSearchParams) => {
      const runtimeParams: Record<string, any> = {};
      params.forEach((value, key) => {
        if (key !== 'state' && key !== 'page') {
          runtimeParams[key] =
            value === 'true' ? true : value === 'false' ? false : value;
        }
      });
      return runtimeParams;
    };
    const runtimeParams = getParamsFromUrl(urlParams);

    // 如果数据已经存在（通过 __INLINE_DATA__ 预加载），直接初始化 currentState 并渲染
    // Use the App singleton directly so detached calls still work.
    if (App.store && App.blueprint) {
      // Find state by ID and merge runtime params
      const state = App.blueprint.states.find((s) => s.id === stateId);
      if (state) {
        App.currentState = {
          ...state,
          params: { ...(state.params || {}), ...runtimeParams },
        };
      } else {
        App.renderError(new Error(`State ${stateId} not found`));
        return;
      }
      
      // Render the page
      App.renderCurrentPage();
      // @ts-ignore - lucide may not be available
      if (typeof lucide !== 'undefined') {
        // @ts-ignore
        lucide.createIcons();
      }
      return;
    }

    // 优先使用内联的 JSON 数据（生产环境），否则使用 fetch（开发环境）
    const loadData = () => {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.__INLINE_DATA__) {
        // @ts-ignore
        const inlineData = window.__INLINE_DATA__;
        return Promise.resolve([
          inlineData.blueprint,
          inlineData.store,
          inlineData.theme || {},
        ]);
      }

      // 开发环境或没有内联数据时，使用 fetch
      // 注意：在生产环境构建时，如果检测到有内联数据，DefinePlugin 会将 __INLINE_DATA_AVAILABLE__ 设为 true
      // 这样整个 fetch 分支会被 tree-shaking 移除（因为条件永远为 false，代码不可达）
      // @ts-ignore - __INLINE_DATA_AVAILABLE__ 是构建时定义的常量
      if (typeof __INLINE_DATA_AVAILABLE__ !== 'undefined' && __INLINE_DATA_AVAILABLE__) {
        // 生产环境有内联数据时，不应该执行到这里（因为上面应该已经返回了）
        // 但如果执行了，说明内联数据注入失败，返回空数据作为降级方案
        console.warn('Inline data expected but not found, using empty data');
        return Promise.resolve([null, null, {}]);
      }

      // 只有在开发环境或没有内联数据时才执行 fetch
      // 在生产环境有内联数据时，DefinePlugin 会将 __INLINE_DATA_AVAILABLE__ 设为 true
      // 这样整个 fetch 分支会被 tree-shaking 移除（因为上面的 if 条件永远为 true，代码不可达）
      return Promise.all([
        fetch('./data/blueprint.json').then((r) => r.json()),
        fetch('./data/store.json').then((r) => r.json()),
        fetch('./data/theme.json')
          .then((r) => r.json())
          .catch(() => ({})),
      ]);
    };

    // Load blueprint, store, and theme, then render
    loadData()
      .then(([blueprint, store, theme]) => {
        App.blueprint = blueprint;
        App.store = store;
        App.theme = theme;

        // Find state by ID and merge runtime params
        const state = App.blueprint?.states.find((s) => s.id === stateId);
        if (state) {
          App.currentState = {
            ...state,
            params: { ...(state.params || {}), ...runtimeParams },
          };
        } else {
          App.renderError(new Error(`State ${stateId} not found`));
          return;
        }

        // Render the page
        App.renderCurrentPage();
        // @ts-ignore - lucide may not be available
        if (typeof lucide !== 'undefined') {
          // @ts-ignore
          lucide.createIcons();
        }
      })
      .catch((e) => {
        console.error('Failed to load blueprint/store', e);
        App.renderError(e);
      });
  },

  createStateFromParams(pageName: string, urlParams: URLSearchParams): AppState {
    const params: Record<string, any> = {};
    urlParams.forEach((value, key) => {
      if (key !== 'state' && key !== 'page') {
        // Parse boolean values
        params[key] =
          value === 'true' ? true : value === 'false' ? false : value;
      }
    });
    return { id: 'dynamic', name: pageName, page: pageName, params };
  },

  transitionTo(targetStateId: string, runtimeParams?: Record<string, any>) {
    const state = App.blueprint?.states.find((s) => s.id === targetStateId);
    if (!state) {
      console.error(`State ${targetStateId} not found`);
      return;
    }

    const currentStateId = App.currentState ? App.currentState.id : null;
    
    // Merge blueprint params with runtime params
    const defaultParams = state.params || {};
    const finalParams = { ...defaultParams, ...(runtimeParams || {}) };

    // Send navigation request to parent frame
    window.parent.postMessage(
      {
        type: 'navigate',
        name: 'navigate',
        data: {
          currentStateId: currentStateId,
          targetStateId: targetStateId,
          params: finalParams,
          page: state.page,
        },
      },
      '*'
    );
  },

  goBack() {
    // Send go back request to parent frame
    window.parent.postMessage(
      {
        type: 'goBack',
        name: 'navigate',
      },
      '*'
    );
  },

  renderCurrentPage() {
    // This will be overridden by individual pages
    console.warn('renderCurrentPage() not implemented for this page');
  },

  renderError(error: Error) {
    const app = document.getElementById('root');
    if (app) {
      app.innerHTML = `
        <div class="p-8 text-center">
          <div class="text-red-500 font-bold mb-2">Error</div>
          <div class="text-gray-600">${error.message}</div>
        </div>
      `;
    }
  },
};

// Make App available globally
declare global {
  interface Window {
    App: typeof App;
    __INLINE_DATA__?: {
      blueprint?: any;
      store?: any;
      theme?: any;
    };
  }
  // 构建时定义的常量，用于条件编译
  const __INLINE_DATA_AVAILABLE__: boolean | undefined;
}

if (typeof window !== 'undefined') {
  window.App = App;
  
  // 自动初始化数据（优先使用内联数据，否则在需要时通过 fetch 加载）
  // 这样页面组件不需要关心数据初始化
  if (window.__INLINE_DATA__) {
    window.App.blueprint = window.__INLINE_DATA__.blueprint || null;
    window.App.store = window.__INLINE_DATA__.store || null;
    window.App.theme = window.__INLINE_DATA__.theme || null;
  }
}
