import VNode from './VNode';

export default class VDom {
  public virtRootNode: VNode;
  public realRootNode: HTMLElement;

  constructor(rootNode: HTMLElement) {
    this.virtRootNode = VNode.fromHTMLElement(rootNode);
    this.realRootNode = rootNode;
  }

  public renderAll(): void {
    // TODO: implement replacing the tree from the root
  }
}
