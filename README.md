# Wanderlust

This project is a web application built with Node.js and Express. It uses EJS as the templating engine and includes functionalities for user management, listing management, and reviews. The project is structured to follow the MVC (Model-View-Controller) pattern.It is deployed using Render which can be accessed using # https://wanderlust-d2gl.onrender.com/listings. It leverages cloud-platform services of cloudinary.

Table of Contents

->Installation
->Usage
->Project Structure
->Routes
->Models
->Controllers
->Views
->Middleware
->Utils
->License

1. Installation:-

git clone https://github.com/yourusername/deta.git
cd deta

2. Install dependencies:

npm install

3. Set up environment variables:
Create a .env file in the root directory and add the necessary environment variables.
Refer to .env.example for the required variables.

4. Start the application:

npm start

5. Usage

Once the application is running, you can access it at http://localhost:8080. The app allows users to sign up, log in, create listings, and post reviews.

Project Structure:-

deta/
├── controller/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── init/
│   ├── data.js
│   └── index.js
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── map.js
│       └── script.js
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
├── views/
│   ├── includes/
│   │   ├── error.ejs
│   │   ├── flash.ejs
│   │   ├── footer.ejs
│   │   └── Navbar.ejs
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── listings/
│   │   ├── edit.ejs
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── show.ejs
│   └── users/
│       ├── login.ejs
│       └── signup.ejs
├── app.js
├── cloudConfig.js
├── middleware.js
├── package.json
├── package-lock.json
└── schema.js

License:-
This project is licensed under the MIT License.
