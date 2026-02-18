def test_get_current_user(client, member_user, member_token):
    response = client.get('/api/auth/me',
        headers={'Authorization': f'Bearer {member_token}'}
    )
    assert response.status_code == 200
    assert response.json['username'] == 'testmember'
