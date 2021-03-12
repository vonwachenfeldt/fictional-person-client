const https = require("https");

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}

const getPerson = (seed = "") => {
    return new Promise(resolve => {
        https.get('https://david.cloudno.de/fictional-person/api/person?seed=' + seed, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    });
}

module.exports = async (req, res) => {
    const seed = req.query.seed;

    const person = await getPerson(seed);

    // Format the attributes of the person
    const name = person.name.firstname + " " + person.name.surname;
    const ethnicity = person.name.ethnicity === "white" ? "Svensk" : "Utländsk";
    const location = person.location.municipality + ", " + person.location.urbanArea;
    const profession = person.age >= 18 ? person.profession : "Skolelev";

    var gender = capitalize(person.gender);
    if (person.age < 18)
        gender = person.gender === "man" ? "Pojke" : "Flicka";

    const eyeColor = person.eyeColor ? capitalize(person.eyeColor) : "Sekretessbelagt";
    const hairColor = person.hairColor ? capitalize(person.hairColor) : "Sekretessbelagt";

    console.log("Generated person %s at", name, new Date().toUTCString());

    const personMetaDescription = `
    Ålder: ${person.age}
    Kön: ${gender}
    Etnicitet: ${ethnicity}

    Yrke: ${profession}
    Hobby: ${person.hobby}
    Adress: ${person.adress}

    Sjukdom: ${person.disease}
    Politiskt parti: ${person.politicalParty}
    Belastningsregistret: ${person.crime}

    Medlem i: ${person.organization}
    Husdjur: ${person.favoriteAnimal}
    Favoritmaträtt: ${person.favoriteMeal}`;

    const html =
    `<!DOCTYPE html prefix="og: https://ogp.me/ns#">
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">

        <link rel="stylesheet" type="text/css" href="/css/style.css">

        <title>Fictional Person</title>

        <meta property="og:title" content="${name}">
        <meta property="og:url" content="http://person.cf/${person.seed}" />
        <meta property="og:description" content="${personMetaDescription}">
        <meta property="og:site_name" content="Fictional Person">
        <meta property="og:image" content="${person.imageUrl}">
        <meta property="og:image:width" content="512"> 
        <meta property="og:image:height" content="512">
        <meta property="og:type" content="article">
        <meta property="article:published_time" content="${new Date().toISOString()}">
        <meta property="article:modified_time" content="${new Date().toISOString()}">

        <meta name="theme-color" content="#f1805a">

        <meta name="twitter:card" content="summary_large_image">
        <link type="application/json+oembed" href="/oembed.json" />

    </head>
    
    <body>
    <!-- Script for server side rendering -->
        <script>
            window.serverRendered = true;

            window.person = ${JSON.stringify(person)};
        </script>
        <div class="container">
            <div id="card" class="card">
                <img id="imageHolder" src="${person.imageUrl}"
                    alt="Avatar" style="width:100%">
                <div class="container">
                    <h4 class="name"><b><span id="nameHolder" >${name}</span></b></h4>
                    <p class="info"><span class="darker">Ålder:</span> <span  id="ageHolder">${person.age}</span></p>
                    <p class="info"><span class="darker">Etnicitet:</span> <span id="ethnicityHolder">${ethnicity}</span></p>
                    <p class="info"><span class="darker">Yrke:</span> <span id="professionHolder">${profession}</span></p>
                    <p class="info"><span class="darker">Tätort:</span> <span id="locationHolder">${location}</span></p>
                    <p class="info"><span class="darker">Adress:</span> <span id="adressHolder">${person.adress}</span></p>
                    <p class="info"><span class="darker">Hobby:</span> <span id="hobbyHolder">${person.hobby}</span></p>
                </div>
            </div>
            <div id="extra" class="extra">
                <h1 class="subtitle">Anatomi</h1>
                <p class="info p2"><span class="darker">Kön:</span> <span id="genderHolder">${gender}</span></p>
                <p class="info p2"><span class="darker">Längd:</span> <span id="heightHolder">${person.height.heightFormatted}</span></p>
                <p class="info p2"><span class="darker">Vikt:</span> <span id="weightHolder">${person.weight.weightFormatted}</span></p>
                <p class="info p2"><span class="darker">BMI:</span> <span id="BMIHolder">${person.bmi}</span></p>
                <p class="info p2"><span class="darker">Ögonfärg:</span> <span id="eyeColorHolder">${eyeColor}</span></p>
                <p class="info p2"><span class="darker">Hårfärg:</span> <span id="hairColorHolder">${hairColor}</span></p>
                <p class="info p2"><span class="darker">Sjukdom:</span> <span id="diseaseHolder">${person.disease}</span></p>
                <h1 class="subtitle">Övrigt</h1>
                <p class="info p2"><span class="darker">Politiskt parti:</span> <span id="politicalPartyHolder">${person.politicalParty}</span></p>
                <p class="info p2"><span class="darker">Favoritmaträtt:</span> <span id="favoriteMealHolder">${person.favoriteMeal}</span></p>
                <p class="info p2"><span class="darker">Belastningsregistret:</span> <span id="crimeHolder">${person.crime}</span></p>
                <p class="info p2"><span class="darker">Personlighetsdrag:</span> <span id="personalityTraitHolder">${person.personalityTrait}</span></p>
                <p class="info p2"><span class="darker">Medlem i:</span> <span id="organizationHolder">${person.organization}</span></p>
                <h1 class="subtitle">Egendom</h1>
                <p class="info p2"><span class="darker">Bostad:</span> <span id="residenceHolder">${person.residence}</span></p>
                <p class="info p2"><span class="darker">Fordon:</span> <span id="vehicleHolder">${person.vehicle}</span></p>
                <p class="info p2"><span class="darker">Husdjur:</span> <span id="animalHolder">${person.favoriteAnimal}</span></p>
            </div>
            <div>
                <button onclick=generateButtonClick(); class="generate">Generera</button>
                <button onclick=copyPerson(); class="generate share">Dela denna personen</button>
        </div>
            <a class="link" href="https://github.com/vonwachenfeldt/fictional-person" target="_blank">Project on GitHub</a>
        </div>
        <script src="/js/applyData.js"></script>
    </body>
    
    </html>`;

    res.send(html);
}