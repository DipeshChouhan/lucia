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
});
