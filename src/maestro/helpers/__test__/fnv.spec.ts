import fnv_1 from '../fnv';

describe('.fnv_1', () => {
    it('should return the correct value', () => {
        expect(fnv_1([0], true)).toBe(-35716716020605664);
    });
});