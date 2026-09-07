import requests


post_data = {
    "title": "Started With ₹10,000 and Built a Business",
    "description": "A journey about starting small and building a business.",
    "category": "Business",
    "storyteller": "Rahul",
    "starting_point": "Started with small savings.",
    "how_started": "Started by testing a simple business idea.",
    "current_income": "The business now generates a stable income.",
    "approach": "Started small and improved continuously.",
    "life_changed": "The journey created financial independence.",
    "failures": "Several early attempts failed.",
    "lessons": "Start small, learn from mistakes, and keep improving."
}


response = requests.post(
    "http://127.0.0.1:5000/api/posts",
    json=post_data
)


print(response.status_code)
print(response.json())