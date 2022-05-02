import logo from './logo.svg';
import { useEffect } from 'react';
import './App.css';
import Todo from './todo';
import { useMoralis } from "react-moralis";

function App() {
  const { enableWeb3 } = useMoralis();
  useEffect(() => {
    enableWeb3();
  }, [])
  return (
    <>
      <Todo />
    </>
  );
}

export default App;
