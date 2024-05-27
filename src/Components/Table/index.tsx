import React from 'react'

import './Table.scss'

export const Table: React.FC = (props) => {
  return <table className={`Table`}>{props.children}</table>
}

export const TableHeader: React.FC<{
  columns: (string | React.ReactElement)[]
}> = (props) => {
  return (
    <tr>
      {props.columns.map((c, i) => (
        <th key={`header-${i}`}>{c}</th>
      ))}
    </tr>
  )
}

export const TableRow: React.FC<{
  columns: (string | React.ReactElement)[]
  onClick?: () => void
}> = (props) => {
  return (
    <tr className="table-row" onClick={props.onClick}>
      {props.columns.map((c, i) => (
        <td key={`row-${i}`}>{c}</td>
      ))}
    </tr>
  )
}
