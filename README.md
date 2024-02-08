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
        "username": "Rahul",
        "email": "rahul143@gmail.com",
        "password": "$2b$10$B.igfArgqBcKXDmM8D0fMu/6Xuj2xEQScpZYd54emzRGcjPeOm3oS",
        "role": "retailuser",
        "isDeleted": false,
        "_id": "65c20bafec34cb82e2c82ad3",
        "createdAt": "2024-02-06T10:36:31.236Z",
        "updatedAt": "2024-02-06T10:36:31.236Z",
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
        "userId": "65c20b9aec34cb82e2c82ad0",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMyMGI5YWVjMzRjYjgyZTJjODJhZDAiLCJpYXQiOjE3MDcyMTg3OTUsImV4cCI6MTcwNzMwNTE5NX0.zzWKCZLMuIraYDLjQk_R11cQ7HDOPv0zgl6QD6keiBA"
    }
}

3. Create Book
Endpoint localhost:3000/create-book
Description
Request Body Destructuring:

The function extracts authors, title, description, and price from the request body using object destructuring.
Input Validation:

It performs various input validations:
Checks if at least one author is provided.
Validates each author ID using mongoose.Types.ObjectId.isValid.
Verifies if the requesting user ID is included in the list of authors (authorization).
Checks for the existence of authors with the specified IDs and ensures they are not deleted.
Validates the presence of title, description, and price.
Verifies that price is a number between 100 and 1000.
Ensures that ISBN is provided and follows a specific format using a regular expression.
Book Creation:

If all validations pass, it creates a new book document using the bookModel.create method.
The book object includes the authors, title, description, price, and ISBN.
If the book title or ISBN already exists in the database, it returns an error response.
Email Notification:

After successfully creating the book, it fetches all users from the database.
Filters out only the retail users' email addresses.
Constructs an email subject and body message.
Sends an email notification to each retail user using Nodemailer.
It sends the email via a local SMTP server configured to listen on localhost:1025.
Response:

If everything is successful, it sends a 201 status code along with a success message and the created book data.
If any error occurs during the process, it returns a 500 status code along with an error message.
Error Handling:

It catches any exceptions that occur during the execution of the function and returns an appropriate error response.
{
    "status": true,
    "message": "book created successfully",
    "data": {
        "authors": [
            "65c208f63467b5f6d9825da2"
        ],
        "sellCount": 0,
        "title": "the-dirty-side4",
        "description": "The dirty side of a hurricane or tropical system is the right side of the storm with respect to the direction it is moving. So, if the system is moving to the north, the dirty side is usually to the right or east side of the system. If the storm is moving west, the dirty side would be the top or north side.",
        "ISBN": "9876546789075",
        "reviews": 0,
        "price": 220,
        "isDeleted": false,
        "_id": "65c21fc7c8c19f825141f989",
        "createdAt": "2024-02-06T12:02:15.059Z",
        "updatedAt": "2024-02-06T12:02:15.059Z",
        "__v": 0
    }
}

4. Filter Book
Endpoint localhost:3000/filter-book
Description

Request Query Parameters: It extracts parameters from the request query, including authorId, priceMin, priceMax, title, bookId, and ISBN.

Filter Object Creation: It creates a filter object to be used in the MongoDB query. The isDeleted field is set to false to ensure only active books are considered for filtering.

Filter Criteria: Based on the provided query parameters, the filter object is populated. If authorId is provided, it filters books by author ID. Similarly, if title, bookId, or ISBN is provided, it filters books by these attributes.

Price Range Filtering: If priceMin and priceMax are both provided, it filters books by the price range specified. If only one of them is provided, it filters books either greater than or equal to ($gte) priceMin or less than or equal to ($lte) priceMax.

Database Query: It uses the find() method of the bookModel to query the database with the constructed filter object.

Response Handling: If no books are found based on the filtering criteria, it returns a 404 status with an error message. Otherwise, it returns a 200 status with the filtered book data.

Error Handling: If an error occurs during the execution of the route handler, it logs the error and returns a 500 status with an error message.
{
    "status": true,
    "data": [
        {
            "_id": "65c20cb734c2cc38108181dc",
            "authors": [
                "65c2090a3467b5f6d9825da5",
                "65c208f63467b5f6d9825da2"
            ],
            "sellCount": 0,
            "title": "i-am-veera",
            "description": "In this moving novel about a turbulent time, Ari and her family discover that what is most important is not what you think you want",
            "ISBN": "9876546789076",
            "reviews": 0,
            "price": 220,
            "isDeleted": false,
            "createdAt": "2024-02-06T10:40:55.908Z",
            "updatedAt": "2024-02-06T10:40:55.908Z",
            "__v": 0
        }
    ]
}

5. Search Book
Endpoint localhost:3000/search-book
Description
Request Query Parameters: It extracts parameters from the request query, including authorId, priceMin, priceMax, title, bookId, and ISBN.

Filter Object Creation: It creates a filter object to be used in the MongoDB query. The isDeleted field is set to false to ensure only active books are considered for searching.

OR Conditions Array: It initializes an array orConditions to store individual conditions that will be combined using the $or operator in MongoDB.

Condition Building: For each provided query parameter, it constructs a condition object and adds it to the orConditions array. For example, if authorId is provided, it creates a condition { authors: authorId } and adds it to the array.

Price Range Filtering: Similar to the previous code, it constructs conditions for filtering books based on price range using $gte and $lte operators.

Empty Criteria Check: It checks if any search criteria have been provided. If not, it returns a 400 status with an error message.

Combining Conditions: It assigns the orConditions array to the $or property of the filter object, effectively creating OR conditions for the search query.

Database Query: It uses the find() method of the bookModel to query the database with the constructed filter object.

Response Handling: If no books are found based on the search criteria, it returns a 404 status with an error message. Otherwise, it returns a 200 status with the search result data.

Error Handling: If an error occurs during the execution of the route handler, it logs the error and returns a 500 status with an error message.
{
    "status": true,
    "data": [
        {
            "_id": "65c20cb734c2cc38108181dc",
            "authors": [
                "65c2090a3467b5f6d9825da5",
                "65c208f63467b5f6d9825da2"
            ],
            "sellCount": 0,
            "title": "i-am-veera",
            "description": "In this moving novel about a turbulent time, Ari and her family discover that what is most important is not what you think you want",
            "ISBN": "9876546789076",
            "reviews": 0,
            "price": 220,
            "isDeleted": false,
            "createdAt": "2024-02-06T10:40:55.908Z",
            "updatedAt": "2024-02-06T10:40:55.908Z",
            "__v": 0
        },
        {
            "_id": "65c20d9b34c2cc38108181e0",
            "authors": [
                "65c2090a3467b5f6d9825da5"
            ],
            "sellCount": 0,
            "title": "the-book-of-names",
            "description": "The grey, black and white monks remain faithful to Aion and discover that the Book of Names, a magical text that contains all the names and accomplishments of every person who has been and will be in Karac Tor, has nothing but blank pages for the future generations as a result of Nemesia's actions.",
            "ISBN": "9876546789070",
            "reviews": 0,
            "price": 220,
            "isDeleted": false,
            "createdAt": "2024-02-06T10:44:43.154Z",
            "updatedAt": "2024-02-06T10:44:43.154Z",
            "__v": 0
        }
    ]
}


6. Create purchase history
Endpoint localhost:3000/purchase
Description
Request Body Validation: It checks if the request body contains any parameters. If not, it returns a 400 status with an error message.

Extracting Request Body: It extracts the bookId and quantity from the request body. It also retrieves the userId from the request object's authentication data.

Parameter Validation: It validates the bookId, quantity, and userId parameters. It checks if they exist, if quantity is a number greater than 0, and if userId is a valid MongoDB ObjectId.

User Authorization: It fetches the user data from the database based on the userId and verifies that the user exists and has the role of a "retailuser". If not, it returns a 403 status with an error message indicating unauthorized access.

Book Existence Check: It checks if the book with the provided bookId exists and is not marked as deleted in the database. If not, it returns a 404 status with an error message indicating that the book was not found.

Updating Book Sell Count: It increments the sellCount property of the book by the purchased quantity and saves the updated book data to the database.

Creating Purchase Record: It constructs a purchase object containing details such as bookId, userId, purchaseDate, price, and quantity, and saves it to the database using the purchaseModel.

Updating Author Revenue: For each author of the purchased book, it updates the revenue collection by incrementing the revenue based on the price of the book multiplied by the purchased quantity. It uses the revenueModel and MongoDB's $inc operator to perform the update.

Response: If the purchase history is successfully created, it returns a 201 status with a success message and the saved purchase data. If any error occurs during the process, it returns a 500 status with an error message.
{
    "status": true,
    "message": "purchase history created successfully",
    "data": {
        "bookId": "65c20d9b34c2cc38108181e0",
        "userId": "65c20b9aec34cb82e2c82ad0",
        "purchaseDate": "2024-02-06T11:06:18.768Z",
        "price": 660,
        "quantity": 3,
        "isDeleted": false,
        "_id": "65c212aaa75e1d1af55becde",
        "createdAt": "2024-02-06T11:06:18.771Z",
        "updatedAt": "2024-02-06T11:06:18.771Z",
        "__v": 0
    }
}
revenue response:
{
  "_id": "65c212ab65e9eef8890c6f4a",
  "authorId": "65c2090a3467b5f6d9825da5",
  "bookId": "65c20d9b34c2cc38108181e0",
  "isDeleted": false,
  "__v": 0,
  "createdAt": "2024-02-06T11:06:18.902+00:00",
  "revenue": 660,
  "updatedAt": "2024-02-06T11:06:18.902+00:00"
}



7. View purchase history
Endpoint localhost:3000/view-purchase/:purchaseId
Description
Request Parameters: It expects a parameter purchaseId in the request URL.
Input Validation:
It checks if purchaseId is provided. If not, it returns a 400 status code with an error message indicating the missing parameter.
It validates purchaseId to ensure it's a valid MongoDB ObjectId. If not, it returns a 400 status code with an error message.
Retrieve Purchase History:
It queries the database (purchaseModel) to find purchase history matching the provided purchaseId, userId (from the request), and isDeleted flag set to false.
The .select({ __v: 0, userId: 0 }) projection is used to exclude the __v and userId fields from the returned documents.
Response Handling:
If no purchase history is found, it returns a 404 status code with an error message indicating no record found.
If purchase history is found, it returns a 200 status code with a JSON response containing the status and the retrieved purchase history data.
{
    "status": true,
    "data": [
        {
            "_id": "65c212aaa75e1d1af55becde",
            "bookId": "65c20d9b34c2cc38108181e0",
            "purchaseDate": "2024-02-06T11:06:18.768Z",
            "price": 660,
            "quantity": 3,
            "isDeleted": false,
            "createdAt": "2024-02-06T11:06:18.771Z",
            "updatedAt": "2024-02-06T11:06:18.771Z"
        }
    ]
}

8. View author revenue
Endpoint localhost:3000/revenue/:userId
Description
Request Parameters: It expects a parameter userId in the request URL.
Input Validation:
It checks if userId is provided. If not, it returns a 400 status code with an error message indicating the missing parameter.
It validates userId to ensure it's a valid MongoDB ObjectId. If not, it returns a 400 status code with an error message.
Authorization Check:
It compares the userId from the request parameters with the userId associated with the authenticated user (req.userId). If they don't match, it returns a 401 status code with an error message indicating unauthorized access.
Retrieve Revenue History:
It queries the database (revenueModel) to find revenue history matching the provided userId (authorId) and where the isDeleted flag is set to false.
The .select({ __v: 0 }) projection is used to exclude the __v field from the returned documents.
Calculate Total Revenue:
It iterates through the revenue history records and calculates the total revenue by summing up the revenue field from each record.
Response Handling:
If no revenue history is found, it returns a 404 status code with an error message indicating no record found.
If revenue history is found, it constructs a response object containing the authorId and totalRevenue, then returns a 200 status code with a JSON response containing the status and the constructed response object.
Error Handling:
If an error occurs during the execution (e.g., database query), it returns a 500 status code with an error message containing the error details.
{
    "status": true,
    "data": {
        "authorId": "65c2090a3467b5f6d9825da5",
        "totalRevenue": 660
    }
}

9. Create review 
Endpoint localhost:3000/review/:bookId
Description

Request Parameters: It reads the bookId from the request path parameters.

Input Validation:

It checks if the bookId is provided and validates its format. If the bookId is missing or not a valid MongoDB ObjectId, it returns a 400 status with an error message.
Fetch Book: It queries the database to find a book with the specified bookId where the isDeleted flag is false.

Book Existence Check:

If no book is found with the provided bookId, it returns a 404 status with an error message indicating that the book is not found.
It also checks if the authenticated user is an author of the book. If so, it returns a 401 status with an error message indicating that the user is not authorized to review their own book.
Request Body Validation:

It reads the request body and checks if it's empty. If so, it returns a 400 status with an error message asking for input.
It checks for mandatory fields in the request body, specifically the rating. If rating is missing, it returns a 400 status with an error message indicating that the rating is required.
Rating Validation:

It validates the rating field to ensure it's a number between 1 and 5 using a regular expression. If the rating is not valid, it returns a 400 status with an error message indicating an invalid rating.
Create Review:

It adds the bookId from the path parameters to the request body.
It adds additional fields to the request body including reviewedBy (userId of the reviewer) and reviewedAt (timestamp of the review).
It creates a review using the request body data.
Update Book:

It increments the reviews field of the corresponding book by 1 using an atomic update operation.
It retrieves the updated book document and attaches the newly created review to it.
Response:

If successful, it returns a 201 status with a success message and the updated book data.
If an error occurs during the process, it returns a 500 status with an error message indicating server unresponsiveness along with the error details.
{
    "status": true,
    "message": "Success",
    "data": {
        "_id": "65c20d9b34c2cc38108181e0",
        "authors": [
            "65c2090a3467b5f6d9825da5"
        ],
        "sellCount": 3,
        "title": "the-book-of-names",
        "description": "The grey, black and white monks remain faithful to Aion and discover that the Book of Names, a magical text that contains all the names and accomplishments of every person who has been and will be in Karac Tor, has nothing but blank pages for the future generations as a result of Nemesia's actions.",
        "ISBN": "9876546789070",
        "reviews": 1,
        "price": 220,
        "isDeleted": false,
        "createdAt": "2024-02-06T10:44:43.154Z",
        "updatedAt": "2024-02-06T11:29:13.408Z",
        "__v": 0,
        "reviewsData": {
            "bookId": "65c20d9b34c2cc38108181e0",
            "reviewedBy": "65c20b9aec34cb82e2c82ad0",
            "reviewedAt": "2024-02-06T11:29:13.310Z",
            "rating": 4.5,
            "isDeleted": false,
            "_id": "65c21809db5c5a306e6ebd82",
            "createdAt": "2024-02-06T11:29:13.327Z",
            "updatedAt": "2024-02-06T11:29:13.327Z",
            "__v": 0
        }
    }
}
