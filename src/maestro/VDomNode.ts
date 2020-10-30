import IDomEvent from './IDomEvent';
import fnv_1 from './helpers/fnv';

type VDomNodeProps = {
  tagName: string;
  textContent?: string;
  nodeValue?: string;
  innerText?: string;
  htmlId?: string[];
  className?: string[];
  props?: Map<string, string>;
  key?: number;
  eventHandlers?: IDomEvent[];
  tainted?: boolean;
  parent?: VDomNode;
  children?: VDomNode[];
};

/**
 * This is the most basic structure within maestro it represents a single VDOM node ie a HTML element
 * note on direct usage: use the setter methods to set the properties of a node to ensure it will be marked as tainted
 */
export default class VDomNode {
  private rendered: HTMLElement | null = null;
  private key: number;
  private tainted: boolean;
  private _tagName: string;
  private _textContent: string | undefined;
  private _nodeValue: string | undefined;
  private _innerText: string | undefined;
  private _htmlId: string[] | undefined;
  private _className: string[] | undefined;
  private _props: Map<string, string> | undefined;
  private _eventHandlers: IDomEvent[] | undefined;
  private _parent: VDomNode | undefined;
  private _children: VDomNode[] | undefined;

  constructor(props: VDomNodeProps) {
    let resolvedKey = 0;
    if (typeof props.key === 'string') {
      resolvedKey = this.hashString(props.key);
    } else if (props.key) {
      resolvedKey = props.key;
    } else {
      resolvedKey = fnv_1([0]);
    }

    this._tagName = props.tagName;
    this._textContent = props.textContent;
    this._nodeValue = props.nodeValue;
    this._innerText = props.innerText;
    this._htmlId = props.htmlId;
    this._className = props.className;
    this._props = props.props;
    this._eventHandlers = props.eventHandlers;
    this._parent = props.parent;
    this._children = props.children;
    this.tainted = typeof props.tainted !== 'undefined' ? props.tainted : true;
    this.key = resolvedKey;
  }

  public isLeaf = () => !this.children;
  public isRoot = () => !this.parent;
  public needsRender = () => this.tainted;
  // TODO: figure out what to hash
  public uniqueKey = () => this.key;

  private hashString(str: string): number {
    const strCodes = str.split('').map((c) => c.codePointAt(0)!);
    const hash = fnv_1(strCodes);
    return hash;
  }

  public static walkToRoot(node: VDomNode): [VDomNode, number] {
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
  public appendChild(child: VDomNode): void {
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
  public setParent(parent: VDomNode): void {
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
    this.rendered.id = this._htmlId?.join(' ') || this.uniqueKey.toString();
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
    return this.rendered;
  }

  private static attributesToProps(attrs: NamedNodeMap): Map<string, string> {
    return new Map<string, string>(Array(attrs.length).map((i) => [attrs[i].name, attrs[i].value]));
  }

  public static fromHTMLElement(elem: HTMLElement): VDomNode {
    let props: VDomNodeProps = {
      tagName: elem.tagName.toLowerCase(),
      textContent: elem.textContent || undefined,
      nodeValue: elem.nodeValue || undefined,
      innerText: elem.innerText || undefined,
      htmlId: elem.id.split(' '),
      className: elem.className.split(' '),
      props: elem.hasAttributes() ? VDomNode.attributesToProps(elem.attributes) : undefined,
    };

    return new VDomNode(props);
  }

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

  set htmlId(value: string[] | undefined) {
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

  set eventHandlers(value: IDomEvent[] | undefined) {
    this._eventHandlers = value;
    this.tainted = true;
  }

  get parent() {
    return this._parent;
  }

  set parent(value: VDomNode | undefined) {
    this._parent = value;
    this.tainted = true;
  }

  get children() {
    return this._children;
  }

  set children(value: VDomNode[] | undefined) {
    this._children = value;
    this.tainted = true;
  }

  get props() {
    return this._props;
  }
}
