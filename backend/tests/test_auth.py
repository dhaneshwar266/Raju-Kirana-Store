from fastapi import status


def test_login_success(client):
    response = client.post(
        "/api/auth/login",
        json={"username_or_email": "admin", "password": "RajuKirana@2026"},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "admin"


def test_login_wrong_password(client):
    response = client.post(
        "/api/auth/login",
        json={"username_or_email": "admin", "password": "WrongPassword!"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "detail" in response.json()


def test_login_nonexistent_user(client):
    response = client.post(
        "/api/auth/login",
        json={"username_or_email": "nobody", "password": "AnyPassword123"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_current_admin(client, auth_headers):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["username"] == "admin"


def test_unauthorized_access(client):
    response = client.get("/api/auth/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
