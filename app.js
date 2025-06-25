const express = require('express');
const app = express();
const port = 3000;

// Middleware สำหรับ JSON parsing
app.use(express.json());

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

// Helper function สำหรับ email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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