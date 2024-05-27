import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import Container from 'Views/Container'
import { Bg } from 'Components/Bg'
import Updater from 'Components/Updater'
import { AdapterProvider } from 'Stores/Adapter/AdapterProvider'
import { BalancesProvider } from 'Stores/Balances/BalancesProvider'
import { TransactionsProvider } from 'Stores/Transactions/TransactionsProvider'
import { LoadingProvider } from 'Stores/Loading/LoadingProvider'
import { ToastProvider } from 'react-toast-notifications'
import { PoolsProvider } from 'Stores/Pools/PoolsProvider'
import { ConfigProvider } from './Stores/Config/ConfigProvider'
import i18next from './i18n'

import './App.scss'
import TopHeader from './Components/TopHeader'

function App() {
  return (
    <div className="App">
      <Bg />

      <LoadingProvider>
        <ToastProvider autoDismissTimeout={3000} autoDismiss={true}>
          <ConfigProvider>
            <TransactionsProvider>
              <AdapterProvider>
                <BalancesProvider>
                  <PoolsProvider>
                    <I18nextProvider i18n={i18next}>
                      <TopHeader />
                      <Router basename="/derivatives">
                        <Updater>
                          <Container />
                        </Updater>
                      </Router>
                    </I18nextProvider>
                  </PoolsProvider>
                </BalancesProvider>
              </AdapterProvider>
            </TransactionsProvider>
          </ConfigProvider>
        </ToastProvider>
      </LoadingProvider>
    </div>
  )
}

export default App
