// import 'dart:ui';
// import 'package:flutter/material.dart';
// import 'package:reddit_fox/Pages/home/Post%20widgets/VoteSection.dart';
// import 'package:reddit_fox/Pages/home/Post%20widgets/cardCoreWidget.dart';
// import 'package:reddit_fox/Pages/post_details.dart';
// import 'pollWidget.dart';

// /// A stateful widget that represents a post card in the home page.
// class ModernCard extends StatefulWidget {
//   final Map<String, dynamic> post;

//   /// Constructs a [ModernCard] widget.
//   ///
//   /// The [post] parameter is required and contains the data for the post.
//   const ModernCard({
//     super.key,
//     required this.post,
//   });

//   @override
//   _ModernCardState createState() => _ModernCardState();
// }

// class _ModernCardState extends State<ModernCard> {
//   @override
//   void initState() {
//     super.initState();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return GestureDetector(
//       onTap: () {
//         // Navigator.push(
//         //   context,
//         //   MaterialPageRoute(
//         //     builder: (context) => Map<dynamic, dynamic>(
//         //       post: widget.post,
//         //     ),
//         //   ),
//         // );
//       },
//       child: Padding(
//         padding: const EdgeInsets.all(5),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             Row(
//               children: [
//                 Row(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     const CircleAvatar(
//                       radius: 18,
//                       child: Icon(Icons.account_circle),
//                     ),
//                     const SizedBox(width: 8),
//                     Column(
//                       crossAxisAlignment: CrossAxisAlignment.start,
//                       children: [
//                         Text(
//                           widget.post["communityName"],
//                           style: const TextStyle(
//                             fontSize: 20,
//                             color: Color(0xFFFFFFFF),
//                           ),
//                         ),
//                       ],
//                     ),
//                   ],
//                 ),
//                 const Spacer(),
//                 IconButton(
//                   icon: const Icon(Icons.more_vert), // Menu icon
//                   onPressed: () {
//                     showModalBottomSheet(
//                       context: context,
//                       builder: (BuildContext context) {
//                         return Column(
//                           mainAxisSize: MainAxisSize.min,
//                           children: [
//                             ListTile(
//                               leading: const Icon(Icons.bookmark),
//                               title: const Text('Save'),
//                               onTap: () {
//                                 Navigator.pop(context); // Close the menu
//                                 // Handle option 1
//                               },
//                             ),
//                             ListTile(
//                               leading: const Icon(Icons.content_copy),
//                               title: const Text('Copy text'),
//                               onTap: () {
//                                 Navigator.pop(context); // Close the menu
//                                 // Handle option 2
//                               },
//                             ),
//                             ListTile(
//                               leading: const Icon(Icons.call_split),
//                               title: const Text('Crosspost to community'),
//                               onTap: () {
//                                 Navigator.pop(context); // Close the menu
//                                 // Handle option 1
//                               },
//                             ),
//                             ListTile(
//                               tileColor:
//                                   Colors.transparent, // Transparent background
//                               onTap: () {
//                                 Navigator.pop(context); // Close the menu
//                                 // Handle option 1
//                               },
//                               leading: Icon(Icons.flag_outlined,
//                                   color:
//                                       Colors.red.shade400), // Softer red icon
//                               title: Text(
//                                 'Report',
//                                 style: TextStyle(
//                                     color:
//                                         Colors.red.shade400), // Softer red text
//                               ),
//                             ),
//                             ListTile(
//                               tileColor:
//                                   Colors.transparent, // Transparent background
//                               onTap: () {
//                                 Navigator.pop(context); // Close the menu
//                                 // Handle option 2
//                               },
//                               leading: Icon(Icons.person_off_outlined,
//                                   color:
//                                       Colors.red.shade400), // Softer red icon
//                               title: Text(
//                                 'Block account',
//                                 style: TextStyle(
//                                     color:
//                                         Colors.red.shade400), // Softer red text
//                               ),
//                             ),
//                             ListTile(
//                               leading:
//                                   const Icon(Icons.visibility_off_outlined),
//                               title: const Text('Hide'),
//                               onTap: () {
//                                 Navigator.pop(context); // Close the menu
//                                 // Handle option 1
//                               },
//                             ),
//                           ],
//                         );
//                       },
//                     );
//                   },
//                 ),
//               ],
//             ),
//             // cardCoreWidget(post: widget.post, detailsPageOpen: false),
//             // VoteSection(post: widget.post),
//             const Divider(
//                 height: 1,
//                 color: Color.fromARGB(255, 44, 43, 43),
//                 thickness: 1,
//                 indent: 1,
//                 endIndent: 1),
//           ],
//         ),
//       ),
//     );
//   }
// }
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get_navigation/get_navigation.dart';
import 'package:reddit_fox/Pages/home/Post%20widgets/VoteSection.dart';
import 'package:reddit_fox/Pages/home/Post%20widgets/cardCoreWidget.dart';
import 'package:reddit_fox/Pages/post_details.dart';
import 'package:reddit_fox/core/common/CustomButton.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// A stateful widget that represents a post card in the home page.
class ModernCard extends StatefulWidget {
  final Map<dynamic, dynamic> post;
  bool currentuserpost = true;

  /// Constructs a [ModernCard] widget.
  ///
  /// The [post] parameter is required and contains the data for the post.
  ModernCard({
    super.key,
    required this.post,
  });

  @override
  _ModernCardState createState() => _ModernCardState();
}

class _ModernCardState extends State<ModernCard> {
  @override
  void initState() {
    super.initState();
    SharedPreferences.getInstance().then((sharedPrefValue) {
      setState(() {
        // Store the token in the access_token variable
        if (widget.post['userID'] == sharedPrefValue.getString('userid')) {
          widget.currentuserpost = true;
        }
      });
    });
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => PostDetails(
              post: widget.post,
            ),
          ),
        );
      },
      child: Padding(
        padding: const EdgeInsets.all(5),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CircleAvatar(
                      radius: 18,
                      child: Icon(Icons.account_circle),
                    ),
                    SizedBox(width: 8),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'r/Valorant',
                          style: TextStyle(
                            fontSize: 20,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.more_vert), // Menu icon
                  onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      builder: (BuildContext context) {
                        return Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            ListTile(
                              leading: const Icon(Icons.bookmark),
                              title: const Text('Save'),
                              onTap: () {
                                Navigator.pop(context); // Close the menu
                                // Handle option 1
                              },
                            ),
                            Visibility(
                              visible: widget.currentuserpost,
                              child: ListTile(
                                leading: const Icon(Icons.edit_document),
                                title: const Text('Edit'),
                                onTap: () {
                                  showDialog(
                                      context: context,
                                      builder: (BuildContext context) {
                                        return AlertDialog(
                                          backgroundColor: Colors.black87,
                                          surfaceTintColor: Colors.black54,
                                          content: SingleChildScrollView(
                                            child: SizedBox(
                                              width: MediaQuery.of(context)
                                                  .size
                                                  .width,
                                              height: MediaQuery.of(context)
                                                      .size
                                                      .height *
                                                  0.8,
                                              child: Column(
                                                children: [
                                                  TextField(
                                                    decoration: InputDecoration(
                                                      suffixIconColor:
                                                          Colors.white,
                                                      prefixIconColor:
                                                          Colors.white,
                                                      fillColor:
                                                          const Color.fromARGB(
                                                              255, 18, 16, 15),
                                                      border:
                                                          OutlineInputBorder(
                                                              borderRadius:
                                                                  BorderRadius
                                                                      .circular(
                                                                          15)),

                                                      filled: true,
                                                      // fillColor: Color.fromARGB(
                                                      //     255, 50, 43, 50),
                                                    ),
                                                    maxLines: 15,
                                                  ),
                                                  const Spacer(),
                                                  Row(
                                                    children: [
                                                      Textbuttoncontainer(
                                                          text: 'Cancel',
                                                          color: const Color(
                                                              0xFFB02F00),
                                                          onPressed: () {
                                                            Navigator.pop(
                                                                context);
                                                          }),
                                                      const Spacer(),
                                                      Textbuttoncontainer(
                                                          text: 'Change',
                                                          color: const Color(
                                                              0xFFB02F00),
                                                          onPressed: () {}),
                                                    ],
                                                  )
                                                ],
                                              ),
                                            ),
                                          ),
                                        );
                                      }); // Close the menu
                                  // Handle option 1
                                },
                              ),
                            ),
                            ListTile(
                              leading: const Icon(Icons.content_copy),
                              title: const Text('Copy text'),
                              onTap: () {
                                Navigator.pop(context); // Close the menu
                                // Handle option 2
                              },
                            ),
                            ListTile(
                              leading: const Icon(Icons.call_split),
                              title: const Text('Crosspost to community'),
                              onTap: () {
                                Navigator.pop(context); // Close the menu
                                // Handle option 1
                              },
                            ),
                            ListTile(
                              tileColor:
                                  Colors.transparent, // Transparent background
                              onTap: () {
                                Navigator.pop(context); // Close the menu
                                // Handle option 1
                              },
                              leading: Icon(Icons.flag_outlined,
                                  color:
                                      Colors.red.shade400), // Softer red icon
                              title: Text(
                                'Report',
                                style: TextStyle(
                                    color:
                                        Colors.red.shade400), // Softer red text
                              ),
                            ),
                            ListTile(
                              tileColor:
                                  Colors.transparent, // Transparent background
                              onTap: () {
                                Navigator.pop(context); // Close the menu
                                // Handle option 2
                              },
                              leading: Icon(Icons.person_off_outlined,
                                  color:
                                      Colors.red.shade400), // Softer red icon
                              title: Text(
                                'Block account',
                                style: TextStyle(
                                    color:
                                        Colors.red.shade400), // Softer red text
                              ),
                            ),
                            ListTile(
                              leading:
                                  const Icon(Icons.visibility_off_outlined),
                              title: const Text('Hide'),
                              onTap: () {
                                Navigator.pop(context); // Close the menu
                                // Handle option 1
                              },
                            ),
                          ],
                        );
                      },
                    );
                  },
                ),
              ],
            ),
            cardCoreWidget(post: widget.post, detailsPageOpen: false),
            VoteSection(post: widget.post),
            const Divider(
                height: 1,
                color: Color.fromARGB(255, 44, 43, 43),
                thickness: 1,
                indent: 1,
                endIndent: 1),
          ],
        ),
      ),
    );
  }
}