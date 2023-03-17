import SR from "seedrandom"

export default abstract class Operation {
  public digit1 = 0;

  public digit2 = 0;

  public abstract sign: string;

  public abstract color: string;

  private static prng:any;

  private static _seed:string;

  public static set seed(sd: string) {
    Operation._seed = sd
    Operation.prng = SR(sd)
  }

  public static get seed():string {
    return Operation._seed;
  }

  constructor (level: number) {
    // loop until the generated digits generates
    // an operation that fit the level
    do {
      this.generateDigits(level)
    } while (this.digit1 > 99 ||
      this.digit2 > 99 ||
      this.result > 99 ||
      this.stars > level)
  }

  static rand (min: number, max: number): number {
    return Math.floor(min + Operation.prng() * (max - min))
  }

  /* eslint-disable class-methods-use-this */
  public get result (): number {
    return 0
  }

  public toString (): string {
    return `${this.digit1} ${this.sign} ${this.digit2}`
  }

  protected abstract generateDigits(level: number): void;

  /* eslint-disable class-methods-use-this */
  public get stars (): number {
    return 0
  }
}
