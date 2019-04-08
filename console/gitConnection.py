from pyrebase import pyrebase
import getpass
from datetime import datetime
from threading import Timer
import schedule
import time
import os
import subprocess

config = {
  "apiKey": "AIzaSyA11FpqG-RKNpZ0loNU8HhunHUgk7EFCqY ",
  "authDomain": "seniorsemgit.firebaseapp.com",
  "databaseURL": "https://seniorsemgit.firebaseio.com",
  "storageBucket": "seniorsemgit.appspot.com"
}
firebase = pyrebase.initialize_app(config)

# Database constants
boards = "Boards"
repository = "Repository"
repPath = "RepositoryPath"
userRep = "User"
users = "Users"

# Variables
db = firebase.database()
userId = getpass.getuser()

# Check if the board id exists
def isBoardIdValid(id):
    # Check if input is empty
    if(id == ''):
        print("Empty")
        return False
    # Check if board id exists
    boardRef = db.child(boards).child(id).get()
    if(boardRef.val()):
        return True
    else:
        print("Invalid")
        return False
    return False

# Create text file with database board id
def createDatabaseIdFile(boardId):
    f = open("databaseBoardId.txt", "w")
    f.write(boardId)
    f.close()

#Update git log
def updateGitLog():
    f = open("databaseBoardId.txt")
    boardId = f.read()

# Main function
print("Welcome " + userId)
print("Select an option:")
print("1. Register a kanban board")
print("2. Update commit history in database")
inputString = input("> ")
if(inputString == "1"):
    print("Please enter the board ID:")
    boardId = input("> ")
    if(isBoardIdValid(boardId)):
        createDatabaseIdFile(boardId)
elif(inputString == "2"):
    updateGitLog()

