const sock = io();

//LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
var nickname;
const promptMsg = () => {

    //const sat2PMStudents = [LK, LXR, SZF, JHA, JL, JV, H, TCR];
    const sun230pmStudents = ["LOK", "KSY", "KN", "JT", "CJH", "LSH", "KX", "TJY"];
    const sat4pmStudents = ["JX", "JZ", "TWN", "LJY", "LSH", "ELI", "CUR", "CT", "RYD"];

    const studentLogins = {
        teacher: { pinNumber: '8', nickname: 'TCR' },
        len: { pinNumber: '1502', nickname: 'LEN' },

        sat2pmStudent1: { pinNumber: '9852', nickname: 'LK' },
        sat2pmStudent2: { pinNumber: '9035', nickname: 'LXR' },
        sat2pmStudent3: { pinNumber: '3839', nickname: 'SZF' },
        sat2pmStudent4: { pinNumber: '3583', nickname: 'JHA' },
        sat2pmStudent5: { pinNumber: '1072', nickname: 'JL' },
        sat2pmStudent6: { pinNumber: '5691', nickname: 'JV' },
        sat2pmStudent7: { pinNumber: '4048', nickname: 'H' },

        sat4pmStudent1: { pinNumber: '1289', nickname: "JX" },
        sat4pmStudent2: { pinNumber: '3825', nickname: "JZ" },
        sat4pmStudent3: { pinNumber: '8579', nickname: "TWN" },
        sat4pmStudent4: { pinNumber: '8828', nickname: "LJY" },
        sat4pmStudent5: { pinNumber: '1529', nickname: "LSH" },
        sat4pmStudent6: { pinNumber: '3191', nickname: "ELI" },
        sat4pmStudent7: { pinNumber: '3307', nickname: "CUR" },
        sat4pmStudent8: { pinNumber: '2318', nickname: "CT" },
        sat4pmStudent9: { pinNumber: '7385', nickname: "RYD" },

        sun230pmStudent1: { pinNumber: '1198', nickname: "LOK" },
        sun230pmStudent2: { pinNumber: '6139', nickname: "KSY" },
        sun230pmStudent3: { pinNumber: '7051', nickname: "KN" },
        sun230pmStudent4: { pinNumber: '4162', nickname: "JT" },
        sun230pmStudent5: { pinNumber: '2105', nickname: "CJH" },
        sun230pmStudent6: { pinNumber: '5086', nickname: "CED" },
        sun230pmStudent7: { pinNumber: '2167', nickname: "KX" },
        sun230pmStudent8: { pinNumber: '6588', nickname: "TJY" }
    }

    const getNickname = pinNumber => {
        return Object.values(studentLogins).find(obj => obj.pinNumber === pinNumber)?.nickname;
    }

    var nick = prompt("Please enter your pin number:");
    while (nick.length == 0) {
        alert("Please enter your pin number!");
        nick = prompt("Please enter your pin number:");
    }

    nickname = getNickname(nick);

    if (typeof (nickname) === 'undefined') {
        alert("Wrong pin number!");
        promptMsg();
    }
    
};

promptMsg();
sock.emit('newuser', nickname);

//LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL

const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('close-modal-button');
const overlay = document.getElementById('overlay');
const modalHeader = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

var studentsArr;
var triggerList = [];

let matrixAreaRenderingHere = "";
let chatObjectsArr = [];
let missionObjectArr = [];
let matrixLengthXAxis = 0;
let matrixLengthYAxis = 0;
let keySafe = false;
//let obtainedPowersArr = [];

//GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG

function createChatDivs() {
    const chatSec = document.getElementById("chat");
    var chatDiv = document.createElement("div");
    //var chatDiv = document.getElementById("chatdiv");
    //chatDiv.setAttribute("id", "chatdiv");
    chatDiv.style.width = "272px";
    chatDiv.style.height = "320px";
    //chatDiv.style = "background:rgba(255, 255, 255, 0.5); color:black; overflow: auto;"
    chatDiv.style.background = "rgba(255, 255, 255, 0.5)";
    chatDiv.style.color = "black";
    chatDiv.style.overflow = "auto";
    chatDiv.style.overflowX = "hidden";
    //chatDiv.style.float = "right";
    //chatDiv.style.marginLeft = "2%";
    //chatDiv.style.position = "fixed";
    chatDiv.style.top = "30px";
    //chatDiv.style.right = "30px";

    chatSec.appendChild(chatDiv);

    var chatInput = document.createElement('input');
    
    //chatInput.className = "form-control";
    chatInput.style.width = "205px";
    chatInput.style.height = "45px";
    chatInput.setAttribute("id", "chatinput");
    chatInput.setAttribute("type", "text");
    chatInput.style.display = "inline";
    chatInput.style.fontSize = "1.2em";
    chatDiv.appendChild(chatInput);

    var chatBtn = document.createElement('button');

    chatBtn.className = "btn";
    chatBtn.setAttribute("id", "chatBtn");
    chatBtn.innerHTML = "Send";
    chatBtn.style.height = "50px";
    chatBtn.style.width = "55px";


    chatDiv.appendChild(chatBtn);

    var div3 = document.createElement('div');
    div3.setAttribute("id", "div3");
    div3.style.width = '350px';
    div3.style.height = '260px'
    div3.style.color = 'black';
    div3.style.background = 'rgba(236, 236, 236, 0.5)';
    div3.style.overflowY = "auto";
    chatDiv.appendChild(div3);

    chatBtn.addEventListener('click', function () {
        const message = `${nickname}: ${chatInput.value}`;
        const message2 = chatInput.value;
        sock.emit('chat-to-server', message);
        if (message2 === "") {
            sock.emit('clearChatObject', nickname);
        } else if (message2.startsWith("ee") === true) {
            sock.emit('clearChatObject', nickname);
        } else {
            sock.emit('createChatObject', { message2, nickname });
        }
        
        chatInput.value = '';
    });

    chatInput.addEventListener("keyup", function (event) {
        keySafe = false;
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("chatBtn").click();
        }

    });

    chatInput.addEventListener("keydown", function (event) {
        
        if (!keySafe) {keySafe = true}
        else if (event.keyCode != 8) {event.preventDefault()}
        
        if (event.keyCode === 16) {keySafe = false}
        if (event.keyCode === 17) {keySafe = false}
        

    });

    return chatSec;
}

function appendMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.innerText = message;
    var div3 = document.getElementById("div3");
    div3.append(messageDiv);
    div3.scrollTop = div3.scrollHeight;


    allCommands.forEach((command) => {
        command.executeCommand(message);
    });
}

function openModal() {
    if (modal === null) return
    modal.classList.add('active');
    overlay.classList.add('active');
}
function requestPowerArray() {
    sock.emit('pushPowerArray', nickname);
}
function loadObtainedPowersToModal(powersArr, teamNum, awardedSteps) {
    
    modalHeader.innerHTML = `${nickname} - ${teamDetails[teamNum].art}: ${teamDetails[teamNum].desc} <br>`;
    modalHeader.innerHTML += `Abilities: ${teamDetails[teamNum].abilities}<br>`;
    modalHeader.innerHTML += `Steps: ${awardedSteps}`
    modalBody.innerHTML = "";
    powersArr.forEach((power, index) => {
        modalBody.innerHTML +=`${index + 1}: ${power.title} <br>`;
    });
}
function loadMiniMapToModal() {
    
    modalHeader.innerHTML = `Map`;
    modalBody.innerHTML = "";
    
}
function loadListToModal() {
    modalHeader.innerHTML = "Trigger list";
    modalBody.innerHTML = "";
    triggerList.forEach((item) => {
        modalBody.innerHTML += item + " <br>";
    });

}
function closeModal() {
    if (modal === null) return
    modal.classList.remove('active');
    overlay.classList.remove('active');
}
// function updateModal(data) {
//     modalHeader.innerHTML = data.head;
//     modalBody.innerHTML = data.body;
// }

function clientRender(data) {
    const getPlayerObject = data.playersArr.find(object => object.id === nickname);
    matrixAreaRenderingHere = getPlayerObject.area;
    const {
        gridMatrix: playerMatrix, 
        title: playerAreaTitle, 
        doors: redDoorCoords,
        signBoards: signBoards,
        finishFlags: finishFlags
        } = data.allMatrixes[getPlayerObject.area];
    
    const {playersArr, extraArr, itemsArr} = data;


    const config = { playersArr, extraArr, itemsArr, playerMatrix, playerAreaTitle, redDoorCoords, signBoards, finishFlags };
    const clientRender = new GridSystemClient(config);
    clientRender.render();
    
}


//FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF

createChatDivs();

closeModalButton.addEventListener('click', () => {
    closeModal();
});

overlay.addEventListener('click', () => {
    closeModal();
});

document.addEventListener("keydown", (e) => {
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.view.event.preventDefault();
    }
});
document.addEventListener("keyup", (e) => {
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        sock.emit('keyPress', e.keyCode);
    }
    //e.view.event.preventDefault();
    //sock.emit('keyPress', e.keyCode);
});

document.getElementById("chatinput").focus();

//============================================================================================================

//============COMMAND BUILDER======================COMMAND BUILDER===================COMMAND BUILDER==========
//============COMMAND BUILDER======================COMMAND BUILDER===================COMMAND BUILDER==========


sock.on('chat-to-clients', data => {
    var message = data;
    // var extractNicknameAtPrefix = message.slice(0, 4).replace(/[^A-Z]+/g, "");
    // const sliceAfter = extractNicknameAtPrefix.length
    // if (message.slice(sliceAfter + 2, sliceAfter + 4) === "pw") {
    // message = extractNicknameAtPrefix + ": pw *****"
    // }
    appendMessage(message);
});
sock.on('createChatObject', data => {
    // if (matrixAreaRenderingHere === data.area) { 
    // }
    
    
    const getChatObject = chatObjectsArr.find(chatObj => chatObj.id === data.id);
    // console.log(chatObjectsArr.length);
    if (!getChatObject) {
        const chatObject = new ChatObject({ x: data.x, y: data.y, message: data.message, id: data.id, matrixHeight: data.matrixHeight, matrixLength: data.matrixLength});
        chatObject.typeWriter();
        chatObjectsArr.push(chatObject);
    } else {

        //const { id, message, matrixHeight, matrixLength, ...updatingValues } = data;
        const index = chatObjectsArr.indexOf(getChatObject);
        chatObjectsArr[index].x = data.x;
        chatObjectsArr[index].y = data.y;
        //chatObjectsArr[index] = { ...chatObjectsArr[index], ...updatingValues}

        chatObjectsArr[index].text = data.message;
        //chatObjectsArr[index].area = data.area;
        chatObjectsArr[index].i = 1;
        chatObjectsArr[index].char = "";
        chatObjectsArr[index].typeWriter();
    }
});
sock.on('clearChatObject', data => {
    const getChatObject = chatObjectsArr.find(chatObj => chatObj.id === data.id);
    chatObjectsArr.splice(chatObjectsArr.indexOf(getChatObject), 1);
    sock.emit('refreshCanvas');
});
sock.on('missionObject', data => {
    missionObjectArr = [];
    const getNum = data;
    const mission = missions[getNum];
    const missionObject = new ChatObject({ message2: mission });
    missionObject.typeWriterLarge();
    missionObjectArr.push(missionObject);
    sock.emit('refreshCanvas');
});
sock.on('onScreen', data => {
    missionObjectArr = [];
    const missionObject = new ChatObject({ message2: data });
    missionObject.typeWriterLarge();
    missionObjectArr.push(missionObject);
    sock.emit('refreshCanvas');
});

sock.on('loadMatrix', (data) => {

    const { extraArr } = data;
    studentsArr = extraArr;

    clientRender(data);

    // const timerObject = new ChatObject({ message: "" });
    // timerObject.runTimer();

    missionObjectArr.forEach(mission => {
        mission.justPrintLarge();
    });
    
});

sock.on('sendMatrix', (data) => {

    canvasElements = document.querySelectorAll("canvas");
    canvasElements.forEach((canvas) => {
        canvas.remove();
    });

    clientRender(data); 

    chatObjectsArr.forEach(chatObj => {
        const getPlayerObject = data.playersArr.find(object => object.id === chatObj.id);
        
        chatObj.x = getPlayerObject.x;
        chatObj.y = getPlayerObject.y;
        chatObj.area = getPlayerObject.area;
        if (matrixAreaRenderingHere === chatObj.area) {
            chatObj.justPrint();
        }
    });
    missionObjectArr.forEach(mission => {
        mission.justPrintLarge();
    });

    //const timerObject = new ChatObject({ message: "" });
    //timerObject.runTimer();
    
    // typeWriterRender();
});

sock.on('updatePowerArray', data => {
    
    loadObtainedPowersToModal(data.obtainedPowers, data.getTeam, data.getAwardedSteps);
});
