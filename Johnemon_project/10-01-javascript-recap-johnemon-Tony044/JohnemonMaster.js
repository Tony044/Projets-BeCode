const Johnemon = require('./Johnemon.js');
const johnemonInst = new Johnemon();
class JohnemonMaster {
  name = "";
  johnemonCollection = [];
  healingItems = 5;
  reviveItems = 3;
  JOHNEBALLS = 10;

  constructor() {
  }

  static from(name, johnemonCollection, healingItems, reviveItems, JOHNEBALLS) {
    const cloneJohnemonMaster = new JohnemonMaster()
    // TODO
    cloneJohnemonMaster.name = name
    cloneJohnemonMaster.johnemonCollection = johnemonCollection
    cloneJohnemonMaster.healingItems = healingItems
    cloneJohnemonMaster.reviveItems = reviveItems
    cloneJohnemonMaster.JOHNEBALLS = JOHNEBALLS
    return cloneJohnemonMaster
  }


  catchJohnemon(johnemon) {
    if (this.JOHNEBALLS > 0) {
      this.johnemonCollection.push(johnemon);
      this.JOHNEBALLS--;
      console.log(`Le Johnemon ${johnemon.name}, a bien été capturé.`)
    } else {
      Console.log("Vous ne disposez pas d'assez de 'JOHNBALLS'.");
    }
  }



  healJohnemon(johnemon) {
    if (this.healingItems > 0) {
      johnemon.healthPool = johnemonInst.healthPool
      this.healingItems--;
      console.log(`L'état de santé de votre ${johnemon.name} a bien été regénéré.`);
    } else {
      console.log("Vous ne disposez pas d'assez de 'Healin Items'.");
    }
  }

  reviveJohnemon(johnemon) {
    if (this.healingItems > 0) {
      johnemon.healthPool = johnemonInst.healthPool;
      this.reviveItems--;
      console.log(`L'état de santé de votre ${johnemon.name} a bien été réanimé.`);
    } else {
      console.log("Vous ne disposez pas d'assez de 'Revive Items'.");
    }
  }


  releaseJohnemon(johnemon) {
    console.log(this.johnemonCollection);
    this.johnemonCollection.pop();

  }

  showCollection() {
    console.log(this.johnemonCollection);
  }
}
module.exports = JohnemonMaster
