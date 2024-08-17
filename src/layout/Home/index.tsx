import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { decrement, increment, reset } from "../../store/counter/counterSlide";
import { Button } from "antd";
import { Link } from "react-router-dom";

function Home() {
  const counter = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch();
  return <>
    <Link to="/admin">Admin</Link>
    <Link to="/books">Books</Link>
  </>
}

export default Home;