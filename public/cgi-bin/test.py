#!/usr/bin/python3

from flask import Flask, render_template, request
import pyrebase

config = {
  "apiKey": "AIzaSyA11FpqG-RKNpZ0loNU8HhunHUgk7EFCqY ",
  "authDomain": "seniorsemgit.firebaseapp.com",
  "databaseURL": "https://seniorsemgit.firebaseio.com",
  "storageBucket": "seniorsemgit.appspot.com"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()
app = Flask(__name__)

#all_users = db.child("Users").get()
#for user in all_users.each():
#    print(user.key()) # Morty
#    print(user.val()) # {name": "Mortimer Smith"}

@app.route("/hello")
def index():
    return render_template('hello.html')

@app.route("/task", methods=['POST'])
def taskInfo():
    if request.method == 'POST':
#        task = db.child("Boards").child(request.form['section']).child(request.form['task']).get()
        name = db.child("Boards").child(request.form['section']).child(request.form['task']).child("Name").get().val()
        #XXX The next line is for debugging. Delete when all of these variables hold what they should.
        print name
        description = db.child("Boards").child(request.form['section']).child(request.form['task']).child("Description").get().val()
        owners = db.child("Boards").child(request.form['section']).child(request.form['task']).child("Owners").get().val()
        commits = db.child("Boards").child(request.form['section']).child(request.form['task']).child("Commits").get().val()
        return render_template('task.html', **locals())

if __name__ == '__main__':
    app.run()
