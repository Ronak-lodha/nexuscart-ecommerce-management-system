# E-Commerce Management System

A full-stack management system built with **React** (Frontend) and **Django REST Framework** (Backend).

## Features
- **Dashboard**: High-level overview of sales, products, and orders.
- **Inventory Management**: List, search, and manage products.
- **Glassmorphism UI**: Modern, premium design with dark mode.
- **DRF API**: Robust backend with SQL database (SQLite).

## Setup Instructions

### Backend (Django)
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   ```bash
   .\venv\Scripts\activate
   ```
3. Run migrations and seed the database:
   ```bash
   python manage.py migrate
   python seed.py
   ```
4. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend (React + Vite)
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack
- **Frontend**: React, React Router, Axios, Lucide React, Vanilla CSS.
- **Backend**: Django 6, Django REST Framework, Django CORS Headers.
- **Database**: SQLite (SQL).
