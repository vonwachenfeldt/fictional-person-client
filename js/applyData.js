const oldExtra = document.getElementById("extra").innerHTML;
const oldCard = document.getElementById("card").innerHTML;
const domain = (location.hostname == "127.0.0.1" ? "http://localhost:5000" : "https://david.cloudno.de/fictional-person");

var serverRendered = window.serverRendered;
var person = window.person;

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function generate(seed = "", options = { updateUrl: true }) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", domain + "/api/person?seed=" + seed, true);
    xhr.addEventListener("load", event => {
        person = JSON.parse(xhr.responseText);

        if (options.updateUrl) {
            if (!window.serverRendered) {
                window.location.hash = person.seed;
            } else {
                console.log("Push history", person.seed);
                window.history.pushState(null, "", `/${person.seed}`); 
            }   
        }
        
        document.getElementById("extra").innerHTML = oldExtra;
        document.getElementById("card").innerHTML = oldCard;

        document.getElementById("imageHolder").src = person.imageUrl;
        document.getElementById("nameHolder").innerHTML = " " + person.name.firstname + " " + person.name.surname;
        document.getElementById("ageHolder").innerHTML += " " + person.age;
        document.getElementById("locationHolder").innerHTML += " " + person.location.municipality + ", " + person.location.urbanArea;
        document.getElementById("adressHolder").innerHTML += " " + person.adress;
        document.getElementById("hobbyHolder").innerHTML += " " + person.hobby;
        document.getElementById("heightHolder").innerHTML += " " + person.height.heightFormatted;
        document.getElementById("weightHolder").innerHTML += " " + person.weight.weightFormatted;
        document.getElementById("BMIHolder").innerHTML += " " + person.bmi;
        document.getElementById("eyeColorHolder").innerHTML += " " + (person.eyeColor ? capitalize(person.eyeColor) : "Sekretessbelagt");
        document.getElementById("hairColorHolder").innerHTML += " " + (person.hairColor ? capitalize(person.hairColor) : "Sekretessbelagt");
        document.getElementById("diseaseHolder").innerHTML += " " + person.disease;
        document.getElementById("politicalPartyHolder").innerHTML += " " + person.politicalParty;
        document.getElementById("favoriteMealHolder").innerHTML += " " + person.favoriteMeal;
        document.getElementById("crimeHolder").innerHTML += " " + person.crime;
        document.getElementById("personalityTraitHolder").innerHTML += " " + person.personalityTrait;
        document.getElementById("organizationHolder").innerHTML += " " + person.organization;
        document.getElementById("residenceHolder").innerHTML += " " + person.residence;
        document.getElementById("vehicleHolder").innerHTML += " " + person.vehicle;
        document.getElementById("animalHolder").innerHTML += " " + person.favoriteAnimal;

        if (person.name.ethnicity == "other") {
            document.getElementById("ethnicityHolder").innerHTML += " Utländsk";
        }else{
            document.getElementById("ethnicityHolder").innerHTML += " Svensk";
        }
        
        if(person.age < 18) {
            document.getElementById("professionHolder").innerHTML += " Skolelev";
            if(person.gender == "man") {
                document.getElementById("genderHolder").innerHTML += " Pojke";
            }else if(person.gender == "kvinna") {
                document.getElementById("genderHolder").innerHTML += " Flicka";
            }
        }else{
            document.getElementById("professionHolder").innerHTML += " " + person.profession;
            document.getElementById("genderHolder").innerHTML += " " + (person.gender ? capitalize(person.gender) : "Sekretessbelagt");
        }
    });

    xhr.send();

}

function getSeedFromUrl(url = window.location.href) {
    // use url path for seed if server rendered, otherwise use hash
    if (serverRendered)
        // https://person.cf/seed
        return new URL(url).pathname.replace("/", "");
    else
        // https://person.cf#seed
        return url.slice(url.indexOf("#") + 1)
}

window.onpopstate = function () {
    const seed = getSeedFromUrl();

    console.log("Pop history", seed);

    generate(seed, { updateUrl: false });
}

// create person when page loads if not server renderd
if (!window.serverRendered) 
    generate(getSeedFromUrl());
else
    // set the url to the person
    window.history.replaceState(null, "", person.seed);

window.onhashchange = function () {
    const hash = getSeedFromUrl(); // will return hash

    if (hash != person.seed) 
        generate(hash);
}

function generateButtonClick() {
    generate();
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function copyPerson() {
    copyTextToClipboard("https://person.cf/#" + person.seed);
}