'use strict';
exports.__esModule = true;
var VDomNode_1 = require('../VDomNode');
var node = new VDomNode_1['default']('h1');
node.addChild(new VDomNode_1['default']('test text'));
console.log(node);
