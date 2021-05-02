// script.js
const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
var button = document.getElementsByTagName('button');
var speechSynthesis = window.speechSynthesis;

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
  
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  const dimen = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, dimen.startX, dimen.startY, dimen.width, dimen.height);
});


//on change
const File = document.getElementById('image-input');
File.addEventListener('change', () =>{
  let file = File.files[0];
  img.src = URL.createObjectURL(file);
  img.alt = file.name; 
});

function Voices()
{
  var voices = [];
  voices = speechSynthesis.getVoices();
  for (var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSel.add(option);

  }
};

const texts = document.getElementById('generate-meme');
texts.addEventListener('submit', (event)=> {
  var topText = document.getElementById('text-top').value;
  var botText = document.getElementById('text-bottom').value;
  ctx.font = 'bold 35px Comic Sans';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.fillText(topText,canvas.width / 2,canvas.height * 1/10);
  ctx.fillText(botText,canvas.width / 2,canvas.height * 95/100);

  button[0].disabled = true; //submit
  button[1].disabled = false; //clear
  button[2].disabled = false; //read text
  voiceSel.disabled = false;
  Voices();
  event.preventDefault();

});

const clear = document.getElementById('button-group').querySelectorAll('button')[0];
clear.addEventListener('click', () => {
  img.src = "";
  img.alt = "";
  texts.reset();
  ctx.clearRect(0,0, canvas.width, canvas.height);
  button[0].disabled = false; //submit
  button[1].disabled = true; //clear
  button[2].disabled = true; //read text
});


const readText = document.getElementById('button-group').querySelectorAll('button')[1];
readText.addEventListener('click', () => {
  // Mozzila
  var voice1 = new SpeechSynthesisUtterance(document.getElementById('text-top').value);
  var voice2 = new SpeechSynthesisUtterance(document.getElementById('text-bottom').value);
  var selectedOption = voiceSel.selectedOption[0].getAttribute('data0name');
  for(var i = 0; i < voices; i++)
  {
    voice1.voice = voices[i];
    voice2.voice = voices[i];
  }

  voice1.volume = volumeValue/100;
  voice2.volume = volumeValue/100;
  speechSynthesis.speak(voice1);
  speechSynthesis.speak(voice2);  

});



var voiceSel = document.getElementById('voice-selection');
const volumeGroup = document.getElementById('volume-group');

volumeGroup.addEventListener('input', () =>{
  var volumeValue = volumeGroup.querySelectorAll('input')[0];
  const volume = document.getElementsByTagName('img')[0];

  if(volumeValue.value <= 100 && volumeValue.value >=67)  // 67 - 100
  {
    volume.src = "icons/volume-level-3.svg";
    volume.alt = 'Volume Level 3';
  }

  else if(volumeValue.value <= 66 && volumeValue.value >=34) // 34 - 66
  {
    volume.src = "icons/volume-level-2.svg";
    volume.alt = 'Volume Level 2';
  }

  else if(volumeValue.value <= 33 && volumeValue.value >=1) // 1 - 33
  {
    volume.src = "icons/volume-level-1.svg";
    volume.alt = 'Volume Level 1';
  }

  else
  {
    volume.src = "icons/volume-level-0.svg";
    volume.alt = 'Volume Level 0';
  }

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
