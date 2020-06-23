import { h, render } from "./ez.esm";

import TestComp from './views/test-comp';

function App(props) {
  
  const clickHandler = () => {
    console.log(this, 'this')
  }

  return (
    <div
      className="app-page"
      onclick={clickHandler}
    >
      <TestComp propsTest="propsTest">
        <button className="btn">1111</button>
        <button className="btn">1111</button>
        <button className="btn">1111</button>
      </TestComp>
    </div>
  )
}


render(<App />, document.querySelector("#app"))