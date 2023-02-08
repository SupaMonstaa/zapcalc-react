import Operation from './Operation'

export default class Division extends Operation {
  public static label = '÷';

  public sign = Division.label;

  public color = '#608030';

  protected generateDigits (): void {
    this.digit2 = Operation.rand(2, 21)
    this.digit1 = this.digit2 * Operation.rand(1, 21)
  }

  public get stars (): number {
    let s = 1
    if (this.result > 10 ||
      this.digit2 > 10) {
      s = this.digit2 === 10 ? 2 : 3
    } else if (this.digit2 >= 6) {
      s = this.digit2 === 10 ? 1 : 2
    } else {
      s = 1
    }
    return s
  }

  public get result (): number {
    return this.digit1 / this.digit2
  }
}
