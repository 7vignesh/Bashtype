var input = document.getElementById("terminal-input");
var content = document.getElementById("terminal-content");

const o = "&nbsp;";
const commandList = ["help", "welcome", "start", "reset", "stats", "clear", "config"];
const helpCmds = [
  `<strong>------ ✨ Typing Test Commands ✨ ------</strong><br>`,
  `<span id='faint-glow-purple' class='term-purple'>help</span>     ${o}${o}${o}${o}${o}${o}${o}${o}   📜 Displays this message <br>`,
  `<span id='faint-glow-purple' class='term-purple'>welcome</span>  ${o}${o}${o}${o}${o}               🎉 Displays the welcome message <br>`,
  `<span id='faint-glow-purple' class='term-purple'>start</span>    ${o}${o}${o}${o}${o}${o}${o}       🚀 Start the typing test <br>`,
  `<span id='faint-glow-purple' class='term-purple'>reset</span>    ${o}${o}${o}${o}${o}${o}${o}       🔄 Reset the typing test <br>`,
  `<span id='faint-glow-purple' class='term-purple'>stats</span>    ${o}${o}${o}${o}${o}${o}${o}       📊 View typing test statistics <br>`,
  `<span id='faint-glow-purple' class='term-purple'>config</span>   ${o}${o}${o}${o}${o}${o}           ⚙️  Configure test settings <br>`,
  `<span id='faint-glow-purple' class='term-purple'>clear</span>    ${o}${o}${o}${o}${o}${o}${o}       🧹 Clears the terminal <br>`,
];
const welcomeMsg = [
  `Welcome to <span id="term-green" class="faint-glow-green">BashType</span> <br>`,
  `Type <span id="term-green" class="faint-glow-green">'help'</span> for the list of available commands.<br>`,
];
const resetMsg = [
  `🔄 The typing test has been reset. Type <span id="term-green" class="faint-glow-green">'start'</span> to begin again.`,
];
let testStartTime, testEndTime;
let isTesting = false;
let testText = "";
let typingTestResults = [];
let currentTypedText = "";
let liveStatsVisible = false;

// Configuration options
let config = {
  wordCount: 10,
  difficulty: 'medium', // 'easy', 'medium', 'hard'
};

async function fetchWords() {
  const response = await fetch("words.json");
  const words = await response.json();
  return words;
}

async function getRandomWords(wordCount = config.wordCount, difficulty = config.difficulty) {
  const words = await fetchWords();
  const allWords = Object.values(words);

  let filteredWords = allWords;
  switch (difficulty) {
    case "easy":
      filteredWords = allWords.filter((word) => word.length <= 4);
      break;
    case "medium":
      filteredWords = allWords.filter((word) => word.length >= 5 && word.length <= 6);
      break;
    case "hard":
      filteredWords = allWords.filter((word) => word.length >= 7);
      break;
    default:
      filteredWords = allWords;
  }

  if (filteredWords.length === 0) {
    filteredWords = allWords;
  }

  if (filteredWords.length === 0) {
    return "";
  }

  const randomWords = [];
  if (wordCount <= filteredWords.length) {
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    randomWords.push(...shuffled.slice(0, wordCount));
  } else {
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      randomWords.push(filteredWords[randomIndex]);
    }
  }

  return randomWords.join(" ");
}

function calculateAccuracy(expectedText, typedText) {
  let correctChars = 0;
  const totalChars = Math.max(expectedText.length, typedText.length);
  for (let i = 0; i < typedText.length; i++) {
    if (i < expectedText.length && expectedText[i] === typedText[i]) {
      correctChars++;
    }
  }
  return totalChars > 0 ? (correctChars / totalChars) * 100 : 100;
}

function analyzeErrors(expectedText, typedText) {
  const errors = {};
  for (let i = 0; i < typedText.length; i++) {
    if (expectedText[i] !== typedText[i]) {
      const expectedChar = expectedText[i] || " ";
      const typedChar = typedText[i];
      const errorKey = `"${expectedChar}" as "${typedChar}"`;
      errors[errorKey] = (errors[errorKey] || 0) + 1;
    }
  }
  return errors;
}

function calculateLiveWPM(startTime, typedText) {
  if (!startTime || typedText.length === 0) return 0;
  const currentTime = new Date().getTime();
  const timeDiffMinutes = (currentTime - startTime) / 1000 / 60;
  if (timeDiffMinutes === 0) return 0;
  return (typedText.length / 5) / timeDiffMinutes;
}

function updateLiveStats() {
  if (!isTesting || !liveStatsVisible) return;

  const liveWPM = calculateLiveWPM(testStartTime, currentTypedText);
  const liveAccuracy = calculateAccuracy(testText, currentTypedText);

  const liveStatsElement = document.getElementById('live-stats');
  if (liveStatsElement) {
    liveStatsElement.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,0.8); padding: 10px; border-radius: 5px; font-size: 14px;">
        <div>Live WPM: <span style="color: #00d8ff;">${liveWPM.toFixed(1)}</span></div>
        <div>Accuracy: <span style="color: ${liveAccuracy >= 90 ? '#00ff00' : liveAccuracy >= 70 ? '#ffff00' : '#ff4444'};">${liveAccuracy.toFixed(1)}%</span></div>
      </div>
    `;
  }
}

const terminal = {
  echo: async function (
    text,
    delay,
    startNewLine = true,
    endNewLine = true,
    isAwaited = false,
    inputField = content
  ) {
    let index = 0;
    if (startNewLine) {
      inputField.innerHTML += "<br>";
    }
    terminal.hide();
    terminal.disable();
    const inputInterval = setInterval(async function () {
      if (isAwaited) {
        inputField.innerHTML += await text[index];
      }
      if (!isAwaited) {
        inputField.innerHTML += text[index];
      }
      index++;
      ScrollTo("bottom");
      if (index === text.length) {
        clearInterval(inputInterval);
        if (endNewLine) {
          content.innerHTML += "<br>";
        }
        terminal.show();
        terminal.enable();
        input.focus();
      }
    }, delay);
  },

  autofocus: function () {
    if (input.hasAttribute("onblur")) {
      input.removeAttribute("onblur");
    } else {
      input.setAttribute("onblur", "FocusInput()");
    }
  },

  enable: function () {
    document.getElementById("terminal-input").removeAttribute("disabled", "");
  },

  disable: function () {
    document.getElementById("terminal-input").setAttribute("disabled", "");
  },

  show: function () {
    document.getElementById("path").removeAttribute("class", "invisible");
  },

  hide: function () {
    document.getElementById("path").setAttribute("class", "invisible");
  },
};

input.addEventListener("keydown", HandleCommands);
input.addEventListener("input", HandleLiveTyping);

function ScrollTo(direction) {
  if (direction === "top") {
    window.scrollTo(0, 0);
  }
  if (direction === "bottom") {
    window.scrollTo(0, document.body.scrollHeight);
  }
}

function FocusInput() {
  setTimeout(() => {
    input.focus();
  }, 25);
}

function ExecuteWelcomeCommandOnLoad() {
  let index = 0;
  let text = welcomeMsg;
  let delay = 25;

  const inputInterval = setInterval(function () {
    content.innerHTML += text[index];
    index++;
    if (index === text.length) {
      clearInterval(inputInterval);
    }
  }, delay);

  ScrollTo("top");
  document.getElementById("terminal-welcome-loading-text").innerText =
    "👋 Welcome";
  document.getElementById("terminal").removeAttribute("class");
  input.removeAttribute("disabled");
  input.focus();
}

async function HandleCommands(event) {
  if (event.key === "Enter") {
    const command = input.value.trim();
    input.value = "";
    content.innerHTML += `<br><span id="term-orange">BashType</span>@<span id="term-green">Bash.codeX</span>:~$ ${command} <br>`;
    await ExecuteCommand(command);
  }
}

function HandleLiveTyping(event) {
  if (isTesting) {
    currentTypedText = input.value;
    updateLiveStats();
  }
}

async function ExecuteCommand(command) {
  const commandParts = command.trim().split(/\s+/);
  const baseCommand = commandParts[0].toLowerCase();

  if (
    isTesting &&
    baseCommand !== "reset" &&
    baseCommand !== "help" &&
    baseCommand !== "clear" &&
    baseCommand !== "stats"
  ) {
    const typedText = command.trim();
    testEndTime = new Date().getTime();
    const accuracy = calculateAccuracy(testText, typedText);
    const errors = analyzeErrors(testText, typedText);
    let timeDiff = (testEndTime - testStartTime) / 1000; // in seconds
    const timeDiffMinutes = timeDiff / 60;
    let wpm = timeDiffMinutes > 0 ? (typedText.length / 5) / timeDiffMinutes : 0;
    typingTestResults.push({ wpm, accuracy, errors });

    let errorFeedback = "";
    if (Object.keys(errors).length > 0) {
      errorFeedback = "<br>Most common mistakes:<br>";
      const sortedErrors = Object.entries(errors).sort((a, b) => b[1] - a[1]);
      sortedErrors.forEach(([error, count]) => {
        errorFeedback += `  - ${error}: ${count} time(s)<br>`;
      });
    }

    const resultMessage = [
      `✅ Typing test completed. WPM: ${wpm.toFixed(
        2
      )}, Accuracy: ${accuracy.toFixed(2)}%`,
      errorFeedback,
      `<br>Do you want to continue? Press <span id="term-green">'y'</span> for another test or <span id="term-red">'n'</span> to stop.`,
    ];

    terminal.echo(
      resultMessage,
      25,
      false,
      true
    );
    isTesting = false;
    testText = "";
    liveStatsVisible = false;
    const liveStatsElement = document.getElementById('live-stats');
    if (liveStatsElement) liveStatsElement.innerHTML = '';
  } else {
    switch (baseCommand) {
      case "help":
        terminal.echo(helpCmds, 10, false, true);
        break;
      case "stats":
        if (typingTestResults.length > 0) {
          const statsMsg = [
            `<strong>------ 📊 Typing Test Statistics 📊 ------</strong><br>`,
          ];

          // Calculate average WPM and Accuracy
          const totalWPM = typingTestResults.reduce((acc, result) => acc + result.wpm, 0);
          const avgWPM = totalWPM / typingTestResults.length;
          const totalAcc = typingTestResults.reduce((acc, result) => acc + result.accuracy, 0);
          const avgAcc = totalAcc / typingTestResults.length;

          statsMsg.push(`Tests Completed: <span id="term-cyan">${typingTestResults.length}</span><br>`);
          statsMsg.push(`Average WPM: <span id="term-green">${avgWPM.toFixed(2)}</span><br>`);
          statsMsg.push(`Average Accuracy: <span id="term-green">${avgAcc.toFixed(2)}%</span><br><br>`);

          statsMsg.push(`Last 5 Tests:<br>`);
          const last5 = typingTestResults.slice(-5).reverse();
          last5.forEach((result, i) => {
            statsMsg.push(`  ${i + 1}. WPM: ${result.wpm.toFixed(2)} | Acc: ${result.accuracy.toFixed(2)}%<br>`);
          });

          terminal.echo(statsMsg, 25, false, true);
        } else {
          terminal.echo(["❌ No stats available. Complete a test first."], 25, false, true);
        }
        break;
      case "welcome":
        terminal.echo(welcomeMsg, 25, false, true);
        break;
      case "start":
        if (!isTesting) {
          isTesting = true;
          testText = await getRandomWords();
          testStartTime = new Date().getTime();
          currentTypedText = "";
          liveStatsVisible = true;
          const startMsg = [
            `🚀 Starting the typing test...<br>`,
            `Word Count: <span id="term-cyan">${config.wordCount}</span> | Difficulty: <span id="term-cyan">${config.difficulty}</span><br>`,
            `Type the following text as fast as you can:<br>`,
            `<span id="test-text">${testText}</span><br>`,
            `Press Enter when you are done. Live stats will appear in the top-right corner.`,
          ];
          terminal.echo(startMsg, 25, false, true);
        } else {
          terminal.echo(
            ["✏️ Typing test already in progress."],
            25,
            false,
            true
          );
        }
        break;
      case "reset":
        isTesting = false;
        testText = "";
        currentTypedText = "";
        liveStatsVisible = false;
        const liveStatsElement = document.getElementById('live-stats');
        if (liveStatsElement) liveStatsElement.innerHTML = '';
        terminal.echo(resetMsg, 25, false, true);
        break;
      case "config": {
        if (commandParts.length === 1) {
          // Show current config
          const configMsg = [
            `⚙️  Current Configuration:<br>`,
            `Word Count: <span id="term-cyan">${config.wordCount}</span><br>`,
            `Difficulty: <span id="term-cyan">${config.difficulty}</span><br><br>`,
            `📝 Usage: config [option] [value]<br>`,
            `Examples:<br>`,
            `  config wordcount 25<br>`,
            `  config difficulty easy<br>`,
            `  config difficulty medium<br>`,
            `  config difficulty hard<br><br>`,
            `Available options: wordcount (10-100), difficulty (easy|medium|hard)`,
          ];
          terminal.echo(configMsg, 15, false, true);
        } else if (commandParts.length >= 3) {
          const option = commandParts[1].toLowerCase();
          const value = commandParts[2].toLowerCase();

          if (option === 'wordcount') {
            const count = parseInt(value);
            if (count >= 10 && count <= 100) {
              config.wordCount = count;
              terminal.echo([`✅ Word count set to ${count}`], 25, false, true);
            } else {
              terminal.echo([`❌ Word count must be between 10 and 100`], 25, false, true);
            }
          } else if (option === 'difficulty') {
            if (['easy', 'medium', 'hard'].includes(value)) {
              config.difficulty = value;
              terminal.echo([`✅ Difficulty set to ${value}`], 25, false, true);
            } else {
              terminal.echo([`❌ Difficulty must be easy, medium, or hard`], 25, false, true);
            }
          } else {
            terminal.echo([`❌ Unknown option: ${option}`], 25, false, true);
          }
        } else {
          terminal.echo([`❌ Invalid config command. Use 'config' to see usage.`], 25, false, true);
        }
        break;
      }
      case "clear":
        content.innerHTML = "";
        break;
      case "y":
        if (!isTesting) {
          ExecuteCommand("start");
        }
        break;
      case "n":
        terminal.echo(["👍 Test session ended."], 25, false, true);
        break;
      default:
        if (!isTesting) {
          terminal.echo([`❓ Unknown command: ${command}`], 25, false, true);
        }
        break;
    }
  }
}
