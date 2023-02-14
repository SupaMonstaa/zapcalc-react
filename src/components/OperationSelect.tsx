import OperationKind from "../types/OperationKind"
import { SwitchInput } from "./SwitchInput"
import "./OperationSelect.scss"

type OperationSelectProps = {
    initValue: string
    onChange: (value: OperationKind) => void
}

export function OperationSelect(props: OperationSelectProps) {

    const switchData = [
        {
            label: '+',
            value: 'addition'
        },
        {
            label: '-',
            value: 'substraction'
        },
        {
            label: '×',
            value: 'multiplication'
        },
        {
            label: '÷',
            value: 'division'
        },
        {
            label: '+ - × ÷',
            value: 'mix'
        }
    ]
    function onChange(v: string): void {
        props.onChange(v as OperationKind)
    }
    return (
        <div className="operation-select">
            <SwitchInput slots={[]} onChange={onChange} switchData={switchData} initValue={props.initValue.toString()} />
        </div>
    )
}
