from fastapi import status


def test_list_products_with_search(client):
    response = client.get("/api/products?search=jeera")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["total"] >= 1
    assert any("Jeera" in p["name"] for p in data["items"])


def test_list_products_category_filter(client):
    categories = client.get("/api/categories").json()
    spices = next(c for c in categories if c["slug"] == "spices-and-masale")
    response = client.get(f"/api/products?category_id={spices['id']}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["total"] >= 1
    for p in data["items"]:
        assert p["category_id"] == spices["id"]


def test_update_product_and_pricing(client, auth_headers):
    # Fetch first product
    products = client.get("/api/products").json()["items"]
    prod = products[0]

    update_payload = {
        "name": f"{prod['name']} (Premium Batch)",
        "is_available": False,
        "price_options": [
            {
                "unit_label": "Special 1 kg pack",
                "quantity_value": 1000,
                "quantity_unit": "g",
                "price": 99.00,
                "is_default": True,
            }
        ],
    }

    response = client.put(f"/api/products/{prod['id']}", json=update_payload, headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"].endswith("(Premium Batch)")
    assert data["is_available"] is False
    assert len(data["price_options"]) == 1
    assert float(data["price_options"][0]["price"]) == 99.00


def test_delete_product(client, auth_headers):
    # Create product to delete
    categories = client.get("/api/categories").json()
    new_prod = {
        "name": "Temporary Test Item",
        "category_id": categories[0]["id"],
        "pricing_type": "custom_unit",
        "price_options": [
            {"unit_label": "1 Piece", "price": 10.00}
        ],
    }
    created = client.post("/api/products", json=new_prod, headers=auth_headers).json()
    prod_id = created["id"]

    # Delete
    del_res = client.delete(f"/api/products/{prod_id}", headers=auth_headers)
    assert del_res.status_code == status.HTTP_200_OK

    # Verify not found
    get_res = client.get(f"/api/products/{prod_id}")
    assert get_res.status_code == status.HTTP_404_NOT_FOUND
