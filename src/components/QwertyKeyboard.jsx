import React, { useCallback, useMemo } from 'react'
import { GUESS_STATUS, GUESS_STATUS_COLORS, QWERTY_KEYS, SPECIAL_KEYS } from '../utils'
import { styled } from 'styled-components'

const StyledRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: bold;
  font-size: 20px;
`

const StyledRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`

const StyledBaseKey = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${() => GUESS_STATUS_COLORS.unused};
  padding: 10px;
  min-width: 25px;
  height: 40px;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
  };
`

const StyledEnterKey = styled(StyledBaseKey)`
  font-size: 12px;
  min-width: 45px;
`

const StyledBackspaceKey = styled(StyledBaseKey)`
  min-width: 45px;
`

const StyledKey = styled(StyledBaseKey)`
  background-color: ${({ status }) => GUESS_STATUS_COLORS[status]};
  color: ${({ status }) => {
    switch (status) {
      case GUESS_STATUS.CORRECT:
      case GUESS_STATUS.CLOSE:
      case GUESS_STATUS.INCORRECT:
        return 'white';
      case GUESS_STATUS.UNUSED:
      default:
        return 'black';
    }
  }}
`

const Key = ({ _key, status, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(_key)
  }, [onClick, _key])

  switch (_key) {
    case SPECIAL_KEYS.ENTER:
      return <StyledEnterKey onClick={handleClick}>{_key.toUpperCase()}</StyledEnterKey>
    case SPECIAL_KEYS.BACKSPACE:
      return <StyledBackspaceKey onClick={handleClick}>⌦</StyledBackspaceKey>
    default:
      return <StyledKey onClick={handleClick} status={status}>{_key.toUpperCase()}</StyledKey>
  }
}

const QwertyKeyboard = ({ onKeyClick, getGuessStatusForKey }) => {
  const keysWithStatus = useMemo(() => {
    return QWERTY_KEYS.map((row) => {
      return row.map((key) => ({
        key,
        status: getGuessStatusForKey(key)
      }))
    })
  }, [getGuessStatusForKey])

  return (
    <StyledRows>
      {
        keysWithStatus.map((row, rowIdx) => {
          return (
            <StyledRow key={rowIdx}>
              {row.map(({ key, status }) => {
                return <Key key={key} status={status} _key={key} onClick={onKeyClick} />
              })}
            </StyledRow>
          )
        })
      }
    </StyledRows>
  )
}

export {
  QwertyKeyboard
}