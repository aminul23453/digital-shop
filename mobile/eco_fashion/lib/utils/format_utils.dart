import 'package:intl/intl.dart';

class FormatUtils {
  static String formatCurrency(double amount) {
    final formatter = NumberFormat.currency(symbol: '\$', decimalDigits: 2);
    return formatter.format(amount);
  }

  static String formatDate(DateTime date) {
    return DateFormat('MMM dd, yyyy').format(date);
  }

  static String getProductStatusText(int sustainabilityRating) {
    switch (sustainabilityRating) {
      case 0:
        return 'Not Rated';
      case 1:
        return 'Low Impact';
      case 2:
        return 'Medium Impact';
      case 3:
        return 'Eco-Friendly';
      case 4:
        return 'Sustainable';
      case 5:
        return 'Highly Sustainable';
      default:
        return 'Not Rated';
    }
  }

  static String capitalizeFirstLetter(String text) {
    if (text.isEmpty) return text;
    return text[0].toUpperCase() + text.substring(1);
  }

  static String truncateText(String text, int maxLength) {
    if (text.length <= maxLength) return text;
    return '${text.substring(0, maxLength)}...';
  }

  static String getInitials(String fullName) {
    List<String> names = fullName.split(' ');
    String initials = '';
    if (names.length > 0) {
      initials += names[0][0];
    }
    if (names.length > 1) {
      initials += names[names.length - 1][0];
    }
    return initials.toUpperCase();
  }
}