const WORDLE_WORD_LENGTH = 5

const GUESS_STATUS = Object.freeze({
  CORRECT: 'correct',
  INCORRECT: 'incorrect',
  CLOSE: 'close',
  UNUSED: 'unused'
})

const GUESS_STATUS_COLORS = Object.freeze({
  [GUESS_STATUS.CORRECT]: '#6AAA64',
  [GUESS_STATUS.INCORRECT]: '#787C7E',
  [GUESS_STATUS.CLOSE]: '#C9B458',
  [GUESS_STATUS.UNUSED]: '#D3D6DA'
})

const SPECIAL_KEYS = Object.freeze({
  ENTER: 'Enter',
  BACKSPACE: 'Backspace'
})

const QWERTY_KEYS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  [SPECIAL_KEYS.ENTER, 'z', 'x', 'c', 'v', 'b', 'n', 'm', SPECIAL_KEYS.BACKSPACE]
]

export {
  GUESS_STATUS,
  GUESS_STATUS_COLORS,
  SPECIAL_KEYS,
  QWERTY_KEYS,
  WORDLE_WORD_LENGTH
}