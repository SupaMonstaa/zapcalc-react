import { SwitchInput } from "./SwitchInput"
import star from '../assets/images/star.png'
import './LevelSelect.scss'

type LevelSelectProps = {
    onChange: (v: number) => void,
    initValue: number,
}
export function LevelSelect(props: LevelSelectProps) {
    const switchData = [
        {
            label: '',
            value: '1'
        },
        {
            label: '',
            value: '2'
        },
        {
            label: '',
            value: '3'
        }
    ]
    function onSwitchChange(v: string): void {
        props.onChange(parseInt(v, 0))
    }


    const slots = [
        (<img src={star} alt="star"/>),
        (<>
            <img src={star} alt="star"/>
            <img src={star} alt="star"/>
        </>),
        (<><img src={star} alt="star"/>
            <img src={star} alt="star"/>
            <img src={star} alt="star"/></>)
    ]
    return (
        <div className="sel level-select">
            <SwitchInput onChange={onSwitchChange}
                switchData={switchData} initValue={props.initValue.toString()}
                slots={slots} />
        </div>
    )
}