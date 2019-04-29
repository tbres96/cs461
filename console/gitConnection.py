from pyrebase import pyrebase
import getpass
from datetime import datetime
from threading import Timer
import schedule
import time
import os
import subprocess
from subprocess import check_output

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
lastCommitId = "LastCommitId"
gitLog = "GitLog"
commitsRef = "Commits"
tasksRef = "Tasks"

# Variables
db = firebase.database()
userId = getpass.getuser()

# Task class
class Task:
    taskName = "name"
    taskDescription = "description"
    def __init__(self, taskName, taskDescription):
        self.taskName = taskName
        self.taskDescription = taskDescription

# Commit class
class Commit:
    def __init__(self, commitId, author, date, task):
        self.commitId = commitId
        self.author = author
        self.date = date
        self.task = task

# Check if the board id exists
def isBoardIdValid(id):
    # Check if input is empty
    if(id == ''):
        print("Empty")
        return False
    # Check if line-ending-character is in it
    if('\n' in id):
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

# Update database
def updateDatabase(boardId, commits):
    # Set the board tasks ref
    boardTasksRef = db.child(boards).child(boardId).child(tasksRef).get()
    # Check if it exists
    if(boardTasksRef.val()):
        # Iterate through all the columns
        for column in boardTasksRef.each():
            columnRef = db.child(boards).child(boardId).child(tasksRef).child(column.key()).get()
            # Iterate through all the tasks in the column
            for task in columnRef.each():
                # Get the task name
                columnTaskNameRef = db.child(boards).child(boardId).child(tasksRef).child(column.key()).child(task.key()).child("Name").get()
                if(columnTaskNameRef.val()):
                    taskName = columnTaskNameRef.val()
                    # Compare the task name with all of the commits names
                    for commit in commits:
                        # If they match, update the task's commits
                        if(commit.task.taskName == taskName):
                            db.child(boards).child(boardId).child(tasksRef).child(column.key()).child(task.key()).child(commitsRef).child(commit.commitId[:-1]).child("User").set(commit.author)
                            db.child(boards).child(boardId).child(tasksRef).child(column.key()).child(task.key()).child(commitsRef).child(commit.commitId[:-1]).child("Date").set(commit.date)
                            db.child(boards).child(boardId).child(tasksRef).child(column.key()).child(task.key()).child(commitsRef).child(commit.commitId[:-1]).child("Action").set(commit.task.taskDescription)

# Parse message
def parseMessage(message):
    words = message.split()
    taskName = ""
    action = ""
    if(words[0] == "TASK:"):
        i = 1
        while words[i] != "ACTION:":
            taskName += words[i]
            taskName += " "
            i += 1
        i += 1
        while i < len(words):
            action += words[i]
            action += " "
            i += 1
        taskName = taskName[:-1]
        action = action[:-1]
    else:
        taskName = "Default Name"
        action = "Default action"
    task = Task(taskName, action)
    return task

#Update git log
def updateGitLog():
    # Check if the text file containing the board id exists
    exists = os.path.isfile("databaseBoardId.txt")
    if exists:
        # Get the board id from the text file
        f = open("databaseBoardId.txt")
        boardId = f.read()
        f.close()
        # Check if the board id is empty
        if(isBoardIdValid(boardId)):
            # Run git log comand
            cmd = ['git', 'log']
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            o, e = proc.communicate()
            # Check last commit with git log
            gitLogFile = open("gitlog.txt", "w")
            gitLogFile.write(o.decode("utf-8"))
            gitLogFile.close()
            # Retrieve latest commit id from the database
            commitRef = db.child(boards).child(boardId).child(gitLog).child(lastCommitId).get()
            if(commitRef.val()):
                lastDBCommit = commitRef.val()
                # Read from the gitLogFile and compare the latest commit
                gitLogFile = open("gitLog.txt", "r")
                lastLogCommit = gitLogFile.readline()
                gitLogFile.close()
                # Database gitlog is up to date, no need to retrieve info from file
                if(lastDBCommit == lastLogCommit):
                    print("Up to date")
                # Database gitlog needs update from file
                else:
                    # Variables needed
                    lastCommitFound = False
                    messageFound = False
                    commits = []
                    # Open and iterate through file
                    # Commit variables
                    commitId = ""
                    author = ""
                    date = ""
                    message = ""
                    with open("gitlog.txt") as gitLogFile:
                        for i, newLine in enumerate(gitLogFile):
                            if not lastCommitFound:
                                # Commit id
                                if(i % 6 == 0):
                                    commitId = newLine
                                    # Check if commit id matches latest commid id in database, and if so, break the loop
                                    if(commitId == lastDBCommit):
                                        # Update last commit id in database
                                        db.child(boards).child(boardId).child(gitLog).child(lastCommitId).set(lastLogCommit)
                                        # Set last commit found as true
                                        lastCommitFound = True
                                # Author
                                elif(i % 6 == 1):
                                    author = newLine
                                # Date
                                elif(i % 6 == 2):
                                    date = newLine
                                # i % 3 is a blank line
                                # Message
                                elif(i % 6 == 4):
                                    message = newLine
                                # Create new commit object
                                if i % 6 == 5 and not lastCommitFound:
                                    # Parse the message
                                    task = parseMessage(message)
                                    # Create commit
                                    newCommit = Commit(commitId, author[:-1], date[:-1], task)
                                    # Append to list of commits
                                    commits.append(newCommit)
                                    # Reset commit variables
                                    commitId = ""
                                    author = ""
                                    date = ""
                                    message = ""
                    # Close gitlog file
                    gitLogFile.close()
                    # Update database with new commits
                    updateDatabase(boardId, commits)
                    print("Commit history has been updated successfully")
        else:
            print("The text file containing your board id is empty or it contains an invalid board id. Please register your board again.")
    else:
        print("There is no text file containing your board id. Please register your board.")

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

# Test message fot git connection 1
# Test message fot git connection 2

