import React from 'react'
import BottomButton from 'Components/BottomButton'
import { ReportProblemOutlined } from '@material-ui/icons'
import { useConfig } from '../../Stores/Config/useConfig'

import './Warning.scss'

const Warning: React.FC = () => {
  return (
    <div className="Warning">
      <div className="Warning__header">
        <ReportProblemOutlined />
        <span>
          <h1>Important information</h1>
          <ol>
            <li>
              Derivative liquidity tokens are tokens given to liquidity
              providers by DeFi platforms in return for the liquidity provided.
              An example of another platform would be JustSwap. These tokens
              represent the value locked into that liquidity pool and are often
              redeemable on the platform that created them.
            </li>

            <li>
              Users who have provided liquidity to another DeFi platform may
              wish to provide that derivative liquidity token as liquidity on
              uTrade. This may allow the derivative liquidity token holder to
              benefit from rewards on the originating platform, while also using
              the derivative liquidity token to mine UP on uTrade. The same
              initial liquidity may result in mining rewards on multiple
              platforms at the same time. Earn More with Unifi.
            </li>

            <li>
              To <b>provide liquidity</b> to derivative token uPair:
              <ol type="a">
                <li>
                  Some platforms, such as JustSwap, may provide liquidity tokens
                  which are not visible in common wallet applications, like
                  Tronlink. Even if the token is not displayed in Tronlink,
                  uTrade can display and interact with the token.
                </li>
                <li>
                  The user must fund both the trading token and base token in
                  the market determined ratio.
                </li>
                <li>
                  The wallet address used to provide liquidity must be the
                  wallet address that contains the derivative liquidity token.
                  This is normally the address that was used to provide
                  liquidity on the original platform.
                </li>
                <li>
                  uL tokens provided by uTrade for these derivative uPairs will
                  include a reference to the originating platform that issued
                  the original liquidity token. uL tokens are limited to 5
                  characters.
                </li>
                <ol type="i">
                  <li>
                    For example, the USDT liquidity token created by JustSwap
                    will display as S-USDT. The uL token issued by uTrade will
                    be uJSUS. This stands for uTrade-JustSwap-USDT.
                  </li>
                  <li>
                    The USDT liquidity token created by Unifi is uUSDT. The
                    derivative uL token issued by uTrade will be uuUSD
                  </li>
                </ol>
              </ol>
            </li>

            <li>
              Traders may wish to purchase derivative liquidity tokens for
              various reasons, including their potential underlying value.
              <p>
                To <b>trade</b> in a derivative uPair:
              </p>
              <ol type="a">
                <li>
                  The user selects a derivative liquidity token from the
                  dropdown menu which will take them to the derivatives
                  information page. The user must click the “I Agree” button to
                  continue, stating they have read all instructions prior to
                  trading.
                </li>
                <li>
                  Users purchasing derivatives with the intent to redeem them at
                  the originating platform should be aware of the following:
                </li>
                <ol type="i">
                  <li>
                    Derivative liquidity tokens should be redeemed from the same
                    wallet used to purchase the token on uTrade. Transfering the
                    tokens to another wallet and then attempting to redeem them
                    may cause a failure in redemption.
                  </li>
                  <li>
                    uTrade makes no statement of any value, use, redemption
                    value, or legitimacy of any tokens traded on its site,
                    including derivatives.
                  </li>
                </ol>
                <li>
                  Some platforms, such as JustSwap, may provide liquidity tokens
                  which are not visible in common wallet applications, like
                  Tronlink. Even if the token is not displayed in Tronlink,
                  uTrade can display and interact with the token.
                </li>
                <li>
                  If the purchaser intends to redeem the derivative liquidity
                  token, the wallet address used during trading should be the
                  wallet address used to attempt to redeem the token. Redeeming
                  from a new address may cause errors.
                </li>
                <li>
                  Derivative liquidity tokens are labeled by the platform that
                  created them.
                  <ol type="i">
                    <li>
                      For example, the USDT liquidity token created by JustSwap
                      will display as S-USDT.
                    </li>
                    <li>
                      The USDT derivative liquidity token created by Unifi is
                      uUSDT.
                    </li>
                  </ol>
                </li>
              </ol>
            </li>

            <li>
              By pressing the “I Agree” button below and continuing, the user
              agrees:
              <ol type="a">
                <li>
                  Derivative tokens should only be traded by advanced users who
                  understand and accept the nature of the derivative market, the
                  inherent risks, and are closely monitoring the social media of
                  Unifi and the platform(s) where the tokens originated.
                </li>
                <li>
                  Market conditions, updates by the token originator, or other
                  factors may inhibit the ability of the user to redeem these
                  tokens for any value.
                </li>
                <li>
                  Unifi makes no statement to warranty any financial value,
                  authenticity, or ability to use, transact,exchange, or
                  interact with in any way, tokens listed in uPairs on uTrade.
                </li>
                <li>
                  Trading in digital assets contains inherent risk, which the
                  user attest to understanding, and includes but is not limited
                  to the loss of involved funds.
                </li>
                <li>
                  The user understands it is their responsibility to determine
                  if any activity on Unifi would violate any rule, law,
                  regulatory oversight, or the rules/laws/regulations of any
                  supervisory authority the user might be subject to. No offer
                  for use of any Unifi Protocol platform or features is made
                  anyone who is violating any rule/law/regulation by such use.
                </li>
              </ol>
            </li>
          </ol>
        </span>
      </div>

      <div className="Wrapper-Bottom-Button">
        <SubmitWarningButton />
      </div>
    </div>
  )
}

const SubmitWarningButton = () => {
  const { acceptAgreement } = useConfig()

  const callback = () => {
    acceptAgreement()
  }

  return <BottomButton label="I accept" onClick={callback} />
}

export { Warning }
