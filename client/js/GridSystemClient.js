class GridSystemClient {
    constructor(config) {
        this.matrix = config.playerMatrix;
        this.redDoorCoords = config.redDoorCoords;
        this.signBoards = config.signBoards;
        this.finishFlags = config.finishFlags;
        this.areaTitle = config.playerAreaTitle;
        this.itemsArr = config.itemsArr;
        

        this.uiContext = this.getContext(0, 0, "transparent", false);
        this.outlineContext = this.getContext(0, 0, "transparent");
        this.topContext = this.getContext(0, 0, "transparent", false);
        this.lableContext = this.getContext(500, 500, "white", false);
        //this.chatContext = this.getContext(1000, 580, "transparent", false);

        this.cellSize = 27;
        this.cellSizeBuffer = 1;
        this.padding = 2;
        this.strokeBuffer = 29;
        this.strokeThickness = 1.7;

        
        this.students = config.extraArr;

        // this.p1 = {color: "orange", lable: 2, id: this.students[0]};
        // this.p2 = {color: "pink", lable: 3, id: this.students[1]};
        this.playersArr = config.playersArr;

        this.teams = {
            "1": {line: 0, prefix: "👨‍🚀:", playerString: ""},
            "2": {line: 15, prefix: "👽:", playerString: ""},
            "3": {line: 30, prefix: "🟩:",playerString: ""}
        }

        //document.addEventListener("keydown", this.movePlayer);
        // this.text = "Player here says hello world";
        // this.i = 1;
        // this.char = "";
        // this.fps = 20;
        
    }

    getCenter(w, h) {
        return {
            x: window.innerWidth / 2 - w / 2 + "px",
            y: window.innerHeight / 2 - h / 2 + "px"
        };
    }
    getTopLeftFromUIContext() {
        return {
            //x: window.innerWidth - (this.outlineContext.canvas.width + 300) + "px",
            //y: window.innerHeight - (this.outlineContext.canvas.height + 25) + "px"
            x: 0 + "px",
            y: 25 + "px"
        };
    }
    getContext(w, h, color = "#111", isTransparent = false) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width = w;
        this.height = this.canvas.height = h;
        this.canvas.style.position = "absolute";
        this.canvas.style.background = color;
        if (isTransparent) {
            this.canvas.style.backgroundColor = "transparent";
        }
        const center = this.getCenter(w, h);
        this.canvas.style.marginLeft = center.x;
        this.canvas.style.marginTop = center.y;
        document.body.appendChild(this.canvas);

        return this.context;
    }

    uiContextSettings() {
        this.uiContext.canvas.width = 1000;
        this.uiContext.canvas.height = 680;
        //this.uiContext.canvas.style.background = "#111";
        this.uiContext.canvas.style.background = "transparent";
        //const center = this.getCenter(this.uiContext.canvas.width, this.uiContext.canvas.height);
        this.uiContext.canvas.style.marginLeft = "-8px";
        this.uiContext.canvas.style.marginTop = "-12px";
    }
    
    outlineContextSettings() {
        const w = (this.cellSize + this.padding) * this.matrix[0].length - (this.padding);
        const h = (this.cellSize + this.padding) * this.matrix.length - (this.padding);

        this.outlineContext.canvas.width = w;
        this.outlineContext.canvas.height = h;
        //const center = this.getCenter(w, h);
        const center = this.getTopLeftFromUIContext();
        this.outlineContext.canvas.style.marginLeft = center.x;
        this.outlineContext.canvas.style.marginTop = center.y;
        this.outlineContext.canvas.style.background = "transparent";
        // this.outlineContext.canvas.style.background = "#333";
    }
    topContextSettings() {
        this.topContext.canvas.width = 270;
        this.topContext.canvas.height = 260;
        this.topContext.canvas.style.background = "#222";
        this.topContext.canvas.style.marginLeft = "995px";
        this.topContext.canvas.style.marginTop = "5px";
        this.topContext.canvas.style.border = "solid 1px black";
        this.topContext.font = "12px Courier";
        this.topContext.fillStyle = "white";
        //this.topContext.canvas.style.border = "5px solid red";

        var nextLine = 10

        this.playersArr.forEach(player => {
            //this.topContext.scale(1, 1);
            let printPlayerInfo = `${player.id}`;
            this.topContext.fillText(printPlayerInfo, 0, nextLine);
            printPlayerInfo = `🏃`;
            this.topContext.scale(-1, 1);
            // this.topContext.scale(1.2, 1.2);
            this.topContext.fillText(printPlayerInfo, -39, nextLine);

            // this.topContext.scale(0.8, 0.8);
            this.topContext.scale(-1, 1);
            printPlayerInfo = `:${player.steps}/${player.maxSteps} 🎒:${player.inventory}`;
            this.topContext.fillText(printPlayerInfo, 39, nextLine);

            nextLine = nextLine + 15;
        });
        nextLine = nextLine - 10;

        this.topContext.beginPath();
        this.topContext.moveTo(0, nextLine);
        this.topContext.lineTo(270, nextLine);
        this.topContext.strokeStyle = "white";
        this.topContext.stroke();

        nextLine = nextLine + 15;
        //this.topContext.fillText("testing", 0, nextLine);
        
        this.playersArr.forEach(player => {
            if(this.teams[player.team] === undefined) {return}
            this.teams[player.team].playerString = `${this.teams[player.team].playerString} ${player.id}`;
        });
        
        Object.keys(this.teams).forEach((key) => {
            const { prefix, playerString, line } = this.teams[key];
            if (playerString === "") {return}
            this.topContext.fillText(`${prefix}${playerString}`, 0, nextLine + line);   
        });

    }
    lableContextSettings() {

        const w = (this.cellSize + this.padding) * this.matrix[0].length - (this.padding);
        const h = (this.cellSize + this.padding) * this.matrix.length - (this.padding);

        this.lableContext.canvas.width = w;
        this.lableContext.canvas.height = h;
        //const center = this.getCenter(w, h);
        const center = this.getTopLeftFromUIContext();
        this.lableContext.canvas.style.marginLeft = center.x;
        this.lableContext.canvas.style.marginTop = center.y;

        this.lableContext.canvas.style.background = "transparent";
        //this.lableContext.canvas.style.border = "2px solid blue";

        //sssssssssssssssssssssssssssssssssssssssssssssssssssssssss
        


    }
    setAllCanvasSettings() {
        this.uiContextSettings();
        this.outlineContextSettings();
        //this.chatContextSettings();
        this.topContextSettings();
        this.lableContextSettings();
        

    }


    setColorAndId(cellVal) {
        let color = "#111";
        //let color = "transparent";
        let playerId = null;
        let itemId = null;
        let stunId = null;

        const getPlayerObject = this.playersArr.find(object => object.lable === cellVal);
        if (getPlayerObject) {
            
            playerId = getPlayerObject.id;

            color = getPlayerObject.color;
            if (getPlayerObject.id === nickname && getPlayerObject.invisible === true) {
                color = getPlayerObject.invisibleColor;
            } else if (getPlayerObject.invisible === true){
                color = "#111";
            }

            if (getPlayerObject.stunned === true) {
                stunId = "💤"
            }
            
            
        }

        const getItemObject = this.itemsArr.find(object => object.itemLable === cellVal);
        if (getItemObject === undefined) return { color, playerId, itemId, stunId };
        itemId = getItemObject.itemId;
        color = getItemObject.color;

        return { color, playerId, itemId, stunId };
    }

    renderBlankCell(cellDetail, row, col) {
        //this.outlineContext.globalAlpha = 0.2;
        //const fillStyle = "transparent";
        this.outlineContext.fillStyle = cellDetail.color;
        //this.outlineContext.fillStyle = "transparent";
        //this.uiContext.fillStyle = fillStyle;
        this.outlineContext.fillRect(col * (this.cellSize + this.padding),
            row * (this.cellSize + this.padding),
            this.cellSize + this.cellSizeBuffer, this.cellSize + this.cellSizeBuffer);

        this.outlineContext.strokeStyle = "#333";
        //this.outlineContext.strokeStyle = "transparent";
        this.outlineContext.lineWidth = this.strokeThickness;
        this.outlineContext.strokeRect(col * (this.cellSize + this.padding),
            row * (this.cellSize + this.padding),
            this.cellSize + this.padding + this.strokeBuffer, this.cellSize + this.padding + this.strokeBuffer);

        
        
    }
    renderPlayers(cellDetail, row, col) {

        if (cellDetail.playerId === null) { return }

        if (this.students.includes(cellDetail.playerId)) {
            this.outlineContext.font = "13px Times New Roman";
            this.outlineContext.fillStyle = "#111";
            this.outlineContext.fillText(cellDetail.playerId, col * (this.cellSize + this.padding) + 1,
                row * (this.cellSize + this.padding) + 18);

            if (cellDetail.stunId === undefined) { return }
            if (cellDetail.stunId === null) { return }
            this.outlineContext.font = "19px Times New Roman";
            //this.outlineContext.fillStyle = "rgba(255, 255, 255, 0.5)";
            this.outlineContext.fillText(cellDetail.stunId, col * (this.cellSize + this.padding) + 1,
                row * (this.cellSize + this.padding) + 10);

                
        }
    }
    renderItems(cellDetail, row, col) {
        const getItemObject = this.itemsArr.find(object => object.itemId === cellDetail.itemId);
        if (getItemObject === undefined) return;

        // this.outlineContext.fillStyle = "#555";
        // this.outlineContext.fillRect(col * (this.cellSize + this.padding),
        //     row * (this.cellSize + this.padding),
        //     this.cellSize, this.cellSize);

        this.outlineContext.font = getItemObject.font;

        this.outlineContext.fillText(getItemObject.itemId, col * (this.cellSize + this.padding) + 3,
            row * (this.cellSize + this.padding) + getItemObject.rowValue);

    }

    setSignBoards(signNum, signText) {
        const signBoards = this.signBoards;
        signBoards[signNum].sign = signText;
    }
    renderSignBoards() {
        const signBoards = this.signBoards;
        signBoards.forEach(signboard => {
            this.lableContext.fillStyle = "rgba(255,255,255,0.5)";
            this.lableContext.fillRect(signboard.x,signboard.y, 110, 50);
            this.lableContext.fillStyle = "black";
            this.lableContext.font = '15px Courier bold';
            this.lableContext.fillText(signboard.sign, signboard.x + 5, signboard.y + 30);
        });

    }
    renderRedDoors() {
        const redDoorCoords = this.redDoorCoords;
        redDoorCoords.forEach(door => {
            this.outlineContext.fillStyle = "red";
            this.outlineContext.fillRect(door.x * (this.cellSize + this.padding) + 1,
                door.y * (this.cellSize + this.padding) + 1, this.cellSize, this.cellSize);

        });
    }
    renderFinishFlags() {
        this.finishFlags.forEach((flag) => {
            this.outlineContext.fillStyle = "white";
            this.outlineContext.font = "17px Times New Roman";
            this.outlineContext.fillText("🏁", flag.x * (this.cellSize + this.padding) + 3,
                flag.y * (this.cellSize + this.padding) + 21);
        
        });
    }
    setTopTitle() {
        this.uiContext.font = "20px Courier";
        this.uiContext.fillStyle = "white";

        //this.uiContext.fillText(`Holodeck 2-1`, 20, 30);
        this.uiContext.fillText(this.areaTitle, 20, 30);
        //this.uiContext.canvas.style.border = "2px solid green";

    }

    render() {

        this.setAllCanvasSettings();

        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {

                const cellVal = this.matrix[row][col];
                const cellDetail = this.setColorAndId(cellVal);
                // const itemDetail = this.setItemColorAndId(cellVal);

                //when cellVal === 0 (cellDetail.color === black)
                this.renderBlankCell(cellDetail, row, col);
                //when Player or Item present
                this.renderPlayers(cellDetail, row, col);
                this.renderItems(cellDetail, row, col);
            }
        }
        this.renderRedDoors();
        this.renderFinishFlags();
        //this.setSignBoards(0, "testing 2");
        this.renderSignBoards();
        this.setTopTitle();
        
    }

}