import { HashLoader } from "react-spinners";
import "./Loading.scss"
function Loading() {

  return <>
    <div className="loading">
      <HashLoader color="#36d7b7" />
    </div>
  </>
}

export default Loading;