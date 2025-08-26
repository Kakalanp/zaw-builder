import React, { useState, useEffect } from 'react'
import './App.css'
import { ReactComponent as Share } from '../assets/icons/share.svg'
import getExtraStats from '../modules/helperFunctions'
import grips from '../modules/grip'
import links from '../modules/link'
import strikes from '../modules/strike'
import PropTypes from 'prop-types'

const BASE_URL = 'https://kakalanp.github.io/zaw-builder'

const App = ({ initialZawParts }) => {
  const [zawParts, setZawParts] = useState(() => initialZawParts || {
    strike: {},
    grip: {},
    link: {}
  })

  const [zawStats, setZawStats] = useState({})

  useEffect(() => {
    if ((Object.keys(zawParts.strike).length !== 0) &&
        (Object.keys(zawParts.grip).length !== 0) &&
        (Object.keys(zawParts.link).length !== 0)) {
      createZaw()
      document.getElementById('zaw-stats').classList.remove('disabled')
    }
  }, [zawParts])

  useEffect(() => {
    const orbs = document.getElementsByClassName('orb')
    const orbCount = orbs.length
    for (let i = 0; i < orbCount; i++) {
      orbs[0].remove()
    }
    const zawStatsContainer = document.getElementById('zaw-stats')
    if (zawStatsContainer && !(zawStatsContainer.classList.contains('disabled'))) {
      orb = document.createElement('div')
      orb.classList.add('orb')
      zawStatsContainer.insertBefore(orb, zawStatsContainer.firstChild)
      startingOrbCords = orb.getBoundingClientRect()
      orb.style.transform = 'translate(-50%,-50%)'
    }
  }, [zawStats])

  function OpenPieceSelection (piece) {
    document.getElementById(`${piece}-selector`).classList.remove('disabled')
    document.getElementById('builder').classList.add('disabled')
  }

  function SelectPiece (piece, part) {
    document.getElementById(`${piece}-selector`).classList.add('disabled')
    document.getElementById('builder').classList.remove('disabled')

    setZawParts({ ...zawParts, [piece]: { ...part } })
  }

  function createZaw () {
    const finalDamageMultiplier = zawParts.grip.type ? zawParts.strike.twoHandedMultiplier : 1
    const zawType = zawParts.grip.type ? zawParts.strike.type2 : zawParts.strike.type1
    const zawDamage = ((zawParts.strike.dmg + zawParts.grip.dmgMod + zawParts.link.dmgMod) * finalDamageMultiplier).toFixed()
    const zawExtraStats = getExtraStats(zawType)
    setZawStats({
      speed: (zawParts.grip.speed + zawParts.strike.spdMod + zawParts.link.spdMod).toFixed(3),
      type: zawType,
      // DMG
      dmgTotal: zawDamage,
      dmgType: zawParts.strike.dmgType,
      crtChance: zawParts.strike.critChance + zawParts.link.crtMod,
      crtMultiplier: zawParts.strike.critMulti.toFixed(1),
      statusChance: zawParts.strike.statusChance + zawParts.link.stsMod,
      slash: Math.round((zawDamage * (zawParts.strike.slash / 100)) * 10) / 10,
      impact: Math.round((zawDamage * (zawParts.strike.impact / 100)) * 10) / 10,
      puncture: Math.round((zawDamage * (zawParts.strike.puncture / 100)) * 10) / 10,
      viral: Math.round((zawDamage * (zawParts.strike.viral / 100)) * 10) / 10,
      // heavy attack
      heavyDmg: zawExtraStats.heavyMultiplier * zawDamage,
      heavySlamAtk: zawExtraStats.heavySlamMultiplier * zawDamage,
      heavySlamRadialDmg: zawExtraStats.heavySlamMultiplier * zawDamage,
      heavySlamRadius: 'WIP', // No info on wiki, have to do my own research
      windUp: zawExtraStats.windUp,
      // extras
      stancePolarity: zawParts.grip.type ? zawParts.strike.polarity2 : zawParts.strike.polarity1,
      range: zawParts.grip.type ? zawParts.strike.range2 : zawParts.strike.range1,
      slamAtk: zawExtraStats.slamMultiplier * zawDamage,
      slamRadialDmg: zawDamage,
      slamRadius: `${zawExtraStats.slamRadius}m`,
      slideAtk: 'WIP', // No info on wiki, have to do my own research
      blockAngle: zawExtraStats.blockAngle,
      comboDuration: 5,
      followThrough: zawExtraStats.followThrough
    })
  }

  const rotate = (e) => {
    if (e.target.classList.contains('rotated')) {
      const rotatedElements = document.getElementsByClassName('rotated')
      const rotatedElementsCount = rotatedElements.length
      for (let i = 0; i < rotatedElementsCount; i++) {
        rotatedElements[0].classList.remove('rotated')
      }
    } else e.target.classList.toggle('rotated')
  }

  const copyZawToClipboard = () => {
    console.log(`sharing: ${BASE_URL}/${zawParts.strike.name.replace(/\s+/g, '-')}/${zawParts.grip.name.replace(/\s+/g, '-')}/${zawParts.link.name.replace(/\s+/g, '-')}`)
  }

  let orb = ''
  let startingOrbCords = ''

  document.body.onpointermove = (cords) => {
    const { clientX, clientY } = cords

    orb.animate({
      left: `${clientX - startingOrbCords.x}px`,
      top: `${clientY - startingOrbCords.y}px`
    }, { duration: 2000, fill: 'forwards' })

    setTimeout(() => {
      orb.style.opacity = '0.1'
    }, 1000)
  }

  const handleEvent = (e, piece, part) => {
    e.target.classList.contains('rotated') && setTimeout(SelectPiece, 500, piece, part)
    rotate(e)
  }

  return (
    <>
      <div id='builder'>
        <div className='piece' onKeyDown={e => e.key === 'Enter' && OpenPieceSelection('strike')} onClick={() => OpenPieceSelection('strike')} tabIndex="0">
          <div className='piece-img'>
            <img src={zawParts.strike.img && require('../assets/images/strike/' + zawParts.strike.img + '.png')}></img>
          </div>
          <div className='piece-text'>
            <h3>{zawParts.strike.name ? zawParts.strike.name : 'NONE'}</h3>
            <p>Strike</p>
          </div>
        </div>
        <div className='piece' onKeyDown={e => e.key === 'Enter' && OpenPieceSelection('grip')} onClick={() => OpenPieceSelection('grip')} tabIndex="0">
          <div className='piece-img'>
            <img src={zawParts.grip.img && require('../assets/images/grip/' + zawParts.grip.img + '.png')}></img>
          </div>
          <div className='piece-text'>
            <h3>{zawParts.grip.name ? zawParts.grip.name : 'NONE'}</h3>
            <p>Grip</p>
          </div>
        </div>
        <div className='piece' onKeyDown={e => e.key === 'Enter' && OpenPieceSelection('link')} onClick={() => OpenPieceSelection('link')} tabIndex="0">
          <div className='piece-img'>
            <img src={zawParts.link.img && require('../assets/images/link/' + zawParts.link.img + '.png')}></img>
          </div>
          <div className='piece-text'>
            <h3>{zawParts.link.name ? zawParts.link.name : 'NONE'}</h3>
            <p>Link</p>
          </div>
        </div>
      </div>

      <div className='selector'>
        <div id='strike-selector' className='disabled'>
          <h2>Strikes:</h2>
          <div className='part-layout'>
            {strikes.map(part => {
              return (
                  <div key={part.name} className="part-inner" tabIndex="0" onKeyDown={e => e.key === 'Enter' && handleEvent(e, 'strike', part)} onClick={e => handleEvent(e, 'strike', part)}>
                    <div className="part-front">
                      <img src={require('../assets/images/strike/' + part.img + '.png')} alt={part.name} />
                      <h3 className='part-name'>{part.name}</h3>
                    </div>
                    <div className="part-back">
                      <h3>{part.name}</h3>
                      <p>{part.spdMod === 0 ? '' : `Speed: ${part.spdMod > 0 ? '+' : ''}${part.spdMod}`}</p>
                      <p>Total damage: {part.dmg}</p>
                      <p>Crit chance: {`${part.critChance}%`}</p>
                      <p>Crit damage: {`${part.critMulti} X`}</p>
                      <p>Status: {`${part.statusChance}%`}</p>
                    </div>
                  </div>
              )
            })}
          </div>
        </div>
        <div id='grip-selector' className='disabled'>
          <h2>Grips:</h2>
          <div className='part-layout'>
            {grips.map(part => {
              return (
                <div key={part.name} className="part-inner" tabIndex="0" onKeyDown={e => e.key === 'Enter' && handleEvent(e, 'grip', part)} onClick={e => handleEvent(e, 'grip', part)}>
                    <div className="part-front">
                      <img src={require('../assets/images/grip/' + part.img + '.png')} alt={part.name} />
                      <h3 className='part-name'>{part.name}</h3>
                    </div>
                    <div className="part-back">
                      <h3>{part.name}</h3>
                      <p>Speed: {part.speed}</p>
                      <p>{part.type ? 'Two' : 'One'}-handed</p>
                      <p>{part.dmgMod === 0 ? '' : `Damage: ${part.dmgMod > 0 ? '+' : ''}${part.dmgMod}`}</p>
                    </div>
                  </div>
              )
            })}
          </div>
        </div>
        <div id='link-selector' className='disabled'>
          <h2>Links:</h2>
          <div className='part-layout'>
            {links.map(part => {
              return (
                  <div key={part.name} className="part-inner" tabIndex="0" onKeyDown={e => e.key === 'Enter' && handleEvent(e, 'link', part)} onClick={e => handleEvent(e, 'link', part)}>
                    <div className="part-front">
                      <img src={require('../assets/images/link/' + part.img + '.png')} alt={part.name} />
                      <h3 className='part-name'>{part.name}</h3>
                    </div>
                    <div className="part-back">
                      <h3>{part.name}</h3>
                      <p>{part.spdMod === 0 ? '' : `Speed: ${part.spdMod > 0 ? '+' : ''}${part.spdMod}`}</p>
                      <p>{part.dmgMod === 0 ? '' : `Damage: ${part.dmgMod > 0 ? '+' : ''}${part.dmgMod}`}</p>
                      <p>{part.crtMod === 0 ? '' : `Crit chance: ${part.crtMod > 0 ? '+' : ''}${part.crtMod}`}</p>
                      <p>{part.stsMod === 0 ? '' : `Status chance: ${part.stsMod > 0 ? '+' : ''}${part.stsMod}`}</p>
                    </div>
                  </div>
              )
            })}
          </div>
        </div>
      </div>
      <div id='zaw-stats' className='disabled' tabIndex="0">
        <Share onClick={copyZawToClipboard} />
        <h3>PRIMARY:</h3>
        <p>Type: {zawStats.type}</p>
        <p>Speed: {zawStats.speed}</p>
        <p>Range: {zawStats.range}</p>
        <h3>DAMAGE:</h3>
        <p>Crit chance: {`${zawStats.crtChance}%`}</p>
        <p>Crit damage: {`${zawStats.crtMultiplier} X`}</p>
        <p>Status chance: {`${zawStats.statusChance}%`}</p>
        <p>Impact: {zawStats.impact} {`(${Math.round(zawStats.impact * 100 / zawStats.dmgTotal)}%)`}</p>
        <p>Puncture: {zawStats.puncture} {`(${Math.round(zawStats.puncture * 100 / zawStats.dmgTotal)}%)`}</p>
        <p>Slash: {zawStats.slash} {`(${Math.round(zawStats.slash * 100 / zawStats.dmgTotal)}%)`}</p>
        {zawStats.viral > 0 && (<p>Viral: {zawStats.viral} {`(${Math.round(zawStats.viral * 100 / zawStats.dmgTotal)}%)`}</p>)}
        <h3>Total: {zawStats.dmgTotal} {zawStats.dmgType}</h3>
      </div>

    </>
  )
}

App.propTypes = {
  initialZawParts: PropTypes.shape({
    strike: PropTypes.object,
    grip: PropTypes.object,
    link: PropTypes.object
  })
}

export default App
