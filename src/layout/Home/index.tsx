import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { decrement, increment, reset } from "../../store/counter/counterSlide";

function Home() {
  const counter = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch();
  return <>
    <div>Counter: {counter}</div>
    <button onClick={() => dispatch(increment())}>Up 5</button>
    <button onClick={() => dispatch(decrement())}>Up 5</button>
    <button onClick={() => dispatch(reset())}>Up 5</button>
  </>
}

export default Home;