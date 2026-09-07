import requests


url = "http://127.0.0.1:5000/api/posts/1/comments"

response = requests.get(url)

print("Status:", response.status_code)
print("Response:", response.json())