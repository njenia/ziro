# Ziro

**Zero knowledge, pure secrecy.**

🌐 **[Try Ziro Live →](https://ziro-sigma.vercel.app/)**

Ziro is an open-source, minimalist web application designed for the temporary, secure sharing of sensitive text data. Its core security feature is Client-Side Encryption, meaning the server stores only encrypted data and is completely "blind" (zero-knowledge) to the actual content.

## Features

- 🔒 **Client-Side Encryption (Zero-Knowledge)**: All encryption and decryption occurs in the user's browser using the native Web Crypto API (AES-GCM algorithm). The secret key is never sent to the server.
- 🔥 **Burn on Read**: The primary destruction method. The secret is permanently deleted from the database immediately after the link is successfully accessed once.
- ⏳ **Time-to-Live (TTL)**: An automatic expiration option (1 hour, 1 day, 1 week, 30 days) for messages that are never viewed.
- 🚫 **Bot Protection**: Basic logic on the server to identify common crawlers/bots (via User-Agent analysis) and prevent them from accidentally triggering the "Burn on Read" deletion.
- ✨ **Minimalist UI**: A clean, dark-mode focused interface optimized for speed and clarity.

## How It Works

The security relies entirely on the URL Fragment Identifier (the hash: `#`).

1. **Encryption**: Client generates Key → Encrypts Data → Sends only the Encrypted Data and IV to the Server.
2. **Storage**: Server stores the Encrypted Data and IV in Redis under a unique ID and sets the TTL.
3. **Link**: Client constructs the final URL: `https://ziro.app/s/[ID]#[Key]`.
4. **Decryption**: Receiver clicks link. Server deletes the data (if "Burn on Read"). Client uses the local `#[Key]` to decrypt and display the content.

## Prerequisites

- Node.js 18+ and npm
- An Upstash Redis account (free tier available) or a Redis instance

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ziro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Upstash Redis**:
   - Go to [Upstash Console](https://console.upstash.com/)
   - Create a new Redis database
   - Copy the REST URL and REST Token

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Upstash credentials:
   ```env
   UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url_here
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token_here
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `UPSTASH_REDIS_REST_URL` | Your Upstash Redis REST API URL | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis REST API Token | Yes |
| `NEXT_PUBLIC_BASE_URL` | Base URL for the application (defaults to localhost in dev) | No |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

Ziro can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify
- Self-hosted with Docker

Make sure to set the environment variables in your deployment platform.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Upstash Redis (serverless Redis)
- **Encryption**: Web Crypto API (AES-GCM)

## Security Considerations

- The encryption key is **never** sent to the server - it only exists in the URL fragment (`#`)
- Server-side bot detection prevents crawlers from triggering burn-on-read
- All encryption/decryption happens client-side using the browser's native Web Crypto API
- Redis TTL ensures automatic expiration of secrets
- Burn-on-read provides immediate, irreversible data destruction

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
