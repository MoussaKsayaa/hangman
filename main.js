// keyboard section
// QWERTYUIOPASDFGHJKLZXCVBNM
let keysList = Array.from("QWERTYUIOPASDFGHJKLZXCVBNM");
let keyboard = document.querySelector(".keyboard");
for (let k of keysList) {
  let key = document.createElement("div");
  key.className = `key ${k}`;
  key.innerText = k;
  keyboard.appendChild(key);
}

// fetch data
let LS = window.localStorage;
let categoriesJson = new XMLHttpRequest();
categoriesJson.open("GET", "./categorys.json");
categoriesJson.send();
categoriesJson.onload = function () {
  if (this.readyState === 4 && this.status === 200) {
    // parse the data and set the default local storage value
    let categories = JSON.parse(this.responseText);
    if (LS.length > 0) {
      for (let i = 0; i < LS.length; i++) {
        LS.key(i).includes("category") ? "" : LS.setItem("category", `Animals`);
      }
    } else {
      LS.setItem("category", `Animals`);
    }
    let selectSound = new Audio("./music/select-sound-121244.mp3");
    selectSound.volume = 0.4;
    let myAudio = new Audio("./music/Sneaky-Snitch(chosic.com).mp3");
    let keyword = document.querySelector(".keyword .keys");
    let category = categories[LS.getItem("category")];
    let categoryLetters = [];
    let categoryWord = '';
    let uniqueWords = [];
    let keyboardKey = document.querySelectorAll(".keyboard .key");
    let hang = 10;
    let score = 0;
    let myTimer;
    let scoreElement = document.querySelector('.content .score');
    scoreElement.innerText = `${score} / 10`;
    let categoryName = document.querySelector(".category-name"); // span element
    let categoryElement = document.querySelector(".category"); // category element
    categoryName.innerText = LS.getItem("category");
    let menu = document.createElement("ul"); // creae menu element
    menu.className = "menu";
    // loop on the categories and put the items as options inside the menu
    for (let i = 0; i < Object.keys(categories).length; i++) {
      let item = document.createElement("li");
      item.className = `item ${Object.keys(categories)[i]}`;
      item.innerText = Object.keys(categories)[i];
      menu.appendChild(item);
    }
    let startGame = document.createElement('div');
    startGame.className = 'startGame';
    let startGameH = document.createElement('h1');
    startGameH.innerText = "Hangman Game";
    startGame.appendChild(startGameH);
    let startGameSpan =  document.createElement('span');
    startGameSpan.className = "select";
    startGameSpan.innerText = "Select Category:";
    startGame.appendChild(startGameSpan);
    let startMenu = document.createElement('div');
    startMenu.className = "start-menu"
    startGame.appendChild(startMenu);
    let overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);
    for (let i = 0; i < Object.keys(categories).length; i++) {
      let startCat = document.createElement('div');
      startCat.className = "start-Cat"
      let imgCon = document.createElement('div');
      imgCon.className = "image";
      let itemImg = document.createElement('img');
      itemImg.src = `./images/${Object.keys(categories)[i].toLowerCase()}.webp`;
      itemImg.alt = '';
      imgCon.appendChild(itemImg);
      startCat.appendChild(imgCon);
      let item = document.createElement("h2");
      item.className = `item`;
      item.innerText = Object.keys(categories)[i];
      startCat.appendChild(item);
      startMenu.appendChild(startCat);
      startGame.appendChild(startMenu);
      document.body.style.position = "relative";
      overlay.className = "overlay-start";
      startCat.onclick = () => {
        selectSound.play();
        LS.setItem("category", item.textContent);
        categoryName.innerText = LS.getItem("category");
        [categoryLetters, categoryWord] = updateKey();
        startGame.style.opacity = "0";
        setTimeout(() => {
          startGame.remove();
        }, 300);
        overlay.style.transition = '0.3s';
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
        }, 300);
        myAudio.play();
      }
    }
    document.body.appendChild(startGame);
    // create and remove the menu element when click on category element
    categoryElement.onclick = () => {
      selectSound.volume = 0.4;
      selectSound.play();
      if (categoryElement.lastChild === menu) {
        menu.style.animationDuration = "0.2s";
        menu.style.animationTimingFunction = "ease";
        menu.style.animationFillMode = "forwards";
        menu.style.animationName = "menu-out";
        setTimeout(() => {menu.remove()}, 200);
      } else {
        menu.style.animationDuration = "0.3s";
        menu.style.animationTimingFunction = "ease";
        menu.style.animationFillMode = "forwards";
        menu.style.animationName = "menu-entry";
        setTimeout(() => {
          categoryElement.appendChild(menu)
          // set the category when clicking on the item
          let items = document.querySelectorAll(".item");
          items.forEach((item) => {
            item.onclick = () => {
              selectSound.play();
              if (item.textContent !== LS.getItem("category")) {
                LS.setItem("category", item.textContent);
                categoryName.innerText = LS.getItem("category");
                categoryLetters = updateKey();
              }
            };
          });
        }, 100);
      }
    };
    myAudio.loop = true;
    let audio = document.querySelector('.content .audio');
    audio.onclick = () => {
      selectSound.play();
      if (audio.classList.contains("fa-pause")) {
        audio.classList.remove('fa-pause');
        audio.classList.add('fa-play');
        myAudio.pause();
      } else {
        audio.classList.remove('fa-play');
        audio.classList.add('fa-pause');
        myAudio.play();
      }
    }

    function repeatePrevent() {
      let random = Math.round(Math.random() * (category.length - 1));
      if (uniqueWords.length === category.length) {
        uniqueWords = [];
      }
      if (uniqueWords.includes(random)) {
        repeatePrevent();
      } else {
        uniqueWords.push(random);
        categoryWord = category[random].toUpperCase();
      }
      return categoryWord;
    }
    function timer() {
      let minElement = document.querySelector(".content .timer .min");
      let secElement = document.querySelector(".content .timer .sec");
      let sec = 0;
      minElement.innerHTML = '00';
      secElement.innerHTML = '00';
      myTimer = setInterval(() => {
        secElement.innerHTML = sec < 10 ? `0${sec}` : sec;
        sec++;
        if (sec > 60) {
          sec = 0;
          secElement.innerHTML = sec < 10 ? `0${sec}` : sec;
          min++;
          minElement.innerHTML = min < 10 ? `0${min}` : min;
          sec++;
        }
      }, 1000);
      return myTimer;
    }
    // update keyword function
    function updateKey() {
      if (myTimer > 0) {
        clearInterval(myTimer);
      }
      myTimer = timer();
      removeKey();
      disabledRemover();
      let base = document.querySelector(".draw .base");
      base.children.length > 0
      ? base.firstElementChild.remove()
      : "";
      hang = 10;
      category = categories[LS.getItem("category")];
      categoryLetters = [];
      // choose different word every time
      categoryWord = repeatePrevent();
      categoryLetters = Array.from(categoryWord);
      for (letter in categoryLetters) {
        let key = document.createElement("div");
        key.className = "key";
        keyword.appendChild(key);
      }
      return ([categoryLetters, categoryWord]);
    }
    // keyword remover function
    function removeKey() {
      while (keyword.children.length > 0) {
        keyword.children[keyword.children.length - 1].remove();
      }
    }
    // disabled remover function
    function disabledRemover() {
      keyboardKey.forEach((key) =>
      key.hasAttribute("disabled")
        ? key.removeAttribute("disabled")
        : ""
    );
    }
    // [categoryLetters, categoryWord] = updateKey();
    // keyboard keys action
    keyboardKey.forEach((key) => {
      key.onclick = () => {
        if (
          categoryLetters.includes(key.textContent) &&
          hang > 0 &&
          categoryLetters.join("").trim().length > 0 &&
          !key.hasAttribute("disabled")
        ) {
          let clickSound = new Audio("./music/click.mp3");
          clickSound.play();
          for (letter in categoryLetters) {
            if (key.textContent === categoryLetters[letter]) {
              let lettersList = categoryLetters;
              keyword.children[letter].innerText = key.textContent;
              lettersList[letter] = "";
              lettersList = lettersList.join("").split("");
              if (lettersList.length === 0) {
                let reportGameSound = new Audio("./music/correct.mp3");
                setTimeout(() => {reportGameSound.play()} , 500);
                let reportGame = document.createElement("div");
                reportGame.className = "report-game";
                let reportGameH = document.createElement("div");
                reportGameH.className = "report-heading";
                reportGameH.innerText = "Correct👏";
                let reportGameBtn = document.createElement("button");
                reportGameBtn.className = "report-btn";
                reportGameBtn.type = "button";
                reportGameBtn.innerText = "Next ➡";

                if (score < 10) {
                  score++;
                  scoreElement.innerText = `${score} / 10`;
                }
                if (score === 10){
                  reportGameH.innerText = "Congrats🎉";
                  reportGameBtn.innerText = "New Game";
                }
                let reportGameScore = document.createElement('span');
                reportGameScore.className = 'report-game-score';
                reportGameScore.innerText = `${score} / 10`;
                reportGame.appendChild(reportGameH);
                reportGame.appendChild(reportGameScore);
                reportGame.appendChild(reportGameBtn);
                document.body.appendChild(reportGame);
                let overlay = document.createElement("div");
                overlay.className = "overlay";
                document.body.appendChild(overlay);
                let base = document.querySelector(".base");
                reportGameBtn.onclick = () => {
                  selectSound.play();
                  if (reportGameBtn.innerText === "New Game") {
                    score = 0;
                    scoreElement.innerText = `${score} / 10`;
                  }
                  [categoryLetters, categoryWord] = updateKey();
                  disabledRemover();
                  hang = 10;
                  base.children.length > 0
                    ? base.firstElementChild.remove()
                    : "";
                  overlay.remove();
                  reportGame.remove();
                };
              }
            }
          }
          // disable the key after click
          key.setAttribute("disabled", "true");
        } else if (
          !categoryLetters.includes(key.textContent) &&
          hang > 0 &&
          categoryLetters.join("").trim().length > 0 &&
          !key.hasAttribute("disabled")
        ) {
          let wrongClickSound = new Audio("./music/wrong-click.mp3");
          wrongClickSound.play();
          hang--;
          let base = document.querySelector(".base");
          let stendy = document.createElement("div");
          stendy.className = "stendy";
          let stendx = document.createElement("div");
          stendx.className = "stendx";
          let stendyLast = document.createElement("div");
          stendyLast.className = "stendy-last";
          let rope = document.createElement("div");
          rope.className = "rope";
          let man = document.createElement("div");
          man.className = "man";
          let head = document.createElement("div");
          head.className = "head";
          let mouth = document.createElement("div");
          mouth.className = "mouth";
          mouth.innerText = ")";
          let body = document.createElement("div");
          body.className = "body";
          let hands = document.createElement("div");
          hands.className = "hands";
          let handLeft = document.createElement("div");
          handLeft.className = "left";
          let handRight = document.createElement("div");
          handRight.className = "right";
          let legs = document.createElement("div");
          legs.className = "legs";
          let legLeft = document.createElement("div");
          legLeft.className = "left";
          let legRight = document.createElement("div");
          legRight.className = "right";
          switch (hang) {
            case 9:
              base.appendChild(stendy);
              break;
            case 8:
              document.querySelector(".stendy").appendChild(stendx);
              break;
            case 7:
              document.querySelector(".stendx").appendChild(stendyLast);
              break;
            case 6:
              document.querySelector(".stendy-last").appendChild(rope);
              break;
            case 5:
              document.querySelector(".rope").appendChild(man);
              document.querySelector(".man").appendChild(head);
              document.querySelector(".head").appendChild(mouth);
              break;
            case 4:
              document.querySelector(".head").appendChild(body);
              break;
            case 3:
              document.querySelector(".body").appendChild(hands);
              document.querySelector(".hands").appendChild(handLeft);
              break;
            case 2:
              document.querySelector(".hands").appendChild(handRight);
              break;
            case 1:
              document.querySelector(".body").appendChild(legs);
              document.querySelector(".legs").appendChild(legLeft);
              break;
            case 0:
              document.querySelector(".legs").appendChild(legRight);
          }
          if (hang === 0) {
            let gameOverSound = new Audio("./music/game-over.wav");
            setTimeout(() => {gameOverSound.play()}, 500);
            let reportGame = document.createElement("div");
            reportGame.className = "report-game";
            let reportGameH = document.createElement("div");
            reportGameH.className = "report-heading";
            reportGameH.innerText = "Game Over";
            reportGame.appendChild(reportGameH);
            let resultWord = document.createElement('span');
            resultWord.className = "result-word";
            resultWord.innerText = `The Word is: `;
            let resultWordSpan = document.createElement("span");
            resultWordSpan.innerText = categoryWord;
            resultWord.appendChild(resultWordSpan);
            reportGame.appendChild(resultWord);
            let reportGameBtn = document.createElement("button");
            reportGameBtn.className = "report-btn";
            reportGameBtn.type = "button";
            reportGameBtn.innerText = "New Game";
            reportGame.appendChild(reportGameBtn);
            document.body.appendChild(reportGame);
            let overlay = document.createElement("div");
            overlay.className = "overlay";
            document.body.appendChild(overlay);
            reportGameBtn.onclick = () => {
              selectSound.play();

              [categoryLetters, categoryWord] = updateKey();
              disabledRemover();
              score = 0;
              scoreElement.innerText = `${score} / 10`;
              hang = 10;
              base.children.length > 0
              ? base.firstElementChild.remove()
              : "";
              overlay.remove();
              reportGame.remove();
            };
          }
          // disable the key after click
          key.setAttribute("disabled", "false");
        }
      };
    });
  }
};
