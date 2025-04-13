# Week 03 - Ride-Hailing REST API

## Description
Scaffold a Node.js/Express API with CRUD endpoints for managing rides 
and drivers in a ride-sharing system

## Prerequisites

- *Node.js* 
- *MongoDB* (running locally on default port 27017)
- *Postman* = Download the app for latest version here https://www.postman.com/downloads/ (for API testing)

## Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [repo-name]
```
2. Install dependencies:
``` 
npm intall express
```
3. Start the server:
```
node index.js
```

## API Endpoints

### Rides Collection

| Method    | Endpoint       | Description          | Required Body (JSON)           |
|-----------|----------------|----------------------|--------------------------------|
| POST      | `/rides`       | Create new ride      | `{ pickupLocation, destination }` |
| GET       | `/rides`       | Fetch all rides      | -                              |
| GET       | `/rides/:id`   | Fetch single ride    | -                              |
| PATCH     | `/rides/:id`   | Update ride status   | `{ status: "new-status" }`     |

## Troubleshooting

### Common Issues

1. *MongoDB connection failed*
- ensure MongoDB is running:
```bash
mongod
```
- check connection URL in index.js (default: mongodb://localhost:27017)

2. *Invalid ride ID errors*
- use valid 24-character hex IDs (eg., 67fb1f0539d4bffd463c49e1)
- get valid IDs from GET /rides response

3. *Missing required fields*
- POST requires: pickupLocation, destination
- PATCH requires: status

## Project Structure

project-root/        
├── README.md          
├── index.js           
├── package-lock.json      
└── package.json/

## Lisence 
This project is for educational purposes only