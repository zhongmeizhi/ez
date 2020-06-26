import ez from "../ez.esm";

export default function TestComp(props) {

  return (
    <div className="home-page">
      <div>{props.propsTest}</div>
      {props.children}
    </div>
  )
}