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
  clean?: boolean;
  parent?: VDomNode;
  children?: VDomNode[];
};

/**
 * This is the most basic structure within maestro it represents a single VDOM node ie a HTML element
 */
export default class VDomNode {
  private rendered: HTMLElement | null = null;
  private _tagName: string;
  private _textContent: string | undefined;
  private _nodeValue: string | undefined;
  private _innerText: string | undefined;
  private _htmlId: string[] | undefined;
  private _className: string[] | undefined;
  private _props: Map<string, string> | undefined;

  constructor(
    tagName: string,
    textContent?: string,
    nodeValue?: string,
    innerText?: string,
    htmlId?: string[],
    className?: string[],
    props?: Map<string, string>,
    public key?: number,
    public eventHandlers?: IDomEvent[],
    private tainted: boolean = false,
    private clean: boolean = false,
    public parent?: VDomNode,
    public children?: VDomNode[]
  ) {
    this._tagName = tagName;
    this._textContent = textContent;
    this._nodeValue = nodeValue;
    this._innerText = innerText;
    this._htmlId = htmlId;
    this._className = className;
    this._props = props;
  }

  public isLeaf = () => !this.children;
  public isRoot = () => !this.parent;
  public needsRender = () => !this.clean || this.tainted;
  public isTainted = () => this.tainted;
  // TODO: figure out what to hash
  public uniqueKey = () => this.key || fnv_1([0]);

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
    // Mark this node as tainted
    this.tainted = true;
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
    if (!this.needsRender) {
      return this.rendered!;
    }
    this.rendered = document.createElement(this._tagName);
    this.rendered.id = this._htmlId?.join(' ') || this.uniqueKey.toString();
    this.rendered.className = this._className?.join(' ') || '';
    this._props?.forEach((k, v) => {
      this.rendered!.setAttribute(k, v);
    });
    this.rendered.innerText = this.innerText || '';
    this.rendered.textContent = this._textContent || null;
    this.rendered.nodeValue = this._nodeValue || null;
    this.children?.forEach((child) => {
      this.rendered!.appendChild(child.render());
    });
    this.clean = true;
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
      props: VDomNode.attributesToProps(elem.attributes),
    };

    return new VDomNode(
      props.tagName,
      props.textContent,
      props.nodeValue,
      props.innerText,
      props.htmlId,
      props.className,
      props.props
    );
  }
}
