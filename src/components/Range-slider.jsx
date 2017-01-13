import React from 'react';
import {Canvas} from './Canvas.jsx';

export class RangeSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: '0',
            maxCount: '20',
            submit: false
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    handleMouseDown(e) {       //При нажатии на мышь перемещение объекта
        this.drop = true;
        return false;
    }

    handleMouseUp(e) {          //При отжатии мыши прекращение перемещения объекта
        this.drop = false;
        return false;
    }
    handleMouseOut(){           //При уходе мыши с элемента  прекращение перемещения объекта
        this.drop = false;
        return false;
    }

    handleMouseMove(e) {
        if (this.drop) {
            let pos = e.pageX - 70;                                             //Позиция в которой будет находится наш объект
            let width = this.refs.slide.scrollWidth - 50;
            let percent = pos / (width / 100);                                  //Вычесление на сколько процентов переместился объект в соотношении с родителем
            let count = Math.round((this.state.maxCount / 100) * percent);      //Округленное до целого число стоответсвующие проценту от максимальной велечины
            if (percent < 0 || percent > 100)
                return;

            this.setState({count: count});                                      //Записываем в состояние компонента получившиеся число
            this.refs.handleSlide.style.transform = `translateX(${pos}px)`;     //Перемещаем наш объект на нужное количество пикселей
        }
    }

    render() {
        return (
            <div
                className="range-slider"
                onMouseMove={this.handleMouseMove}>
                <div className="slide" ref="slide"
                >
                    <span
                        className="slide-handle"
                        onMouseUp={this.handleMouseUp}
                        onMouseDown={this.handleMouseDown}
                        onMouseOut={this.handleMouseOut}
                        ref="handleSlide"></span>
                    <div className="min-circle">{this.state.count}</div>
                    <div className="max-circle">{this.state.maxCount}</div>
                </div>
                    <Canvas count={this.state.count} submit={this.state.submit}/>
            </div>
        )
    }
}