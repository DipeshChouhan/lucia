import IDomEvent from "./IDomEvent";
import IEventHandler from "./IEventHandler";

export type NodeAttribute = {
  attributeType: 'id' | 'class' | 'prop',
  value: string | string[],
}

/**
 * This is the most basic structure within maestro it represents a single DOM node ie a HTML element
 */
export default class DomNode {
  constructor(
    public htmlId: NodeAttribute,
    public htmlClass: NodeAttribute,
    public props: NodeAttribute[],
    public eventHandlers: IDomEvent[],
    private tainted: boolean = false,
    private rendered: boolean = false,
    public parent?: DomNode,
    public children?: DomNode | DomNode[]
  ) { }

  public isLeaf = () => !this.children;
  public isRoot = () => !this.parent;
  public needsRender = () => !this.rendered || this.tainted;
  public isTainted = () => this.tainted;

  /**
   * Add a single child to the 
   * @param child 
   */
  public addChild(child: DomNode): void {
    if (!this.children)
      this.children = child;
    else if (this.children && !(this.children instanceof Array))
      this.children = Array(this.children, child);
    else if (this.children && this.children instanceof Array)
      this.children.push(child);

    // Mark this node as tainted
    this.tainted = true;
  }
}
