import { v4 as uuidv4 } from 'uuid';

const securityValue = uuidv4();

export default class NumberInteger {
  private constructor(value: number, secValue: any) {
    if (secValue !== securityValue) {
      throw new Error('Invalid Instantiation');
    }
    (this as any)[securityValue] = {
      value,
    };
  }

  public get value(): number {
    return (this as any)[securityValue].value;
  }

  public equals(value: NumberInteger): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (!(value instanceof NumberInteger)) {
      return false;
    }
    return this.value === value.value;
  }

  public static create(value: number) {
    if (typeof value !== 'number') {
      throw new Error('Invalid Number Integer');
    }
    if (value % 1 !== 0) {
      throw new Error('Number Integer cannot be float or NaN');
    }
    if (value <= 0) {
      throw new Error('Number Integer cannot be less than 1');
    }
    return new NumberInteger(value, securityValue);
  }
}
