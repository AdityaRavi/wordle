import React, { useCallback, useEffect, useState } from 'react'
import wordList from 'wordle-wordlist'
import styled, { keyframes } from 'styled-components'
import { QwertyKeyboard } from './QwertyKeyboard'
import { GUESS_STATUS, SPECIAL_KEYS, WORDLE_WORD_LENGTH } from '../utils'
import { Board } from './Board'
import { GameOverModal } from './GameOverModal'

const shakeKeyframes = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`

const StyledGameContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`

const StyledBoardContainer = styled.div`
  flex-grow: 1;
  padding: 50px;
  & *.focus {
    animation-name: ${({ shake }) => shake ? shakeKeyframes : ''};
    animation-duration: 0.5s;
  }
`

const StyledKeyboardContainer = styled.div`
  padding: 50px;
`

const allWords = new Set(wordList.cache.all)

const generateWord = () => {
  const wordleWords = wordList.cache.answers
  return wordleWords[Math.floor(Math.random() * wordleWords.length)]
}

const isValidWord = (word) => allWords.has(word)

const WordleGame = ({ maxNumGuesses }) => {
  const [word, setWord] = useState(generateWord())
  const [guesses, setGuesses] = useState([''])//array of guesses by player. Max len = maxNumberOfGuesses
  const [correctlyGuessedLetters, setCorrectlyGuessedLetters] = useState(new Set())
  const [guessedLetters, setGuessedLetters] = useState(new Set())
  const [invalidGuess, setInvalidGuess] = useState(false)
  const [gameOver, setGameOver] = useState(null)

  const getGuessStatusForKey = useCallback((key) => {
    if (correctlyGuessedLetters.has(key)) {
      return GUESS_STATUS.CORRECT
    } else if (guessedLetters.has(key) && word.includes(key)) {
      return GUESS_STATUS.CLOSE
    } else if (guessedLetters.has(key) && !word.includes(key)) {
      return GUESS_STATUS.INCORRECT
    }
    return GUESS_STATUS.UNUSED
  }, [correctlyGuessedLetters, guessedLetters, word])

  const onKeyClick = useCallback((key) => {
    const currentGuess = guesses[guesses.length - 1] //the last guess is always the current guess
    if (key === SPECIAL_KEYS.ENTER) {
      if (currentGuess.length < WORDLE_WORD_LENGTH || !isValidWord(currentGuess)) {
        setInvalidGuess(true)
      } else {
        setGuesses(allPrevGuesses => [...allPrevGuesses, ''])
      }
    } else if (key === SPECIAL_KEYS.BACKSPACE) {
      setGuesses(allPrevGuesses => {
        const lastGuessArr = allPrevGuesses[allPrevGuesses.length - 1].split('')
        lastGuessArr.pop()
        allPrevGuesses[allPrevGuesses.length - 1] = lastGuessArr.join('')
        return [...allPrevGuesses] // return a new array so state change is detected
      })
    } else if (key.length === 1 && key.match(/[a-z]/i) && currentGuess.length < WORDLE_WORD_LENGTH) {
      setGuesses(allPrevGuesses => {
        const updatedLastGuess = allPrevGuesses[allPrevGuesses.length - 1] + key
        allPrevGuesses[allPrevGuesses.length - 1] = updatedLastGuess
        return [...allPrevGuesses]
      })
    }
  }, [guesses])

  const handleKeyDown = useCallback((e) => onKeyClick(e.key), [onKeyClick])

  // actual keyboard support
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const evaluateGuess = useCallback((guess) => {
    // given a guess eg water and the wordle word = happy
    // return an evaluated guess in the form of
    // [{ letter: 'w', status: GUESS_STATUS.INCORRECT}, { letter: 'a', status: GUESS_STATUS.CORRECT}, etc]
    const wordleWordLetterMap = word.split('').reduce((agg, letter) => {
      agg[letter] = (agg[letter] ?? 0) + 1
      return agg
    }, {})

    const result = new Array(guess.length)

    // find green letters
    for (let i = 0; i < result.length; i++) {
      const letter = guess[i]
      if (letter === word[i]) {
        wordleWordLetterMap[letter]--
        result[i] = {
          letter,
          status: GUESS_STATUS.CORRECT
        }
      }
    }

    // fill yellow and grey letters
    for (let i = 0; i < result.length; i++) {
      const letter = guess[i]
      if (!result[i]) {
        if (wordleWordLetterMap[letter] > 0) {
          wordleWordLetterMap[letter]--
          result[i] = {
            letter,
            status: GUESS_STATUS.CLOSE
          }
        } else {
          result[i] = {
            letter,
            status: GUESS_STATUS.INCORRECT
          }
        }
      }
    }

    return result
  }, [word])

  const updateGuessedLetters = useCallback(() => {
    // check if the game can go on once the flip animation is done
    const lastGuess = guesses[guesses.length - 2] // when enter is hit, an empty guess is pused to guesses
    if (lastGuess === word) {
      setGameOver({ win: true })
    } else if (guesses.length > maxNumGuesses) {
      setGameOver({ win: false })
    } else {
      // need to update the qwerty keyboard with the right colors
      lastGuess.split('').forEach((letter, idx) => {
        setGuessedLetters(prevGuessedLetters => new Set(prevGuessedLetters.add(letter)))
        if (letter === word[idx]) {
          setCorrectlyGuessedLetters(prevCorrectlyGuessedLetters => new Set(prevCorrectlyGuessedLetters.add(letter)))
        }
      })
    }

  }, [guesses, maxNumGuesses, word])

  const restartGame = useCallback(() => {
    setWord(generateWord())
    setGuesses([''])
    setGuessedLetters(new Set())
    setCorrectlyGuessedLetters(new Set())
    setGameOver(null)
  }, [])

  const handleInvalidGuessAnimationEnd = useCallback((e) => {
    if (e.target.className.includes('focus')) { //only trigger when source is the focused row
      setInvalidGuess(false)
    }
  }, [])

  return (
    <>
      <GameOverModal win={gameOver && gameOver.win} word={word} show={!!gameOver} onPlayAgain={restartGame} />
      <StyledGameContainer>
        <StyledBoardContainer shake={invalidGuess} onAnimationEnd={handleInvalidGuessAnimationEnd}>
          <Board maxNumGuesses={maxNumGuesses} guesses={guesses} evaluateGuess={evaluateGuess} onAnimationEnd={updateGuessedLetters} />
        </StyledBoardContainer>
        <StyledKeyboardContainer>
          <QwertyKeyboard onKeyClick={onKeyClick} getGuessStatusForKey={getGuessStatusForKey} />
        </StyledKeyboardContainer>
      </StyledGameContainer>
    </>
  )
}

export {
  WordleGame
}