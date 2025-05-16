from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

DATA_DIR = "data"
USERS_FILE = os.path.join(DATA_DIR, "users.json")

# Klasör ve dosyaları oluştur
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump([], f)

# Yardımcı fonksiyonlar
def get_tasks_file(email):
    filename = f"tasks_{email.replace('@', '_at_')}.json"
    return os.path.join(DATA_DIR, filename)

def load_tasks(email):
    path = get_tasks_file(email)
    if not os.path.exists(path):
        return []
    with open(path, "r") as f:
        return json.load(f)

def save_tasks(email, tasks):
    with open(get_tasks_file(email), "w") as f:
        json.dump(tasks, f, indent=2)

# API: Kullanıcı Kayıt
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Eksik bilgi"}), 400

    with open(USERS_FILE, "r+") as f:
        users = json.load(f)
        if any(u["email"] == email for u in users):
            return jsonify({"message": "Bu kullanıcı zaten var"}), 409
        users.append({"email": email, "password": password})
        f.seek(0)
        json.dump(users, f)
        f.truncate()

    return jsonify({"message": "Kayıt başarılı"}), 200

# API: Kullanıcı Giriş
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    with open(USERS_FILE, "r") as f:
        users = json.load(f)
        for user in users:
            if user["email"] == email and user["password"] == password:
                return jsonify({"message": "Giriş başarılı", "email": email}), 200

    return jsonify({"message": "Giriş başarısız"}), 401

# API: Görevleri Getir
@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    email = request.args.get("email")
    if not email:
        return jsonify({"message": "Email eksik"}), 400

    tasks = load_tasks(email)
    return jsonify(tasks), 200

# API: Görev Ekle
@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    email = data.get("email")
    text = data.get("text")
    task_type = data.get("type")

    if not all([email, text, task_type]):
        return jsonify({"message": "Eksik görev verisi"}), 400

    tasks = load_tasks(email)
    new_task = {
        "id": max([t["id"] for t in tasks], default=0) + 1,
        "text": text,
        "type": task_type,
        "completed": False
    }
    tasks.append(new_task)
    save_tasks(email, tasks)
    return jsonify(new_task), 201

# API: Görev Durumu Güncelle (tamamlandı)
@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def toggle_task(task_id):
    email = request.args.get("email")
    if not email:
        return jsonify({"message": "Email eksik"}), 400

    tasks = load_tasks(email)
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = not task["completed"]
            break
    save_tasks(email, tasks)
    return jsonify({"message": "Durum güncellendi"}), 200

# API: Görev Sil
@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    email = request.args.get("email")
    if not email:
        return jsonify({"message": "Email eksik"}), 400

    tasks = load_tasks(email)
    tasks = [t for t in tasks if t["id"] != task_id]
    save_tasks(email, tasks)
    return jsonify({"message": "Görev silindi"}), 200

# Ana çalıştırıcı
if __name__ == "__main__":
    app.run(debug=True)
