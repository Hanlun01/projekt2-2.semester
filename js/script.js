
const startBtn = document.getElementById('start-btn');
const quizStart = document.getElementById('quiz-start');
const quizContainer = document.getElementById('quiz-container');


const scener = [
    {
        scene: "email",
        fra: "it-support@iba-secure.net",
        emne: "Vigtigt: Sikkerhedsbrud på din studiekonto",
        besked: "Kære studerende, vi har oppdaget et sikkerhedsbrud i vores systemer. Alle studerende bedes ændre deres adgangskode hurtigst mulligt for at beskytte deres konto. Klik her for at opdatere: iba-login-secure.dk/opdater-kode",
        valg: ["Klik på linket og skift kode med det samme", "Tjek afsenderen og kontakt IT-support direkte"],
        udfald: ["dårlig", "god"],
        dårligMellemstep: "Du klikker på linket og lander på en side der ligner IBA's loginside. Du indtaster dit brugernavn og adgangskode...",
        godMellemstep: "Du kigger nærmere på afsenderen og ser at adressen er 'it-support@iba-secure.net' og ikke '@iba.dk'",
        godForklaring: "Godt valg! Du opdagede at afsenderens mail ikke er officiel. Svindlere prøver ofte at snyde ved at bruge adresser der ligner rigtige virksomheder. Ved at stoppe op og tjekke afsenderen undgår du at blive narret. En god vane er altid at verificere beskeder ved selv at finde afsenderens mail via deres officielle hjemmeside. På den måde kan du sikkert tjekke om det er den rigtige mail.",
        regel: "Find altid afsenderen online og bekræft email adressen",
    },
    {
        scene: "sms",
        fra: "IBA IT-support",
        besked: "Hej! Vi kan se du forsøgte at logge ind. Send os din nuværende kode så vi kan hjælpe dig videre.",
        valg: ["Send dem min kode", "Afvis. IT-support beder aldrig om din Kode."],
        udfald: ["dårlig", "god"],
        dårligMellemstep: "Du sender din kode til IT-support. Kort efter får du en besked: 'Tak, din kode er nu opdateret.' Det føles som om alt er i orden...",
        godMellemstep: "Du afviser beskeden og rapporterer den til din rigtige IT-afdeling. De bekræfter at det var et forsøg på phishing.",
        godForklaring: "Godt valg! Du vidste at IT-support aldrig beder om adgangskoder. Din adgangskode er altid privat og bør ikke deles med andre. Det er en af de vigtigste sikkerhedsregler. Ved at afvise og rapportere beskeden hjælper du både dig selv og andre med at undgå svindel.",
        regel: "Del aldrig din adgangskode med nogen. Heller ikke med IT-support",
    },

    {
        scene: "email",
        fra: "it@iba.dk",
        emne: "Nyt sikker login-system",
        besked: "Kære studerende, vi har opdateret vores loginsystem. Brug QR-koden nedenfor for at bekræfte din konto.",
        valg: ["Scan QR-koden og log ind", "Scan QR-koden men tjek URL'en først", "Gå direkte ind på iba.dk og log ind derfra" ],
        udfald: ["dårlig", "dårlig", "god" ],
        dårligMellemstep: "Du scanner QR-koden og lander på en side der ser helt legitim ud. Adressen ligner endda iba.dk.",
        godMellemstep: "Du ignorerer QR-koden og går direkte ind på iba.dk. Alt ser normalt ud og der er ingen besked om at du skal opdatere din kode.",
        godForklaring: "Godt valg! I stedet for at stole på QR-koden gik du direkte til den officielle hjemmeside. Det er en af de sikreste metoder. Når noget haster eller virker vigtigt, er det ekstra vigtigt at tage kontrollen selv og ikke følge links eller QR-koder blindt.",
        regel: "Gå altid direkte til den officielle hjemmeside i stedet for at bruge usikre links eller QR-koder.",
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
    } else if (scene.scene === "sms") {
        html = `
        <div class="sms-mock">
        <div class="sms-sender">${scene.fra}</div>
        <div class="sms-bubble">${scene.besked}</div>
    </div>
        `;
    }

    html += `<div class="valg-container">`;
    scene.valg.forEach(function(valg, i) {
        html += `<button class="valg-btn" onclick="handleValg(${index}, ${i})">${valg}</button>`;
    });
    html +=`</div>`; 
    quizContainer.innerHTML =html;
} 

function handleValg(sceneIndex, valgIndex) {
    const udfald = scener[sceneIndex].udfald[valgIndex];

    if (udfald === "dårlig") {
        visDårligMellemstep(sceneIndex);
    } else {
        visGodMellemstep(sceneIndex);
    }
}

function visDårligMellemstep(sceneIndex) {
    quizContainer.innerHTML = `
        <div class="slutning mellemstep">
            <p>${scener[sceneIndex].dårligMellemstep}</p>
            <button class="btn" onclick="visDårligSlutning(${sceneIndex})">Fortsæt</button>
        </div>
    `;
}

function visGodMellemstep(sceneIndex) {
    quizContainer.innerHTML = `
        <div class="slutning mellemstep">
            <p>${scener[sceneIndex].godMellemstep}</p>
            <button class="btn" onclick="visGodForklaring(${sceneIndex})">Fortsæt</button>
        </div>
    `;
}

function visGodForklaring(sceneIndex) {
    const næsteScene = sceneIndex + 1;

    quizContainer.innerHTML = `
        <div class="slutning god">
        <h2>Godt klaret! Du spottede phishing</h2>
            <p>${scener[sceneIndex].godForklaring}</p>
            <p class="regel"> Regel: ${scener[sceneIndex].regel}</p>

            ${næsteScene < scener.length 
                ? `<button class="btn" onclick="visScene(${næsteScene})">Næste scene</button>`
                : `<button class="btn" onclick="visGodSlutning()">Se dit resultat</button>`
            }
        </div>
    `;
}

function visDårligSlutning(sceneIndex) {
    const forklaringer = [
        "Afsenderen 'it-support@iba-secure.net' er ikke en officiel IBA-adresse. Læg mærke til '.net' i stedet for '.dk'. Der var også to tastefejl i mailen: 'oppdaget' og 'mulligt'.",
        "IT-support vil aldrig bede dig sende din adgangskode. Hverken via SMS, mail eller telefon.",
        "QR-koder er links i forklædning. Selvom mailen ser legitim ud, sender QR-koden dig til en falsk side."
    ];

    quizContainer.innerHTML = `
        <div class="slutning daarlig">
            <h2>Du er desværre faldet i fælden</h2>
            <p>${forklaringer[sceneIndex]}</p>
            <p class="regel"> Regel: ${scener[sceneIndex].regel}</p>
            <button class="btn" onclick="genstart()">Prøv igen</button>
        </div>
    `;
}

function visGodSlutning() {
    quizContainer.innerHTML = `
    <div class="slutning god">
            <h2>Godt klaret!</h2>
            <p>Du gennemskuede alle tre phishing-forsøg, også den svære med QR-koden. Du er godt rustet til at beskytte din konto.</p>
            <button class="btn" onclick="genstart()">Tag testen igen</button>
        </div>
    `;
}

function genstart(){
    quizContainer .classList.add('hidden');
    quizStart.classList.remove('hidden');
}

function visIntro() {
    quizContainer.innerHTML = `
        <div class="slutning mellemstep">
            <p>Du er studerende på IBA's erhvervsakademi og vil nu modtage en række beskeder, mails og SMS'er.</p>
            <p>Din opgave er at træffe de rigtige valg og undgå at falde i fælden.</p>
            <p>Mon du kan spotte phishing?</p>
            <button class="btn" onclick="visScene(0)">Start scenarie 1</button>
        </div>
    `;
}

startBtn.addEventListener('click', function() {
    quizStart.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    visIntro();
});

const burgerBtn = document.getElementById('burger-btn');
const navMenu = document.getElementById('nav-menu');

burgerBtn.addEventListener('click', function(){
    navMenu.classList.toggle('open');
});