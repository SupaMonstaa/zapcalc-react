import { FunctionComponent, useCallback, useEffect, useState } from "react"
import { useSearchParams } from 'react-router-dom'
import addScore from "@/mixins/bestScore";
import OperationFactory from "@/mixins/OperationFactory";
import Operation from "@/types/Operation"
import OperationKind from "@/types/OperationKind"
import { CalcScreen } from "@/components/CalcScreen"
import { Keyboard } from "@/components/Keyboard";
import { StartButton } from "@/components/StartButton";
import { OperationSelect } from "@/components/OperationSelect";
import { LevelSelect } from "@/components/LevelSelect";
import { ShareButton } from "@/components/ShareButton";
import "./ZapCalcView.scss"

let gameTimeout: ReturnType<typeof setTimeout> | undefined
let nextOperation = true

type ZapCalcViewProps = {
  onGameIsPlaying: (playing:boolean) => void
}

export const ZapCalcView:FunctionComponent<ZapCalcViewProps> = ({
  onGameIsPlaying
}) => {
  const gameDuration = 10
  
  const [searchParams, setSearchParams] = useSearchParams();
  const qsSeed:string = searchParams.get('seed') || Date.now().toString()
  // score to beat indicates we are in challenge mode if > 0
  const qsScoreToBeat:number =
    searchParams.get('operation') &&
    searchParams.get('level') &&
    searchParams.get('seed') &&
    searchParams.get('score') ?
    parseInt(searchParams.get('score') as string) : -1;
  console.log("ZapCalcView")
  const qsOperationKind = (searchParams.get('operation') || 
    localStorage.getItem('operationKind') ||
    OperationKind.mix
  ) as OperationKind
  const qsLevel = parseInt(searchParams.get('level') ||
    localStorage.getItem('level') ||
    "2")

  const [scoreToBeat, setScoreToBeat] = useState(qsScoreToBeat)
  const [totalScore, setTotalScore] = useState(-1)
  const [score, setScore] = useState(-1)
  const [operation, setOperation] = useState<Operation>()
  const [operationKind, setOperationKind] = useState<OperationKind>(qsOperationKind)
  const [level, setLevel] = useState(qsLevel);
  const [gameTimeLeft, setGameTimeLeft] = useState(-1);
  const [shake, setShake] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [seed, setSeed] = useState(qsSeed)
  const [newBestScoreMessage, setNewBestScoreMessage] = useState('')

  // destroy timeout on unmount
  useEffect(() => {
    console.log(`useEffect ${scoreToBeat}`)
  }, [scoreToBeat])

  // destroy timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeout(gameTimeout);
    }
  }, [])
  
  useEffect(() => {  
    setSearchParams({
        level:level.toString(),
        operation: operationKind,
        score: totalScore.toString(),
        seed:seed
      }
    )
  }, [setSearchParams, level, operationKind, totalScore, seed])

  const onKeyboardValue = (value: number): void => {
    if (!gameStarted || !operation) {
      return
    }
    if (operation.result === value) {
      // correct answer
      // if show result is set to true, add no score
      setScore(score + (showResult ? 0 : operation.stars))
      nextOperation = true
    } else {
      // wrong answer, shake !
      setShake(true)
      setTimeout(() => {
        setShake(false)
      }, 1000)
      if (!nextOperation) {
        // display the right answer, and set stars to 0
        setShowResult(true)
      } else {
        // first error, keep same operation
        nextOperation = false
      }
    }
    if (nextOperation) {
      setShowResult(false)
      renewOperation()
    }
  }

  const renewOperation = () => {
    const op = OperationFactory.getOperationClass(operationKind, level)
    setOperation(op)
  }

  const startGame = () => {
    console.log('startGame')
    // start a new game with a new seed if second try or restart a on going game
    const s =  scoreToBeat >= 0 && !gameStarted ? seed : Date.now().toString()  
    setSeed(s)
    Operation.seed = s
    if (score > 0 || gameStarted) {
      // reset score to beat if a first game was started
      // (else if first game, keep score to beat)
      setScoreToBeat(-1)
    }
    setScore(0)
    setShowResult(false)
    setTotalScore(-1)
    setGameStarted(true)
    setGameTimeLeft(gameDuration)
    renewOperation()
    clearTimeout(gameTimeout)
    gameTimeout = setTimeout(gameTick, 1000)
  }

  const gameTick = useCallback(() => {
    if (gameStarted) {
      setGameTimeLeft(gameTimeLeft - 1)
    }
  }, [setGameTimeLeft, gameStarted,  gameTimeLeft])

  const endGame = useCallback(() => {
    console.log(`endGame ${scoreToBeat}`)
    setGameStarted(false)
    setGameTimeLeft(-1)
    // send totalScore to screen
    setTotalScore(score)
    const [rank] = addScore(operationKind, level, totalScore)
    // best score !
    setNewBestScoreMessage((rank >= 0) ? `#${rank + 1}` : '')
    if (scoreToBeat>0) {
      if (totalScore > scoreToBeat) {
        console.log('win')
      } else if (totalScore === scoreToBeat) {
        console.log("draw")
      } else {
        console.log("lose")
      }
    } else {
      console.log('no game');
    }
  }, [level, operationKind, totalScore, scoreToBeat, score])

  useEffect(() => {
    if (gameTimeLeft === 0) {
      endGame()
    } else if (gameTimeLeft > 0){
      clearTimeout(gameTimeout)
      gameTimeout = setTimeout(gameTick, 1000)
    }
  }, [gameTimeLeft, endGame, gameTick, setSearchParams])

  useEffect(() => {
    onGameIsPlaying(gameStarted)
  }, [gameStarted, onGameIsPlaying])

  const onLevelChange = (level: number) =>  {
    localStorage.setItem('level', `${level}`)
    setLevel(level)
  }

  const onOperationChange = (operationKind: OperationKind) => {
    localStorage.setItem('operationKind', operationKind)
    setOperationKind(operationKind)
  }

  return (
    <div className={`zap-calc ${shake && "shake"}`}>
      <header>
        <menu>
          <OperationSelect initValue={operationKind} onChange={onOperationChange} />
          <LevelSelect initValue={level ? level : 0} onChange={onLevelChange} />
          <StartButton gameTimeLeft={gameTimeLeft} gameDuration={gameDuration} onStart={startGame} />
          {
            (true || navigator.share !== undefined) && 
            <ShareButton level={level ? level : 0} operation={operationKind} stars={totalScore}/>
          }
        </menu>
      </header>
      <CalcScreen
        scoreToBeat={scoreToBeat}
        operation={operation}
        gameStarted={gameStarted}
        gameDuration={gameDuration}
        totalScore={totalScore}
        newBestScoreMessage={newBestScoreMessage}
        score={score}
        level={level}
        operationKind={operationKind}
      />
      <div className="keyboard-container">
        <Keyboard
          showResult={showResult}
          result={operation ? operation.result : 0}
          onKeyboardClick={onKeyboardValue} />
      </div>
    </div>
  );
}
