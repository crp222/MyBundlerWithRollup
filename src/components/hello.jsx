import React from 'react';
import { createRoot } from 'react-dom/client';


export default function createReact() {
    function Comp1() {
        const [count,setCount] = React.useState(1);
    
        return <>
            <div>{count}</div>
            <button onClick={()=>setCount(count+1)}>add</button>
        </>
    }
    
    const root = createRoot(document.getElementById('app'));
    root.render(<Comp1></Comp1>);
}