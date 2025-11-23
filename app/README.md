# Frontend — `app/`

Overview
-
This folder contains the React frontend for the Prompt-Driven Email Agent. It provides the UI for viewing mock emails, interacting with the prompt-based assistant, and using a RAG-powered chat widget.

Quick start
-
- Install dependencies: `npm install`
- Start dev server: `npm start`

Structure and file responsibilities
-
- `package.json`: npm scripts and frontend dependencies.
- `README.md`: (this file) documentation for the frontend.

Public folder
-
- `public/index.html`: Root HTML page rendered by React.
- `public/manifest.json`: PWA manifest metadata.
- `public/robots.txt`: Web crawler instructions.

Src folder (key files)
-
- `src/index.js`: React entry point — mounts the app.
- `src/App.js`: Main top-level React component and router/structure.
- `src/App.css`: Global styles for the app.
- `src/reportWebVitals.js`: Web vitals helper (create-react-app default).
- `src/setupTests.js`: Test setup for Jest/React Testing Library.
- `src/App.test.js`: Basic frontend tests.

Backend services (frontend wrappers)
-
- `src/backendService/promptsService.js`: Client helper to call the backend prompts endpoints (send prompt templates, receive generated drafts/replies).
- `src/backendService/rag_service.js`: Client helper for RAG endpoints (sending user messages and retrieving RAG responses).

Components (in `src/components/`)
-
- `ChatWidget.js`: UI wrapper for the chat widget used across the app.
- `EmailList.js`: Page component rendering a list of emails.
- `EmailListItem.js`: Single email row displayed in a list.
- `EmailsPage.js`: Full page combining list and details, main email UX.
- `EmailDetail.js`: Shows full email content and metadata.
- `MessageItem.js`: Single chat message bubble used in chat views.
- `ProcessEmail.js`: Component responsible for triggering processing workflows (e.g., generate reply, categorize, summarize).
- `promptBrain.js`: UI and helpers for composing/managing prompt templates.
- `RagChat.js`: RAG-based chat component that connects to the RAG backend.

CSS (in `src/css/`)
-
- `ChatWidget.css`, `EmailList.css`, `emailDetails.css`, `promptBrain.css`, `RagChat.css`: Component-specific styles.

Notes
-
- The frontend expects the backend to expose REST endpoints for prompts/RAG. Update the service base URLs in `src/backendService/*` if your backend runs on a different host/port.
- If you want to build for production, run `npm run build` and deploy the contents of `build/` to your host.

Contact
-
If you need updates or additional documentation (API contract, env vars), I can add example requests and Postman/cURL snippets.
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
