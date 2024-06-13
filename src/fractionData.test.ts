/* eslint-disable max-lines */
import { FractionData } from './fractionData';

describe('FractionData', () => {
  describe('denominator is zero', () => {
    it('should pass', () => {
      expect(new FractionData(0n, 1n).numerator).toBe(0n);
    });
    it('should throw', () => {
      expect(() => new FractionData(1n, 0n)).toThrow(
        'Fraction denominator is zero',
      );
    });
  });
  describe('parse', () => {
    it('should pass', () => {
      expect(
        FractionData.parse({
          numerator: 10n,
          denominator: 1n,
        }),
      ).toEqual([10n, 1n]);
      expect(new FractionData(10, 1).pure()).toEqual({
        numerator: 10n,
        denominator: 1n,
      });
      expect(new FractionData(10, 2).pure()).toEqual({
        numerator: 5n,
        denominator: 1n,
      });
      expect(new FractionData(10, 2, false).pure()).toEqual({
        numerator: 10n,
        denominator: 2n,
      });
      expect(FractionData.parse(1)).toEqual([1n, 1n]);
      expect(FractionData.parse('1')).toEqual([1n, 1n]);
      expect(FractionData.parse('1.1')).toEqual([11n, 10n]);
      expect(FractionData.parse('1.1e1')).toEqual([110n, 10n]);
      expect(FractionData.parse('1.1e-1')).toEqual([11n, 100n]);
      expect(FractionData.parse('1e1')).toEqual([10n, 1n]);
      expect(FractionData.parse('1e-1')).toEqual([1n, 10n]);
    });
    it('should throw', () => {
      expect(() => FractionData.parse('1e1.1')).toThrow();
      expect(() => FractionData.parse('1e-1.1')).toThrow();
      expect(() => FractionData.parse('a')).toThrow();
    });
  });

  describe('sign', () => {
    it('always numerator', () => {
      expect(new FractionData(1, 1).numerator).toBe(1n);
      expect(new FractionData(-1, 1).numerator).toBe(-1n);
      expect(new FractionData(1, 1).numerator).toBe(1n);
      expect(new FractionData(1, -1).numerator).toBe(-1n);
    });
  });
});
