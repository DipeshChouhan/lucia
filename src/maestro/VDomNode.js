'use strict';
exports.__esModule = true;
var fnv_2 = require('./lib/fnv');
/**
 * This is the most basic structure within maestro it represents a single VDOM node ie a HTML element
 */
var vDomNode = /** @class */ (function () {
  function vDomNode(
    htmlTag,
    textContent,
    nodeValue,
    key,
    htmlId,
    className,
    props,
    eventHandlers,
    tainted,
    rendered,
    parent,
    children
  ) {
    var _this = this;
    if (tainted === void 0) {
      tainted = false;
    }
    if (rendered === void 0) {
      rendered = false;
    }
    this.htmlTag = htmlTag;
    this.textContent = textContent;
    this.nodeValue = nodeValue;
    this.key = key;
    this.htmlId = htmlId;
    this.className = className;
    this.props = props;
    this.eventHandlers = eventHandlers;
    this.tainted = tainted;
    this.rendered = rendered;
    this.parent = parent;
    this.children = children;
    this.isLeaf = function () {
      return !_this.children;
    };
    this.isRoot = function () {
      return !_this.parent;
    };
    this.needsRender = function () {
      return !_this.rendered || _this.tainted;
    };
    this.isTainted = function () {
      return _this.tainted;
    };
    // TODO: figure out what to hash
    this.uniqueKey = function () {
      return _this.key || fnv_2['default']([0]);
    };
  }
  /**
   * Add a child to the node
   * @param child the DomNode to add as a child to this node
   */
  vDomNode.prototype.addChild = function (child) {
    if (!this.children) this.children = child;
    else if (this.children && !(this.children instanceof Array))
      this.children = Array(this.children, child);
    else if (this.children && this.children instanceof Array) this.children.push(child);
    // Make this node the parent of the added child
    child.parent = this;
    // Mark this node as tainted
    this.tainted = true;
  };
  /**
   * Change this node's parent, this will also add this node to the parent's child list
   * @param parent DomNode to set as the parent for this node
   */
  vDomNode.prototype.chParent = function (parent) {
    this.parent = parent;
    parent.addChild(this);
  };
  return vDomNode;
})();
exports['default'] = vDomNode;
