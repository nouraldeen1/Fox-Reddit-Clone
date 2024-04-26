import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:get/get_navigation/src/root/get_material_app.dart';
import 'package:reddit_fox/Pages/Spalsh_Screen.dart';
import 'package:reddit_fox/Pages/home/HomePage.dart';
import 'package:reddit_fox/Pages/messages.dart';
import 'package:reddit_fox/api/firebase_api.dart';
import 'package:reddit_fox/core/common/error_text.dart';
import 'package:reddit_fox/core/common/loader.dart';
import 'package:reddit_fox/features/auth/controller/auth_controller.dart';
import 'package:reddit_fox/features/auth/screens/login_screen.dart';
import 'package:reddit_fox/features/auth/screens/starting_screen.dart';
import 'package:reddit_fox/features/auth/screens/switch_screen.dart';
import 'package:reddit_fox/firebase_options.dart';
import 'package:reddit_fox/models/user_model.dart';
import 'package:reddit_fox/theme/pallete.dart';
import 'package:shared_preferences/shared_preferences.dart';

final navigatorKey = GlobalKey<NavigatorState>();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
    // DevicePreview(builder: (context) => const ProviderScope( child: MyApp(),),
  );
  await FirebaseApi().initNotifications();
  
  runApp(
    // DevicePreview(
    //   builder: (context) => const MyApp(),
    // ),
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends ConsumerStatefulWidget {
  const MyApp({super.key});

  @override
  ConsumerState<ConsumerStatefulWidget> createState() => _MyAppState();
}

class _MyAppState extends ConsumerState<MyApp> {
  UserModel? userModel;
  String? access_token;
  @override
  void initState() {
    super.initState();
    // Retrieve token from shared preferences when the widget initializes
    SharedPreferences.getInstance().then((sharedPrefValue) {
      setState(() {
        // Store the token in the access_token variable

        // saveToken('jessicatoken', "backtoken");
        // sharedPrefValue.remove('token');
        saveToken('jessicatoken', 'mocktoken');

        access_token = sharedPrefValue.getString('backtoken');

        print(access_token);
      });
    });
  }

  // void getData(WidgetRef ref, User data) async {
  //   userModel = await ref
  //       .watch(authControllerProvider.notifier)
  //       .getUserData(data.uid)
  //       .first;
  //   ref.read(userProvider.notifier).update((state) => userModel);
  //   //setState(() { });
  // }

  @override
  Widget build(BuildContext context) {
    return ref.watch(authStateChangeProvider).when(
          data: (data) => GetMaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'Fox App',
            theme: Pallete.darkModeAppTheme,
            home: (access_token == null)
                ? const StartingScreen()
                : const SplashScreen(),
            routes: {
              Message.route: (context) => const Message()
            },
//      locale: DevicePreview.locale(context),
            //    builder: DevicePreview.appBuilder,
          ),
          error: (error, stackTrace) => ErrorText(error: error.toString()),
          loading: () => const Loader(),
        );
  }
}


