from app import create_app
from extensions import db
from models.user import User
from models.book import Book
from models.loan import Loan
from models.category import Category

app = create_app()

with app.app_context():
    # Crear tablas
    db.create_all()
    print("✅ Tablas creadas")
    
    # Crear categorías por defecto
    if not Category.query.first():
        categories = [
            Category(name='Fiction', description='Fiction books'),
            Category(name='Science', description='Science books'),
            Category(name='Technology', description='Technology books'),
            Category(name='History', description='History books'),
            Category(name='Biography', description='Biography books')
        ]
        db.session.add_all(categories)
        db.session.commit()
        print("✅ Categorías creadas")
    
    # Crear admin por defecto
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            email='admin@library.com',
            role='admin'
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("✅ Admin creado")
    
    print("✅ Base de datos lista!")
