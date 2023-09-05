
import React from 'react'

export default function PanelContainer(props) {
  return (
    <div className='panelcontainer' style={{transform:props.transform}}>
        {props.children}
    </div>
  )
}
