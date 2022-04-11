from flask import Flask, render_template

app = Flask("search example")

@app.route("/")
def index():
    return render_template("index.html")

app.run("0.0.0.0", 8101, True)
