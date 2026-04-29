const startbtn = document.getElementById('start-btn');
const quizStart = document.getElementById('quiz-start');
const quizContainer = document.getElementById('quiz-container');


const scener = [
    {
        scene: "email",
        fra: "it-support@iba-secure.net",
        emne: "Vigtigt: Sikkerhedsbrud på din studiekonto",
        besked: "Kære studerende, vi har oppdaget et sikkerhedsbrud i vores systemer. Alle studerende bedes ændre deres adgangskode hurtigst mulligt for at beskytte deres konto. Klik her for at opdatere: iba-login-secure.dk/opdater-kode",
        valg: ["Klik på linket og skift kode med det samme", "Tjek afsenderen og kontakt IT-support direkte"],
        udfald: ["dårlig", "god"]
    },
    {
        scene: "sms",
        fra: "IBA IT-support",
        besked: "Hej! Vi kan se du forsøgte at logge ind. Send os din nuværende kode så vi kan hjælpe dig videre.",
        valg: ["Send dem min kode", "Afvis. IT-support beder aldrig om din Kode."],
        udfald: ["dårlig", "god"]
    },

    {
        scene: "email",
        fra: "it@iba.dk",
        emne: "Nyt sikker login-system",
        besked: "Kære studerende, vi har opdateret vores loginsystem. Brug QR-koden nedenfor for at bekræfte din konto.",
        valg: ["Scan QR-koden og log ind", "Scan QR-koden men tjek URL'en først", "Gå direkte ind på iba.dk og log ind derfra" ],
        udfald: ["dårlig", "dårlig", "god" ]
    }
];

function visScene(index){
    const scene = scener[index];
    let html = '';

    if (scene.scene === "email"){
        html = `
        <div class="email-mock">
        <div class="email-header">
        <p><span>Fra:</span> ${scene.fra}</p>
        <p><span>Emne:</span> ${scene.emne}</p>
        </div>

        <div class="email-body">
        <p>${scene.besked}</p>
     </div>
    </div>
      `;
    }
}
]


startbtn.addEventListener('click', function() {
    quizStart.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    visScene(0);
});

