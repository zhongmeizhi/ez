import { h, render } from "./ez.esm";

function App() {
  return (
    <div className="home-page">
      <button className="btn">1111</button>
    </div>
  )
}

render(<App />, document.querySelector("#app"))