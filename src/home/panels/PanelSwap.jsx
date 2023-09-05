
import React from 'react';
import { SwitchTransition,CSSTransition } from 'react-transition-group';

export default function PanelSwap(props) {

    const [oldPanel,setOldPanel] = React.useState(1);
    const [currentPanel,setCurrentPanel] = React.useState(0);
    const nodeRef = React.useRef(null);

    React.useEffect(()=>{
        var r = document.querySelector(':root');
        if(oldPanel > currentPanel){
            r.style.setProperty('--fade-in', '100%');
            r.style.setProperty('--fade-out', '-100%');
        }else {
            r.style.setProperty('--fade-in', '-100%');
            r.style.setProperty('--fade-out', '100%');
        }
        setOldPanel(currentPanel);
    },[currentPanel])

  return (
    <div>
        <SwitchTransition mode="out-in">
            <CSSTransition 
            key={currentPanel}
            nodeRef={nodeRef} 
            addEndListener={(done) => {
              nodeRef.current.addEventListener("transitionend", done, false);
            }} 
            classNames='fade'>
                <div ref={nodeRef}>
                    {props.children[currentPanel]}
                </div>
            </CSSTransition>
        </SwitchTransition>
        <div className='switch'>
            {
                props.children.map((i,e)=>(
                    <button key={e} style={currentPanel == e ? {backgroundColor:'black',color:'white'} : null} onClick={()=>setCurrentPanel(e)}>{e}</button>
                ))
            }
        </div>
    </div>
  )
}
