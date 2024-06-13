import { addSeparators } from './addSeparators';
import type { Config } from './fractionConfig';
import { DEFAULT_CONFIG, mergeWithDefaultConfig } from './fractionConfig';
import type { FractionIsh } from './fractionData';
import { FractionData } from './fractionData';
import { toExponential } from './toExponential';
import { toFixed } from './toFixed';
import { toPrecision } from './toPrecision';

export class FractionHelper {
  private _config: Config = DEFAULT_CONFIG;
  public set config(c: Partial<Config>) {
    this._config = mergeWithDefaultConfig(c);
  }
  public get config(): Config {
    return this._config;
  }
  constructor(c: Partial<Config> = DEFAULT_CONFIG) {
    this.config = c;
  }

  public static getRemainder(_value: FractionIsh): FractionData {
    const value = new FractionData(_value);
    return new FractionData(
      value.numerator % value.denominator,
      value.denominator,
    );
  }

  public static invert(_value: FractionIsh): FractionData {
    const value = new FractionData(_value);
    return FractionHelper.isZero(value)
      ? FractionData.ZERO.clone()
      : new FractionData(value.denominator, value.numerator);
  }

  public static negate(_value: FractionIsh): FractionData {
    return FractionHelper.mul(_value, -1n);
  }

  public static abs(_value: FractionIsh): FractionData {
    return FractionHelper.gt(_value, 0n)
      ? new FractionData(_value)
      : FractionHelper.negate(_value);
  }

  public static pow(_value: FractionIsh, n: number): FractionData {
    if (!Number.isInteger(n)) throw new Error('`n` must be an integer');
    let value = new FractionData(_value);
    if (n === 1) return value;
    let result = FractionData.ONE.clone();
    if (n === 0) return result;
    if (n < 0) {
      value = FractionHelper.invert(value);
      n = -n;
    }
    while (n > 0) {
      if (n % 2 === 1) result = FractionHelper.mul(result, value);
      value = FractionHelper.mul(value, value);
      n = Math.floor(n / 2);
    }
    return result;
  }

  public static shl(_value: FractionIsh, n: number): FractionData {
    if (!Number.isInteger(n)) throw new Error('`n` must be an integer');
    return FractionHelper.mul(_value, 10n ** BigInt(n));
  }

  public static shr(_value: FractionIsh, n: number): FractionData {
    if (!Number.isInteger(n)) throw new Error('`n` must be an integer');
    return FractionHelper.div(_value, 10n ** BigInt(n));
  }

  public static isZero(_value: FractionIsh): boolean {
    return FractionHelper.eq(_value, 0n);
  }

  public static isInteger(_value: FractionIsh): boolean {
    return FractionHelper.isZero(FractionHelper.getRemainder(_value));
  }

  private static compare(_a: FractionIsh, _b: FractionIsh): bigint {
    const a = new FractionData(_a);
    const b = new FractionData(_b);
    return a.numerator * b.denominator - b.numerator * a.denominator;
  }

  public static eq(a: FractionIsh, b: FractionIsh): boolean {
    return FractionHelper.compare(a, b) === 0n;
  }

  public static neq(a: FractionIsh, b: FractionIsh): boolean {
    return FractionHelper.compare(a, b) !== 0n;
  }

  public static lt(a: FractionIsh, b: FractionIsh): boolean {
    return FractionHelper.compare(a, b) < 0n;
  }

  public static lte(a: FractionIsh, b: FractionIsh): boolean {
    return FractionHelper.compare(a, b) <= 0n;
  }

  public static gt(a: FractionIsh, b: FractionIsh): boolean {
    return FractionHelper.compare(a, b) > 0n;
  }

  public static gte(a: FractionIsh, b: FractionIsh): boolean {
    return FractionHelper.compare(a, b) >= 0n;
  }

  public static add(_a: FractionIsh, _b: FractionIsh): FractionData {
    const a = new FractionData(_a);
    const b = new FractionData(_b);
    return new FractionData(
      a.numerator * b.denominator + b.numerator * a.denominator,
      a.denominator * b.denominator,
    );
  }

  public static sub(_a: FractionIsh, _b: FractionIsh): FractionData {
    const a = new FractionData(_a);
    const b = new FractionData(_b);
    return new FractionData(
      a.numerator * b.denominator - b.numerator * a.denominator,
      a.denominator * b.denominator,
    );
  }

  public static mul(_a: FractionIsh, _b: FractionIsh): FractionData {
    const a = new FractionData(_a);
    const b = new FractionData(_b);
    return new FractionData(
      a.numerator * b.numerator,
      a.denominator * b.denominator,
    );
  }

  public static div(_a: FractionIsh, _b: FractionIsh): FractionData {
    const a = new FractionData(_a);
    const b = new FractionData(_b);
    return new FractionData(
      a.numerator * b.denominator,
      a.denominator * b.numerator,
    );
  }

  public toFixed(
    _value: FractionIsh,
    decimalPlaces?: number,
    opts?: Config['toFormat'],
  ): string {
    const value = new FractionData(_value);
    decimalPlaces =
      decimalPlaces ??
      opts?.decimalPlaces ??
      this._config?.toFixed?.decimalPlaces ??
      this._config.decimalPlaces;

    if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0)
      throw new Error('`decimalPlaces` must be a >= 0 integer.');

    const roundingMode =
      opts?.roundingMode ??
      this._config.toFixed?.roundingMode ??
      this._config.roundingMode;
    const trailingZeros =
      opts?.trailingZeros ??
      this._config.toFixed?.trailingZeros ??
      this._config.trailingZeros;

    return toFixed({
      decimalPlaces,
      roundingMode,
      trailingZeros,
      numerator: value.numerator,
      denominator: value.denominator,
    });
  }

  public toPrecision(
    _value: FractionIsh,
    significantDigits?: number,
    opts?: Config['toPrecision'],
  ): string {
    const value = new FractionData(_value);
    significantDigits =
      significantDigits ??
      opts?.significantDigits ??
      this._config.toPrecision?.significantDigits ??
      this._config.significantDigits;

    if (!Number.isInteger(significantDigits) || significantDigits < 1)
      throw new Error(`'significantDigits' must be a  >= 1 integer.`);

    const roundingMode =
      opts?.roundingMode ??
      this._config.toPrecision?.roundingMode ??
      this._config.roundingMode;

    return toPrecision({
      significantDigits,
      roundingMode,
      numerator: value.numerator,
      denominator: value.denominator,
    });
  }

  toExponential(
    _value: FractionIsh,
    decimalPlaces?: number,
    opts?: Config['toExponential'],
  ): string {
    const value = new FractionData(_value);
    decimalPlaces =
      decimalPlaces ??
      opts?.decimalPlaces ??
      this._config.toExponential?.decimalPlaces ??
      this._config.decimalPlaces;

    if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0)
      throw new Error('`decimalPlaces` must be a >= 0 integer.');

    const roundingMode =
      opts?.roundingMode ??
      this._config.toExponential?.roundingMode ??
      this._config.roundingMode;

    const trailingZeros =
      opts?.trailingZeros ??
      this._config.toExponential?.trailingZeros ??
      this._config.trailingZeros;

    return toExponential({
      decimalPlaces,
      roundingMode,
      trailingZeros,
      numerator: value.numerator,
      denominator: value.denominator,
    });
  }

  public toFormat(value: FractionIsh, opts?: Config['toFormat']): string {
    const decimalPlaces =
      opts?.decimalPlaces ??
      this._config.toFormat?.decimalPlaces ??
      this._config.decimalPlaces;

    const roundingMode =
      opts?.roundingMode ??
      this._config.toFormat?.roundingMode ??
      this._config.roundingMode;

    const trailingZeros =
      opts?.trailingZeros ??
      this._config.toFormat?.trailingZeros ??
      this._config.trailingZeros;

    const groupSize =
      opts?.format?.groupSize ??
      this._config.toFormat?.format?.groupSize ??
      DEFAULT_CONFIG.toFormat.format.groupSize;

    const groupSeparator =
      opts?.format?.groupSeparator ??
      this._config.toFormat?.format?.groupSeparator ??
      DEFAULT_CONFIG.toFormat.format.groupSeparator;

    const decimalSeparator =
      opts?.format?.decimalSeparator ??
      this._config.toFormat?.format?.decimalSeparator ??
      DEFAULT_CONFIG.toFormat.format.decimalSeparator;

    const str = this.toFixed(value, decimalPlaces, {
      trailingZeros,
      roundingMode,
    });

    return addSeparators(str, {
      groupSize,
      groupSeparator,
      decimalSeparator,
    });
  }
}
