// Exports wrapped in Lucia namespace

import { App, createApp } from './App';

import { h, render } from './vdom/h';
import compile from './vdom/compile';
import patch from './vdom/patch';
import observer from './vdom/observer';

import { props, DIRECTIVE_PREFIX } from './vdom/utils/props';
import { computeProperties as compute, safeEval } from './vdom/utils/compute';

export { App, createApp, h, render, compile, patch, observer, props, compute };

export const component = (name: string, cb: Function) => {
  return { name, cb };
};

// Lucia.use function for user provided views in JavaScript
export const use = (
  name: string,
  view: Record<string, unknown>,
  ...components: Record<string, Function>[]
): App | void => {
  const elements = Array.from(document.querySelectorAll(`[${DIRECTIVE_PREFIX}use]`));
  const element = elements.filter((el) => el.getAttribute(`${DIRECTIVE_PREFIX}use`) === name)[0];
  const app = createApp(view);

  components.map(({ name, cb }: Record<string, string | Function>) => {
    app.component(name as string, cb as Function);
  });
  app.mount(element);
  return app;
};

// Init function if requested. Normally used if l-use but no Lucia.use is provided
export const init = (element: HTMLElement | Document = document, directive: string = 'use') => {
  const elements = Array.from(element.querySelectorAll(`[${DIRECTIVE_PREFIX + directive}]`));

  elements.map((el) => {
    const view = el.getAttribute(DIRECTIVE_PREFIX + directive);
    if (view === null) return;

    try {
      const app = createApp(safeEval(view));
      app.mount(el);
    } catch (err) {}
  });
};
