import { Component } from "react"
import { KeyboardKey } from "./KeyboardKey";
import './Keyboard.scss';

type KeyboardProps = {
    showResult: boolean,
    onKeyboardClick: (id: number) => void,
    result: number
}
export class Keyboard extends Component<KeyboardProps> {

    private tens: number[][] = [];

    constructor(props: KeyboardProps) {
        super(props)
        for (let i = 0; i <= 9; i += 1) {
            const ten: number[] = []
            for (let j = 0; j <= 9; j += 1) {
                ten.push(10 * i + j)
            }
            this.tens.push(ten)
        }
        this.onKeyboardKeyPressed = this.onKeyboardKeyPressed.bind(this);
    }

    onKeyboardKeyPressed(value: number): void {
        this.props.onKeyboardClick(value)
    }

    render() {
        return <div className="keyboard-item">
            <table>
                <tbody>
                    {this.tens.map( (column, index) => (
                        <tr key={`r-${index}`} >
                            {column.map((value) => (
                                <td key={`c-${value}`}>
                                    <KeyboardKey
                                        showResult={this.props.showResult}
                                        onClick={this.onKeyboardKeyPressed}
                                        value={value}
                                        correct={this.props.result === value} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    }
}
