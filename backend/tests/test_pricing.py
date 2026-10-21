from decimal import Decimal
from fastapi import status


def test_create_packaged_product_pricing(client, auth_headers):
    categories = client.get("/api/categories").json()
    cat_id = categories[0]["id"]

    packaged_payload = {
        "name": "Maggi 2-Minute Noodles",
        "brand": "Nestle",
        "category_id": cat_id,
        "pricing_type": "packaged",
        "description": "Instant noodles with masala tastemaker",
        "is_available": True,
        "is_featured": False,
        "price_options": [
            {
                "unit_label": "Single 70 g Pack",
                "quantity_value": 70,
                "quantity_unit": "g",
                "price": 14.00,
                "is_default": True,
                "sort_order": 1,
            },
            {
                "unit_label": "Family Pack (4 x 70 g)",
                "quantity_value": 280,
                "quantity_unit": "g",
                "price": 52.00,
                "is_default": False,
                "sort_order": 2,
            },
        ],
    }

    response = client.post("/api/products", json=packaged_payload, headers=auth_headers)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["pricing_type"] == "packaged"
    assert len(data["price_options"]) == 2
    assert float(data["price_options"][0]["price"]) == 14.00
    assert data["price_options"][0]["unit_label"] == "Single 70 g Pack"


def test_create_weight_based_product_pricing(client, auth_headers):
    categories = client.get("/api/categories").json()
    cat_id = categories[0]["id"]

    weight_payload = {
        "name": "Moong Dal Dhuli (Yellow)",
        "brand": "Store Loose",
        "category_id": cat_id,
        "pricing_type": "weight",
        "description": "Light, wholesome yellow moong lentils",
        "is_available": True,
        "price_options": [
            {
                "unit_label": "1 pav (250 g)",
                "quantity_value": 250,
                "quantity_unit": "g",
                "price": 32.00,
                "is_default": False,
                "sort_order": 1,
            },
            {
                "unit_label": "500 g",
                "quantity_value": 500,
                "quantity_unit": "g",
                "price": 62.00,
                "is_default": False,
                "sort_order": 2,
            },
            {
                "unit_label": "1 kg",
                "quantity_value": 1000,
                "quantity_unit": "g",
                "price": 120.00,
                "is_default": True,
                "sort_order": 3,
            },
        ],
    }

    response = client.post("/api/products", json=weight_payload, headers=auth_headers)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["pricing_type"] == "weight"
    assert len(data["price_options"]) == 3
    assert float(data["price_options"][0]["price"]) == 32.00
    assert float(data["price_options"][2]["price"]) == 120.00
    # Exactly option index 2 (1 kg) must be default, NOT option index 0 (1 pav)
    assert data["price_options"][0]["is_default"] is False
    assert data["price_options"][1]["is_default"] is False
    assert data["price_options"][2]["is_default"] is True


def test_create_small_quantity_spice_pricing(client, auth_headers):
    categories = client.get("/api/categories").json()
    spices_cat = next(c for c in categories if c["name"] == "मसाले और खड़े मसाले")

    spice_payload = {
        "name": "Elaichi / Green Cardamom",
        "brand": "Kerala Special",
        "category_id": spices_cat["id"],
        "pricing_type": "small_quantity",
        "description": "Premium large green cardamom pods",
        "price_options": [
            {"unit_label": "10 g", "quantity_value": 10, "quantity_unit": "g", "price": 45.00, "sort_order": 1},
            {"unit_label": "25 g", "quantity_value": 25, "quantity_unit": "g", "price": 110.00, "sort_order": 2},
            {"unit_label": "50 g", "quantity_value": 50, "quantity_unit": "g", "price": 210.00, "sort_order": 3},
            {"unit_label": "100 g", "quantity_value": 100, "quantity_unit": "g", "price": 400.00, "sort_order": 4},
        ],
    }

    response = client.post("/api/products", json=spice_payload, headers=auth_headers)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["pricing_type"] == "small_quantity"
    assert len(data["price_options"]) == 4


def test_negative_price_rejected(client, auth_headers):
    categories = client.get("/api/categories").json()
    cat_id = categories[0]["id"]

    invalid_payload = {
        "name": "Invalid Product",
        "category_id": cat_id,
        "pricing_type": "packaged",
        "price_options": [
            {"unit_label": "1 Pack", "price": -50.00},
        ],
    }

    response = client.post("/api/products", json=invalid_payload, headers=auth_headers)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_empty_price_options_rejected(client, auth_headers):
    categories = client.get("/api/categories").json()
    cat_id = categories[0]["id"]

    invalid_payload = {
        "name": "No Options Product",
        "category_id": cat_id,
        "pricing_type": "packaged",
        "price_options": [],
    }

    response = client.post("/api/products", json=invalid_payload, headers=auth_headers)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
