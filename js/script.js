
const startBtn = document.getElementById('start-btn');
const quizStart = document.getElementById('quiz-start');
const quizContainer = document.getElementById('quiz-container');

let fejl=0;


const scener = [
    {
        scene: "email",
        fra: "it-support@iba-secure.net",
        emne: "Vigtigt: Sikkerhedsbrud på din studiekonto",
        besked: "Kære studerende, vi har oppdaget et sikkerhedsbrud i vores systemer. Alle studerende bedes ændre deres adgangskode hurtigst mulligt for at beskytte deres konto",
        harQR: false,
        harLink: true,
        link: "iba-login-secure.dk/opdater-kode",
        valg: ["Klik på linket og skift kode med det samme", "Tjek afsenderen og kontakt IT-support direkte"],
        udfald: ["dårlig", "god"],
        dårligMellemstep: "Du klikker på linket og lander på en side der ligner IBA's loginside. Du indtaster dit brugernavn og adgangskode...",
        godMellemstep: "Du kigger nærmere på afsenderen og ser at adressen er 'it-support@iba-secure.net' og ikke '@iba.dk'",
        godForklaring: "Afsenderen bruger 'it-support@iba-secure.net' i stedet for den rigtige '@iba.dk'. Dette er et klassisk eksempel på social engineering. Svindlere bruger tricks som disse til at få dig til at stole på dem. Ved at kopiere et kendt navn og kun ændre domænet håber de at du handler hurtigt uden at tænke dig om.",
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
        svar: ["Ja, det er mig", ""],
        step2Svar: ["Her er min kode 123...", "Jeg deler ikke min kode"],
        step2Udfald: ["dårlig", "god"],

        dårligMellemstep: "Du sender din kode til IT-support. Kort efter får du en besked: 'Tak, din kode er nu opdateret.' Det føles som om alt er i orden...",
        godMellemstep: "Du afviser beskeden og rapporterer den til din rigtige IT-afdeling. De bekræfter at det var et forsøg på phishing.",
        godForklaring: "Svindlere udgiver sig ofte for at være fra IT-support for at få adgang til dine oplysninger. De forsøger at skabe tillid ved først at spørge om det er dig, og derefter bede om din kode. En rigtig IT-afdeling vil aldrig bede om din adgangskode uanset situationen.",
        regel: "Del aldrig din adgangskode med nogen. Heller ikke med IT-support",
    },

    {
        scene: "email",
        fra: "it@iba.dk",
        emne: "Nyt sikker login-system",
        besked: "Kære studerende, din konto kræver bekræftelse. Scan QR-koden nedenfor for at undgå midlertidig lukning.",
        harQR: true,
        valg: ["Scan QR-koden og log ind", "Scan QR-koden men tjek URL'en først", "Gå direkte ind på iba.dk og log ind derfra" ],
        udfald: ["dårlig", "dårlig", "god" ],
        dårligMellemstep: "Du scanner QR-koden og lander på en side der ser helt legitim ud. Adressen ligner endda iba.dk.",
        godMellemstep: "Du ignorerer QR-koden og går direkte ind på iba.dk. Alt ser normalt ud og der er ingen besked om at du skal opdatere din kode.",
        godForklaring: "QR-koder er i virkeligheden bare links i forklædning og kan sende dig til en falsk side der ser helt legitim ud. Svindlere prøver at skabe et kunstigt tidspres for at få dig til at scanne uden at tænke dig om.",
        regel: "Scan aldrig en QR-kode som du ikke kender. Brug den officielle hjemmeside i stedet.",
    }
];


function visScene(index){
    const scene = scener[index];
    let html = '';

    if (scene.scene === "email"){
        html = `
        <div class="email-mock">
        <div class="email-topbar">
        <div class="dot red"></div>
        <div class="dot yellow"></div>
        <div class="dot green"></div>
        </div>

        <div class="email-header">
        <div><span class="label">Fra:</span> <span class="value">${scene.fra}</span></div>
        <div><span class="label">Emne:</span> <span class="value">${scene.emne}</span></div>
        </div>

<div class="email-body">
    <p>${scene.besked}</p>
    
    ${
        scene.scene === "email" && scene.harQR
        ? `<div class="fake-qr"></div>`
        : ""
    }

    ${
        scene.scene === "email" && scene.harLink
        ? `<p>
            Klik her for at opdatere: 
            <span class="fake-link">${scene.link}</span>
           </p>`
        : ""
    }

    <p class="email-signoff">
        Venlig hilsen<br>
        IT-support
    </p>
</div>
      `;

    } else if (scene.scene === "sms") {
        html = `
        <div class="sms-mock">
        <div class="sms-sender">${scene.fra}</div>
        <div class="sms-chat" id="sms-chat">
        <div class="sms-bubble bot">${scene.besked}
        </div>
    </div>
        `;
    }

    html += `<div class="valg-container">`;
    scene.valg.forEach(function(valg, i) {
        html += `<button class="valg-btn" data-scene="${index}" data-valg="${i}">${valg}</button>`;
    });
    html +=`</div>`; 
    quizContainer.innerHTML =html;

    const knapper = quizContainer.querySelectorAll('.valg-btn');
    knapper.forEach(knap => {
    knap.addEventListener('click', function() {
        const sIndex = Number(this.getAttribute('data-scene'));
        const vIndex = Number (this.getAttribute('data-valg'));
        handleValg(sIndex, vIndex);
    });
});

} 

function visStep2(sceneIndex) {
    const scene = scener[sceneIndex];
    const chat = document.getElementById('sms-chat');

    const gamleKnapper = document.querySelector('.valg-container');
    if (gamleKnapper) gamleKnapper.remove();

    chat.innerHTML += `
        <div class="sms-bubble bot">
            ${scene.step2Besked}
        </div>
    `;

    let html = `<div class="valg-container">`;

    scene.step2Valg.forEach(function(valg, i) {
        html += `<button class="valg-btn step2-btn" data-scene="${sceneIndex}" data-valg="${i}">${valg}</button>`;
    });

html += `</div>`;
document.querySelector('.sms-mock').innerHTML += html;
const step2Knapper = document.querySelectorAll('.step2-btn');
    step2Knapper.forEach(knap => {
        knap.addEventListener('click', function() {
            const sIdx = Number(this.getAttribute('data-scene'));
            const vIdx = Number(this.getAttribute('data-valg'));
            handleStep2(sIdx, vIdx);
        });
    });
}

function handleStep2(sceneIndex, valgIndex) {
    const scene = scener[sceneIndex];
    const chat = document.getElementById('sms-chat');
    
     const udfald = scene.step2Udfald[valgIndex];
     
     setTimeout(() => {
        if (udfald === "dårlig") {
            fejl++;
            visDårligMellemstep(sceneIndex);
        } else {
            visGodMellemstep(sceneIndex);
        }
    }, 800);
}


function handleValg(sceneIndex, valgIndex) {
    const scene = scener[sceneIndex];
    const udfald = scene.udfald[valgIndex];
    if (scene.scene === "sms" && scene.svar) {
        const chat = document.getElementById('sms-chat');

                if (chat && scene.svar[valgIndex]) {
            chat.innerHTML += `
                <div class="sms-bubble user">
                    ${scene.svar[valgIndex]}
                </div>
            `;
        }
    }

    if (udfald === "dårlig") {
        fejl++;
        visDårligMellemstep(sceneIndex);

    } else if (udfald === "step2") {
        setTimeout(() => {
            visStep2(sceneIndex);
        }, 500);
    } else {
        visGodMellemstep(sceneIndex);
    } 

    }


function visDårligMellemstep(sceneIndex) {
    quizContainer.innerHTML = `
        <div class="slutning mellemstep">
            <p>${scener[sceneIndex].dårligMellemstep}</p>
            <button class="btn" id="btn-fortsaet-daarlig">Fortsæt</button>
        </div>
    `;
    document.getElementById('btn-fortsaet-daarlig').addEventListener('click', function() {
        visDårligSlutning(sceneIndex);
    });
}

function visGodMellemstep(sceneIndex) {
    quizContainer.innerHTML = `
        <div class="slutning mellemstep">
            <p>${scener[sceneIndex].godMellemstep}</p>
            <button class="btn" id="btn-fortsaet-god">Fortsæt</button>
        </div>
    `;
    document.getElementById('btn-fortsaet-god').addEventListener('click', function() {
        visGodForklaring(sceneIndex);
    });
}

function visGodForklaring(sceneIndex) {
    const næsteScene = sceneIndex + 1;

    quizContainer.innerHTML = `
        <div class="slutning god">
            <h2>Godt klaret! Du spottede phishing</h2>
            <p>${scener[sceneIndex].godForklaring}</p>
            <p class="regel">${scener[sceneIndex].regel}</p>
            <button class="btn" id="btn-naeste-god">
                ${næsteScene < scener.length ? 'Næste scene' : 'Se dit resultat'}
            </button>
        </div>
    `;

    document.getElementById('btn-naeste-god').addEventListener('click', function() {
        if (næsteScene < scener.length) {
            visScene(næsteScene);
        } else {
            visSlutning();
        }
    });
}

function visDårligSlutning(sceneIndex) {
    const forklaringer = [
        "Afsenderen 'it-support@iba-secure.net' er ikke en officiel IBA-adresse. Læg mærke til '.net' i stedet for '.dk'. Der var også to tastefejl i mailen: 'oppdaget' og 'mulligt'.",
        "En rigtig IT-afdeling vil aldrig bede om din adgangskode uanset situationen. Når du sender din kode får de fuld adgang til din konto og kan låse dig ude, stjæle dine data eller bruge din identitet.",
        "Du scannede QR-koden uden at tænke dig om. QR-koder er i virkeligheden bare links i forklædning og svindlere bruger dem netop fordi de fleste ikke tænker over hvor de fører hen. Selvom mailen og URL'en ser legitim ud, kan QR-koden sende dig direkte til en falsk side, hvor dine oplysninger bliver stjålet."
    ];

    const næsteScene = sceneIndex + 1;

    quizContainer.innerHTML = `
        <div class="slutning daarlig">
            <h2>Du er desværre faldet i fælden</h2>
            <p>${forklaringer[sceneIndex]}</p>
            <p class="regel">${scener[sceneIndex].regel}</p>
            <button class="btn" id="btn-naeste-daarlig">
                ${næsteScene < scener.length ? 'Fortsæt' : 'Se dit resultat'}
            </button>
        </div>
    `;

    document.getElementById('btn-naeste-daarlig').addEventListener('click', function() {
        if (næsteScene < scener.length) {
            visScene(næsteScene);
        } else {
            visSlutning();
        }
    });
}

function genstart(){
    fejl = 0;
    quizContainer .classList.add('hidden');
    quizStart.classList.remove('hidden');
}

function visIntro() {
    quizContainer.innerHTML = `
        <div class="slutning mellemstep">
            <h2>Sådan fungerer det</h2>
            <p>Du er studerende på IBA's erhvervsakademi og vil nu modtage en række mails og SMS'er.</p>
            <p>Din opgave er at træffe de rigtige valg og undgå at falde i fælden.</p>
            <p>Mon du kan klare det?</p>
            <button class="btn" id="btn-intro">Fortsæt</button>
        </div>
    `;

    document.getElementById('btn-intro').addEventListener('click', function() {
        visScene(0);
    });
}

function visSlutning() {
    if (fejl === 0) {
        quizContainer.innerHTML = `
            <div class="slutning god">
                <h2>Perfekt! Du gennemskuede alle tre phishing forsøg</h2>
                <p>Du har en stærk fornemmelse for hvad der er mistænkeligt og hvad der er legitimt. Du lader dig ikke manipulere til at handle hurtigt og det er præcis det der beskytter dig mod phishing.</p>
                <button class="btn" id="btn-genstart">Prøv igen</button>
            </div>
        `;
    } else if (fejl === 1) {
        quizContainer.innerHTML = `
            <div class="slutning daarlig">
                <h2>Næsten! Du faldt i fælden én enkelt gang</h2>
                <p>Phishing bliver mere og mere avanceret og svindlere laver beskeder der er svære at gennemskue. Husk altid at stoppe op og tjekke afsenderen inden du handler.</p>
                <button class="btn" id="btn-genstart">Prøv igen</button>
            </div>
        `;
    } else {
        quizContainer.innerHTML = `
            <div class="slutning daarlig">
                <h2>Du faldt i fælden ${fejl} gange</h2>
                <p>Social engineering er en svindelmetode, hvor nogen udgiver sig for at være en, du stoler på. Phishing er en af de mest udbredte former, hvor svindlere bruger hast, frygt eller vigtige beskeder for at få dig til at handle uden at tænke. Vær opmærksom på stavefejl, pres og mistænkelige links eller QR-koder.</p>
                <p class="regel">Næste gang du modtager en mistænkelig besked — stop op, træk vejret og tjek afsenderen inden du handler.</p>
                <button class="btn" id="btn-genstart">Prøv igen</button>
            </div>
        `;
    }

    document.getElementById('btn-genstart').addEventListener('click', function() {
        genstart();
    });
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