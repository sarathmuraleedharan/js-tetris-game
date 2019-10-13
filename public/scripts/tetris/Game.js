
export default class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.blockSize = 25;
        this.savedTime = 0;
        this.interval = 300;
        this.player = {
            shape: this.getNewShape(),
            pos: this.getNewStartPos(),
            score: 0,
            gameOver: false
        };

        this.mask = this.initMask();

        document.addEventListener('keydown', (e) => {
            if (e.keyCode == 39) {//right
                if (this.moveCheck(this.player.shape, 1, 0)) {
                    this.player.pos.x += 1;
                }
            } else if (e.keyCode == 37) {//left
                if (this.moveCheck(this.player.shape, -1, 0)) {
                    this.player.pos.x -= 1;
                }
            } else if (e.keyCode == 38) {//up
                this.player.shape = this.rotateMatrix(this.player.shape);

            } else if (e.keyCode == 40) {//down
                if (this.moveCheck(this.player.shape, 0, 1)) {
                    this.player.pos.y += 1;
                }
            }
        });
    }
    gameOver() {
        //alert('game over');
        this.player.gameOver = true;
    }

    initMask() {
        let mask = [];
        let w = this.width / this.blockSize;
        let h = this.height / this.blockSize;
        for (let i = 0; i < w; i++) {
            if (!mask[i]) mask[i] = [];
            for (let j = 0; j < h; j++) {
                mask[i][j] = 0;
            }
        }
        return mask;
    }
    getNewShape() {
        return shapes[Math.floor(Math.random() * shapes.length)];
        //return shapes[1];
    }

    rotateMatrix(shape) {
        let newShape = [];
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (!newShape[j]) newShape[j] = [];
                newShape[j][i] = shape[i][j]
            }
        }
        return newShape;
    }
    moveCheck(shape, leftRight = 0, topDown = 0) {
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] > 0) {
                    let x = (this.player.pos.x + i + leftRight);
                    let y = (this.player.pos.y + j + topDown);
                    //console.log(x, y);
                    if (x * this.blockSize >= this.width || x < 0 ||
                        y * this.blockSize >= this.height || y < 0 ||
                        this.moveCheckMask(x, y)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    moveCheckMask(x, y) {
        for (let i = 0; i < this.mask.length; i++) {
            for (let j = 0; j < this.mask[i].length; j++) { }
        }

        if (!this.mask[x][y]) {
            return false;
        } else {
            return true;
        }
    }
    sweepMask() {
        let rMask = this.rotateMatrix(this.mask);
        for (let x = 0; x < rMask.length; x++) {
            let allAreFilled = true;
            let len = rMask[x].length;
            for (let y = 0; y < rMask[x].length; y++) {
                if (!rMask[x][y]) {
                    allAreFilled = false;
                    break;
                }
            }
            if (allAreFilled) {
                let newArray = [];
                for (let i = 0; i < len; i++) {
                    newArray.push(0);
                }
                rMask.splice(x, 1);
                rMask.unshift(newArray);
                this.mask = this.rotateMatrix(rMask);
                this.player.score += 1;
                this.interval -= 20;
            }
        }
    }
    mergeToMask(shape) {
        let xoff = this.player.pos.x;
        let yoff = this.player.pos.y;
        for (let x = 0; x < shape.length; x++) {
            for (let y = 0; y < shape[x].length; y++) {
                if (shape[x][y]) {
                    this.mask[x + xoff][y + yoff] = Math.floor(shape[x][y]);
                }

            }
        }
    }
    getNewStartPos() {
        return { x: Math.floor(Math.random() * (this.width / this.blockSize)), y: 0 }
    }
    update() {
        let current = new Date().getTime();
        if (current - this.savedTime > this.interval) {
            this.savedTime = current;
            if (!this.moveCheck(this.player.shape, 0, 1)) {
                this.mergeToMask(this.player.shape);
                this.player.shape = this.getNewShape();
                let pos = this.getNewStartPos();
                pos.x = Math.max(0, pos.x - this.player.shape.length)
                this.player.pos = pos;
                this.sweepMask();
                if (!this.moveCheck(this.player.shape, 0, 1)) {
                    this.gameOver();
                }
            } else {
                this.player.pos.y += 1;
            }
        }
    }
    draw(context) {
        if (!this.player.gameOver) {
            this.update();
        }
        this.drawShape(context, this.player.pos.x, this.player.pos.y, this.player.shape);
        this.drawShape(context, 0, 0, this.mask);
        if (this.player.gameOver) {
            context.beginPath();
            context.fillStyle = "rgb(255,255,255,.5)";
            context.rect(0, 0, this.width, this.height);
            context.fill();
            context.fillStyle = "red";
            context.font = "30px Comic Sans MS";
            context.textAlign = "center";
            context.fillText("Game Over", this.width / 2, this.height / 2);
        }
        context.fillStyle = "#055";
        context.textAlign = "left";
        context.font = "15px Comic Sans MS";
        context.fillText("Score: " + this.player.score, 5, 20);
    }

    drawShape(context, xoff, yoff, shape) {
        context.fillStyle = "rgba(5,5,5,.5)";
        context.lineWidth = 2;
        context.beginPath();
        for (let x = 0; x < shape.length; x++) {
            for (let y = 0; y < shape[x].length; y++) {
                if (shape[x][y] > 0) {
                    context.rect((xoff + x) * this.blockSize - 1, (yoff + y) * this.blockSize - 1, this.blockSize - 2, this.blockSize - 2);
                }
            }
        }
        context.fill();
    }
}

const shapes = [
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],

];