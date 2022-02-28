import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TileRow from './tilerow';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import config from '../config.js';
const { typeMapping, url } = config;

const unicodeMapping = (theme) => ({
  'green': '🟩',
  'blue': '🟦',
  'yellow': '🟨',
  'miss': theme.palette.mode === 'dark' ? '⬛' : '⬜'
})

const Clickable = styled('div')(({ gameOver }) => ({
  position: 'relative',
  '&:hover': !gameOver ? undefined : {
    cursor: 'pointer'
  }
}));
const ClickTip = styled('div')(({ theme, tileSize }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  top: `${tileSize}px`,
  left: 0,
  height: `calc(100% - ${tileSize}px)`,
  width: '100%',
  '& span': {
    flex: 1,
    textAlign: 'center',
  },
  '& svg': {
    color: 'transparent',
    fontSize: `${tileSize*2}px`
  },
  '&:hover svg': {
    color: theme.palette.copy_symbol
  }
}));
const Text = styled('div')(({ theme, fontSize }) => ({
  textAlign: 'center',
  fontSize: `${fontSize}px`,
  color: theme.palette.copy_symbol
}));

const TileGrid = ({ words, results, tileSize, wordLength  = 5, gameState, date, onCopy }) => {
  const [showGameOver, setShowGameOver] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    let timer;
    if (gameState > 1 || gameState < -1) {
      // immidiate game over
      setShowGameOver(true);
      return;
    }
    else if (gameState !== 0) {
      timer = setTimeout(() => setShowGameOver(true), 2500);
    }
    else {
      setShowGameOver(false);
    }
    return () => clearTimeout(timer);
  }, [gameState]);

  const handleClick = () => {
    if (gameState !== 0) {
      navigator.clipboard.writeText(
        "SWERDLE " + date + "\n" +
        results.filter((result) => result !== '').map((result) => result.split('').map((key) => unicodeMapping(theme)[typeMapping[key]]).join('') + "\n").join('') +
        url
      );
      onCopy && onCopy();
    }
  }

  return (
    <>
      <Clickable gameOver={gameState !== 0} onClick={handleClick}>
        {gameState === 0 ? null : <Text fontSize={tileSize/3}>{"SWERDLE " + date}</Text>}
        {words.filter((word) => gameState === 0 || word !== '').map((word, idx) => <TileRow key={idx} wordLength={wordLength} tileSize={tileSize} letters={word} types={results[idx]} gameOver={showGameOver} />)}
        {gameState === 0 ? null : <ClickTip tileSize={tileSize/2.5}><span><ContentCopyIcon /></span></ClickTip>}
        {gameState === 0 ? null : <Text fontSize={tileSize/5}>{"KOPIERA TILL URKLIPP"}</Text>}
      </Clickable>
    </>
  )
}

export default TileGrid;

TileGrid.propTypes = {
  tileSize: PropTypes.number,
  wordLength: PropTypes.number,
  words: PropTypes.array,
  results: PropTypes.array,
  gameState: PropTypes.number,
  date: PropTypes.string,
  onCopy: PropTypes.func
};