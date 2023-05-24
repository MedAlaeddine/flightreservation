# Flight Reservation MicroService (back-End)

As a school project this is an Flight Reservation platform consisting of three microservices: User, Flight, and Reservation. The platform is designed to manage users, Flights, and Reservations using gRPC, GraphQL, and RESTful APIs.

## Table of Contents

- ### Overview
- ### Technologies
- ### Getting Started
- ### Installation
- ### Usage
- ### Contributing
- ### License

## Overview

The Flight Reservation platform is composed of the following microservices:

1. User Microservice: Manages user accounts and user authentification , including CRUD (Create, Read, Update, Delete) operations for user's profile .
2. Flight Microservice: Handles Flight management, including CRUD operations for product listings.
3. Reservation Microservice: Manages Reservation, allowing users to add flights to their reservation.

## Technologies

- gRPC: Used for efficient communication between microservices.
- GraphQL: Implemented for flexible and efficient querying of data.
- REST: RESTful APIs are used for exposing the services to external clients.

## Getting Started

- Prerequisites :
  - Ensure you have the following software installed on your local machine:
  - Node.js (version 12 or higher)
  - npm (version 6 or higher)
  - local server (wamp,Xampp,..)

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/MedAlaeddine/flightreservation.git
    ```

2.  Import the database file "miniaos.sql" into your local server (Wamp,Xampp) phpmyadmin.
3.  Navigate to the project directory.
4.  Install the required dependencies for each microservice:
    ```bash
    npm install
    ```
5.  Start the Api Gateway and all microservices:

    ```bash
    concurrently "nodemon gateway.js" "nodemon .\microservices\reservationMicroService.js" "nodemon .\microservices\flightMicroService.js" "nodemon .\microservices\userMicroService.js"
    ```

## Usage

- Interact with the User, Flight, and Reservation microservices using their respective gRPC, GraphQL, or RESTful API endpoints.
- Use the provided API documentation to understand the available endpoints and their usage.
- Here is the admin credentials for the test :
  - email : Test@warda.com
  - password : test123

## Contributing

Contributions are welcome! Please read the contributing guidelines before getting started.

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.


