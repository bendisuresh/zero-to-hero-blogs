import requests


BASE_URL = "http://127.0.0.1:5000"


# Login and get JWT
login_data = {
    "email": "sd@gmail.com",
    "password": "1234"
}

login_response = requests.post(
    f"{BASE_URL}/api/admin/login",
    json=login_data
)

print("Login status:", login_response.status_code)

token = login_response.json()["access_token"]

print("JWT received successfully")


# Send JWT to protected dashboard
headers = {
    "Authorization": f"Bearer {token}"
}

dashboard_response = requests.get(
    f"{BASE_URL}/api/admin/dashboard",
    headers=headers
)

print("Dashboard status:", dashboard_response.status_code)
print(dashboard_response.json())