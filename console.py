import pyrebase
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

print("Welcome to Super Seven KanBan! Enter 'quit' to exit.")

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
            print(board.key(), ": ", board.val())

    inputString = input("> ")



print("END PROGRAM")
