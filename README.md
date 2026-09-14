# Kanya House of Sarees

A full-stack saree e-commerce web application built to provide a simple and user-friendly online shopping experience for sarees.

## Overview

Kanya House of Sarees allows users to browse sarees by category, view product details, manage their cart and wishlist, create an account, place orders, and manage their profile.

The project includes a frontend built with HTML, CSS, and JavaScript, along with a REST API backend built using Python, Django, and Django REST Framework. MySQL is used for database management.

## Features

* User registration and login
* Forgot and reset password
* Product browsing and category filtering
* Product details
* Shopping cart
* Wishlist
* Stock availability and quantity validation
* Checkout and order placement
* Order history
* Order details
* User profile management
* REST API integration
* MySQL database integration
* Responsive design

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Python
* Django
* Django REST Framework

### Database

* MySQL

### Tools

* Git
* GitHub
* GitHub Desktop
* Postman
* Visual Studio Code

## Project Structure

```text
kanya-sarees/
├── backend/
│   ├── accounts/
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
│   ├── home.png
│   ├── products.png
│   ├── categories.png
│   ├── cart.png
│   ├── wishlist.png
│   ├── checkout.png
│   ├── orders.png
│   ├── login.png
│   ├── signup.png
│   └── forgot-password.png
│
├── .gitignore
└── README.md
```

## API Endpoints

### Products

* `GET /api/products/` — Retrieve products
* `GET /api/products/<id>/` — Retrieve a specific product

### Authentication & Accounts

* `POST /api/accounts/signup/` — Create a new account
* `POST /api/accounts/login/` — User login
* `GET /api/accounts/profile/` — Retrieve user profile
* `PUT /api/accounts/update-profile/` — Update user profile
* `POST /api/accounts/forgot-password/` — Request password reset
* `POST /api/accounts/reset-password/` — Reset password

### Orders

* Order creation and order management are handled through the backend order APIs.

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/kanya-sarees.git
cd kanya-sarees
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install django djangorestframework mysqlclient pillow
```

### 3. Configure the Database

Create a MySQL database named:

```text
kanya_sarees
```

Configure your database credentials in the Django settings.

> Do not add your actual MySQL username, password, or other private credentials to this README.

### 4. Run Migrations

Run the following commands from the `backend` directory:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Start the Django Server

Start the Django development server:

```bash
python manage.py runserver
```

The backend will be available at:

```text
http://127.0.0.1:8000/
```

### 6. Run the Frontend

Open the `frontend` folder using a local development server such as **VS Code Live Server**.

Example:

```text
http://127.0.0.1:5500/frontend/pages/
```
## Screenshots

### Home

![Home Page](screenshots/home.png.jpeg)

### Products

![Products Page](screenshots/products.png.jpeg)

### Categories

![Categories Page](screenshots/categories.png.jpeg)

### Cart

![Cart Page](screenshots/cart.png.jpeg)

### Wishlist

![Wishlist Page](screenshots/wishlist.png.jpeg)

### Checkout

![Checkout Page](screenshots/checkout.png.jpeg)

### My Orders

![My Orders Page](screenshots/orders.png.jpeg)

### Login

![Login Page](screenshots/login.png.jpeg)

### Signup

![Signup Page](screenshots/signup.png.jpeg)

### Forgot Password

![Forgot Password Page](screenshots/forgotpassword.png.jpeg)

### Profile

![Profile Page](screenshots/profile.png.jpeg)
