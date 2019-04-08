def propKeys(cls):
    return [i for i in cls.__dict__.keys() if i[:1] != '_']

def propVals(cls):
    return [i for i in cls.__dict__.values() if i[:1] != '_']


class Commit:
    title = "default commit title"
    action = "default commit action"
    date = "default date"
    user = "default commit user"

class User:
    #email = "default user email"
    name = "default user name"
    #username = "default user username"
    boardList = []

    #def __init__(self

##    def change_attribute(self, attr, val):
##        if (attr == "email"):
##            self.email = val
##        if (attr == "name"):
##            self.name = val
##        if (attr == "Username"):
##            self.username = val

class Task:
    commitList = []
    description = "default task description"
    dueDate = "default due date"
    latestAction = "default latest action"
    name = "default task name"
    ownerList = []

class KanColumn:
    columnTitle = "default column title"
    taskList = []

    #def printColumn(column):
     #   print(column.columnTitle
        

class Board:
    name = "default board name"
    repository = "default repository"
    columnList = []
    userList = []

    def __init__(self):      
        name = "default board name"
        repository = "default repository"
        columnList = ["columnlistitem"]
        userList = ["userlistitem"]
        

  #  def __iter__(self):
  #      for attr, value

def parseCommits(task, key, value):
    #print("Parsing commits :)")
    for commitKey, commitValue in value.items():
        newCommit = Commit()
        newCommit.title = commitKey
        for commitHeader, commitInfo in commitValue.items():
            if (commitHeader == "Action"):
                newCommit.action = commitInfo
            if (commitHeader == "Date"):
                newCommit.date = commitInfo
            if (commitHeader == "User"):
                newCommit.user = commitInfo
        task.commitList.append(newCommit)
        #print("ACTION ", newCommit.action, " DATE: ", newCommit.date)

def parseOwners(task, key, value):
    for ownerKey, ownerValue in value.items():
        if (ownerValue == 1):
            task.ownerList.append(ownerKey)
            #print("OWNERKEY: ", ownerKey, " OWNERVAL: ", ownerValue)
        
def parseTasks(column, key, value):
    #print("THIS COLUMN NAME: ", column.columnTitle,"KEY: ", key, " VALUE: ", value)
    for taskKey, taskValue in value.items():
        newTask = Task()
        newTask.name = taskKey
        for taskHeader, taskInfo in taskValue.items():
            if (taskHeader == "DueDate"):
                newTask.dueDate = taskInfo
            if (taskHeader == "LatestAction"):
                newTask.latestAction = taskInfo
            if (taskHeader == "Name"):
                newTask.name = taskInfo
            if (taskHeader == "Description"):
                newTask.description = taskInfo
            if (taskHeader == "Commits"):
                parseCommits(newTask, taskHeader, taskInfo)
            if (taskHeader == "Owners"):
                parseOwners(newTask, taskHeader, taskInfo)
            
            column.taskList.append(newTask)
        print("PARSETASK VALS: ", propKeys(newTask), propVals(newTask))

            #print("PARSETASKS KEYY: ", taskHeader, " PARSETASKS VAL: ", taskInfo)


def parseColumns(board, key, value):
    #print("KEY: ", key," VALUE: " value)
    for columnKey, columnValue in value.items():
        newColumn = KanColumn()
        newColumn.columnTitle = columnKey
        parseTasks(newColumn, columnKey, columnValue)
        board.columnList.append(newColumn)
        print("PARSECOLUMNS VALS: ", propKeys(newColumn), propVals(newColumn))
        #[print(t) for t in dir(newColumn) if not t.startswith('__')]
        #print("PARSECOLUMNS KEYY: ", keyy, " PARSETASKS VAL: ", val)

def getAllBoards(dbObj):
    #board = db.child("Boards").get()
    newBoard = Board()
    for boardval in dbObj.each():
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
