import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth.models import User


@pytest.mark.django_db
def test_user_registration_and_jwt():
    client = APIClient()
    resp = client.post('/api/auth/register/', {
        'username': 'alice', 'email': 'alice@example.com', 'password': 'password123'
    }, format='json')
    assert resp.status_code == 201

    resp = client.post('/api/auth/token/', {
        'username': 'alice', 'password': 'password123'
    }, format='json')
    assert resp.status_code == 200
    access = resp.data['access']

    client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
    # Create a task
    resp = client.post('/api/tasks/', {
        'title': 'Task 1',
        'description': 'First',
        'priority': 'high',
        'status': 'pending'
    }, format='json')
    assert resp.status_code == 201
    task_id = resp.data['id']

    # List tasks with pagination
    resp = client.get('/api/tasks/?page=1')
    assert resp.status_code == 200
    assert resp.data['count'] == 1

    # Filter by status
    resp = client.get('/api/tasks/?status=pending')
    assert resp.status_code == 200

    # Search by title
    resp = client.get('/api/tasks/?search=Task')
    assert resp.status_code == 200

    # Update
    resp = client.patch(f'/api/tasks/{task_id}/', {'status': 'completed'}, format='json')
    assert resp.status_code == 200
    assert resp.data['status'] == 'completed'

    # Delete
    resp = client.delete(f'/api/tasks/{task_id}/')
    assert resp.status_code == 204