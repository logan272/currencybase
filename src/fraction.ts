/* eslint-disable max-lines */
import type { Config } from './fractionConfig';
import type { FractionIsh as _FractionIsh } from './fractionData';
import { FractionData } from './fractionData';
import { FractionHelper } from './fractionHelper';

type FractionIsh = _FractionIsh | Fraction;

export class Fraction {
  // Fraction constants
  public readonly fractionData: FractionData;
  private static _helper = new FractionHelper();

  /**
   * Returns the current configuration.
   */
  public static get config(): Config {
    return Fraction._helper.config;
  }

  /**
   * Sets the configuration by merging with the provided partial configuration.
   * @param c - The partial configuration to merge.
   * @returns The updated configuration.
   */
  public static setConfig(c: Partial<Config>) {
    Fraction._helper.config = c;
  }

  /**
   * private instance getter.
   */
  private get helper(): FractionHelper {
    return Fraction._helper;
  }

  public get numerator(): bigint {
    return this.fractionData.numerator;
  }

  public get denominator(): bigint {
    return this.fractionData.denominator;
  }

  /**
   * Creates a new Fraction instance.
   * @param numerator - The numerator of the fraction.
   * @param denominator - The denominator of the fraction. (default: 1n)
   * @throws
   *  1. If the numerator or denominator is not a valid NumberIsh.
   *  2. If denominator is zero.
   *
   * ```ts
   * const a = new Fraction(1.23);
   * const b = new Fraction('1.23');
   * const c = new Fraction(123, 100);
   * const d = new Fraction(123n, 100n);
   * const e = new Fraction(123n, 100n);
   * const f = new Fraction(1230n, 1000n);
   * const g = new Fraction(a);
   *
   * a.eq(b); // true
   * a.eq(c); // true
   * a.eq(d); // true
   * a.eq(e); // true
   * a.eq(f); // true
   * a.eq(g); // true
   *
   * new Fraction('abc'); // throws
   * new Fraction('invalid NumberIsh'); // throws
   * ```
   */
  constructor(numerator: FractionIsh, denominator: FractionIsh = 1n) {
    this.fractionData = new FractionData(
      this.extractFractionIsh(numerator),
      this.extractFractionIsh(denominator),
    );
  }

  private extractFractionIsh(value: FractionIsh): _FractionIsh {
    return value instanceof Fraction ? value.fractionData : value;
  }

  /**
   * Gets the quotient of the fraction (the integer part of the division).
   * @returns The quotient of the fraction.
   *
   * ```ts
   * new Fraction('123.789').quotient; // 123n
   * new Fraction('0.789').quotient; // 0n
   * ```
   */
  public get quotient(): bigint {
    return this.fractionData.numerator / this.fractionData.denominator;
  }

  /**
   * Gets the remainder of the fraction as a new Fraction instance.
   * @returns A Fraction instance representing the remainder of the division.
   *
   * ```ts
   * const a = new Fraction(3, 2).remainder;
   * const b = new Fraction(1, 2);
   * a.eq(b); // true
   *
   * const c = new Fraction('123.789').remainder;
   * const d = new Fraction(123789 % 1000, 1000);
   * c.eq(d); // true
   * ```
   */
  public get remainder(): Fraction {
    return new Fraction(FractionHelper.getRemainder(this.fractionData));
  }

  /**
   * Inverts the fraction by swapping the numerator and denominator.
   * @returns The inverted fraction.
   *
   * ```ts
   * new Fraction('0.5').invert().eq(2); // true
   * new Fraction('0.25').invert().eq(4); // true
   * new Fraction(1, 3).invert().eq(3); // true
   * new Fraction(0).invert().eq(0); // true
   * ```
   */
  public invert(): Fraction {
    return new Fraction(FractionHelper.invert(this.fractionData));
  }

  /**
   * Negates the sign of the Fraction.
   * @returns The Fraction with the sign inverted.
   *
   * ```ts
   * new Fraction('123').negate().eq('-123'); // true
   *
   * const a = new Fraction('123.456');
   * const b = new Fraction('-123.456');
   * a.negate().eq(b); // true
   * ```
   */
  public negate(): Fraction {
    return new Fraction(FractionHelper.negate(this.fractionData));
  }

  /**
   * Returns the absolute value of the fraction.
   * @returns A new Fraction instance representing the absolute value of the fraction.
   *
   * ```ts
   * new Fraction('-123').abs().eq('123');
   * ```
   */
  public abs(): Fraction {
    return new Fraction(FractionHelper.abs(this.fractionData));
  }

  /**
   * (Shift Left) Shift the fraction left by n places.
   * @param n - The number of places to shift the Fraction by.
   * @returns A new Fraction representing the result of the left shift operation.
   * @throws If n is not a positive integer.
   *
   * ```ts
   * new Fraction(1).shl(3).eq(1000); // true
   * new Fraction(1).shl(4).eq(1000); // true
   * new Fraction('123').expandDecimals(18).eq(123n * 10n ** 18n); // true
   * ```
   */
  public shl(n: number): Fraction {
    return new Fraction(FractionHelper.shl(this.fractionData, n));
  }

  /**
   * (Shift Right) Shift the fraction right by n places.
   * @param n - The number of positions to shift the Fraction by.
   * @returns A new Fraction representing the result of the right shift operation.
   * @throws If n is not a positive integer.
   *
   * ```ts
   * new Fraction(1000).shr(3).eq(1); // true
   * new Fraction(1000).shr(4).eq(0.1); // true
   * new Fraction('123e18').normalizeDecimals(18).eq(123); // true
   * ```
   */
  public shr(n: number): Fraction {
    return new Fraction(FractionHelper.shr(this.fractionData, n));
  }

  /**
   * Checks if the fraction is zero.
   * @returns True if the fraction is zero, false otherwise.
   *
   * ```ts
   * new Fraction(0).isZero(); // true
   * new Fraction(100).isZero(); // false
   * ```
   */
  public isZero(): boolean {
    return FractionHelper.isZero(this.fractionData);
  }

  /**
   * Checks if the fraction is an integer.
   * @returns True if the fraction is an integer, false otherwise.
   *
   * ```ts
   * new Fraction(1).isInteger(); // true
   * new Fraction(1.1).isInteger(); // false
   * ```
   */
  public isInteger(): boolean {
    return FractionHelper.isInteger(this.fractionData);
  }

  /**
   * Checks if the fraction is equal to `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is equal to `other`, false otherwise.
   * @throws If other is not a valid NumberIsh
   */
  public eq(other: FractionIsh): boolean {
    return FractionHelper.eq(this.fractionData, this.extractFractionIsh(other));
  }

  /**
   * Checks if the fraction is not equal to `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is not equal to `other`, false otherwise.
   * @throws If other is not a valid NumberIsh
   */
  public neq(other: FractionIsh): boolean {
    return FractionHelper.neq(
      this.fractionData,
      this.extractFractionIsh(other),
    );
  }

  /**
   * Checks if the fraction is less than `other`.
   *
   * @param other - The value to compare with.
   * @returns True if the fraction is less than `other`, false otherwise.
   * @throws If other is not a valid NumberIsh
   */
  public lt(other: FractionIsh): boolean {
    return FractionHelper.lt(this.fractionData, this.extractFractionIsh(other));
  }

  /**
   * Checks if the fraction is less than or equal to `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is less than or equal to `other`, false otherwise.
   * @throws If other is not a valid NumberIsh
   */
  public lte(other: FractionIsh): boolean {
    return FractionHelper.lte(
      this.fractionData,
      this.extractFractionIsh(other),
    );
  }

  /**
   * Checks if the fraction is greater than `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is greater than `other`, false otherwise.
   * @throws If other is not a valid NumberIsh
   */
  public gt(other: FractionIsh): boolean {
    return FractionHelper.gt(this.fractionData, this.extractFractionIsh(other));
  }

  /**
   * Checks if the fraction is greater than or equal to `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is greater than or equal to `other`, false otherwise.
   * @throws If other is not a valid NumberIsh
   */
  public gte(other: FractionIsh): boolean {
    return FractionHelper.gte(
      this.fractionData,
      this.extractFractionIsh(other),
    );
  }

  /**
   * Adds `other` to the fraction.
   * @param other - The value to add.
   * @returns A new Fraction representing the sum.
   * @throws If other is not a valid NumberIsh
   */
  public add(other: FractionIsh): Fraction {
    return new Fraction(
      FractionHelper.add(this.fractionData, this.extractFractionIsh(other)),
    );
  }

  /**
   * Subtracts `other` from the fraction.
   * @param other - The value to subtract.
   * @returns A new Fraction representing the difference.
   * @throws If other is not a valid NumberIsh
   */
  public sub(other: FractionIsh): Fraction {
    return new Fraction(
      FractionHelper.sub(this.fractionData, this.extractFractionIsh(other)),
    );
  }

  /**
   * Multiplies the fraction by `other`.
   * @param other - The value to multiply by.
   * @returns A new Fraction representing the product.
   * @throws If other is not a valid NumberIsh
   */
  public mul(other: FractionIsh): Fraction {
    return new Fraction(
      FractionHelper.mul(this.fractionData, this.extractFractionIsh(other)),
    );
  }

  /**
   * Divides the fraction by `other`.
   * @param other - The value to divide by.
   * @returns A new Fraction representing the quotient.
   * @throws
   *  1. If other is not a valid NumberIsh.
   *  2. other is zero.
   */
  public div(other: FractionIsh): Fraction {
    return new Fraction(
      FractionHelper.div(this.fractionData, this.extractFractionIsh(other)),
    );
  }

  /**
   * Converts the fraction to a fixed-point decimal string representation.
   * @param decimalPlaces - The number of decimal places to include. (default: 0)
   * @param opts.roundingMode - The rounding mode to apply.
   * @param opts.trailingZeros - Whether to keep the decimal part trailing zeros.
   * @returns The fixed-point decimal string representation of the fraction.
   * @throws If `decimalPlaces` is not a positive integer.
   *
   * ```ts
   * new Fraction('123.567').toFixed(); // '124'
   * new Fraction('123.567', { roundingMode: RoundingMode.ROUND_HALF_DOWN }).toFixed(); // '123'
   * new Fraction('123.567').toFixed(1); // '123.6'
   * new Fraction('123.567').toFixed(2); // '123.57'
   * new Fraction('123.567', { roundingMode: RoundingMode.ROUND_DOWN } ).toFixed(2); // '123.56'
   * new Fraction('123.567').toFixed(3); // '123.567'
   * new Fraction('123.567').toFixed(4); // '123.5670'
   * new Fraction('123.567').toFixed(5); // '123.56700'
   * new Fraction('123.567').toFixed(5, { trailingZeros: false }); // '123.567'
   * ```
   */
  public toFixed(decimalPlaces?: number, opts?: Config['toFormat']): string {
    return this.helper.toFixed(this.fractionData, decimalPlaces, opts);
  }

  /**
   * Converts the fraction to a string representation with the specified significant digits.
   * @param significantDigits - The number of significant digits in the resulting string representation.
   * @param opts.roundingMode - The rounding mode to be applied.
   * @returns The string representation of the fraction with the specified number of significant digits.
   * @throws If `significantDigits` is not a >= 1 integer.
   *
   * ```ts
   * new Fraction('1234.567').toPrecision(1); // '1000'
   * new Fraction('1234.567').toPrecision(2); // '1200'
   * new Fraction('1234.567').toPrecision(3); // '1230'
   * new Fraction('1234.567').toPrecision(4); // '1235'
   * new Fraction('1234.567').toPrecision(4, { roundingMode: RoundingMode.ROUND_DOWN }); // '1234'
   * new Fraction('1234.567').toPrecision(5); // '1234.6'
   * new Fraction('1234.567').toPrecision(6); // '1234.57'
   * new Fraction('1234.567').toPrecision(7); // '1234.567'
   * new Fraction('1234.567').toPrecision(8); // '1234.5670'
   * new Fraction('1234.567').toPrecision(9); // '1234.56700'
   * ```
   */
  public toPrecision(
    significantDigits?: number,
    opts?: Config['toPrecision'],
  ): string {
    return this.helper.toPrecision(this.fractionData, significantDigits, opts);
  }

  /**
   * Converts a Fraction to a string of exponential representation.
   * @param decimalPlaces - The number of decimal places in the resulting string.
   * @param opts.roundingMode - The rounding mode to be applied.
   * @param opts.trailingZeros - Whether to keep the decimal part trailing zeros.
   * @returns The string of exponential representation of the fraction.
   * @throws If `decimalPlaces` is not a positive integer.
   *
   * ```ts
   * new Fraction(0).toExponential() // '0e+0'
   * new Fraction(0).toExponential(1) // '0.0e+0'
   * new Fraction('0.0000001234').toExponential(4) // '1.2340e-7'
   * new Fraction(1234.5678).toExponential(1) // '1.2e+3'
   * new Fraction(-1234.5678).toExponential(1) // '-1.2e+3'
   * new Fraction(1234.5678).toExponential(3) // '1.235e+3'
   * new Fraction(1234.5678).toExponential(5) // '1.23457e+3'
   * new Fraction(10n ** 100n).toExponential(2) // '1.00e+100'
   * ```
   */
  toExponential(
    decimalPlaces?: number,
    opts?: Config['toExponential'],
  ): string {
    return this.helper.toExponential(this.fractionData, decimalPlaces, opts);
  }

  /**
   * Converts the fraction to a formatted string representation.
   * @param opts.decimalPlaces - The number of decimal places to include. (default: 0)
   * @param opts.roundingMode - The rounding mode to use. (optional)
   * @param opts.format - The format to apply. (optional)
   * @returns The formatted string representation of the fraction.
   *
   * ```ts
   * new Fraction('1234.567').toFormat(); // '123,5'
   * new Fraction('1234.567').toFormat({ decimalPlaces: 1, format: { groupSeparator: '-' } }); // '123-4.6'
   * new Fraction('1234.567', {}).toFormat({ decimalPlaces: 1 }); // '123,4.6'
   * new Fraction('1234.567', {}).toFormat({ decimalPlaces: 1, roundingMode: RoundingMode.ROUND_DOWN }); // '123,4.5'
   * ```
   */
  public toFormat(opts?: Config['toFormat']): string {
    return this.helper.toFormat(this.fractionData, opts);
  }

  /**
   * Helper method for converting any super class back to a fraction
   * @returns A Fraction instance representing the current fraction.
   */
  public get asFraction(): Fraction {
    return new Fraction(
      this.fractionData.numerator,
      this.fractionData.denominator,
    );
  }

  /**
   * Converts the Fraction object to a JSON representation for avoiding serialization errors.
   */
  public toJSON() {
    return this.fractionData.toJSON();
  }
}
