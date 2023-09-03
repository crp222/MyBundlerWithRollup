
import React from 'react'
import Panel from './panels/panel.jsx'

export default function Home() {
  return (
    <div className='home'>
        <Panel w="500px" h="200px"></Panel>
        <Panel w="300px" h="400px"></Panel>
        <Panel w="800px" h="100px"></Panel>
        <Panel w="300px" h="300px"></Panel>
        <Panel w="300px" h="300px"></Panel>
    </div>
  )
}
