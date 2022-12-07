class Player {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.lable = config.lable;
        this.id = config.id || "GS";
        this.startingSteps = config.startingSteps || 0;
        this.stepsAwardedBeforeGameStarts = 300;
        //this.maxSteps = config.maxSteps || 500;
        this.steps = config.steps || this.startingSteps;
        this.area = config.area || "area1";
        this.areaBeforeAcitivateEagleEye = "";
        this.color = config.color || "grey";

        this.invisibleColor = "#222";
        this.invisibilitySteps = 0;
        this.invisibilityStepsDefault = 20;

        this.blinkActivate = false;

        this.stunned = false;

        this.originColor = this.color;
        this.originX = config.x;
        this.originY = config.y;
        this.originArea = config.area;
        this.inventory = "";
        this.maxInventory = 10;
        
        this.team = 0;

        this.canUsePower = true;
        this.invisible = typeof config.invisible === "undefined" ? false : config.invisible;
        this.canUseEagleEye = typeof config.eagleEye === "undefined" ? false : config.eagleEye;
        this.isEagleEyeActivated = false;

        //this.obtainedPowers = [{id: 1, power: this.invisibility}];
        //this.obtainedPowers = [{id: 1, powerName: "invisibility", duration: 10000, offPowerName: "invisibilityOff"}];
        this.obtainedPowers = [];

        
    
    }

    // callPower(num) {
    //     if(this.obtainedPowers[num] === undefined) return;
    //     this.power = this.obtainedPowers[num].power;
    //     this.obtainedPowers.splice(num, 1);
    //     //console.log(this.obtainedPowers)
        
    //     this.power();
    // }
    
    invisibility() {
        
        this.canUsePower = false;
        this.invisible = true;
        this.invisibilitySteps = this.invisibilityStepsDefault;
        
    }
    invisibilityOff(num) {
        setTimeout(() => {
            this.invisible = false;
            this.canUsePower = true;
        }, this.obtainedPowers[num].duration);

        
        this.obtainedPowers.splice(num, 1); 
        
    }
    invisibilityStepCheck() {
        if (this.invisibilitySteps === 0) return;
        if (this.invisible === false) return;
        this.invisibilitySteps--;
        if (this.invisibilitySteps === 0) {
            this.invisible = false;
            this.canUsePower = true;
        }
    }

    gotStunned () {
        if (this.id === "TCR") return
        this.stunned = true;
        this.canUsePower = false;
        setTimeout(() => {
            this.stunned = false;
            this.canUsePower = true;
        }, 5000);
    }

    activateBlink () {
        this.blinkActivate = true;
    }
    deactivateBlink() {
        this.blinkActivate = false;
    }

    activateEagleEye(mapNum) {
        const maps = {
            "1": "area1", "2": "area2", "3": "area3", "4": "area4", "5": "area5",
        }
        
        if (this.isEagleEyeActivated) return;
        if (!this.canUsePower) return;
        if (!this.canUseEagleEye) return;
        if (maps[mapNum] === undefined) return;
        if (this.area === maps[mapNum]) return;
        this.canUsePower = false;

        this.isEagleEyeActivated = true;

        this.stunned = true;
        this.areaBeforeAcitivateEagleEye = this.area;
        this.area = "area2";
        this.area = maps[mapNum];
    }

    deactivateEagleEye() {

        if(!this.isEagleEyeActivated) return;
        this.isEagleEyeActivated = false;
        this.canUsePower = true;
        this.stunned = false;
        this.area = this.areaBeforeAcitivateEagleEye;

    }

    reduceTheLastPower() {
        this.obtainedPowers.pop();
    }

    reduceAwardedSteps25() {
        this.stepsAwardedBeforeGameStarts -= 25;
    }
    reduceAwardedSteps50() {
        this.stepsAwardedBeforeGameStarts -= 50;
    }

}

module.exports = {
    Player,
}