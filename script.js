const TIME_LIMIT = 60;
const quoteApiUrl = 'https://api.quotable.io/random?minLength=80';
let quotesArray = [];

const timerText = document.querySelector('.current_time');
const accuracyText = document.querySelector('.current_accuracy');
const errorText = document.querySelector('.current_errors');
const wpmText = document.querySelector('.current_wpm');
const quoteText = document.querySelector('.quote');
const inputArea = document.querySelector('.input_area');
const restartBtn = document.querySelector('.restart_btn');
const startBtn = document.querySelector('.start_btn');
const wpmGroup = document.querySelector('.wpm');
const errorGroup = document.querySelector('.errors');
const accuracyGroup = document.querySelector('.accuracy');
const headerArea = document.querySelector('.header');

let timeLeft = TIME_LIMIT;
let timeElapsed = 0;
let totalErrors = 0;
let errors = 0;
let accuracy = 0;
let characterTyped = 0;
let currentQuote = '';
let quoteNumber = 0;
let timer = null;

const getQuote = async () => {
    const response = await fetch(quoteApiUrl);
    let data = await response.json();
    quote = data.content;
    quotesArray.push(quote)
};

const updateQuote = () => {
  quoteText.textContent = null;
  currentQuote = quotesArray[quoteNumber];

  currentQuote.split('').forEach(char => {
    const charSpan = document.createElement('span')
    charSpan.innerText = char
    quoteText.appendChild(charSpan)
  })

  if (quoteNo < quotesArray.length - 1) {
    quoteNumber++;
  } else {
    quoteNumber = 0;
  }
};

const processCurrentText = () => {
  currInput = inputArea.value;
  currInputArray = currInput.split('');
  characterTyped++;
  errors = 0;

  quoteSpanArray = quoteText.querySelectorAll('span');
  quoteSpanArray.forEach((char, index) => {
    let typedChar = currInputArray[index]

    if (typedChar == null) {
      char.classList.remove('correct_char');
      char.classList.remove('incorrect_char');

    } else if (typedChar === char.innerText) {
      char.classList.add('correct_char');
      char.classList.remove('incorrect_char');

    } else {
      char.classList.add('incorrect_char');
      char.classList.remove('correct_char');
      errors++;
    }
  });

  errorText.textContent = totalErrors + errors;

  let correctCharacters = (characterTyped - (totalErrors + errors));
  let accuracyVal = ((correctCharacters / characterTyped) * 100);
  accuracyText.textContent = Math.round(accuracyVal);

  if (currInput.length == currentQuote.length) {
    updateQuote();
    totalErrors += errors;
    inputArea.value = '';
  }
};

const updateTimer = () => {
  if (timeLeft > 0) {
    timeLeft--;
    timeElapsed++;
    timerText.textContent = timeLeft + 's';
  }
  else {
    finishGame();
  }
};

const finishGame = () => {
  clearInterval(timer);
  inputArea.disabled = true;
  quoteText.textContent = 'Click on restart to start a new game.';
  restartBtn.style.display = 'flex';
  wpm = Math.round((((characterTyped / 5) / timeElapsed) * 60));
  wpmText.textContent = wpm;
  wpmGroup.style.display = 'block';
  headerArea.style.background = '#451166';
};


const startGame = async () => {
  inputArea.disabled = false;
  inputArea.focus();
  resetAllValues();
  updateQuote();
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
  startBtn.style.display = 'none';
  headerArea.style.background = 'transparent';
}

const resetAllValues = () => {
  timeLeft = TIME_LIMIT;
  timeElapsed = 0;
  errors = 0;
  totalErrors = 0;
  accuracy = 0;
  characterTyped = 0;
  quoteNo = 0;
  inputArea.disabled = false;

  inputArea.value = '';
  quoteText.textContent = 'Click on the area below to start the game.';
  accuracyText.textContent = 100;
  timerText.textContent = timeLeft + 's';
  errorText.textContent = 0;
  restartBtn.style.display = 'none';
  wpmGroup.style.display = 'none';
  startBtn.style.display = 'flex';
};

window.onload = () => {
  for (i=0; i <= 20; i++) {
    getQuote();
  }
};