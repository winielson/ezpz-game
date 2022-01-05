import React from 'react'

export default function ScoreBoard({score}) {
    return (
        <div className='scoreBoard'>
            <h2>Score: {score}</h2>            
        </div>
    )
}
