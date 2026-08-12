# The Regal Bind

The Regal Bind is a premium, full-stack e-commerce web application designed for book connoisseurs. It features a fully responsive UI, robust state management, secure token-based authentication, and an optimized relational database schema.

## Features

- **Dynamic E-Commerce Flow:** Seamless product browsing, real-time cart updates (add, increment, decrement, remove), and order placement tracking.
- **Secure JWT Authentication:** Implements custom JSON Web Tokens (JWT) handled via secure `HttpOnly` cookies.
- **Advanced Account Recovery:** Features an automated password reset flow utilizing secure, time-sensitive reset tokens.
- **Robust State Synchronization:** Global application and cart state managed efficiently with Redux Toolkit.
- **Relational Database Architecture:** Data layer backed by PostgreSQL using complex inner joins for optimized book and order queries.

##Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express.js, JWT (HttpOnly Cookies)
- **Database:** PostgreSQL

##  System Architecture & Insights

### Authentication Flow
1. User requests a password reset.
2. A unique token is generated and prepared for the user's email.
3. Upon validation, the frontend automatically populates the token, enabling a secure password update window.

### State Management & Performance
- Cart states are synchronized globally using **Redux Toolkit** to ensure immediate UI responses when items are adjusted.
- Backend queries use optimized relational database joins to fetch product metrics cleanly without redundant database roundtrips.

## 🔧 Local Setup & Installation

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/the-regal-bind.git](https://github.com/yourusername/the-regal-bind.git)
   cd the-regal-bind
