from flask import Flask

app = Flask("search example")



app.run("0.0.0.0", 8101, True)
