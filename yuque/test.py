import requests
import json
from bs4 import BeautifulSoup

response = requests.get("https://pkuschool.yuque.com/api/docs/glb1au?book_id=24846465")
if response.status_code == 200:
    data = response.json()
    # Convert HTML to plain text
    soup = BeautifulSoup(data['data']['content'], "html.parser")
    content = soup.get_text()

# Save document to a file
with open("document1.mdx", "w", encoding="utf-8") as file:
    file.write(content)
