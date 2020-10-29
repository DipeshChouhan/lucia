import VDomNode from '../VDomNode';

let node = new VDomNode('h1');
node.appendChild(new VDomNode('test text'));

console.log(node);
