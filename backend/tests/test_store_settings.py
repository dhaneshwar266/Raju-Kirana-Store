from fastapi import status


def test_get_store_settings(client):
    response = client.get("/api/store-settings")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "store_name" in data
    assert data["store_name"] == "Raju Kirana Store"
    assert data["currency_symbol"] == "₹"


def test_update_store_settings(client, auth_headers):
    update_payload = {
        "store_name": "Raju Kirana Store (Main Bazaar)",
        "whatsapp_number": "919999999999",
        "contact_phone": "+91 99999 99999",
    }
    response = client.put("/api/store-settings", json=update_payload, headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["store_name"] == "Raju Kirana Store (Main Bazaar)"
    assert data["whatsapp_number"] == "919999999999"


def test_unauthorized_store_settings_update(client):
    response = client.put("/api/store-settings", json={"store_name": "Hacked Store"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
