import { h, render } from "./ez.esm";

import TestComp from './views/test-comp';

function App() {
  
  let btnName = '按钮';

  return (
    <div
      className="app-page"
    >
      <div name="proName">这是个div</div>
      {
        [1,2,3].map(val => <div>{val}</div>)
      }
      <TestComp propsTest="propsTest">
        <button className="btn">1111</button>
        <button className="btn" onclick={clickHandler}>{btnName}</button>
      </TestComp>
    </div>
  )
}


render(<App />, document.body)