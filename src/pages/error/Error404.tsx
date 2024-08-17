import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import "./Error.scss"
function Error404() {
  const navigate = useNavigate();
  return <>
    <div className="error-page">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={() => navigate("/")}>Back Home</Button>}
      />
    </div>
  </>
}

export default Error404;