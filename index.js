const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors'); // Added CORS support
const port = 3000;

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

let db;
let client; // Store client to close connection properly

async function connectToMongoDB() {
    const url = "mongodb://localhost:27017";
    client = new MongoClient(url); // Store the client reference

    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        db = client.db("testDB");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1); // Exit if can't connect to DB
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Routes
app.get('/rides', async (req, res) => {
    try {
        if (!db) throw new Error('Database not connected');
        const rides = await db.collection('rides').find().toArray();
        res.status(200).json(rides);
    } catch (err) {
        console.error('GET /rides error:', err);
        res.status(500).json({ error: "Failed to fetch rides", details: err.message });
    }
});

app.post('/rides', async (req, res) => {
    try {
        if (!req.body || !req.body.pickupLocation || !req.body.destination || !req.body.driverId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        const rideData = {
            ...req.body,
            status: req.body.status || 'requested', // Default status
            createdAt: new Date()
        };
        
        const result = await db.collection('rides').insertOne(rideData);
        res.status(201).json({ 
            id: result.insertedId,
            message: "Ride created successfully"
        });
    } catch (err) {
        console.error('POST /rides error:', err);
        res.status(400).json({ error: "Invalid ride data", details: err.message });
    }
});

app.patch('/rides/:id', async (req, res) => {
    try {
        if (!req.body.status) {
            return res.status(400).json({ error: "Status is required" });
        }

        const result = await db.collection('rides').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status: req.body.status, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }
        
        res.status(200).json({ 
            updated: result.modifiedCount,
            message: "Ride status updated successfully"
        });
    } catch (err) {
        console.error('PATCH /rides/:id error:', err);
        res.status(400).json({ 
            error: "Invalid ride ID or data", 
            details: err.message 
        });
    }
});

app.delete('/rides/:id', async (req, res) => {
    try {
        const result = await db.collection('rides').deleteOne(
            { _id: new ObjectId(req.params.id) }
        );

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }
        
        res.status(200).json({ 
            deleted: result.deletedCount,
            message: "Ride deleted successfully"
        });
    } catch (err) {
        console.error('DELETE /rides/:id error:', err);
        res.status(400).json({ 
            error: "Invalid ride ID", 
            details: err.message 
        });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
    process.exit(0);
});

// Start server after DB connection
connectToMongoDB().then(() => {
    app.listen(port, () => {
        console.log('Server running on port ${port}');
    });
}).catch(err => {
    console.error('Failed to start server:', err);
});