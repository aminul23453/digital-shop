const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: [
    'http://localhost:5173',        // ← add your Vite port here
    'http://localhost:5000',
    'https://workspace-5000.app.replit.dev'
  ],
  credentials: true
}));

// Middleware
// app.use(cors({
//   origin: ['http://localhost:5000', 'https://workspace-5000.app.replit.dev'],
//   credentials: true
// }));
app.use(express.json());
app.use(morgan('dev'));

// Load data
let products = [];
let categories = [];
let users = [];
let cartItems = [];
let orders = [];

try {
  const dataPath = path.join(__dirname, 'data.json');
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    products   = data.products   || [];
    categories = data.categories || [];
    users      = data.users      || [];
    cartItems  = data.cartItems  || [];
    orders     = data.orders     || [];
    console.log('Data loaded successfully');
  } else {
    const sampleData = require('./sample_data.json');
    if (sampleData) {
      products   = sampleData.products   || [];
      categories = sampleData.categories || [];
      users = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          isAdmin: true
        }
      ];
      saveData();
      console.log('Sample data loaded successfully');
    }
  }
} catch (err) {
  console.error('Error loading data:', err);
}

// Save data helper
function saveData() {
  try {
    const data = { products, categories, users, cartItems, orders };
    fs.writeFileSync(
      path.join(__dirname, 'data.json'),
      JSON.stringify(data, null, 2)
    );
    console.log('Data saved successfully');
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Eco Fashion API v1.0',
    api: '/api'
  });
});

// Categories
app.get('/api/categories',       (req, res) => res.json(categories));
app.get('/api/categories/:slug', (req, res) => {
  const cat = categories.find(c => c.slug === req.params.slug);
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  res.json(cat);
});

// Products
app.get('/api/products',       (req, res) => {
  const { category, search, featured } = req.query;
  let filtered = [...products];
  if (category) {
    const catObj = categories.find(c => c.slug === category);
    if (catObj) filtered = filtered.filter(p => p.category === catObj.id);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.materials && p.materials.toLowerCase().includes(q))
    );
  }
  if (featured === 'true') {
    filtered = filtered.filter(p => p.is_featured);
  }
  res.json(filtered);
});
app.get('/api/products/:slug', (req, res) => {
  const prod = products.find(p => p.slug === req.params.slug);
  if (!prod) return res.status(404).json({ error: 'Product not found' });
  res.json(prod);
});

// Auth
app.post('/api/auth/login',    (req, res) => {
  const { username, password } = req.body;
  const u = users.find(u => u.username === username && u.password === password);
  if (!u) return res.status(401).json({ error: 'Invalid credentials' });
  const userResponse = {
    id: u.id, username: u.username, email: u.email,
    firstName: u.firstName, lastName: u.lastName
  };
  res.json({ user: userResponse, token: 'fake-jwt-token' });
});
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  const newUser = {
    id: users.length + 1,
    username, email, password,
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
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.split(' ')[1];
  if (token !== 'fake-jwt-token') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  const u = users[0]; // demo only
  res.json({
    id: u.id, username: u.username, email: u.email,
    firstName: u.firstName, lastName: u.lastName
  });
});

// Cart endpoints
app.get('/api/cart', (req, res) => {
  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id parameter' });
  }
  const sessionCart = cartItems.filter(i => i.session_id === session_id);
  const enhanced = sessionCart.map(item => {
    const p = products.find(x => x.id === item.product);
    return {
      id: item.id,
      product: item.product,
      product_title:  p?.title  || 'Unknown Product',
      product_image:  p?.image_url || '',
      variant:        item.variant,
      size:           item.variant_size,
      color:          item.variant_color,
      quantity:       item.quantity,
      unit_price:     p ? (p.discount_price || p.price) : 0,
      total_price:    p ? (p.discount_price || p.price) * item.quantity : 0
    };
  });
  res.json(enhanced);
});

app.post('/api/cart', (req, res) => {
  const { session_id, product, variant, quantity } = req.body;
  if (!session_id || !product || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const pObj = products.find(p => p.id === product);
  if (!pObj) {
    return res.status(404).json({ error: 'Product not found' });
  }

  let variantSize, variantColor;
  if (variant && pObj.variants) {
    const vObj = pObj.variants.find(v => v.id === variant);
    if (vObj) {
      variantSize  = vObj.size;
      variantColor = vObj.color;
    }
  }

  const existingIndex = cartItems.findIndex(item =>
    item.session_id === session_id &&
    item.product    === product    &&
    item.variant    === variant
  );

  if (existingIndex !== -1) {
    cartItems[existingIndex].quantity += quantity;
  } else {
    cartItems.push({
      id:           cartItems.length + 1,
      session_id,
      product,
      variant,
      variant_size:  variantSize,
      variant_color: variantColor,
      quantity,
      created_at:    new Date().toISOString()
    });
  }

  saveData();
  res.status(201).json({ message: 'Item added to cart' });
});

app.put('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }
  const idx = cartItems.findIndex(item => item.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Cart item not found' });
  }
  cartItems[idx].quantity = quantity;
  saveData();
  res.json({ message: 'Cart item updated' });
});

app.delete('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = cartItems.findIndex(item => item.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Cart item not found' });
  }
  cartItems.splice(idx, 1);
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

// ← NEW: Merge guest cart into user cart
app.post('/api/cart/merge', (req, res) => {
  const { session_id } = req.body;
  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id parameter' });
  }

  const sessionCart = cartItems.filter(i => i.session_id === session_id);
  const enhanced = sessionCart.map(item => {
    const p = products.find(x => x.id === item.product);
    return {
      id: item.id,
      product: item.product,
      product_title:  p?.title  || 'Unknown Product',
      product_image:  p?.image_url || '',
      variant:        item.variant,
      size:           item.variant_size,
      color:          item.variant_color,
      quantity:       item.quantity,
      unit_price:     p ? (p.discount_price || p.price) : 0,
      total_price:    p ? (p.discount_price || p.price) * item.quantity : 0
    };
  });

  res.json(enhanced);
});

// Orders
app.get('/api/orders',      (req, res) => { /* auth omitted for brevity */ res.json(orders) });
app.get('/api/orders/:id',  (req, res) => { /* auth & lookup */ });
app.post('/api/orders',     (req, res) => { /* create order + clear cart */ });

// Serve frontend in production
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
