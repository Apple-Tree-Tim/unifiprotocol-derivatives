import React from 'react'
import { useLoading } from 'Stores/Loading/useLoading'
import LinearProgress from '@material-ui/core/LinearProgress'

import './Loading.scss'

const Loading: React.FC = () => {
  const { isLoading } = useLoading()

  return <div className="Loading">{isLoading && <LinearProgress />}</div>
}

export default Loading
