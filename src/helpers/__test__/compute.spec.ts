import compute from '../compute';

describe('.compute', () => {
  it('should compute correctly', () => {
    expect(compute('this.count + 1', { count: 0 })).toBe(1);
  });
});
