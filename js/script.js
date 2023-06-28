const typingText = document.querySelector('.typing-text p'),
  inputField = document.querySelector('.wrapper .input-field'),
  timeTag = document.querySelector('.content .time span b'),
  mistakeTag = document.querySelector('.content .mistake span'),
  wpmTag = document.querySelector('.content .wpm span'),
  cpmTag = document.querySelector('.content .cpm span'),
  button = document.querySelector('.content button');

let maxTime = 60,
  timeLeft = maxTime,
  charIndex = (mistakes = isTyping = 0);

function randomText() {
  // рандомный индекс текста мз массива paragraphs
  let randomIndex = Math.floor(Math.random() * paragraphs.length);
  typingText.innerHTML = '';
  // разбираем текст на массив символов, после чего проходимся по массиву и записываем каждый символ в тег span,присоединяя к p
  paragraphs[randomIndex].split('').forEach((span) => {
    let spanTag = `<span>${span}</span>`;
    typingText.innerHTML += spanTag;
  });
  // фокусируем input-field при нажатии на клавишу и клика на текст
  document.addEventListener('keydown', () => inputField.focus());
  typingText.addEventListener('click', () => inputField.focus());
}

function initTyping() {
  const characters = typingText.querySelectorAll('span');
  let typedChar = inputField.value.split('')[charIndex];
  // если количество символов в тексте заканчивается или исходит время таймера
  if (charIndex < characters.length - 1 && timeLeft > 0) {
    if (!isTyping) {
      // таймер начнет отсчет при начале печати
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }
    // при нажатии на backspace прошлый символ удаляется и равняется null
    if (typedChar == null) {
      charIndex--;
      // уменьшать количество ошибок если span содержал класс incorrect
      if (characters[charIndex].classList.contains('incorrect')) {
        mistakes--;
      }
      characters[charIndex].classList.remove('correct', 'incorrect');
    } else {
      if (characters[charIndex].innerText === typedChar) {
        // если символ совпадает с введенным текстом, то добавляет класс correct
        characters[charIndex].classList.add('correct');
      } else {
        // иначе добавляет класс incorrect
        mistakes++;
        characters[charIndex].classList.add('incorrect');
      }
      charIndex++;
    }
    // класс с анимацией для активного символа
    characters.forEach((span) => span.classList.remove('active'));
    characters[charIndex].classList.add('active');

    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
    ); // количество символов в минуту
    wpm = wpm > 0 || !wpm || wpm === Infinity ? 0 : wpm;
    mistakeTag.innerText = mistakes;
    wpmTag.innerText = wpm;
    cpmTag.innerText = charIndex - mistakes; // количество правильных веденных символов
  } else {
    inputField.value = '';
    clearInterval(timer);
  }
}

// таймер
function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;
  } else {
    clearInterval(timer);
  }
}

function resetGame() {
  randomText();
  inputField.value = '';
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0;
  timeTag.innerText = timeLeft;
  mistakeTag.innerText = 0;
  wpmTag.innerText = 0;
  cpmTag.innerText = 0;
}

randomText();
inputField.addEventListener('input', initTyping);
button.addEventListener('click', resetGame);
