# Discord Celebration Bot

A Discord bot that sends congratulatory messages with GIFs to celebrate user achievements and sprint completions.

## Features

- Sends congratulatory messages with GIFs to Discord channels
- Supports customizable message templates
- Tracks sprint achievements
- REST API for managing messages, templates, and sprints
- Stores message history and metadata

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Discord Bot Token
- Giphy API Key

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd discord-celebration-bot
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Discord Configuration
DC_TOKEN=your_discord_bot_token
DC_GUILD_ID=your_discord_server_id
DC_CHANNEL_ID=your_discord_channel_id

# GIF API Configuration
GIPHY_KEY=your_giphy_api_key

# Database Configuration
DATABASE_URL=./data/messages.db
```
## Obtaining Required API Keys

### Discord Bot Token

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Under the bot's token, click "Copy" to get your `DC_TOKEN`
5. Enable the following bot permissions:
   - Send Messages
   - Embed Links
   - Attach Files
   - Read Message History
6. Go to OAuth2 > URL Generator:
   - Select "bot" under scopes
   - Select the required permissions
   - Use the generated URL to add the bot to your server

### Discord IDs

To get the required Discord IDs (`DC_GUILD_ID` and `DC_CHANNEL_ID`):

1. Open Discord
2. Go to User Settings > Advanced
3. Enable "Developer Mode"
4. To get the Guild (Server) ID:
   - Right-click on your server name
   - Click "Copy Server ID"
   - Use this as your `DC_GUILD_ID`
5. To get the Channel ID:
   - Right-click on the channel where you want the bot to post
   - Click "Copy Channel ID"
   - Use this as your `DC_CHANNEL_ID`

### Giphy API Key

1. Go to the [Giphy Developers Portal](https://developers.giphy.com/)
2. Click "Create an App"
3. Choose "API" as the app type
4. Fill in the required information
5. Once created, you'll find your API key in the dashboard
6. Copy the API key to use as your `GIPHY_KEY`

## Database Setup

The application uses SQLite as its database. Before starting the application, you need to:

1. Run database migrations:

```bash
npm run migrate
```

2. Generate database types:

```bash
npm run generate-types
```

3. (Optional) Seed the database with initial data:

```bash
npm run seed
```

## Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Messages

- `POST /messages` - Send a congratulatory message
  ```json
  {
    "username": "johndoe",
    "sprint": "WD-1.1"
  }
  ```
- `GET /messages` - Get all congratulatory messages
- `GET /messages?username=johndoe` - Get messages for a specific user
- `GET /messages?sprint=WD-1.1` - Get messages for a specific sprint

### Templates

- `POST /templates` - Create a new message template
  ```json
  {
    "text": "You nailed it! 💪"
  }
  ```
- `GET /templates?id=1` - Get template by id
- `PATCH /templates` - Update a template
  ```json
  {
    "id": "1",
    "text": "Updated template text"
  }
  ```
- `DELETE /templates?id=1` - Delete a template

### Sprints

- `POST /sprints` - Create a new sprint
  ```json
  {
    "id": "WD-1.1",
    "title": "Web Development Fundamentals"
  }
  ```
- `GET /sprints?id=WD-1.1` - Get sprint by id
- `PATCH /sprints` - Update a sprint
  ```json
  {
    "id": "WD-1.1",
    "title": "Updated title"
  }
  ```
- `DELETE /sprints?id=1` - Delete a sprint

## Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Project Structure

```
src/
├── database/     # Database configuration and migrations
├── modules/      # Feature modules
├── services/     # API services
├── utils/        # Utility functions
├── middleware/   # Express middleware
├── app.ts        # Express application setup
└── index.ts      # Application entry point
```

## Assumptions and Requirements

- The Discord bot must be added to your server with appropriate permissions
- GIF API (Giphy) must be configured for fetching celebration GIFs
- Database migrations must be run before starting the application
