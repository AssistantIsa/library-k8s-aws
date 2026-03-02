from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics
import os
from dotenv import load_dotenv

load_dotenv()

# Inicializar extensiones
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    # Configuración
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL',
        'postgresql://library_user:library_pass@localhost:5432/library_db'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400
    
    # Inicializar extensiones
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    
    # Métricas Prometheus
    metrics = PrometheusMetrics(app)
    metrics.info('library_app_info', 'Library Management System', version='1.0.0')
    
    # Importar modelos
    with app.app_context():
        from models.user import User
        from models.book import Book
        from models.loan import Loan
        from models.category import Category
        
        # Crear tablas
        db.create_all()
    
    # Registrar blueprints
    from routes.auth import auth_bp
    from routes.books import books_bp
    from routes.loans import loans_bp
    from routes.health import health_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(books_bp, url_prefix='/api/books')
    app.register_blueprint(loans_bp, url_prefix='/api/loans')
    app.register_blueprint(health_bp, url_prefix='/api')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
