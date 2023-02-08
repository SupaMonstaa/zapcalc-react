import Operation from './Operation'

export default class Substraction extends Operation {
  public static label = '-';

  public sign = Substraction.label;

  public color = '#800060';

  protected generateDigits (): void {
    this.digit1 = Operation.rand(10, 70)
    this.digit2 = Operation.rand(1, this.digit1)
  }

  public get stars (): number {
    let s = 1
    const deduction = this.digit1 % 10 < this.digit2 % 10
    if (this.digit2 > 10 &&
        this.result > 10 &&
        deduction) {
      // a deduction and a big result
      s = 3
    } else if (this.digit1 >= 30 && this.digit2 < 10 && deduction) {
      s = 2
    } else if (this.digit1 >= 20 && this.digit2 >= 10) {
      // big numbers
      s = (this.digit1 % 10 === 0 || this.digit2 % 10 === 0 || this.digit2 <= 20) ? 2 : 3
    } else if (this.digit1 >= 10 && this.digit2 >= 10) {
      s = (this.digit1 % 10 === 0 || this.digit2 % 10 === 0) ? 1 : 2
    } else {
      s = 1
    }
    return s
  }

  public get result (): number {
    return this.digit1 - this.digit2
  }
}
