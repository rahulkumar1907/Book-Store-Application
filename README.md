# Book-Store-Application

1. Registration
Endpoint  localhost:3000/register
Description 
Parameter Check: It first checks if the request body contains valid parameters. If the body is empty or missing required parameters, it returns a 400 Bad Request response with an appropriate error message.

Extracting Data: It extracts the username, email, password, and role from the request body.

Validation:

It checks if the username, email, role, and password are present and valid.
It validates the email format using a regular expression.
It ensures that the role is one of the predefined values: author, admin, or retailUser.
It checks the password against a regular expression to ensure it meets certain complexity requirements: minimum eight characters, at least one letter, one number, and one special character.
Checking Existing Email: It queries the database to check if the provided email already exists in the system. If it does, it returns a 400 Bad Request response with an error message indicating that the email is already registered.

Encrypting Password: It hashes the password using bcrypt for secure storage.

Creating User: It creates a new user object with the provided data and stores it in the database using the create method of the userModel.

Response: If the user is successfully created, it returns a 201 Created response with a success message and the created user data. If any error occurs during the process, it returns a 500 Internal Server Error response with an error message.
{
    "status": true,
    "message": "user registered successfully",
    "data": {
        "username": "Vijay",
        "email": "vijay143@gmail.com",
        "password": "$2b$10$iCqVSbPNg44k8k0S7Fz.AuMh3BYmbX0tIVEFFLSwmPfyXmUSCZCju",
        "role": "author",
        "_id": "65bb447c43449871eff0c917",
        "createdAt": "2024-02-01T07:13:00.631Z",
        "updatedAt": "2024-02-01T07:13:00.631Z",
        "__v": 0
    }
}

2. LogIn
Endpoint localhost:3000/login
Description
Request Validation: Checking if the request body contains valid parameters. If the request body is empty or missing essential parameters, it returns a 400 error indicating "missing/invalid parameters".

Extracting Credentials: It then extracts the email and password from the request body for authentication purposes.

Email Validation: It validates the format of the email using a regular expression. If the email format is incorrect, it returns a 400 error indicating "email format not correct".

Password Validation: It validates the password's using a regular expression. If the password does not meet the specified criteria (minimum eight characters, at least one letter, one number, and one special character), it returns a 400 error 

Checking Email Existence: It queries the database to check if the provided email exists. If the email does not exist in the database, it returns a 401 error indicating "incorrect email".

Password Verification: If the email exists, the function retrieves the hashed password associated with that email from the database. It then compares the provided password with the hashed password using bcrypt's compare method. If the passwords do not match, it returns a 401 error indicating "incorrect password".

JWT Token Generation: Upon successful email and password verification, It generates a JSON Web Token (JWT) using the jwt.sign method. This token contains the user's ID as the payload, along with a secret key for signing, and is set to expire in 24 hours.

Response: Finally, It sends a 200 status response with a success message indicating "login successful", along with the user's ID and the JWT token in the response body. If any error occurs during the process, such as database queries or token generation, it returns a 500 status error along with an appropriate error message.
{
    "status": true,
    "message": "login successfull",
    "data": {
        "userId": "65bb36a874bec77d8be97be2",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWJiMzZhODc0YmVjNzdkOGJlOTdiZTIiLCJpYXQiOjE3MDY3NzEwMTksImV4cCI6MTcwNjg1NzQxOX0.3IE_Ty2i8vOOqC1ViZ08urYWmkUy1AhmGVYyDGMKALs"
    }
}

3. Create Book
Endpoint localhost:3000/create-book
Description
Request Validation: It begins by extracting necessary information from the request body, including authors, title, description, and price. It then performs validation checks to ensure that all required fields are present and have valid values.

Author Validation: It checks if the provided author IDs are valid authors by querying the userModel with each author ID and verifying that their role is set to 'author'. If any author ID is not found or does not have the 'author' role,  an appropriate error response with a 400 status code and a corresponding error message.


Generating Slug: The function generates a slug for the book title using the generateSlug function. The slug is a URL-friendly version of the title, which is used to uniquely identify the book in the database.

Checking Existing Book: It queries the bookModel to check if a book with the same slug (title) already exists in the database. If an existing book is found, it returns an error response indicating that the book title already exists.

Creating Book: If all validations pass and no existing book is found with the same title,  a new book object with the provided data and creates it using the bookModel.create method.

Response: Upon successful creation of the book,  a success response with a 201 status code, a message indicating "book created successfully", and the details of the created book in the response body. If any error occurs during the process, it returns a 500 status error along with an appropriate error message.
{
"_id": "65bb4b26b8c54bc6ff1c4a9e",
"authors": [
"65bb388c74bec77d8be97be6",
"65bb447c43449871eff0c917"
],
"sellCount": 0,
"title": "name-of-the-wind",
"description": "It is a high-action novel written with a poet's hand, a powerful comin…",
"price": 990,
"createdAt": "2024-02-01T07:41:26.655+00:00",
"updatedAt": "2024-02-01T07:41:26.655+00:00",
"__v": 0
}
