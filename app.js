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
        //this.studentIdArr = ["TCR", "JX", "JZ", "TWN", "LJY", "ELI", "CUR", "LSH", "CT", "LK", "JV"];
        //this.extraArr = ["TCR", "CUR", "CT", "ELI", "JZ", "LJY", "TWN", "RYD", "JX", "LK", "JV"];
        // this.extraArr = ["TCR", "LOK", "JHA", "KN", "JT", "CJH", "CED", "KX", "TJY", "LSH", "SZF"];
        this.studentIdArr = ["TCR", "LOK", "JHA", "KN", "JT", "CJH", "CED", "KX", "TJY", "RYD", "SZF"];

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
            "red": [20, 21],
            "blue": [5, 6],
        }
        this.allMisses = {
            "red": [],
            "blue": [],
        }
        this.allHits = {
            "red": [],
            "blue": [],
        }
        this.resultPending = false;

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
        if (!mainSystem.studentIdArr.includes(data)) return;
        mainSystem.connectedUsers.push(data);

        io.emit('pushStudentsArr', mainSystem);
        if (mainSystem.secretMode) {
            io.emit('secretModeAtClient', mainSystem);
        }

        const playerObj = mainSystem.getPlayerObject(data);
        if (mainSystem.whosTurn === playerObj.id) {
            io.emit('setWhosTurnAtClient', playerObj);
        }

        io.emit('updateMapIfRefreshed', mainSystem);
        
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

    
    sock.on('swapTeams', () => {
        gridSystem.teamSwap();
        gridSystem.emitToUsers('sendMatrix');
        //console.log("swap activated")
    });


    sock.on('clickedGrid', data => {
        mainSystem.cellLastClicked = data;
        io.emit('emitToAllUsersTheClickedCell', data);
    });

    sock.on('setWhosTurn', data => {
        if (mainSystem.resultPending) {
            io.emit('chat-to-clients', `Failed - Map not updated!`);
            return;
        }
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

        if (mainSystem.shipsLocations[targetMap] === undefined) return;

        if (mainSystem.shipsLocations[targetMap].includes(targetCoord)) {
            mainSystem.allHits[targetMap].push(targetCoord);
            

        } else {
            mainSystem.allMisses[targetMap].push(targetCoord);
            
        }
        
        io.emit('updateTargetMapAtClient', { targetCoord, targetMap, shipsLocations });
        mainSystem.shipsLocations[targetMap] = mainSystem.shipsLocations[targetMap].filter(coord => {
            return coord !== targetCoord;
        });

        

        mainSystem.resultPending = false;

    });

    sock.on('launch', () => {
        sock.emit('pushLocationsToTCR', mainSystem.shipsLocations);
        mainSystem.resultPending = true;
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
