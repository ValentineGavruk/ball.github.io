export class Ball {                                         //Создание класса шарика
    constructor(x, y, dx, dy, context) {
        this.x = x;
        this.y = y;
        this.context = context;
        this.radius = 9;
        this.dx = dx;
        this.dy = dy;
        this.state = false;
        this.id = Math.random() *(1000000 - 100) + 100;
    }

    draw() {
        this.context.beginPath();
        this.context.strokeStyle = 'black';
        this.context.fillStyle = '#ffea00';
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.context.fill();
        this.context.stroke();
    }

}

