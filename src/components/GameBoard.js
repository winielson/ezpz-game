import { useState, useEffect } from 'react'
import ScoreBoard from './ScoreBoard';

const WIDTH = 8;
const CANDY_COLORS = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple'
];

export default function GameBoard() {
    const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
    const [squareBeingDragged, setSquareBeingDragged] = useState(null);
    const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
    const [scoreDisplay, setScoreDisplay] = useState([0]);

    const createBoard = () => {
        const randomColorArrangement = [];

        for(let i = 0; i < WIDTH * WIDTH; i++) {
            const randomColor = CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
            randomColorArrangement.push(randomColor);
        }

        setCurrentColorArrangement(randomColorArrangement);
    }

    const checkForColumnOfFour = () => {
        for(let i = 0; i <= 39; i++) {
            const columnOfFour = [i, i+WIDTH, i+WIDTH*2, i+WIDTH*3];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] === '';

            // Clear the column of three when they all have the same color
            if(columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => parseInt(score) + 4);
                columnOfFour.forEach(square => currentColorArrangement[square] = ''); 
                return true;
            }
        }
    }

    const checkForColumnOfThree = () => {
        for(let i = 0; i <= 47; i++) {
            const columnOfThree = [i, i+WIDTH, i+WIDTH*2];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] === '';

            // Clear the column of three when they all have the same color
            if(columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => parseInt(score) + 3);
                columnOfThree.forEach(square => currentColorArrangement[square] = ''); 
                return true;
            }
        }
    }

    const checkForRowOfFour = () => {
        for(let i = 0; i < 64; i++) {
            const rowOfFour = [i, i+1, i+2, i+3];
            const decidedColor = currentColorArrangement[i];
            const notValid = [6, 7, 17, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
            const isBlank = currentColorArrangement[i] === '';

            // Don't check if there can't be a row of three (when i does not have two squares after it in its row)
            if(notValid.includes(i)) continue

            // Clear the column of three when they all have the same color
            if(rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => parseInt(score) + 4);
                rowOfFour.forEach(square => currentColorArrangement[square] = ''); 
                return true;
            }
        }
    }

    const checkForRowOfThree = () => {
        for(let i = 0; i < 64; i++) {
            const rowOfThree = [i, i+1, i+2];
            const decidedColor = currentColorArrangement[i];
            const notValid = [5, 6, 7, 16, 17, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];
            const isBlank = currentColorArrangement[i] === '';

            // Don't check if there can't be a row of three (when i does not have two squares after it in its row)
            if(notValid.includes(i)) continue

            // Clear the column of three when they all have the same color
            if(rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => parseInt(score) + 3);
                rowOfThree.forEach(square => currentColorArrangement[square] = ''); 
                return true;
            }
        }
    }

    const dragStart = (e) => {
        console.log('drag start')   
        setSquareBeingDragged(e.target);
    }

    const dragDrop = (e) => {
        console.log('drag drop')   
        setSquareBeingReplaced(e.target);
    }

    const dragEnd = () => {     
        console.log('drag end')   
        const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));
        const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));

        // currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.style.backgroundColor;
        // currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.style.backgroundColor;

        // Define vertical and horizontal moveset (can only move square over by one place vertically or horizontally)
        const validMoves = [
            squareBeingDraggedId + 1,
            squareBeingDraggedId + WIDTH,
            squareBeingDraggedId - 1,
            squareBeingDraggedId - WIDTH
        ]

        const validMove = validMoves.includes(squareBeingReplacedId);

        console.log(squareBeingDraggedId, validMove);

        // Only allow replacement if move creates a row or column of three or four
        if(validMove) {
            currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.style.backgroundColor;
            currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.style.backgroundColor;

            const isAColumnOfFour = checkForColumnOfFour()
            const isAColumnOfThree = checkForColumnOfThree();
            const isARowOfFour = checkForRowOfFour();
            const isARowOfThree = checkForRowOfThree();

            if(squareBeingReplacedId && (isAColumnOfFour || isAColumnOfThree || isARowOfFour || isARowOfThree)) {    
                setSquareBeingDragged(null);
                setSquareBeingReplaced(null);
            }
            else {
                // Put square back into initial place
                currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.style.backgroundColor;
                currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.style.backgroundColor;
                setCurrentColorArrangement([...currentColorArrangement]);
            }
        }
    }
    
    useEffect(() => {
        createBoard();
    }, []);

    // Check for columns of three and four
    useEffect(() => {
        const moveIntoSquareBelow = () => {
            for(let i = 0; i <= 55; i++) {
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);

                // Generate new squares for first row if square is blank
                if(isFirstRow && currentColorArrangement[i] === '') {
                    let randomNumber = Math.floor(Math.random() * CANDY_COLORS.length);
                    currentColorArrangement[i] = CANDY_COLORS[randomNumber];
                }

                if (currentColorArrangement[i + WIDTH] === '') {
                    currentColorArrangement[i + WIDTH] = currentColorArrangement[i]; // Move square down if the square under it is blank
                    currentColorArrangement[i] = '';
                }
            }
        }

        const timer = setInterval(() => {
            checkForColumnOfFour();
            checkForColumnOfThree();
            checkForRowOfFour();
            checkForRowOfThree();
            moveIntoSquareBelow();
            setCurrentColorArrangement([...currentColorArrangement]);
        }, 100);

        return () => clearInterval(timer);

    //}, [currentColorArrangement]);
     }, [currentColorArrangement, checkForColumnOfFour, checkForColumnOfThree, checkForRowOfFour, checkForRowOfThree]);

    return (
        <div className='game'>

            {currentColorArrangement.map((candyColor, index) => (
                <img
                    key={index}
                    style={{backgroundColor: candyColor}}
                    alt={candyColor}
                    data-id={index}
                    draggable={true}
                    onDragStart={dragStart}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                    onDragLeave={(e) => e.preventDefault()}
                    onDrop={dragDrop}
                    onDragEnd={dragEnd}
                />
            ))}
            <div className='scoreBoard'>
                <ScoreBoard score={scoreDisplay}/>
            </div>            
        </div>
    )
}
