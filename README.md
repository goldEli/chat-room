# Chat Room Application

A simple real-time chat room application built with NestJS backend and React frontend. Supports text, image, and file sharing with no authentication required.

## Features

- 🚀 **Real-time messaging** using WebSocket (Socket.IO)
- 📝 **Text messages** with timestamps and sender identification
- 🖼️ **Image sharing** with inline preview
- 📎 **File sharing** with download links
- 🌐 **Direct access** without login/authentication
- 📱 **Responsive design** works on desktop and mobile
- 🐳 **Easy Docker deployment** with one command

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed on your system

### Deployment

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-room
```

2. Start the application:
```bash
docker-compose up -d
```

3. Access the chat room:
Open your browser and navigate to `http://192.168.31.44:8075`

The application will be running and accessible immediately. No configuration required!

## Local Development

### Prerequisites
- Node.js 18+
- pnpm package manager

### Backend Setup

```bash
cd server
pnpm install
pnpm run start:dev
```

The server will run on `http://localhost:8075`

### Frontend Setup

```bash
cd client
pnpm install
pnpm run dev
```

The client will run on `http://localhost:5173` with proxy configuration to the backend.

## Usage

1. **Enter your name**: When you first visit the application, you'll be prompted to enter your display name
2. **Start chatting**: Type messages and press Enter or click Send
3. **Share files**: Click the 📎 button to attach images or files
4. **View images**: Images are displayed inline in the chat
5. **Download files**: Click on file attachments to download them

## Architecture

- **Backend**: NestJS with Socket.IO for real-time communication
- **Frontend**: React with TypeScript and Vite
- **File Storage**: Local file system with configurable upload directory
- **Communication**: WebSocket for real-time, HTTP for file uploads

## Configuration

### Environment Variables
- `PORT`: Server port (default: 8075)
- `NODE_ENV`: Environment mode (development/production)
- `VITE_SERVER_URL`: Frontend server URL (for client configuration)

### File Upload Limits
- Maximum file size: 10MB per file
- Supported file types: Images, PDF, DOC, DOCX, TXT, ZIP
- Maximum files per message: 10

## Docker Configuration

The application includes optimized Docker configuration:
- Multi-stage build for smaller production image
- File upload persistence via Docker volumes
- Health checks for monitoring
- Automatic restarts on failure

## Security Notes

- This is a simple demo application with no authentication
- Files are stored locally without virus scanning
- CORS is enabled for all origins in development
- For production use, consider adding authentication and security measures

## Development Scripts

### Server Commands
```bash
pnpm run start          # Start in development mode
pnpm run start:dev      # Start with hot reload
pnpm run start:prod     # Start in production mode
pnpm run build          # Build the application
pnpm run test           # Run unit tests
pnpm run test:e2e       # Run end-to-end tests
pnpm run lint           # Run ESLint
pnpm run format         # Format code with Prettier
```

### Client Commands
```bash
pnpm run dev            # Start development server
pnpm run build          # Build for production
pnpm run preview        # Preview production build
pnpm run lint           # Run ESLint
```

## License

This project is provided as-is for educational and demo purposes.