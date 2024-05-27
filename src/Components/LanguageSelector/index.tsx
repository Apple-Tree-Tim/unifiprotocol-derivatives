import React, { useMemo, useState } from 'react'
import i18next from 'i18next'
import Select, { Styles } from 'react-select'

import './LanguageSelector.scss'

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

const options = [
  {
    label: (
      <div>
        <span>
          <span role="img" aria-label="uk">
            🇬🇧
          </span>
        </span>
        <span>English</span>
      </div>
    ),
    value: 'en'
  },
  {
    label: (
      <div>
        <span>
          <span role="img" aria-label="china">
            🇨🇳
          </span>
        </span>
        <span>中文</span>
      </div>
    ),
    value: 'cn'
  },
  {
    label: (
      <div>
        <span>
          <span role="img" aria-label="spain">
            🇪🇸
          </span>
        </span>
        <span>Español</span>
      </div>
    ),
    value: 'es'
  },
  {
    label: (
      <div>
        <span>
          <span role="img" aria-label="korea">
            🇰🇷
          </span>
        </span>
        <span>한국어</span>
      </div>
    ),
    value: 'kr'
  }
]

const LanguageSelector: React.FC = () => {
  const [selected, setSelected] = useState(i18next.language)

  const selectedLanguage = useMemo(() => {
    return options.find((l) => l.value === selected)
  }, [selected])

  const onChange = (v: typeof options[number]) => {
    i18next.changeLanguage(v.value)
    setSelected(v.value)
  }

  return (
    <Select
      className="LanguageSelector"
      classNamePrefix="LanguageSelector"
      styles={customStyles}
      options={options}
      onChange={onChange as any}
      value={selectedLanguage}
    />
  )
}

export default LanguageSelector
