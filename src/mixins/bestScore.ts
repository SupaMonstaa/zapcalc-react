import OperationKind from '../types/OperationKind'
import Score from "../types/Score"

export default function addScore (
  opK: OperationKind,
  level: number,
  score: number
): [number, number[]] {
  // get bestScores from localStorage
  let bestScores: Score[] = []
  let rank = -1
  if (localStorage.getItem('bestScores')) {
    try {
      bestScores = JSON.parse(localStorage.bestScores)
      if (!Array.isArray(bestScores)) {
        bestScores = []
      }
    } catch (e) {
      bestScores = []
    }
  }
  const newScore: Score = {
    kind: opK,
    level,
    score
  }
  bestScores.push(newScore)
  // sort by score desc
  bestScores.sort((a, b) => b.score - a.score)
  // console.log(bestScores);
  let index = 0
  const scoresByKindLevel: number[] = []
  while (index < bestScores.length) {
    const sc = bestScores[index]
    if (sc.kind === opK && sc.level === level) {
      // keep only 5 first scores
      if (scoresByKindLevel.length <= 10) {
        if (rank === -1 && score === sc.score) {
          rank = index
        }
        scoresByKindLevel.push(sc.score)
      } else {
        bestScores.splice(index, 1)
        // decrement the index because one element has been removed
        index -= 1
      }
    }
    index += 1
  }
  localStorage.setItem('bestScores', JSON.stringify(bestScores))
  return [rank, scoresByKindLevel]
}
