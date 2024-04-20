import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';
import 'package:reddit_fox/core/common/CustomButton.dart';
import 'package:reddit_fox/features/auth/screens/login_screen.dart';
import 'package:reddit_fox/models/user_model.dart';
import '../../../core/common/CustomCheckBox.dart';
import '../../../core/common/CustomTextBox.dart';
import 'package:reddit_fox/routes/Mock_routes.dart';

import 'package:http/http.dart' as http;
import 'dart:convert';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();

  // static int generateIntegerToken({int length = 32}) {
  //   final random = Random.secure();
  //   final values = List<int>.generate(length, (i) => random.nextInt(256));
  //   final bytes = Uint8List.fromList(values);
  //   return bytes.fold(0, (result, element) => (result << 8) + element);
  // }
}

class _SignupScreenState extends State<SignupScreen> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  final UserModel user = UserModel(
    name: "",
    profilePic: "",
    banner: "",
    uid: "",
    isAuthenticated: false,
    karma: 1,
    email: '',
  );

  bool valid = true;
  bool acceptTerms = false;
  bool showPass = false;
  String? errorMessage;

  String? signup(final String email, final String password, String? name,
      DateTime? birthDate, bool termsandconditions) {
    String? errorMessage;
    if (email.trim().isEmpty) errorMessage = "Please enter email";
    RegExp emailPattern = RegExp(
        r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$');
    if (!emailPattern.hasMatch(email) ||
        password.trim().isEmpty ||
        password.length < 7 ||
        name == null) {
      return 'Please enter Valid Data and accept termsandconditions';
    }
    signUpAPI(name, email, password, DateTime.now());

    return null;
  }

  Future<void> signUpAPI(
      String username, String email, String password, Date) async {
    final Uri url = Uri.parse(
        ApiRoutesBackend.signup); // Replace with your server's endpoint
    final Map<String, dynamic> body = {
      "email": email,
      "username": username,
      "password": password,
      "passwordConfirmation": password
    };
    print("3aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    print('asdaskjkbasdkb======$body');
    print('asdaskjkbasdkb======${jsonEncode(body)}');
    print("3aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    print('_________________________________');
    print('22222222222222222222$url');
    print('22222222222222222222${ApiRoutesBackend.signup}');
    try {
      final response = await http.post(
        url,
        body: jsonEncode(body),
        headers: {'Content-Type': 'application/json'},
      );
      print(response.statusCode);

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Sign-up successful
        print('Sign-up successful!');
      } else if (response.statusCode == 400) {
        // Error occurred
        print('Error: ${response.statusCode}');
        ;
      }
    } catch (e) {
      // Exception occurred
      print('Exception: $e');
    }
    print('_________________________________');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Signup"),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
              const Text(
                "Hi new friend, welcome to Fox",
                style: TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.w900,
                ),
                textAlign: TextAlign.center,
              ),
              const Gap(10),
              const Text(
                "Please enter your data to create your account",
                textAlign: TextAlign.center,
              ),
              const Gap(10),
              CustomTextBox(
                hintText: "Name",
                icon: FluentIcons.rename_28_regular,
                controller: nameController,
              ),
              const SizedBox(height: 20),
              TextField(
                decoration: const InputDecoration(
                    hintText: "Email",
                    prefixIcon: Icon(FluentIcons.mail_28_regular)),
                controller: emailController,
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 20),
              TextField(
                decoration: const InputDecoration(
                    hintText: "Password",
                    prefixIcon: Icon(
                      FluentIcons.password_24_regular,
                    )),
                controller: passwordController,
                obscureText: true,
                keyboardType: TextInputType.text,
              ),
              const SizedBox(height: 20),
              // CustomDatePicker(
              //   subTitle: "Birthdate",
              //   icon: FluentIcons.calendar_32_regular,
              //   currentDate: user.birthDate,
              //   onChanged: (e) {
              //     setState(() {
              //       user.birthDate = e;
              //     });
              //   },
              // ),
              const Gap(10),
              const Gap(10),
              CustomCheckBox(
                value: acceptTerms,
                text: "Accept terms and conditions",
                onChange: (bool x) {
                  setState(() {
                    acceptTerms = x;
                  });
                },
              ),
              if (errorMessage != null) Text(errorMessage!),
              const SizedBox(height: 40),
              CustomButton(
                text: "Create account",
                onTap: () {
                  setState(() {
                    errorMessage = signup(
                      emailController.text,
                      passwordController.text,
                      nameController.text,
                      user.birthDate,
                      acceptTerms,
                    );
                  });
                  if (errorMessage == null) {
                    Future.delayed(const Duration(seconds: 5), () {
                      Get.to(() => const LoginScreen());
                    });
                  }
                },
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}