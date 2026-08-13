import fs from "fs";

const trainingData = JSON.parse(
  fs.readFileSync("./data/training.json", "utf8")
);

console.log("Training examples:");
console.log(trainingData.length);

trainingData.forEach((example, index) => {
  console.log(`\nExample ${index + 1}`);
  console.log("Question:", example.question);
  console.log("Expected behavior:", example.answer);
});