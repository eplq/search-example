import sqlite3
from flask import Flask, render_template, jsonify

app = Flask("search example")
db = sqlite3.connect("sakila.db", check_same_thread=False)
cursor = db.cursor()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/tables")
def tables():
    cursor.execute("SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%';")
    result = [item[0] for item in cursor.fetchall()]
    return jsonify(result)


app.run("0.0.0.0", 8101, True)
