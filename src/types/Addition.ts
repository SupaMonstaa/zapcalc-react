import Operation from './Operation'

export default class Addition extends Operation {
  public static label = '+';

  public sign = Addition.label;

  public color = '#308030';

  protected generateDigits (): void {
    // 1 - 49
    this.digit1 = Operation.rand(1, 50)
    this.digit2 = Operation.rand(1, 100 - this.digit1)
  }

  public get stars (): number {
    let s = 1
    if ((this.digit1 >= 30 && this.digit2 >= 20) ||
        (this.digit1 >= 10 && this.digit2 >= 10 &&
            (this.digit1 % 10) + (this.digit2 % 10) >= 10)) {
      // grosse opération ou une retenue
      s = 3
    } else if (this.digit1 >= 20 && this.digit2 >= 20) {
      s = (this.digit1 % 10 === 0 || this.digit2 % 10 === 0) ? 2 : 3
    } else if (this.digit1 >= 2 && this.digit2 >= 2 &&
                ((this.digit1 >= 10 && this.digit2 >= 10) ||
                 this.digit1 >= 20 || this.digit2 >= 20)) {
      s = (this.digit1 % 10 === 0 || this.digit2 % 10 === 0) ? 1 : 2
    } else {
      s = 1
    }
    return s
  }

  public get result (): number {
    return this.digit1 + this.digit2
  }
}
