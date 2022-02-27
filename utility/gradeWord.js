export default function(word, answer) {
    answer = answer.split('');
    word = word.split('');
    const result = [];
    
    for (const idx of word.keys()) {
      if (word[idx] === answer[idx]) {
        result[idx] = '+';
        word[idx] = false;
        answer[idx] = false;
      }
    }
    for (const idx of word.keys()) {
      if (word[idx] === false) continue;
      const pos = answer.indexOf(word[idx])
      if (pos != -1) {
        result[idx] = '-';
        word[idx] = false;
        answer[pos] = false;
      }
    }
    for (const idx of word.keys()) {
      if (word[idx] === false) continue;
      result[idx] = ' ';
    }
  
    return result.join('');
}