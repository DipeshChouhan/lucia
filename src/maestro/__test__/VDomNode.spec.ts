import VDomNode from '../VDomNode';

describe('VDomNode', () => {
  it('should create without errors', () => {
    new VDomNode('div');
  });
  it('should return the key', () => {
    const node = new VDomNode(
      'div',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      453
    );
    expect(node.key).toBe(453);
    expect(node.uniqueKey()).toBe(453);
  });
  it('should return a random hash', () => {
    const node = new VDomNode('div');
    expect(node.key).toBe(undefined);
    expect(node.uniqueKey()).toBe(84696352);
  });
  it('tainted should be false', () => {
    const node = new VDomNode('div');
    expect(node.isTainted()).toBe(false)
  })
  it('should append a child', () => {
    const node = new VDomNode('div');
    const child = new VDomNode('div');
    node.appendChild(child);
    expect(node.children).toEqual([child]);
    expect(node.isTainted()).toBe(true);
    expect(child.parent).toEqual(node);
    const child2 = new VDomNode('div');
    node.appendChild(child2);
    expect(node.children).toEqual([child, child2]);
    expect(node.isTainted()).toBe(true);
    expect(child2.parent).toEqual(node);
  });
  it('should set the parent', () => {
    const node = new VDomNode('div');
    const child = new VDomNode('div');
    child.setParent(node);
    expect(child.parent).toEqual(node);
    expect(node.isTainted()).toBe(true);
    expect(node.children).toEqual([child]);
  });
  it('should be the root', () => {
    const node = new VDomNode('div');
    expect(node.isRoot()).toBe(true);
  });
  it('should be a leaf', () => {
    const node = new VDomNode('div');
    expect(node.isLeaf()).toBe(true);
  });
  it('should not need render', () => {
    const node = new VDomNode('div', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, false);
    expect(node.needsRender()).toBe(false);
  });
  it('should need a render', () => {
    const node = new VDomNode('div', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
    expect(node.needsRender()).toBe(true);
  });
  it('should set tainted to true', () => {
    let node = new VDomNode('div');
    node.tagName = 'span';
    expect(node.isTainted()).toBe(true);
    node = new VDomNode('div');
    node.textContent = 'Foo!';
    expect(node.isTainted()).toBe(true);
    node = new VDomNode('div');
    node.nodeValue = 'Bar!';
    expect(node.isTainted()).toBe(true);
    node = new VDomNode('div');
    node.innerText = 'Foobar!';
    expect(node.isTainted()).toBe(true);
    node = new VDomNode('div');
    node.htmlId = ['id-here'];
    expect(node.isTainted()).toBe(true);
    node = new VDomNode('div');
    node.className = ['class-here'];
    expect(node.isTainted()).toBe(true);
    node = new VDomNode('div');
    node.eventHandlers = [];
    expect(node.isTainted()).toBe(true);
    node = new VDomNode('div');
    node.parent = new VDomNode('div');
    expect(node.isTainted()).toBe(true);
    node = new VDomNode('div');
    node.children = [new VDomNode('div')];
    expect(node.isTainted()).toBe(true);
  });
  it('should have getters working properly', () => {
    const parent = new VDomNode('div');
    const child = new VDomNode('div');
    const node = new VDomNode('div', 'Text Content', 'Node Value', 'Inner Text', ['html', 'id'], ['class', 'name'], undefined, undefined, [], false, parent, [child]);
    expect(node.tagName).toBe('div');
    expect(node.textContent).toBe('Text Content');
    expect(node.nodeValue).toBe('Node Value');
    expect(node.innerText).toBe('Inner Text');
    expect(node.htmlId).toEqual(['html', 'id']);
    expect(node.className).toEqual(['class', 'name']);
    expect(node.eventHandlers).toEqual([]);
    expect(node.parent).toEqual(parent);
    expect(node.children).toEqual([child]);
  });
});
