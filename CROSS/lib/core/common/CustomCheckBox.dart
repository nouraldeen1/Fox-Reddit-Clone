import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:reddit_fox/theme/pallete.dart';

class CustomCheckBox extends StatelessWidget {
  const CustomCheckBox({
    super.key,
    required this.value,
    required this.text,
    required this.onChange,
    this.checkColor = Colors.white,
  });
  final bool value;
  final String text;
  final Function(bool) onChange;

  final Color checkColor;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => onChange(!value),
      child: Row(
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: Pallete.redColor,
              borderRadius: BorderRadius.circular(6),
            ),
            child: value
                ? Icon(
                    Icons.check,
                    size: 17,
                    color: checkColor,
                  )
                : null,
          ),
          const Gap(7),
          Text(
            text,
          ),
        ],
      ),
    );
  }
}