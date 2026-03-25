import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/cart_item.dart';
import '../providers/cart_provider.dart';

class CartItemCard extends StatelessWidget {
  final CartItem cartItem;

  const CartItemCard({
    Key? key,
    required this.cartItem,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: Key(cartItem.id.toString()),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        color: Colors.red,
        child: const Icon(
          Icons.delete,
          color: Colors.white,
          size: 30,
        ),
      ),
      confirmDismiss: (direction) async {
        return await showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Remove Item'),
            content: const Text('Are you sure you want to remove this item from your cart?'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(ctx).pop(false);
                },
                child: const Text('CANCEL'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.of(ctx).pop(true);
                },
                child: const Text('REMOVE'),
              ),
            ],
          ),
        );
      },
      onDismissed: (direction) {
        Provider.of<CartProvider>(context, listen: false).removeFromCart(cartItem.id);
      },
      child: Card(
        margin: EdgeInsets.zero,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Product image
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  cartItem.productImage,
                  width: 80,
                  height: 80,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    width: 80,
                    height: 80,
                    color: Colors.grey[300],
                    child: const Icon(Icons.image_not_supported, color: Colors.grey),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              
              // Product info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      cartItem.productTitle,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (cartItem.size != null && cartItem.color != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          '${cartItem.size}, ${cartItem.color}',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      ),
                    const SizedBox(height: 8),
                    Text(
                      '\$${cartItem.unitPrice.toStringAsFixed(2)}',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    
                    // Quantity selector
                    Row(
                      children: [
                        InkWell(
                          onTap: cartItem.quantity > 1
                              ? () {
                                  Provider.of<CartProvider>(context, listen: false)
                                      .updateCartItemQuantity(cartItem.id, cartItem.quantity - 1);
                                }
                              : null,
                          child: Container(
                            width: 28,
                            height: 28,
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: cartItem.quantity > 1 ? Colors.grey : Colors.grey[300]!,
                              ),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Icon(
                              Icons.remove,
                              size: 16,
                              color: cartItem.quantity > 1 ? Colors.black : Colors.grey[300],
                            ),
                          ),
                        ),
                        Container(
                          margin: const EdgeInsets.symmetric(horizontal: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            cartItem.quantity.toString(),
                            style: const TextStyle(fontSize: 14),
                          ),
                        ),
                        InkWell(
                          onTap: () {
                            Provider.of<CartProvider>(context, listen: false)
                                .updateCartItemQuantity(cartItem.id, cartItem.quantity + 1);
                          },
                          child: Container(
                            width: 28,
                            height: 28,
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.grey),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Icon(Icons.add, size: 16),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              // Total price
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  IconButton(
                    icon: const Icon(Icons.delete_outline),
                    onPressed: () {
                      Provider.of<CartProvider>(context, listen: false).removeFromCart(cartItem.id);
                    },
                    color: Colors.red,
                    iconSize: 20,
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '\$${cartItem.totalPrice.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}