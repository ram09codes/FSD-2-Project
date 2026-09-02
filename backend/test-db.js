const dns = require('dns');
// Override DNS to bypass local network timeout on SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Error: MONGO_URI is not defined in your .env file.');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB Atlas!');

    // Define a temporary test schema and model
    const TestSchema = new mongoose.Schema({ name: String, date: Date });
    const TestModel = mongoose.model('Test', TestSchema);

    // Perform a quick write test
    const testDoc = await TestModel.create({
      name: 'Database Test Entry',
      date: new Date(),
    });
    console.log('✅ Successfully inserted document:', testDoc);

    // Clean up test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Cleanup complete!');
  } catch (err) {
    console.error('❌ Connection or Insertion Error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

testConnection();