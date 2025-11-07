import { useState, useEffect, useRef } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { io, Socket } from 'socket.io-client'
import './App.css'

interface Message {
  id: string
  content: string
  type: 'text' | 'image' | 'file'
  sender: string
  timestamp: Date
  fileName?: string
  fileSize?: number
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [username, setUsername] = useState('')
  const [usernameSet, setUsernameSet] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://192.168.31.44:8075'

  useEffect(() => {
    if (!usernameSet) return

    socketRef.current = io(serverUrl, {
      transports: ['websocket', 'polling'],
    })

    socketRef.current.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to server')
    })

    socketRef.current.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from server')
    })

    socketRef.current.on('messages', (serverMessages: Message[]) => {
      setMessages(serverMessages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })))
    })

    socketRef.current.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.timestamp)
      }])
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [usernameSet, serverUrl])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleUsernameSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      setUsernameSet(true)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const uploadFile = async (file: File): Promise<{
    filename: string;
    originalName: string;
    size: number;
    path: string;
  }> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${serverUrl}/upload/single`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('File upload failed')
    }

    return response.json()
  }

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() && selectedFiles.length === 0) return
    if (!socketRef.current || !isConnected) return

    try {
      // Upload files first
      const uploadedFiles = []
      for (const file of selectedFiles) {
        const uploadedFile = await uploadFile(file)
        uploadedFiles.push(uploadedFile)
      }

      // Send messages for each uploaded file
      uploadedFiles.forEach(uploadedFile => {
        const isImage = uploadedFile.originalName.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        const message: Message = {
          id: '',
          content: `${serverUrl}${uploadedFile.path}`,
          type: isImage ? 'image' : 'file',
          sender: username,
          timestamp: new Date(),
          fileName: uploadedFile.originalName,
          fileSize: uploadedFile.size
        }
        socketRef.current?.emit('sendMessage', message)
      })

      // Send text message if provided
      if (inputText.trim()) {
        const textMessage: Message = {
          id: '',
          content: inputText,
          type: 'text',
          sender: username,
          timestamp: new Date()
        }
        socketRef.current.emit('sendMessage', textMessage)
      }

      setInputText('')
      setSelectedFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (!usernameSet) {
    return (
      <div className="username-container">
        <form onSubmit={handleUsernameSubmit} className="username-form">
          <h2>Enter Your Name</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name..."
            maxLength={20}
            autoFocus
          />
          <button type="submit">Enter Chat</button>
        </form>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Simple Chat Room</h1>
        <div className="connection-status">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
          {isConnected ? 'Connected' : 'Connecting...'}
        </div>
      </header>

      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender === username ? 'own-message' : 'other-message'}`}>
            <div className="message-header">
              <span className="sender">{message.sender}</span>
              <span className="time">{formatTime(message.timestamp)}</span>
            </div>
            <div className="message-content">
              {message.type === 'text' && <p>{message.content}</p>}
              {message.type === 'image' && (
                <img
                  src={message.content}
                  alt={message.fileName}
                  className="message-image"
                  loading="lazy"
                />
              )}
              {message.type === 'file' && (
                <div className="file-message">
                  <a href={message.content} download={message.fileName} className="file-link">
                    📎 {message.fileName}
                    <span className="file-size">{formatFileSize(message.fileSize || 0)}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="text-input"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            className="file-input"
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
          />
          <button type="button" className="attach-button" onClick={() => fileInputRef.current?.click()}>
            📎
          </button>
          <button type="submit" className="send-button" disabled={!isConnected && !inputText}>
            Send
          </button>
        </div>
        {selectedFiles.length > 0 && (
          <div className="selected-files">
            {selectedFiles.map((file, index) => (
              <span key={index} className="selected-file">
                {file.name} ({formatFileSize(file.size)})
              </span>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}

export default App
