class fixedCommand {
    constructor(prefix, sockEmitFlag) {
        this.prefix = prefix;
        this.sockEmitFlag = sockEmitFlag;
    }

    executeCommand(message) {
        //var extractNickname = message.slice(4).replace(/[^A-Z]+/g, "");
        if (nickname != "TCR") { return }
        if (message.slice(0, this.prefix.length) != this.prefix) { return }

        sock.emit(this.sockEmitFlag);

        if (this.sockEmitFlag === 'mindControlOff') {
            sock.emit('chat-to-server', "Mind control mode deactivated");
        }

        //let text = "[" + connectedArr.toString() + "]";
        //sock.emit('chat-to-server', numberOfPlayers);

        if (this.prefix === "TCR: reset server") {
            if (nickname != "TCR") {
                window.location.reload();
            } else {
                sock.emit('resetserverval');
            }
        }


    }
}
class messageCommand {
    constructor(prefix, sockEmitFlag) {
        this.prefix = prefix;
        this.sockEmitFlag = sockEmitFlag;
    }

    executeCommand(message) {
        if (nickname != "TCR") { return }
        if (message.slice(0, this.prefix.length) != this.prefix) { return }

        const slicedMessage = message.slice(this.prefix.length);
        sock.emit(this.sockEmitFlag, slicedMessage);
    }
}
class localFixedCommand {
    constructor(prefix, localFunc) {
        this.prefix = prefix;
        //this.localFunc = localFunc;
    }

    executeCommand(message) {
        if (nickname != "TCR") { return }
        if (message.slice(0, this.prefix.length) != this.prefix) { return }
        loadListToModal();
        openModal();
        //this.localFunc();
    }
}
class localFreeCommand {
    constructor (prefix, localFunc) {
        this.prefix = prefix; 
        this.localFunc = localFunc;
    }

    executeCommand(message) {
        if (message.slice(0, this.prefix.length) != this.prefix) {return}
        //legendModal();
        //openModal();
        
        if (this.prefix === `${nickname}: info`) {
            //loadObtainedPowersToModal();
            requestPowerArray();
        } else if (this.prefix === `${nickname}: map`) {
            loadMiniMapToModal();
        }
        this.localFunc();
    }
}

class forceClientRefreshCommand {
    constructor(prefix, sockEmitFlag) {
        this.prefix = prefix;
        this.sockEmitFlag = sockEmitFlag;
    }

    executeCommand(message) {
        //var extractNickname = message.slice(4).replace(/[^A-Z]+/g, "");
        //if (nickname != "TCR") {return}
        if (message.slice(0, this.prefix.length) != this.prefix) { return }
        //if (studentsArr.includes(extractNickname) === false) {return}

        sock.emit(this.sockEmitFlag);

        if (this.prefix === "TCR: reset server") {
            if (nickname != "TCR") {
                window.location.reload();
            } else {
                sock.emit('resetserverval');
            }
        }


    }
}
class idCommand {
    constructor(prefix, sockEmitFlag) {
        this.prefix = prefix;
        this.sockEmitFlag = sockEmitFlag;
    }

    executeCommand(message) {
        var extractNickname = message.slice(4).replace(/[^A-Z]+/g, "");
        if (nickname != "TCR") { return }
        if (message.slice(0, this.prefix.length) != this.prefix) { return }
        if (studentsArr.includes(extractNickname) === false) { return }

        sock.emit(this.sockEmitFlag, extractNickname);

        if (this.sockEmitFlag === 'mindControl') {
            sock.emit('chat-to-server', "Mind control mode active = " + extractNickname);
        }

    }
}

class freeNumCommand {
    constructor(prefix, sockEmitFlag) {
        this.prefix = prefix;
        this.sockEmitFlag = sockEmitFlag;
    }

    executeCommand(message) {
        //var extractCaps = message.slice(5).replace(/[^A-Z]+/g, "");
        var extractNum = message.replace(/\D/g, '');
        if (message.slice(0, this.prefix.length) != this.prefix) { return }
        const playerId = nickname

        sock.emit(this.sockEmitFlag, { extractNum, playerId });

    }
}

class numCommand {
    constructor(prefix, sockEmitFlag) {
        this.prefix = prefix;
        this.sockEmitFlag = sockEmitFlag;
    }

    executeCommand(message) {
        const extractedNum = message.replace(/\D/g, '');
        if (nickname != "TCR") { return }
        if (message.slice(0, this.prefix.length) != this.prefix) { return }

        const getNum = extractedNum;
        sock.emit(this.sockEmitFlag, getNum);
    }
}
class multiNumCommand {
    constructor(prefix, sockEmitFlag) {
        this.prefix = prefix;
        this.sockEmitFlag = sockEmitFlag;
    }

    executeCommand(message) {
        const extractedNums = message.match(/[<>]?(\d+)/g); // extract number with <> symbol
        //const extractedNums = message.match(/(\d+)/g); //Original regex without extracting <> sysmbol
        //const extractNickname = message.slice(4).replace(/[^A-Z]+/g, "");
        if (nickname != "TCR") { return }
        if (message.slice(0, this.prefix.length) != this.prefix) { return }
        //if (studentsArr.includes(extractNickname) === false) { return }

        const num1 = extractedNums[0];
        const num2 = extractedNums[1];
        sock.emit(this.sockEmitFlag, { num1, num2, nickname });
    }
}
class numAndIdCommand {
    constructor(prefix, sockEmitFlag) {
        this.prefix = prefix;
        this.sockEmitFlag = sockEmitFlag;
    }

    executeCommand(message) {
        const extractedNum = message.replace(/\D/g, '');
        const extractNickname = message.slice(4).replace(/[^A-Z]+/g, "");
        if (nickname != "TCR") { return }
        if (message.slice(0, this.prefix.length) != this.prefix) { return }
        if (studentsArr.includes(extractNickname) === false) { return }

        const studentId = extractNickname;
        const getNum = extractedNum;
        sock.emit(this.sockEmitFlag, { getNum, studentId });
    }
}

const allCommands = [
    new idCommand("TCR: winner ", 'winner'),
    new freeNumCommand(nickname + ": pw ", 'unlockUsingPassword'),
    new freeNumCommand(nickname + ": p", 'usePower'),
    new freeNumCommand(nickname + ": ee a", 'eagleEye'),
    new freeNumCommand(nickname + ": ee off", 'deactivateEagleEye'),
    new numAndIdCommand("TCR: grant power ", 'grantPower'),
    new idCommand("TCR: mind control ", 'mindControl'),
    new numAndIdCommand("TCR: +", 'addSteps'),
    new numAndIdCommand("TCR: good ", 'sendPW'),
    new numAndIdCommand("TCR: nope ", 'failed'),
    new numAndIdCommand("TCR: set team ", 'setPlayerTeam'),
    new numAndIdCommand("TCR: award steps ", 'addAwardedSteps'),
    new numAndIdCommand("TCR: penal ", 'penalties'),
    new messageCommand("TCR: on screen ", 'onScreen'),
    new fixedCommand("TCR: swap teams", 'swapTeams'),
    new fixedCommand("TCR: mind control off", 'mindControlOff'),
    new fixedCommand("TCR: game start", 'moveAwardedStepsToActualSteps'),
    new fixedCommand("TCR: go next level", 'goToNextMap'),
    new fixedCommand("TCR: restart level", 'restartLevel'),
    new numCommand("TCR: display mission ", 'displayMission'),
    new numCommand("TCR: open lock ", 'openLock'),
    new numCommand("TCR: all +", 'addStepsAll'),
    new numCommand("TCR: go level ", 'goToLevel'),
    new multiNumCommand("TCR: set sign ", 'setSignTime'),
    new numAndIdCommand("TCR: use ", 'useItem'),
    new localFixedCommand("TCR: list", openModal),
    new localFreeCommand(nickname + ": info", openModal),
    new localFreeCommand(nickname + ": map", openModal),
    new idCommand("TCR: go a2 ", 'teleportPlayerArea2'),
    new idCommand("TCR: go a1 ", 'teleportPlayerMainArea'),
    new idCommand("TCR: go a3 ", 'teleportPlayerArea3'),
    new idCommand("TCR: go a4 ", 'teleportPlayerArea4')
    //new fixedCommand("TCR: teleport me out", 'teleportMeOut'),
    //new fixedCommand("TCR: teleport me in", 'teleportMeIn'),
    //new fixedCommand("TCR: number of players", '???'),
    //new forceClientRefreshCommand("TCR: reset server", 'resetserverval')
];