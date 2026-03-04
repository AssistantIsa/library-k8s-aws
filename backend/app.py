from flask import Flask
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics
import os
from dotenv import load_dotenv
from extensions import db, jwt, migrate

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL',
        'postgresql://library_user:library_pass@postgres:5432/library_db'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400
    
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    
    metrics = PrometheusMetrics(app)
    metrics.info('library_app_info', 'Library Management System', version='1.0.0')
    
    with app.app_context():
        from models import User, Book, Loan, Category
        
        try:
            User.query.first()
        except Exception:
            print("Creating database tables...")
            db.create_all()
            print("Tables created!")
            
            try:
                admin = User(username='admin', email='admin@library.com', role='admin')
                admin.set_password('admin123')
                db.session.add(admin)
                
                cat = Category(name='General', description='General books')
                db.session.add(cat)
                
                db.session.commit()
                print("Admin user created!")
            except Exception as e:
                print(f"Error: {e}")
                db.session.rollback()
    
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
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
```

### **Paso 5: Scroll down y pon:**
```
