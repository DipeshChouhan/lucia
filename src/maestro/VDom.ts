import VDomNode from './VDomNode';

export default class VDom {
  constructor(rootNode: HTMLElement) {
    VDomNode.fromHTMLElement(rootNode);
  }
}
