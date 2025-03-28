import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const ChatBox = ({ conversation, userInput, setUserInput, sendMsg }) => {
    return (
        <div>
            <div className="flex flex-col h-[70vh] bg-secondary border rounded-4xl p-4">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                    {conversation.map((item, index) => (
                        <div key={index} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <h2
                                className={`mt-3 p-2 px-3 inline-block rounded-md max-w-[70%] break-words ${item.role === 'assistant' ? 'bg-primary text-white' : 'bg-gray-200 text-black'
                                    }`}
                            >
                                {item.content}
                            </h2>
                        </div>
                    ))}
                </div>

                {/* Chat Input Section */}
                <div className="flex items-center gap-2 p-2">
                    <Input
                        type="text"
                        placeholder="Type a message..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    <Button onClick={sendMsg}>Send</Button>
                </div>
            </div>
        </div>

    )
}

export default ChatBox