from flask import Blueprint
from flask import request, make_response, jsonify
import json
import csv
from helper_auth import *
from helper_blog import *
from flask_mysqldb import MySQL
import MySQLdb as err
from server import mysql

auth = Blueprint("auth",__name__)


#SignUp Function
#New User Registration
@auth.route('/signup',methods=['POST'])
def signup():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']
    print('register request received')
    #generating new salt and password_hash
    salt = generate_salt()
    password_hash = multiple_hashing(password,salt)

    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
        """INSERT INTO users (name, email, password,salt)
        VALUES (%s, %s, %s, %s) """, (name,email,password_hash,salt) 
        )
        mysql.connection.commit()
        cursor.close()
        message = {"message": "Registration Completed"}
        return message
    except err.IntegrityError: #if email already present it will show integrity error
        message = {"message":"Email is already present"}
        return message
    


@auth.route('/')
def check():

    #check for content in user table
    cursor = mysql.connection.cursor()
    cursor.execute (
        """SELECT * FROM users;"""
    )
    results = cursor.fetchall()
    cursor.close()
    items = []
    for item in results:
        items.append(item)
    return {"users": items}


#check whether addressed user is valid or not
def isUserValid(id):
    print('isUserValid',id)
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * FROM users WHERE id = %s""",(id,)
    )
    user = cursor.fetchone()
    cursor.close()
    if user:return True
    else: return False


@auth.route('/login',methods = ['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

    #check if email is valid/present in db
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT id,name,email,password,salt FROM users WHERE email = %s""",(email,))
    user = cursor.fetchone()
    cursor.close()
    if user: #if user is present
        if multiple_hashing(password,user['salt']) == user['password']: #if password is correct
            #returning token
            token = Encode(user['id'])
            return {"message":"Entered password is correct",
                "token":token,"loggedIn":True}
        else:
            return {"message":"Password is incorrect","loggedIn":False}
    else:
        return {"message":"Email is not registered","loggedIn":False}


@auth.route('/getuserdata')
def getuserdata():
     #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])

    print(user_id)

    if isUserValid(user_id):
            cursor = mysql.connection.cursor()
            cursor.execute (
                """SELECT name,email FROM users WHERE id = %s;""",(user_id,)
            )
            results = cursor.fetchone()
            cursor.close()
            detail = [results]
            return {"message":"User Details sent","detail":detail}
    else:
        return {"message":"User is not registered in record"}  

