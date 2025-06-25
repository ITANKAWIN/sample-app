const express = require('express');
const app = express();
const port = 3000;

// TODO: Fix this hardcoded port - SonarQube will detect this as TODO comment
// FIXME: Security issue - need to add rate limiting
// HACK: Temporary solution for demo purposes

// Middleware สำหรับ JSON parsing
app.use(express.json());

// Code Smell: Unused variable
var unusedVariable = 'This variable is never used';

// Code Smell: Duplicate string literals
const DUPLICATE_MESSAGE = 'This is a duplicate message';
const ANOTHER_DUPLICATE = 'This is a duplicate message'; // Duplicate string

// Security Issue: Hardcoded credentials (SonarQube will flag this)
const API_KEY = 'hardcoded-api-key-12345';
const SECRET_PASSWORD = 'admin123';

// หน้าแรก
app.get('/', (req, res) => {
  res.send('Hello from Jenkins POC!');
});

// API สำหรับ Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Code Smell: Function with too many parameters (SonarQube cognitive complexity)
function complexFunction(param1, param2, param3, param4, param5, param6, param7) {
  // Code Smell: High cyclomatic complexity
  if (param1) {
    if (param2) {
      if (param3) {
        if (param4) {
          if (param5) {
            if (param6) {
              if (param7) {
                return 'Too many nested conditions';
              }
            }
          }
        }
      }
    }
  }
  return 'Default';
}

// Code Smell: Empty function
function emptyFunction() {
  // This function does nothing
}

// Code Smell: Magic numbers
function calculateSomething(value) {
  return value * 3.14159 + 42 - 365; // Magic numbers without explanation
}

// API สำหรับ User Management (POC)
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
  
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email
  };
  
  res.status(201).json(newUser);
});

// Code Smell: Long function with many responsibilities
app.post('/api/complex-operation', (req, res) => {
  // Security Issue: eval() usage
  try {
    const expression = req.body.expression;
    const result = eval(expression); // SonarQube will flag this as security vulnerability
    
    // Code Smell: Console.log in production code
    console.log('Dangerous eval result:', result);
    
    // Code Smell: == instead of ===
    if (result == '42') { // Should use ===
      // Code Smell: Nested try-catch
      try {
        // Code Smell: Empty catch block
        const data = JSON.parse(req.body.data);
        
        // Code Smell: Assignment in condition
        if (data.value = 100) { // Should be === not =
          // Reliability Issue: Potential null pointer
          const obj = null;
          console.log(obj.property); // Will throw error
        }
      } catch (e) {
        // Empty catch block - bad practice
      }
    }
    
    res.json({ result });
  } catch (error) {
    // Code Smell: Generic error handling
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// API สำหรับ Calculator (ทดสอบ edge cases)
app.post('/api/calculate', (req, res) => {
  const { operation, a, b } = req.body;
  
  if (!operation || a === undefined || b === undefined) {
    return res.status(400).json({ error: 'Operation, a, and b are required' });
  }
  
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  
  if (isNaN(numA) || isNaN(numB)) {
    return res.status(400).json({ error: 'a and b must be valid numbers' });
  }
  
  let result;
  
  switch (operation) {
    case 'add':
      result = numA + numB;
      break;
    case 'subtract':
      result = numA - numB;
      break;
    case 'multiply':
      result = numA * numB;
      break;
    case 'divide':
      if (numB === 0) {
        return res.status(400).json({ error: 'Division by zero is not allowed' });
      }
      result = numA / numB;
      break;
    default:
      return res.status(400).json({ error: 'Invalid operation. Use: add, subtract, multiply, divide' });
  }
  
  res.json({ result });
});

// Code Smell: Duplicate code blocks
app.get('/api/duplicate1', (req, res) => {
  const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];
  res.json(data);
});

app.get('/api/duplicate2', (req, res) => {
  const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ]; // Exact duplicate of above
  res.json(data);
});

// Code Smell: Function with too many lines and complexity
function monsterFunction(input) {
  // This function does too many things
  let result = '';
  
  // Lots of repetitive code
  if (input == 1) {
    result += 'one';
  } else if (input == 2) {
    result += 'two';
  } else if (input == 3) {
    result += 'three';
  } else if (input == 4) {
    result += 'four';
  } else if (input == 5) {
    result += 'five';
  } else if (input == 6) {
    result += 'six';
  } else if (input == 7) {
    result += 'seven';
  } else if (input == 8) {
    result += 'eight';
  } else if (input == 9) {
    result += 'nine';
  } else if (input == 10) {
    result += 'ten';
  }
  
  // More unnecessary complexity
  for (let i = 0; i < 100; i++) {
    if (i % 2 == 0) {
      if (i % 4 == 0) {
        if (i % 8 == 0) {
          result += i.toString();
        }
      }
    }
  }
  
  return result;
}

// Helper function สำหรับ email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Security Issue: Weak regex that can cause ReDoS
function validateComplexString(str) {
  const vulnerableRegex = /^(a+)+$/; // Vulnerable to ReDoS attack
  return vulnerableRegex.test(str);
}

// Code Smell: Commented out code (SonarQube will detect this)
// function oldFunction() {
//   console.log('This is old code');
//   return 'old';
// }
//
// const oldVariable = 'not used anymore';
// 
// if (false) {
//   console.log('Dead code');
// }

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// เริ่มต้น server (เฉพาะเมื่อไม่ได้ import)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

// Export app สำหรับ testing
module.exports = app;