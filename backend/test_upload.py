import requests

url = "http://127.0.0.1:5000/api/admin/upload"

token = input("Paste your admin JWT token: ")

image_path = input("Enter image path: ")

with open(image_path, "rb") as image_file:
    files = {
        "image": image_file
    }

    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.post(
        url,
        files=files,
        headers=headers
    )

print("Status:", response.status_code)
print("Response:", response.json())