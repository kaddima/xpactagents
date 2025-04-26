import React, { useState } from 'react'
import Switch from "react-switch"

const ToggleSwitch = ({ onChange:handleChange, checkState}) => {
  return (
    <label>
      <Switch onChange={handleChange} checked={checkState}/>
    </label>
  )
}

export default ToggleSwitch
