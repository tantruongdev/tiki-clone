import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import "./Error.scss"
function Error403() {
  const navigate = useNavigate();
  return <>
    <div className="error-page">
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary" onClick={() => navigate("/")}> Back Home</Button>}
      />
    </div >
  </>
}

export default Error403;