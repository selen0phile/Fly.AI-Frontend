import { useState } from 'react';
import { useSpeechRecognition } from 'react-speech-kit';

function Dictaphone() {
    const [value, setValue] = useState('')
    const { listen, stop } = useSpeechRecognition({
        onResult: (result) => {
            setValue(result)
        }
    })

    return (
        <div>
            <textarea
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
            <button onMouseDown={listen} onMouseUp={stop}>
                Talk
            </button>
        </div>
    )
}
export default Dictaphone