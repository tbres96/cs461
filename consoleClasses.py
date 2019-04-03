class Commit:
    action = "default commit action"
    user = "default commit user"

class User:
    email = "default user email"
    name = "default user name"
    username = "default user username"

    #def __init__(self

    def change_attribute(self, attr, val):
        if (attr == "email"):
            self.email = val
        if (attr == "name"):
            self.name = val
        if (attr == "username"):
            self.username = val
        

class Task:
    commitList = ["commitlistitem", "commitlistitem"]
    description = "default task description"
    name = "default task name"
    ownerList = ["ownerlistitem", "ownerlistitem"]

class KanColumn:
    columnTitle = "default column title"
    taskList = ["tasklistitem", "tasklistitem"]

class Board:
    name = "default board name"
    repository = "default repository"
    columnList = ["columnlistitem", "columnlistitem"]
    userList = ["userlistitem", "userlistitem"]
    
    
