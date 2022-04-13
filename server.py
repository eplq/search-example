import sqlite3
from flask import Flask, render_template, jsonify, request

app = Flask("search example")
db = sqlite3.connect("sakila.db", check_same_thread=False)
cursor = db.cursor()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/fields")
def tables():
    cursor.execute("PRAGMA table_info(film);")
    result = [item[1] for item in cursor.fetchall()]
    return jsonify(result)

@app.route("/search")
def search():
    field = request.args.get("field")
    query = request.args.get("query")

    if not field or not query:
        return jsonify([])

    cursor.execute(f"SELECT * FROM film WHERE {field} LIKE '%{query}%' LIMIT 50")
    result = cursor.fetchall()

    return jsonify(result)

app.run("0.0.0.0", 8101, True)
