def propKeys(cls):
    return [i for i in cls.__dict__.keys() if i[:1] != '_']

def propVals(cls):
    return [i for i in cls.__dict__.values() if i[:1] != '_']


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
    dueDate = "default due date"
    latestAction = "default latest action"
    name = "default task name"
    ownerList = ["ownerlistitem", "ownerlistitem"]

class KanColumn:
    columnTitle = "default column title"
    taskList = ["tasklistitem", "tasklistitem"]


        

class Board:
    name = "default board name"
    repository = "default repository"
    columnList = ["columnlistitem"]
    userList = ["userlistitem"]

    def __init__(self):      
        name = "default board name"
        repository = "default repository"
        columnList = ["columnlistitem"]
        userList = ["userlistitem"]
        

  #  def __iter__(self):
  #      for attr, value 

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
            column.taskList.append(newTask)
        print(propKeys(newTask), propVals(newTask))

            #print("PARSETASKS KEYY: ", taskHeader, " PARSETASKS VAL: ", taskInfo)


def parseColumns(board, key, value):
    #print("KEY: ", key," VALUE: " value)
    for columnKey, columnValue in value.items():
        newColumn = KanColumn()
        newColumn.columnTitle = columnKey
        parseTasks(newColumn, columnKey, columnValue)
        board.columnList.append(newColumn)
        print(propKeys(newColumn), propVals(newColumn))
        #[print(t) for t in dir(newColumn) if not t.startswith('__')]
        #print("PARSECOLUMNS KEYY: ", keyy, " PARSETASKS VAL: ", val)
