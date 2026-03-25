import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../providers/auth_provider.dart';
import '../providers/order_provider.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({Key? key}) : super(key: key);

  @override
  _CheckoutScreenState createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();
  final _zipController = TextEditingController();
  final _countryController = TextEditingController();
  
  String _paymentMethod = 'creditCard';
  bool _isPlacingOrder = false;
  bool _saveInfo = true;

  @override
  void initState() {
    super.initState();
    // Pre-fill email from authenticated user if available
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    if (authProvider.isAuth && authProvider.user != null) {
      _emailController.text = authProvider.user!.email;
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _zipController.dispose();
    _countryController.dispose();
    super.dispose();
  }

  Future<void> _placeOrder() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isPlacingOrder = true;
    });

    // Format shipping address
    final shippingAddress = '''
${_addressController.text}
${_cityController.text}, ${_stateController.text} ${_zipController.text}
${_countryController.text}
''';

    try {
      final orderProvider = Provider.of<OrderProvider>(context, listen: false);
      final order = await orderProvider.placeOrder(
        email: _emailController.text,
        shippingAddress: shippingAddress,
        paymentMethod: _paymentMethod,
      );

      if (order != null) {
        // Show success dialog
        await _showOrderConfirmationDialog(order);
        
        if (mounted) {
          Navigator.of(context).pushNamedAndRemoveUntil(
            '/orders',
            (route) => false,
          );
        }
      } else {
        _showErrorSnackBar('Failed to place order. Please try again.');
      }
    } catch (error) {
      _showErrorSnackBar('An error occurred. Please try again.');
    } finally {
      if (mounted) {
        setState(() {
          _isPlacingOrder = false;
        });
      }
    }
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  Future<void> _showOrderConfirmationDialog(Map<String, dynamic> order) async {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        title: Row(
          children: const [
            Icon(Icons.check_circle, color: Colors.green, size: 24),
            SizedBox(width: 8),
            Text('Order Placed Successfully'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Your order #${order['order_id']} has been placed successfully.'),
            const SizedBox(height: 8),
            const Text('You will receive a confirmation email shortly.'),
            const SizedBox(height: 16),
            const Text(
              'Thank you for shopping with Eco Fashion!',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
            },
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Checkout'),
      ),
      body: cartProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : cartProvider.cartItems.isEmpty
              ? const Center(child: Text('Your cart is empty.'))
              : Form(
                  key: _formKey,
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Order summary card
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Order Summary',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('Items (${cartProvider.totalQuantity})'),
                                    Text('\$${cartProvider.subtotal.toStringAsFixed(2)}'),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('Shipping'),
                                    Text('\$${cartProvider.shipping.toStringAsFixed(2)}'),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('Tax'),
                                    Text('\$${cartProvider.tax.toStringAsFixed(2)}'),
                                  ],
                                ),
                                const Divider(height: 16),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text(
                                      'Total',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                    Text(
                                      '\$${cartProvider.total.toStringAsFixed(2)}',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                        color: Theme.of(context).colorScheme.primary,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        
                        // Contact information
                        const Text(
                          'Contact Information',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _emailController,
                          decoration: const InputDecoration(
                            labelText: 'Email',
                            hintText: 'Enter your email address',
                          ),
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your email';
                            }
                            if (!value.contains('@') || !value.contains('.')) {
                              return 'Please enter a valid email address';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 24),
                        
                        // Shipping address
                        const Text(
                          'Shipping Address',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _addressController,
                          decoration: const InputDecoration(
                            labelText: 'Address',
                            hintText: 'Enter your street address',
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your address';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _cityController,
                          decoration: const InputDecoration(
                            labelText: 'City',
                            hintText: 'Enter your city',
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your city';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: TextFormField(
                                controller: _stateController,
                                decoration: const InputDecoration(
                                  labelText: 'State/Province',
                                  hintText: 'Enter your state',
                                ),
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Please enter your state';
                                  }
                                  return null;
                                },
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: TextFormField(
                                controller: _zipController,
                                decoration: const InputDecoration(
                                  labelText: 'ZIP Code',
                                  hintText: 'Enter your ZIP code',
                                ),
                                keyboardType: TextInputType.number,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Please enter your ZIP code';
                                  }
                                  return null;
                                },
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _countryController,
                          decoration: const InputDecoration(
                            labelText: 'Country',
                            hintText: 'Enter your country',
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your country';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 8),
                        CheckboxListTile(
                          title: const Text('Save information for next time'),
                          value: _saveInfo,
                          onChanged: (value) {
                            setState(() {
                              _saveInfo = value ?? false;
                            });
                          },
                          contentPadding: EdgeInsets.zero,
                          controlAffinity: ListTileControlAffinity.leading,
                        ),
                        const SizedBox(height: 24),
                        
                        // Payment method
                        const Text(
                          'Payment Method',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        RadioListTile<String>(
                          title: Row(
                            children: const [
                              Icon(Icons.credit_card),
                              SizedBox(width: 8),
                              Text('Credit Card'),
                            ],
                          ),
                          value: 'creditCard',
                          groupValue: _paymentMethod,
                          onChanged: (value) {
                            setState(() {
                              _paymentMethod = value!;
                            });
                          },
                        ),
                        RadioListTile<String>(
                          title: Row(
                            children: const [
                              Icon(Icons.account_balance),
                              SizedBox(width: 8),
                              Text('Bank Transfer'),
                            ],
                          ),
                          value: 'bankTransfer',
                          groupValue: _paymentMethod,
                          onChanged: (value) {
                            setState(() {
                              _paymentMethod = value!;
                            });
                          },
                        ),
                        RadioListTile<String>(
                          title: Row(
                            children: const [
                              Icon(Icons.payment),
                              SizedBox(width: 8),
                              Text('PayPal'),
                            ],
                          ),
                          value: 'paypal',
                          groupValue: _paymentMethod,
                          onChanged: (value) {
                            setState(() {
                              _paymentMethod = value!;
                            });
                          },
                        ),
                        const SizedBox(height: 24),
                        
                        // Place order button
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _isPlacingOrder ? null : _placeOrder,
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                            child: _isPlacingOrder
                                ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  )
                                : const Text(
                                    'PLACE ORDER',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),
    );
  }
}