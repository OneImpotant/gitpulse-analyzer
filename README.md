# GitPulse Analyzer 🚀

An automated dashboard to analyze the "health" of your GitHub repositories based on recent activity.

## 🛠 Tech Stack
- **Frontend:** React.js, Axios
- **Backend:** Node.js, Express
- **API:** GitHub OAuth 2.0, GitHub REST API
- **Environment Management:** Dotenv

## 📋 Key Features
- **Secure Authentication:** OAuth 2.0 integration with GitHub Apps.
- **Project Health Score:** Automatically calculates project status (Healthy/Stale) based on the last commit date.
- **Real-time Data:** Fetches the latest 10 repositories from the user's profile.
- **Dynamic UI:** Responsive dashboard built with React.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- A GitHub App created in your [Developer Settings](https://github.com/settings/developers)

### 1. Setup Backend
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your credentials:
   ```env
   GITHUB_CLIENT_ID=your_id_here
   GITHUB_CLIENT_SECRET=your_secret_here
   PORT=5000
4. Start the server: node index.js

2. Setup Frontend
    1. Navigate to the client folder: cd client

    2. Install dependencies: npm install

    3. Start the application: npm start

    4. Open http://localhost:3000 in your browser.

🛡 Security
This project uses .gitignore to ensure sensitive information like node_modules and .env files are never pushed to the repository.