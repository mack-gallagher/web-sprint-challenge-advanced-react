import React from 'react';
import axios from 'axios';

export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {};
    
    this.initialGrid = [[null, null, null],
                        [null, 'B', null],
                        [null, null, null]];


    this.state.grid = [[null, null, null],
                       [null, "B", null],
                       [null, null, null]];
    this.state.msgText = "";
    this.state.movesCount = 0;
    this.state.value = "";

    this.getBCoordinates = this.getBCoordinates.bind(this);
    this.setBCoordinates = this.setBCoordinates.bind(this);
    
    this.reset = this.reset.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.getSquares = this.getSquares.bind(this);

  }

  getBCoordinates() {
    let x = 0; 
    let y = 0; 

    for (let i = 0; i < this.state.grid.length; i++) {
      for (let j = 0; j < this.state.grid[i].length; j++) {
        if (this.state.grid[i][j] === 'B') {
          y = i+1;
          x = j+1;
        }
      }
    }
    return [x,y];
  }

  setBCoordinates(bCoordinates) {
    const grid = [];
    let gridSection = [];
    for (let i = 1; i < 4; i++) {
    gridSection = [];
      for (let j = 1; j < 4; j++) {
        if (i === bCoordinates[1] && j === bCoordinates[0]) {
          gridSection.push("B");
        } else {
          gridSection.push(null);
        }
      }
      grid.push(gridSection);
    }
    this.setState((state, props) => {
      return {grid: grid};
    })
  }

  reset() {
    this.setState((state, props) => {
      return {
               grid: this.initialGrid,
               msgText: "",
               movesCount: 0,
               value: ''
             };
    });
  }

  moveRight() {
    let bCoordinates = this.getBCoordinates();
    if (bCoordinates[0] !== 3) {
      bCoordinates = [bCoordinates[0]+1, bCoordinates[1]];
      this.setBCoordinates(bCoordinates);
      this.setState((state, props) => {
        return {
                 movesCount: this.state.movesCount + 1,
                 msgText: ""
               };
      })
    } else {
      this.setState((state, props) => {
        return {
                 msgText: "You can't go right",
               }
      });
    }
  }

  moveLeft() {
    let bCoordinates = this.getBCoordinates();
    if (bCoordinates[0] !== 1) {
      bCoordinates = [bCoordinates[0]-1,bCoordinates[1]];
      this.setBCoordinates(bCoordinates);
      this.setState((state, props) => {
        return {
                 movesCount: this.state.movesCount + 1,
                 msgText: "",
               }
      });
    } else {
      this.setState((state, props) => {
        return {
                 msgText: "You can't go left",
               }
      });
    }
  }

  moveUp() {
    let bCoordinates = this.getBCoordinates();
    if (bCoordinates[1] !== 1) {
      bCoordinates = [bCoordinates[0],bCoordinates[1]-1];
      this.setBCoordinates(bCoordinates);
      this.setState((state, props) => {
        return {
                 movesCount: this.state.movesCount + 1,
                 msgText: '',
               }
      });
    } else {
      this.setState((state, props) => {
        return {
                 msgText: "You can't go up",
               }
      });
    }
  }

  moveDown() {
    let bCoordinates = this.getBCoordinates();
    if (bCoordinates[1] !== 3) {
      bCoordinates = [bCoordinates[0],bCoordinates[1]+1];
      this.setBCoordinates(bCoordinates);
      this.setState((state, props) => {
        return {
                 movesCount: this.state.movesCount + 1,
                 msgText: "",
               }
      });
    } else {
      this.setState((state, props) => {
        return {
                 msgText: "You can't go down",
               }
      });
    }
  }

  handleChange(e) {
    this.setState((state, props) => {
      return {
               value: e.target.value,
             }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const postObj = {};
    const bCoordinates = this.getBCoordinates();

    postObj.x = bCoordinates[0];
    postObj.y = bCoordinates[1];
    postObj.steps = this.state.movesCount;
    postObj.email = this.state.value;

    axios.post('http://localhost:9000/api/result',postObj)
      .then(res => {
        console.log(res);
        this.setState((state, props) => {
          return {
                   msgText: res.data.message,
                 }
        });
      })
      .catch(err => {
        console.log(err);
        this.setState((state, props) => {
          return {
                   msgText: err.response.data.message,
                 }
        });
      });

     this.setState((state, props) => {
       return {
                value: "",
              }
     });
  }

  getSquares() {
    const squares = [];
    for (let i = 0; i < this.state.grid.length; i++) {
      for (let j = 0; j < this.state.grid.length; j++) {
        if (this.state.grid[i][j] === 'B') {
          squares.push(["square active","B"]);
        } else {
          squares.push(["square",""]);
        }
      }
    }
    return squares;
  }

  render() {
    const { className } = this.props
    const squares = this.getSquares();
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">
            Coordinates ({ this.getBCoordinates()[0] }, { this.getBCoordinates()[1] })
          </h3>
          <h3 id="steps">You moved { this.state.movesCount } { this.state.movesCount===1?'time':'times' }</h3>
        </div>
        <div id="grid">
          { squares.map((x,idx) => {
            return (
              <div className={x[0]} key={idx}>{ x[1] }</div>
            )
          }) }
        </div>
        <div className="info">
          <h3 id="message">{ this.state.msgText }</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={ this.moveLeft }>LEFT</button>
          <button id="up" onClick={ this.moveUp }>UP</button>
          <button id="right" onClick={ this.moveRight }>RIGHT</button>
          <button id="down" onClick={ this.moveDown }>DOWN</button>
          <button id="reset" onClick={ this.reset }>reset</button>
        </div>
        <form onSubmit={ this.handleSubmit }>
          <input 
            id="email" 
            type="email" 
            placeholder="type email"
            value={ this.state.value }
            onChange={ this.handleChange }
          ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
