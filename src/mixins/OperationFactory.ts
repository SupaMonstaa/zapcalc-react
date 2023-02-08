import OperationKind from '../types/OperationKind'
import Operation from '../types/Operation'
import Addition from '../types/Addition'
import Multiplication from '../types/Multiplication'
import Division from '../types/Division'
import Substraction from '../types/Substraction'
import shuffle from '../mixins/shuffle'

export default class OperationFactory {
  static getOperationClass (operationKind: OperationKind, level: number): Operation {
    switch (operationKind) {
      case OperationKind.addition:
        return new Addition(level)
      case OperationKind.multiplication:
        return new Multiplication(level)
      case OperationKind.substraction:
        return new Substraction(level)
      case OperationKind.division:
        return new Division(level)
      case OperationKind.mix:
      {
        const OperationClass = shuffle([
          Substraction, Multiplication, Division, Addition
        ]).pop()
        return new OperationClass(level)
      }
      default:
        return new Addition(level)
    }
  }

  static getLabel (opKind: OperationKind): string {
    switch (opKind) {
      case OperationKind.addition:
        return Addition.label
      case OperationKind.substraction:
        return Substraction.label
      case OperationKind.multiplication:
        return Multiplication.label
      case OperationKind.division:
        return Division.label
      default:
        return `${Addition.label}${Substraction.label}${Multiplication.label}${Division.label}`
    }
  }
}
