import { ChangeEvent, FunctionComponent, useEffect, useRef, useState } from "react";
import "./SwitchInput.scss"

type SwitchInputProps = {
    onChange: (v: string) => void,
    initValue: string,
    slots:Array<any>,
    switchData: Array<any>,
}

let componentId = 0;

export const SwitchInput:FunctionComponent<SwitchInputProps> = (
    {
        onChange,
        initValue,
        slots,
        switchData
    }
) => {

    // increment id to create unique component Id
    componentId += 1
    const id = `switch-input-${componentId}`
    const inputRef = useRef<HTMLInputElement>(null)

    // adjust cursor width to the number of inputs
    let cIndex = 0
    for (let i = 0; i < switchData.length; i += 1) {
        if (initValue === switchData[i].value) {
            cIndex = i
            break
        }
    }
    const [cursorIndex, setCursorIndex] = useState(cIndex);

    function onCursorChange(e:ChangeEvent<HTMLInputElement>): void {
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
        onChange(switchData[cIndex].value)
    }

    useEffect(() => {
        const percent = 100 - 100 / switchData.length
        if (inputRef.current) {
            inputRef.current.style.width = `calc(${percent}% + 4vh)`
            moveIndicator(cursorIndex)
        }
    }, [])
    return (
        <div className="switch">
            <input ref={inputRef} value={cursorIndex} onChange={onCursorChange} type="range" id={id} name={id}
                min="0" max={switchData.length - 1} />
            <div className="labels">
                {switchData.map((input, index) => (
                   <div key={`${id}-label-${index}`} className="label">
                   {!input.label && slots[index]}
                    <span>{input.label}</span>
                </div>
                ))}
            </div>
        </div >
    )
}
