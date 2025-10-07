require('dotenv').config();
const mongoose = require('mongoose');

async function inspectData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const notesCollection = db.collection('notes');
    
    // Count documents
    const count = await notesCollection.countDocuments();
    console.log(`📊 Total notes: ${count}`);
    
    // Get sample documents
    const sampleNotes = await notesCollection.find().limit(3).toArray();
    console.log('\n📄 Sample documents:');
    sampleNotes.forEach((note, index) => {
      console.log(`\n--- Note ${index + 1} ---`);
      console.log(JSON.stringify(note, null, 2));
    });
    
    // Get all field names
    const pipeline = [
      { $project: { arrayofkeyvalue: { $objectToArray: "$$ROOT" } } },
      { $unwind: "$arrayofkeyvalue" },
      { $group: { _id: null, allkeys: { $addToSet: "$arrayofkeyvalue.k" } } }
    ];
    
    const fieldResult = await notesCollection.aggregate(pipeline).toArray();
    if (fieldResult.length > 0) {
      console.log('\n🔑 All fields in collection:', fieldResult[0].allkeys);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

inspectData();
