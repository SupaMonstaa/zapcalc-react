import './StartButton.scss';

type StartButtonProps = {
    gameTimeLeft: number,
    gameDuration: number,
    onStart: () => void
}

export function StartButton(props: StartButtonProps) {
    function getSeconds(): string {
        return props.gameTimeLeft < 0 ? 'Start' : `${props.gameTimeLeft}`
    }

    function getBackgroundImage(): { backgroundImage: string, backgroundColor?: string } {
        if (props.gameTimeLeft >= 0) {
            const deg = Math.floor(360 * (props.gameTimeLeft / props.gameDuration))
            const color = '#eb5648'
            if (deg < 180) {
                return {
                    backgroundImage: `linear-gradient(${90 - deg}deg,${color} 50%,transparent 50%),linear-gradient(90deg,#fff 50%,${color} 50%)`
                }
            }
            return {
                backgroundImage: `linear-gradient(${90 - deg}deg,transparent 50%,#fff 50%),linear-gradient(90deg,#fff 50%,${color} 50%)`
            }
        }
        return {
            backgroundImage: 'none',
            backgroundColor: '#ffffff'
        }
    }

    function startGame(): void {
        props.onStart()
    }

    return (
        <button onClick={startGame} className="start-game" style={getBackgroundImage()}>
            <span>{getSeconds()}</span>
        </button>
    )
}
