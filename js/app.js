const talkBtn = document.querySelector('#talk');
const content = document.querySelector('#content');
const languageSelect = document.querySelector('#language');
const voiceSelect = document.querySelector('#voice');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('.pitch-value');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('.rate-value');
const voiceTestBtn = document.querySelector('#voicetest');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;

var voices = [];

var commands = [
     'Danke mir geht es gut.',
     'Lass mich in Ruhe',
     'Heute geht es mir nicht so gut'
];

 // Setup voices
populateVoiceList();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoiceList;
}

// Setup languages
populateLanguageList();

function populateVoiceList() {
    voices = synth.getVoices();

    voices.forEach(voice => {
        let option = document.createElement('option');
        option.textContent = voice.name + ' (' + voice.lang + ')';

        if (voice.default) {
            option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
}

function populateLanguageList() {
    langs = ['de-DE', 'en-US', 'ja-JP'];

    langs.forEach(lang => {
        let option = document.createElement('option');
        option.textContent = lang;
        option.setAttribute('lang-bcp47', lang);
        languageSelect.appendChild(option);
    });
}

recognition.onstart = () => {
    console.log('voice is active, you can speak...');
};

recognition.onresult = (event) => {
    console.log(event)
    let transcript = event.results[0][0].transcript;
    content.textContent = transcript;

    speakOutLoud(processTranscript(transcript));
};

recognition.onspeechend = () => {
    recognition.stop();
};

recognition.onnomatch = () => {
    console.log('did not recognize anything!');
}

recognition.onerror = () => {
    console.log('something went wrong...');
}

// Start speaking
talkBtn.addEventListener('click', e => {
    let selectedLang = languageSelect.selectedOptions[0].getAttribute('lang-bcp47');
    console.log('lang=' + selectedLang);
    recognition.lang = selectedLang;
    recognition.start();
});

// Rate value change
rate.addEventListener('change', e => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener('change', e => (pitchValue.textContent = pitch.value));

voiceTestBtn.addEventListener('click', e => {
    const testTxt = 'Hallo! Das ist ein Stimmtest. Sie können die Stimmeinstellungen jederzeit ändern';
    speakOutLoud(testTxt);
});

function speakOutLoud(message) {
    let speech = new SpeechSynthesisUtterance();

    // Selected voice
    let selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
    voices.forEach(voice => {
        if (voice.name === selectedVoice)
            speech.voice = voice;
    });

    speech.text = message;
    speech.volume = 1;
    speech.rate = rate.value;
    speech.pitch = pitch.value;

    synth.speak(speech);
}

function processTranscript(message) {
    if (message.includes("wie geht's")) {
        return commands[Math.floor(Math.random() * commands.length)];
    }

    return "Ich hab keine Ahnung was du gesagt hast!";
}