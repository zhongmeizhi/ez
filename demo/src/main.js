import { h, createApp, useState } from "./ez.esm";

import TestComp from './views/test-comp';

function App(props) {

  let [count, setCount] = useState(10);

  const clickHandler = () => {
    setCount(count += 10);
    console.log(count, 'count')
    props.$forceUpdate();
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
      <TestComp propsTest="222">
        <div className="btn">
          <span>number: </span>
          <span>{count}</span>
        </div>
        <button className="btn" onclick={clickHandler}>add number</button>
      </TestComp>
    </div>
  )
}


createApp(<App />, document.body)