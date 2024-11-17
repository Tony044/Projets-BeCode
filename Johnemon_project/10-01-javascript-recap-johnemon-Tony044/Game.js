const JohnemonMaster = require('./JohnemonMaster'); // Replace 'your_classes_filename' with the actual filename
const Johnemon = require('./Johnemon')
const JohnemonWorld = require ('./JohnemonWorld')
const fs = require('fs');
const rl = require("./utilities");

const path = "./file.json";
let jsonData = {};


let newWorld = new JohnemonWorld();
let newMaster = new JohnemonMaster();
const date = new Date().toISOString();

function readSaveGameState() {
  if (fs.existsSync(path)) {
    let lireJson = fs.readFileSync(path);
    jsonData = JSON.parse(lireJson);
    console.log(jsonData);

    // D'abord récupérer les johnemons
    let cloneJohnemonCollection = jsonData.JohnemonMaster.JohnemonCollection
    cloneJohnemonCollection = Johnemon.from(cloneJohnemonCollection)
    //jsonData.JohnemonMaster.JohnemonCollection = cloneJohnemonCollection
    
    // Récupérer le johnemonMaster
    let cloneJohnemonMaster = jsonData.JohnemonMaster
    cloneJohnemonMaster = JohnemonMaster.from(cloneJohnemonMaster)

    // Récupérer le monde
    let day = jsonData.day
    let logs = jsonData.logs
    let cloneWorld = new JohnemonWorld(day, logs)
    console.log("Vous avez bien chargé la partie avec votre collection : ", jsonData.JohnemonMaster.JohnemonCollection)
    } 
}

function saveGameState(){
  jsonData = {
    "saved_on": date,
    "JohnemonMaster": {
      "name": newMaster.name,
      "JohnemonCollection": newMaster.johnemonCollection.map(johnemon => {return{
        "name": johnemon.name,
        "level": johnemon.level,
        "experienceMeter": johnemon.experienceMeter,
        "attackRange": johnemon.attackRange,
        "defenseRange": johnemon.defenseRange,
        "healthPool": johnemon.healthPool,
        "catchPhrase": johnemon.catchPhrase
      }}),
      "healingItems": newMaster.healingItems,
      "reviveItems": newMaster.reviveItems,
      "JOHNEBALLS": newMaster.JOHNEBALLS
    },
    "day": newWorld.day,
    "logs": [
      newWorld.logs,
    ]
  };
  fs.writeFileSync(path, JSON.stringify(jsonData, null, 2));
}

function askForName() {
  return new Promise ((resolve) => {
    rl.question("Quel est votre nom : ", (answer) => {
      console.log(`Votre nom de jeu est bien ${answer}`);
      newMaster.name = answer;
      resolve();
    })
  })
}

function proposeFirstJohnemon(){
  const starters = [
  johnemon1 = new Johnemon(),
  johnemon2 = new Johnemon(),
  johnemon3 = new Johnemon()
]
console.log(starters);

return new Promise((resolve) => {
  rl.question(`Choisissez le "Johnemon" de vôtre choix, vous pouver choissir entre "1, 2 et 3" : `, (answer) => {
    answer = parseInt(answer);
    if (answer === 1) {
      console.log(`Très bon choix, vous avez choissis: ${(starters[0].name)}`)
      newMaster.johnemonCollection.push(starters[0]);
      console.log(newMaster.johnemonCollection);
    } else if (answer === 2){
      console.log(`Très bon choix, vous avez choissis: ${(starters[1].name)}`);
      newMaster.johnemonCollection.push(starters[1]);
    } else if (answer === 3){
      console.log(`Très bon choix, vous avez choissis: ${(starters[2].name)}`);
      newMaster.johnemonCollection.push(starters[2]);
    }  else {
      console.log("Veuillez réessayer, l'entrée n'est pas valide !!");
      proposeFirstJohnemon();
      }
      resolve();
    })
  })
}

async function startGame(){
  let userInput = await new Promise((resolve) => rl.question('Souhaitez vous reprendre la dernière partie(YES) ou commencez une nouvelle partie(OTHER) ? ', async (answer) => {
    if(answer === "YES" || answer === "yes" || answer === "Yes") {
      readSaveGameState();
      await newWorld.oneDayPasses();
      resolve()
    } else {
      console.log("C'est votre premier jour!!!")
      await askForName();
      await proposeFirstJohnemon();
      saveGameState()
      resolve();
    }
  }))
  rl.close()
}

startGame()


