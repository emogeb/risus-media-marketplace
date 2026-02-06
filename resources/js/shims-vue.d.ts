declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Ziggy route helper
declare global {
  function route(name?: string, params?: any, absolute?: boolean): string;
}
