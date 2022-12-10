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

class MainSystem {
    constructor() {
        //this.extraArr = ["TCR", "LOK", "LK", "JHA", "JV", "CJH", "SZF", "JHA", "TJY", "KX"];
        this.studentIdArr = ["TCR", "JX", "JZ", "TWN", "LJY", "ELI", "CUR", "LSH", "CT", "LK", "JV"];
        //this.extraArr = ["TCR", "CUR", "CT", "ELI", "JZ", "LJY", "TWN", "RYD", "JX", "LK", "JV"];
        // this.extraArr = ["TCR", "LOK", "JHA", "KN", "JT", "CJH", "CED", "KX", "TJY", "LSH", "SZF"];
        //this.studentIdArr = ["TCR", "LOK", "JHA", "KN", "JT", "CJH", "CED", "KX", "TJY", "RYD", "SZF"];

        this.playersArr = [
            this.p1 = new Player({ id: this.studentIdArr[0], deployChance:100 }),

            this.p2 = new Player({ id: this.studentIdArr[1], }),
            this.p3 = new Player({ id: this.studentIdArr[2], }),
            this.p4 = new Player({ id: this.studentIdArr[3], }),
            this.p5 = new Player({ id: this.studentIdArr[4], }),
            this.p6 = new Player({ id: this.studentIdArr[5], }),
            this.p7 = new Player({ id: this.studentIdArr[6], }),
            this.p8 = new Player({ id: this.studentIdArr[7], }),
            this.p9 = new Player({ id: this.studentIdArr[8], }),
            this.p10 = new Player({ id: this.studentIdArr[9], }),
            this.p11 = new Player({ id: this.studentIdArr[10], })
        ];

        this.connectedUsers = [];

        this.whosTurn = "";

        this.teamSlots = {
            "Red": [],
            "Blue": []
        };

        this.shipsQty = {
            "Red": 5,
            "Blue": 5
        }

        this.shipsLocations = {
            "red": [20],
            "blue": [5],
        }

        this.cellLastClicked = null;

        this.secretMode = false;

        
    }

    getPlayerObject(playerId) {
        return Object.values(this.playersArr).find(obj => obj.id === playerId);
    }
}

const mainSystem = new MainSystem;
//console.log(mainSystem.getPlayerObject("LOK"));
// console.log(mainSystem.playersArr[1].deployChance);



//##############################################################################################################


io.sockets.on('connection', function (sock) {

    sock.on('newuser', (data) => {

        sock.id = data; //"TCR"
        io.emit('chat-to-clients', data + " connected");
        mainSystem.connectedUsers.push(data);

        io.emit('pushStudentsArr', mainSystem);
        if (mainSystem.secretMode) {
            io.emit('secretModeAtClient', mainSystem);
        }

        const playerObj = mainSystem.getPlayerObject(data);
        if (mainSystem.whosTurn === playerObj.id) {
            io.emit('setWhosTurnAtClient', playerObj);
        }
        
        io.emit('emitToAllUsersTheClickedCell', mainSystem.cellLastClicked);

        // gridSystem.emitToUsers('loadMatrix');
        // const gridSysKey = getPlayerObjectKey(sock.id);

        // sock.on('keyPress', function (data) {
        //     if (gridSystem[gridSysKey].steps <= 0) { return }
        //     gridSystem.movePlayer(data, gridSystem[gridSysKey]);
        //     gridSystem.emitToUsers('sendMatrix');
        // });
    });

    sock.on('disconnect', () => {
        io.emit('chat-to-clients', sock.id + " disconnected");

        mainSystem.connectedUsers = mainSystem.connectedUsers.filter(id => {
            return id !== sock.id;
        });

        io.emit('pushStudentsArr', mainSystem);

    });

    sock.on('chat-to-server', (data) => {
        io.emit('chat-to-clients', data);
    });
    sock.on('clearChatObject', data => {
        const getPlayerObject = gridSystem.playersArr.find(object => object.id === data);
        
        const { id } = getPlayerObject;
        io.emit('clearChatObject', id);

    });
    // sock.on('createChatObject', data => {
    //     const getPlayerObject = gridSystem.playersArr.find(object => object.id === data.nickname);
    //     const message = data.message2;
        
    //     const { x, y, area, id } = getPlayerObject;
    //     const matrixHeight = gridSystem.allMatrixes[area].gridMatrix.length;
    //     const matrixLength = gridSystem.allMatrixes[area].gridMatrix[0].length;
    //     io.emit('createChatObject', { x, y, message, id, matrixHeight, matrixLength });
        
    // });
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
        const playerObj = mainSystem.getPlayerObject(data.studentId);
        if (data.getNum === "0") {
            mainSystem.teamSlots[playerObj.team] = mainSystem.teamSlots[playerObj.team].filter(id => {
                return id !== data.studentId;
            });
            io.emit('pushStudentsArr', mainSystem);
            playerObj.setPlayerTeam(data.getNum);
            
            return;
        }
        if (playerObj.team !== null) {return;}
        playerObj.setPlayerTeam(data.getNum);
        mainSystem.teamSlots[playerObj.team].push(playerObj.id);
        io.emit('pushStudentsArr', mainSystem);

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

    //-----------------------------------------------------------------------------------------------------

    sock.on('clickedGrid', data => {
        mainSystem.cellLastClicked = data;
        io.emit('emitToAllUsersTheClickedCell', data);
    });

    sock.on('setWhosTurn', data => {
        const playerObj = mainSystem.getPlayerObject(data);
        mainSystem.whosTurn = playerObj.id;
        io.emit('setWhosTurnAtClient', playerObj);
    });

    sock.on('secretMode', () => {
        mainSystem.secretMode = true;
        io.emit('secretModeAtClient', mainSystem);
    });

    sock.on('offSecretMode', () => {
        mainSystem.secretMode = false;
        io.emit('offSecretModeAtClient', mainSystem);
    });

    sock.on('deployShip', data => {
        if (!mainSystem.secretMode) return;
        if (data.deployShipCoords === 0) return;
        if (data.deployShipMap === null) return;

        const playerObj = mainSystem.getPlayerObject(data.nickname);
        if (playerObj.deployChance === 0) {
            io.emit('chat-to-clients', `${data.nickname} deploy limit reached`);
            return;
        }
        
        if (mainSystem.shipsLocations[data.deployShipMap].includes(data.deployShipCoords)) {
            io.emit('chat-to-clients', `${data.nickname} - Deploy invalid`);
            return;
        }
        if (mainSystem.shipsLocations[data.deployShipMap].length >= 5) {
            io.emit('chat-to-clients', `${data.nickname} - No more ships to deploy`);
            return;
        }
        //console.log("Deploy ok with data: " + data.deployShipCoords + " and " + data.deployShipMap);
        mainSystem.shipsLocations[data.deployShipMap].push(data.deployShipCoords);
        playerObj.deployChance--;
        //console.log(mainSystem.shipsLocations);
        io.emit('chat-to-clients', `Deploy success!`);
        io.emit('updateDeployMap', mainSystem);
    });

    sock.on('unDeployShip', data => {
        if (!mainSystem.secretMode) return;
        if (data.deployShipCoords === 0) return;
        if (data.deployShipMap === null) return;
        if (data.nickname !== "TCR") return;
        const { deployShipCoords, deployShipMap } = data;

        mainSystem.shipsLocations[data.deployShipMap] = mainSystem.shipsLocations[data.deployShipMap].filter(coord => {
            return coord !== data.deployShipCoords;
        });
        io.emit('chat-to-clients', `Un-Deploy success!`);
        io.emit('removeShipFromDeployMap', { mainSystem, deployShipMap, deployShipCoords });
        console.log("Undeployment detected:");
        console.log(mainSystem.shipsLocations);

    });

    sock.on('updateTargetMap', data => {
        const {targetCoord, targetMap} = data;
        const shipsLocations = mainSystem.shipsLocations;
        
        io.emit('updateTargetMapAtClient', { targetCoord, targetMap, shipsLocations });
        mainSystem.shipsLocations[targetMap] = mainSystem.shipsLocations[targetMap].filter(coord => {
            return coord !== targetCoord;
        });

    });

    sock.on('launch', () => {
        sock.emit('pushLocationsToTCR', mainSystem.shipsLocations);
    });

    sock.on('swapTCR', () => {
        const playerObj = mainSystem.getPlayerObject("TCR");
        
        if (playerObj.team === "Red") {
            playerObj.team = "Blue";
            mainSystem.teamSlots["Red"] = mainSystem.teamSlots["Red"].filter(id => {
                return id !== "TCR";
            });
            mainSystem.teamSlots["Blue"].push("TCR");
        } else if (playerObj.team === "Blue") {
            playerObj.team = "Red";
            mainSystem.teamSlots["Blue"] = mainSystem.teamSlots["Blue"].filter(id => {
                return id !== "TCR";
            });
            mainSystem.teamSlots["Red"].push("TCR");
        }
        console.log(playerObj);
        console.log(mainSystem.teamSlots);
        io.emit('pushStudentsArr', mainSystem);
        sock.emit('swapTCRMap', mainSystem.playersArr);
    });

    sock.on('callLocations', () => {
        console.log("Locations:");
        console.log(mainSystem.shipsLocations);
    });

    sock.on('addChance', data => {
        const playerObj = mainSystem.getPlayerObject(data.studentId);
        playerObj.deployChance += parseInt(data.getNum);
    });

    sock.on('revealAll', () => {
        io.emit('revealAllAtClient', mainSystem.shipsLocations);
    });



});
