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
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        search = request.args.get('search', '', type=str).strip()
        language = request.args.get('language', '', type=str).strip()
        
        # Limitar queries
        if limit > 100:
            limit = 100
        if page > 10000:  # Prevenir queries muy grandes
            page = 10000
        
        query = Book.query
        
        # Filtro de idioma PRIMERO (más selectivo)
        if language:
            query = query.filter(Book.language == language)
        
        # Búsqueda optimizada
        if search:
            # Usar % solo al principio y fin para aprovechar índices
            search_pattern = f'%{search}%'
            query = query.filter(
                db.or_(
                    Book.title.ilike(search_pattern),
                    Book.author.ilike(search_pattern),
                    Book.isbn.like(f'{search}%')  # ISBN usa LIKE (más rápido)
                )
            )
        
        # Ordenar por ID (más rápido que created_at)
        query = query.order_by(Book.id)
        
        # Paginación
        pagination = query.paginate(
            page=page,
            per_page=limit,
            error_out=False,
            max_per_page=100
        )
        
        return jsonify({
            'books': [book.to_dict() for book in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'totalPages': pagination.pages,
            'current_page': page,
            'per_page': limit
        }), 200
        
    except Exception as e:
        print(f"Error in get_books: {e}")
        return jsonify({'error': str(e)}), 500

@books_bp.route('/<int:book_id>', methods=['GET'])
def get_book_by_id(book_id):
    try:
        book = Book.query.get(book_id)
        if not book:
            return jsonify({'message': 'Book not found'}), 404
        return jsonify(book.to_dict()), 200
    except Exception as e:
        print(f"Error getting book {book_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

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
