// Rewrite with snabbdom clone https://github.com/snabbdom/snabbdom/blob/master/src/package

export interface VNode {
  tag: string;
  props: VNodeProps;
  children: Array<VNode | string>;
  key: string | number | undefined;
}

export interface VNodeProps {
  attrs?: Record<string, string>;
  key?: string | number | undefined;
  ns?: string;
}

const ns = (props: VNodeProps, children: VNode[] | undefined, tag: string | undefined): void => {
  props.ns = 'http://www.w3.org/2000/svg';
  if (tag !== 'foreignObject' && children !== undefined) {
    for (const child of children) {
      const { props } = child;
      if (props !== undefined) {
        ns(props, (child as VNode).children as VNode[], child.tag);
      }
    }
  }
};

export const createElement = (
  tag: string,
  props: VNodeProps = {},
  children: Array<VNode | string> = []
): VNode => {
  const key = props?.key ?? undefined;
  if (tag === 'svg') ns(props, children as VNode[], tag);
  return { tag, props, children, key };
};

/*

createElement('h1', { attrs: { example: 'example' }, children: ['test', VNode]});

*/
