import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { ReactComponent as Caret } from 'Assets/caret.svg'

import './Select.scss'

type SelectValue = { value: string; label: React.ReactNode }

type SelectProps = {
  values: SelectValue[]
  onSelect?: (value: string) => void
  selected?: string
}

const Select: React.FC<SelectProps> = (props) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<SelectValue | undefined>()

  useEffect(() => {
    props.onSelect && selected && props.onSelect(selected.value)
    // eslint-disable-next-line
  }, [selected])

  useEffect(() => {
    if (props.selected) {
      const selectedFound = props.values.find((v) => v.value === props.selected)
      selectedFound && setSelected(selectedFound)
    }
  }, [props.selected, props.values])

  const onClickHandler = useCallback((v: SelectValue) => {
    setSelected(v)
    setOpen(false)
  }, [])

  const selectedLabel = useMemo(() => {
    return selected ? selected.label : 'Select a token'
  }, [selected])

  return (
    <div className="Select">
      <div className="Select__wrapper">
        <div
          className={`selected opened-${open}`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="select-option">{selectedLabel}</span>
          <Caret />
        </div>
        <div className="options-wrapper">
          <ul className={`options opened-${open}`}>
            {props.values
              .filter((x) => (selected ? x.value !== selected.value : true))
              .map((v, i) => (
                <li
                  key={i}
                  className="select-option"
                  onClick={() => onClickHandler(v)}
                >
                  {v.label}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Select
