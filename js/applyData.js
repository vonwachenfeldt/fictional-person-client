const xhr = new XMLHttpRequest;
const oldExtra = document.getElementById("extra").innerHTML;
const oldCard = document.getElementById("card").innerHTML;

const domain = "http://localhost:5000"

let person;

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function generate() {
    xhr.open("GET", domain + "/api/person?seed=" + window.location.hash.slice(1), true);
    xhr.addEventListener("load", event => {
        person = JSON.parse(xhr.responseText);

        if (person.age < 18) {
            person.profession = "Skolelev";
        }
        if (person.age < 19) {
            person.political_party = "Politiskt okunnig"
        }

        document.getElementById("extra").innerHTML = oldExtra;
        document.getElementById("card").innerHTML = oldCard;

        document.getElementById("imageHolder").src = person.imageUrl;
        document.getElementById("nameHolder").innerHTML = " " + person.name.firstname + " " + person.name.surname;
        document.getElementById("ageHolder").innerHTML += " " + person.age;
        document.getElementById("professionHolder").innerHTML += " " + person.profession;
        document.getElementById("locationHolder").innerHTML += " " + person.location.municipality + ", " + person.location.urbanArea;
        document.getElementById("adressHolder").innerHTML += " " + person.adress;
        document.getElementById("hobbyHolder").innerHTML += " " + person.hobby;
        document.getElementById("genderHolder").innerHTML += " " + person.gender ? capitalize(person.gender) : "Sekretessbelagt";
        document.getElementById("heightHolder").innerHTML += " " + person.height.heightFormatted;
        document.getElementById("weightHolder").innerHTML += " " + person.weight.weightFormatted;
        document.getElementById("BMIHolder").innerHTML += " " + person.bmi;
        document.getElementById("eyeColorHolder").innerHTML += " " + (person.eyeColor ? capitalize(person.eyeColor) : "Sekretessbelagt");
        document.getElementById("hairColorHolder").innerHTML += " " + (person.hairColor ? capitalize(person.hairColor) : "Sekretessbelagt");
        document.getElementById("politicalPartyHolder").innerHTML += " " + person.politicalParty;
        document.getElementById("favoriteMealHolder").innerHTML += " " + person.favoriteMeal;
        document.getElementById("crimeHolder").innerHTML += " " + person.crime;
        document.getElementById("residenceHolder").innerHTML += " " + person.residence;
        document.getElementById("vehicleHolder").innerHTML += " " + person.vehicle;

    });

    xhr.send();

}

generate();

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
    copyTextToClipboard(person.seed);
}