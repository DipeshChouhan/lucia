import VDomNode from './VDomNode';

export default class VDom {
  public virtRootNode: VDomNode;
  public realRootNode: HTMLElement;

  constructor(rootNode: HTMLElement) {
    this.virtRootNode = VDomNode.fromHTMLElement(rootNode);
    this.realRootNode = rootNode;
  }

  public renderAll(): void {
    // TODO: implement replacing the tree from the root
  }
}
