import compile from '../compile';

describe('.compile', () => {
  it('should compile a VNode tree', () => {
    const vdom = compile(document.createElement('div'));

    expect(vdom).toEqual({
      tag: 'div',
      children: [],
      props: {
        attributes: {},
        directives: {},
        type: 0,
        ref: undefined,
      },
    });
  });
  it('should detect key in directives', () => {
    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('l-text', 'foo');
    const vdom = compile(fakeElem, { foo: 'bar' });

    expect(vdom).toEqual({
      tag: 'div',
      children: [],
      props: {
        attributes: {},
        directives: {
          text: 'foo',
        },
        type: 2,
        ref: fakeElem,
      },
    });
  });
  it('should throw an error', () => {
    //@ts-ignore
    expect(() => compile()).toThrowError(new Error('Please provide a Element'));
  });
  it('should compile with children', () => {
    const fakeElem = document.createElement('div');
    const child = document.createElement('p');
    fakeElem.appendChild(child);
    const vdom = compile(fakeElem);

    expect(vdom).toEqual({
      tag: 'div',
      children: [
        {
          tag: 'p',
          children: [],
          props: {
            attributes: {},
            directives: {},
            type: 0,
            ref: undefined,
          },
        },
      ],
      props: {
        attributes: {},
        directives: {},
        type: 0,
        ref: undefined,
      },
    });
  });
  it('should compile components', () => {
    const fakeElem = document.createElement('div');
    const child = document.createElement('customcomponent');
    fakeElem.appendChild(child);
    const vdom = compile(fakeElem, {}, { CUSTOMCOMPONENT: () => `<p></p>` });

    expect(vdom).toEqual({
      tag: 'div',
      children: [
        {
          tag: 'p',
          children: [],
          props: {
            attributes: {},
            directives: {},
            type: 0,
            ref: undefined,
          },
        },
      ],
      props: {
        attributes: {},
        directives: {},
        type: 0,
        ref: undefined,
      },
    });
  });
});
