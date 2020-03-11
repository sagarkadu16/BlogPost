from flask import Blueprint
from flask import request, make_response, jsonify
import jwt
import json
import csv
from helper_blog import *
from flask_mysqldb import MySQL
import MySQLdb as err
from server import mysql

blog = Blueprint("blog",__name__)

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

def get_id_category(category_name):
        cursor = mysql.connection.cursor()
        cursor.execute(
            """SELECT * FROM categories WHERE category_name = %s""",(category_name,)
        )
        result = cursor.fetchone()
        cat_id = result['id']
        return cat_id


#create blog with listed data
def create_blog(name,url,category_name,description,user_id):
        #check id of category
        category_id = get_id_category(category_name)
        cursor = mysql.connection.cursor()
        cursor.execute(
            """INSERT INTO blog (name, url, description, category_id, user_id)
            VALUES (%s, %s, %s, %s, %s) """, (name,url,description,category_id,user_id) 
        )
        mysql.connection.commit()
        cursor.close()
        return True
   
#=====================================================================================================


#create blog
@blog.route('/create',methods = ['POST'])
def createBlog():
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])

    if isUserValid(user_id):
        name = request.json['name']
        url = request.json['url']
        description = request.json['description']
        category_name = request.json['category_name']

        if create_blog(name,url,category_name,description,user_id):  #creating blog
            return {"message":"Blog created"}
        else: return{"message":"Blog not created"}
    else:
        return {"message":"User is not registered in record"}    
    

#search specific blog
@blog.route('/specificblog/<blog_id>')
def specificBlog(blog_id):
    blog_id = int(blog_id)
    print(blog_id)
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])

    if isUserValid(user_id):
            #update blog
            cursor = mysql.connection.cursor()
            cursor.execute(
                """SELECT blog.id,blog.name,url,category_id,description,user_id,categories.category_name,users.name as user_name FROM blog JOIN categories ON categories.id = blog.category_id JOIN users ON blog.user_id = users.id WHERE blog.id = %s;""",(blog_id,)
                )
            blog = cursor.fetchall()
            cursor.close()
            return {"blog":blog}
    else:
        return {"message":"User is not registered in record"}




#Update blog
@blog.route('/update',methods = ['PUT'])
def updateBlog():
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])

    if isUserValid(user_id):
            blog_id = request.json['blog_id']
            name = request.json['name']
            url = request.json['url']
            description = request.json['description']
            category_name = request.json['category_name']
            
            cat_id = get_id_category(category_name) 
            print(blog_id,name,category_name,url,cat_id,blog_id,user_id)

            #update blog
            cursor = mysql.connection.cursor()
            cursor.execute(
                """UPDATE blog SET name = %s,url = %s,description = %s,category_id = %s WHERE id = %s && user_id = %s""", (name,url,description,cat_id,blog_id,user_id) 
                )
            mysql.connection.commit()
            cursor.close()
            return {"message": "Blog updated"}
    else:
        return {"message":"User is not registered in record"}



#Delete Blog
@blog.route('/delete/<blog_id>',methods = ['DELETE'])
def deleteBlog(blog_id):
    blog_id = int(blog_id)
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])

    if isUserValid(user_id):
            #delete blog
            cursor = mysql.connection.cursor()
            cursor.execute(
                """DELETE FROM blog WHERE id = %s && user_id = %s""", (blog_id,user_id)     
                )
            mysql.connection.commit()
            cursor.close()

            return {"message": "Blog Deleted"}
    else:
        return {"message":"User is not registered in record"}
    


#check all blog data
@blog.route('/')
def check():
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT blog.id,blog.name,url,category_id,description,user_id,categories.category_name,users.name as user_name FROM blog JOIN categories ON categories.id = blog.category_id JOIN users ON blog.user_id = users.id;"""
    )
    result = cursor.fetchall()
    cursor.close()
    items = []
    for item in result:
        items.append(item)
    return {"blogs":items}

#==========================================================================
#search specific user blogs
@blog.route('/userblogs')
def specificUserBlogs():
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])

    if isUserValid(user_id):
            cursor = mysql.connection.cursor()
            cursor.execute(
                """SELECT blog.id,blog.name,url,category_id,description,user_id,categories.category_name,users.name as user_name FROM blog JOIN categories ON categories.id = blog.category_id JOIN users ON blog.user_id = users.id WHERE user_id = %s;""",(user_id,)
                )
            result = cursor.fetchall()
            cursor.close()
            items = []
            for item in result:
                items.append(item)
            return {"blogs":items}
    else:
        return {"message":"User is not registered in record"}


#==========================================================================
#fetch all categories
@blog.route('/categories')
def readCategories():
     #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])

    if isUserValid(user_id):
            cursor = mysql.connection.cursor()
            cursor.execute(
                """SELECT * FROM categories"""
                )
            result = cursor.fetchall()
            cursor.close()
            items = []
            for item in result:
                items.append(item)
            print(items)
            return {"categories":items}
    else:
        return {"message":"User is not registered in record"}


#===========================================================================
#create comment
@blog.route('/<blog_id>',methods = ['POST'])
def createComment(blog_id):
    comment = request.json['comment']
    print(comment)
    blog_id = int(blog_id)
    
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])

    print('comment',comment,blog_id,user_id)
    if isUserValid(user_id):
            cursor = mysql.connection.cursor()
            cursor.execute(
                """INSERT INTO comments(comment, blog_id, user_id) VALUES (%s,%s,%s)""",(comment,blog_id,user_id)
                )
            mysql.connection.commit()
            cursor.close()
            return {"message": "comment posted"}
    else:
        return {"message":"User is not registered in record"}




#Show specific blog comment
@blog.route('/<blog_id>')
def showSpecificComments(blog_id):
    blog_id = int(blog_id)
    print('specific comment',blog_id)
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])

    if isUserValid(user_id):
            cursor = mysql.connection.cursor()
            cursor.execute(
                """SELECT comments.id,comment,blog.name,users.name as username, users.email as email FROM comments JOIN blog ON comments.blog_id = blog.id JOIN users ON comments.user_id = users.id WHERE comments.blog_id = %s""",(blog_id,)
                )
            result = cursor.fetchall()
            cursor.close()
            items = []
            for item in result:
                items.append(item)
            return {"message": "Comments fetched","comments":items}
    else:
        return {"message":"User is not registered in record"}





#Edit comment
@blog.route('/<blog_id>',methods = ['PUT'])
def editComment(blog_id):
    comment = request.json['comment']
    comment_id = request.json['comment_id']
    blog_id = int(blog_id)
    
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])

    if isUserValid(user_id):
            cursor = mysql.connection.cursor()
            cursor.execute(
                """UPDATE comments SET comment = %s WHERE id = %s && blog_id = %s && user_id = %s""",(comment,comment_id,blog_id,user_id)
                )
            mysql.connection.commit()
            cursor.close()
            return {"message": "comment updated"}
    else:
        return {"message":"User is not registered in record"}



#delete comment
@blog.route('/<blog_id>/<comment_id>',methods = ['DELETE'])
def deleteComment(blog_id,comment_id):
    print('delete request received')
    blog_id = int(blog_id)
    comment_id = int(comment_id)
    
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])

    if isUserValid(user_id):
            cursor = mysql.connection.cursor()
            cursor.execute(
                """DELETE FROM comments WHERE id = %s && blog_id = %s && user_id = %s""",(comment_id,blog_id,user_id)
                )
            mysql.connection.commit()
            cursor.close()
            return {"message": "comment deleted"}
    else:
        return {"message":"User is not registered in record"}




@blog.route('/comments')
def checkComments():
        cursor = mysql.connection.cursor()
        cursor.execute(
            """SELECT * FROM comments"""
            )
        result = cursor.fetchall()
        cursor.close()
        return {"message": result}