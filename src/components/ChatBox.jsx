import React from "react";
import { ChatFeed, ChatBubble, BubbleGroup, Message } from "react-chat-ui";
import "../App.css"
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Link, TextField } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import LinearProgress from '@mui/material/LinearProgress';
import apiURL from "../Config"
import { useRef } from "react";
import { useSpeechRecognition } from 'react-speech-kit';
import { useEffect } from "react";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { DeleteSweep } from "@mui/icons-material";

const style = {
    text: {
        fontSize: 16
    },
    userBubble: {
        wordWrap: 'break-word',
        backgroundColor: "red",
        margin: '10px',
        padding: '20px',
    },
    chatbubble: {
        margin: '10px',
        borderRadius: 30,
        padding: '20px',
        wordWrap: "break-word",
        backgroundColor: "#2b2b2b"
    }
}

const users = {
    0: "You",
    1: "ChatGPT"
};


function ChatBox() {
    const { currentUser, token } = useAuth()
    const [messages, setMessages] = useState([
    ])
    const [text, setText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isListening, setListening] = useState(false)
    const ref = useRef(null)
    const { listen, stop } = useSpeechRecognition({
        onResult: (result) => {
            setText(result)
        }
    })
    useEffect(() => {
        try {
            const data = localStorage.getItem('messages')
            if (data !== '' && data) {
                var messages = JSON.parse(data)
                for (var i = 0; i < messages.length; i++) {
                    if (messages[i].message.startsWith('http')) {
                        messages[i].message = <Link target="_blank" href={messages[i].message}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CloudDownloadIcon />&nbsp;<span>DOWNLOAD PDF</span>
                            </Box>
                        </Link>
                    }
                }
                setMessages(messages)
            }
            else clearChat()
        }
        catch (e) {
            clearChat()
        }
    }, [])
    function pushMessage(sender, message) {
        const newMessage = new Message({
            id: sender,
            message,
            senderName: users[sender]
        });
        setMessages(messages => [
            ...messages,
            newMessage
        ])
    }
    function saveLocally(a, b) {
        var messages = []
        try {
            const data = localStorage.getItem('messages')
            if (data !== '' && data)
                messages = JSON.parse(data)
        }
        catch (e) {

        }
        messages.push(new Message({
            id: 0,
            message: a,
            senderName: users[0]
        }))
        messages.push(new Message({
            id: 1,
            message: b,
            senderName: users[1]
        }))
        localStorage.setItem('messages', JSON.stringify(messages))
    }
    function handleChange(e) {
        setText(e.target.value)
    }
    async function keyDown(e) {
        const isShift = !!window.event.shiftKey
        if (isShift && e.key === 'Enter') {

        }
        else if (e.key === 'Enter') {
            if (text.toLowerCase().includes('pdf')) {
                const topic = prompt('Topic ?')
                pushMessage(0, 'Generate a pdf on ' + topic)
                const a = 'Generate a pdf on ' + topic
                setText('')
                setIsLoading(true)
                const url = apiURL + "/api/v1/chat/pdf/?topic=" + topic + "&pagenum=2"
                const options = {
                    headers: {
                        'Authorization': token
                    }
                };
                const resp = await fetch(url, options)
                const json = await resp.json()
                console.log('Response from API ->', json)
                if (json['url'] === undefined || json['url'] === '') {
                    alert('Network error')
                    setIsLoading(false)
                    return
                }
                pushMessage(1, <Link target="_blank" href={json.url}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CloudDownloadIcon />&nbsp;<span>DOWNLOAD PDF</span>
                    </Box>
                </Link>)
                const b = json.url
                saveLocally(a, b)
                setIsLoading(false)
            }
            else {
                var context = 'Context of this conversation:\n'
                for (var i = 0; i < messages.length; i++) {
                    if (messages[i].message.includes('http') || messages[i].message.includes('generate')) continue
                    if (messages[i].id === 0) context += 'Me: ' + messages[i].message + '\n'
                    else if (messages[i].id === 1) context += 'You: ' + messages[i].message + '\n'
                }
                const promp = 'Prompt:\n' + text
                const a = text
                pushMessage(0, text)
                setText('')
                setIsLoading(true)
                // alert(context + "\n" + promp)
                const url = apiURL + "/api/v1/chat/text/?prompt=" + context + "\n" + promp + "\nWrite response in less than 20 words."
                const options = {
                    headers: {
                        'Authorization': token
                    }
                };
                const resp = await fetch(url, options)
                const json = await resp.json()
                console.log('Response from ChatGPT ->', json)
                pushMessage(1, json.answer.content)
                const b = json.answer.content
                saveLocally(a, b)
                setIsLoading(false)
            }
        }
    }
    function imageInput() {
        ref.current.click()
    }
    async function loadFile(e) {
        if (!e.target.files[0]) return

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        // const options = {
        //     method: 'POST',
        //     headers: {
        //         'X-RapidAPI-Key': '252d996af5msh922a777b9acb5d3p1f77d4jsnef87c32ef2a5',
        //         'X-RapidAPI-Host': 'ocr-extract-text.p.rapidapi.com'
        //     },
        //     body: formData
        // };
        // const resp = await fetch('https://ocr-extract-text.p.rapidapi.com/ocr',options)
        const options = {
            method: 'POST',
            headers: {
                'apikey': 'K82579831988957',
            },
            body: formData
        };
        const resp = await fetch('https://api.ocr.space/parse/image', options)
        const json = await resp.json()
        console.log('OCR ->', json)
        setText(json.ParsedResults[0].ParsedText)
    }
    function micClick() {
        if (isListening) {
            stop()
            setListening(false)
        }
        else {
            listen()
            setListening(true)
        }
    }
    function generatePDF() {

    }
    function clearChat() {
        const initialMessages = [
            new Message({
                id: 1,
                message: 'Hello! How can I assist you today?',
                senderName: users[1]
            }),
            new Message({
                id: 1,
                message: 'You can write "generate pdf" to generate pdfs!',
                senderName: users[1]
            })
        ]
        setMessages(initialMessages)
        localStorage.setItem('messages', JSON.stringify(initialMessages))
    }
    return (
        <Box>
            <Box sx={{ height: '70vh' }}>
                <ChatFeed bubbleStyles={style}
                    maxHeight={'70vh'}
                    messages={messages} // Boolean: list of message objects
                    showSenderName
                />
            </Box>
            <br />
            {
                isLoading && <LinearProgress sx={{ width: '100%' }} />
            }
            <br />
            <Box>
                <Box sx={{ display: 'flex', flexDirection: "column", alignItems: 'center', }}>
                    <Box sx={{ margin: 'auto 0', width: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                        <Button onClick={clearChat} sx={{ width: '3%' }}><DeleteSweep sx={{ fontSize: '30px' }} /></Button>
                        <TextField multiline rows={3} onChange={handleChange} onKeyDown={keyDown} value={text} sx={{ width: '88%' }} />
                        <Button sx={{ width: '3%' }} onClick={() => keyDown({ key: 'Enter' })}><SendIcon sx={{ fontSize: '30px' }} /></Button>
                        <Button sx={{ width: '3%', padding: '15px' }} variant={isListening ? 'contained' : 'outlined'} onClick={micClick}><KeyboardVoiceIcon sx={{ fontSize: '30px' }} /></Button>
                        <Button onClick={imageInput} sx={{ width: '3%' }} ><ImageSearchIcon sx={{ fontSize: '30px' }} /></Button>
                        <input onChange={loadFile} type='file' ref={ref} style={{ display: 'none' }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default ChatBox;

