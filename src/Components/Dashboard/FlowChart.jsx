import React from 'react'
import FlowChartImage from "../../Assets/Flowchart.png"
function FlowChart() {
  return (
    <div style={{ width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "10%", paddingRight: "10%", flexDirection: "column" }}>
    <h3 style={{ fontWeight: "bold" }}>Project Architecture</h3>
    <img src={FlowChartImage} alt='FlowChart' style={{ height: "60vh" }} />
  </div>
  )
}

export default FlowChart