const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5000', 'https://workspace-5000.app.replit.dev'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Load data
let products = [];
let categories = [];
let users = [];
let cartItems = [];
let orders = [];

// Initialize data
try {
  const dataPath = path.join(__dirname, 'data.json');
  
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    products = data.products || [];
    categories = data.categories || [];
    users = data.users || [];
    cartItems = data.cartItems || [];
    orders = data.orders || [];
    
    console.log('Data loaded successfully');
  } else {
    // Load sample data from JSON
    const sampleData = require('./sample_data.json');
    
    if (sampleData) {
      products = sampleData.products || [];
      categories = sampleData.categories || [];
      
      // Create admin user if not exists
      users = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin', // In a real app, this would be hashed
          firstName: 'Admin',
          lastName: 'User',
          isAdmin: true
        }
      ];
      
      // Save data
      saveData();
      console.log('Sample data loaded successfully');
    }
  }
} catch (err) {
  console.error('Error loading data:', err);
}

// Save data to file
function saveData() {
  try {
    const data = {
      products,
      categories,
      users,
      cartItems,
      orders
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'data.json'),
      JSON.stringify(data, null, 2)
    );
    
    console.log('Data saved successfully');
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

// API Routes

// Root route / health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Eco Fashion API v1.0',
    api: '/api'
  });
});

// Categories
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/categories/:slug', (req, res) => {
  const { slug } = req.params;
  const category = categories.find(cat => cat.slug === slug);
  
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  res.json(category);
});

// Products
app.get('/api/products', (req, res) => {
  const { category, search, featured } = req.query;
  
  let filteredProducts = [...products];
  
  if (category) {
    const categoryObj = categories.find(cat => cat.slug === category);
    if (categoryObj) {
      filteredProducts = filteredProducts.filter(
        product => product.category === categoryObj.id
      );
    }
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      product => 
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        (product.materials && product.materials.toLowerCase().includes(searchLower))
    );
  }
  
  if (featured === 'true') {
    filteredProducts = filteredProducts.filter(product => product.is_featured);
  }
  
  res.json(filteredProducts);
});

app.get('/api/products/:slug', (req, res) => {
  const { slug } = req.params;
  const product = products.find(prod => prod.slug === slug);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

// Auth
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(
    user => user.username === username && user.password === password
  );
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // In a real app, you would use JWT or sessions
  const userResponse = {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  };
  
  res.json({ user: userResponse, token: 'fake-jwt-token' });
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  if (users.some(user => user.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password, // In a real app, this would be hashed
    firstName: firstName || '',
    lastName: lastName || '',
    isAdmin: false
  };
  
  users.push(newUser);
  saveData();
  
  const userResponse = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName
  };
  
  res.status(201).json({ user: userResponse, token: 'fake-jwt-token' });
});

app.get('/api/auth/user', (req, res) => {
  // In a real app, you would verify JWT or session
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (token !== 'fake-jwt-token') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // For demonstration, just return the first user
  const user = users[0];
  
  const userResponse = {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  };
  
  res.json(userResponse);
});

// Cart
app.get('/api/cart', (req, res) => {
  const { session_id } = req.query;
  
  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id parameter' });
  }
  
  const sessionCartItems = cartItems.filter(item => item.session_id === session_id);
  
  // Enhance cart items with product details
  const enhancedCartItems = sessionCartItems.map(item => {
    const product = products.find(p => p.id === item.product);
    
    return {
      id: item.id,
      product: item.product,
      product_title: product ? product.title : 'Unknown Product',
      product_image: product ? product.image_url : '',
      variant: item.variant,
      size: item.variant_size,
      color: item.variant_color,
      quantity: item.quantity,
      unit_price: product ? (product.discount_price || product.price) : 0,
      total_price: product 
        ? (product.discount_price || product.price) * item.quantity 
        : 0
    };
  });
  
  res.json(enhancedCartItems);
});

app.post('/api/cart', (req, res) => {
  const { session_id, product, variant, quantity } = req.body;
  
  if (!session_id || !product || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const productObj = products.find(p => p.id === product);
  
  if (!productObj) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  let variantObj = null;
  let variantSize = null;
  let variantColor = null;
  
  if (variant && productObj.variants) {
    variantObj = productObj.variants.find(v => v.id === variant);
    
    if (variantObj) {
      variantSize = variantObj.size;
      variantColor = variantObj.color;
    }
  }
  
  // Check if item already exists in cart
  const existingItemIndex = cartItems.findIndex(
    item => 
      item.session_id === session_id && 
      item.product === product && 
      item.variant === variant
  );
  
  if (existingItemIndex !== -1) {
    // Update existing item
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    const newCartItem = {
      id: cartItems.length + 1,
      session_id,
      product,
      variant,
      variant_size: variantSize,
      variant_color: variantColor,
      quantity,
      created_at: new Date().toISOString()
    };
    
    cartItems.push(newCartItem);
  }
  
  saveData();
  
  res.status(201).json({ message: 'Item added to cart' });
});

app.put('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }
  
  const itemIndex = cartItems.findIndex(item => item.id === parseInt(id));
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Cart item not found' });
  }
  
  cartItems[itemIndex].quantity = quantity;
  saveData();
  
  res.json({ message: 'Cart item updated' });
});

app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  
  const itemIndex = cartItems.findIndex(item => item.id === parseInt(id));
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Cart item not found' });
  }
  
  cartItems.splice(itemIndex, 1);
  saveData();
  
  res.json({ message: 'Cart item removed' });
});

app.delete('/api/cart', (req, res) => {
  const { session_id } = req.query;
  
  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id parameter' });
  }
  
  cartItems = cartItems.filter(item => item.session_id !== session_id);
  saveData();
  
  res.json({ message: 'Cart cleared' });
});

// Orders
app.get('/api/orders', (req, res) => {
  // In a real app, you would verify JWT or session
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (token !== 'fake-jwt-token') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // For demonstration, just return all orders
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  
  // In a real app, you would verify JWT or session
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (token !== 'fake-jwt-token') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  const order = orders.find(o => o.id === parseInt(id) || o.order_id === id);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const { session_id, email, shipping_address, payment_method } = req.body;
  
  if (!session_id || !email || !shipping_address || !payment_method) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const sessionCartItems = cartItems.filter(item => item.session_id === session_id);
  
  if (sessionCartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  
  // Calculate order totals
  let subtotal = 0;
  const orderItems = sessionCartItems.map(item => {
    const product = products.find(p => p.id === item.product);
    
    if (!product) {
      return null;
    }
    
    const price = product.discount_price || product.price;
    const total = price * item.quantity;
    subtotal += total;
    
    return {
      product: item.product,
      product_title: product.title,
      product_image: product.image_url,
      variant: item.variant,
      size: item.variant_size,
      color: item.variant_color,
      quantity: item.quantity,
      price: price,
      total_price: total
    };
  }).filter(item => item !== null);
  
  const shipping = subtotal >= 100 ? 0 : 7.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  
  // Create new order
  const newOrder = {
    id: orders.length + 1,
    order_id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email,
    shipping_address,
    payment_method,
    subtotal,
    shipping,
    tax,
    total,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: orderItems
  };
  
  orders.push(newOrder);
  
  // Clear cart
  cartItems = cartItems.filter(item => item.session_id !== session_id);
  
  saveData();
  
  res.status(201).json(newOrder);
});

// Catch-all route for frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});