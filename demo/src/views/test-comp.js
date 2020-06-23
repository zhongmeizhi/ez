import { h } from "../ez.esm";

export default function TestComp(props) {

  return (
    <div className="home-page">
      {props.children}
    </div>
  )
}