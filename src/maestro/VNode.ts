import IEvent from './IEvent';
import fnv_1 from './helpers/fnv';

/**
 * This is the prefix used separate directives from properties
 * since this project aim is to be generic but was built 
 * primarily for use with lucia the default is 'l-' but
 * this should be changed at build time for uses other than lucia.
 */
const DIRECTIVE_PREFIX = 'l-';

type VNodeOptions = {
  tagName: string;
  textContent?: string;
  nodeValue?: string;
  innerText?: string;
  htmlId?: string;
  className?: string[];
  directives?: Map<string, string>;
  props?: Map<string, string>;
  key?: number;
  eventHandlers?: IEvent[];
  tainted?: boolean;
  parent?: VNode;
  children?: VNode[];
};

/**
 * This is the most basic structure within maestro it represents a single VDOM node ie a HTML element
 */
export default class VNode {
  private rendered: HTMLElement | null = null;
  private key: number;
  private tainted: boolean;
  private _tagName: string;
  private _textContent: string | undefined;
  private _nodeValue: string | undefined;
  private _innerText: string | undefined;
  private _htmlId: string | undefined;
  private _className: string[] | undefined;
  private _directives: Map<string, string> | undefined;
  private _props: Map<string, string> | undefined;
  private _eventHandlers: IEvent[] | undefined;
  private _parent: VNode | undefined;
  private _children: VNode[] | undefined;

  constructor({
    key,
    tagName,
    textContent,
    nodeValue,
    innerText,
    htmlId,
    className,
    directives,
    props,
    eventHandlers,
    parent,
    children,
    tainted,
  }: VNodeOptions) {
    if (typeof key === 'string') {
      this.key = this.hashString(key);
    } else if (key) {
      this.key = key;
    } else {
      this.key = fnv_1([0]);
    }

    this._tagName = tagName;
    this._textContent = textContent;
    this._nodeValue = nodeValue;
    this._innerText = innerText;
    this._htmlId = htmlId;
    this._className = className;
    this._directives = directives;
    this._props = props;
    this._eventHandlers = eventHandlers;
    this._parent = parent;
    this._children = children;
    this.tainted = tainted ?? true;
  }

  public isLeaf = () => !this.children;
  public isRoot = () => !this.parent;
  public needsRender = () => this.tainted;
  // TODO: figure out what to hash
  public uniqueKey = () => this.key;

  private hashString(str: string): number {
    const strCodes = str.split('').map((char) => char.codePointAt(0)!);
    const hash = fnv_1(strCodes);
    return hash;
  }

  public static walkToRoot(node: VNode): [VNode, number] {
    let at = node;
    let nth = 0;
    while (!at.isRoot) {
      nth++;
      at = node.parent!;
    }

    return [at, nth];
  }

  /**
   * Add a child to the node
   * @param child the DomNode to add as a child to this node
   */
  public appendChild(child: VNode): void {
    if (!this.children) {
      this.children = [child];
    } else {
      this.children.push(child);
    }

    // Make this node the parent of the added child
    child.parent = this;
  }

  /**
   * Change this node's parent, this will also add this node to the parent's child list
   * @param parent DomNode to set as the parent for this node
   */
  public setParent(parent: VNode): void {
    this.parent = parent;
    parent.appendChild(this);
  }

  /**
   * Render this node if rendering is needed return the already rendered node otherwise
   */
  public render(): HTMLElement {
    if (!this.needsRender()) {
      return this.rendered!;
    }
    this.rendered = document.createElement(this._tagName);
    this.rendered.id = this._htmlId || this.uniqueKey.toString();
    this.rendered.className = this._className?.join(' ') || '';
    this.props?.forEach((k, v) => {
      this.rendered!.setAttribute(k, v);
    });
    this.rendered.innerText = this.innerText || '';
    this.rendered.textContent = this._textContent || null;
    this.rendered.nodeValue = this._nodeValue || null;
    this.children?.forEach((child) => {
      this.rendered!.appendChild(child.render());
    });
    this.tainted = false;
    // if (!this.isLeaf) {
    //   this.children?.forEach(c => {
    //     // TODO: this is very crude still look into improvements here
    //     this.rendered!.appendChild(c.render());
    //   });
    // }
    return this.rendered;
  }

  // public static eq(left: VNode, right:VNode) {
  //   // TODO: figure out how to compare or bite the bullet and do kpk comp
  // }

  private static attributesToProps(attrs: NamedNodeMap): Map<string, string>[] {
    const props = [new Map<string, string>(), new Map<string, string>()];

    for (let i = 0; i < attrs.length; i++) {
      const { name, value } = attrs[i];

      if (name.startsWith(DIRECTIVE_PREFIX)) {
        props[0].set(name, value);
      } else {
        props[1].set(name, value);
      }
    }

    return props;
  }

  public static fromHTMLElement(elem: HTMLElement): VNode {
    const props = elem.hasAttributes() ? VNode.attributesToProps(elem.attributes) : undefined;

    const options: VNodeOptions = {
      tagName: elem.tagName.toLowerCase(),
      textContent: elem.textContent || undefined,
      nodeValue: elem.nodeValue || undefined,
      innerText: elem.innerText || undefined,
      htmlId: elem.id,
      className: elem.className.split(/ +/),
      directives: props ? props[0] : undefined,
      props: props ? props[1] : undefined,
    };

    return new VNode(options);
  }

  //#region propsGetSet
  get tagName() {
    return this._tagName;
  }

  set tagName(value: string) {
    this._tagName = value;
    this.tainted = true;
  }

  get textContent() {
    return this._textContent;
  }

  set textContent(value: string | undefined) {
    this._textContent = value;
    this.tainted = true;
  }

  get nodeValue() {
    return this._nodeValue;
  }

  set nodeValue(value: string | undefined) {
    this._nodeValue = value;
    this.tainted = true;
  }

  get innerText() {
    return this._innerText;
  }

  set innerText(value: string | undefined) {
    this._innerText = value;
    this.tainted = true;
  }

  get htmlId() {
    return this._htmlId;
  }

  set htmlId(value: string | undefined) {
    this._htmlId = value;
    this.tainted = true;
  }

  get className() {
    return this._className;
  }

  set className(value: string[] | undefined) {
    this._className = value;
    this.tainted = true;
  }

  get eventHandlers() {
    return this._eventHandlers;
  }

  set eventHandlers(value: IEvent[] | undefined) {
    this._eventHandlers = value;
    this.tainted = true;
  }

  get parent() {
    return this._parent;
  }

  set parent(value: VNode | undefined) {
    this._parent = value;
    this.tainted = true;
  }

  get children() {
    return this._children;
  }

  set children(value: VNode[] | undefined) {
    this._children = value;
    this.tainted = true;
  }

  get directives() {
    return this._directives;
  }

  get props() {
    return this._props;
  }
  //#endregion propsGetSet
}
