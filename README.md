# Recallit

Recallit is a modern web application designed to help users efficiently manage and review coding problems and topics. Built with a Node.js backend and a React frontend hosted on GitHub Pages, Recallit offers a smooth user experience for tracking study progress.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- User authentication with JWT.
- Manage collections of coding cards by topics.
- Track favorites and completed problems.
- Real-time statistics and progress tracking.
- Responsive UI hosted on GitHub Pages.
- Secure backend API hosted on Render.

---

## Demo

Frontend is live and accessible [here](https://pranavdixiit.github.io/Recallit).

Backend API is deployed at [https://recallit.onrender.com](https://recallit.onrender.com).

---

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Hosting**: GitHub Pages (frontend), Render.com (backend)
- **Tools**: dotenv, cookie-parser, cors

---

## Getting Started

### Prerequisites

- Node.js (version 16+ recommended)
- npm or yarn
- MongoDB account (Atlas recommended for production)

---

## Backend Setup

1. Clone the repo:
    ```
    git clone https://github.com/pranavdixiit/Recallit.git
    cd Recallit/server
    ```

2. Install dependencies:
    ```
    npm install
    ```

3. Create a `.env` file in the `server` directory with the following contents:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. Start the backend server:
    ```
    npm start
    ```

---

## Frontend Setup

The frontend is hosted on GitHub Pages and can be found [here](https://pranavdixiit.github.io/Recallit).

To run locally:

1. Navigate to the frontend directory:
    ```
    cd ../client
    ```

2. Install dependencies:
    ```
    npm install
    ```

3. Start the frontend:
    ```
    npm start
    ```

---

## Usage

- Register or log in to start managing your cards.
- Add cards to Favorites to review later.
- Mark cards as Done to track your progress.
- Explore your stats and improve your skills.

---

## Environment Variables

| Variable   | Description                     | Example                                       |
|------------|---------------------------------|-----------------------------------------------|
| PORT       | Port number your server runs on | `5000`                                        |
| MONGO_URI  | MongoDB connection string       | `mongodb+srv://user:password@cluster.mongodb.net/db?retryWrites=true&w=majority` |
| JWT_SECRET | Secret key for JWT signing      | `your-very-secure-secret`                     |

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements.

---

## License

[MIT](LICENSE)

---

## Contact

Developed by Pranav Dixit  
Email: pranavdixit03890@gmail.com  
GitHub: [pranavdixiit](https://github.com/pranavdixiit)

---

*Thank you for checking out Recallit! Keep coding and keep improving.*  

