from fastapi import status


def test_list_categories(client):
    response = client.get("/api/categories")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 10
    names = [c["name"] for c in data]
    assert "आटा, चावल और अनाज" in names
    assert "मसाले और खड़े मसाले" in names


def test_create_category(client, auth_headers):
    new_cat = {
        "name": "Dairy and Paneer",
        "slug": "dairy-and-paneer",
        "description": "Fresh milk, paneer, and butter",
        "icon_name": "Milk",
        "sort_order": 12,
    }
    response = client.post("/api/categories", json=new_cat, headers=auth_headers)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["name"] == "Dairy and Paneer"
    assert data["slug"] == "dairy-and-paneer"


def test_create_duplicate_category(client, auth_headers):
    dup_cat = {
        "name": "आटा, चावल और अनाज",
    }
    response = client.post("/api/categories", json=dup_cat, headers=auth_headers)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_delete_category_with_products_prevented(client, auth_headers):
    # आटा, चावल और अनाज has products seeded
    categories = client.get("/api/categories").json()
    atta_cat = next(c for c in categories if c["name"] == "आटा, चावल और अनाज")
    response = client.delete(f"/api/categories/{atta_cat['id']}", headers=auth_headers)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Cannot delete category" in response.json()["detail"]

