import pyrebase, json
from consoleClasses import *

config = {
  "apiKey": "AIzaSyA11FpqG-RKNpZ0loNU8HhunHUgk7EFCqY ",
  "authDomain": "seniorsemgit.firebaseapp.com",
  "databaseURL": "https://seniorsemgit.firebaseio.com",
  "storageBucket": "seniorsemgit.appspot.com"
}

print("Connecting to database...")

firebase = pyrebase.initialize_app(config)
db = firebase.database()

print("Fetching users and boards...")

users = db.child("Users").get()
boards = db.child("Boards").get()
board1 = db.child("Boards").child("Board1").get()
column1 = db.child("Boards").child("Board1").child("Tasks").get()

print("Welcome to Super Seven KanBan! Enter 'quit' to exit.")

for column in column1.each():
    for key, value in column.val().items():
        print("KEY: ", key, "VALUE: ", value)
inputString = input("> ")

while(1):

    
    newUser = User()


    if (inputString == "quit"):
        print("Goodbye!")
        break

    if (inputString == "users"):
        for user in users.each():
            for key, value in user.val().items():
                newUser.change_attribute(key, value)
                
            print(newUser.email, newUser.name, newUser.username)
            #print("NATIVE OUTPUT: ", user.key(),": ", user.val())


    if (inputString == "boards"):
        for board in boards.each():
            for key, columns in board.val().items():
                print("KEY: ", key," COLUMN: ", columns)
##                for key, tasks in columns.items():
##                    print("COLUMN: ", key, " TASKS: ", tasks)

    inputString = input("> ")



print("END PROGRAM")
