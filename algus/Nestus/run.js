import AlgusInstanceDirector from "./index.js";

console.time("execTime")

const algus = new AlgusInstanceDirector({
    preciseSearch : true,
    printMethods : false,
    name : "Algus",
    instanceList : ["calendar_dates","calendar","routes","trips","shapes","stop_times","stops"]
});



algus.run({
    name : "A",
    date : "20240219",
    direction : null,
    block_id : null
},(albusContent) => {
    console.log(albusContent.stopTimes)
    console.timeEnd("execTime");

})




