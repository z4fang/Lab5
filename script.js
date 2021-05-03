// script.js
const img = new Image(); // used to load image from <input> and draw to canvas
const ffile = document.getElementById('image-input');
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
const texts = document.getElementById('generate-meme');
const button = document.getElementsByTagName('button');

const readText = button[2];
const volumeGroup = document.getElementById('volume-group');
const volumeSlider = volumeGroup.querySelectorAll('input')[0];
const volume = volumeGroup.querySelectorAll('img')[0];
var synth = window.speechSynthesis;
var voiceSelect = document.getElementById('voice-selection');



texts.addEventListener('submit', (event)=> {
  var topText = document.getElementById('text-top').value;
  var botText = document.getElementById('text-bottom').value;
  //topSpeak = document.getElementById('text-top').value;

  ctx.font = 'bold 35px Comic Sans';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.fillText(topText,canvas.width / 2,canvas.height * 1/10);
  ctx.fillText(botText,canvas.width / 2,canvas.height * 95/100);

  button[0].disabled = true; //submit
  button[1].disabled = false; //clear
  button[2].disabled = false; //read text
  voiceSelect.disabled = false;
  populateVoiceList();
  event.preventDefault();
});


const clear = document.getElementById('button-group').querySelectorAll('button')[0];
clear.addEventListener('click', () => {
  img.src = "";
  img.alt = "";
  //texts.reset();
  ctx.clearRect(0,0, canvas.width, canvas.height);
  button[0].disabled = false; //submit
  button[1].disabled = true; //clear
  button[2].disabled = true; //read text
});


ffile.addEventListener('change', () =>{
  let file = ffile.files[0];
  img.src = URL.createObjectURL(file);
  img.alt = file.name; 
});


// Fires whenever the img object loads a new image (such as with img.src =)
// on Load
img.addEventListener('load', () => {
  // TODO

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  button[0].disabled = false;   // enable generate
  button[1].disabled = true;    // disable clear
  button[2].disabled = true;    // disable read text
  //voiceSelect.disabled = false;
  
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  const dimen = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, dimen.startX, dimen.startY, dimen.width, dimen.height);
});

volumeGroup.addEventListener('input', () => {
  if (volumeSlider.value >= 67) {
    volume.src = 'icons/volume-level-3.svg';
  }
  else if (volumeSlider.value >= 34) {
    volume.src = 'icons/volume-level-2.svg';
  }
  else if (volumeSlider.value >= 1) {
    volume.src = 'icons/volume-level-1.svg';
  }
  else {
    volume.src = 'icons/volume-level-0.svg';
  }
});

var voices = [];
function populateVoiceList() {
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);

  }

  voiceSelect.disabled = false;
  voiceSelect.remove(0);
}

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

readText.addEventListener('click', () => {
  // Mozzila
  var topText = document.getElementById('text-top');
  var bottomText = document.getElementById('text-bottom');
  var voice1 = new SpeechSynthesisUtterance(topText.value);
  var voice2 = new SpeechSynthesisUtterance(bottomText.value);

  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');

  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      voice1.voice = voices[i];
      voice2.voice = voices[i];
    }
  }

  voice1.volume = volumeSlider.value/100;
  voice2.volume = volumeSlider.value/100;

  synth.speak(voice1); 
  synth.speak(voice2);

});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
