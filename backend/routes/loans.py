from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models.loan import Loan
from models.book import Book
from datetime import datetime
#from app import db
from utils.decorators import role_required
from extensions import db

loans_bp = Blueprint('loans', __name__)

@loans_bp.route('', methods=['POST'])
@jwt_required()
def create_loan():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    book_id = data['book_id']
    
    book = Book.query.get_or_404(book_id)
    
    if book.available_copies <= 0:
        return jsonify({'message': 'Book not available'}), 400
    
    # Verificar si el usuario ya tiene este libro
    existing_loan = Loan.query.filter_by(
        user_id=user_id,
        book_id=book_id,
        status='active'
    ).first()
    
    if existing_loan:
        return jsonify({'message': 'You already have this book'}), 400
    
    loan = Loan(user_id=user_id, book_id=book_id)
    book.available_copies -= 1
    
    db.session.add(loan)
    db.session.commit()
    
    return jsonify(loan.to_dict()), 201

@loans_bp.route('/<int:loan_id>/return', methods=['POST'])
@jwt_required()
def return_book(loan_id):
    user_id = int(get_jwt_identity())
    loan = Loan.query.get_or_404(loan_id)
    
    # Solo el usuario que prestó o admin/librarian pueden devolver
    claims = get_jwt()
    if loan.user_id != user_id and claims.get('role') not in ['admin', 'librarian']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    if loan.status != 'active':
        return jsonify({'message': 'Loan is not active'}), 400
    
    loan.return_date = datetime.utcnow()
    loan.status = 'returned'
    loan.calculate_fine()
    
    book = Book.query.get(loan.book_id)
    book.available_copies += 1
    
    db.session.commit()
    
    return jsonify(loan.to_dict()), 200

@loans_bp.route('/my-loans', methods=['GET'])
@jwt_required()
def get_my_loans():
    user_id = int(get_jwt_identity())
    loans = Loan.query.filter_by(user_id=user_id).all()
    return jsonify([loan.to_dict() for loan in loans]), 200

@loans_bp.route('', methods=['GET'])
@jwt_required()
@role_required(['admin', 'librarian'])
def get_all_loans():
    loans = Loan.query.all()
    return jsonify([loan.to_dict() for loan in loans]), 200
