# Noice Auth 🔐

A lightweight, production-ready authentication boilerplate for Node.js applications. Built with Express, MongoDB, and Passport.js, it provides a complete authentication system with email/password login, OAuth integration (Google & GitHub), and comprehensive user management features.

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-installation--setup">Installation</a> •
  <a href="#-api-endpoints">API Endpoints</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

<div id="-features">

## 🚀 Features

### Authentication Methods

- **Email/Password Authentication**: Traditional registration and login with secure password hashing.
- **OAuth 2.0 Integration**:
  - Google OAuth via Passport.js
  - GitHub OAuth via Passport.js
- **JWT-Based Sessions**: Stateless authentication using Access and Refresh tokens.

### Security Features

- **Password Security**: Bcrypt hashing with salt rounds.
- **Email Verification**: Token-based email verification system.
- **Password Reset**: Secure forgot password flow with time-limited tokens.
- **Rate Limiting**: Protection against brute-force attacks (5000 requests per 15 minutes).
- **CORS Configuration**: Flexible cross-origin resource sharing setup.
- **Secure Cookies**: HttpOnly and Secure cookie flags for token storage.

### User Management

- **Profile Management**: Update user avatar (Cloudinary integration).
- **Password Management**: Change password for authenticated users.
- **Token Refresh**: Automatic token refresh mechanism.
- **User Roles**: Admin and User role-based access control.

### Developer Experience

- **Logging**: Winston and Morgan for comprehensive request/error logging.
- **Input Validation**: Zod schemas for request validation.
- **Error Handling**: Centralized error handling with custom ApiError class.
- **Environment Config**: Dotenv for secure configuration management.

</div>

<div id="-tech-stack">

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) v5
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**:
  - [Passport.js](https://www.passportjs.org/) (OAuth strategies)
  - [JWT](https://jwt.io/) (jsonwebtoken)
  - [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) (password hashing)
- **File Upload**: [Multer](https://github.com/expressjs/multer) + [Cloudinary](https://cloudinary.com/)
- **Email**: [Nodemailer](https://nodemailer.com/) with [Mailgen](https://github.com/eladnava/mailgen)
- **Validation**: [Zod](https://zod.dev/)
- **Logging**: [Winston](https://github.com/winstonjs/winston), [Morgan](https://github.com/expressjs/morgan)

</div>

<div id="-project-structure">

## 📂 Project Structure

```
noice-auth/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── index.js                  # Entry point & DB connection
│   ├── constants.js              # Application constants (Roles, Login types)
│   ├── controllers/
│   │   ├── auth.controllers.js   # Authentication logic
│   │   └── healthCheck.controllers.js
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── multer.middleware.js  # File upload handling
│   ├── models/
│   │   └── user.models.js        # User schema & methods
│   ├── routes/
│   │   ├── auth.routes.js        # Auth endpoints
│   │   └── healthCheck.routes.js
│   ├── utils/
│   │   ├── ApiError.js           # Custom error class
│   │   ├── ApiResponse.js        # Standardized responses
│   │   ├── asyncHandler.js       # Async error wrapper
│   │   ├── cloudinary.js         # Cloudinary upload utility
│   │   ├── db.js                 # Database connection
│   │   └── mail.js               # Email sending utility
│   ├── validators/
│   │   └── auth.validators.js    # Zod validation schemas
│   ├── logger/
│   │   ├── winston.logger.js     # Winston configuration
│   │   └── morgan.logger.js      # Morgan configuration
│   └── passport/
│       └── index.js              # Passport strategies setup
├── public/                       # Static files & uploads
├── .env.sample                   # Environment variables template
└── package.json                  # Dependencies
```

</div>

<div id="-installation--setup">

## ⚙️ Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/arush73/noice-auth.git
    cd noice-auth
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory based on `.env.sample`:

    ```env
    PORT=8080
    MONGODB_URI=mongodb://localhost:27017
    NODE_ENV=development

    # Session & JWT Secrets
    EXPRESS_SESSION_SECRET=<your_secret>
    ACCESS_TOKEN_SECRET=<your_secret>
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=<your_secret>
    REFRESH_TOKEN_EXPIRY=10d

    # CORS
    CORS_ORIGIN=http://localhost:3000

    # Email (Mailtrap for development)
    MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
    MAILTRAP_SMTP_PORT=2525
    MAILTRAP_SMTP_USER=<your_user>
    MAILTRAP_SMTP_PASS=<your_pass>

    GMAIL_USER=<your_gmail_user>
    GMAIL_PASSWORD=<your_gmail_password>

    # OAuth - Google
    GOOGLE_CLIENT_ID=<your_google_client_id>
    GOOGLE_CLIENT_SECRET=<your_google_client_secret>
    GOOGLE_CALLBACK_URL=http://localhost:8080/api/v1/auth/google/callback

    # OAuth - GitHub
    GITHUB_CLIENT_ID=<your_github_client_id>
    GITHUB_CLIENT_SECRET=<your_github_client_secret>
    GITHUB_CALLBACK_URL=http://localhost:8080/api/v1/auth/github/callback

    # Cloudinary (for avatar uploads)
    CLOUDINARY_CLOUD_NAME=<your_cloud_name>
    CLOUDINARY_API_KEY=<your_api_key>
    CLOUDINARY_API_SECRET=<your_api_secret>

    # Frontend URLs
    CLIENT_SSO_REDIRECT_URL=http://localhost:3000/user/profile
    FORGOT_PASSWORD_REDIRECT_URL=http://localhost:3000/forgot-password
    ```

4.  **Start the Server:**

    ```bash
    # Development mode (with Nodemon)
    npm run dev

    # Production mode
    npm start
    ```

</div>

<div id="-api-endpoints">

## 📡 API Endpoints

### Open Routes (No Authentication Required)

#### User Registration

- `POST /api/v1/auth/register`
  - **Body**: `{ email, password }`
  - **Response**: User object + Access/Refresh tokens (cookies)

#### User Login

- `POST /api/v1/auth/login`
  - **Body**: `{ email, password }`
  - **Response**: User object + Access/Refresh tokens (cookies)

#### Email Verification

- `GET /api/v1/auth/verify-email/:verificationToken`
  - **Params**: `verificationToken`
  - **Response**: HTML success/failure page

#### Forgot Password

- `POST /api/v1/auth/forgot-password`
  - **Body**: `{ email }`
  - **Response**: Success message (email sent)

#### Reset Password

- `POST /api/v1/auth/reset-password/:resetToken`
  - **Params**: `resetToken`
  - **Body**: `{ newPassword }`
  - **Response**: Success message

#### Refresh Access Token

- `POST /api/v1/auth/refresh-token`
  - **Cookies**: `refreshToken`
  - **Response**: New Access/Refresh tokens

### OAuth Routes

#### Google OAuth

- `GET /api/v1/auth/google` - Initiates Google OAuth flow
- `GET /api/v1/auth/google/callback` - Google OAuth callback

#### GitHub OAuth

- `GET /api/v1/auth/github` - Initiates GitHub OAuth flow
- `GET /api/v1/auth/github/callback` - GitHub OAuth callback

### Protected Routes (Authentication Required)

#### Logout

- `POST /api/v1/auth/logout`
  - **Headers**: `Authorization: Bearer <accessToken>`
  - **Response**: Success message

#### Get Current User

- `GET /api/v1/auth/current-user`
  - **Headers**: `Authorization: Bearer <accessToken>`
  - **Response**: Current user object

#### Change Password

- `POST /api/v1/auth/change-password`
  - **Headers**: `Authorization: Bearer <accessToken>`
  - **Body**: `{ oldPassword, newPassword }`
  - **Response**: Success message

#### Update Avatar

- `PATCH /api/v1/auth/avatar`
  - **Headers**: `Authorization: Bearer <accessToken>`
  - **Body**: `multipart/form-data` with `avatar` field
  - **Response**: Updated user object

### Health Check

- `GET /api/v1/healthcheck`
  - **Response**: Server status

</div>

<div id="-contributing">

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

</div>

## 📄 License

This project is licensed under the ISC License.

---

## 🔑 Key Highlights

- **Zero Configuration**: Works out of the box with minimal setup
- **Production Ready**: Includes logging, error handling, and security best practices
- **Extensible**: Easy to add new authentication providers or features
- **Well Documented**: Clear code structure and comprehensive comments
- **Modern Stack**: Uses latest versions of Express, Mongoose, and other dependencies

Built with ❤️ by [Arush Choudhary](https://github.com/arush73)
