import React, { useMemo } from 'react'
import * as MaterialIcons from '@material-ui/icons'
import { Icon, IconLib } from '../Icon'

import './Button.scss'

const Button: React.FC<{
  onClick?: () => void
  disabled?: boolean
  white?: boolean
  blue?: boolean
  green?: boolean
  purple?: boolean
  icon?: string
}> = (props) => {
  const classes = useMemo(() => {
    const clss: string[] = []
    props.white && clss.push('white')
    props.blue && clss.push('blue')
    props.green && clss.push('green')
    props.purple && clss.push('purple')
    return clss.join(' ')
  }, [props])

  const IconComponent = useMemo(() => {
    if (props.icon) {
      if ((MaterialIcons as any)[props.icon]) {
        return (MaterialIcons as any)[props.icon]
      }

      if (IconLib[props.icon]) {
        return () => <Icon icon={props.icon!} />
      }
    }

    return null
  }, [props.icon])

  return (
    <button
      className={`Button ${classes}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {IconComponent && (
        <span className="Button__icon">
          <IconComponent />
        </span>
      )}
      <span>{props.children}</span>
    </button>
  )
}

export default Button
