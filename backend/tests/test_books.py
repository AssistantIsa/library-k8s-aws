import pytest

def test_get_books_public(client):
    response = client.get('/api/books')
    assert response.status_code == 200
    assert 'books' in response.json

def test_create_book_as_admin(client, admin_token, default_category):
    response = client.post('/api/books',
        json={
            'isbn': '1234567890123',
            'title': 'Test Book',
            'author': 'Test Author',
            'publisher': 'Test Publisher',
            'publication_year': 2024,
            'category_id': default_category.id,
            'total_copies': 2,
            'description': 'A test book'
        },
        headers={'Authorization': f'Bearer {admin_token}'}
    )
    if response.status_code != 201:
        print(f"Error: {response.json}")
    assert response.status_code == 201
    assert response.json['title'] == 'Test Book'

def test_create_book_as_member_forbidden(client, member_token, default_category):
    response = client.post('/api/books',
        json={
            'isbn': '9999999999999',
            'title': 'Forbidden Book',
            'author': 'Some Author',
            'publisher': 'Publisher',
            'publication_year': 2024,
            'category_id': default_category.id,
            'total_copies': 1,
            'description': 'Test'
        },
        headers={'Authorization': f'Bearer {member_token}'}
    )
    assert response.status_code == 403

def test_get_book_by_id(client, sample_book):
    book_id = sample_book['id']
    response = client.get(f'/api/books/{book_id}')
    assert response.status_code == 200
    assert response.json['id'] == book_id

def test_update_book_as_admin(client, admin_token, sample_book):
    book_id = sample_book['id']
    response = client.put(f'/api/books/{book_id}',
        json={'title': 'Updated Title'},
        headers={'Authorization': f'Bearer {admin_token}'}
    )
    assert response.status_code == 200
    assert response.json['title'] == 'Updated Title'

def test_delete_book_as_admin(client, admin_token, default_category):
    # Crear libro para eliminar
    create_resp = client.post('/api/books',
        json={
            'isbn': '0000000000001',
            'title': 'Delete Me',
            'author': 'Author',
            'publisher': 'Publisher',
            'publication_year': 2024,
            'category_id': default_category.id,
            'total_copies': 1,
            'description': 'To be deleted'
        },
        headers={'Authorization': f'Bearer {admin_token}'}
    )
    assert create_resp.status_code == 201
    book_id = create_resp.json['id']

    # Eliminar
    response = client.delete(f'/api/books/{book_id}',
        headers={'Authorization': f'Bearer {admin_token}'}
    )
    assert response.status_code == 200

def test_search_books(client, sample_book):
    response = client.get('/api/books?search=Clean')
    assert response.status_code == 200
    assert len(response.json['books']) >= 1
