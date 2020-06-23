import { h } from "../ez.esm";
import { createElement } from "../../../src/core/reconciler";

export default function TestComp(props) {

  console.log(props, 'props')

  return (
    <div className="home-page">
      {props.children}
    </div>
  )
}