const xhr = new XMLHttpRequest;
const oldExtra = document.getElementById("extra").innerHTML;
const oldCard = document.getElementById("card").innerHTML;

function generate() {
    xhr.open("GET", "https://david.cloudno.de/fictional-person/api/person?seed=" + window.location.hash.slice(1), true);
    xhr.addEventListener("load", event => {
        const data = JSON.parse(xhr.responseText);
        window.data = data;

        if (window.data.age < 18) {
            window.data.profession = "Skolelev";
        }
        if (window.data.age < 19) {
            window.data.political_party = "Politiskt okunnig"
        }


        document.getElementById("extra").innerHTML = oldExtra;
        document.getElementById("card").innerHTML = oldCard;

        document.getElementById("imageHolder").src = window.data.image.url;
        document.getElementById("nameHolder").innerHTML = " " + window.data.name.firstName + " " + window.data.name.surName;
        document.getElementById("ageHolder").innerHTML += " " + window.data.age;
        document.getElementById("professionHolder").innerHTML += " " + window.data.profession;
        document.getElementById("locationHolder").innerHTML += " " + window.data.location.municipality + ", " + window.data.location.urbanArea;
        document.getElementById("adressHolder").innerHTML += " " + window.data.adress;
        document.getElementById("hobbyHolder").innerHTML += " " + window.data.hobby;
        document.getElementById("genderHolder").innerHTML += " " + window.data.gender;
        document.getElementById("heightHolder").innerHTML += " " + window.data.height.heightFormatted;
        document.getElementById("weightHolder").innerHTML += " " + window.data.weight.weightFormatted;
        document.getElementById("BMIHolder").innerHTML += " " + window.data.bmi;
        document.getElementById("eyeColorHolder").innerHTML += " " + window.data.eye_color;
        document.getElementById("hairColorHolder").innerHTML += " " + window.data.hair_color;
        document.getElementById("politicalPartyHolder").innerHTML += " " + window.data.political_party;
        document.getElementById("favoriteMealHolder").innerHTML += " " + window.data.favorite_meal;
        document.getElementById("crimeHolder").innerHTML += " " + window.data.vehicle;
        document.getElementById("residenceHolder").innerHTML += " " + window.data.residence;
        document.getElementById("vehicleHolder").innerHTML += " " + window.data.vehicle;

    });

    xhr.send();

}

generate();