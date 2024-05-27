import React from 'react'
import Select, { Styles } from 'react-select'
import { Pairs } from 'Config'

import './TokenSelector.scss'

const customStyles: Styles = {
  control: (provided, state) => ({
    ...provided,
    border: 0
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: '#000',
    fontWeight: 500
  })
}

export const TokenSelector: React.FC<{
  onChange: (v: typeof Pairs[number]) => void
  selected: typeof Pairs[number] | undefined
  options: typeof Pairs
}> = ({ onChange, selected, options }) => {
  return (
    <Select
      className="TokenSelector"
      classNamePrefix="TokenSelector"
      styles={customStyles}
      options={options}
      onChange={onChange as any}
      value={selected}
    />
  )
}
