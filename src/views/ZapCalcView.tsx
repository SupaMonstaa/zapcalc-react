import React from "react"
import addScore from "../mixins/bestScore";
import OperationFactory from "../mixins/OperationFactory";
import Operation from "../types/Operation"
import OperationKind from "../types/OperationKind"
import { CalcScreen } from "../components/CalcScreen"
import { Keyboard } from "../components/Keyboard";
import { StartButton } from "../components/StartButton";
import { OperationSelect } from "../components/OperationSelect";
import { LevelSelect } from "../components/LevelSelect";
import "./ZapCalcView.scss"

type ZapCalcViewState = {
  operation: Operation,
  gameTimeLeft: number,
  shake: boolean,
  gameStarted: boolean
}

class ZapCalcView extends React.Component<{}, ZapCalcViewState> {
  private level!: number
  private showResult = false
  private operationKind!: OperationKind
  private totalScore = -1
  private nextOperation = true
  private gameDuration = 5
  private score = -1
  private static gameTimeout: ReturnType<typeof setTimeout> | undefined
  private newBestScoreMessage = ''
  private stars = 0

  constructor(props: {}) {
    super(props)
    const op = OperationFactory.getOperationClass(this.operationKind, this.level)
    this.state = {
      operation: op,
      gameTimeLeft: -1,
      shake: false,
      gameStarted: false
    }
    const LSlevel = localStorage.getItem('level')
    this.level = LSlevel ? parseInt(LSlevel, 0) : 2
    this.operationKind = localStorage.getItem('operationKind')
      ? localStorage.getItem('operationKind') as OperationKind : OperationKind.mix
    this.onLevelChange = this.onLevelChange.bind(this);
    this.onOperationChange = this.onOperationChange.bind(this);
    this.startGame = this.startGame.bind(this);
    this.gameTick = this.gameTick.bind(this)
    this.onKeyboardValue = this.onKeyboardValue.bind(this);
  }
  componentWillUnmount() {
    clearTimeout(ZapCalcView.gameTimeout);
  }
  render() {
    const calcScreen = <CalcScreen
      operation={this.state.operation}
      gameStarted={this.state.gameStarted}
      gameDuration={this.gameDuration}
      totalScore={this.totalScore}
      newBestScoreMessage={this.newBestScoreMessage}
      stars={this.stars}
      score={this.score}
      level={this.level}
      operationKind={this.operationKind}
    ></CalcScreen>

    return (
      <div className={`zap-calc ${this.state.shake && "shake"}`}>
        <header>
          <menu>
            <OperationSelect initValue={this.operationKind} onChange={this.onOperationChange} />
            <LevelSelect initValue={this.level ? this.level : 0} onChange={this.onLevelChange} />
            <StartButton gameTimeLeft={this.state.gameTimeLeft} gameDuration={this.gameDuration} onStart={this.startGame} />
          </menu>
        </header>
        {calcScreen}
        <div className="keyboard-container">
          <Keyboard
            showResult={this.showResult}
            result={this.state.operation.result}
            onKeyboardClick={this.onKeyboardValue} />
        </div>
      </div>
    );
  }
  onKeyboardValue(value: number): void {
    if (!this.state.gameStarted) {
      return
    }
    if (this.state.operation.result === value) {
      // correct answer
      this.nextOperation = true
      this.score += this.stars
    } else {
      // wrong answer, shake !
      this.setState({ shake: true })
      setTimeout(() => {
        this.setState({ shake: false })
      }, 1000)
      if (!this.nextOperation) {
        this.showResult = true
        this.stars = 0
      } else {
        this.nextOperation = false
      }
    }
    if (this.nextOperation) {
      this.showResult = false
      this.currentOperation = OperationFactory.getOperationClass(this.operationKind, this.level)
    }
  }

  private get currentOperation(): Operation {
    return this.state.operation
  }

  private set currentOperation(v: Operation) {
    this.stars = v.stars
    this.setState({ operation: v })
  }

  private startGame(): void {
    this.score = 0
    this.showResult = false
    this.totalScore = -1
    this.setState({ gameStarted: true, gameTimeLeft: this.gameDuration })
    this.currentOperation = OperationFactory.getOperationClass(this.operationKind, this.level)
    clearTimeout(ZapCalcView.gameTimeout)
    ZapCalcView.gameTimeout = setTimeout(this.gameTick, 1000)
  }

  private gameTick(): void {
    this.setState(
      (prevState) => {
        return { gameTimeLeft: prevState.gameTimeLeft - 1 }
      }
    )
  }
  componentDidUpdate() {
    if (this.state.gameTimeLeft === 0) {
      this.endGame()
    } else {
      clearTimeout(ZapCalcView.gameTimeout)
      ZapCalcView.gameTimeout = setTimeout(this.gameTick, 1000)
    }
  }

  private endGame(): void {
    this.setState({ gameStarted: false, gameTimeLeft: -1 })
    this.stars = 0
    // send totalScore to screen
    this.totalScore = this.score
    const [rank] = addScore(this.operationKind, this.level, this.totalScore)
    if (rank >= 0) {
      // best score !
      this.newBestScoreMessage = `#${rank + 1}`
    } else {
      this.newBestScoreMessage = ''
    }
  }

  onLevelChange(level: number): void {
    localStorage.setItem('level', `${level}`)
    this.level = level
  }

  onOperationChange(operationKind: OperationKind): void {
    localStorage.setItem('operationKind', operationKind)
    this.operationKind = operationKind
  }
}

export default ZapCalcView;
