import { getRandomInt, getRandomFloat } from "./random.js";

document.addEventListener("DOMContentLoaded", function () {
  const answerZone = document.getElementById("answer-zone");
  const resetBtn = document.getElementById("reset-btn");
  const resultDiv = document.getElementById("result");
  const modeSelect = document.getElementById("mode-select");
  const totalQuestionsEl = document.getElementById("total-questions");
  const correctAnswersEl = document.getElementById("correct-answers");
  const incorrectAnswersEl = document.getElementById("incorrect-answers");
  const skipAnswersEl = document.getElementById("skip-answers");

  // เมื่อหน้าเว็บโหลดขึ้นมา ให้ปุ่ม Reset มีชื่อว่า "Start"
  resetBtn.innerHTML = '<i class="fas fa-random"></i> Start';

  let totalQuestions = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let skipAnswers = 0;

  // จำนวนปุ่มทั้งหมดในเว็บ
  let buttonCount = 0;

  generateButtons();

  resetBtn.addEventListener("click", () => {
    // reset คะแนนกลับเป็นค่าเริ่มต้น
    resetGame();
    // สุ่มคำถามขึ้นมา
    generateQuestion();
  });

  function resetGame() {
    totalQuestions = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    skipAnswers = 0;
    updateScore();
  }

  function checkAnswer(name) {
    console.log(name);
  }

  function generateButtons() {
    const mode = modeSelect.value;
    answerZone.innerHTML = ""; // ล้างปุ่มเก่า

    // reset ค่าปุ่มเดิม
    buttonCount = 0;
    if (mode === "basic") {
      buttonCount = 2;
    } else if (mode === "intermediate") {
      buttonCount = 3;
    } else if (mode === "advanced") {
      buttonCount = getRandomInt(3, 5);
    }

    for (let i = 1; i <= buttonCount; i++) {
      // สร้าง div .col
      const colDiv = document.createElement("div");
      colDiv.className = "col";

      // สร้างปุ่ม
      const button = document.createElement("button");
      button.id = `box-${i}`;
      button.className = "container-fluid btn btn-warning btn-lg";
      button.textContent = `box ${i}`;

      // เพิ่มปุ่มเข้าไปใน div .col
      colDiv.appendChild(button);

      // เพิ่ม div .col เข้าไปใน answerZone
      answerZone.appendChild(colDiv);

      // ผูก Event Listener กับปุ่มหลังจากที่ปุ่มถูกสร้างแล้ว
      button.addEventListener("click", () => {
        if (totalQuestions > 0) {
          checkAnswer(`btn${i}`);
          // สุ่มคำถามขึ้นมา
          generateQuestion();
        }
      });
    }
  }

  function generateQuestion() {
    // เปลี่ยนชื่อปุ่มคืนเป็น Reset
    resetBtn.innerHTML = '<i class="fas fa-random"></i> Reset';

    generateButtons();
    const mode = modeSelect.value;
    let question;

    if (mode === "basic") {
      question = `if (???) {\n    // box 1\n}\nelse {\n    // box 2\n}`;
    } else if (mode === "intermediate") {
      question = `if (???) {\n    // box 1\n}\nelse if (???) {\n    // box 2\n}\nelse {\n    // box 3\n}`;
    } else if (mode === "advanced") {
      let i = 0;
      if (getRandomFloat(0, 1, 2) >= 0.7) {
        question = `if (???) {\n    // box 1\n}`;
        for (i = 2; i < buttonCount; i++) {
          question += `\nelse if (???) {\n    // box ${i}\n}`;
        }
        question += `\nelse {\n    // box ${buttonCount}\n}`;
      } else {
        if (getRandomFloat(0, 1, 2) >= 0.7 || buttonCount < 4) {
          question = `if (???) {\n    // box 1`;
          question += `\n    if (???) {\n        // box ${2}\n    }`;
          for (i = 3; i < buttonCount; i++) {
            question += `\n    else if (???) {\n        // box ${i}\n    }`;
          }
          question += `\n}`;
          question += `\nelse {\n    // box ${buttonCount}\n}`;
        }
        else {
          question = `if (???) {\n    // box 1`;
          question += `\n    if (???) {\n        // box 2\n    }`;
          for (i = 3; i < buttonCount-1; i++) {
            question += `\n    else if (???) {\n        // box ${i}\n    }`;
          }
          question += `\n}`;
          question += `\nelse {\n    // box ${buttonCount-1}`
          question += `\n    if (???) {\n        // box ${buttonCount}\n    }`;
          question += `\n}`;
        }
      }
    }

    resultDiv.innerHTML = `<pre><code>${colorizeBrackets(question, false)}</code></pre>`;
    totalQuestions++;
    updateScore();
  }

  // ฟังก์ชันใส่สีให้กับวงเล็บและปีกกา
  function colorizeBrackets(expression, setDefault=true) {
    let colors;
    if (setDefault){
      colors = ["red", "blue", "green", "orange"];
    }
    else {
      colors = ["orange", "green", "red", "blue"];
    }
    let colorIndex = 0;
    let depth = 0;
  
    return expression.replace(/[(){}]/g, (bracket) => {
      if (bracket === "(" || bracket === "{") {
        depth++;
        colorIndex = (depth - 1) % colors.length;
        return `<span style="color: ${colors[colorIndex]}">${bracket}</span>`;
      } else if (bracket === ")" || bracket === "}") {
        const coloredBracket = `<span style="color: ${colors[(depth - 1) % colors.length]}">${bracket}</span>`;
        depth--;
        return coloredBracket;
      }
    });
  }  

  function updateScore() {
    totalQuestionsEl.textContent = `Total: ${totalQuestions}`;
    correctAnswersEl.textContent = `Correct: ${correctAnswers}`;
    incorrectAnswersEl.textContent = `Incorrect: ${incorrectAnswers}`;
    skipAnswersEl.textContent = `Skip: ${skipAnswers}`;
    updateProgressBar();
  }

  function updateProgressBar() {
    skipAnswers = totalQuestions - (correctAnswers+incorrectAnswers)
    const correctPercentage =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const incorrectPercentage =
      totalQuestions > 0 ? (incorrectAnswers / totalQuestions) * 100 : 0;
    const withoutPercentage =
        totalQuestions > 0 ? (skipAnswers / totalQuestions) * 100 : 0;

    const correctProgressBar = document.getElementById("correct-progress-bar");
    const incorrectProgressBar = document.getElementById(
      "incorrect-progress-bar"
    );
    const withoutProgressBar = document.getElementById("without-progress-bar");

    correctProgressBar.style.width = correctPercentage + "%";
    correctProgressBar.setAttribute("aria-valuenow", correctPercentage);
    correctProgressBar.textContent = Math.round(correctPercentage) + "%";

    incorrectProgressBar.style.width = incorrectPercentage + "%";
    incorrectProgressBar.setAttribute("aria-valuenow", incorrectPercentage);
    incorrectProgressBar.textContent = Math.round(incorrectPercentage) + "%";

    withoutProgressBar.style.width = withoutPercentage + "%";
    withoutProgressBar.setAttribute("aria-valuenow", withoutPercentage);
    withoutProgressBar.textContent = Math.round(withoutPercentage) + "%";
  }

  modeSelect.addEventListener("change", generateQuestion);
});
