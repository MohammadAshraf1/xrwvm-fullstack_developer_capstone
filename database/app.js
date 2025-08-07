const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3030;

// Middleware
//here?
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// Load data from JSON files
try {
  var reviews_data = JSON.parse(fs.readFileSync('reviews.json', 'utf8'));
  var dealerships_data = JSON.parse(fs.readFileSync('dealerships.json', 'utf8'));
} catch (err) {
  console.error('Error reading JSON files:', err);
  process.exit(1);
}

// Connect to MongoDB
typeof mongoose.connect === 'function' && mongoose.connect('mongodb://mongo_db:27017/', { dbName: 'dealershipsDB' });

// Models
const Reviews = require('./review');
const Dealerships = require('./dealership');

// Seed the database
(async () => {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data.reviews);
    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data.dealerships);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
})();

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Mongoose API');
});

// Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Fetch reviews by dealer ID
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find();
    res.json(dealers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// Fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const dealers = await Dealerships.find({ state: req.params.state });
    res.json(dealers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching dealerships by state' });
  }
});

// Fetch dealership by ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealer = await Dealerships.findOne({ id: parseInt(req.params.id, 10) });
    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    res.json(dealer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching dealership by id' });
  }
});

// Insert a new review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  let data;
  try {
    data = JSON.parse(req.body);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  try {
    const lastReview = await Reviews.findOne().sort({ id: -1 });
    const newId = lastReview ? lastReview.id + 1 : 1;

    const review = new Reviews({
      id: newId,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year,
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
