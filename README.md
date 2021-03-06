.___________________________________.
|Super Seven Project Management Tool|
.-----------------------------------.


=============
|Order of Content:|
===================

[A] - <Console>
	A1) How To Run
	A2) Commands

[B] - <Website>
	B1) How To Access
	B2) User Account Creations
	B3) Setting Up A New Project
	B4) Adding Users To A Project
	B5) Removing Users From A Project
	B6) Creating A New Task
	B7) Drag And Drop Tasks
	B8) See More Task Information
	B9) Add Or Remove Owners In A Task
        B10) Add A New Column To The Project Board 

[C] - <Contact Informaiton>
	C1) Support Email Address
	C2) Github Source










   CONSOLE
---------------
A1 - How To Run

In order to begin using the project management system, you must first follow these steps:
	1) Use the 'cd' command to change into the cs461/ directory (cd cs461/)
	2) Once there, use cd again to enter the "console/" directory (cd console/)
	3) Type python3 console.py
	4) Hit ENTER



A2 - Commands

To begin manipulating boards, you must first select a board with the <select> command. If you are not a part of any boards, you can use the <add board> command. 

To see a list of all available commands, use <help>.
To quit, use <quit>. To view all of the boards you are a part of, use <view boards>
	
	
	Once you have selected a board, a plethora of commands become available:
	Task commands: <add task> <edit task> <move task> <remove task> - Move task is for moving tasks between columns.
	Column commands: <edit column> <add column> <remove column> - Editting a column changes the name of it.
	Ownership Commands: <assign task> <assign board> - Type the username of a user you want to add, or your own username to remove 		yourself.
	
	Use <new board> to create a new Kanban board from scratch.
	To see the board you currently have selected, use <print>.
	To see the owners of your current board, use <board owners>.


   WEBSITE
--------------
Bugs that were not fixed:
- After dragging and dropping a task, unwanted space is created between the header and columns
- If a user signs out and a new user signs back in using the same computer and broswer (without
  closing the tab) the current viewed board is that of the previous users board. However this 
  will go away once a board (left side of the page) is clicked on. 


B1 - How to Access

	B1) To get to the website simply enter this link in a Google chrome browser: 
            (To have access to every feature/function of the site you must use Google Chrome) 
	    https://seniorsemgit.firebaseapp.com/

B2 - User Account Creations

	B2) To create an account or to sign in as a user you have already signed in as 
	    simply type in a username in the box on the center of the screen and then 
	    click the login button

B3 - Setting Up A New Project

	B3) To set up a new project board, to the top left of the screen below your
	    username, you will see a sign out link and a textbox with a "Create Board" button.
	    Type in a name you would like the project board to be named after in that textbox 
	    and then press the "Create Board" button. After clicking that button, you will be
	    brought to the main page, where you will see the new project board name you just
	    entered on the left side of the screen right below the "Create Board" button. If
	    you have multiple different project boards you can click on any of them to bring
	    you to that project board page. 

B4 - Adding Users To A Project

	B4) Once you have created a new board for yourself, you will see in the top center of
	    the screen the board Name, board ID, and a list of users on the board. If you just
	    created the board then naturally, you will be the only user on the board. To add
	    members of your team to the board, click the drop down list just below the green 
	    button that says "Add user to the board". From here you can select one user that 
	    you wish to add to the board and once you have selected them you can then press 
	    the "Add user to the board" button. 

B5 - Remove Users From A Project

	B5) If you wish to remove a user from the board, look to the right of the screen 
	    where the red button is. Similar to the the process of adding a user to the board,
	    select a user from the drop down list below the red button that states 
	    "Remove user from the board" and then click the red button.

B6 - Create A New Task

	B6) To create a new task, if you look at the very center of the screen, above the 
	    coloumn "Doing" you will see two buttons. Click the button that says 
	    "Create a new task". This will bring you to a new page where you can fill out each 
	    textbox with the information you desire and then press the "Add new task!" button.
	    If you accidently clicked on the "Create a new task" button, to the top left corner
	    on this new page, you will see a link that says home. This will bring you back to 
	    the home page of your project board. 

B7 - Drag And Drop Tasks

	B7) If you want to make a task from one column to another column, using the left click of
            your mouse, hold down the left click when hovering over the task you wish to move.
	    Then move the mouse cursor (this is the dragging process) to the column you wish to 
	    drop into (This is the dropping process). 

B8 - See More Task Information

        B8) If you want to see task due dates, the history of the task with the list of commits on it.
	    or the history of when the task was moved from one column to another, click on any task
	    you wish. Once clicked on this will bring you to a new page where you will more information
	    on the task. On this page you can refer back to the main project board page, but clicking the
	    Home link at the top left corner of the screen. Right below that home link you can also remove
	    or add an owner to the project. 
	    
B9 - Add Or Remove Owners In A Task

	B9) To add an owner click on the drop down list and select a name present in that list and then 
	    click the green button "Add owners". Right below that you will see another drop down list 
	    with owners you can remove from the task. Once you have selected a name from that list, 
	    click the red button "remove owners". 
	    (Note - only an owner of the task can see the buttons to add or remove an owner)

B10 - Add A New Column To The Project Board

	B10) Look to the center of the main project board page. You should see two buttons right above the
	     "Doing" column. Click on the "Create a new column" button. This will bring you to a new page 
	     where you can enter in a name for said column. Then press the "Add new column!" button. At the
	     top left corner of that page, if you change you mind and do not wish to create a new column, 
	     click the "Home" link. This will bring you back to the main project page. To see the new column
	     you just created scroll to the very bottom of the page, there you will see a horizontal scroll
	     bar. Move that from left to right to see the new column you just created. 



   GIT CONNECTION
--------------------

NOTE: gitConnection.py must be in the repository folder
NOTE: In order for the update git log function to work, the commit message must be in the format:
			git commit -m "TASK: <task_name> ACTION: <action>"
	All in one line.

How to run:
	python3 gitConnection.py

	Options:
	1) Connect board: This will connect your repository to a created board. You will need to provide the board id,
		which you can access from the website or console program.
		This will create a text file that contains your board id, which the program will use to access and update
		the commit history. If this text file is deleted or modified, you will have to register the board again.
	2) Update commit history: This will run the git log command, generate a text file with the information,
		parse the information, and update the database accordingly.