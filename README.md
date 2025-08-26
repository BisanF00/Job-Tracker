# Job-Mate

## Job Mate is a full-stack web application designed to help users manage their job applications efficiently. The app allows users to register, log in, track their job applications, and optionally administer all applications if they have admin access.

## Features :

### * User Authentication: Users can register, log in, and log out securely using Firebase Authentication.

### * Profile Management: Users can manage their profile information.

### * Job Application Tracking: Users can create, read, update, and delete their job applications.

### * Admin Dashboard: Access-controlled dashboard for admins to manage all applications.

### * Persistent State: User session and application data are stored using Redux Toolkit and Redux Persist.

### * Protected Routes: Certain pages are accessible only to authenticated users.

### * UI Design: Clean interface built using a UI library (Ant Design or Material UI).

### * Error Handling & Validation: Robust handling of user input and asynchronous operations.

## How it Works :

### 1- Users sign up or log in through Firebase Authentication.

### 2- Authenticated users can add and manage their job applications in Firestore.

### 3- Admin users have additional access to manage all applications.

### 4- Redux Toolkit manages application state, while Redux Persist ensures data persists across sessions.

### 5- The app uses protected routes to secure sensitive pages and provides a responsive, user-friendly interface.