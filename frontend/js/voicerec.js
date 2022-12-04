const texts = document.querySelector('.speech-section');

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new window.SpeechRecognition();

var phrase;


function handleSubmit(){

    phrase = document.getElementById('safety-phrase').value;

    console.log(phrase);

}




//gives us instant results after we are done talking

recognition.interimResults = true;



recognition.addEventListener('result', (e)=> {

    const text = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');
    

    if (e.results[0].isFinal){
        if(text.includes(phrase)){
            alert('Text sent!')
        }
    }

    console.log(text);
})

recognition.addEventListener('end', ()=> {
    recognition.start();
})

recognition.start();

console.log(phrase);