document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".audio-button");
  let currentAudio = null;
  let currentButton = null;
  const body = document.body;
  const resetButton = document.querySelector(".reset");
  const characters = document.querySelectorAll(".h-char");
  let clickedButtons = new Set();

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      handleAudioButtonClick(button);
    });
  });

  function handleAudioButtonClick(button) {
    // Falls der Button bereits spielt, stoppe das Audio
    if (button.classList.contains("play")) {
      button.classList.remove("play");
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      currentAudio = null;
      currentButton = null;
      return;
    }

    // Buchstabe wird eingeblendet
    showCharacter(button);

    // Falls ein anderes Audio spielt, stoppe es
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      if (currentButton) {
        currentButton.classList.remove("play");
      }
    }

    // Hol dir den Audio-Link aus dem data-Attribut
    const audioFile = button.getAttribute("data-audio-file");

    // Erstelle ein neues Audio-Objekt
    const audio = new Audio(audioFile);

    // Füge die Klasse .play hinzu, wenn das Audio abgespielt wird
    button.classList.add("play");

    // Spiele das Audio ab
    audio.play();

    // Entferne die Klasse .play, wenn das Audio zu Ende ist
    audio.addEventListener("ended", () => {
      button.classList.remove("play");
      currentAudio = null;
      currentButton = null;
    });

    // Setze das aktuelle Audio und den aktuellen Button
    currentAudio = audio;
    currentButton = button;

    // Verfolge die geklickten Buttons
    clickedButtons.add(button);
    if (clickedButtons.size === buttons.length) {
      body.classList.add("finish");
      releaseBalloon();
    }
  }

  function showCharacter(e) {
    const character = e.getAttribute("data-character");
    const characterElement = document.querySelector("#" + character);
    characterElement.classList.add("show");
  }

  function releaseBalloon() {
    for (let i = 0; i < 10; i++) {
      const balloonSVG = document.getElementById("balloon").cloneNode(true);
      balloonSVG.classList.remove("hidden");
      balloonSVG.classList.add("balloon");

      // Zufällige Größe basierend auf der Bildschirmgröße
      const size = Math.random() * (15 - 10) + 10; // Zufällige Größe zwischen 5vw und 10vw
      balloonSVG.style.width = `${size}vw`;
      balloonSVG.style.height = `auto`; // Behalte das Seitenverhältnis bei

      // Zufällige horizontale Position
      balloonSVG.style.left = Math.random() * 100 + "vw";

      // Zufällige Geschwindigkeit
      const duration = Math.random() * (7 - 3) + 3; // Zufällige Dauer zwischen 3s und 7s
      balloonSVG.style.animationDuration = `${duration}s`;

      // Animation hinzufügen
      balloonSVG.style.animationName = "flyUp";
      document.body.appendChild(balloonSVG);

      // Entferne das Ballon-Element nach der Animation
      balloonSVG.addEventListener("animationend", () => {
        balloonSVG.remove();
      });
    }
  }

  //* Speechbubble

  // Initiale Klassenzuweisung beim Laden der Seite
  updatePosButtonAllClass();

  // Aktualisierung der Klassen bei Änderung der Fenstergröße oder beim Scrollen
  window.addEventListener("resize", updatePosButtonAllClass);
  window.addEventListener("scroll", updatePosButtonAllClass);

  function updatePosButtonClass(e) {
    const rect = e.getBoundingClientRect();
    const windowWidth = window.innerWidth;

    // Berechne die Abstände zu den Rändern
    const distanceToLeft = rect.left;
    const distanceToRight = windowWidth - rect.right;

    // Setze die entsprechenden Klassen
    if (distanceToLeft < distanceToRight) {
      e.classList.add("open-right");
      e.classList.remove("open-left");
    } else {
      e.classList.add("open-left");
      e.classList.remove("open-right");
    }
  }

  function updatePosButtonAllClass() {
    buttons.forEach(updatePosButtonClass);
  }

  //* Reset Button
  resetButton.addEventListener("click", () => {
    characters.forEach((character) => {
      character.classList.remove("show");
    });
    // Stoppe das Audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
      if (currentButton) {
        currentButton.classList.remove("play");
        currentButton = null;
      }
    }
    // Entferne die finish-Klasse und setze die geklickten Buttons zurück
    body.classList.remove("finish");
    clickedButtons.clear();

    // Entferne eventuell vorhandene Ballons
    const balloons = document.querySelectorAll(".balloon");
    balloons.forEach((balloon) => {
      balloon.remove();
    });

    resetButton.classList.add("active");
    setTimeout(function () {
      resetButton.classList.remove("active");
    }, 1000);
  });

  //* Intro Animation
  // Eventlistener slide-out Animation
  const slideOutSound = new Audio("../assets/sounds/intro.mp3");

  setTimeout(function () {
    slideOutSound.play();
  }, 1800);
  
});
