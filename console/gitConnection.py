from pyrebase import pyrebase
config = {
  "apiKey": "AIzaSyA11FpqG-RKNpZ0loNU8HhunHUgk7EFCqY ",
  "authDomain": "seniorsemgit.firebaseapp.com",
  "databaseURL": "https://seniorsemgit.firebaseio.com",
  "storageBucket": "seniorsemgit.appspot.com"
}
firebase = pyrebase.initialize_app(config)
userId = "sosaes"

boards = "Boards"
repository = "Repository"
repPath = "RepositoryPath"
userRep = "User"

db = firebase.database()

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

# Check if path is valid
def isPathValid(path):
    if(path == ''):
        print("Empty")
        return False
    return True

# Update database with repository path
def updateDatabase(boardId, path):
    db.child(boards).child(boardId).child(repository).child(userRep).set(userId)
    db.child(boards).child(boardId).child(repository).child(repPath).set(path)
    return

# Main function
print("Select an option:")
print("1. Register a kanban board")
print("2. Change path to kanban board git repository")
inputString = input("> ")
if(inputString == "1"):
    print("Please enter the board ID:")
    boardId = input("> ")
    if(isBoardIdValid(boardId)):
        print("Please enter the path to your git repository")
        path = input("> ")
        if(isPathValid(path)):
            updateDatabase(boardId, path)

