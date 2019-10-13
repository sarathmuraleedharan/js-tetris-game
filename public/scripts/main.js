class Canvas {
    constructor() {
        this.width = 400;
        this.height = 550;

        this.canvas = document.getElementById('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');
    }

    update = (deltaTime) => {
        requestAnimationFrame(this.update);
        this.draw();        
    }

    start() {
        this.update(0);
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawRectagle();
        
    }

    drawRectagle(){
        this.context.strokeSytle='red';
        this.context.rect(0,0,this.width,this.height);
        this.context.stroke();
    }

}

window.addEventListener('load', function() {
    const canvas = new Canvas();
    canvas.start();
})