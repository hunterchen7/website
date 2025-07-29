import os
import requests

ICON_URLS = {
    "typescript.svg": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
    "javascript.svg": "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg",
    "python.svg": "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    "java.svg": "https://upload.wikimedia.org/wikipedia/it/2/2e/Java_Logo.svg",
    "rust.svg": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg",
    "c.svg": "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Programming_Language.svg",
    "cplusplus.svg": "https://www.svgrepo.com/download/374094/c-plus-plus.svg",
    "react.svg": "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    "sql.svg": "https://www.svgrepo.com/download/331760/sql-database-generic.svg",
    "sqlite.svg": "https://upload.wikimedia.org/wikipedia/commons/3/38/SQLite370.svg",
    "postgresql.svg": "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg",
}

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
icons_dir = os.path.join(project_root, "public", "icons")
os.makedirs(icons_dir, exist_ok=True)

for filename, url in ICON_URLS.items():
    print(f"Downloading {filename} from {url}")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        with open(os.path.join(icons_dir, filename), "wb") as f:
            f.write(response.content)
        print(f"Saved {filename}")
    else:
        print(f"Failed to download {filename}: {response.status_code}")
