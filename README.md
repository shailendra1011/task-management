
# Task Management Application - Backend Setup Guide

**Task Management Application** using  **Node.js** ,  **Express.js** ,  **MySQL** , and  **MongoDB** . The application allows users to register, log in, and manage their tasks efficiently with a combination of SQL (for user data) and NoSQL (for task data) databases.

Tools are installed on your system:

* **Node.js** (version 14 or higher)
* **npm** (Node Package Manager)
* **MySQL**
* **MongoDB**

## Step-by-Step Guide

### 1. Clone the Repository

git clone <repository_url>
cd <project_folder>


### 2. Install Dependencies

npm install

This will install the required packages listed in `package.json`, including:

* **Express.js** : A web framework for building the API.
* **Bcrypt** : For securely hashing passwords.
* **jsonwebtoken** : To generate and verify JWT tokens for authentication.
* **mysql2** : A MySQL client for Node.js.
* **mongoose** : An ODM for MongoDB.

### 3. Setup Environment File

PORT = 4040

APP_ENVIRONMENT=local

NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/task-management

ACCESS_TOKEN_SECRET=811889b2ad065c20f2405a5d6dcb1c73d2422b06ff0db03de9a1d667f785a565792bf116fa5b2d80da8793e312f4ba9fd23dbd9137867f3a132aadb1594c0899

REFRESH_TOKEN_SECRET=d627a36a9cbe8720e29cf8717bcb430756a0628971377d42d1db89a688c815c65d42cd31e93571735afac406af9ff969ae8b0ad23da30cc61921354bbdb1bcb6
