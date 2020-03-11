from flask import Flask
from flask import request, make_response, jsonify
from flask_mysqldb import MySQL
import json

app = Flask(__name__)

#configuring sql db with auth
app.config['MYSQL_USER'] = 'sagar'
app.config['MYSQL_PASSWORD'] = 'anku123'
app.config['MYSQL_DB'] = 'Blog_Application'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

from blueprint_auth import auth
from blueprint_blog import blog
app.register_blueprint(auth,url_prefix='/auth')
app.register_blueprint(blog,url_prefix='/blog')



# @app.route('/update')
# def update():
#     cursor = mysql.connection.cursor()
#     cursor.execute(
#         """UPDATE users SET name = %s WHERE id > %s""", ("Yogesh", 4) 
#         )
#     mysql.connection.commit()
#     cursor.close()
#     return {"message": "users updated"}


# @app.route('/delete')
# def delete():
#     cursor = mysql.connection.cursor()
#     cursor.execute(
#         """DELETE FROM users WHERE id = %s""", (1,) 
#         )
#     mysql.connection.commit()
#     cursor.close()
#     return {"message": "user deleted"}