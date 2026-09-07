import requests


url = "http://127.0.0.1:5000/api/admin/comments/1"

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc4ODYwNTMyOCwianRpIjoiNTYwMWI0MjUtMDQzYy00MGVmLWIyMmItNWY0ZjdiMzcwMjc4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InNkQGdtYWlsLmNvbSIsIm5iZiI6MTc4ODYwNTMyOCwiY3NyZiI6ImM1OTg5OGZhLWM1ZWUtNDVhZC05YWQ2LTc3MTVjMDgwNDY1ZCIsImV4cCI6MTc4ODYwNjIyOH0.cjDLuRwUA2L0CVuKG8viwWv3kYCOCtMTHaeZrGk5UKE"

headers = {
    "Authorization": f"Bearer {token}"
}

response = requests.delete(
    url,
    headers=headers
)

print("Status:", response.status_code)
print("Response:", response.json())