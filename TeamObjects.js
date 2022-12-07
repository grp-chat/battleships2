class TeamObjects {
    constructor(config) {

        this.team1Slots = [];
        this.team2Slots = [];
        this.allTeamSlots = [this.team1Slots, this.team2Slots];

        this.swapBuffer = [];

        this.team1OriginPosition = [
            {x:23, y:19, area: "area1"},
            {x:24, y:19, area: "area1"},
            {x:25, y:19, area: "area1"},
            {x:26, y:19, area: "area1"},
            {x:27, y:19, area: "area1"},
            {x:28, y:19, area: "area1"},
        ];
        this.team2OriginPosition = [
            {x:5, y:2, area: "area1"},
            {x:6, y:2, area: "area1"},
            {x:7, y:2, area: "area1"},
            {x:8, y:2, area: "area1"},
            {x:9, y:2, area: "area1"},
            {x:10, y:2, area: "area1"},
        ];

        this.powerList = config;

        this.defaultPowersByTeam = {
            "1": [this.powerList[3], this.powerList[2],this.powerList[2],this.powerList[2],this.powerList[2],this.powerList[1],this.powerList[1]],
            "2": [this.powerList[2], this.powerList[2],this.powerList[2],this.powerList[2],this.powerList[2],this.powerList[2]],
            "0": [],
        }

        this.penalties = {
            // "1": {stepsAwardedBeforeGameStarts: -25},
            // "2": {stepsAwardedBeforeGameStarts: -50},
            //"3": {spliceObj(playerObj, lastPower) {playerObj.obtainedPowers.splice(lastPower, 1);}},
            "1": "reduceAwardedSteps25",
            "2": "reduceAwardedSteps50",
            "3": "reduceTheLastPower",
        }

    }

    swapTeams() {
        this.swapBuffer = this.team1Slots;
        this.team1Slots = this.team2Slots;
        this.team2Slots = this.swapBuffer;
    }
}


module.exports = {
    TeamObjects,
}