import VDomNode from '../VDomNode';

let node = new VDomNode('h1');
node.addChild(new VDomNode('test text'));

console.log(node);
