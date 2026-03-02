
# 📚 Library Management System

[![CI](https://github.com/AssistantIsa/library-k8s-aws/workflows/CI/badge.svg)](https://github.com/AssistantIsa/library-k8s-aws/actions)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://library-frontend-app.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Sistema completo de gestión de bibliotecas con Flask, React, PostgreSQL y Kubernetes

## 🌐 Demo en Vivo

- **Frontend:** https://library-frontend-app.onrender.com
- **Backend API:** https://library-backend-55dx.onrender.com/api
- **Usuarios de prueba:**
  - Admin: `admin` / `admin123`
  - Member: `john` / `john123`

⚠️ **Nota:** Render free tier duerme después de 15 min de inactividad. La primera petición puede tardar 30-60 segundos.

## ✨ Features

### 🔐 Autenticación y Autorización
- JWT authentication con refresh tokens
- 3 roles: Admin, Librarian, Member
- Rutas protegidas por rol
- Sesiones seguras

### 📚 Gestión de Libros
- CRUD completo (Admin/Librarian)
- Búsqueda avanzada por título, autor, ISBN
- **Filtros por idioma** (🇬🇧 🇪🇸 🇫🇷 🇩🇪)
- Categorización por temas
- Gestión de inventario (copias disponibles)
- Portadas de libros

### 📖 Sistema de Préstamos
- Préstamo de libros (Members)
- Devolución con cálculo de multas
- Renovaciones
- Historial completo
- Límites de préstamos simultáneos

### 📊 Dashboard
- Estadísticas en tiempo real
- Libros más prestados
- Usuarios más activos
- Ingresos por multas

### 🌍 Multi-idioma
- Base de datos con **100,000+ libros**
- Soporte para múltiples idiomas
- Filtrado dinámico por idioma

## 🎬 Screenshots

### Login
![Login](docs/screenshots/01-login.png)

### Catálogo de Libros con Filtro de Idioma
![Books](docs/screenshots/03-books-list.png)

### Panel de Administración
![Manage](docs/screenshots/05-manage-books.png)

### Mis Préstamos
![Loans](docs/screenshots/07-my-loans.png)

## 🏗️ Arquitectura
```
┌─────────────────┐
│   React App     │  Frontend (Material-UI)
│   (Nginx)       │  Port 80
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   Flask API     │  Backend REST
│   (Gunicorn)    │  Port 5000
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PostgreSQL 15  │  Database
│   (RDS/Render)  │  Port 5432
└─────────────────┘
```

## 🛠️ Stack Tecnológico

### Backend
- **Framework:** Flask 3.0
- **Database:** PostgreSQL 15
- **ORM:** SQLAlchemy
- **Auth:** Flask-JWT-Extended
- **Validation:** Marshmallow
- **Cache:** Redis (future)
- **Testing:** Pytest (81% coverage)

### Frontend
- **Framework:** React 18
- **UI Library:** Material-UI 5
- **Routing:** React Router 6
- **HTTP Client:** Axios
- **State:** Context API

### DevOps
- **Containers:** Docker + Docker Compose
- **Orchestration:** Kubernetes (Minikube)
- **CI/CD:** GitHub Actions
- **Deployment:** Render.com
- **IaC:** Helm Charts (future)

## 🚀 Quick Start

### Con Docker (Recomendado)
```bash
# Clonar
git clone https://github.com/AssistantIsa/library-k8s-aws.git
cd library-k8s-aws

# Levantar todo el stack
docker-compose up -d

# Acceder
# Backend:  http://localhost:5000
# Frontend: http://localhost:3000
# DB:       localhost:5433
```

### Sin Docker

#### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configurar .env
cp .env.example .env

# Inicializar BD
python init_db.py

# Ejecutar
python app.py
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 🧪 Testing
```bash
# Backend tests
cd backend
pytest tests/ -v --cov

# Resultado esperado: 11 passed, 81% coverage
```

## 📊 Población de Base de Datos
```bash
cd backend
python populate_books_v2.py

# Descarga 100,000+ libros de Open Library
# Tiempo estimado: 2-4 horas
```

## 🌍 Kubernetes
```bash
# Levantar en Minikube
kubectl apply -f k8s/

# Verificar
kubectl get pods -n library
kubectl get svc -n library

# Acceder
minikube service frontend-service -n library
```

## 📚 API Endpoints

### Auth
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login (devuelve JWT)
- `GET /api/auth/me` - Usuario actual

### Books
- `GET /api/books` - Listar libros (búsqueda, filtros)
- `GET /api/books/:id` - Obtener libro
- `POST /api/books` - Crear libro (admin/librarian)
- `PUT /api/books/:id` - Actualizar libro
- `DELETE /api/books/:id` - Eliminar libro
- `GET /api/books/languages` - Idiomas disponibles

### Loans
- `POST /api/loans` - Crear préstamo
- `POST /api/loans/:id/return` - Devolver libro
- `GET /api/loans/my-loans` - Mis préstamos
- `GET /api/loans` - Todos (admin)

## 🔒 Seguridad

- ✅ JWT tokens con expiración
- ✅ Passwords hasheados (Werkzeug)
- ✅ CORS configurado
- ✅ SQL injection protection (SQLAlchemy)
- ✅ XSS protection (React)
- ✅ Rate limiting (future)
- ✅ HTTPS en producción

## 📈 Roadmap

- [ ] Sistema de notificaciones por email
- [ ] Búsqueda avanzada con Elasticsearch
- [ ] Sistema de ratings/reviews
- [ ] Exportar reportes en PDF
- [ ] Sistema de reservas
- [ ] Integración con APIs externas (Google Books)
- [ ] Monitoring con Prometheus + Grafana
- [ ] Deploy en AWS EKS

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 License

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@AssistantIsa](https://github.com/AssistantIsa)
- LinkedIn: [juansanchezdev](https://www.linkedin.com/in/juansanchezdev)
- Email: usanaconisa@gmail.com

---

⭐️ Si este proyecto te fue útil, dale una estrella!

## 📊 Poblar Base de Datos con Libros Reales

El sistema incluye scripts para descargar automáticamente libros desde Open Library API.
```bash
cd backend

# Opción 1: Script mejorado (recomendado)
python scripts/populate_books_v2.py

# Opción 2: Con Docker
docker-compose exec backend python scripts/populate_books_v2.py

# Monitorear progreso
watch -n 30 'docker-compose exec postgres psql -U library_user -d library_db -c "SELECT COUNT(*) FROM books;"'
```

**Resultado esperado:** ~100,000 libros en múltiples idiomas

📖 Ver [scripts/README.md](backend/scripts/README.md) para más detalles.

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
 
 
 
