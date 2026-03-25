import 'package:flutter/material.dart';
import '../models/category.dart';

class CategoryChip extends StatelessWidget {
  final Category category;
  final VoidCallback? onTap;

  const CategoryChip({
    Key? key,
    required this.category,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Chip(
        backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
        side: BorderSide(
          color: Theme.of(context).colorScheme.primary.withOpacity(0.3),
        ),
        label: Text(
          category.name,
          style: TextStyle(
            color: Theme.of(context).colorScheme.primary,
            fontWeight: FontWeight.w500,
          ),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      ),
    );
  }
}