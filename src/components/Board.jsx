import React, { useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { GUESS_STATUS_COLORS, WORDLE_WORD_LENGTH } from '../utils'

const getFlipKeyframesForStatus = (status) => keyframes`
  0% {
    border: 2px solid #878A8C;
    color: black;
    transform: rotateX(0deg);
    background-color: white;
  }

  49.99% {
    border: 2px solid #878A8C;
    color: black;
    background-color: white;
  }

  50% {
    color: white;
    border: 2px solid ${GUESS_STATUS_COLORS[status]};
    background-color:  ${GUESS_STATUS_COLORS[status]};
    transform: rotateX(90deg);
  }

  100% {
    color: white;
    border: 2px solid ${GUESS_STATUS_COLORS[status]};
    background-color:  ${GUESS_STATUS_COLORS[status]};
    transform: rotateX(0deg);
  }
`

const focusKeyFrames = keyframes`
  0% {
    scale: 1;
  }

  50% {
    scale: 1.1;
  }

  100% {
    scale: 1;
  }
`

const StyledBoard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 7px;
  height: 100%;
  font-size: 30px;
  font-weight: bold;
`

const StyledRow = styled.div`
  display: flex;
  gap: 7px;
  align-items: center;
`

const StyledBaseBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55px;
  height: 55px;
`

const EmptyBox = styled(StyledBaseBox)`
  border: 2px solid #D3D6DA;
`

const FocusedBox = styled(StyledBaseBox)`
  border: 2px solid #878A8C;
  animation-name: ${focusKeyFrames};
  animation-duration: 0.1s;
  animation-fill-mode: forwards;
`

const GuessedBox = styled(StyledBaseBox)`
  border: 2px solid #878A8C;
  animation-name: ${({ status }) => getFlipKeyframesForStatus(status)};
  animation-delay: ${({ delay }) => `${delay}s`};
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
`

const UnguessedRow = ({ guess, isFocused }) => {
  const letters = new Array(WORDLE_WORD_LENGTH).fill('').map((_, letterIdx) => guess[letterIdx] ?? '')

  return (
    <StyledRow className={isFocused ? 'focus' : ''}>
      {
        letters.map((letter, letterIdx) => {
          if (!letter) {
            return <EmptyBox key={letterIdx} />
          }
          return <FocusedBox key={letterIdx}>{letter.toUpperCase()}</FocusedBox>
        })
      }
    </StyledRow>
  )
}

const GuessedRow = ({ evaluatedGuess, onAnimationEnd }) => {
  const handleAnimationEnd = useCallback((idx) => {
    if (idx === evaluatedGuess.length - 1) {
      onAnimationEnd()
    }
  }, [evaluatedGuess.length, onAnimationEnd])

  console.log(evaluatedGuess)
  return (
    <StyledRow>
      {
        evaluatedGuess.map(({ letter, status }, idx) => {
          const animationDelay = 0.3 * idx
          return <GuessedBox key={idx} status={status} delay={animationDelay} onAnimationEnd={() => handleAnimationEnd(idx)}>{letter.toUpperCase()}</GuessedBox>
        })
      }
    </StyledRow>
  )
}

const Board = ({ guesses, onAnimationEnd, evaluateGuess, maxNumGuesses }) => {
  console.log(maxNumGuesses)
  const rows = (new Array(maxNumGuesses).fill('').map((_, rowIdx) => {
    const guess = guesses[rowIdx]
    const numValidGuesses = guesses.length - 1// if guesses is of len 3, then 2 of the guesses are submitted and valid
    if (!!guess && rowIdx < numValidGuesses) {
      return <GuessedRow key={rowIdx} evaluatedGuess={evaluateGuess(guess)} onAnimationEnd={onAnimationEnd} />
    }
    return <UnguessedRow key={rowIdx} isFocused={guesses.length - 1 === rowIdx} guess={guess ?? ''} />
  }))

  return (
    <StyledBoard>
      {rows}
    </StyledBoard>
  )
}

export {
  Board
}