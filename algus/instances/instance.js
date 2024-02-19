import { v1 as uuid } from 'uuid';
import Method from './methods.js';

class Instance  {
    /*
 
        Algus's instances are a bit tricky, but are done to be children of the parent 
        class, Algus.
        An instance is a specific object that contains all the necessary data related to a 
        certain type of bus line. 
        Instances are used to fetch and treat the data of a certain JSON file. 
        Each instance own a certain datatype, parsed as an argument it its constructor.

    */

    #fetchWEB = false;

    constructor(name, Algus) {
        // Chaque instance doit être liée à une classe parent "Algus"
        if (!Algus) {
            throw new Error(`Canceled Instance ${name} initialization: each Algus Instance must be assigned a children of an Algus object.`);
        }

        this.name = name;
        this.algus = Algus;
        this.algusID = Algus.id;
        this.id = uuid();
        this.printMethod = `Instance <@${this.id}>`;
        this.location = `${this.#fetchWEB ? 'https://albi-bus.naflouille-creations.com/reseau-bus-albi/' : '/Algorithm/utils/data/'}${name}.json`;
    
    }

    run(callback) {
        (async () => {
            try {
                const data = await this.fetchData();
                this.data = data;
                this.method = new Method(this, data);
    
                console.log((`Initialized ${this.name}`));
                if (this.algus.printMethods) {
                    console.log(`Initialized ${this.name} for ${this.printMethod} (${this.algus.printMethod})`);
                }

                if (callback) callback(this,data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }



    toString() {
        return `${this.printMethod} (${this.algus.printMethod}) | ${this.name} | ${this.location}`;
    }

    async fetchData() {
        try {
            const response = await fetch(this.location);
            if (!response.ok) throw new Error(`Data fetch failed for ${this.printMethod}`);
            const data = await response.json();
            console.log(data)
            return data;

        } catch (error) {
            console.log(`Error fetching data for ${this.printMethod}`,error);
        }
    }

}


export default Instance;