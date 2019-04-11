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
    boardStringList = []
    boardObjectList = []

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

    def __init__(self):
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

def printBoardColumns(colObj):
    print("COLNAME: ", colObj.columnTitle)
    for task in colObj.taskList:
        print("TASKNAME: ", task.name, " TASKLIST SIZE: ", len(colObj.taskList))

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
    #print("THIS COLUMN NAME: ", key," TASKSIZE: ", len(column.taskList))
    for taskKey, taskValue in value.items():
        
        newTask = Task()
        newTask.name = taskKey
        #print("THIS COLUMN NAME: ", column.columnTitle, " KEY: ", taskKey)#, " VAL: ", taskValue)
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

            

        #printBoardColumns(column)
        #print("BEFORE APPEND NEWTASK NAME: ", newTask.name, " COLTITLE: ", column.columnTitle)
        column.taskList.append(newTask)
        #print("PARSETASK VALS: ", propKeys(newTask), propVals(newTask))

            #print("PARSETASKS KEYY: ", taskHeader, " PARSETASKS VAL: ", taskInfo)


def parseColumns(board, key, value):
    #print("KEY: ", key," VALUE: ", value)
    #There is a bug here where the columns are the same, and both get pushed to the board
    #So they both have the same tasks. no good.
    for columnKey, columnValue in value.items():
        newColumn = KanColumn()
        newColumn.columnTitle = columnKey
        newColumn.taskList = []
        #print("BEFORE PARSETASKS NEWCOL NAME: ", newColumn.columnTitle, " TASKLISTSIZE: ", len(newColumn.taskList))
        parseTasks(newColumn, columnKey, columnValue)
        #print("BEFORE COLUMN APPEND NEWCOL NAME: ", newColumn.columnTitle, " TASKLISTSIZE: ", len(newColumn.taskList))
        board.columnList.append(newColumn)
        #print("PARSECOLUMNS VALS: ", propKeys(newColumn), propVals(newColumn))
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
    print("Boards gotten :)")

def getAllUsers(dbObj):
        for user in dbObj.each():
            newUser = User()
            print("USER: ", user.key())
            newUser.name = user.key()
            for key, value in user.val().items():
            #for key, value in user.val().:
                #newUser.change_attribute(key, value)
                if (value == 1):
                    newUser.boardStringList.append(key)
                print("key: ", key," Value: ", value)

                
def getCertainUser(dbObj, userToFind):
    newUser = User()
    for user in dbObj.each():
        if (user.key() == userToFind):
            print("FOUND USER ",  user.key())
            newUser.name = user.key()
            for key, value in user.val().items():
                if (value == 1):
                    newUser.boardStringList.append(key)
                    #print("key: ", key," Value: ", value)
            return newUser
    
    if (newUser.name == "default user name"):
        print("Could not find user.")
        return False

def getCertainBoard(dbObj, boardToFind):
    boardFound = False
    returnBoard = Board()
    for boardval in dbObj.each():
        newBoard = Board()
        #print("BOARDVAL:" , boardval.val())
        for key, val in boardval.val().items():
            
            if (key == "Repository"):
                newBoard.repository = val
            if (key == "Name"):
                if (val != boardToFind):
                    continue
                else:
                    #print("WE FOUND THE BOARD BAYBEEEEEE")
                    boardFound = True
                    newBoard.name = val
            #Here we need to break down the Users dict
            if (key == "Users"):
                #print("TIME TO PARSE USERS WOOOO")
                newBoard.userList.append(val)
            if (key == "Tasks"):
                #print("TIME TO PARSE COLUMNS WOOOO")
                parseColumns(newBoard, key, val)
            #print("KEY: ", key," VALUE: ", val)

    if (boardFound):
        returnBoard = newBoard
        return returnBoard
    else:
        return False



#def printBoardUsers(

    
    
def printBoard(boardObj):
    print('\n', '\n', '\n', "BOARD NAME: ", boardObj.name)

    for col in boardObj.columnList:
        print("IN COL FOR. CURRENT NAME: ", col.columnTitle, " COLUMNLIST SIZE: ", len(boardObj.columnList), " TASKSIZE: ", len(col.taskList))
        printBoardColumns(col)

##    for user in boardObj.userList:
##        print("USER: ", user)
