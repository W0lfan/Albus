class Method {
    constructor(instance, data) {
        this.instance = instance;
        this.name = instance.name;
        this.data = data;
    } 


    print(range = 10) {
        const d = this.data;

        if (d) {
            console.log(`Reading "${this.name}" for ${this.instance.printMethod} (${d.length} data)`);
            
            for (let i = 0; i < (range <= 0 ? d.length : range); i++) {
                const item = d[i];
                if (item) {
                    const itemKeys = Object.keys(item);
                    process.stdout.write(`${i} | \r`);
                    itemKeys.forEach((key) => {
                        process.stdout.write(`${key} = ${item[key]} ${i+1 == range ? "" : "|"} `);
                    });
                    console.log("");
                }
            }


            if (range < d.length) {
                const dS = d.length - range > 1 ? "s" : "";
                if (range < d.length) console.log(`...${d.length - range} item${dS} more.`)    
            }
        }
    }
    
    getValue(data, key, value) {
        if (data) return data.find((e) => e[key] == value);
        else return null;
    }
}

export default Method;