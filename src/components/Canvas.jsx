import React from 'react';
import {Ball} from './Ball.jsx';

export class Canvas extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            start: false,
            count: '0'
        };

        this.draw = this.draw.bind(this);
        this.addBall = this.addBall.bind(this);
        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.addStateBalls = this.addStateBalls.bind(this);
        this.drawImage = this.drawImage.bind(this);
    }

    handleCanvasClick(e){                                           //Клик по canvas
        var rect = this.canvas.getBoundingClientRect();             //Вычисляем положение canvas на странице
            let x = e.clientX - rect.left;                          //
            let y = e.clientY - rect.top;                           //Точки x и y на которые произошел клик

        for (let i = 0; i < this.balls.length; i++) {               //Перебираем массив с нашими шариками
            let ball = this.balls[i];
            let dx = ball.x - x;
            let dy = ball.y - y;
            let distance = Math.sqrt((dx * dx) + (dy * dy));        //Измеряем дистанцию между точкой клика и положением шарика
            if(distance < ball.radius * 2){                         //Если дистанция меньше диаметра шара то меняем состояние шарика
                if(ball.state == true){
                     ball.state = false;
                    return this.draw;
                }else{
                    ball.state = true;
                    return this.draw();
                }

            }
        }

    }

    addStateBalls(val){                                     //Метод перебирающий масси шариков и добавляющий ему состояние в зависимости от параметра
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].state = val
        }
    }

    handleBtnClick(e) {                                     //При клике на кнопку старт менем сотояние у шариков и у компонента
        if (this.state.start) {
            e.target.innerText = 'Старт';
            this.setState({start: false});
            this.addStateBalls(false);
        }else{
            e.target.innerText = 'Стоп';
            this.setState({start: true});
            this.addStateBalls(true);
        }
    }

    update() {                                                                  //Изменение координат каждого шарика
        for (let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];

            if(ball.state == true){
                for (let c = 0; c < this.balls.length; c++) {                   //Проверка на столкновение между шариками
                    if (ball.id != this.balls[c].id) {
                        let dx = ball.x - this.balls[c].x;
                        let dy = ball.y - this.balls[c].y;
                        let distance = Math.sqrt((dx * dx) + (dy * dy));

                        if (distance < ball.radius * 2) {
                            ball.dx = -ball.dx;
                            ball.dy = -ball.dy;
                            this.balls[c].dx = -this.balls[c].dx;
                            this.balls[c].dy = -this.balls[c].dy;
                        }
                    }

                }

                if (ball.x > this.canvas.width - ball.radius || ball.x - ball.radius < 0) {   // Проверка на столкновение между  верхней и нижней границей
                    ball.dx = -ball.dx;
                }
                if (ball.y > this.canvas.height - ball.radius || ball.y - ball.radius < 0) {  // Проверка на столкновение между  правой  и левой границей
                    ball.dy = -ball.dy;
                }
                ball.x += ball.dx;
                ball.y += ball.dy;

            }

        }
        window.cancelAnimationFrame(this.animate);                                              //Отмена анимациии
    }

    draw() {                                                                                    //Метод рисование шариков на холсте
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);                    //Очистака холста
        this.context.drawImage(this.imageObj, 0, 0,this.canvas.width, this.canvas.height );     //Отрисовка фонового изображения
        for (let i = 0; i < this.balls.length; i++) {                                           //Отрисовка каждого шарика
            this.balls[i].draw();
        }
        this.update();
        this.animate = window.requestAnimationFrame(this.draw);                                 //Создание анимации

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.count == nextProps.count) {              //Если приходящий параметр равен предыдущему,то не рендерить компонент.
            return false;
        } else {
            return true;
        }
    }

    componentWillUpdate() {                                     //Перед рендером меняем сотояение компонента и шариков
        this.setState({
            start: false
        });
        this.addStateBalls(false);
        this.refs.startBtn.innerText = 'Старт';
    }

    componentDidUpdate() {                                  //После рендера обновленого компонента проверять количество шариков
        if (this.count != this.props.count) {
            this.addBall();
        }
    }

    addBall() {                                                             //Добавление шарика
        let length = this.props.count;
        if (this.balls.length > length)                                     //Если шариков больше чем нужно,удаляем не нужные шарики
            return this.balls.length = length;

        this.count++;
        let i = Math.round(Math.random());                                 //Рандомное создание точек x и y
        var x = Math.random() * (780 - 10) + 10;
        var y = Math.random() * (350 - 10) + 10;
        let ball = new Ball(x, y, this.dx[i], this.dy[i], this.context);    //Создание шарика
        this.balls.push(ball);                                              //Добавление нового шарика в массив с шариками
        if (length != this.count){                                          //Если количество шариков не равно нужному количеству,создаем еще один шарик
            return this.addBall();
        }else{
            this.draw();
        }


    }

    drawImage(){                                                                                    //Отрисовка фонового изображения
        this.imageObj = new Image();

        this.imageObj.onload = () => {
            this.context.drawImage(this.imageObj, 0, 0,this.canvas.width, this.canvas.height );
        };
        this.imageObj.src = './media/image/Hitryj-minon.jpg';
    }

    componentDidMount() {
        this.canvas = this.refs.canvas;                          //Элемент canvas
        this.canvas.width = 800;                                 //Ширина canvas
        this.canvas.height = 370;                                //Высота canvas
        this.context = this.canvas.getContext("2d");             //Контекс
        this.balls = [];                                         //Создание массива с шариками
        this.count = 0;
        this.dx = [2, -2];                                       //
        this.dy = [2, -2];                                       //Определение "скорости" шарика (на сколько будут изменятся x и y
        this.drawImage();
        if (this.count != this.balls.length) {
            this.addBall();
        }
    }

    render() {
        return (
            <div className="board">
                <canvas
                    ref='canvas'
                    onClick={this.handleCanvasClick}
                >
                </canvas>
                <button
                    className="start-btn"
                    onClick={this.handleBtnClick}
                    ref='startBtn'>Старт
                </button>
            </div>
        )
    }
}