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
board1 = db.child("Boards").child("Board1").get()
column1 = db.child("Boards").child("Board1").child("Tasks").get()

print("Welcome to Super Seven KanBan! Enter 'quit' to exit.")

newBoard = Board()

for boardval in boards.each():
    for key, val in boardval.val().items():
        if (key == "Repository"):
            newBoard.repository = val
        if (key == "Name"):
            newBoard.name = val
        #Here we need to break down the Users dict
        if (key == "Users"):
            #print("TIME TO PARSE USERS WOOOO")
            newBoard.userList.append(val)
        if (key == "Tasks"):
            #print("TIME TO PARSE COLUMNS WOOOO")
            parseColumns(newBoard, key, val)
        #print("KEY: ", key," VALUE: ", val)

print(propKeys(newBoard), propVals(newBoard))


#General statements I was using for debugging
#[print(val) for val in dir(newBoard) if not val.startswith('__')]
#print(newBoard.__dict__)


#This Block is promising but want to generate on the fly
#Meaning I want to be able to generate an entire Board's
#Info without explicitly naming database objects.
#So I would have to use the "keys" or "Values" and
#my knowledge of the DB infrastructure to navigate.
##for column in column1.each():
##    for key, value in column.val().items():
##        print("TASK NAME: ", key, " V ", value)
##        for nextKey, nextVal in value.items():
##            print("NEXTKEY: ", nextKey, "NEXTVALUE: ", nextVal)
        
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
