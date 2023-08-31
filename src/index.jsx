
import hello from "./js/home.js";
import React from "react";
import { createRoot } from 'react-dom/client';

hello();

function Counter() {
    const [count,setCount] = React.useState(1);

    return <>
        <div>{count}</div>
        <button onClick={()=>setCount(count+1)}>+</button>
    </>
}

const root = createRoot(document.getElementById('app'));
root.render(<Counter></Counter>);