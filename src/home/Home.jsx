
import React from 'react'
import Panel from './panels/Panel.jsx'
import PanelSwap from './panels/PanelSwap.jsx'
import PanelContainer from './panels/PanelContainer.jsx'

export default function Home() {
  return (
    <div className='home'>
      <PanelSwap>
        <PanelContainer>
          <Panel w="500px" h="200px" bg="pink"></Panel>
          <Panel w="300px" h="400px" bg="pink"></Panel>
        </PanelContainer>
        <PanelContainer>
          <Panel w="200px" h="200px" bg="blue"></Panel>
          <Panel w="200px" h="200px" bg="blue"></Panel>
          <Panel w="200px" h="200px" bg="blue"></Panel>
          <Panel w="200px" h="200px" bg="blue"></Panel>
          <Panel w="300px" h="300px" bg="blue"></Panel>
        </PanelContainer>
        <PanelContainer>
          <Panel w="800px" h="100px" bg="green"></Panel>
          <Panel w="300px" h="300px" bg="green"></Panel>
          <Panel w="300px" h="300px" bg="green"></Panel>
        </PanelContainer>
      </PanelSwap>
        
    </div>
  )
}
