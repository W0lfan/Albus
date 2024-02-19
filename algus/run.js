import AlgusInstanceDirector from "./index.js";


const algus = new AlgusInstanceDirector({
    preciseSearch : true,
    printMethods : false,
    name : "Algus",
    instanceList : ["calendar_dates","calendar","routes","trips","shapes","stop_times","stops"]
});




algus.run({
    name : "G",
    date : "20240218",
    direction : 1,
    block_id : null
}, (algusResults) => {
    console.log(algusResults.stops)
})