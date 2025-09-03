# Job-Mate

## Job Mate is a full-stack web application designed to help users manage their job applications efficiently. The app allows users to register, log in, track their job applications, and optionally administer all applications if they have admin access.

## Features :

### * User Authentication: Users can register, log in, and log out securely using Firebase Authentication.

### * Profile Management: Users can manage their profile information.

### * Job Application Tracking: Users can create, read, update, and delete their job applications.

### * Admin Dashboard: Access-controlled dashboard for admins to manage all applications.

### * Dashboard Insights: Users see visual stats for their applications (Applied, Interview, Rejected, Hired) displayed as cards. The app also generates AI-powered motivational summaries based on user data.

### * AI-powered Tools:
#### - Resume Helper: Analyze resume text, get grammar suggestions, strong/weak points, and recommended keywords.
#### - Job Description Analyzer: Analyze job descriptions and extract key skills and requirements.
#### - Career Chatbot: Interactive AI chatbot for career guidance. Users can ask career/job-related questions and receive practical, motivational answers. Chat messages are displayed in styled bubbles.

### * Persistent State: User session and application data are stored using Redux Toolkit and Redux Persist.

### * Protected Routes: Certain pages are accessible only to authenticated users.

### * UI Design: Clean interface built using Material UI. Chatbox and AI tools are integrated as floating or expandable panels for better UX.

### * Error Handling & Validation: Robust handling of user input, Firestore operations, and AI API errors.

### * Responsive & Interactive: Floating chat icon opens a compact chat interface. Resume Helper and Job Description Analyzer can be toggled inside the chat for seamless interaction.

## How it Works :

### 1- Users sign up or log in through Firebase Authentication.

### 2- Authenticated users can add and manage their job applications in Firestore.

### 3- Admin users have additional access to manage all applications.

### 4- Redux Toolkit manages application state, while Redux Persist ensures data persists across sessions.

### 5- Users can view application statistics as cards, with AI-generated motivational summaries.

### 6- AI-powered tools (Chatbot, Resume Helper, Job Description Analyzer) provide guidance and suggestions directly in the interface.

### 7- The app uses protected routes to secure sensitive pages and provides a responsive, user-friendly interface.
