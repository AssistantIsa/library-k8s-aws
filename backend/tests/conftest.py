import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
import app as application_module
from extensions import db as _db
from models.user import User
from models.book import Book
from models.category import Category

@pytest.fixture(scope='session')
def app():
    app_instance = application_module.create_app()
    app_instance.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'JWT_SECRET_KEY': 'test-secret-key-minimum-32-chars-long-for-sha256-algorithm'
    })
    yield app_instance

@pytest.fixture(scope='session')
def db(app):
    with app.app_context():
        _db.create_all()
        
        # Crear categoría por defecto
        category = Category(name='Fiction', description='Fiction books')
        _db.session.add(category)
        _db.session.commit()
        
        yield _db
        _db.drop_all()

@pytest.fixture(scope='function', autouse=True)
def session(db):
    """Limpiar datos entre tests (pero no categorías)"""
    yield
    # Solo limpiar usuarios, libros y préstamos
    from models.loan import Loan
    db.session.query(Loan).delete()
    db.session.query(Book).delete()
    db.session.query(User).delete()
    db.session.commit()

@pytest.fixture(scope='function')
def client(app):
    with app.test_client() as client:
        with app.app_context():
            yield client

@pytest.fixture(scope='session')
def default_category(db, app):
    """Obtener categoría por defecto (ya creada en fixture db)"""
    with app.app_context():
        category = Category.query.filter_by(name='Fiction').first()
        return category

@pytest.fixture
def admin_user(db):
    """Crear usuario admin para tests"""
    user = User(username='testadmin', email='testadmin@test.com', role='admin')
    user.set_password('admin123')
    db.session.add(user)
    db.session.commit()
    return user

@pytest.fixture
def admin_token(client, admin_user):
    """Token de admin"""
    response = client.post('/api/auth/login', json={
        'username': 'testadmin',
        'password': 'admin123'
    })
    assert response.status_code == 200, f"Login failed: {response.json}"
    return response.json['access_token']

@pytest.fixture
def member_user(db):
    """Crear usuario member para tests"""
    user = User(username='testmember', email='testmember@test.com', role='member')
    user.set_password('member123')
    db.session.add(user)
    db.session.commit()
    return user

@pytest.fixture
def member_token(client, member_user):
    """Token de member"""
    response = client.post('/api/auth/login', json={
        'username': 'testmember',
        'password': 'member123'
    })
    assert response.status_code == 200, f"Login failed: {response.json}"
    return response.json['access_token']

@pytest.fixture
def sample_book(client, admin_token, default_category):
    """Crear libro de prueba"""
    response = client.post('/api/books',
        json={
            'isbn': '9780134685991',
            'title': 'Clean Code',
            'author': 'Robert Martin',
            'publisher': 'Prentice Hall',
            'publication_year': 2008,
            'category_id': default_category.id,
            'total_copies': 3,
            'description': 'Test book'
        },
        headers={'Authorization': f'Bearer {admin_token}'}
    )
    assert response.status_code == 201, f"Failed to create book: {response.json}"
    return response.json
