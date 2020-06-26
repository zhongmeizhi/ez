import ez, { render, useState } from "./ez.esm";

import TestComp from './views/test-comp';

function App() {

  let [count, setCount] = useState(10);
  let [num, setNum] = useState(1000);

  const clickHandler = () => {
    setCount(count += 10);
    console.log(count, 'count')
  }

  const clickHandler2 = () => {
    setNum(num -= 10);
    console.log(num, 'count')
  }

  return (
    <div
      className="app-page"
    >
      {
        [1,2,3].map(val => <span>{val + 'map、'}</span>)
      }
      <div name="proName">a div</div>
      <br />
      <TestComp propsTest="propsTest......">
        <div className="btn">
          <span>count: </span>
          <span>{count}</span>
        </div>
        <button className="btn" onclick={clickHandler}>add number</button>
        <div className="btn">
          <span>num: </span>
          <span>{num}</span>
        </div>
        <button className="btn" onclick={clickHandler2}>add number</button>
      </TestComp>
    </div>
  )
}

const root = document.querySelector("#app");
render(<App name="mokou" />, root)