/*

    Author : classedex
    Version : 0.0.1
    Last updated : 02/17/2023

    For more informations, please visist https://github.com/W0lfan/Albus/blob/main/docs/README.md

*/

import { instances } from "./config/config.js";
import Instance from "./instances/instance.js";
import { v1 as uuid } from 'uuid';

export default class AlgusInstanceDirector {
    /*

        For testing purposes, and also optimization, the two parameters of the constructor
        are freely settable. Prefer disabling preciseSearch for user usage, as well as 
        printMethods.
        Instances of Algus are the JSON files. Set as a list for custom instances.
    
    */

    constructor(instanceParameters = {
        preciseSearch : false,
        printMethods : false,
        name : "",
        instanceList : instances
    }) {
        if (typeof instanceParameters.preciseSearch != "boolean" || typeof instanceParameters.printMethods != "boolean" || instanceParameters.instanceList.some(item => !instances.includes(item))) {
            throw new Error("Error while constructing Algus. Check your parameters.");
        }
        
        this.instancesList = instanceParameters.instanceList;
        this.name = instanceParameters.name;
                                                                                                                                                                                                                                                                   
        this.id = uuid();
        this.printMethods = instanceParameters.printMethods;
        this.preciseSearch = instanceParameters.preciseSearch;
        this.instances = [];

        this.printMethod = `Algus <@${this.id}> (${this.name})`;

        console.log((`Initialized Algus "${this.name}". ${
            this.printMethods ? '' : 'For more informations, please enable the printMethods parameter.'
        }`));
        if (this.printMethods) {
            console.log(`Initialized ${this.printMethod}\nPrecise search: ${this.preciseSearch}\nMethods printing: ${this.printMethods}\nCustom instances: ${this.instancesList.join(", ")}`);
        }
    }

    // c.f. ./instances/instance.js
    createInstance(instanceName) {
        if (!this.instancesList.includes(instanceName)) {
            throw new Error(`Error while creating an instance for ${this.printMethod}: instance is not registered in <@${this.id}>'s instances.`);
        }

        try {
            const existingInstance = this.getInstance(instanceName);
            let instance;
            if (existingInstance) {
                instance = existingInstance;
                if (this.printMethods) console.log((`Called ${instance.name} back`));
            } else {
                instance = new Instance(instanceName, this);
                this.instances.push(instance);
                if (this.printMethods) console.log((`Created ${instance.name}`));
            }

            if (this.printMethods) {
                console.log(instance.toString());
            }

            return instance;
        } catch (error) {
            console.log(`Unexpected error while creating Instance ${instanceName} for ${this.printMethod}`,error);
        }
    }



    // Self explanatory
    removeInstance(instance) {
        if (!this.instances.find((i) => i.name != instance.name)) {
            throw new Error(`Error while deleting ${this.printMethod}: Instance does not exists in ${this.printMethod}'s instances`)
        }

        const instanceIndex = this.instances.indexOf(this);
        this.instances.splice(instanceIndex,1);

        if (this.printMethods) {
            console.log(`Deleted ${instance.printMethod} (${instance.name}) of ${this.printMethod}`);
        }

        instance=null;
    }

    getInstance(instanceName) {
        return this.instances.find(instance => instance.name === instanceName);
    }


    getCalendarDates(date, callback) {
        let d = date;
        if (!this.preciseSearch) {
            if (date.length!==8) throw new Error("Error while getting calendar dates: date format is invalid (YYYY/MM/DD)")

            if (date.includes("/")) {
                d = d.replace(/\//g,"");
            }
        }

        const calendar_dates = this.createInstance("calendar_dates");
        const calendar = this.createInstance("calendar");
        calendar_dates.run((instance, c1) => {
            calendar.run((i2, c2) => {
                if (callback) {
                    c1.sort((a, b) => {
                        return Math.abs(parseInt(d) - parseInt(a.date)) - Math.abs(parseInt(d) - parseInt(b.date));
                    })
                    const closest = c1[0];
                    const period = c2.find((i) => i.service_id == closest.service_id);
                    callback({
                        calendar_dates : closest,
                        calendar : period
                    });
                }
            })
        })
    }


    getRoutes(callback) {
        let routes = this.getInstance("routes");
        if (!routes) {
            routes = this.createInstance("routes");
        }

        routes.run((instance, list) => {
            callback(list);
        })
    }

    getRoute(routeName, callback) {
        let name = routeName;
        if (!routeName) {
            throw new Error("Error while getting route: route name is not defined.");
        }

        if (typeof name === 'string' && routeName.length !== 3) name = name.toLowerCase();

        const routes = this.createInstance("routes");
        routes.run((instance,routesList) => {
            if (callback) {
                const route = routesList.find(r =>
                    r.route_short_name.toLowerCase() === name ||
                    r.route_long_name.toLowerCase() === name ||
                    (typeof name == 'number' && parseInt(r.route_id) === name)
                );
                callback(route);
            }
        })

    }

    
    getTrips(routeID, serviceID, callback) {
        const trips = this.createInstance("trips");
        trips.run((instance, tripsList) => {
            if (callback) {
                const trips = tripsList.filter((trip) => {
                    return trip.route_id == routeID && trip.service_id == serviceID;
                });
                callback(trips);
            }
        })
    }

    getShapes(shapeID, callback) {
        const shapes = this.createInstance("shapes");
        shapes.run((instance, shapesList) => {
            if (callback) {
                const shapesFiltered = shapesList.filter((s) => s.shape_id === shapeID);
                callback(shapesFiltered);
            }
        })
    }

    getStopsTimes(trips, callback) {
        const stopTimes = this.createInstance("stop_times");
        stopTimes.run((instance, stopTimesList) => {
            if (callback) {
                const stopTimesListFiltered = stopTimesList.filter((s) => {
                    return trips.some((t) => s.trip_id === t.trip_id);
                });
                callback(stopTimesListFiltered);
            }
        })
    }

    getStops(stopTimes, callback) {
        const stops = this.createInstance("stops");
        stops.run((instance, stopsList) => {
            if (callback) {
                const stopsListFiltered = stopsList.filter((s) => {
                    return stopTimes.some((t) => t.stop_id === s.stop_id);
                });
                callback(stopsListFiltered);
            }
        })
    }


    run(hints, callback) {
        /*

            hints is an object containing the most important information for Algus to properly find a line.

            hints = {
                name : (Route name),
                date : (Period date)
            }

        */

        if (!hints.name || !hints.date ) {
            throw new Error("Error while running Algus: missing important parameters. Please view documentation for usage.");
        }

        this.getCalendarDates(hints.date,(period) => {
            this.getRoute(hints.name,(route) => {
                this.getTrips(route.route_id, period.calendar.service_id, (trips) => {
                    if (hints.direction) trips = trips.filter((trip) => parseInt(trip.direction_id) === hints.direction);
                    if (hints.block_id) trips = trips.filter((trip) => {
                        const ID = parseInt(trip.block_id.substr(2,4));
                        return parseInt(ID) == hints.block_id
                    });

                    this.getShapes(trips[0].shape_id, (shapes) => {
                        this.getStopsTimes(trips, (stopTimes) => {
                            this.getStops(stopTimes, (stops) => {
                                callback( {
                                    period : period,
                                    route : route,
                                    trips : trips,
                                    shapes : shapes,
                                    stopTimes : stopTimes,
                                    stops : stops
                                })
                            })
                        })
                    })
                })
            })
        })
    }
}

