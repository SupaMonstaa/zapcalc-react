import Operation from './Operation'

export default class Multiplication extends Operation {
  public static label = '×';

  public sign = Multiplication.label;

  public color = '#303080';

  public generateDigits (level: number): void {
    this.digit1 = Operation.rand(level, 30)
    this.digit2 = Operation.rand(2, 30)
  }

  public get stars (): number {
    let s = 1
    if (this.digit1 >= 10 || this.digit2 >= 10) {
      // Level 3 : < 9 or not a multiple of 10
      s = this.digit1 % 10 && this.digit1 % 10 ? 3 : 2
    } else if (this.digit1 >= 5 && this.digit2 >= 5) {
      s = 2
    } else {
      s = 1
    }
    return s
  }

  public get result (): number {
    return this.digit1 * this.digit2
  }
}
