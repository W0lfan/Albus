import AlgusInstanceDirector from "./index.js";


const algus = new AlgusInstanceDirector({
    preciseSearch : true,
    printMethods : true,
    name : "Algus 1 - Tests",
    instanceList : ["calendar_dates","calendar","routes","trips"]
});

algus.run({
    name : "A",
    date : "20240218",
    direction : null,
    block_id : null
})