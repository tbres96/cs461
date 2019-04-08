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
#board = db.child("Boards").get()
board1 = db.child("Boards").child("Board1").get()
column1 = db.child("Boards").child("Board1").child("Tasks").get()

print("Welcome to Super Seven KanBan! Enter 'quit' to exit.")
        
inputString = input("> ")

while(1):


    if (inputString == "quit"):
        print("Goodbye!")
        break

    if (inputString == "users"):
        for user in users.each():
            newUser = User()
            print("USER: ", user.key())
            newUser.name = user.key()
            for key, value in user.val().items():
                #newUser.change_attribute(key, value)
                if (value == 1):
                    newUser.boardList.append(key)
                print("key: ", key," Value: ", value)
                
            #print("NATIVE OUTPUT: ", user.key(),": ", user.val())


    if (inputString == "boards"):
        board = db.child("Boards").get()
        getAllBoards(board)

    inputString = input("> ")



print("END PROGRAM")
