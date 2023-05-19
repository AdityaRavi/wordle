import React from 'react'
import styled from 'styled-components'

const StyledBackgroundBlur = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 1;
`

const StyledModal = styled.div`
  width: 500px;
  height: 500px;
  padding: 50px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 0px 15px grey;
  background-color: white;
  border-radius: 5px;
  &>p {
    font-size: 20px;
  }
`

const StyledPlayAgainButton = styled.button`
  border-radius: 50px;
  background-color: #6AAA64;
  color: white;
  font-size: 16px;
  font-weight: bold;
  min-width: 200px;
  min-height: 50px;
  border: none;
  &:hover {
    cursor: pointer;
    opacity: 80%;
  }
`

const GameOverModal = ({ win, word, show, onPlayAgain }) => {
  if (!show) {
    return null
  }

  return (
    <StyledBackgroundBlur>
      <StyledModal>
        <h1>{win ? 'You Win!' : 'So Close!'}</h1>
        <p>Wordle Word: <strong>{word}</strong></p>
        <StyledPlayAgainButton onClick={onPlayAgain}>Play Again</StyledPlayAgainButton>
      </StyledModal>
    </StyledBackgroundBlur>
  )
}

export {
  GameOverModal
}