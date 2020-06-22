import { h, render } from "./ez.esm";

import TestComp from './views/test-comp';

function App(props) {
  console.log(props, 'props')
  return (
    <div className="app-page">
      <TestComp />
    </div>
  )
}


render(<App />, document.querySelector("#app"))