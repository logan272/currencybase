import { gcd } from './gcd';
import type { NumberIsh } from './types';

export type FractionPureData = {
  numerator: bigint;
  denominator: bigint;
};

export class FractionData {
  public static readonly ZERO = new FractionData(0n);
  public static readonly ONE = new FractionData(1n);
  public static simplify(value: [bigint, bigint]): [bigint, bigint] {
    const divisor = gcd(value[0], value[1]);
    const n = value[0] >= 0n ? value[0] / divisor : -value[0] / divisor;
    const d = value[1] >= 0n ? value[1] / divisor : -value[1] / divisor;
    const isNegative = value[0] * value[1] < 0n;
    return [isNegative ? -n : n, d];
  }
  public static tryParse(value: FractionIsh): FractionData | undefined {
    try {
      return new FractionData(value);
    } catch (_) {
      return undefined;
    }
  }
  public static parse(value: FractionIsh): [bigint, bigint] {
    if (value instanceof FractionData)
      return [value.numerator, value.denominator];
    if (
      typeof value === 'bigint' ||
      (typeof value === 'number' && Number.isInteger(value))
    )
      return [BigInt(value), 1n];

    const v = Number(value);

    if (Number.isNaN(v))
      throw new Error(`Cannot convert ${value} to a Fraction`);

    const s = typeof value === 'string' ? value.trim() : `${value}`;
    const [base, exp] = s.split('e');
    const [integer, decimal = ''] = base.split('.');

    if (!exp && !decimal) return [BigInt(integer), 1n];

    let d = 10n ** BigInt(decimal.length);
    let n = BigInt(integer);
    n = v > 0 ? n * d + BigInt(decimal) : n * d - BigInt(decimal);

    if (exp) {
      const e = BigInt(exp);

      if (e >= 0n) {
        n *= 10n ** e;
      } else {
        d *= 10n ** -e;
      }
    }

    return [n, d];
  }

  private _numerator: bigint;
  private _denominator: bigint;

  constructor(
    numerator: FractionIsh,
    denominator: FractionIsh = 1n,
    simplify = true,
  ) {
    const _n = FractionData.parse(numerator);
    const _d = FractionData.parse(denominator);
    let simplified: [bigint, bigint] = [_n[0] * _d[1], _n[1] * _d[0]];
    if (simplified[1] === 0n) throw new Error('Fraction denominator is zero');
    if (simplify) simplified = FractionData.simplify(simplified);
    this._numerator = simplified[0];
    this._denominator = simplified[1];
  }
  public get numerator(): bigint {
    return this._numerator;
  }
  public get denominator(): bigint {
    return this._denominator;
  }
  public clone(): FractionData {
    return new FractionData(this._numerator, this._denominator, false);
  }
  public pure(): FractionPureData {
    return {
      numerator: this._numerator,
      denominator: this._denominator,
    };
  }
  public toJSON() {
    return {
      numerator: this._numerator.toString(),
      denominator: this._denominator.toString(),
    };
  }
}

export type FractionIsh = FractionData | FractionPureData | NumberIsh;
