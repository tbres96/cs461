def propKeys(cls):
    return [i for i in cls.__dict__.keys() if i[:1] != '_']

def propVals(cls):
    return [i for i in cls.__dict__.values() if i[:1] != '_']


class Commit:

    def __init__(self):
        self.title = "default commit title"
        self.action = "default commit action"
        self.date = "default date"
        self.user = "default commit user"

class User:

    def __init__(self):
        #email = "default user email"
        self.name = "default user name"
        #username = "default user username"
        self.boardStringList = []
        self.boardObjectList = []


class Task:

    def __init__(self):
        self.commitList = []
        self.description = "default task description"
        self.dueDate = "default due date"
        self.latestAction = "default latest action"
        self.name = "default task name"
        self.ownerList = []

class KanColumn:
##    columnTitle = "default column title"
##    taskList = []

    def __init__(self):
        self.columnTitle = "default column title"
        self.taskList = []

    #def printColumn(column):
     #   print(column.columnTitle
        

class Board:
##    name = "default board name"
##    repository = "default repository"
##    columnList = []
##    userList = []

    def __init__(self):      
        self.name = "default board name"
        self.repository = "default repository"
        self.columnList = []
        self.userList = []
        

  #  def __iter__(self):
  #      for attr, value

##def findBoardTasks(taskObj):
##    #for taskKey, taskValue in taskObj:
##    print('\t', "Task Name: ", taskObj.name, '\n', '\t\t', "Description: ", taskObj.description, '\n', '\t\t', "Due Date: ", taskObj.dueDate)
##    print('\t\t', "Latest Action: ", taskObj.latestAction)
##
##def findBoardColumns(colObj):
##    print("COLNAME: ", colObj.columnTitle)
##    for task in colObj.taskList:
##        #print("TASKNAME: ", task.name, " TASKLIST SIZE: ", len(colObj.taskList))
##        findBoardTasks(task)



def updateBoard(boardObj, userObj):
    for b in range(0, len(userObj.boardObjectList)):# in userObj.boardObjectList:
        #print("CHECKING IF ", userObj.boardObjectList[b].name, " IS EQUAL TO ", boardObj.name)
        if (boardObj.name == userObj.boardObjectList[b].name):
            userObj.boardObjectList[b] = boardObj
            #print("Should have updated board.")
            return 1
        
    print("Could not update board for some reason")
    return 0

def addTaskToBoard(boardObj, columnName, taskObj):
    #print('\n', '\n', '\n', "BOARD NAME: ", boardObj.name)

    for col in boardObj.columnList:
        if (col.columnTitle == columnName):
            #print("FOUND COLUMN.")
            col.taskList.append(taskObj)
            return 1

    return 0
        #print("IN COL FOR. CURRENT NAME: ", col.columnTitle, " COLUMNLIST SIZE: ", len(boardObj.columnList), " TASKSIZE: ", len(col.taskList))
        #findBoardColumns(col)

def printBoardTasks(taskObj):
    #for taskKey, taskValue in taskObj:
    print('\t', "Task Name: ", taskObj.name, '\n', '\t\t', "Description: ", taskObj.description, '\n', '\t\t', "Due Date: ", taskObj.dueDate)
    print('\t\t', "Latest Action: ", taskObj.latestAction)

def printBoardColumns(colObj):
    print("COLNAME: ", colObj.columnTitle)
    for task in colObj.taskList:
        #print("TASKNAME: ", task.name, " TASKLIST SIZE: ", len(colObj.taskList))
        printBoardTasks(task)

def printBoard(boardObj):
    print('\n', '\n', '\n', "BOARD NAME: ", boardObj.name)

    for col in boardObj.columnList:
        #print("IN COL FOR. CURRENT NAME: ", col.columnTitle, " COLUMNLIST SIZE: ", len(boardObj.columnList), " TASKSIZE: ", len(col.taskList))
        printBoardColumns(col)

##    for user in boardObj.userList:
##        print("USER: ", user)


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
    #print("IN COLUMNS THIS BOARDS NAME: ", board.name)
    for columnKey, columnValue in value.items():
        newColumn = KanColumn()
        newColumn.columnTitle = columnKey
        newColumn.taskList = []
        #print("BEFORE PARSETASKS NEWCOL NAME: ", newColumn.columnTitle, " TASKLISTSIZE: ", len(newColumn.taskList))
        parseTasks(newColumn, columnKey, columnValue)
        #print("BEFORE COLUMN APPEND NEWCOL NAME: ", newColumn.columnTitle, " TASKLISTSIZE: ", len(newColumn.taskList))
        #print("BEFORE APPEND BOARD NAME: ", board.name, " BOARD COLSIZE: ", len(board.columnList))
        board.columnList.append(newColumn)
        #print("PARSECOLUMNS VALS: ", propKeys(newColumn), propVals(newColumn))
        #[print(t) for t in dir(newColumn) if not t.startswith('__')]
        #print("PARSECOLUMNS KEYY: ", keyy, " PARSETASKS VAL: ", val)

def getAllBoards(dbObj, toPrint):
    #board = db.child("Boards").get()
    #newBoard = Board()
    for boardval in dbObj.each():
        newBoard = Board()
        #print("THIS BOARD'S NAME: ", newBoard.name)
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
        if (toPrint == 1):        
            printBoard(newBoard)
    print("Boards gotten :)")

def getAllUsers(dbObj):
        for user in dbObj.each():
            newUser = User()
            newUser.boardStringList = []
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
            #print("FOUND USER ",  user.key())
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
                    #print("PRINTING FROM GET CERTAIN BOARD")
                    #printBoard(newBoard)
                    #return newBoard
            #Here we need to break down the Users dict
            if (key == "Users"):
                #print("TIME TO PARSE USERS WOOOO")
                newBoard.userList.append(val)
            if (key == "Tasks"):
                #print("TIME TO PARSE COLUMNS WOOOO")
                parseColumns(newBoard, key, val)
            #print("KEY: ", key," VALUE: ", val)

        if (boardFound):
            return newBoard
        #else:
         #   return False


def addTask(boardObj, curUser):
    if (boardObj != -1):
        taskToAdd = Task()
        print("Please input a task name.")
        taskName = input("  > ")
        taskToAdd.name = taskName
        print("Please input a task description, or <enter> for blank.")
        taskDesc = input("  > ")
        taskToAdd.description = taskDesc
        print("Please input a task due date, or <enter> for blank.")
        taskDue = input("  > ")
        taskToAdd.dueDate = taskDue
        print("Which column would you like this task to be in?")
        taskColumn = input("  > ")
        taskToAdd.ownerList.append(curUser)
            
        while (addTaskToBoard(boardObj, taskColumn, taskToAdd) != 1):
            print("Could not find column. Please enter valid column name.")
            taskColumn = input("  > ")

        updateBoard(boardObj, curUser)
            
    else:
        print("Please select a board to work on first with <select>")
            

def findTask(boardObj, taskToEditName):
    taskFound = False
    for colIndex in range(0, len(boardObj.columnList)):
        for taskIndex in range(0, len(boardObj.columnList[colIndex].taskList)):
            if (boardObj.columnList[colIndex].taskList[taskIndex].name == taskToEditName):
                print("FOUND TASK!")
                taskFound = True
                print("Please input a task name, or <enter> for no change.")
                taskName = input("  > ")
                if (taskName != ""):
                    boardObj.columnList[colIndex].taskList[taskIndex].name = taskName
                print("Please input a task description, or <enter> for no change.")
                taskDesc = input("  > ")
                if (taskDesc != ""):
                    boardObj.columnList[colIndex].taskList[taskIndex].description = taskDesc
                print("Please input a task due date, or <enter> for no change.")
                taskDue = input("  > ")
                if (taskDue != ""):
                    boardObj.columnList[colIndex].taskList[taskIndex].dueDate = taskDue
                return 1

    return 0

                
                #return taskObj


def editTask(boardObj, userObj):
    if (boardObj != -1):
        print("What is the name of the task you want to edit?")
        taskToEditString = input("  > ")
        returnVal = findTask(boardObj, taskToEditString)
        if (returnVal == 1):
            print("Task succesfully edited.")
            updateBoard(boardObj, userObj)
        else:
            print("Could not edit task.")


    
