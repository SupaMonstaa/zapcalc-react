import { FunctionComponent, ReactElement, useRef } from "react";
import './KeyboardKey.scss';


type KeyboardKeyProps = {
    value: number,
    correct: boolean,
    showResult: boolean,
    onClick:(value:number) => void
  }

export const KeyboardKey:FunctionComponent<KeyboardKeyProps> = ({
    value,
    correct,
    showResult,
    onClick
}):ReactElement =>  {
    const buttonRef = useRef<HTMLButtonElement>(null)
    function handleClick(e:React.MouseEvent<HTMLElement>) {
        const btn = buttonRef.current as HTMLButtonElement
        e.preventDefault();
        btn.classList.add('active')
        setTimeout(() => {
            onClick(value)
            btn.classList.remove('active')
        }, 200)
      }
    function getButtonClass (): string {
        const clss = Math.floor(value/10) % 2 ? 'odd' : 'even'
        return `keyboard-key ${clss} ${correct ? 'correct' : 'wrong'}${showResult ? ' show' : ''}`
    }
    return (
        <button ref={buttonRef} className={getButtonClass()} onClick={handleClick}>{ value }</button>
    )
}

