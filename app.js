const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { join } = require('path');
const { json } = require('express');
const PORT = process.env.PORT || 3000;

const app = express();

const clientPath = `${__dirname}/client`;
console.log(`Serving static files from path ${clientPath}`);

app.use(express.static(clientPath));
const server = http.createServer(app);
const io = socketio(server);

server.listen(PORT);
console.log("Server listening at " + PORT);

//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------
const { Player } = require('./player');
const { Item } = require('./item');
const { TeamObjects } = require('./TeamObjects');
const { AllMatrixes } = require('./maps');
const { Console } = require('console');
//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------


const getPlayerObject = playerId => {
    return Object.values(gridSystem).find(obj => obj.id === playerId);
}
const getPlayerObjectKey = playerId => {
    const findThis = Object.values(gridSystem).find(obj => obj.id === playerId);
    return Object.keys(gridSystem).find(key => gridSystem[key] === findThis);
}
const getLockIdFromPassword = password => {
    const findThis = Object.values(gridSystem.lockIds).find(obj => obj.password === password);
    return Object.keys(gridSystem.lockIds).find(key => gridSystem.lockIds[key] === findThis);

    // const findThisObject = Object.values(gridSystem.lockIds).find(obj => obj.password === data);
    //     const lockId = Object.keys(gridSystem.lockIds).find(key => gridSystem.lockIds[key] === findThisObject);
}

class GridSystem {
    constructor() {
        this.allMatrixes = new AllMatrixes();
        //this.allMatrixesBackup = JSON.parse(JSON.stringify(new AllMatrixes()));
        this.matrix = this.allMatrixes.area2;
        //this.startingSteps = 500;
        this.maxSteps = 150;
        this.keyCodes = {
            37: {x: -1, y: 0, blinkX: -2, blinkY: 0},
            39: {x: 1, y: 0, blinkX: 2, blinkY: 0},
            38: {x: 0, y: -1, blinkX: 0, blinkY: -2},
            40: {x: 0, y: 1, blinkX: 0, blinkY: 2}
        }
        this.keyCodesBlink = {
            37: {x: -2, y: 0},
            39: {x: 2, y: 0},
            38: {x: 0, y: -2},
            40: {x: 0, y: 2}
        }

        this.powerList = {
            1: {powerName: "invisibility", duration: 10000, offPowerName: "invisibilityOff", title: "Invisibility"},
            2: {powerName: "blink", title: "Blink"},
            3: {powerName: "stun", title: "EMP Bomb"},
        }
        this.mapDefaultPowers = {
            "area1": [this.powerList[3], this.powerList[2],this.powerList[2],this.powerList[2],this.powerList[2],this.powerList[2],this.powerList[1]],
            // "area2": [this.powerList[2], this.powerList[2],this.powerList[2],this.powerList[2],this.powerList[2],this.powerList[2],this.powerList[2],this.powerList[1],],
            // "area3": [this.powerList[2], this.powerList[2],this.powerList[2],this.powerList[2],this.powerList[2],this.powerList[2], this.powerList[1]],
        }

        this.teamObjects = new TeamObjects(this.powerList);


        this.startArea = "area1";
        this.defaultStartingPoints = {
            "area1": {"p1": {x:8,y:17}, "p2": {x:3,y:15}, "p3": {x:3,y:16}, "p4": {x:3,y:17}, "p5": {x:3,y:18}, "p6": {x:3,y:19}, "p7": {x:13,y:15}, "p8": {x:13,y:16}, "p9": {x:13,y:17}, "p10": {x:13,y:18}, "p11": {x:13,y:19},},
            // "area2": {"p1": {x:31,y:19}, "p2": {x:16,y:1}, "p3": {x:15,y:1}, "p4": {x:14,y:1}, "p5": {x:5,y:1}, "p6": {x:4,y:1}, "p7": {x:3,y:1}, "p8": {x:1,y:4}, "p9": {x:1,y:3}, "p10": {x:1,y:2}, "p11": {x:1,y:1},},
            // "area3": {"p1": {x:32,y:19}, "p2": {x:8,y:6}, "p3": {x:7,y:6}, "p4": {x:6,y:6}, "p5": {x:5,y:6}, "p6": {x:4,y:6}, "p7": {x:3,y:6}, "p8": {x:2,y:6}, "p9": {x:1,y:3}, "p10": {x:1,y:4}, "p11": {x:1,y:5},},
            // "area4": {"p1": {x:32,y:1}, "p2": {x:1,y:5}, "p3": {x:1,y:15}, "p4": {x:1,y:16}, "p5": {x:1,y:4}, "p6": {x:1,y:3}, "p7": {x:1,y:2}, "p8": {x:1,y:1}, "p9": {x:1,y:17}, "p10": {x:1,y:18}, "p11": {x:1,y:19},},
            // "area5": {"p1": {x:32,y:1}, "p2": {x:4,y:19}, "p3": {x:4,y:9}, "p4": {x:4,y:11}, "p5": {x:4,y:12}, "p6": {x:4,y:13}, "p7": {x:4,y:14}, "p8": {x:4,y:1}, "p9": {x:4,y:2}, "p10": {x:4,y:3}, "p11": {x:4,y:4},},
        };

        //this.extraArr = ["TCR", "LOK", "LK", "JHA", "JV", "CJH", "SZF", "JHA", "TJY", "KX"];
        //this.extraArr = ["TCR", "JX", "JZ", "TWN", "LJY", "ELI", "CUR", "LSH", "CT", "LK", "JV"];
        //this.extraArr = ["TCR", "CUR", "CT", "ELI", "JZ", "LJY", "TWN", "RYD", "JX", "LK", "JV"];
        // this.extraArr = ["TCR", "LOK", "JHA", "KN", "JT", "CJH", "CED", "KX", "TJY", "LSH", "SZF"];
        this.extraArr = ["TCR", "LOK", "JHA", "KN", "JT", "CJH", "CED", "KX", "TJY", "RYD", "SZF"];

        //this.p1 = { x: 1, y: 1, lable: 2, id: this.extraArr[0], steps: this.startingSteps, area: "mainArea", wallet: 0, total: 0, storeSteps: 1000 };
        // this.playersArr = [this.p1, this.p2, this.p3, this.p4, this.p5, this.p6, this.p7, this.p8, this.p9, this.p10];
        this.playersArr = [
            this.p1 = new Player({x: 1, y: 10, lable: 13, id: this.extraArr[0], area: "area1", color: "grey", startingSteps: 500, eagleEye: true}),

            this.p2 = new Player({x: 16, y: 8, lable: 3, id: this.extraArr[1], area: "area1", color: "springgreen"}),
            this.p3 = new Player({x: 16, y: 9, lable: 4, id: this.extraArr[2], area: "area1", color: "orange"}),
            this.p4 = new Player({x: 16, y: 11, lable: 5, id: this.extraArr[3], area: "area1", color: "lightblue"}),
            this.p5 = new Player({x: 16, y: 12, lable: 6, id: this.extraArr[4], area: "area1", color: "moccasin"}),
            this.p6 = new Player({x: 16, y: 13, lable: 7, id: this.extraArr[5], area: "area1", color: "deepskyblue"}),
            this.p7 = new Player({x: 17, y: 7, lable: 8, id: this.extraArr[6], area: "area1", color: "white"}),
            this.p8 = new Player({x: 17, y: 8, lable: 9, id: this.extraArr[7], area: "area1", color: "hotpink"}),
            this.p9 = new Player({x: 17, y: 9, lable: 10, id: this.extraArr[8], area: "area1", color: "teal"}),
            this.p10 = new Player({x: 17, y: 12, lable: 11, id: this.extraArr[9], area: "area1", color: "yellow"}),
            this.p11 = new Player({x: 17, y: 13, lable: 12, id: this.extraArr[10], area: "area1", color: "turquoise"})
        ];

        this.itemsArr = [
            this.item1 = new Item({itemLable: 1, itemId: "", color: "#4488FF", returnValue: false}),
            
            this.item2 = new Item({itemLable: 20, itemId: "🌀", returnValue: false}),
            this.item3 = new Item({itemLable: 21, itemId: "🌱"}),
            this.item4 = new Item({itemLable: 22, itemId: "🔩"}),
            this.item5 = new Item({itemLable: 23, itemId: "🔧"}),
            this.item6 = new Item({itemLable: 24, itemId: "🧬"}),
            this.item7 = new Item({itemLable: 25, itemId: "🧪"}),
            this.item8 = new Item({itemLable: 26, itemId: "🔋"}),
            this.item9 = new Item({itemLable: 27, itemId: "🌻"}),
            this.item10 = new Item({itemLable: 28, itemId: "📀"}),
            this.item11 = new Item({itemLable: 29, itemId: "⚙"}),
            this.item12 = new Item({itemLable: 30, itemId: "🔒", returnValue: false}),
            this.item13 = new Item({itemLable: 2, itemId: "", color: "transparent", returnValue: false}),
        ];

        

        this.playersArr.forEach((player) => {
            player.maxSteps = this.maxSteps;
            
            this.setStartingPointMultiLevel(player);

            // this.setStartingPowersMultiLevel(player);

            this.startingPoint(player);
        });
    }

    setStartingPowersMultiLevel (player) {
        player.obtainedPowers = [];
        if (this.mapDefaultPowers[this.startArea] === undefined) return;

        // const findThisObj = this.playersArr.find(obj => obj.id === player.id);
        // const playerKey = Object.keys(this).find(key => this[key] === findThisObj);

        this.mapDefaultPowers[this.startArea].forEach(power => {
            player.obtainedPowers.push(power);
        });

    }
    setStartingPowersByTeam (player) {
        player.obtainedPowers = [];
        if (this.teamObjects.defaultPowersByTeam[player.team] === undefined) return;

        this.teamObjects.defaultPowersByTeam[player.team].forEach(power => {
            player.obtainedPowers.push(power);
        });

    }
    setStartingPointMultiLevel (player) {
        if (this.defaultStartingPoints[this.startArea] === undefined) return;

        const findThisObj = this.playersArr.find(obj => obj.id === player.id);
        const playerKey = Object.keys(this).find(key => this[key] === findThisObj);

        const {x, y} = this.defaultStartingPoints[this.startArea][playerKey];
        //const values = [x, x, y, y];
        [player.x, player.originX, player.y, player.originY] = [x, x, y, y];

    }
    startingPoint(plyrSlot) {
        this.allMatrixes[plyrSlot.area].gridMatrix[plyrSlot.y][plyrSlot.x] = plyrSlot.lable;
    }

    isValidMove(plyrSlot, x, y) {
        this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;

        if (plyrSlot.stunned === true) return false;

        if(plyrSlot.y + y < 0) return false;
        if(plyrSlot.x + x < 0) return false;

        const cellVal = this.matrix[plyrSlot.y + y][plyrSlot.x + x];

        if (cellVal  === 0) return true;

        if(plyrSlot.team === "2") {
            this.isThereAPlayer(cellVal, plyrSlot);
        }
        
        return this.isThereAnItem(cellVal, plyrSlot);
        //return false;
    }
    isThereAnItem(cellVal, plyrSlot) {
        const getItemObject = this.itemsArr.find(object => object.itemLable === cellVal);
        if (getItemObject === undefined) return false;

        if(getItemObject.itemId === "🔒") io.emit('chat-to-clients', `${plyrSlot.id} touched a lock`);

        if(getItemObject.itemId === "🌀" && plyrSlot.team === "1") {
            io.emit('chat-to-clients', `${plyrSlot.id} objective complete!`);
            plyrSlot.canUseEagleEye = true;
            this.translocator(plyrSlot);
            return false;
        }

        if (getItemObject.returnValue === false) return false;
        if (plyrSlot.inventory.length >= plyrSlot.maxInventory) return false;

        plyrSlot.inventory += getItemObject.itemId 
        return getItemObject.returnValue;
    }
    isThereAPlayer(cellVal, plyrSlot) {
        const getAdjacentPlayerObject = this.playersArr.find(object => object.lable === cellVal);
        if (getAdjacentPlayerObject === undefined || getAdjacentPlayerObject.team != "1") return;

        io.emit('chat-to-clients', `${plyrSlot.id} captured ${getAdjacentPlayerObject.id}`);
        
        this.resetPosition(getAdjacentPlayerObject);
    }
    
    resetPosition(plyrSlot) {
        
        this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;
        
        this.matrix[plyrSlot.y][plyrSlot.x] = 0;

        this.updMatrixForPlayerAtThisSpot(plyrSlot)

        const index = this.teamObjects.team1Slots.indexOf(plyrSlot.id);
        const {x, y, area} = this.teamObjects.team1OriginPosition[index];
        [plyrSlot.x, plyrSlot.y, plyrSlot.area] = [x, y, area];

        this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;

        this.matrix[plyrSlot.y][plyrSlot.x] = plyrSlot.lable;
        
    }
    translocator(plyrSlot) {

        this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;
        
        this.matrix[plyrSlot.y][plyrSlot.x] = 0;
        
        this.matrix[2][17] = plyrSlot.lable;
        plyrSlot.x  = 17;
        plyrSlot.y = 2;
        
        this.updMatrixForPlayerAtThisSpot(plyrSlot)
    }

    updPosition(keyCode, plyrSlot, mode) {

        if (this.keyCodes[keyCode] === undefined) return;

        const modes = {
            "blink": this.keyCodesBlink[keyCode],
            "move": this.keyCodes[keyCode]
        }
        const value = modes[mode];
        
        this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;
        
        this.matrix[plyrSlot.y][plyrSlot.x] = 0;
        
        this.updMatrixForPlayerAtThisSpot(plyrSlot)
        
        this.matrix[plyrSlot.y + value.y][plyrSlot.x + value.x] = plyrSlot.lable;
        plyrSlot.x  = plyrSlot.x + value.x;
        plyrSlot.y = plyrSlot.y + value.y;
        
        this.enterDoorCheck(plyrSlot);
    }
    updMatrixForPlayerAtThisSpot(plyrSlot) {
        const plyrSlotCoords = `${plyrSlot.x},${plyrSlot.y}`;
        
        this.playersArr.forEach(player => {
            if(player.id === plyrSlot.id) return;

            const playerCoords = `${player.x},${player.y}`;
            if (playerCoords === plyrSlotCoords && player.area === plyrSlot.area) {
                this.matrix[plyrSlot.y][plyrSlot.x] = player.lable;
            }
        });
    }
    
    enterDoorCheck(plyrSlot) {
        this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;
        const areaObject = this.allMatrixes[plyrSlot.area].doors;
        const match = Object.values(areaObject).find(object => {
            return `${object.x},${object.y}` === `${plyrSlot.x},${plyrSlot.y}`;
        });

        // console.log({ match });
        if (match) {
            this.matrix[plyrSlot.y][plyrSlot.x] = 0;
            plyrSlot.area = match.toArea;
            plyrSlot.x = match.appearingCoords.x;
            plyrSlot.y = match.appearingCoords.y;
            this.matrix = this.allMatrixes[match.toArea].gridMatrix;
            this.matrix[match.appearingCoords.y][match.appearingCoords.x] = plyrSlot.lable;
        }
    }

    movePlayer(keyCode, plyrSlot) {

        if (plyrSlot.blinkActivate) {
            plyrSlot.blinkActivate = false;
            const blinkSuccess = this.isValidMove(plyrSlot, this.keyCodesBlink[keyCode].x, this.keyCodesBlink[keyCode].y)
            if (this.keyCodesBlink[keyCode] === undefined) return;
            if (blinkSuccess) {
                const mode = "blink";
                this.updPosition(keyCode, plyrSlot, mode);
                io.emit('chat-to-clients', `Blink success!`);
            } else if (!blinkSuccess) {io.emit('chat-to-clients', `Blink failed!`)}
            return;
        }
        
        if (this.keyCodes[keyCode] === undefined) return;
        if (this.isValidMove(plyrSlot, this.keyCodes[keyCode].x, this.keyCodes[keyCode].y)) {
            const mode = "move"
            this.updPosition(keyCode, plyrSlot, mode);
            plyrSlot.steps--;
            plyrSlot.invisibilityStepCheck();
        }
    }

    transitionToAnotherArea5(area, plyrSlot) {
        this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;

        this.matrix[plyrSlot.y][plyrSlot.x] = 0;

        //this.matrix = this.allAreas[area];
        this.matrix = this.allMatrixes[area].gridMatrix;
        
        plyrSlot.x = plyrSlot.originX;
        plyrSlot.y = plyrSlot.originY;
        this.matrix[plyrSlot.originY][plyrSlot.originX] = plyrSlot.lable;

    }
    goToLevel(level) {
        //if (activatedMatrixCounter === 5) {activatedMatrixCounter = 1;}
        if (level > 5) {return}
        const levelSequence = {1:"area1", 2:"area2", 3:"area3", 4:"area4", 5:"area5"};
        this.playersArr.forEach((player) => {

            this.startArea = levelSequence[level];
            this.setStartingPointMultiLevel(player);
            this.setStartingPowersMultiLevel(player);

            this.transitionToAnotherArea5(levelSequence[level], player);
            player.area = levelSequence[level];
            
            if(player.id != "TCR") {player.steps = 0};
        });

    }

    setPlayerTeam(plyrSlot, team) {

        if (team === "0") {
            this.clearPlayerTeam(plyrSlot);
            this.placePlayerAccordingToTeam(plyrSlot, 0);
            return;
        }
        
        const teamSettings = {
            "1": {teamSlot: "team1Slots", teamNum: 1, color: "white"},
            "2": {teamSlot: "team2Slots", teamNum: 2, color: "springgreen"},
        }
        if (teamSettings[team] === undefined) {return}
        plyrSlot.team = team;
        plyrSlot.color = teamSettings[team].color;
        //plyrSlot.obtainedPowers.push(this.powerList[1]);

        this.teamObjects[teamSettings[team].teamSlot].push(plyrSlot.id);
        this.placePlayerAccordingToTeam(plyrSlot, teamSettings[team].teamNum);
        this.setStartingPowersByTeam(plyrSlot);
        
    }
    clearPlayerTeam(plyrSlot) {
        plyrSlot.obtainedPowers = [];
        plyrSlot.team = "0";
        // const index = this.teamSlots1.indexOf(plyrSlot.id);

        this.teamObjects.allTeamSlots.forEach(teamSlots => {
            const index = teamSlots.indexOf(plyrSlot.id);
            if (index !== -1) {teamSlots.splice(index, 1)}
        });

    }
    placePlayerAccordingToTeam(plyrSlot, teamNum) {

        this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;
        this.matrix[plyrSlot.y][plyrSlot.x] = 0;
    
        if(teamNum === 0) {
            [plyrSlot.x, plyrSlot.y, plyrSlot.area] = [plyrSlot.originX, plyrSlot.originY, plyrSlot.originArea];

            this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;
            this.matrix[plyrSlot.y][plyrSlot.x] = plyrSlot.lable;
            return;
        }

        const teamSettings = {
            1: {teamSlot: "team1Slots", originPosition: "team1OriginPosition"},
            2: {teamSlot: "team2Slots", originPosition: "team2OriginPosition"},
        }

        const getSlotPosition = this.teamObjects[teamSettings[teamNum].teamSlot].indexOf(plyrSlot.id);

        const {x, y, area} = this.teamObjects[teamSettings[teamNum].originPosition][getSlotPosition];
        [plyrSlot.x, plyrSlot.y, plyrSlot.area] = [x, y, area];
        
        this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;
        this.matrix[plyrSlot.y][plyrSlot.x] = plyrSlot.lable;
        
        this.updMatrixForPlayerAtThisSpot(plyrSlot);
    }
    updMatrixForAllPlayersAgain() {
        
        this.playersArr.forEach(plyrSlot => {
            this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;
            this.matrix[plyrSlot.y][plyrSlot.x] = plyrSlot.lable;
        });
    }
    teamSwap() {
        this.teamObjects.swapTeams();

        this.teamObjects.team1Slots.forEach((playerId) => {
            const getPlayerObject = gridSystem.playersArr.find(object => object.id === playerId);
            getPlayerObject.obtainedPowers = [];
            getPlayerObject.canUseEagleEye = false;
            getPlayerObject.steps = 0;
            getPlayerObject.team = "1";
            getPlayerObject.color = "white";
            getPlayerObject.deactivateEagleEye();
            this.setStartingPowersByTeam(getPlayerObject);
            this.placePlayerAccordingToTeam(getPlayerObject, 1);
        });
        this.teamObjects.team2Slots.forEach((playerId) => {
            const getPlayerObject = gridSystem.playersArr.find(object => object.id === playerId);
            getPlayerObject.obtainedPowers = [];
            getPlayerObject.canUseEagleEye = false;
            getPlayerObject.steps = 0;
            getPlayerObject.team = "2";
            getPlayerObject.color = "springgreen";
            getPlayerObject.deactivateEagleEye();
            this.setStartingPowersByTeam(getPlayerObject);
            this.placePlayerAccordingToTeam(getPlayerObject, 2);
            
        });
        this.updMatrixForAllPlayersAgain();
        
        
        
    }

    resetMap() {
        this.allMatrixes = new AllMatrixes();
        // this.allMatrixes = JSON.parse(JSON.stringify(this.allMatrixesBackup));
         //this.duplicateMatrix(matrix);
         this.playersArr.forEach((player) => {
            player.x = player.originX;
            player.y = player.originY;
            player.area = player.originArea;
            player.inventory = "";  
            player.team = 0;
            this.startingPoint(player);
            player.obtainedPowers = [];
            this.teamSlots1 = [];
            this.teamSlots2 = [];
            player.steps = 0;
            this.setStartingPowersMultiLevel(player);
         });
         this.emitToUsers('sendMatrix');
    }
    emitToUsers(eventName) {
        const allMatrixes = this.allMatrixes;
        const playersArr = this.playersArr;
        const extraArr = this.extraArr;
        const itemsArr = this.itemsArr;

        io.emit(eventName, { allMatrixes, playersArr, extraArr, itemsArr  });
    }
}

//##############################################################################################################
const gridSystem = new GridSystem();

io.sockets.on('connection', function (sock) {

    sock.on('newuser', (data) => {

        sock.id = data; //"TCR"
        io.emit('chat-to-clients', data + " connected");
        gridSystem.emitToUsers('loadMatrix');
        //sock.emit('loadMatrix', { allMatrixes, playersArr, extraArr });

        const gridSysKey = getPlayerObjectKey(sock.id);
        sock.on('keyPress', function (data) {
            if (gridSystem[gridSysKey].steps <= 0) { return }
            gridSystem.movePlayer(data, gridSystem[gridSysKey]);
            gridSystem.emitToUsers('sendMatrix');
        });
    });

    sock.on('disconnect', () => {
        io.emit('chat-to-clients', sock.id + " disconnected");
    });

    sock.on('chat-to-server', (data) => {
        io.emit('chat-to-clients', data);
    });
    sock.on('clearChatObject', data => {
        const getPlayerObject = gridSystem.playersArr.find(object => object.id === data);
        
        const { id } = getPlayerObject;
        io.emit('clearChatObject', id);

    });
    sock.on('createChatObject', data => {
        const getPlayerObject = gridSystem.playersArr.find(object => object.id === data.nickname);
        const message = data.message2;
        
        const { x, y, area, id } = getPlayerObject;
        const matrixHeight = gridSystem.allMatrixes[area].gridMatrix.length;
        const matrixLength = gridSystem.allMatrixes[area].gridMatrix[0].length;
        io.emit('createChatObject', { x, y, message, id, matrixHeight, matrixLength });
        
    });
    sock.on('displayMission', data => {
        //const message = "Mission: This is a test mission, testing mission display.............";
        const getNum = data;
        io.emit('missionObject', getNum);
    });
    sock.on('onScreen', data => {
        io.emit('onScreen', data);
    });

    sock.on('useItem', (data) => {
        
        const emoji = (data.getNum - 1) * 2;
        const playerId = data.studentId;
        const gridSysPlyrKey = getPlayerObjectKey(playerId);
        const itemLength = gridSystem[gridSysPlyrKey].inventory.length
        if (emoji + 1 > itemLength || itemLength === 0) {
            io.emit('chat-to-clients', `Wrong item slot selection`);
            return
        }
        const remainingItem = gridSystem[gridSysPlyrKey].inventory.slice(0, emoji) + gridSystem[gridSysPlyrKey].inventory.slice(emoji+2, itemLength)
        gridSystem[gridSysPlyrKey].inventory = remainingItem;
        io.emit('chat-to-clients', `${playerId}'s item ${data.getNum} used`);
        gridSystem.emitToUsers('sendMatrix');

    });
    sock.on('restartLevel', () => {

        gridSystem.resetMap();

        gridSystem.emitToUsers('sendMatrix');
        
    });
    sock.on('refreshCanvas', () => {
        gridSystem.emitToUsers('sendMatrix');
    });

    sock.on('goToLevel', (data) => {
        
        gridSystem.goToLevel(data);

        gridSystem.emitToUsers('sendMatrix');
        
    });

    sock.on('addStepsAll', (data) => {
        
        gridSystem.playersArr.forEach((player) => {
            var convertToNum = Number(data);
                
            var message2 = player.id + " added " + convertToNum + " steps succesful!"
            player.steps += convertToNum;
            io.emit('chat-to-clients', message2);
                

            gridSystem.emitToUsers('sendMatrix');
        });
    });

    sock.on('moveAwardedStepsToActualSteps', () => {
        gridSystem.playersArr.forEach((player) => {
            player.steps = player.stepsAwardedBeforeGameStarts;
        });
        gridSystem.emitToUsers('sendMatrix');
    });

    sock.on('setSignTime', data => {
        const getPlayerObject = gridSystem.playersArr.find(object => object.id === data.nickname);
        const { signBoards } = gridSystem.allMatrixes[getPlayerObject.area];
        signBoards[data.num1].sign = `${data.num2} seconds`;
        gridSystem.emitToUsers('sendMatrix');
        //io.emit('setSign', data);
    });

    sock.on('setPlayerTeam', data => {
        const getPlayerObject = gridSystem.playersArr.find(object => object.id === data.studentId);
        gridSystem.setPlayerTeam(getPlayerObject, data.getNum);
        gridSystem.emitToUsers('sendMatrix');
    });

    sock.on('addAwardedSteps', data => {
        const getPlayerObject = gridSystem.playersArr.find(object => object.id === data.studentId);
        getPlayerObject.stepsAwardedBeforeGameStarts += parseInt(data.getNum);
        const message2 = data.studentId + " awarded " + data.getNum + " steps succesful!"
        io.emit('chat-to-clients', message2);
    });

    sock.on('penalties', data => {
        if (gridSystem.teamObjects.penalties[data.getNum] === undefined) return;

        const getPlayerObject = gridSystem.playersArr.find(object => object.id === data.studentId);

        getPlayerObject[gridSystem.teamObjects.penalties[data.getNum]]();
        const message2 = `Penalty ${data.studentId} code:${data.getNum}, steps:${getPlayerObject.stepsAwardedBeforeGameStarts} pwrs:${getPlayerObject.obtainedPowers.length}`;
        io.emit('chat-to-clients', message2);

    });


    sock.on('swapTeams', () => {
        gridSystem.teamSwap();
        gridSystem.emitToUsers('sendMatrix');
        //console.log("swap activated")
    });

    sock.on('usePower', data => {
        const playerObjectKey = getPlayerObjectKey(data.playerId);
        const selectedPower = parseInt(data.extractNum) - 1

        
        if(gridSystem[playerObjectKey].obtainedPowers[selectedPower] === undefined) return;

        const displayPowerTitle = gridSystem[playerObjectKey].obtainedPowers[selectedPower].title;
        io.emit('chat-to-clients', `${data.playerId} activated ${displayPowerTitle}`);

        if (gridSystem[playerObjectKey].obtainedPowers[selectedPower].powerName === "blink") {
            gridSystem[playerObjectKey].blinkActivate = true;
            gridSystem[playerObjectKey].obtainedPowers.splice(selectedPower, 1);
            return;
        }

        
        if(gridSystem[playerObjectKey].canUsePower === false) return;

        if (gridSystem[playerObjectKey].obtainedPowers[selectedPower].powerName === "stun") {
            
            gridSystem[playerObjectKey].obtainedPowers.splice(selectedPower, 1);

            //gridSystem.p9.gotStunned();
            gridSystem.playersArr.forEach(player => {
                if (gridSystem[playerObjectKey].id != player.id && gridSystem[playerObjectKey].area === player.area) {
                    const bombRange = 8;
                    const rightRange = gridSystem[playerObjectKey].x + bombRange;
                    const leftRange = gridSystem[playerObjectKey].x - bombRange;
                    const upRange = gridSystem[playerObjectKey].y - bombRange;
                    const downRange = gridSystem[playerObjectKey].y + bombRange;

                    if (player.x > leftRange && player.x < rightRange && player.y > upRange && player.y < downRange ) {
                        player.gotStunned();
                        gridSystem.emitToUsers('sendMatrix');
                        //console.log(`${player.id}: x:${player.x}, y:${player.y}, area:${player.area}`)
                    }
                }
                
            });
            setTimeout(() => {
                gridSystem.emitToUsers('sendMatrix');
            }, 6000);

            return;
        }


        const word = gridSystem[playerObjectKey].obtainedPowers[selectedPower].powerName;
        const wordOff = gridSystem[playerObjectKey].obtainedPowers[selectedPower].offPowerName;
        const duration = gridSystem[playerObjectKey].obtainedPowers[selectedPower].duration;
        
        //gridSystem[playerObjectKey].callPower(selectedPower);
        gridSystem[playerObjectKey][word]();
        //gridSystem[playerObjectKey].invisibilityOff();
        //console.log(gridSystem[playerObjectKey].obtainedPowers);
        gridSystem.emitToUsers('sendMatrix');

        if (gridSystem[playerObjectKey][wordOff] === undefined) return;
        gridSystem[playerObjectKey][wordOff](selectedPower);

        setTimeout(() => {
            gridSystem.emitToUsers('sendMatrix');
        }, duration + 1000);

    });

    sock.on('grantPower', data => {

        const playerObjectKey = getPlayerObjectKey(data.studentId);
        const powerListKey = parseInt(data.getNum);

        if (gridSystem[playerObjectKey] === undefined) return;
        if(gridSystem.powerList[powerListKey] === undefined) return;
        gridSystem[playerObjectKey].obtainedPowers.push(gridSystem.powerList[powerListKey]);

        const message2 = data.studentId + " awarded power " + data.getNum + " succesful!"
        io.emit('chat-to-clients', message2);

        //io.emit('updatePowerArray', gridSystem.playersArr);

    });

    sock.on('pushPowerArray', data => {
        const getPlayerObject = gridSystem.playersArr.find(object => object.id === data);
        const obtainedPowers = getPlayerObject.obtainedPowers;
        const getTeam = getPlayerObject.team;
        const getAwardedSteps = getPlayerObject.stepsAwardedBeforeGameStarts;
        const studentId = data; 
        sock.emit('updatePowerArray', { obtainedPowers, getTeam, getAwardedSteps });
    });

    sock.on('eagleEye', data => {
        const getPlayerObject = gridSystem.playersArr.find(object => object.id === data.playerId);
        getPlayerObject.activateEagleEye(data.extractNum);
        gridSystem.emitToUsers('sendMatrix');
    });

    sock.on('deactivateEagleEye', data => {
        const getPlayerObject = gridSystem.playersArr.find(object => object.id === data.playerId);
        getPlayerObject.deactivateEagleEye();
        gridSystem.emitToUsers('sendMatrix');
    });



});
