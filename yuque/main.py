import requests
import json

json_data = requests.get("https://pkuschool.yuque.com/api/docs?book_id=6880856").text
data = json.loads(json_data)
from bs4 import BeautifulSoup

slugs = [item['slug'] for item in data['data']]
total = len(slugs)
# Create an empty string to store all the data
document = ""

count = 0
for slug in slugs:
    response = requests.get(f"https://pkuschool.yuque.com/api/docs/{slug}?book_id=6880856")
    if response.status_code == 200:
        data = response.json()
        title = data['data']['title']

        # Convert HTML to plain text
        soup = BeautifulSoup(data['data']['content'], "html.parser")
        content = soup.get_text()

        # Append title and content to the document
        document += f"# {title}\n{content}\n\n"
        count += 1
        print(f"Successfully get data for slug: {slug}, {count}/{total}")
    else:
        print(f"Failed to get data for slug: {slug}")

# Save document to a file
with open("document.mdx", "w", encoding="utf-8") as file:
    file.write(document)
