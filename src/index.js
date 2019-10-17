import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square"
                onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber +1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                moveLocation: (i + 1)
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        // History is an array of objects. Its length is 1 greater than the total number of moves,
        // and it contains the state of the board for each historical move in an array called "squares"
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // "step" is currentValue, "move" is index
        const moves = history.map((step, move) => {
            // Move will be 0 (falsey) before 1st move, and > 1 (truthy) from 1st move onwards
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            // moveString represents the coordinate of each move on the board, in format (column, row)
            let moveString;
            switch(history[move].moveLocation) {
                case 1:
                    moveString = "(1, 1)";
                    break;
                case 2:
                    moveString = "(2, 1)";
                    break;
                case 3:
                    moveString = "(3, 1)";
                    break;
                case 4:
                    moveString = "(1, 2)";
                    break;
                case 5:
                    moveString = "(2, 2)";
                    break;
                case 6:
                    moveString = "(3, 2)";
                    break;
                case 7:
                    moveString = "(1, 3)";
                    break;
                case 8:
                    moveString = "(2, 3)";
                    break;
                case 9:
                    moveString = "(3, 3)";
                    break;
                default:
                    moveString = '';
            }

            // Renders the button text as bold for the current move (either the last move, or the move the user clicked on
            if (move === this.state.stepNumber) {
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>
                            <strong>{desc}</strong>
                        </button>
                        <span>
                        &nbsp;
                            {moveString}
                    </span>
                    </li>
                );
            } else {
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>
                            {desc}
                        </button>
                        <span>
                        &nbsp;
                            {moveString}
                    </span>
                    </li>
                );
            }

        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
