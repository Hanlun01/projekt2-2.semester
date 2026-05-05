
const startBtn = document.getElementById('start-btn');
const quizStart = document.getElementById('quiz-start');
const quizContainer = document.getElementById('quiz-container');

let fejl=0;


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
        godForklaring: "Godt set! Det er phishing. Afsenderen bruger en mail, der ligner en officiel adresse, men domænet er forkert. Det er et af de mest almindelige tegn på svindel.",
        regel: "Tjek altid afsenderens domæne og se om det matcher den officielle hjemmeside.",
    },
    {
        scene: "sms",
        fra: "IBA IT-support",
        besked: "Hej! Vi kan se du forsøgte at logge ind. Er det dig?",
        valg: ["Ja, svar tilbage", "Ignorer beskeden"],
        udfald: ["step2", "god"],

        step2Besked: "Tak! Vi skal bruge din nuværende kode for at verificere din identitet.",
        step2Valg: ["Send dem min kode", "Afvis. IT-support beder aldrig om kode"],
        step2Udfald: ["dårlig", "god"],

        dårligMellemstep: "Du sender din kode til IT-support. Kort efter får du en besked: 'Tak, din kode er nu opdateret.' Det føles som om alt er i orden...",
        godMellemstep: "Du afviser beskeden og rapporterer den til din rigtige IT-afdeling. De bekræfter at det var et forsøg på phishing.",
        godForklaring: "Godt set! Svindlere udgiver sig ofte for at være IT-support for at få adgang til dine oplysninger. Det er phishing, og en legitim IT-afdeling vil aldrig bede om din adgangskode.",
        regel: "Del aldrig din adgangskode med nogen. Heller ikke med IT-support",
    },

    {
        scene: "email",
        fra: "it@iba.dk",
        emne: "Nyt sikker login-system",
        besked: "Kære studerende, din konto kræver bekræftelse. Scan QR-koden nedenfor for at undgå midlertidig lukning.",
        valg: ["Scan QR-koden og log ind", "Scan QR-koden men tjek URL'en først", "Gå direkte ind på iba.dk og log ind derfra" ],
        udfald: ["dårlig", "dårlig", "god" ],
        dårligMellemstep: "Du scanner QR-koden og lander på en side der ser helt legitim ud. Adressen ligner endda iba.dk.",
        godMellemstep: "Du ignorerer QR-koden og går direkte ind på iba.dk. Alt ser normalt ud og der er ingen besked om at du skal opdatere din kode.",
        godForklaring: "Godt valg! QR-koder kan skjule phishing links. Ved at gå direkte til den officielle hjemmeside undgår du at blive sendt til en falsk side. Når noget virker vigtigt eller haster, skal du altid tænke dig ekstra om.",
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

function visStep2(sceneIndex) {
    const scene = scener[sceneIndex];
    let html = `
    <div class="sms-mock">
    <div class="sms-sender">${scene.fra}</div>
    <div class="sms-bubble">${scene.step2Besked}</div>
    </div>
    <div class="valg-container">
    `;
    scene.step2Valg.forEach(function(valg, i) {
        html += `<button class="valg-btn" onclick="handleStep2(${sceneIndex}, ${i})">${valg}</button>`;
    });
    html += `</div>`;
    quizContainer.innerHTML = html;
}

function handleStep2(sceneIndex, valgIndex) {
    const udfald = scener[sceneIndex].step2Udfald[valgIndex];
    if (udfald === "dårlig") {
        fejl++;
        visDårligMellemstep(sceneIndex);
    } else {
        visGodMellemstep(sceneIndex);
    }
}

function handleValg(sceneIndex, valgIndex) {
    const udfald = scener[sceneIndex].udfald[valgIndex];
    if (udfald === "dårlig") {
        fejl++;
        visDårligMellemstep(sceneIndex);
    } else if (udfald === "step2") {
        visStep2(sceneIndex);
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
                : `<button class="btn" onclick="visSlutning()">Se dit resultat</button>`
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

    const næsteScene = sceneIndex + 1;

    quizContainer.innerHTML = `
        <div class="slutning daarlig">
            <h2>Du er desværre faldet i fælden</h2>
            <p>${forklaringer[sceneIndex]}</p>
            <p class="regel"> ${scener[sceneIndex].regel}</p>

            ${næsteScene < scener.length 
                ? `<button class="btn" onclick="visScene(${næsteScene})">Fortsæt</button>`
                : `<button class="btn" onclick="visSlutning()">Se dit resultat</button>`
            }
        </div>
    `;
}

function visGodSlutning() {
    quizContainer.innerHTML = `
    <div class="slutning god">
            <h2>Godt klaret!</h2>
            <p>Du gennemskuede alle tre phishing-forsøg, også den svære med QR-koden. Du er godt rustet til at beskytte din konto.</p>
            <button class="btn" onclick="genstart()">Prøv igen</button>
        </div>
    `;
}

function genstart(){
    fejl = 0;
    quizContainer .classList.add('hidden');
    quizStart.classList.remove('hidden');
}

function visIntro() {
    quizContainer.innerHTML = `
        <div class="slutning mellemstep">
            <p>Du er studerende på IBA's erhvervsakademi og vil nu modtage en række mails og SMS'er.</p>
            <p>Din opgave er at træffe de rigtige valg og undgå at falde i fælden.</p>
            <p>Mon du kan klare det?</p>
            <button class="btn" onclick="visScene(0)">Start scenarie 1</button>
        </div>
    `;
}

function visSlutning() {
    if (fejl===0) {
        quizContainer.innerHTML = `
        <div class="slutning god">
        <h2>Perfekt! Du gennemskuede alle tre phishing forsøg</h2>
        <p>Du har en stærk fornemmelse for hvad der er mistænkeligt og hvad der er legitimt. Du lader dig ikke manipulere til at handle hurtigt og det er præcis det der beskytter dig mod phishing.</p>
        <button class="btn" onclick="genstart()">Prøv igen</button>
        </div>
        `;
    } else if (fejl === 1) {
        quizContainer.innerHTML = `
        <div class="slutning daarlig">
        <h2>Næsten! Du faldt i fælden én enkelt gang</h2>
        <p>Phishing bliver mere og mere avanceret og svindlere laver beskeder der er svære at gennemskue. Husk altid at stoppe op og tjekke afsenderen inden du handler.</p>
        <button class="btn" onclick="genstart()">Prøv igen</button>
        </div>
        `;

    } else {
        quizContainer.innerHTML = `
        <div class="slutning daarlig">
        <h2>Du faldt i fælden ${fejl} gange</h2>
        <p>Phishing og quishing er svindelmetoder, hvor nogen udgiver sig for at være en, du stoler på. De bruger ofte hast, frygt eller vigtige beskeder for at få dig til at handle uden at tænke. Vær opmærksom på stavefejl, pres og mistænkelige links eller QR-koder. Prøv igen og se, om du kan spotte dem alle.</p>
        <p class="regel"> Regel: Stop altid op og tjek afsenderen.</p>
        <button class="btn" onclick="genstart()">Prøv igen</button>
        </div>
     `;

    }
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