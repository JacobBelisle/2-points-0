"use strict";   //? Pour les chad

//!================================================================================================== CONSTANTES
const MAX_POINT = 21;
const MAX_GAME_POINT = 30;


//!================================================================================================== SELECTORS
const QUERY_NOM_DIV_BLEU = "#nom_div_bleu";
const QUERY_NOM_BLEU = "#nom_bleu";
const QUERY_CONTAINER_SET_GAGNE_BLEU = "#container_set_gagne_bleu";
const QUERY_SET_GAGNE_BLEU = "#set_gagne_bleu";
const QUERY_CONTAINER_SET_GAGNE_ROUGE = "#container_set_gagne_rouge";
const QUERY_SET_GAGNE_ROUGE = "#set_gagne_rouge";
const QUERY_NOM_DIV_ROUGE = "#nom_div_rouge";
const QUERY_NOM_ROUGE = "#nom_rouge";
const QUERY_BOUTON_PLUS_BLEU = "#bouton_plus_bleu";
const QUERY_BOUTON_MOINS_BLEU = "#bouton_moins_bleu";
const QUERY_POINTS_BLEU = "#points_bleu";
const QUERY_SET_1_BLEU = "#set-1_bleu";
const QUERY_SET_2_BLEU = "#set-2_bleu";
const QUERY_SET_3_BLEU = "#set-3_bleu";
const QUERY_SET_1_ROUGE = "#set-1_rouge";
const QUERY_SET_2_ROUGE = "#set-2_rouge";
const QUERY_SET_3_ROUGE = "#set-3_rouge";
const QUERY_POINTS_ROUGE = "#points_rouge";
const QUERY_BOUTON_PLUS_ROUGE = "#bouton_plus_rouge";
const QUERY_BOUTON_MOINS_ROUGE = "#bouton_moins_rouge";
const QUERY_NEW_MATCH = "#new_match";
const QUERY_NEXT_SET = "#next_set";
const QUERY_CHANGE_SIDE = "#change_side";


//!================================================================================================== QUERY
const NOM_DIV_BLEU = document.querySelector(QUERY_NOM_DIV_BLEU);
const NOM_BLEU = document.querySelector(QUERY_NOM_BLEU);
const CONTAINER_SET_GAGNE_BLEU = document.querySelector(QUERY_CONTAINER_SET_GAGNE_BLEU);
const SET_GAGNE_BLEU = document.querySelector(QUERY_SET_GAGNE_BLEU);
const CONTAINER_SET_GAGNE_ROUGE = document.querySelector(QUERY_CONTAINER_SET_GAGNE_ROUGE);
const SET_GAGNE_ROUGE = document.querySelector(QUERY_SET_GAGNE_ROUGE);
const NOM_DIV_ROUGE = document.querySelector(QUERY_NOM_DIV_ROUGE);
const NOM_ROUGE = document.querySelector(QUERY_NOM_ROUGE);
const BOUTON_PLUS_BLEU = document.querySelector(QUERY_BOUTON_PLUS_BLEU);
const BOUTON_MOINS_BLEU = document.querySelector(QUERY_BOUTON_MOINS_BLEU);
const POINTS_BLEU = document.querySelector(QUERY_POINTS_BLEU);
const SET_1_BLEU = document.querySelector(QUERY_SET_1_BLEU);
const SET_2_BLEU = document.querySelector(QUERY_SET_2_BLEU);
const SET_3_BLEU = document.querySelector(QUERY_SET_3_BLEU);
const SET_1_ROUGE = document.querySelector(QUERY_SET_1_ROUGE);
const SET_2_ROUGE = document.querySelector(QUERY_SET_2_ROUGE);
const SET_3_ROUGE = document.querySelector(QUERY_SET_3_ROUGE);
const POINTS_ROUGE = document.querySelector(QUERY_POINTS_ROUGE);
const BOUTON_PLUS_ROUGE = document.querySelector(QUERY_BOUTON_PLUS_ROUGE);
const BOUTON_MOINS_ROUGE = document.querySelector(QUERY_BOUTON_MOINS_ROUGE);
const NEW_MATCH = document.querySelector(QUERY_NEW_MATCH);
const NEXT_SET = document.querySelector(QUERY_NEXT_SET);
const CHANGE_SIDE = document.querySelector(QUERY_CHANGE_SIDE);


//!================================================================================================== StoredDATA
//?Représente les données que l'on veut stocker dans le "localstorage"
const DataToStore = [
    "nomEquipe1",
    "nomEquipe2",
    "pointEquipe1Set1",
    "pointEquipe1Set2",
    "pointEquipe1Set3",
    "pointEquipe2Set1",
    "pointEquipe2Set2",
    "pointEquipe2Set3",
    "qtSetGagneEquipe1",
    "qtSetGagneEquipe2",
    "changeSide",
    "currentSet"
];

//?Transforme DataToStore en un objet (key:value) contenant les informations dans le "localstorage"
const STORED_DATA = DataToStore.reduce((acc, currentValue) => (acc[currentValue] = localStorage.getItem(currentValue) || 0, acc), {});

//?Ajoute un event à l'objet StoredDATA, chaque fois que ses membres seront changé, l'information sera update dans le "localstorage"
const CONNEXION = new Proxy(STORED_DATA, {
    set: function (target, key, value) {
        console.log("change", key);
        localStorage.setItem(key, value);
        target[key] = value;
        return Reflect.set(target, key, value);
    }
});


//!================================================================================================== EVENTS
BOUTON_PLUS_BLEU.addEventListener("click", () => { plusPoint("BLEU"); });
BOUTON_MOINS_BLEU.addEventListener("click", () => { moinsPoint("BLEU"); });
BOUTON_PLUS_ROUGE.addEventListener("click", () => { plusPoint("ROUGE"); });
BOUTON_MOINS_ROUGE.addEventListener("click", () => { moinsPoint("ROUGE"); });
NEW_MATCH.addEventListener("click", () => { newMatch(); });
NEXT_SET.addEventListener("click", () => { nextSet(); } );
CHANGE_SIDE.addEventListener("click", () => { changeBord(); });
NOM_DIV_BLEU.addEventListener("click", () => { changerNom("BLEU"); });
NOM_DIV_ROUGE.addEventListener("click", () => { changerNom("ROUGE"); });


//!================================================================================================== FUNCTIONS
let disable = false;

function getPointSet(noEquipe, noSet){
    return CONNEXION[`pointEquipe${noEquipe}Set${noSet}`];
}

function setPointSet(noEquipe, noSet, value){
    return CONNEXION[`pointEquipe${noEquipe}Set${noSet}`] = value;
}

function getTeamIdByColor(color){
    if(!CONNEXION["changeSide"] && color === "BLEU") return 1;
    if(CONNEXION["changeSide"] && color === "BLEU") return 2;

    if(!CONNEXION["changeSide"] && color === "ROUGE") return 2;
    if(CONNEXION["changeSide"] && color === "ROUGE") return 1;
}

function getPointElementByTeamId(id){
    if(!CONNEXION["changeSide"] && id === 1) return POINTS_BLEU;
    if(CONNEXION["changeSide"] && id === 1) return POINTS_ROUGE;

    if(!CONNEXION["changeSide"] && id === 2) return POINTS_ROUGE;
    if(CONNEXION["changeSide"] && id === 2) return POINTS_BLEU;
}

function displayScreen(){
    POINTS_BLEU.style.color = "";
    POINTS_ROUGE.style.color = "";

    if(winner()){
        NEXT_SET.disabled = false;
        let equipeGagnante = equipePlusDePoint();
        let pointElement = getPointElementByTeamId(equipeGagnante);
        pointElement.style.color="red";
    } else {
        NEXT_SET.disabled = true;
    }

    let teamIdBleu = getTeamIdByColor("BLEU");
    let teamIdRouge = getTeamIdByColor("ROUGE");

    POINTS_BLEU.innerHTML = getPointSet(teamIdBleu, CONNEXION["currentSet"]);
    SET_1_BLEU.innerHTML = CONNEXION[`pointEquipe${teamIdBleu}Set1`];
    SET_2_BLEU.innerHTML = CONNEXION[`pointEquipe${teamIdBleu}Set2`];
    SET_3_BLEU.innerHTML = CONNEXION[`pointEquipe${teamIdBleu}Set3`];
    NOM_BLEU.innerHTML = CONNEXION[`nomEquipe${teamIdBleu}`];
    SET_GAGNE_BLEU.innerHTML = CONNEXION[`qtSetGagneEquipe${teamIdBleu}`];

    POINTS_ROUGE.innerHTML = getPointSet(teamIdRouge, CONNEXION["currentSet"]);
    SET_1_ROUGE.innerHTML = CONNEXION[`pointEquipe${teamIdRouge}Set1`];
    SET_2_ROUGE.innerHTML = CONNEXION[`pointEquipe${teamIdRouge}Set2`];
    SET_3_ROUGE.innerHTML = CONNEXION[`pointEquipe${teamIdRouge}Set3`];
    NOM_ROUGE.innerHTML = CONNEXION[`nomEquipe${teamIdRouge}`];
    SET_GAGNE_ROUGE.innerHTML = CONNEXION[`qtSetGagneEquipe${teamIdRouge}`];

}

function plusPoint(color){
    if(winner()) return;
    let teamId = getTeamIdByColor(color);

    let oldPointage = getPointSet(teamId, CONNEXION["currentSet"]);
    setPointSet(teamId, CONNEXION["currentSet"], ++oldPointage);

    if(winner()){
        let equipeGagnante = equipePlusDePoint();
        CONNEXION[`qtSetGagneEquipe${equipeGagnante}`]++;
    }

    displayScreen();
}

function moinsPoint(color){

    if(winner()){
        let equipeGagnante = equipePlusDePoint();
        if(equipeGagnante !== getTeamIdByColor(color)) return;
        CONNEXION[`qtSetGagneEquipe${equipeGagnante}`]--;
    }


    NEXT_SET.disabled = true;
    let teamId = getTeamIdByColor(color);

    let oldPointage = getPointSet(teamId, CONNEXION["currentSet"]);
    if(oldPointage <= 0) return;
    setPointSet(teamId, CONNEXION["currentSet"], --oldPointage);
    
    displayScreen();        
}

function changerNom(color){
    let newName = prompt('Entrez le nom de l\'équipe');
    let teamId = getTeamIdByColor(color);
    CONNEXION[`nomEquipe${teamId}`] = newName;

    displayScreen();

    //LX
    if(disable) return;
    let otherTeamId = (teamId === 1) ? 2 : 1;
    if(newName == CONNEXION[`nomEquipe${otherTeamId}`]) disable = !confirm(atob("VW4gcGV1IG3pbGFuZ2VhbnQgZGV1eCBqb3VldXJzIGF2ZWMgbGUgbeptZSBub20uLi4KQnkgdGhlIHdheSwgSmFjayBhIGwnYWlyZSBkZSBiZWF1Y291cCBhaW1lciBsZXMgPGRpdj4KKERlIExYKQ=="));
}

function winner(){
    let ptsEquipe1 = getPointSet(1, CONNEXION["currentSet"]);
    let ptsEquipe2 = getPointSet(2, CONNEXION["currentSet"]);
    if(ptsEquipe1 >= 21 || ptsEquipe2 >= 21){
        if(Math.max(ptsEquipe1, ptsEquipe2) >= 30) return true;
        if(Math.abs(ptsEquipe1 - ptsEquipe2) >= 2) return true;
    }
    return false;
}

function equipePlusDePoint(){
    return (getPointSet(1, CONNEXION["currentSet"]) == Math.max(getPointSet(1, CONNEXION["currentSet"]), getPointSet(2, CONNEXION["currentSet"]))) ? 1 : 2;
}

function newMatch(){
    if (!confirm("Voulez-vous supprimer toutes les données et recommencer?")) return;
    Object.keys(CONNEXION).forEach(key => CONNEXION[key] = 0);
    CONNEXION["changeSide"] = false;
    main();
    displayScreen();
}

function nextSet(){
    if(CONNEXION["currentSet"] < 3) CONNEXION["currentSet"]++;
    NEXT_SET.disabled = true;
    displayScreen();
}

function changeBord(){
    CONNEXION["changeSide"]  = !CONNEXION["changeSide"];
    displayScreen();
}


//!================================================================================================== MAIN
function main(){
    if(CONNEXION["nomEquipe1"] === 0) CONNEXION["nomEquipe1"] = "Noms equipe 1";
    if(CONNEXION["nomEquipe2"] === 0) CONNEXION["nomEquipe2"] = "Noms equipe 2";
    if(CONNEXION["currentSet"] === 0) CONNEXION["currentSet"] = 1;
    if(CONNEXION["changeSide"] === "false") CONNEXION["changeSide"] = false;
    NEXT_SET.disabled = (!winner());
    displayScreen();
}

main();