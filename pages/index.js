import styled from '@emotion/styled';
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react';
import useWindowDimensions from '../hooks/useWindowDimensions';
import Keyboard from '../components/keyboard';
import TileGrid from '../components/tilegrid';
import { useCookies } from "react-cookie";
import gradeWord from '../utility/gradeWord';
import OrigSnackbar from '@mui/material/Snackbar';

import config from '../config.js';
const { knownWords, occuringWords, wordLength, attempts } = config;

const Snackbar = styled(OrigSnackbar)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: theme.palette.popup.background,
    color: theme.palette.popup.text,
    borderRadius: theme.shape.borderRadius
  },
  '& .MuiSnackbarContent-message': {
    width: '100%',
    textAlign: 'center'
  }
}));
const Container = styled('div')(({ theme, padding }) => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: '100vw',
  height: '100vh'
}));
const Main = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center'
}));
const TileContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}));
const Footer = styled('footer')(({ theme, hidden }) => ({
  flexBasis: hidden ? 0 : '210px',
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'center',
  transition: `flex-basis 1s ease`,
  overflow: 'hidden'
}));
const KeyboardContainer = styled('div')(({ theme }) => ({
  flexBasis: '450px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start'
}));

export default function Home() {
  const now = new Date();
  const dayAndMonth = String(now.getDate()) + '/' + String(now.getMonth() + 1);

  const [cookies, setCookie] = useCookies(["date", "words", "results", "usedLetters", "gameState"]);
  const [answer] = useState(occuringWords[Math.floor(now/8.64e7) % occuringWords.length]);
  const { width } = useWindowDimensions();
  const tileSize = width < 500 ? width / 6.5 : 70;
  const [words, setWords] = useState([]);
  const [results, setResults] = useState([]);
  const [index, setIndex] = useState(0);
  const [usedLetters, setUsedLetters] = useState({});
  const [gameState, setGameState] = useState(0);
  const [message, setMessage] = useState();

  useEffect(() => 
  {
    if(cookies.date === dayAndMonth) {
      setWords(cookies.words || Array(attempts).fill(''));
      setUsedLetters(cookies.usedLetters);
      setResults(cookies.results || []);
      if (cookies.gameState === '0') {
        setIndex(cookies.results?.length || 0);
      }
      else {
        setGameState(parseInt(cookies.gameState) * 2); // 2 and -2 skips animation
      }
    }
    else {
      setCookie('date', dayAndMonth);
      setCookie('words', Array(attempts).fill(''));
      setCookie('usedLetters', {});
      setCookie('results', []);
      setCookie('gameState', 0);
      
      setWords(Array(attempts).fill(''));
      setUsedLetters({});
      setResults([]);
      setGameState(0);
      setIndex(0);
    }
  }, [dayAndMonth])

  const handleLetter = (key) => {
    if (gameState === 0 && words[index].length < wordLength) {
      const newWords = [...words];
      newWords[index] = `${newWords[index]}${key}`;
      setWords(newWords);
      setCookie('words', newWords);
    }
  };

  const handleBackspace = () => {
    if (gameState === 0 && words[index].length > 0) {
      const newWords = [...words];
      newWords[index] = newWords[index].substring(0, newWords[index].length-1);
      setWords(newWords);
      setCookie('words', newWords);
    }
  };
  
  const handleSubmit = () => {
    if (gameState === 0 && index < words.length && words[index].length === wordLength) {
      if (!knownWords.includes(words[index])) {
        setMessage({ text: 'Okänt Ord', duration: 2000 })
        return;
      }

      const result = gradeWord(words[index], answer);
      setResults((results) => [...results, result]);
      setCookie('results', [...results, result]);

      const newUsedLetters = {};
      for (let charIdx = 0; charIdx < result.length; charIdx++) {
        if (result.charAt(charIdx) === '+') {
          newUsedLetters[words[index].charAt(charIdx)] = '+';
        }
        else if (words[index].charAt(charIdx) in usedLetters === false) {
          newUsedLetters[words[index].charAt(charIdx)] = result.charAt(charIdx);
        }
      }
      setUsedLetters((usedLetters) => ({ ...usedLetters, ...newUsedLetters }));
      setCookie('usedLetters', { ...usedLetters, ...newUsedLetters });

      const winner = (result === '+'.repeat(wordLength));
      if (index+1 === words.length || winner) {
        setGameState(winner ? 1 : -1)
        setCookie('gameState', winner ? 1 : -1);
        setMessage({ text: winner ? 'Bra jobbat!' : `Svaret var "${answer}", bättre lycka imorgon.`, duration: 5000 })
      }
      else {
        setIndex(index+1);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Swerdle</title>
        <meta name="description" content="Bork bork" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Container padding={width < 500 ? width/15 : 30}>
        <Main>
          <TileContainer>
            <TileGrid tileSize={tileSize} wordLength={wordLength} words={words} results={results} gameState={gameState} date={dayAndMonth} onCopy={() => setMessage({ text: 'Kopierat till urklipp' })} />
          </TileContainer>
        </Main>
        <Footer hidden={gameState !== 0}>
          <KeyboardContainer>
            <Keyboard usedLetters={usedLetters} onLetter={handleLetter} onBackspace={handleBackspace} onSubmit={handleSubmit} />
          </KeyboardContainer>
        </Footer>
      </Container>
      <Snackbar
        open={!!message}
        autoHideDuration={message && message.duration || 2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={message && message.text.toUpperCase()}
        onClose={() => setMessage(undefined)}
      />
    </>
  )
}

const randomIntUpTo = (max) => { // min and max included 
  return Math.floor(Math.random() * (max + 1))
}