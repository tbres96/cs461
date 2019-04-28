import json, re
import datetime
from collections import defaultdict

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
        self.actionHistoryDict = {}
        self.actionHistoryList = []
        self.description = "default task description"
        self.dueDate = "default due date"
        self.latestAction = "default latest action"
        self.name = "default task name"
        self.key = "default task key"
        self.ownerList = []

    def to_dict(self, dictionary):
        retDict = defaultdict(list)
        retDict['Description'] = self.description
        retDict['DueDate'] = self.dueDate
        retDict['LatestAction'] = self.latestAction
        retDict['name'] = self.name
        for ownerVal in self.ownerList:
            retDict['Owners'].append(ownerVal)
        for commitVal in self.commitList:
            originalJson = json.dumps(commitVal.__dict__)
            #print("ORIGINAL JSON COMMIT DICT VAL: ", originalJson)
            #print("After SUB JSON COMMIT DICT VAL: ", re.sub('\\', '',originalJson))

            retDict['Commits'].append(originalJson)
        return retDict

class KanColumn:
##    columnTitle = "default column title"
##    taskList = []

    def __init__(self):
        self.columnTitle = "default column title"
        self.taskList = []

    def to_dict(self, dictionary):
        returnDict = defaultdict(list)
        #print("IN KANCOLUMNS TODICT")
        for task in self.taskList:
            #print("TASK: ", task.name)
            returnDict[task.name].append(task.to_dict(returnDict[task.name]))

        return returnDict


    #def printColumn(column):
     #   print(column.columnTitle


class Board:
##    name = "default board name"
##    repository = "default repository"
##    columnList = []
##    userList = []

    def __init__(self):
        self.name = "default board name"
        #self.repository = "default repository"
        self.columnList = []
        self.userList = []
        self.key = "default board key"
        self.taskKeysToRemove = []
        self.colKeysToRemove = []

    def to_dict(self):
        _dict = defaultdict(list)
        for key, val in self.__dict__.items():
            if (val is not None):
                if (key == 'name'):
                    _dict['Name'] = val
                elif (key == 'userList'):
                    #_dict['Users'] = defaultdict(list)
                    for userVal in val:
##                        try:
##                            _dict['Users'].append(userVal)
##                        except KeyError:
                        #print("APPENDING: ", userVal, " TO USERS")
                        _dict['Users'].append(userVal)
                    #print("AFTER PARSING USERS: ", _dict['Users'])
                elif (key == 'columnList'):
                    for column in val:
                        #print("IN ELIF KEY: ", key, " VAL: ", column.columnTitle)
                        #will probably need to change to _dict.update(to_dict(column)) or something.
                        _dict[column.columnTitle].append(column.to_dict(_dict[column.columnTitle]))
                else:
                    print("IN ELSE KEY: ", key, " VAL: ", val)
                    #_dict[key] = val.to_dict(val)
        return _dict


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

def addTaskToBoard(boardObj, columnName, taskObj, dbObj, curUser, actionString):
    #print('\n', '\n', '\n', "BOARD NAME: ", boardObj.name)

    for col in boardObj.columnList:
        if (col.columnTitle == columnName):
            #print("FOUND COLUMN.")
            col.taskList.append(taskObj)
            newKey = dbObj.child("Boards").child(boardObj.key).child("Tasks").child(col.columnTitle).push({"Name" : taskObj.name,
                                                                                                                     "DueDate" : taskObj.dueDate,
                                                                                                                     "LatestAction" : taskObj.latestAction,
                                                                                                                     "Description" : taskObj.description})
            taskObj.key = newKey['name']
            dbObj.child("Boards").child(boardObj.key).child("Tasks").child(col.columnTitle).child(taskObj.key).child("Owners").update({ curUser.name : True})
            time = datetime.datetime.now()
            #From https://www.saltycrane.com/blog/2008/06/how-to-get-current-date-and-time-in/
            formatTime = "(0) " + time.strftime("%Y-%m-%d %H:%M")
            dbObj.child("Boards").child(boardObj.key).child("Tasks").child(col.columnTitle).child(taskObj.key).child("ActionHistory").update({ formatTime : actionString})
            
            return 1

    return 0
        #print("IN COL FOR. CURRENT NAME: ", col.columnTitle, " COLUMNLIST SIZE: ", len(boardObj.columnList), " TASKSIZE: ", len(col.taskList))
        #findBoardColumns(col)

def printBoardTasks(taskObj):
    #for taskKey, taskValue in taskObj:
    print('\t', "Task Name: ", taskObj.name, '\n', '\t', "Task Key: ", taskObj.key, '\n\t\t', "Description: ", taskObj.description, '\n', '\t\t', "Due Date: ", taskObj.dueDate)
    print('\t\t', "Latest Action: ", taskObj.latestAction)
    print("\t\t Owners: ")
    for owner in taskObj.ownerList:
        print('\t\t\t', owner)
    for hist in taskObj.actionHistoryList:
        print('\t\t\t\t\t', hist)
    print("\n\n")


def printBoardColumns(colObj):
    print("Column Name: ", colObj.columnTitle, '\n')
    for task in colObj.taskList:
        #print("TASKNAME: ", task.name, " TASKLIST SIZE: ", len(colObj.taskList))
        printBoardTasks(task)

def printHelp():
    print("Before you edit any boards, you must select one with the <select> command. If you are not a part of any, you may create a new one with <new board>.")
    print("Once you have selected a board, you can <add column>, <add task>, <edit column>, <edit task>, <remove column>, and <remove task>.")
    print("To move a task from one column to the other, use <move task>.")
    print("To assign a task, use <assign task>. To assign a board, use <assign board>.")
    print("To see all boards you are a part of, use <view boards>.")
    return

def printBoard(boardObj):
    if (boardObj == -1):
        print("Please select a board first with <select>")
        return
    print('\n', '\n', '\n', "Board Name: ", boardObj.name)
    print('\n', "Board Key: ", boardObj.key)

    print("Owners of this board:", '\n')
    for owner in boardObj.userList:
        print(owner)
    print('\n')

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

def parseBoardOwners(obj, key, value):
    for ownerKey, ownerValue in value.items():
        if (ownerValue == 1):
            obj.userList.append(ownerKey)
            #print("OWNERKEY: ", ownerKey, " OWNERVAL: ", ownerValue)

def parseOwners(obj, key, value):
    for ownerKey, ownerValue in value.items():
        if (ownerValue == 1):
            obj.ownerList.append(ownerKey)
            #print("OWNERKEY: ", ownerKey, " OWNERVAL: ", ownerValue)

def parseActions(obj, key, value):
    for actionKey, actionValue in value.items():
    #    print("ACTION KEY: ", actionKey, " VAL: ", actionValue)
        obj.actionHistoryDict[actionKey] = actionValue
        obj.actionHistoryList.append(actionValue)

def parseTasks(column, key, value):
    #print("THIS COLUMN NAME: ", key," TASKSIZE: ", len(column.taskList))
    for taskKey, taskValue in value.items():

        newTask = Task()
        #newTask.name = taskKey
        if (taskKey != "Commits"):
            newTask.key = taskKey
        #print("THIS COLUMN NAME: ", column.columnTitle, " KEY: ", taskKey, " VAL: ", taskValue)
        if (taskKey == "Dummy"):
            continue
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
            if (taskHeader == "ActionHistory"):
                parseActions(newTask, taskHeader, taskInfo)



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
        newBoard.key = boardval.key()
        #print("THIS BOARD'S NAME: ", newBoard.name)
        for key, val in boardval.val().items():
            if (key == "Repository"):
                newBoard.repository = val
            if (key == "Name"):
                newBoard.name = val
            #Here we need to break down the Users dict
            if (key == "Users"):
                #print("TIME TO PARSE USERS WOOOO")
                #newBoard.userList.append(val)
                parseBoardOwners(newBoard, key, val)
            if (key == "Tasks"):
                #print("TIME TO PARSE COLUMNS WOOOO")
                parseColumns(newBoard, key, val)
            #print("KEY: ", key," VALUE: ", val)
        if (toPrint == 1):
            printBoard(newBoard)
    print("Boards gotten :)")

def findIfUserExistInDB(dbObj, userString):

    userFound = False
    for user in dbObj.each():
    #    print("USER: ", user.key())
        if user.key() == userString:
            userFound = True

    return userFound


#for key, value in user.val().items():
        #for key, value in user.val().:
            #newUser.change_attribute(key, value)
         #   if (value == 1):
          #      newUser.boardStringList.append(key)
           # print("key: ", key," Value: ", value)

def getAllUsers(dbObj):
        for user in dbObj.each():
            newUser = User()
            newUser.boardStringList = []
 #           print("USER: ", user.key())
            newUser.name = user.key()
            for key, value in user.val().items():
            #for key, value in user.val().:
                #newUser.change_attribute(key, value)
                if (value == 1):
                    newUser.boardStringList.append(key)
#                print("key: ", key," Value: ", value)


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
        newUser.name = userToFind
        print("Since you are a new user, you are not a part of any boards. You can create a new one with <new board>, or wait to be added to one.")
        return newUser

def getCertainBoard(dbObj, boardToFind):
    boardFound = False
    for boardval in dbObj.each():
        newBoard = Board()
        newBoard.key = boardval.key()
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
                #newBoard.userList.append(val)
                parseBoardOwners(newBoard, key, val)
            if (key == "Tasks"):
                #print("TIME TO PARSE COLUMNS WOOOO")
                parseColumns(newBoard, key, val)
            #print("KEY: ", key," VALUE: ", val)

        if (boardFound):
            return newBoard
        #else:
         #   return False


def addTask(boardObj, curUser, dbObj):
    if (boardObj != -1):
        taskToAdd = Task()
        #print("Please input a task key.")
        #taskKey = input("  > ")
        #if (taskKey == ""):
        #    taskToAdd.key = "default task key"
        #else:
        #    taskToAdd.key = taskKey
        print("Please input a task name.")
        taskName = input("  > ")
        if (taskName != ""):
            taskToAdd.name = taskName
        else:
            taskToAdd.name = "default task name"
        print("Please input a task description, or <enter> for blank.")
        taskDesc = input("  > ")
        taskToAdd.description = taskDesc
        print("Please input a task due date, or <enter> for blank.")
        taskDue = input("  > ")
        taskToAdd.dueDate = taskDue
        print("Which column would you like this task to be in?")
        taskColumn = input("  > ")
        taskToAdd.ownerList.append(curUser.name)
        actionString = curUser.name + " created this task."
        taskToAdd.actionHistoryList.append(actionString)

        time = datetime.datetime.now()
        #From https://www.saltycrane.com/blog/2008/06/how-to-get-current-date-and-time-in/
        formatTime = time.strftime("%Y-%m-%d %H:%M")
        taskToAdd.latestAction = formatTime
        
        formatTime = "(0) " + time.strftime("%Y-%m-%d %H:%M")
    
        while (addTaskToBoard(boardObj, taskColumn, taskToAdd, dbObj, curUser, actionString) != 1):
            print("Could not find column. Please enter valid column name.")
            taskColumn = input("  > ")

        updateBoard(boardObj, curUser)

    else:
        print("Please select a board to work on first with <select>")


def findTask(boardObj, taskToEditName, userObj, dbObj):
    taskFound = False
    for colIndex in range(0, len(boardObj.columnList)):
        for taskIndex in range(0, len(boardObj.columnList[colIndex].taskList)):
            if (boardObj.columnList[colIndex].taskList[taskIndex].name == taskToEditName):
  #              print("FOUND TASK!")
                taskFound = True
                print("Please input a task name, or <enter> for no change.")
                taskName = input("  > ")
                if (taskName != ""):
                    dbObj.child("Boards").child(boardObj.key).child("Tasks").child(boardObj.columnList[colIndex].columnTitle).child(boardObj.columnList[colIndex].taskList[taskIndex].key).update({ 'Name' : taskName})
                    boardObj.columnList[colIndex].taskList[taskIndex].name = taskName
                print("Please input a task description, or <enter> for no change.")
                taskDesc = input("  > ")
                if (taskDesc != ""):
                    dbObj.child("Boards").child(boardObj.key).child("Tasks").child(boardObj.columnList[colIndex].columnTitle).child(boardObj.columnList[colIndex].taskList[taskIndex].key).update({ 'Description' : taskDesc})
                    boardObj.columnList[colIndex].taskList[taskIndex].description = taskDesc
                print("Please input a task due date, or <enter> for no change.")
                taskDue = input("  > ")
                if (taskDue != ""):
                    dbObj.child("Boards").child(boardObj.key).child("Tasks").child(boardObj.columnList[colIndex].columnTitle).child(boardObj.columnList[colIndex].taskList[taskIndex].key).update({ 'DueDate' : taskDue})
                    boardObj.columnList[colIndex].taskList[taskIndex].dueDate = taskDue
                #print("Please input a task latest action, or <enter> for no change.")
                #taskLatest = input("  > ")
                #if (taskLatest != ""):
                #    boardObj.columnList[colIndex].taskList[taskIndex].latestAction = taskLatest

                actionNum = len(boardObj.columnList[colIndex].taskList[taskIndex].actionHistoryList) + 1
                actionString = userObj.name + " editted this task."
                boardObj.columnList[colIndex].taskList[taskIndex].actionHistoryList.append(actionString)

                time = datetime.datetime.now()
                #From https://www.saltycrane.com/blog/2008/06/how-to-get-current-date-and-time-in/
                formatTime = "(" + str(actionNum) + ")" + time.strftime("%Y-%m-%d %H:%M")
                dbObj.child("Boards").child(boardObj.key).child("Tasks").child(boardObj.columnList[colIndex].columnTitle).child(boardObj.columnList[colIndex].taskList[taskIndex].key).child("ActionHistory").update({ formatTime : actionString})
                boardObj.columnList[colIndex].taskList[taskIndex].latestAction = formatTime 
                boardObj.columnList[colIndex].taskList[taskIndex].actionHistoryDict[formatTime] = actionString
                updateBoard(boardObj, userObj)
                return 1

    return 0


def findColumnMoveTask(boardObj, columnToEditString, newTask, dbObj, userObj, oldColumn):
    for colIndex in range(0, len(boardObj.columnList)):
        if (boardObj.columnList[colIndex].columnTitle == columnToEditString):
   #         print("found column!")
            #colFound = True
            boardObj.columnList[colIndex].taskList.append(newTask)
            dbObj.child("Boards").child(boardObj.key).child("Tasks").child(boardObj.columnList[colIndex].columnTitle).child(newTask.key).update({"Name" : newTask.name,
                                                                                                                     "DueDate" : newTask.dueDate,
                                                                                                                     "LatestAction" : newTask.latestAction,
                                                                                                                     "Description" : newTask.description})

            actionNum = len(newTask.actionHistoryList) + 1
            actionString = userObj.name + " moved this task."
            newTask.actionHistoryList.append(actionString)

            time = datetime.datetime.now()
            #From https://www.saltycrane.com/blog/2008/06/how-to-get-current-date-and-time-in/
            formatTime = "(" + str(actionNum) + ")" + time.strftime("%Y-%m-%d %H:%M")
            oldActions = dbObj.child("Boards").child(boardObj.key).child("Tasks").child(boardObj.columnList[colIndex].columnTitle).child(newTask.key).child("ActionHistory").get()
            newTask.actionHistoryDict[formatTime] = actionString
            
            #for action in oldActions:#.each():
    #        print("ACTION: ", oldActions.key(), " VAL: ", oldActions.val())
            for key, action in newTask.actionHistoryDict.items():
                dbObj.child("Boards").child(boardObj.key).child("Tasks").child(boardObj.columnList[colIndex].columnTitle).child(newTask.key).child("ActionHistory").update({ key : action})
            newTask.latestAction = formatTime 

            for owners in newTask.ownerList:
            #    print("OWNER: ", owners)
                dbObj.child("Boards").child(boardObj.key).child("Tasks").child(boardObj.columnList[colIndex].columnTitle).child(newTask.key).child("Owners").update({owners : True})
##            print("Please input a new column name, or <enter> for no change.")
##            newColName = input("  > ")
##            if (newColName != ""):
##                boardObj.columnList[colIndex].columnTitle = newColName

            return 1
    return 0

def moveTask(boardObj, userObj, dbObj):
    if (boardObj != -1):
        taskToMove = Task()
        print("What is the name of the task you want to move?")
        taskToEditName = input("  > ")
        while (taskToEditName == ""):
            print("The name of the task to edit cannot be blank.")
            print("What is the name of the task you want to move?")
            taskToEditName = input("  > ")
        for colIndex in range(0, len(boardObj.columnList)):
            for taskIndex in range(0, len(boardObj.columnList[colIndex].taskList)):
                if (boardObj.columnList[colIndex].taskList[taskIndex].name == taskToEditName):
                    print("FOUND TASK!")
                    taskFound = True
                    taskToMove = boardObj.columnList[colIndex].taskList[taskIndex]

     #               print("ACTION HISTORY SIZE: ", len(taskToMove.actionHistoryList))
                    #del boardObj.columnList[colIndex].taskList[taskIndex]
                    print("What is the name of the column you want to move to?")
                    columnToEditString = input("  > ")
                    while (columnToEditString == ""):
                        print("The name of the column to edit cannot be blank.")
                        print("What is the name of the column you want to move to?")
                        columnToEditString = input("  > ")
                    dbObj.child("Boards").child(boardObj.key).child("Tasks").child(boardObj.columnList[colIndex].columnTitle).child(taskToMove.key).remove()
                    returnVal = findColumnMoveTask(boardObj, columnToEditString, taskToMove, dbObj, userObj, boardObj.columnList[colIndex].columnTitle)
                    if (returnVal == 1):
                        print("Column successfully edited.")
      #                  print("BEFORE DELETION")
                        #popped = boardObj.columnList[colIndex].taskList[taskIndex].pop(boardObj.columnList[colIndex].taskList[taskIndex])
                        #print("AFTER DELETION POPPED: ", popped)
                        boardObj.columnList[colIndex].taskList.remove(taskToMove)
                        updateBoard(boardObj, userObj)
                        return 1
                    else:
                        print("Could not edit column. Maybe you typed the name wrong?")
    else:
        print("Please select a board to work on first with <select>")
        return 0



def editTask(boardObj, userObj, dbObj):
    if (boardObj != -1):
        print("What is the name of the task you want to edit?")
        taskToEditString = input("  > ")
        while (taskToEditString == ""):
            print("The name of the task to edit cannot be blank.")
            print("What is the name of the task you want to edit?")
            taskToEditString = input("  > ")
        returnVal = findTask(boardObj, taskToEditString, userObj, dbObj)
        if (returnVal == 1):
            print("Task successfully edited.")
            updateBoard(boardObj, userObj)
        else:
            print("Could not edit task. Maybe you typed the name wrong?")
    else:
        print("Please select a board to work on first with <select>")

def findColumn(boardObj, columnToEditString):
    for colIndex in range(0, len(boardObj.columnList)):
        if (boardObj.columnList[colIndex].columnTitle == columnToEditString):
       #     print("found column!")
            #colFound = True
            print("Please input a new column name, or <enter> for no change.")
            newColName = input("  > ")
            if (newColName != ""):
                boardObj.columnList[colIndex].columnTitle = newColName

            return 1
    return 0

def editColumn(boardObj, userObj):
    #colFound = False
    if (boardObj != -1):
        print("What is the name of the column you want to edit?")
        columnToEditString = input("  > ")
        while (columnToEditString == ""):
            print("The name of the column to edit cannot be blank.")
            print("What is the name of the column you want to edit?")
            columnToEditString = input("  > ")
        returnVal = findColumn(boardObj, columnToEditString)
        if (returnVal == 1):
            print("Column successfully edited.")
            updateBoard(boardObj, userObj)
        else:
            print("Could not edit column. Maybe you typed the name wrong?")
    else:
        print("Please select a board to work on first with <select>")
        return 0


def addColumn(boardObj, userObj):
    if (boardObj != -1):
        newColumn = KanColumn()
        print("What would you like the column title to be?")
        colTitle = input("  > ")
        while (colTitle == ""):
            print("Column title cannot be blank.")
            print("What would you like the column title to be?")
            colTitle = input("  > ")

        newColumn.columnTitle = colTitle
        boardObj.columnList.append(newColumn)
        updateBoard(boardObj, userObj)
        print("Column Added!")
        print("Please note, you must add a task to your new column before pushing to database, or it will not appear.")
    else:
        print("Please select a board to work on first with <select>")


def viewOwners(boardObj, curUser):
    if (boardObj != -1):
        ownerString = "Owners of this board are: "
        for u in boardObj.userList:
            #print("USER: ", u)
            ownerString += u + ", "
        ownerString = ownerString[0:-2]
        print(ownerString)
    else:
        print("Please select a board to work on first with <select>")


def boardToJson(boardObj):
    boardJson = json.dumps(boardObj.to_dict())
    #print("OUR ORIGINAL BOARD JSON: ", boardJson)
    newBoardJson = re.sub('\\\\|\[|\]', '', boardJson)
    print("OUR NEWWWWWW BOARD JSON: ", newBoardJson)

    return newBoardJson




def boardAlreadyExists(dbObj, boardToFind):
    for boardval in dbObj.each():
        for key, val in boardval.val().items():
            if (key == "Name"):
                if (val != boardToFind):
                    continue
                else:
                    #print("WE FOUND THE BOARD BAYBEEEEEE")
                    return True
    return False


def updateDbBoard(dbObj, boardObj):
    if (boardObj == -1):
        print("Please select a board first")
        return
    #dbObj.child(boardObj.name).update({"Name": "BOARD1"})

    #Here we need to remove stuff
    #for col in boardObj.columnList:
    #    for toRemove in boardObj.colKeysToRemove:

    #usersDbObj = dbObj.child(boardObj.key).child("Users").get()
    #for owner in boardObj.userList:
    #for key in usersDbObj.each():
    #    print("USER KEY: ", key.key())#, " USER VAL: ", val)
    #    if (key.key() not in boardObj.userList):
    #        print("USER NOT IN USERLIST!")
    #        dbObj.child("Boards").child(boardObj.key).child("Users").child(key.key()).remove()# : "false"})

    #colKeyList = []
    #colDBs = dbObj.child("Boards").child(boardObj.key).child("Tasks").get()
    #print("COLDB: ", colDBs.key())
    #for colKey in colDBs.each():
    #    print("COLKEY: ", colKey.key())
    #    if (colKey.key() in boardObj.colKeysToRemove):
    #        print("COLUMN TO REMOVE: ", colKey.key())
    #        dbObj.child("Boards").child(boardObj.key).child("Tasks").child(colKey.key()).remove()

    #for colKey in boardObj.colKeysToRemove:
    #    print("COLUMN TO REMOVE: ", colKey)
    #    dbObj.child("Boards").child(boardObj.key).child("Tasks").child(colKey).remove()

    #for taskKey in boardObj.taskKeysToRemove:


    for col in boardObj.columnList:
        for task in col.taskList:
            print("COLUMN: ", col.columnTitle, " TASKKEY: ", task.key)
            dbObj.child("Boards").child(boardObj.key).child("Tasks").child(col.columnTitle).child(task.key).update({"Name" : task.name,
                                                                                                                     "DueDate" : task.dueDate,
                                                                                                                     "LatestAction" : task.latestAction,
                                                                                                                     "Description" : task.description})


            for owners in task.ownerList:
                print("OWNER: ", owners)
                dbObj.child("Boards").child(boardObj.key).child("Tasks").child(col.columnTitle).child(task.key).child("Owners").update({owners : True})




def makeNewBoard(currentUser, dbObj):
    createdBoard = Board()
    print("What would you like the board name to be?")
    createdBoardname = input("  > ")
    while (createdBoardname == ""):
        print("Board name cannot be blank.")
        print("What would you like the board name to be?")
        createdBoardname = input("  > ")

#Found at: https://stackoverflow.com/questions/23326099/how-can-i-limit-the-user-input-to-only-integers-in-python
    while True:
        try:
            print("How many columns would you like this board to have?")
            columnTotal = int(input("  > "))
            if (columnTotal <= 0):
                print("Please enter an integer value above 0.")
                continue
            break
        except:
            print("Please enter an integer value above 0.")


    for colNum in range(0, columnTotal):
        #print("In Colnum for!")
        addColumn(createdBoard, currentUser)


    createdBoard.name = createdBoardname
    createdBoard.userList.append(currentUser.name)
    currentUser.boardObjectList.append(createdBoard)
    newKey = dbObj.child("Boards").push({"Name" : createdBoard.name})
    createdBoard.key = newKey['name']
    dbObj.child("Boards").child(createdBoard.key).child("Users").update({currentUser.name : True})
   
    addTask(createdBoard, currentUser, dbObj)



    #updateDbBoard(dbObj, createdBoard)
    return createdBoard

def assignTask(boardObj, userObj, dbObj):
    if (boardObj != -1):
        userFound = False
        taskFound = False
        print("What is the name of the task you want to assign?")
        taskToEditString = input("  > ")
        while (taskToEditString == ""):
            print("The name of the task to assign cannot be blank.")
            print("What is the name of the task you want to assign?")
            taskToEditString = input("  > ")
        for colIndex in range(0, len(boardObj.columnList)):
            for taskIndex in range(0, len(boardObj.columnList[colIndex].taskList)):
                if (boardObj.columnList[colIndex].taskList[taskIndex].name == taskToEditString):
                    taskFound = True
                    print("What is the name of the user you want to assign? Type your own username to remove yourself.")
                    taskToAssignUser = input("  > ")
                    while (taskToAssignUser == ""):
                        print("The name of the user to assign cannot be blank.")
                        print("What is the name of the user you want to assign? Type your own username to remove yourself.")
                        taskToAssignUser = input("  > ")
                    #need to also remove here
                    for userIndex in range(0, len(boardObj.columnList[colIndex].taskList[taskIndex].ownerList)):
                        if (taskToAssignUser == boardObj.columnList[colIndex].taskList[taskIndex].ownerList[userIndex]):
                            userFound = True
                            boardObj.columnList[colIndex].taskList[taskIndex].ownerList.remove(taskToAssignUser)
                            dbObj.child("Boards").child(boardObj.key).child("Tasks").child(boardObj.columnList[colIndex].columnTitle).child(boardObj.columnList[colIndex].taskList[taskIndex].key).child("Owners").update({ taskToAssignUser : False})
                    if (userFound == False):
                        boardObj.columnList[colIndex].taskList[taskIndex].ownerList.append(taskToAssignUser)
                        dbObj.child("Boards").child(boardObj.key).child("Tasks").child(boardObj.columnList[colIndex].columnTitle).child(boardObj.columnList[colIndex].taskList[taskIndex].key).child("Owners").update({ taskToAssignUser : True})
                        print("Added user ", taskToAssignUser, " to ", boardObj.columnList[colIndex].taskList[taskIndex].name)
                        return 1

    else:
        print("Please select a board to work on first with <select>")



def assignBoard(boardObj, userObj, DbObj):
    if (boardObj != -1):
        userFound = False
        print("What is the name of the user you want to assign? Type your own username to remove yourself.")
        userAssignString = input("  > ")
        while (userAssignString == ""):
            print("The name of the user to assign cannot be blank.")
            print("What is the name of the user you want to assign?")
            userAssignString = input("  > ")
        for userIndex in range (0, len(boardObj.userList)):
            print("LENGTH OF LIST: ", len(boardObj.userList), " INDEX: ", userIndex)
            if (boardObj.userList[userIndex] == userAssignString):
                userFound = True
                print("INSIDE USERFOUND IF")
                #Delete user if found
                boardObj.userList.remove(userAssignString)
                #Here we need to remove the board from the user's list in the user section.
                updateBoard(boardObj, userObj)
                break



        if (userFound == False):
            #Add the user
            boardObj.userList.append(userAssignString)
            updateBoard(boardObj, userObj)
        userDbObj = DbObj.child("Users").get()
        if (findIfUserExistInDB(userDbObj, userAssignString)):
            if (userAssignString in boardObj.userList):
                DbObj.child("Users").child(userAssignString).set({boardObj.key : True})
                DbObj.child("Boards").child(boardObj.key).child("Users").update({userAssignString : True})
            else:
                DbObj.child("Boards").child(boardObj.key).child("Users").child(userAssignString).remove()
                DbObj.child("Users").child(userAssignString).set({boardObj.key : False})
        
            #    print("THE USER WAS FOUND IN THE DB.")
        else:
            DbObj.child("Users").child(userAssignString).set({boardObj.key : "true"})
            DbObj.child("Boards").child(boardObj.key).child("Users").update({userAssignString : True})
            #print("USER NOT FOUND IN DB.")

    else:
        print("Please select a board to work on first with <select>")


def removeTask(boardObj, userObj, dbObj):
    if (boardObj != -1):
        taskFound = False
        print("What is the name of the task you want to remove?")
        taskRemoveString = input("  > ")
        while (taskRemoveString == ""):
            print("Task to remove cannot be blank.")
            print("What is the name of the task you want to remove?")
            taskRemoveString = input("  > ")
        for colIndex in range(0, len(boardObj.columnList)):
            for taskIndex in range(0, len(boardObj.columnList[colIndex].taskList)):
                if (boardObj.columnList[colIndex].taskList[taskIndex].name == taskRemoveString):
                    taskFound = True
                    taskToRemove = boardObj.columnList[colIndex].taskList[taskIndex]
                    boardObj.columnList[colIndex].taskList.remove(taskToRemove)
                    boardObj.taskKeysToRemove.append(taskToRemove.name)
                    dbObj.child("Boards").child(boardObj.key).child("Tasks").child(boardObj.columnList[colIndex].columnTitle).child(taskToRemove.key).remove()
                    print("Task Removed!")
                    updateBoard(boardObj, userObj)
                    return 1

        if (taskFound == False):
            print("Could not find that task in your current board. Are you sure you typed the name correctly?")
            return -1

    else:
        print("Please select a board to work on first")

def removeColumn(boardObj, userObj, dbObj):
    if boardObj != -1:
        colFound = False
        print("Be aware that any tasks contained in the deleted column will also be removed.")
        print("What is the name of the column you want to remove?")
        colRemoveString = input("  > ")
        while (colRemoveString == ""):
            print("Task to remove cannot be blank.")
            print("What is the name of the column you want to remove?")
            colRemoveString = input("  > ")
        for colIndex in range(0, len(boardObj.columnList)):
            if (boardObj.columnList[colIndex].columnTitle == colRemoveString):
                colFound = True
                colToRemove = boardObj.columnList[colIndex]
                boardObj.columnList.remove(colToRemove)
                print("Column removed!")
                boardObj.colKeysToRemove.append(colToRemove.columnTitle)
                dbObj.child("Boards").child(boardObj.key).child("Tasks").child(colRemoveString).remove()
                updateBoard(boardObj, userObj)
                return 1
        if (colFound == False):
            print("Could not find that column in your current board. Are you sure you typed the name correctly?")
            return -1
    else:
         print("Please select a board to work on first")

