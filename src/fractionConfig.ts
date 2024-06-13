/**
 * The available rounding modes.
 *
 * The default rounding mode is `ROUND_HALF_UP`
 */
export enum RoundingMode {
  /**
   * Rounds away zero
   *
   * Examples:
   *  1. 3.1 rounds to 4
   *  2. -3.1 rounds to -4.
   *  3. 3.8 rounds to 4
   *  4. -3.8 rounds to -4.
   */
  ROUND_UP = 0,

  /**
   * Rounds towards zero
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -3.
   *  3. 3.8 rounds to 3
   *  4. -3.8 rounds to -3.
   */
  ROUND_DOWN = 1,

  /**
   * Rounds towards Infinity
   *
   * Examples:
   *  1. 3.1 rounds to 4
   *  2. -3.1 rounds to -3.
   *  3. 3.8 rounds to 4
   *  4. -3.8 rounds to -3.
   */
  ROUND_CEIL = 2,

  /**
   * Rounds towards -Infinity
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -4.
   *  3. 3.8 rounds to 3
   *  4. -3.8 rounds to -4.
   */
  ROUND_FLOOR = 3,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds away zero
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -3.
   *  3. 3.5 rounds to 4.
   *  4. -3.5 rounds to -4.
   *  5. 3.8 rounds to 4
   *  6. -3.8 rounds to -4.
   */
  ROUND_HALF_UP = 4,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards zero
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -3.
   *  3. 3.5 rounds to 3.
   *  4. -3.5 rounds to -3.
   *  5. 3.8 rounds to 4
   *  6. -3.8 rounds to -4.
   */
  ROUND_HALF_DOWN = 5,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards even neighbour
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -3.
   *  3. 3.5 rounds to 4.
   *  4. -3.5 rounds to -4.
   *  5. 2.5 rounds to 2.
   *  6. -2.5 rounds to -2.
   *  7. 3.8 rounds to 4
   *  8. -3.8 rounds to -4.
   */
  ROUND_HALF_EVEN = 6,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards Infinity
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -3.
   *  3. 3.5 rounds to 4.
   *  4. -3.5 rounds to -3.
   *  5. 3.8 rounds to 4
   *  6. -3.8 rounds to -4.
   */
  ROUND_HALF_CEIL = 7,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards -Infinity
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -3.
   *  3. 3.5 rounds to 3.
   *  4. -3.5 rounds to -4.
   *  5. 3.8 rounds to 4
   *  6. -3.8 rounds to -4.
   */
  ROUND_HALF_FLOOR = 8,
}

/**
 * Configuration options for the {@link Fraction } class.
 */
export type Config = {
  /**
   * The rounding mode to use when rounding the Fraction.
   * It only apply to methods that may incur rounding(irrational methods),
   * or converting to a or number/string representation.
   */

  roundingMode: RoundingMode;
  /**
   * The number of decimal places to round to.
   * It only apply to methods that may incur rounding(irrational methods),
   * or converting to a or number/string representation.
   */
  decimalPlaces: number;

  /**
   * The maximum number of decimal places preserved in the Fraction, it only apply to methods that incur rounding(irrational method).
   */
  maxDecimalPlaces: number;

  /**
   * The number of significant digits to preserve when calling the {@link Fraction.toPrecision | Fraction..toPrecision} method.
   */
  significantDigits: number;

  /**
   * Determines whether trailing zeros are preserved when converting the Fraction to a string representation.
   */
  trailingZeros: boolean;

  /**
   * Optional configuration for the {@link Fraction.toFixed | Fraction.toFixed} method.
   */
  toFixed?: {
    /**
     * The number of decimal places to round to.
     */
    decimalPlaces?: number;

    /**
     * The {@link RoundingMode | rounding mode} to be applied.
     */
    roundingMode?: RoundingMode;

    /**
     * Determines whether trailing zeros are preserved.
     */
    trailingZeros?: boolean;
  };

  /**
   * Optional configuration for the {@link Fraction.toPrecision | Fraction.toPrecision} method.
   */
  toPrecision?: {
    /**
     * The number of significant digits to preserve when using the toPrecision() method.
     */
    significantDigits?: number;

    /**
     * The rounding mode.
     */
    roundingMode?: RoundingMode;
  };

  /**
   * Optional configuration for the toExponential() method.
   */
  toExponential?: {
    /**
     * The number of decimal places to round to when using the toExponential() method.
     */
    decimalPlaces?: number;

    /**
     * The {@link RoundingMode | rounding mode} to be applied.
     */
    roundingMode?: RoundingMode;

    /**
     * Determines whether trailing zeros are preserved when using the toExponential() method.
     */
    trailingZeros?: boolean;
  };

  /**
   * Optional configuration for the toFormat() method.
   */
  toFormat?: {
    /**
     * The number of decimal places to round to when using the toFormat() method.
     */
    decimalPlaces?: number;

    /**
     * The {@link RoundingMode | rounding mode} to be applied.
     */
    roundingMode?: RoundingMode;

    /**
     * Determines whether trailing zeros are preserved.
     */
    trailingZeros?: boolean;

    /**
     * Formatting options for the {@link Fraction.toFormat | Fraction.toFormat} method.
     */
    format?: {
      /**
       * The grouping size of the integer part, default to `3`.
       */
      groupSize?: number;

      /**
       * The grouping separator of the integer part, default to `,`.
       */
      groupSeparator?: string;

      /**
       * The decimal separator, default to `.`.
       */
      decimalSeparator?: string;
    };
  };
};

/**
 * Default configuration options for the Fraction class.
 *
 * @see {@link Config}
 */
export const DEFAULT_CONFIG = {
  roundingMode: RoundingMode.ROUND_HALF_UP,
  decimalPlaces: 0,
  maxDecimalPlaces: 20,
  significantDigits: 1,
  trailingZeros: true,
  toFormat: {
    format: {
      groupSize: 3,
      groupSeparator: ',',
      decimalSeparator: '.',
    },
  },
} as const;

/**
 * Merges a partial configuration object with the default configuration.
 * @param c - The partial configuration object to merge.
 * @returns A configuration object with default values merged with the provided partial configuration.
 */
export const mergeWithDefaultConfig = (c: Partial<Config>): Config => {
  return {
    ...DEFAULT_CONFIG,
    ...c,
    toFormat: {
      ...c.toFormat,
      format: {
        ...DEFAULT_CONFIG.toFormat.format,
        ...c.toFormat?.format,
      },
    },
  };
};
