import requests


BASE_URL = "http://127.0.0.1:5000"


# Login
login_data = {
    "email": "sd@gmail.com",
    "password": "1234"
}

login_response = requests.post(
    f"{BASE_URL}/api/admin/login",
    json=login_data
)

print("Login:", login_response.status_code)

token = login_response.json()["access_token"]


# Add additional story
headers = {
    "Authorization": f"Bearer {token}"
}

story_data = {
    "title": "One Year Later",
    "content": "The storyteller shared what happened one year after the original journey."
}

response = requests.post(
    f"{BASE_URL}/api/admin/posts/1/additional-stories",
    json=story_data,
    headers=headers
)

print("Additional story:", response.status_code)
print(response.json())