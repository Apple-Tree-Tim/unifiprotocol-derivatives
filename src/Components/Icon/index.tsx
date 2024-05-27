import React from 'react'

import { ReactComponent as Plumber } from 'Assets/Icons/plumber.svg'
import { ReactComponent as UP } from 'Assets/Tokens/UP.svg'
import { ReactComponent as UL } from 'Assets/Tokens/UL.svg'

import SUN from 'Assets/Tokens/SUN.png'
import USDJ from 'Assets/Tokens/USDJ.png'
import DICE from 'Assets/Tokens/DICE.png'
import DZI from 'Assets/Tokens/DZI.png'
import MX from 'Assets/Tokens/MX.png'
import DACC from 'Assets/Tokens/DACC.png'
import DFK from 'Assets/Tokens/DFK.png'
import PEARL from 'Assets/Tokens/PEARL.png'
import SEED from 'Assets/Tokens/SEED.png'
import JST from 'Assets/Tokens/JST.png'
import WIN from 'Assets/Tokens/WIN.png'
import BNKR from 'Assets/Tokens/BNKR.png'
import KLV from 'Assets/Tokens/KLV.png'
import JFI from 'Assets/Tokens/JFI.png'
import TRX from 'Assets/Tokens/TRX.png'
import TAI from 'Assets/Tokens/TAI.png'
import LIVE from 'Assets/Tokens/LIVE.png'
import USDT from 'Assets/Tokens/USDT.png'
import JT from 'Assets/Tokens/JT.png'
import ANK from 'Assets/Tokens/ANK.png'
import BRG from 'Assets/Tokens/BRG.png'
import SOUL from 'Assets/Tokens/SOUL.png'
import COLA from 'Assets/Tokens/COLA.png'
import PETRO from 'Assets/Tokens/PETRO.png'
import ONTd from 'Assets/Tokens/ONTd.png'
import ONT from 'Assets/Tokens/ONT.png'
import ONG from 'Assets/Tokens/ONG.png'
import WING from 'Assets/Tokens/WING.png'
import EIGHTEIGHTEIGHT from 'Assets/Tokens/888.png'

import './Icon.scss'

export const IconLib: { [iconName: string]: React.FC } = {
  Plumber,
  UP: () => <UP />,
  uUP: () => <UP />,
  UPtrx: () => <UP />,
  UPont: () => <UP />,
  UL: () => <UL />,

  SUN: () => <img src={SUN} alt="SUN" />,
  uSUN: () => <img src={SUN} alt="uSUN" />,
  USDJ: () => <img src={USDJ} alt="USDJ" />,
  uUSDJ: () => <img src={USDJ} alt="uUSDJ" />,
  DICE: () => <img src={DICE} alt="DICE" />,
  DZI: () => <img src={DZI} alt="DZI" />,
  MX: () => <img src={MX} alt="MX" />,
  DACC: () => <img src={DACC} alt="DACC" />,
  DFK: () => <img src={DFK} alt="DFK" />,
  PEARL: () => <img src={PEARL} alt="PEARL" />,
  SEED: () => <img src={SEED} alt="SEED" />,
  uSEED: () => <img src={SEED} alt="uSEED" />,
  JST: () => <img src={JST} alt="JST" />,
  uJST: () => <img src={JST} alt="uJST" />,
  WIN: () => <img src={WIN} alt="WIN" />,
  BNKR: () => <img src={BNKR} alt="BNKR" />,
  KLV: () => <img src={KLV} alt="KLV" />,
  JFI: () => <img src={JFI} alt="JFI" />,
  TRX: () => <img src={TRX} alt="TRX" />,
  TAI: () => <img src={TAI} alt="TAI" />,
  LIVE: () => <img src={LIVE} alt="LIVE" />,
  USDT: () => <img src={USDT} alt="USDT" />,
  uUSDT: () => <img src={USDT} alt="uUSDT" />,
  JT: () => <img src={JT} alt="JT" />,
  ANK: () => <img src={ANK} alt="ANK" />,
  BRG: () => <img src={BRG} alt="BRG" />,
  '888': () => <img src={EIGHTEIGHTEIGHT} alt="888" />,
  SOUL: () => <img src={SOUL} alt="SOUL" />,
  COLA: () => <img src={COLA} alt="COLA" />,
  PETRO: () => <img src={PETRO} alt="PETRO" />,
  ONTd: () => <img src={ONTd} alt="ONTd" />,
  ONT: () => <img src={ONT} alt="ONT" />,
  WING: () => <img src={WING} alt="WING" />,
  ONG: () => <img src={ONG} alt="ONG" />
}

export const Icon: React.FC<{ icon: string }> = ({ icon }) => {
  if (IconLib[icon]) {
    const IconComp = IconLib[icon]
    return <IconComp />
  }
  return null
}
