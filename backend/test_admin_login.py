import requests


login_data = {
    "email": "sd@gmail.com",
    "password": "1234"
}


response = requests.post(
    "http://127.0.0.1:5000/api/admin/login",
    json=login_data
)


print(response.status_code)
print(response.json())