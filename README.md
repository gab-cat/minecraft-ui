# Minecraft Server Management UI

A modern, stylish web application for managing your Minecraft server via RCON. This app provides an intuitive interface for sending commands and viewing server responses.

## Features

- **Modern UI** - Built with shadcn/ui for a beautiful, accessible interface
- **RCON Integration** - Communicate with your Minecraft server using the RCON protocol
- **User-Friendly Command Interface** - Easily send common commands without remembering syntax
- **Server Response Display** - See server responses in real-time
- **Organized Command Categories** - Commands are organized in intuitive tabs:
  - Basic - Broadcast messages, list players
  - Players - Kick, ban, pardon players
  - Items - Give items, teleport players
  - Settings - Game mode, weather, time controls
  - Advanced - Execute raw commands

## Getting Started

### Prerequisites

- Node.js 20 or later
- A Minecraft server with RCON enabled

### RCON Setup on Your Minecraft Server

1. Edit your Minecraft server's `server.properties` file
2. Set the following properties:
   ```
   enable-rcon=true
   rcon.port=25575
   rcon.password=your_secure_password
   ```
3. Restart your Minecraft server

### Installing the Application

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `sample.env.local` to `.env.local` and update with your server details:
   ```
   RCON_HOST=your_minecraft_server_ip
   RCON_PORT=25575
   RCON_PASSWORD=your_rcon_password
   ```

### Running the Application

#### Development Mode

```bash
npm run dev
```

#### Production Mode

```bash
npm run build
npm run start
```

## Deployment

This application is built with Next.js and can be deployed to various platforms. The recommended deployment is using Vercel or Cloudflare Pages:

```bash
npm run deploy
```

## Technical Stack

- **Framework**: Next.js 15+
- **UI Library**: shadcn/ui
- **Data Fetching**: TanStack React Query
- **Form Handling**: react-hook-form with Zod validation
- **Minecraft Communication**: rcon-client

## Project Structure

The project follows a feature-based organization:

- `src/app/` - Next.js app router pages
- `src/features/` - Feature-specific components and logic
- `src/lib/` - Shared utilities and configurations
- `src/components/` - Reusable UI components

## Extending the Application

To add new commands or features:

1. Add new command methods to `src/lib/rcon.ts`
2. Create validation schemas in `src/app/api/actions.ts`
3. Implement server actions for the new commands
4. Add UI components in the appropriate feature folder

## License

This project is open source and available under the MIT License.
