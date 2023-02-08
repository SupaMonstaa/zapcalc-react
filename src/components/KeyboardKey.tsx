import { ReactElement, useRef } from "react";
import './KeyboardKey.scss';


type KeyboardKeyProps = {
    value: number,
    correct: boolean,
    showResult: boolean,
    onClick:(value:number) => void
  }

export function KeyboardKey(props:KeyboardKeyProps):ReactElement {
    const buttonRef = useRef<HTMLButtonElement>(null)
    function handleClick(e:React.MouseEvent<HTMLElement>) {
        const btn = buttonRef.current as HTMLButtonElement
        e.preventDefault();
        btn.classList.add('active')
        setTimeout(() => {
            props.onClick(props.value)
            btn.classList.remove('active')
        }, 200)
      }
    function getButtonClass (): string {
        const clss = Math.floor(props.value/10) % 2 ? 'odd' : 'even'
        return `${clss} ${props.correct ? 'correct' : 'wrong'}${props.showResult ? ' show' : ''}`
    }
    return (
        <button ref={buttonRef} className={getButtonClass()} onClick={handleClick}>{ props.value }</button>
    )
}

