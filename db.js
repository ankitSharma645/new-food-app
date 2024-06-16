const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://asuppal0478:asuppal0478@sharma2.tcgvub6.mongodb.net/gofoodmern?retryWrites=true&w=majority&appName=sharma2";
const mongoDB = async () => {
  await mongoose.connect(mongoURI, async (err, result) => {
    if (err) console.log("----", err);
    else {
      console.log("Connected to MongoDB");
      // Fetch data from the Atlas collection
      const fetched_data = await mongoose.connection.db.collection(
        "food_items"
      );
      fetched_data.find({}).toArray(async function (err, data) {
        const foodCategory = await mongoose.connection.db.collection("foodcategory");
        foodCategory.find({}).toArray(function (err, catData) {
          if (err) {
            console.log(err);
          } else {
            global.food_items = data;
            global.foodCategory = catData;
          }
        });
      });
    }
  });
};

module.exports = mongoDB;
