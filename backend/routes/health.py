from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

@health_bp.route('/ready', methods=['GET'])
def ready():
    # Aquí podrías verificar DB, Redis, etc.
    return jsonify({'status': 'ready'}), 200
