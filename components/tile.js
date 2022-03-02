import styled from '@emotion/styled';
import { Paper } from '@mui/material';
import PropTypes from 'prop-types';

const EmptyTile = styled(Paper)(({ theme, ...props }) => ({
  transition: `all 1s ease, background 0s`,
  margin: props['data-gameover'] ? '1px' : '2px',
  height: 0,
  textAlign: 'center',
  lineHeight: 0,
  letterSpacing: 0,
  display: 'inline-block',
  textTransform: 'uppercase',
  textShadow: '0px -1px #aaa',
  background: theme.palette.tiletypes.empty.main,
  border: `1px solid ${theme.palette.tiletypes.empty.main}`,
  ...(Object.entries(theme.palette.tiletypes).reduce((all, [color, colors]) => ({ ...all, [`@keyframes flip${color}`]: {
    "0%": {
      transform: 'perspective(500px) rotateY(-360deg)',
    },
    "75%": {
      background: theme.palette.tiletypes.empty.main,
      border: `1px solid ${theme.palette.tiletypes.empty.main}`,
    },
    "76%, 100%": {
      background: `linear-gradient(to bottom, ${colors.main}, ${colors.dark})`,
      border: `1px solid ${colors.main}`,
    }
  }}), {}))
}));
const ColorTile = styled(EmptyTile)((props) => ({
  transition: `all 1s ease, text-indent 0s, transform 0.3s linear ${props['data-delay']}s`,
  animation: `flip${props['data-type']} ${props['data-gameover'] ? '0s' : '0.6s'} linear ${props['data-gameover'] ? '0' : props['data-delay']}s 1 normal forwards`,
}));

const Tile = ({ size, type, letter, position, gameOver }) => {
  if (type) {
    return <ColorTile elevation={2} data-type={type} data-delay={position*0.2} sx={{ width: `${size}px`, padding: `${(size-2)/2}px 0`, fontSize: `${size/1.4}px` }} data-gameover={gameOver}>{letter || '\u00A0'}</ColorTile>
  }
  return <EmptyTile elevation={2} data-delay={position*0.2} sx={{ width: `${size}px`, padding: `${(size-2)/2}px 0`, fontSize: `${size/1.4}px` }} data-gameover={gameOver}>{letter || '\u00A0'}</EmptyTile>
}

export default Tile;

Tile.propTypes = {
  size: PropTypes.number.isRequired,
  type: PropTypes.string,
  letter: PropTypes.string,
  flipped: PropTypes.bool,
  gameOver: PropTypes.bool
};