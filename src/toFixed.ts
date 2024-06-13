import type { RoundingMode } from './fractionConfig';
import { rounding } from './rounding';

/**
 * Converts a fraction represented by `numerator` and `denominator` to a fixed-point decimal representation with the specified number of decimal places and rounding mode.
 * @param numerator - The numerator of the fraction.
 * @param denominator - The denominator of the fraction.
 * @param decimalPlaces - The number of decimal places in the fixed-point decimal representation.
 * @param roundingMode - The rounding mode to be applied.
 * @param trailingZeros - Indicates whether trailing zeros should be included in the result.
 * @returns The fixed-point decimal representation of the fraction as a string.
 */
export const toFixed = ({
  numerator,
  denominator,
  decimalPlaces,
  roundingMode,
  trailingZeros,
}: {
  numerator: bigint;
  denominator: bigint;
  decimalPlaces: number;
  roundingMode: RoundingMode;
  trailingZeros: boolean;
}): string => {
  const isPositive = numerator * denominator >= 0n;
  const n = numerator > 0n ? numerator : -numerator;
  const d = denominator > 0n ? denominator : -denominator;
  const q = n / d; // quotient;

  let r = n % d; // reminder
  let carry = 0n;
  let decimalPartStr = '';
  let i = 0;

  while (r > 0n && i < decimalPlaces) {
    const x = r * 10n;
    decimalPartStr += x / d;
    r = x % d;
    i += 1;
  }

  if (r === 0n || decimalPartStr.length < decimalPlaces) {
    if (trailingZeros) {
      decimalPartStr = decimalPartStr.padEnd(decimalPlaces, '0');
    }
  } else {
    [carry, decimalPartStr] = rounding({
      integerPart: q,
      decimalPart: BigInt(decimalPartStr),
      decimalPlaces,
      nextDigit: (r * 10n) / d,
      roundingMode,
      isPositive,
    });
  }

  const integerPart = q + carry;

  const s = decimalPartStr
    ? `${integerPart}.${decimalPartStr}`
    : `${integerPart}`;

  return isPositive ? s : `-${s}`;
};
