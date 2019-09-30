
import React, { createRef } from 'react';
import './style.scss'

interface SwitchButtonProps {
  hasBackMusic: boolean
}

const SwitchButton = (props:SwitchButtonProps) => {
  const { hasBackMusic } = props
  return (
    <button className={`btn-switch ${hasBackMusic?'btn-switch-checked':''}`}>
      <span className="btn-switch-inner">{hasBackMusic ? '开' : '关'}</span>
    </button>
  )
}

export default SwitchButton
