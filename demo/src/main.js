import { h, createApp, reactive, useState } from "./ez.esm";

import TestComp from './views/test-comp';

function App(props) {

  let [count, setCount] = useState({
    num: 0
  });

  const clickHandler = () => {
    setCount(10);
  }

  return (
    <div
      className="app-page"
    >
      <div name="proName">这是个div</div>
      {
        [1,2,3].map(val => <div>{val}</div>)
      }
      <TestComp propsTest="propsTest">
        <button className="btn">{count.num}</button>
        <button className="btn" onclick={clickHandler}>按钮</button>
      </TestComp>
    </div>
  )
}


createApp(<App />, document.body)