import styled from '@emotion/styled';
import Key from './key';
import PropTypes from 'prop-types';
import useKeyPress from '../hooks/useKeyPress';

import config from '../config.js';
const { typeMapping, keyboardLayout } = config;

const allowedKeys = [].concat.apply([], keyboardLayout).filter((key) => isNaN(key));

const KeyboardContent = styled('div')(({ theme }) => ({

}));
const KeyboardRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignContent: 'left'
}));
const LetterKey = styled(Key)(({ theme }) => ({
  flex: 1
}));
const Backspace = styled(Key)(({ theme }) => ({
  fontSize: '16pt',
  flex: 1.2
}));
const Enter = styled(Key)(({ theme }) => ({
  fontSize: '12pt',
  textTransform: 'none',
  flex: 3
}));
const Spacer = styled('div')(({ theme, flex }) => ({
  flex
}));

const Keyboard = ({ usedLetters, onLetter, onBackspace, onSubmit }) => {
  useKeyPress((key) => {
    if (key === 'Backspace' ) {
      onBackspace();
    }
    else if (key === 'Enter' ) {
      onSubmit();
    }
    else if (allowedKeys.includes(key)) {
      onLetter(key);
    }
  }, [onLetter, onBackspace, onSubmit])

  return (
    <KeyboardContent>
      {keyboardLayout.map((keys, rowidx) => (
        <KeyboardRow key={rowidx}>
          {keys.map((key, kexidx) => {
            if (!isNaN(key)) {
              return <Spacer key={kexidx} flex={key} />
            }
            if (key === 'Enter') {
              return <Enter key={kexidx}  letter={'enter'} onClick={() => onSubmit()} color="key_enter" />;
            }
            if (key === 'Backspace') {
              return <Backspace key={kexidx}  letter={'⌫'} onClick={() => onBackspace()} color="key_backspace"/>;
            }
            return <LetterKey key={kexidx}  letter={key} onClick={() => onLetter(key)} color={key in usedLetters ? `key_${typeMapping[usedLetters[key]]}` : undefined}/>;
          })}
        </KeyboardRow>
      ))}
    </KeyboardContent>
  )
}

export default Keyboard;

Keyboard.propTypes = {
  usedLetters: PropTypes.object.isRequired,
  onLetter: PropTypes.func.isRequired,
  onBackspace: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};