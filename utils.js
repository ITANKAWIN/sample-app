// utils.js - File with various code quality issues

// Security Issue: Hardcoded sensitive data
const DATABASE_PASSWORD = "supersecret123";
const JWT_SECRET = "my-jwt-secret-key";

// Code Smell: Unused imports (if we had them)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // Not used anywhere

// Code Smell: Global variables
var globalCounter = 0;
var globalData = {};

// Code Smell: Function with too many parameters
function processUserData(firstName, lastName, email, phone, address, city, zipCode, country, age, gender) {
  // Code Smell: High cognitive complexity
  if (firstName && lastName) {
    if (email && email.includes('@')) {
      if (phone && phone.length > 5) {
        if (address && city) {
          if (zipCode && country) {
            if (age && age > 0) {
              if (gender && (gender === 'M' || gender === 'F')) {
                return {
                  name: firstName + ' ' + lastName,
                  contact: email + ' / ' + phone,
                  location: address + ', ' + city + ' ' + zipCode + ', ' + country,
                  demographics: age + ' years old, ' + gender
                };
              }
            }
          }
        }
      }
    }
  }
  return null;
}

// Code Smell: Duplicate code
function formatUserName1(user) {
  if (!user) return 'Unknown';
  if (!user.firstName) return 'Unknown';
  if (!user.lastName) return user.firstName;
  return user.firstName + ' ' + user.lastName;
}

function formatUserName2(user) {
  if (!user) return 'Unknown';
  if (!user.firstName) return 'Unknown';
  if (!user.lastName) return user.firstName;
  return user.firstName + ' ' + user.lastName; // Exact duplicate
}

// Security Issue: eval() usage
function executeCode(code) {
  return eval(code); // Dangerous!
}

// Code Smell: Magic numbers everywhere
function calculatePrice(basePrice, category) {
  let price = basePrice;
  
  if (category === 'premium') {
    price = price * 1.25; // Magic number
  } else if (category === 'discount') {
    price = price * 0.85; // Magic number
  }
  
  price = price + 15.50; // Magic number (tax?)
  
  if (price > 1000) {
    price = price - 50; // Magic number (bulk discount?)
  }
  
  return Math.round(price * 100) / 100; // Magic numbers for rounding
}

// Code Smell: Switch statement that should be refactored
function getDiscountRate(customerType) {
  switch (customerType) {
    case 'regular':
      return 0.05;
    case 'premium':
      return 0.10;
    case 'vip':
      return 0.15;
    case 'corporate':
      return 0.20;
    case 'government':
      return 0.25;
    case 'non-profit':
      return 0.30;
    case 'student':
      return 0.35;
    case 'senior':
      return 0.40;
    case 'employee':
      return 0.50;
    default:
      return 0.00;
  }
}

// Code Smell: Empty functions
function todoFunction() {
  // TODO: Implement this later
}

function unusedFunction() {
  // This function is never called
  return 'unused';
}

// Code Smell: Inconsistent naming
function calc_total(items) { // snake_case
  let totalAmount = 0; // camelCase
  for (let item_index = 0; item_index < items.length; item_index++) { // snake_case
    totalAmount += items[item_index].price;
  }
  return totalAmount;
}

// Reliability Issue: Potential null pointer
function unsafeAccess(data) {
  console.log(data.user.profile.name); // No null checks
  return data.user.profile.email.toLowerCase(); // Chain can break
}

// Code Smell: Long parameter list in object
function createReport(title, description, author, date, category, priority, status, assignee, reviewer, department, project, version, tags, metadata, attachments, comments) {
  return {
    title, description, author, date, category, priority, 
    status, assignee, reviewer, department, project, version, 
    tags, metadata, attachments, comments
  };
}

// Security Issue: Weak random number generation
function generateId() {
  return Math.random().toString(36).substr(2, 9); // Not cryptographically secure
}

// Code Smell: == instead of ===
function compareValues(a, b) {
  if (a == b) { // Should use ===
    return true;
  }
  if (a == null || b == undefined) { // Mixed null/undefined checks
    return false;
  }
  return a == b; // Another ==
}

// Code Smell: Assignment in condition
function processArray(arr) {
  let item;
  while (item = arr.shift()) { // Assignment in condition
    console.log(item);
  }
}

// Code Smell: Commented out code
// function oldProcessData(data) {
//   console.log('Processing data...');
//   return data.map(item => {
//     return {
//       id: item.id,
//       name: item.name.toUpperCase()
//     };
//   });
// }
// 
// const OLD_CONFIG = {
//   timeout: 5000,
//   retries: 3
// };

// Reliability Issue: Missing error handling
function parseJsonData(jsonString) {
  return JSON.parse(jsonString); // No try-catch
}

// Code Smell: Too many return statements
function getStatusMessage(code) {
  if (code === 200) return 'OK';
  if (code === 201) return 'Created';
  if (code === 400) return 'Bad Request';
  if (code === 401) return 'Unauthorized';
  if (code === 403) return 'Forbidden';
  if (code === 404) return 'Not Found';
  if (code === 500) return 'Internal Server Error';
  if (code === 502) return 'Bad Gateway';
  if (code === 503) return 'Service Unavailable';
  return 'Unknown Status';
}

module.exports = {
  processUserData,
  formatUserName1,
  formatUserName2,
  executeCode,
  calculatePrice,
  getDiscountRate,
  createReport,
  generateId,
  compareValues,
  parseJsonData,
  getStatusMessage
};
