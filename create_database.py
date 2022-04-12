import sqlite3

schema_sql = open("sql/sqlite-sakila-schema.sql", "r")
data_sql = open("sql/sqlite-sakila-insert-data.sql", "r")

connection = sqlite3.connect("sakila.db")
cursor = connection.cursor()


cursor.executescript(schema_sql.read())
connection.commit()

cursor.executescript(data_sql.read())
connection.commit()


cursor.execute("SELECT * FROM actor;")
rowcount = len(cursor.fetchall())

print(f"There are {rowcount} actors")
