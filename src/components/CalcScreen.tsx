import React, { Component } from 'react';
import OperationKind from '../types/OperationKind';
import starImage19 from '../assets/images/star19.png'
import starImage9 from '../assets/images/star9.png'
import starImage7 from '../assets/images/star7.png'
import pixelate from '../mixins/pixelate';
import OperationFactory from '../mixins/OperationFactory';
import './CalcScreen.scss';
import Operation from '@/types/Operation';

type CalcScreenProps = {
  gameStarted: boolean,
  gameDuration: number,
  totalScore: number,
  newBestScoreMessage: string,
  score: number,
  stars: number,
  level: number,
  operationKind: OperationKind,
  operation: Operation
}
type CalcScreenState = {
  loadingStarsCount: number
}
export class CalcScreen extends Component<CalcScreenProps, CalcScreenState> {
  private canvas: React.RefObject<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D
  private pixelW = 5
  private starImage9 = new Image()
  private starImage7 = new Image()
  private starImage19 = new Image()
  private animTimeout: ReturnType<typeof setTimeout> | undefined

  constructor(props: CalcScreenProps) {
    super(props)
    this.state = {loadingStarsCount: 3}
    this.canvas = React.createRef<HTMLCanvasElement>()
  }

  render() {
    return (
      <div className="calc-screen" >
        <canvas id="screen-canvas" ref={this.canvas} width="500" height="140" />
      </div>
    );
  }

  componentDidUpdate(prevProps: CalcScreenProps) {
    console.log('componentDidUpdate renderScreen')
    this.renderScreen()
  }

  componentDidMount(): void {
    const canvas = this.canvas.current as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
    this.ctx.imageSmoothingEnabled = false
    
    this.starImage7.onload = 
    this.starImage9.onload = 
    this.starImage19.onload = () => {
      this.setState((prevState) => {
        return {loadingStarsCount: prevState.loadingStarsCount-1}
      })
    }
    this.starImage7.src = starImage7
    this.starImage9.src = starImage9
    this.starImage19.src = starImage19
  }

  componentWillUnmount(): void {
    if (this.animTimeout) {
      clearTimeout(this.animTimeout)
      this.animTimeout = undefined
    }
  }

  renderScreen(): void {
    if (this.state.loadingStarsCount > 0) return
    this.clearScreen()
    if (this.props.score === -1 && !this.props.gameStarted) {
      // start screen
      this.drawStartScreen()
    } else if (this.props.totalScore >= 0) {
      this.drawTotalScore(true)
    } else {
      if (this.animTimeout) {
        clearTimeout(this.animTimeout)
        this.animTimeout = undefined
      }
      this.drawScore()
      this.drawOperation()
      this.pixelate()
    }
  }

  private clearScreen(): void {
    if (this.canvas.current) {
      const cvs = this.canvas.current
      this.ctx.clearRect(0, 0, cvs.width, cvs.height)
    }
  }

  private drawStartScreen(frame = 0): void {
    clearTimeout(this.animTimeout)
    this.animTimeout = undefined
    if (!this.props.gameStarted) {
      // show start screen
      this.animTimeout = setTimeout(() => this.drawStartScreen(frame + 1), 500)
    } else {
      return
    }
    this.clearScreen()
    this.drawText('OPERATION', 2, 4)
    const opLabel = OperationFactory.getLabel(this.props.operationKind as OperationKind)
    this.drawText(opLabel, 46, 4)
    this.drawText('NIVEAU', 2, 16)
    for (let i = 1; i <= this.props.level; i += 1) {
      this.drawImage(this.starImage7, 25 + 8 * i, 15)
    }
    if (frame % 2) {
      this.drawText('START^', 69, 4, false, '#ff0000')
    }
    this.pixelate()
  }

  private drawLine(points: number[], color: string): void {
    this.ctx.beginPath()
    this.ctx.lineWidth = this.pixelW
    this.ctx.strokeStyle = color
    this.ctx.moveTo(this.pixelW * points[0], this.pixelW * points[1])
    for (let i = 2; i < points.length - 1; i += 2) {
      this.ctx.setLineDash([2 * this.pixelW, 2 * this.pixelW])
      this.ctx.lineTo(this.pixelW * points[i], this.pixelW * points[i + 1])
      this.ctx.stroke()
    }
  }

  private drawTotalScore(big: boolean): void {
    if (this.props.totalScore >= 0) {
      clearTimeout(this.animTimeout)
      this.animTimeout = setTimeout(() => this.drawTotalScore(!big), 400)
      const score = `${this.props.totalScore}`
      const lg = 12 * score.length
      this.clearScreen()
      this.drawText(score, 40 - 0.5 * lg, 5, true, '#000000')
      if (big) {
        this.drawImage(this.starImage19, 43 + 0.5 * lg, 4)
      } else {
        this.drawImage(this.starImage9, 46 + 0.5 * lg, 8)
      }
      this.drawText(this.props.newBestScoreMessage, 1, 2, false, '#000000')
      this.pixelate()
    }
  }

  private drawScore(): void {
    if (this.props.score >= 0) {
      this.drawImage(this.starImage9, 76, 9)
      this.drawText(`${this.props.score}`, 86, 11, false, '#000000')
    }
  }

  private drawOperation(): void {
    const X = 11
    const Y = 5
    // const txtH = 103.2;
    // this.ctx.font = `${txtH}px zapmaxi`;
    // this.ctx.fillStyle = this.color;
    // this.ctx.textAlign = 'start';
    // this.ctx.textBaseline = 'top';
    let textIndex = X
    this.drawText(`${this.props.operation.digit1} `, textIndex, Y, true, this.props.operation.color)
    let spaceW = 0
    if (this.props.operation.digit1 <= 9) {
      spaceW += 3
    }
    if (this.props.operation.digit2 <= 9) {
      spaceW += 3
    }
    textIndex += spaceW + (this.props.operation.digit1 >= 10 ? 25 : 12)
    this.drawText(`${this.props.operation.sign} `, textIndex, Y - 1, true, this.props.operation.color)
    textIndex += spaceW + 13
    this.drawText(`${this.props.operation.digit2}`, textIndex, Y, true, this.props.operation.color)
    for (let i = 0; i < this.props.stars; i += 1) {
      this.drawImage(this.starImage7, 2, 19 - i * 8)
    }
  }

  private x(incX: number): number {
    return this.pixelW * incX
  }

  private y(incY: number): number {
    return this.pixelW * incY + 3
  }

  private drawText(text: string, x: number, y: number, big = false, color = '#000000'): void {
    // const txtH = 50; // h for nano
    const txtH = big ? 103.2 : 80/* 25 */
    const incY = big ? 83 : 27
    this.ctx.font = `${txtH}px ${big ? 'zapmaxi' : 'zapmini'}`
    // const w = this.pixelW * (text.length * (big ? 12 : 6));
    // const h = this.pixelW * (big ? 15 : 5);
    // this.ctx.fillStyle = '#eeeeee';
    // this.ctx.fillRect(this.x(x), this.y(y) + incY - 5, w, h);
    this.ctx.fillStyle = color
    // this.ctx.textBaseline = 'top'; // bogus on FF, so disabled and rather use the incY
    this.ctx.fillText(`${text}`, this.x(x), this.y(y) + incY)
  }

  private drawImage(image: HTMLImageElement, x: number, y: number): void {
    this.ctx.drawImage(image, this.x(x), this.y(y) - 2,
      image.width * this.pixelW, image.height * this.pixelW)
  }

  private pixelate(): void {
    const options = {
      pixelWidth: 5,
      pixelHeight: 5,
      thresholdMax: 200,
      thresholdMin: 30,
      grid: true
    }
    const cvs = this.canvas.current as HTMLCanvasElement
    const imageData = this.ctx.getImageData(
      0, 0, cvs.width, cvs.height
    )
    pixelate(imageData, imageData, options)
    this.ctx.putImageData(imageData, 0, 0)
  }
}
