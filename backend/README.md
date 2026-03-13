# AI Career Recommendation Backend

## Project Description

This project is the **backend service** for a web-based career
consultation platform designed to help users discover their future
career or education path.

The system is built using **Express.js** as the backend framework,
**Prisma ORM** for database management, and **MySQL** as the primary
database. The backend provides APIs that process user input and generate
recommendations using **AI-based analysis**.

Many young people today struggle to determine what career path or
educational direction they should pursue. This platform aims to address
that problem by providing personalized recommendations based on a user's
interests and preferences.

Through this system, users can receive recommendations for:

- Suitable career paths\
- University majors or study programs\
- Professional certifications\
- Bootcamps and skill development programs

By leveraging AI-powered recommendations, the platform helps users make
more informed decisions about their future through a structured and
accessible consultation process.

---

## Tech Stack

- Node.js
- Express.js
- Prisma ORM
- MySQL
- Gemini AI Integration

---

## Features

- Career recommendation system
- Interest-based consultation
- AI-powered suggestion engine
- RESTful API backend
- Structured data management with Prisma

---

## Installation

```bash
git clone https://github.com/Mahardika-Ardi/MasaDepanKu.git
cd MasaDepanKu
npm install
npx prisma init
```

### Setup Environment

Change a `.env` file and configure the database connection.

    DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"

### Run Migration

```bash
npx prisma migrate dev
```

### Run Development Server

```bash
npm run dev
```

---

## API Endpoints

Example structure:

Method Endpoint Description

---

POST /auth/register Register new user
POST /auth/login User authentication
POST /consultation Submit consultation data
GET /recommendations Get AI career recommendations

---

## Project Structure

    MasaDepanKu - BackEnd/
     ├── controllers
     ├── services
     ├── routes
     ├── middlewares
     ├── prisma
     └── utils

---

## Future Improvements

- AI model refinement for more accurate recommendations
- User profile analytics
- Advanced career path visualization

---

## License

This project is created for educational and capstone project purposes.
