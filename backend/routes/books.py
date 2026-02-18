from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models.book import Book
from models.category import Category
#from app import db
from utils.decorators import role_required
from extensions import db

books_bp = Blueprint('books', __name__)

@books_bp.route('', methods=['GET'])
def get_books():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('search', '')
    category_id = request.args.get('category_id', type=int)
    
    query = Book.query
    
    if search:
        query = query.filter(
            (Book.title.ilike(f'%{search}%')) |
            (Book.author.ilike(f'%{search}%')) |
            (Book.isbn.ilike(f'%{search}%'))
        )
    
    if category_id:
        query = query.filter_by(category_id=category_id)
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'books': [book.to_dict() for book in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200

@books_bp.route('/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = Book.query.get_or_404(book_id)
    return jsonify(book.to_dict()), 200

@books_bp.route('', methods=['POST'])
@jwt_required()
@role_required(['admin', 'librarian'])
def create_book():
    data = request.get_json()
    
    if Book.query.filter_by(isbn=data['isbn']).first():
        return jsonify({'message': 'ISBN already exists'}), 409
    
    book = Book(
        isbn=data['isbn'],
        title=data['title'],
        author=data['author'],
        publisher=data.get('publisher'),
        publication_year=data.get('publication_year'),
        category_id=data.get('category_id'),
        total_copies=data.get('total_copies', 1),
        available_copies=data.get('total_copies', 1),
        description=data.get('description'),
        cover_image_url=data.get('cover_image_url')
    )
    
    db.session.add(book)
    db.session.commit()
    
    return jsonify(book.to_dict()), 201

@books_bp.route('/<int:book_id>', methods=['PUT'])
@jwt_required()
@role_required(['admin', 'librarian'])
def update_book(book_id):
    book = Book.query.get_or_404(book_id)
    data = request.get_json()
    
    for key, value in data.items():
        if hasattr(book, key) and key != 'id':
            setattr(book, key, value)
    
    db.session.commit()
    return jsonify(book.to_dict()), 200

@books_bp.route('/<int:book_id>', methods=['DELETE'])
@jwt_required()
@role_required(['admin'])
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({'message': 'Book deleted'}), 200
