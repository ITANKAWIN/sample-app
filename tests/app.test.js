// tests/app.test.js
const request = require('supertest');
const app = require('../app');
const utils = require('../utils');

describe('App Tests', () => {
  
  // Test สำหรับ Basic Routes
  describe('Basic Routes', () => {
    test('GET / should return hello message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toBe('Hello from Jenkins POC!');
    });

    test('GET /health should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('healthy');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.timestamp).toBeDefined();
    });

    test('GET /nonexistent should return 404', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);
      
      expect(response.body.error).toBe('Route not found');
    });
  });

  // Test สำหรับ User API
  describe('User API', () => {
    test('GET /api/users should return list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('email');
    });

    test('GET /api/users/1 should return specific user', async () => {
      const response = await request(app)
        .get('/api/users/1')
        .expect(200);
      
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('John Doe');
      expect(response.body.email).toBe('john@example.com');
    });

    test('GET /api/users/999 should return 404', async () => {
      const response = await request(app)
        .get('/api/users/999')
        .expect(404);
      
      expect(response.body.error).toBe('User not found');
    });

    test('GET /api/users/invalid should return 400', async () => {
      const response = await request(app)
        .get('/api/users/invalid')
        .expect(400);
      
      expect(response.body.error).toBe('Invalid user ID');
    });

    test('POST /api/users should create new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);
      
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
      expect(response.body.id).toBeDefined();
    });

    test('POST /api/users without name should return 400', async () => {
      const invalidUser = {
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
      
      expect(response.body.error).toBe('Name and email are required');
    });

    test('POST /api/users with invalid email should return 400', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
      
      expect(response.body.error).toBe('Invalid email format');
    });
  });

  // Test สำหรับ Calculator API
  describe('Calculator API', () => {
    test('POST /api/calculate should add numbers correctly', async () => {
      const calculation = {
        operation: 'add',
        a: 5,
        b: 3
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(calculation)
        .expect(200);
      
      expect(response.body.result).toBe(8);
    });

    test('POST /api/calculate should subtract numbers correctly', async () => {
      const calculation = {
        operation: 'subtract',
        a: 10,
        b: 3
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(calculation)
        .expect(200);
      
      expect(response.body.result).toBe(7);
    });

    test('POST /api/calculate should multiply numbers correctly', async () => {
      const calculation = {
        operation: 'multiply',
        a: 4,
        b: 5
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(calculation)
        .expect(200);
      
      expect(response.body.result).toBe(20);
    });

    test('POST /api/calculate should divide numbers correctly', async () => {
      const calculation = {
        operation: 'divide',
        a: 15,
        b: 3
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(calculation)
        .expect(200);
      
      expect(response.body.result).toBe(5);
    });

    test('POST /api/calculate should handle division by zero', async () => {
      const calculation = {
        operation: 'divide',
        a: 10,
        b: 0
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(calculation)
        .expect(400);
      
      expect(response.body.error).toBe('Division by zero is not allowed');
    });

    test('POST /api/calculate should handle invalid operation', async () => {
      const calculation = {
        operation: 'invalid',
        a: 5,
        b: 3
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(calculation)
        .expect(400);
      
      expect(response.body.error).toBe('Invalid operation. Use: add, subtract, multiply, divide');
    });

    test('POST /api/calculate should handle missing parameters', async () => {
      const calculation = {
        operation: 'add',
        a: 5
        // missing b
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(calculation)
        .expect(400);
      
      expect(response.body.error).toBe('Operation, a, and b are required');
    });

    test('POST /api/calculate should handle invalid numbers', async () => {
      const calculation = {
        operation: 'add',
        a: 'not_a_number',
        b: 5
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(calculation)
        .expect(400);
      
      expect(response.body.error).toBe('a and b must be valid numbers');
    });

    test('POST /api/calculate should handle decimal numbers', async () => {
      const calculation = {
        operation: 'add',
        a: 2.5,
        b: 3.7
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(calculation)
        .expect(200);
      
      expect(response.body.result).toBeCloseTo(6.2);
    });

    test('POST /api/calculate should handle negative numbers', async () => {
      const calculation = {
        operation: 'multiply',
        a: -3,
        b: 4
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(calculation)
        .expect(200);
      
      expect(response.body.result).toBe(-12);
    });
  });

  // Test สำหรับ Complex Operation API (ที่มี security issues)
  describe('Complex Operation API', () => {
    test('POST /api/complex-operation should handle basic expression', async () => {
      const operation = {
        expression: '2 + 2',
        data: '{"value": 50}'
      };

      const response = await request(app)
        .post('/api/complex-operation')
        .send(operation)
        .expect(200);
      
      expect(response.body.result).toBe(4);
    });

    test('POST /api/complex-operation should handle errors gracefully', async () => {
      const operation = {
        expression: 'invalidExpression',
        data: 'invalid json'
      };

      const response = await request(app)
        .post('/api/complex-operation')
        .send(operation)
        .expect(500);
      
      expect(response.body.error).toBe('Something went wrong');
    });
  });

  // Test สำหรับ Duplicate APIs
  describe('Duplicate APIs', () => {
    test('GET /api/duplicate1 should return data', async () => {
      const response = await request(app)
        .get('/api/duplicate1')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    test('GET /api/duplicate2 should return same data', async () => {
      const response = await request(app)
        .get('/api/duplicate2')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });

  // Test สำหรับ Edge Cases
  describe('Edge Cases', () => {
    test('Should handle large numbers in calculation', async () => {
      const calculation = {
        operation: 'multiply',
        a: 999999,
        b: 999999
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(calculation)
        .expect(200);
      
      expect(response.body.result).toBe(999998000001);
    });

    test('Should handle string numbers in calculation', async () => {
      const calculation = {
        operation: 'add',
        a: '10',
        b: '20'
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(calculation)
        .expect(200);
      
      expect(response.body.result).toBe(30);
    });
  });
});

// Test สำหรับ Utils functions
describe('Utils Tests', () => {
  describe('User Data Processing', () => {
    test('should process valid user data', () => {
      const result = utils.processUserData(
        'John', 'Doe', 'john@example.com', '1234567890',
        '123 Main St', 'City', '12345', 'Country', 30, 'M'
      );
      
      expect(result).toBeDefined();
      expect(result.name).toBe('John Doe');
    });

    test('should return null for invalid data', () => {
      const result = utils.processUserData('John'); // Missing required params
      expect(result).toBeNull();
    });
  });

  describe('Price Calculation', () => {
    test('should calculate premium price', () => {
      const price = utils.calculatePrice(100, 'premium');
      expect(price).toBeGreaterThan(100);
    });

    test('should calculate discount price', () => {
      const price = utils.calculatePrice(100, 'discount');
      expect(price).toBeLessThan(100);
    });
  });

  describe('Discount Rate', () => {
    test('should return correct discount for customer types', () => {
      expect(utils.getDiscountRate('regular')).toBe(0.05);
      expect(utils.getDiscountRate('premium')).toBe(0.10);
      expect(utils.getDiscountRate('invalid')).toBe(0.00);
    });
  });

  describe('Value Comparison', () => {
    test('should compare values', () => {
      expect(utils.compareValues(5, 5)).toBe(true);
      expect(utils.compareValues(5, '5')).toBe(true); // Shows == issue
      expect(utils.compareValues(null, undefined)).toBe(false);
    });
  });

  describe('Status Messages', () => {
    test('should return correct status messages', () => {
      expect(utils.getStatusMessage(200)).toBe('OK');
      expect(utils.getStatusMessage(404)).toBe('Not Found');
      expect(utils.getStatusMessage(999)).toBe('Unknown Status');
    });
  });
});

// Fallback tests สำหรับ environments ที่ไม่มี Jest
if (require.main === module) {
  console.log('Running basic tests...');
  
  // Test 1: Check if express can be imported
  try {
    require('express');
    console.log('✓ Express import test passed');
  } catch (e) {
    console.log('✗ Express import test failed:', e.message);
    process.exit(1);
  }
  
  // Test 2: Check if app can be imported
  try {
    const app = require('../app');
    if (app) {
      console.log('✓ App import test passed');
    }
  } catch (e) {
    console.log('✗ App import test failed:', e.message);
    process.exit(1);
  }
  
  console.log('All basic tests passed!');
}
