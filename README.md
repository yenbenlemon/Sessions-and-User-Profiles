# Sessions-and-User-Profiles

Updated: 1/10/2020

The following project requires an installation of **MongoDB** on your computer. You can download and install MongoDB from the following link: https://docs.mongodb.com/manual/administration/install-community/

The "database-initializer.js" file was provided by Dave McKenney and is only used to create the database for the project. The rest of the project is original content. 

This project focuses on user profiles and authentication within a Node.js environment. The user can log in to view their profile and also has the ability to private their account so only they can view it. Stats are tracked for each user, including quizzes completed, and average score.

###### Project Assets:

- Node.js
- XMLHttpRequest
- Express
- HTML
- JSON
- PUG
- MongoDB
- Mongoose

## Instructions

- Download the project as a .zip
- Some browsers may flag the filees due to the javascript. Simply keep the files in order to continue.

1. Run "npm i" / "npm install" in cmd while accessing the directory
   - Check the package to see the installed modules

2. The header data is included in "views/header.pug" and is incorporated into all other views.
   - Check all pages to confirm header is present
   
Username and passwords are the same. (ex. Username: jacquie, Password: jacquie)

3. Attempt to login with invalid credentials

4. Attempt to login with valid credentials
   - The login fields will disappear
   - User will be able to select their profile in header
   - User will be redirected to their profile

5. UserID's
   - Since all usernames are unique, they are used as ID's for redirecting
   - example "http://localhost:3000/users/lorene"

6. Privacy
   - Private users are not shown in the users list, even if one of the Private users is logged in
   - Logged in user can access their private profile from the "Your Profile" header link
   - User can press the "Set Private" button on their user page
   - Button text changes to "Unprivate" when already private

7. User can logout from their user page only by pressing a logout button
