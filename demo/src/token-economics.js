// ==========================================
// 4.9 TOKEN ECONOMICS
// DemoPay AI Product
// ==========================================

// ------------------------------------------
// 1. PRODUCT ASSUMPTIONS
// ------------------------------------------

const product = {
  users: 10000,
  requestsPerUser: 20,

  inputTokensPerRequest: 800,
  outputTokensPerRequest: 300,

  // Teaching prices.
  // Replace these with the current model prices
  // when discussing real production costs.
  inputPricePerMillion: 1,
  outputPricePerMillion: 4
};


// ------------------------------------------
// 2. MONTHLY REQUESTS
// ------------------------------------------

const monthlyRequests =
  product.users * product.requestsPerUser;

console.log("=================================");
console.log("DEMO PAY TOKEN ECONOMICS");
console.log("=================================");

console.log("\nPRODUCT USAGE");
console.log("---------------------------------");

console.log("Users:", product.users);
console.log(
  "Requests per user:",
  product.requestsPerUser
);

console.log(
  "Monthly requests:",
  monthlyRequests
);


// ------------------------------------------
// 3. TOKEN CONSUMPTION
// ------------------------------------------

const monthlyInputTokens =
  monthlyRequests *
  product.inputTokensPerRequest;

const monthlyOutputTokens =
  monthlyRequests *
  product.outputTokensPerRequest;

const monthlyTotalTokens =
  monthlyInputTokens +
  monthlyOutputTokens;

console.log("\nTOKEN CONSUMPTION");
console.log("---------------------------------");

console.log(
  "Input tokens:",
  monthlyInputTokens
);

console.log(
  "Output tokens:",
  monthlyOutputTokens
);

console.log(
  "Total tokens:",
  monthlyTotalTokens
);


// ------------------------------------------
// 4. CALCULATE AI COST
// ------------------------------------------

const inputCost =
  (monthlyInputTokens / 1_000_000) *
  product.inputPricePerMillion;

const outputCost =
  (monthlyOutputTokens / 1_000_000) *
  product.outputPricePerMillion;

const monthlyAICost =
  inputCost + outputCost;

console.log("\nAI COST");
console.log("---------------------------------");

console.log(
  "Input cost: $" +
  inputCost.toFixed(2)
);

console.log(
  "Output cost: $" +
  outputCost.toFixed(2)
);

console.log(
  "Monthly AI cost: $" +
  monthlyAICost.toFixed(2)
);


// ------------------------------------------
// 5. COST PER USER
// ------------------------------------------

const costPerUser =
  monthlyAICost / product.users;

console.log("\nUNIT ECONOMICS");
console.log("---------------------------------");

console.log(
  "AI cost per user: $" +
  costPerUser.toFixed(4)
);


// ------------------------------------------
// 6. MONTHLY BUDGET
// ------------------------------------------

const monthlyBudget = 1000;

console.log("\nBUDGET CHECK");
console.log("---------------------------------");

console.log(
  "Monthly AI budget: $" +
  monthlyBudget.toFixed(2)
);

console.log(
  "Projected AI cost: $" +
  monthlyAICost.toFixed(2)
);

if (monthlyAICost <= monthlyBudget) {
  console.log("Status: WITHIN BUDGET");
} else {
  console.log("Status: OVER BUDGET");
}


// ------------------------------------------
// 7. AGENTIC WORKFLOW
// ------------------------------------------

const modelCallsPerRequest = 5;

const monthlyModelCalls =
  monthlyRequests *
  modelCallsPerRequest;

const agentInputTokens =
  monthlyModelCalls *
  product.inputTokensPerRequest;

const agentOutputTokens =
  monthlyModelCalls *
  product.outputTokensPerRequest;

const agentTotalTokens =
  agentInputTokens +
  agentOutputTokens;

const agentInputCost =
  (agentInputTokens / 1_000_000) *
  product.inputPricePerMillion;

const agentOutputCost =
  (agentOutputTokens / 1_000_000) *
  product.outputPricePerMillion;

const agentMonthlyCost =
  agentInputCost +
  agentOutputCost;

console.log("\nAGENTIC WORKFLOW");
console.log("---------------------------------");

console.log(
  "Model calls per request:",
  modelCallsPerRequest
);

console.log(
  "Monthly model calls:",
  monthlyModelCalls
);

console.log(
  "Total agent tokens:",
  agentTotalTokens
);

console.log(
  "Agent monthly cost: $" +
  agentMonthlyCost.toFixed(2)
);


// ------------------------------------------
// 8. SIMPLE VS AGENTIC
// ------------------------------------------

console.log("\nCOST COMPARISON");
console.log("---------------------------------");

console.log(
  "Simple AI:",
  "$" + monthlyAICost.toFixed(2)
);

console.log(
  "Agentic AI:",
  "$" + agentMonthlyCost.toFixed(2)
);

console.log(
  "Additional cost: $" +
  (agentMonthlyCost - monthlyAICost).toFixed(2)
);