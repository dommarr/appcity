export function capitalizeEveryWord(str) {
  str = str?.trim();
  if (str) {
    let wordArray = str.split(" ");
    let string = wordArray
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1).toLowerCase();
      })
      .join(" ");
    return string;
  }
  return;
}

export function capitalizeFirstWord(str) {
  str = str?.trim();
  if (str) {
    let wordArray = str.split(" ");
    let lastIndex = wordArray.length - 1;
    let word = wordArray[0];
    let firstWord = word[0].toUpperCase() + word.substring(1);
    wordArray.shift();
    wordArray.unshift(firstWord);
    if ([".", "?", "!"].includes(wordArray[lastIndex].slice(-1))) {
      let lastWord = wordArray[lastIndex].substring(0, wordArray[lastIndex].length - 1);
      wordArray.pop();
      wordArray.push(lastWord);
    }
    let string = wordArray.join(" ");
    return string;
  }
  return;
}

export function formatSentence(str) {
  let string = str?.trim();
  if (string) {
    let punc = ".";
    if ([".", "?", "!"].includes(string.slice(-1))) {
      punc = string.slice(-1);
      string = string.substring(0, string.length - 1);
    }
    let sentenceArray = string.split(" ");
    sentenceArray[0] = sentenceArray[0][0].toUpperCase() + sentenceArray[0].substring(1);
    let lastWordIndex = sentenceArray.length - 1;
    let lastLettersArray = sentenceArray[lastWordIndex].split("");
    lastLettersArray.push(punc);
    sentenceArray[lastWordIndex] = lastLettersArray.join("");
    let sentence = sentenceArray.join(" ");
    return sentence;
  }
  return;
}

export function formatParagraph(str) {
  str = str?.trim();
  if (str) {
    let matchedArray = str.match(/.*?[?!.]/g);
    if (matchedArray == null) {
      matchedArray = [];
      matchedArray.push(str);
    }
    let sentences = matchedArray.map(formatSentence);
    let paragraph = sentences.join(" ");
    return paragraph;
  }
  return;
}
