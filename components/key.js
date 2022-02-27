import styled from '@emotion/styled';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

const KeyButton = styled(Button)(({ theme }) => ({
  margin: '2px',
  height: '60px',
  lineHeight: 0,
  letterSpacing: 0,
  minWidth: 0,
  padding: 0,
  textAlign: 'center',
  display: 'inline-block',
  textTransform: 'uppercase',
  fontSize: '18pt'
}));

const Key = ({ letter, ...props }) => {
  return <KeyButton variant='contained' {...props}>{letter}</KeyButton>
}

export default Key;

Key.propTypes = {
  letter: PropTypes.string,
  color: PropTypes.string
};