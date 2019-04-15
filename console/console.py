import pyrebase
import getpass
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

board = db.child("Boards").get()
users = db.child("Users").get()
currentBoard = -1

#getAllBoards(board, 0)

print("Fetching users and boards...")


#currentUserString = getpass.getuser()
currentUserString = "Andrew Smith"
currentUser = getCertainUser(users, currentUserString)
nameString = "Stranger"
if (currentUser != False):
    nameString = currentUser.name

print('\n', '\n', "Welcome %s to Super Seven KanBan! Enter 'quit' to exit." % nameString)
introBoardString = "You are currently a member of: "

for s in currentUser.boardStringList:
    introBoardString += s + ", "
    boardToAdd = Board()
    boardToAdd = getCertainBoard(board, s)
    if (boardToAdd):
        currentUser.boardObjectList.append(boardToAdd)
        #printBoard(boardToAdd)

introBoardString = introBoardString[0:-2]
print(introBoardString)
        
inputString = input("> ")

while(1):


    if (inputString == "quit"):
        print("Goodbye!")
        break

    if (inputString == "select"):
        print("Which board would you like to select?")
        boardToSelect = input("  > ")
        boardFound = False
        for  boardName in currentUser.boardStringList:
            if (boardToSelect != boardName):
                continue
            elif (boardToSelect == boardName):              
                board = db.child("Boards").get()
                currentBoard = getCertainBoard(board, boardToSelect)
                print("Found your board!")
                boardFound = True
                printBoard(currentBoard)
                print('\n', '\n', "You are currently working on the ", currentBoard.name, " board. You can now <add task> and <edit task>.")
                break

        if (boardFound == False):
            print("Could not find your board. Are you sure you're a part of it?")


    if (inputString == "add task"):
        addTask(currentBoard, currentUser)
        

    if (inputString == "users"):
        localusers = db.child("Users").get()
        getAllUsers(localusers)

    if (inputString == "boards"):
        localboard = db.child("Boards").get()
        getAllBoards(localboard, 1)

    if (inputString == "view boards"):
        for b in currentUser.boardObjectList:
            printBoard(b)

    inputString = input("> ")



print("END PROGRAM")
