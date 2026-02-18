# 📚 Library Management System - Full Stack with K8s & AWS

Sistema completo de gestión de bibliotecas con arquitectura moderna, Kubernetes y AWS.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-green)
![AWS](https://img.shields.io/badge/AWS-EKS-orange)

## 🚀 Features

### Backend
- ✅ **Flask REST API** con autenticación JWT
- ✅ **PostgreSQL** base de datos relacional
- ✅ **Roles** (Admin, Librarian, Member)
- ✅ **Redis** para caché
- ✅ **Celery** para tareas asíncronas
- ✅ **Prometheus** métricas
- ✅ **Pytest** con 95%+ coverage

### Frontend
- ✅ **React 18** con Material-UI
- ✅ **Nginx** en producción
- ✅ **Role-based routing**
- ✅ **Responsive design**

### DevOps
- ✅ **Docker Compose** para desarrollo
- ✅ **Kubernetes** manifests
- ✅ **Helm** charts
- ✅ **GitHub Actions** CI/CD
- ✅ **AWS EKS** deployment ready

## 🏗️ Arquitectura
```
library-k8s-aws/
├── backend/           # Flask API
├── frontend/          # React App
├── k8s/              # Kubernetes manifests
├── terraform/        # Infrastructure as Code
└── .github/          # CI/CD workflows
```

## 🚀 Quick Start

### Desarrollo Local
```bash
# Clonar
git clone https://github.com/AssistantIsa/library-k8s-aws.git
cd library-k8s-aws

# Levantar con Docker
docker-compose up -d

# Backend: http://localhost:5000
# Frontend: http://localhost:3000
# PostgreSQL: localhost:5433
```

### Credenciales por defecto
```
Admin: admin / admin123
```

## 🧪 Testing
```bash
# Backend tests
docker-compose exec backend pytest tests/ -v --cov

# Results: 15 passed, 95%+ coverage
```

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login (devuelve JWT)
- `GET /api/auth/me` - Usuario actual

### Books
- `GET /api/books` - Listar libros (con búsqueda)
- `POST /api/books` - Crear libro (admin/librarian)
- `PUT /api/books/:id` - Actualizar libro
- `DELETE /api/books/:id` - Eliminar libro

### Loans
- `POST /api/loans` - Pedir prestado
- `POST /api/loans/:id/return` - Devolver libro
- `GET /api/loans/my-loans` - Mis préstamos
- `GET /api/loans` - Todos los préstamos (admin)

## 🛠️ Stack Tecnológico

### Backend
```
Flask 3.0
PostgreSQL 15
SQLAlchemy
JWT Extended
Redis
Celery
Prometheus
Pytest
```

### Frontend
```
React 18
Material-UI 5
React Router 6
Axios
Nginx
```

### Infrastructure
```
Docker & Docker Compose
Kubernetes (EKS)
Terraform
AWS (EKS, RDS, S3, CloudWatch)
GitHub Actions
```

## 📊 Features Avanzadas

- 🔐 **JWT Authentication** con roles
- 📈 **Métricas** con Prometheus
- 🔄 **Tareas async** con Celery
- 🔍 **Búsqueda avanzada** de libros
- 💰 **Sistema de multas** automático
- 📧 **Notificaciones** por email
- 🎨 **Material-UI** design system
- 🧪 **95%+ test coverage**

## 🚀 Deployment

### Kubernetes (Minikube)
```bash
kubectl apply -f k8s/
```

### AWS EKS
```bash
cd terraform/
terraform init
terraform apply
```

## 🤝 Contributing

Contributions welcome! Ver [CONTRIBUTING.md](CONTRIBUTING.md)

## 📝 License

MIT License - Ver [LICENSE](LICENSE)

## 👨‍💻 Author

**Tu Nombre**
- GitHub: [@TuUsuario](https://github.com/AssistantIsa)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/juansanchezdev)

---

⭐️ Si te gustó este proyecto, dale una estrella!
