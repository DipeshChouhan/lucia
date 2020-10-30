import VDomNode from '../VDomNode';

describe('VDomNode', () => {
  it('should create without errors', () => {
    new VDomNode({ tagName: 'div' });
  });
  it('should return the key', () => {
    const node = new VDomNode({
      tagName: 'div',
      key: 453,
    });
    expect(node.uniqueKey()).toBe(453);
  });
  it('should return a random hash', () => {
    const node = new VDomNode({ tagName: 'div' });
    expect(node.uniqueKey()).toBe(84696352);
  });
  it('tainted should be true', () => {
    const node = new VDomNode({ tagName: 'div' });
    expect(node.needsRender()).toBe(true);
  });
  it('should append a child', () => {
    const node = new VDomNode({ tagName: 'div' });
    const child = new VDomNode({ tagName: 'div' });
    node.appendChild(child);
    expect(node.children).toEqual([child]);
    expect(node.needsRender()).toBe(true);
    expect(child.parent).toEqual(node);
    const child2 = new VDomNode({ tagName: 'div' });
    node.appendChild(child2);
    expect(node.children).toEqual([child, child2]);
    expect(node.needsRender()).toBe(true);
    expect(child2.parent).toEqual(node);
  });
  it('should set the parent', () => {
    const node = new VDomNode({ tagName: 'div' });
    const child = new VDomNode({ tagName: 'div' });
    child.setParent(node);
    expect(child.parent).toEqual(node);
    expect(node.needsRender()).toBe(true);
    expect(node.children).toEqual([child]);
  });
  it('should be the root', () => {
    const node = new VDomNode({ tagName: 'div' });
    expect(node.isRoot()).toBe(true);
  });
  it('should be a leaf', () => {
    const node = new VDomNode({ tagName: 'div' });
    expect(node.isLeaf()).toBe(true);
  });
  it('should not need render', () => {
    const node = new VDomNode({ tagName: 'div', tainted: false });
    expect(node.needsRender()).toBe(false);
  });
  it('should need a render', () => {
    const node = new VDomNode({ tagName: 'div' });
    expect(node.needsRender()).toBe(true);
  });
  it('should set tainted to true', () => {
    let node = new VDomNode({ tagName: 'div' });
    node.tagName = 'span';
    expect(node.needsRender()).toBe(true);
    node = new VDomNode({ tagName: 'div' });
    node.textContent = 'Foo!';
    expect(node.needsRender()).toBe(true);
    node = new VDomNode({ tagName: 'div' });
    node.nodeValue = 'Bar!';
    expect(node.needsRender()).toBe(true);
    node = new VDomNode({ tagName: 'div' });
    node.innerText = 'Foobar!';
    expect(node.needsRender()).toBe(true);
    node = new VDomNode({ tagName: 'div' });
    node.htmlId = ['id-here'];
    expect(node.needsRender()).toBe(true);
    node = new VDomNode({ tagName: 'div' });
    node.className = ['class-here'];
    expect(node.needsRender()).toBe(true);
    node = new VDomNode({ tagName: 'div' });
    node.eventHandlers = [];
    expect(node.needsRender()).toBe(true);
    node = new VDomNode({ tagName: 'div' });
    node.parent = new VDomNode({ tagName: 'div' });
    expect(node.needsRender()).toBe(true);
    node = new VDomNode({ tagName: 'div' });
    node.children = [new VDomNode({ tagName: 'div' })];
    expect(node.needsRender()).toBe(true);
  });
  it('should have getters working properly', () => {
    const parent = new VDomNode({ tagName: 'div' });
    const child = new VDomNode({ tagName: 'div' });
    const node = new VDomNode({
      tagName: 'div',
      textContent: 'Text Content',
      nodeValue: 'Node Value',
      innerText: 'Inner Text',
      htmlId: ['html', 'id'],
      className: ['class', 'name'],
      parent: parent,
      children: [child],
      props: undefined,
      key: undefined,
      eventHandlers: [],
      tainted: false,
    });
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
  it('should properly copy an html element', () => {
    const elem = document.createElement('div');
    elem.textContent = 'Text Content';
    elem.nodeValue = 'Node Value';
    elem.innerText = 'Inner Text';
    elem.id = 'html id';
    elem.className = 'class name';
    elem.hasAttributes = () => false;
    const node = VDomNode.fromHTMLElement(elem);
    expect(node.tagName).toBe('div');
    expect(node.textContent).toBe('Text Content');
    expect(node.nodeValue).toBe(undefined);
    expect(node.innerText).toBe('Inner Text');
    expect(node.htmlId).toEqual(['html', 'id']);
    expect(node.className).toEqual(['class', 'name']);
  });
  it('should render properly', () => {
    const node = new VDomNode({
      tagName: 'div',
      textContent: 'Text Content',
      nodeValue: 'Node Value',
      innerText: 'Inner Text',
      htmlId: ['html', 'id'],
      className: ['class', 'name'],
      props: undefined,
      key: undefined,
      eventHandlers: [],
    });
    const elem = document.createElement('div');
    elem.textContent = 'Text Content';
    elem.nodeValue = 'Node Value';
    elem.innerText = 'Inner Text';
    elem.id = 'html id';
    elem.className = 'class name';
    expect(node.render()).toEqual(elem);
  });
});
