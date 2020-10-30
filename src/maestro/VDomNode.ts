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

  constructor(
    public tagName: string,
    public textContent?: string,
    public nodeValue?: string,
    public innerText?: string,
    public htmlId?: string[],
    public className?: string[],
    public props?: Map<string, string>,
    public key?: number,
    public eventHandlers?: IDomEvent[],
    private tainted: boolean = false,
    private clean: boolean = false,
    public parent?: VDomNode,
    public children?: VDomNode[]
  ) {}

  public isLeaf = () => !this.children;
  public isRoot = () => !this.parent;
  public needsRender = () => !this.clean || this.tainted;
  public isTainted = () => this.tainted;
  // TODO: figure out what to hash
  public uniqueKey = () => this.key || fnv_1([0]);

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
    this.rendered = document.createElement(this.tagName);
    this.rendered.id = this.htmlId?.join(' ') || this.uniqueKey.toString();
    this.rendered.className = this.className?.join(' ') || '';
    this.props?.forEach((k, v) => {
      this.rendered!.setAttribute(k, v);
    });
    this.rendered.innerText = this.innerText || '';
    this.rendered.textContent = this.textContent || null;
    this.rendered.nodeValue = this.nodeValue || null;
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
