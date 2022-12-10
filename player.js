class Player {
    constructor(config) {
        
        this.id = config.id || "GS";
        this.isTurnActive = false;
        this.deployChance = config.deployChance || 1;
        this.isLeader = false;

        this.team = config.team || null;

        this.teams = {
            "1": "Red",
            "2": "Blue",
            "0": null
        }
    
    }

    setPlayerTeam(teamNum) {
        if (this.teams[teamNum] === undefined) return;

        this.team = this.teams[teamNum];
    }

    setLeader() {
        this.isLeader = true;
        this.deployChance = 50;
    }

    

}

module.exports = {
    Player,
}