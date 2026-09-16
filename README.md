# Kanya House of Sarees

A full-stack saree e-commerce web application built with **HTML, CSS, JavaScript, Python, Django, Django REST Framework, MySQL, and PostgreSQL**.

The application includes authentication, product browsing, category filtering, cart and wishlist functionality, checkout, order management, stock validation, and a Django admin dashboard.

## Overview

Kanya House of Sarees allows users to browse sarees by category, view product details, manage their cart and wishlist, create an account, place orders, and manage their profile.

The frontend is built with HTML, CSS, and JavaScript. The backend is built with Python, Django, and Django REST Framework.

MySQL is used during local development, while PostgreSQL is used in production through Neon.

## Features

- User registration and login
- Forgot-password and password-reset functionality
- Product browsing
- Product category filtering
- Product details
- Shopping cart
- Add, update, and remove cart items
- Wishlist functionality
- Stock availability validation
- Quantity validation based on available stock
- Checkout process
- Order placement
- Order history
- Order details
- User profile management
- REST API integration
- Django admin dashboard
- Responsive design

## Live Demo

- Frontend: [https://kanya-sarees-frontend.onrender.com](https://kanya-sarees-frontend.onrender.com)
- Backend API: [https://kanya-sarees-backend.onrender.com/api/products/](https://kanya-sarees-backend.onrender.com/api/products/)
- Django Admin: [https://kanya-sarees-backend.onrender.com/admin/](https://kanya-sarees-backend.onrender.com/admin/)

## Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Python
- Django
- Django REST Framework

### Database

- MySQL — local development
- PostgreSQL — production database using Neon

### Deployment

- Render

### Storage

- Cloudinary — product image storage in production

### Development Tools

- Visual Studio Code
- Git
- GitHub
- GitHub Desktop
- Postman

## Project Structure

```text
kanya-sarees/
│
├── backend/
│   ├── accounts/
│   │   ├── management/
│   │   │   ├── __init__.py
│   │   │   └── commands/
│   │   │       ├── __init__.py
│   │   │       └── create_admin.py
│   │   └── ...
│   │
│   ├── config/
│   ├── products/
│   └── manage.py
│
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   ├── images/
│   │   └── js/
│   │
│   └── pages/
│
├── screenshots/
│
├── .gitignore
└── README.md
```

The `create_admin.py` custom management command is used to create an admin user for the deployed application.

## API Endpoints

### Product Endpoints

- Retrieve all products — GET `/api/products/`
- Retrieve a specific product — GET `/api/products/<id>/`

### Authentication and Account Endpoints

- Create a new account — POST `/api/accounts/signup/`
- Log in a user — POST `/api/accounts/login/`
- Retrieve the user profile — GET `/api/accounts/profile/`
- Update the user profile — POST `/api/accounts/update-profile/`
- Request a password reset — POST `/api/accounts/forgot-password/`
- Reset the password — POST `/api/accounts/reset-password/`

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dhanapriyakolli-gif/kanya-sarees.git
cd kanya-sarees
```

### 2. Navigate to the Backend Folder

```bash
cd backend
```

### 3. Create a Virtual Environment

```bash
python -m venv venv
```

### 4. Activate the Virtual Environment

For Windows:

```bash
venv\Scripts\activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

### 6. Configure Environment Variables

Create a `.env` file inside the backend folder or configure the required environment variables according to the Django settings.

These may include:

- Django secret key
- Database credentials
- Database URL
- Cloudinary credentials
- Email configuration

Do not upload passwords, secret keys, database URLs, Cloudinary credentials, or email credentials to GitHub.

### 7. Configure the Database

For local development, create a MySQL database named:

```text
kanya_sarees
```

Configure the database credentials in the Django settings or environment variables.

For production, the project uses PostgreSQL through Neon.

### 8. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 9. Start the Django Development Server

```bash
python manage.py runserver
```

The backend will be available at:

```text
http://127.0.0.1:8000/
```

### 10. Run the Frontend

Open the frontend folder in Visual Studio Code and run it using a local development server such as the VS Code Live Server extension.

Example frontend URL:

```text
http://127.0.0.1:5500/frontend/pages/
```

## Deployment

The application is deployed using the following services:

- Frontend hosted on Render
- Django backend hosted on Render
- PostgreSQL production database hosted through Neon
- Product images stored using Cloudinary
- Django admin dashboard available through the deployed backend

## Screenshots

### Home Page

![Home Page](screenshots/home.png.jpeg)

### Products Page

![Products Page](screenshots/products.png.jpeg)

### Categories Page

![Categories Page](screenshots/categories.png.jpeg)

### Cart Page

![Cart Page](screenshots/cart.png.jpeg)

### Wishlist Page

![Wishlist Page](screenshots/wishlist.png.jpeg)

### Checkout Page

![Checkout Page](screenshots/checkout.png.jpeg)

### Orders Page

![Orders Page](screenshots/orders.png.jpeg)

### Login Page

![Login Page](screenshots/login.png.jpeg)

### Signup Page

![Signup Page](screenshots/signup.png.jpeg)

### Forgot Password Page

![Forgot Password Page](screenshots/forgotpassword.png.jpeg)

### Profile Page

![Profile Page](screenshots/profile.png.jpeg)

## GitHub Repository


[GitHub Repository](https://github.com/dhanapriyakolli-gif/kanya-sarees.git)