import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Tile from './tile';

import config from '../config.js';
const { typeMapping } = config;

const TileRowContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center'
}));
const TileComponent = styled(Tile)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}));

const TileRow = ({ letters = '', types = '', tileSize, wordLength  = 5, gameOver }) => {
  const tileLetters = letters.split('');
  const tileTypes = types.split('');

  return (
    <TileRowContainer>
      {Array.from(Array(wordLength).keys()).map((index) => <TileComponent key={index} flipped={!!types} position={index} size={gameOver ? tileSize/2 : tileSize} letter={gameOver ? undefined : tileLetters[index]} type={typeMapping[tileTypes[index]]} gameOver={gameOver} />)}
    </TileRowContainer>
  )
}

export default TileRow;

TileRow.propTypes = {
  tileSize: PropTypes.number,
  letters: PropTypes.string,
  answer: PropTypes.string,
  wordLength: PropTypes.number,
  gameOver: PropTypes.bool
};