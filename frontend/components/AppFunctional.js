import React, { useState } from 'react';
import axios from 'axios';

export default function AppFunctional(props) {
  
  const initialGrid = [[null, null, null],
                       [null, "B", null],
                       [null, null, null],
                      ];
  const [grid, setGrid] = useState(initialGrid);
  const [msgText, setMsgText] = useState("");
  const [movesCount, setMovesCount] = useState(0);
  const [value, setValue] = useState("");

  const squares = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "B") {
        squares.push(["square active","B"]);
      } else {
        squares.push(["square",""]);
      }
    }
  }

  function getBCoordinates() {
    let x = 0;
    let y = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 'B') {
          y = i+1;
          x = j+1;
        }
      }
    }
    return [x,y];
  }

  function setBCoordinates(bCoordinates) {
    const grid = [];
    let gridSection = [];
    for (let i = 1; i < 4; i++) {
      gridSection = [];
      for (let j = 1; j < 4; j++) {
        if (i === bCoordinates[1] && j === bCoordinates[0]) {
          gridSection.push("B")
        } else {
          gridSection.push(null);
        }
      }
      grid.push(gridSection);
    }
    setGrid(grid);
  }

  function reset() {
    setGrid(initialGrid);
    setMsgText("");
    setMovesCount(0);
    setValue("");
  }

  function moveRight() {
    let bCoordinates = getBCoordinates();

    if (bCoordinates[0] !== 3) {
      bCoordinates = [bCoordinates[0]+1,bCoordinates[1]];
      setBCoordinates(bCoordinates);
      setMovesCount(movesCount+1);
      setMsgText("");
    }

    else {
      setMsgText("You can't go right");
    }
  }

  function moveLeft() {
    let bCoordinates = getBCoordinates();

    if (bCoordinates[0] !== 1) {
      bCoordinates = [bCoordinates[0]-1,bCoordinates[1]];
      setMovesCount(movesCount+1);
      setBCoordinates(bCoordinates);
      setMsgText("");
    }
    else {
      setMsgText("You can't go left");
    }

  }

  function moveUp() {
    let bCoordinates = getBCoordinates();

    if (bCoordinates[1] !== 1) {
      bCoordinates = [bCoordinates[0],bCoordinates[1]-1];
      setMovesCount(movesCount+1);
      setBCoordinates(bCoordinates);
      setMsgText("");
    }

    else {
      setMsgText("You can't go up");
    }
  }

  function moveDown() {
    let bCoordinates = getBCoordinates();

    if (bCoordinates[1] !== 3) {
      bCoordinates = [bCoordinates[0],bCoordinates[1]+1];
      setMovesCount(movesCount+1);
      setBCoordinates(bCoordinates);
      setMsgText("");
    }

    else {
      setMsgText("You can't go down");
    }
  }

  function handleChange(e) {
    setValue(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const postObj = {};

    const bCoordinates = getBCoordinates();

    postObj.x = bCoordinates[0];
    postObj.y = bCoordinates[1];
    postObj.steps = movesCount;
    postObj.email = value;

    axios.post('http://localhost:9000/api/result',postObj)
      .then(res => {
        console.log(res);
        setMsgText(res.data.message);
      })
      .catch(err => {
        console.log(err);
        setMsgText(err.response.data.message);
      });
    setValue("");
  }
  

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({ getBCoordinates()[0] }, { getBCoordinates()[1] })</h3>
        <h3 id="steps">You moved { movesCount } { movesCount===1?'time':'times' }</h3>
      </div>
      <div id="grid">
        { squares.map((x,idx) => {
          return (
            <div className={x[0]} key={idx}>{ x[1] }</div>
          )
        }) }
      </div>
      <div className="info">
        <h3 id="message">{ msgText }</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ moveLeft }>LEFT</button>
        <button id="up" onClick={ moveUp }>UP</button>
        <button id="right" onClick={ moveRight }>RIGHT</button>
        <button id="down" onClick={ moveDown }>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={ handleSubmit }>
        <input id="email" type="text" placeholder="type email" onChange={handleChange} value={value}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
