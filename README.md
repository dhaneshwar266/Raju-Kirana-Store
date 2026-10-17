# Raju Kirana Store — Production Grocery Store Web Application

A full-stack, production-ready grocery store website built for **Raju Kirana Store**, a local Indian kirana shop. Designed with a distinct warm-cream, forest-green, and saffron aesthetic, this application provides an accurate daily grocery catalog, multi-tier pricing (packaged, loose weights by pav & grams, loose spices, and custom units), a protected store owner dashboard, live search and filtering, and optional WhatsApp customer inquiry.

---

## Architecture & Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS v4 with custom tokens (Forest Green `#164e3f`, Warm Cream `#faf8f5`, Saffron `#d97706`)
- **Icons**: Lucide React
- **Design Principles**: Mobile-first responsive layout, accessible contrast, empty states, loading skeletons, and interactive product rate modals.

### Backend
- **Framework**: Python FastAPI (Async REST API with auto-generated OpenAPI/Swagger docs)
- **Database ORM**: SQLAlchemy 2.0 with Decimal-safe numeric storage
- **Database**: PostgreSQL (Production) with SQLite fallback for zero-dependency local development
- **Migrations**: Alembic database migrations
- **Authentication**: Modern password hashing with `bcrypt` (work factor 12) & PyJWT cryptographic bearer tokens
- **Security**: In-memory login brute-force rate limiting (5 attempts per 15 min), security HTTP headers (`nosniff`, `DENY`, `strict-origin`), file upload MIME-type & Pillow image validation.

---

## Key Features

1. **Flexible 4-Tier Pricing Model**:
   - **Type A: Packaged Goods** — Specific packet sizes and per-packet prices (e.g., Poha — 500 g packet — ₹35.00).
   - **Type B: Products Sold by Weight** — Configurable loose weights such as 1 pav (250 g), 500 g, 750 g, 1 kg, and 5 kg sacks.
   - **Type C: Small-Quantity Spices** — Loose spices and seeds configured for 10 g, 20 g, 50 g, 100 g, 250 g, etc.
   - **Type D: Custom Selling Units** — Piece, Dozen, Half Dozen, Bottle, Litre, Tray, or Bundle.
   - **Monetary Safety**: All prices stored as database `Numeric(10, 2)` decimals to prevent floating-point calculation inaccuracies.

2. **Customer Website**:
   - Welcoming Indian Kirana storefront with hero section, rates transparency guarantees, and store contact.
   - Responsive category filter pills with dedicated Lucide category icons.
   - Live instant keyword search (names, brands, descriptions) and sorting (Name, Price Low/High, Newest).
   - In-stock and Out-of-stock badges.
   - Interactive **Product Details Modal** displaying all configured pack sizes and rates with 1-click selection.
   - Direct **WhatsApp Inquiry Button** (prefilled with product name, selected unit, and price).

3. **Secure Owner Admin Panel**:
   - Separate protected route (`/admin`) requiring owner authentication.
   - Live overview dashboard showing total products, categories, in-stock count, and recently updated items.
   - Complete Product CRUD with dynamic form adapting to the chosen pricing model.
   - Built-in live customer card preview before publishing.
   - Safe Category Management (prevents deletion of categories containing products).
   - Editable Store Settings (Store Name, Slogan, Phone, WhatsApp, Address, Timings, About Description).
   - Secure image upload with format validation, 5MB limit, and persistent file storage.

---

## Project Structure

```
Raju Kirana Store/
├── backend/
│   ├── app/
│   │   ├── api/                 # REST endpoints (auth, products, categories, store_settings, uploads, admin)
│   │   ├── core/                # Password hashing, JWT creation, and rate limiter
│   │   ├── models/              # SQLAlchemy database models (User, Category, Product, PriceOption, StoreSettings)
│   │   ├── schemas/             # Pydantic v2 validation models
│   │   ├── utils/               # Database seeder with realistic initial Kirana items
│   │   ├── config.py            # Environment configuration
│   │   ├── database.py          # Database engine and session manager
│   │   └── main.py              # FastAPI app instance, CORS & static uploads
│   ├── alembic/                 # Migration environment & versions
│   ├── tests/                   # Automated pytest suite (21 tests)
│   ├── create_admin.py          # CLI script to create/reset administrator accounts
│   ├── requirements.txt         # Python package dependencies
│   └── alembic.ini              # Alembic configuration
├── frontend/
│   ├── src/
│   │   ├── api/                 # Frontend API client and service endpoints
│   │   ├── components/          # Reusable UI components (Navbar, Footer, Hero, ProductCard, Modals, Toast)
│   │   ├── components/admin/    # Admin panel components (Dashboard, ProductList, PricingEditor, CategoryManager)
│   │   ├── context/             # AuthContext for session management
│   │   ├── pages/               # HomePage, ProductsPage, CategoriesPage, ContactPage, AdminLoginPage, AdminDashboardPage
│   │   ├── utils/               # Category icon mappers
│   │   ├── App.jsx              # Main routing and global state
│   │   └── index.css            # Tailwind CSS styling and theme tokens
│   ├── public/                  # Favicon & assets
│   ├── package.json             # NPM dependencies
│   └── vite.config.js           # Vite dev server and proxy configuration
├── uploads/                     # Persistent local storage for product photos
├── .env.example                 # Environment variable templates
├── .gitignore                   # Version control exclusions
└── README.md                    # Setup and deployment documentation
```

---

## Local Setup & Quickstart

### Prerequisites
- Python 3.10+ (tested on Python 3.13)
- Node.js 18+ & npm
- PostgreSQL (optional for production, SQLite is used out of the box for dev)

### 1. Backend Setup

```bash
cd "Raju Kirana Store/backend"

# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
venv/bin/alembic upgrade head

# (Optional) Create or change the first admin account
python create_admin.py --username admin --email admin@rajukirana.local --password "RajuKirana@2026"

# Start backend server
venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The API will be available at:
- **API Base**: `http://127.0.0.1:8000/api`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/api/docs`
- **ReDoc**: `http://127.0.0.1:8000/api/redoc`

### 2. Frontend Setup

In a separate terminal:

```bash
cd "Raju Kirana Store/frontend"

# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser to the local URL (e.g. `http://127.0.0.1:5173/` or `http://127.0.0.1:5177/`).

---

## Running Automated Tests

### Backend Unit & Integration Tests (Pytest)

```bash
cd "Raju Kirana Store/backend"
source venv/bin/activate
pytest -v
```

**Test Coverage Highlights**:
- Admin login with valid credentials, invalid password, rate limiting
- Category CRUD, duplicate prevention, and deletion protection when products exist
- Packaged goods pricing (Type A)
- Weight-based pricing (Type B: 1 pav 250g, 500g, 1kg)
- Loose spices pricing (Type C: 10g, 20g, 50g, 100g)
- Custom units pricing (Type D: Piece, Dozen, Tray)
- Validation rejection for negative prices (`HTTP 422`)
- Product search, filtering, and pagination
- Store settings public viewing and authorized updates

### Frontend Build Validation

```bash
cd "Raju Kirana Store/frontend"
npm run build
```

---

## Production Deployment Guide

### 1. Database Setup (PostgreSQL)
Create a PostgreSQL database and user:

```sql
CREATE DATABASE raju_kirana;
CREATE USER rajukirana_user WITH ENCRYPTED PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE raju_kirana TO rajukirana_user;
```

Update your `.env` file:
```env
DATABASE_URL=postgresql://rajukirana_user:your_strong_password@localhost:5432/raju_kirana
SECRET_KEY=generate_a_random_64_character_hex_key
UPLOAD_DIR=/var/www/rajukirana/uploads
```

Run migrations against PostgreSQL:
```bash
alembic upgrade head
```

### 2. Backend Service (Systemd / Gunicorn)
Create `/etc/systemd/system/rajukirana-backend.service`:

```ini
[Unit]
Description=Raju Kirana Store Backend API
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/rajukirana/backend
EnvironmentFile=/var/www/rajukirana/.env
ExecStart=/var/www/rajukirana/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4

[Install]
WantedBy=multi-user.target
```

### 3. Frontend Production Build & Nginx
Build the static bundle:
```bash
cd frontend
npm run build
```

Sample Nginx configuration (`/etc/nginx/sites-available/rajukirana.conf`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/rajukirana/frontend/dist;
    index index.html;

    # Frontend Single Page App Routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Reverse Proxy for FastAPI Backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Persistent Uploaded Product Images
    location /uploads/ {
        alias /var/www/rajukirana/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## Default Administrator Credentials
- **Username**: `admin`
- **Email**: `admin@rajukirana.local`
- **Password**: `RajuKirana@2026`

*To change these credentials, run `python create_admin.py` or update them in the admin dashboard.*
