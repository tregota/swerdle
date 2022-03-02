import styled from '@emotion/styled';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import useWindowDimensions from '../hooks/useWindowDimensions';
import useEvent from '../hooks/useEvent';
import Keyboard from '../components/keyboard';
import TileGrid from '../components/tilegrid';
import gradeWord from '../utility/gradeWord';
import OrigSnackbar from '@mui/material/Snackbar';

import config from '../config.js';
import useLocalStorage from '../hooks/useLocalStorage';
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
  height: '100vh',
  height: 'calc(var(--vh, 1vh) * 100)'
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

  const [savedState, setSavedState] = useLocalStorage('savedState', { date: '' })
  const [pastResults, setPastResults] = useLocalStorage('pastResults', { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, gamesPlayed: 0});
  const [answer] = useState(occuringWords[Math.floor(now/8.64e7) % occuringWords.length]);
  const { width } = useWindowDimensions();
  const tileSize = width < 500 ? width / 6.6 : 70;
  const [words, setWords] = useState([]);
  const [results, setResults] = useState([]);
  const [index, setIndex] = useState(0);
  const [usedLetters, setUsedLetters] = useState({});
  const [gameState, setGameState] = useState(0);
  const [message, setMessage] = useState();

  useEffect(() => {
    if (gameState !== 0) {
      console.log(pastResults);
    }
  },[pastResults]);

  useEffect(() => {
    // from https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  },[]);

  useEvent('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, [])

  useEffect(() => 
  {
    if (savedState.date === dayAndMonth) {
      setWords(savedState.words || Array(attempts).fill(''));
      setUsedLetters(savedState.usedLetters);
      setResults(savedState.results || []);
      if (savedState.gameState === '0') {
        setIndex(savedState.results?.length || 0);
      }
      else {
        setGameState(parseInt(savedState.gameState) * 2); // 2 and -2 skips animation
      }
    }
    else {
      setSavedState({
        date: dayAndMonth,
        words: Array(attempts).fill(''),
        usedLetters: {},
        results: [],
        gameState: 0,
      });
      
      setWords(Array(attempts).fill(''));
      setUsedLetters({});
      setResults([]);
      setGameState(0);
      setIndex(0);
    }
  }, [savedState, dayAndMonth]);

  const handleLetter = (key) => {
    if (gameState === 0 && words[index].length < wordLength) {
      const newWords = [...words];
      newWords[index] = `${newWords[index]}${key}`;
      setWords(newWords);
      setSavedState((state) => ({
        ...state,
        words: newWords
      }))
    }
  };

  const handleBackspace = () => {
    if (gameState === 0 && words[index].length > 0) {
      const newWords = [...words];
      newWords[index] = newWords[index].substring(0, newWords[index].length-1);
      setWords(newWords);
      setSavedState((state) => ({
        ...state,
        words: newWords
      }))
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

      const winner = (result === '+'.repeat(wordLength));
      if (index+1 === words.length || winner) {
        setGameState(winner ? 1 : -1)
        setMessage({ text: winner ? 'Bra jobbat!' : `Svaret var "${answer}", bättre lycka imorgon.`, duration: 4000 })
        setSavedState((state) => ({
          ...state,
          results: [...results, result],
          usedLetters: { ...usedLetters, ...newUsedLetters },
          gameState: winner ? 1 : -1
        }))
        setPastResults((results) => ({
          ...results,
          [index+1]: results[index+1] + 1,
          gamesPlayed: results.gamesPlayed + 1
        }));
      }
      else {
        setIndex(index+1);
        setSavedState((state) => ({
          ...state,
          results: [...results, result],
          usedLetters: { ...usedLetters, ...newUsedLetters }
        }))
      }
    }
  };

  return (
    <>
      <Head>
        <title>Swerdle</title>
        <meta name="description" content="Bork bork" />
        <link rel="icon" href="/swerdle/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/swerdle/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/swerdle/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/swerdle/favicon-16x16.png" />
        <link rel="manifest" href="/swerdle/site.webmanifest" />
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