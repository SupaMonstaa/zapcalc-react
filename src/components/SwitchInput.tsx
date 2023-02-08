import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./SwitchInput.scss"

type SwitchInputProps = {
    onChange: (v: string) => void,
    initValue: string,
    slots:Array<any>,
    switchData: Array<any>,
}

let componentId = 0;

export function SwitchInput(props: SwitchInputProps) {

    // increment id to create unique component Id
    componentId += 1
    const id = `switch-input-${componentId}`
    const inputRef = useRef<HTMLInputElement>(null)

    // adjust cursor width to the number of inputs
    let cIndex = 0
    for (let i = 0; i < props.switchData.length; i += 1) {
        if (props.initValue === props.switchData[i].value) {
            cIndex = i
            break
        }
    }
    const [cursorIndex, setCursorIndex] = useState(cIndex);

    function onChange(e:ChangeEvent<HTMLInputElement>): void {
        const newValue = parseInt(e.target.value)
        if (newValue !== cursorIndex) {
            moveIndicator(parseInt(e.target.value))
        }
    }
    /**
     * move the indicator to the label of the given input
     */
    function moveIndicator(cIndex: number): void {
        setCursorIndex(cIndex)
        props.onChange(props.switchData[cIndex].value)
    }

    useEffect(() => {
        const percent = 100 - 100 / props.switchData.length
        if (inputRef.current) {
            inputRef.current.style.width = `calc(${percent}% + 4vh)`
            moveIndicator(cursorIndex)
        }
    }, [])
    return (
        <div className="switch">
            <input ref={inputRef} value={cursorIndex} onChange={onChange} type="range" id={id} name={id}
                min="0" max={props.switchData.length - 1} />
            <div className="labels">
                {props.switchData.map((input, index) => (
                   <div key={`${id}-label-${index}`} className="label">
                   {!input.label && props.slots[index]}
                    <span>{input.label}</span>
                </div>
                ))}
            </div>
        </div >
    )
}
