const JohnemonArena = require('./JohnemonArena')
const Johnemon = require('./Johnemon');
const rl = require('./utilities');
const JohnemonMaster = require('./JohnemonMaster');
const choiceForDay = [];

let newInstanceMaster = new JohnemonMaster;
let choice;


class JohnemonWorld {
  constructor(day = 1, logs = []) {
    this.day = day;
    this.logs = logs;
  }

  
  oneDayPasses(){
    this.day++;
    this.addLog(`Un nouveau jour commence...`);
    console.log(`Vous pouvez choissir : \n 1) Utiliser un objet de soin pour guérir un Johnemon à pleine santé \n 2) Utiliser un objet de réanimation pour réanimer un Johnemon à la moitié de sa santé \n 3) libérer un Johnemon de la collection \n 4) Renommer un Johnemon de la collection`)
    return new Promise((resolve) => {
      rl.question("Que souhaitez vous faire aujourd'hui ?", answer => {
      answer = parseInt(answer);

      if (answer === 1) {
        newInstanceMaster.healJohnemon();
        console.log("Vous souhaiter guérir un Johnemon !");
        choice = 1;
    } else if (answer === 2) {
        newInstanceMaster.reviveJohnemon();
        console.log("Vous souhaiter réanimer un Johnemon !");
        choice = 2;
    } else if (answer === 3) {
      console.log("Vous souhaiter libérer un Johnemon !");
      choice = 3;
    } else if (answer === 4) {
      //Renomer le 
      console.log("Vous souhaiter renommer un Johnemon !");
    } else {
      console.log("Error! Veuillez entrer un nombre valide");
      this.oneDayPasses();
    }
    resolve();
  })
  })
  }
  
  choiceJohnemon() {
    newInstanceMaster.showCollection();
    rl.question("Quel Johnemon voulez vous choissir ? ", answer => {
      answer = parseInt(answer);
      answer = JohnemonMaster.jsonData[answer - 1];

      console.log("Vous avez bien choisis : ", answer);
      
      if(choice === 1) {
        newInstanceMaster.catchJohnemon(answer);
      } else if (answer === 2) {
        newInstanceMaster.reviveJohnemon(answer);
        console.log("Vous souhaiter réanimer un Johnemon !");
        choice = 2;
      } else if (answer === 3) {
        newInstanceMaster.releaseJohnemon(answer);
        console.log("Vous souhaiter libérer un Johnemon !");
        choice = 3;
      } else if (answer === 4) {
        //Renomer le 
        console.log("Vous souhaiter renommer un Johnemon !");
      } else {
        console.log("Error! Veuillez entrer un nombre valide");
        this.oneDayPasses();
      }
    })
  }
  randomizeEvent() {
     
  }

  addLog(newLog){
    this.logs.push(`Jour ${this.day}: ${newLog}`);
    console.log(`Jour ${this.day}: ${newLog}`);
  }
}


module.exports = JohnemonWorld