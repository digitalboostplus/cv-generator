# Upwork Proposal Generator

An AI-powered web application that helps freelancers create professional, tailored proposals for Upwork jobs. The application uses OpenAI's GPT-4 to generate compelling proposals and includes visual workflow diagrams to help understand the application process.

## Features

- 🤖 AI-powered proposal generation using GPT-4
- 📊 Visual workflow diagrams using Mermaid.js
- 🎨 Customizable proposal tone and length
- 📋 Easy copy-to-clipboard functionality
- 🔒 Secure authentication system
- 💅 Modern, responsive UI built with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd upwork-proposal-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
# Authentication
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

1. Visit the application in your web browser
2. Enter the job description you want to create a proposal for
3. Customize the tone and length settings if desired
4. Click "Generate Proposal" to create your tailored proposal
5. Review the generated proposal and workflow diagram
6. Copy the proposal to your clipboard and use it as a base for your Upwork application

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4
- **Authentication**: JWT
- **Form Handling**: React Hook Form + Zod
- **Diagrams**: Mermaid.js
- **UI Components**: Headless UI, Heroicons

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── lib/                 # Utility functions and modules
│   ├── ai/             # AI-related functionality
│   ├── auth/           # Authentication utilities
│   ├── types/          # TypeScript type definitions
│   └── utils/          # General utilities
└── styles/             # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the GPT-4 API
- Mermaid.js for the flowchart visualization
- The Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
