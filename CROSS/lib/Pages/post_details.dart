/// This file contains the implementation of the `PostDetails` widget.
/// The `PostDetails` widget displays the details of a post, including the post title, creator information, image (if available), and various actions that can be performed on the post.
/// The widget also allows the user to toggle the blur effect on the image if the post is marked as NSFW (Not Safe for Work) or a spoiler.
/// Additionally, the widget provides functionality to download the image, view the creator's profile, and perform other actions such as saving, copying text, turning on captions, crossposting, reporting, blocking accounts, and hiding the post.
/// The widget is used within the Fox app to display the details of a post in multiple screens.
import 'dart:io';
import 'dart:ui';
import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:reddit_fox/Pages/Profile.dart';
import 'package:reddit_fox/Pages/home/endDrawer.dart';
import 'package:reddit_fox/routes/Mock_routes.dart';
import 'package:share/share.dart';
import 'package:http/http.dart' as http;
import 'package:permission_handler/permission_handler.dart';
import 'CommentSection.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PostDetails extends StatefulWidget {
  final Map<String, dynamic> post;

  const PostDetails({
    Key? key,
    required this.post,
  });

  @override
  _PostDetailsState createState() => _PostDetailsState();
}

enum VoteDirection { Up, Down }

class _PostDetailsState extends State<PostDetails> {
  String? access_token;
  bool isBlurred = false;
  int voteCount = 0; // State variable for vote count
  bool hasVoted = false; // Flag to track whether the user has voted
  VoteDirection voteDirection = VoteDirection.Up; // Default vote direction
  late String? profilePic; 

  @override
  void initState() {
    super.initState();
    isBlurred = (widget.post['nsfw'] || widget.post['spoiler']);
    voteCount = widget.post['votes'] ?? 0;
    hasVoted = widget.post['hasVoted'] ?? false;
    SharedPreferences.getInstance().then((sharedPrefValue) {
      setState(() {
        // Store the token in the access_token variable
        access_token = sharedPrefValue.getString('backtoken');
      });
    });
  }

Future<String> fetchUserProfilePic(String accessToken) async {
    var url = Uri.parse(ApiRoutesBackend.getUserByToken(accessToken));
    var response = await http.get(
      url,
      headers: {'Authorization': 'Bearer $accessToken'},
    );
    if (response.statusCode == 200) {
      Map<String, dynamic> responseData = json.decode(response.body);
      if (responseData.containsKey('user')) {
        Map<String, dynamic> user = responseData['user'];
        profilePic = user['avatar'];
        if (profilePic == 'default.jpg') {
          profilePic = null;
        }
        return profilePic!;
      } else {
        throw Exception('User pic is not present or not a string');
      }
    } else {
      throw Exception('Failed to fetch user pic');
    }
  }

  void vote(VoteDirection direction) {
    setState(() {
      if (voteDirection == direction && hasVoted) {
        // User clicks the same button, cancel the vote
        voteCount -= direction == VoteDirection.Up ? 1 : -1;
        hasVoted = false;
        voteDirection = VoteDirection.Up; // Reset vote direction
      } else {
        // User clicks a different button or hasn't voted yet
        if (hasVoted) {
          // Cancel the previous vote
          voteCount -= voteDirection == VoteDirection.Up ? 1 : -1;
        }
        // Apply the new vote
        voteCount += direction == VoteDirection.Up ? 1 : -1;
        hasVoted = true;
        voteDirection = direction; // Update vote direction
      }
      
      // Update the vote count and user's vote status in the backend
    });
    
  }

  void toggleBlur() {
    if (widget.post['nsfw'] || widget.post['spoiler']) {
      // Check if the post is NSFW or spoiler
      setState(() {
        isBlurred = !isBlurred; // Toggle blur if the post is NSFW
      });
    }
  }

  Future<void> _downloadImage(BuildContext context) async {
    // Check if permission is granted
    var status = await Permission.storage.status;
    if (status.isGranted) {
      _startDownload(context);
    } else {
      status = await Permission.storage.request();
      if (status.isGranted) {
        _startDownload(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Permission denied for image download"),
            duration: Duration(seconds: 2),
          ),
        );
      }
    }
  }

  void _startDownload(BuildContext context) async {
    try {
      Directory dir =
          Directory('/storage/emulated/0/fox'); // Updated directory path
      if (!dir.existsSync()) {
        dir.createSync(
            recursive: true); // Create the directory if it doesn't exist
      }

      String savePath = "${dir.path}/${widget.post['title']}.jpg";

      var response = await http.get(Uri.parse(widget.post['picture']!));
      if (response.statusCode == 200) {
        File file = File(savePath);
        await file.writeAsBytes(response.bodyBytes);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Image downloaded successfully"),
            duration: const Duration(seconds: 2),
          ),
        );
      } else {
        throw Exception("Failed to download image: ${response.statusCode}");
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Error downloading image: $e"),
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

// Define a function to show the bottom sheet
  void _showBottomMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.bookmark_outline),
              title: const Text("Save"),
              onTap: () {
                Navigator.pop(context); // Close the bottom sheet
                // Handle save action
              },
            ),
            ListTile(
              leading: const Icon(Icons.content_copy),
              title: const Text("Copy Text"),
              onTap: () {
                Navigator.pop(context); // Close the bottom sheet
                // Handle copy text action
              },
            ),
            ListTile(
              leading: const Icon(Icons.closed_caption),
              title: const Text("Turn on Captions"),
              onTap: () {
                Navigator.pop(context); // Close the bottom sheet
                // Handle turn on captions action
              },
            ),
            ListTile(
              leading: const Icon(Icons.call_split),
              title: const Text('Crosspost to community'),
              onTap: () {
                Navigator.pop(context); // Close the menu
                // Handle option
              },
            ),
            ListTile(
              leading: const Icon(Icons.image),
              title: const Text('Copy Image'),
              onTap: () {
                Navigator.pop(context); // Close the menu
                // Handle option
              },
            ),
            ListTile(
              leading: const Icon(Icons.download),
              title: const Text('Download Image'),
              onTap: () {
                Navigator.pop(context); // Close the menu
                if (widget.post['picture'] != null &&
                    widget.post['picture']!.isNotEmpty) {
                  _downloadImage(context); // Call the download image function
                }
              },
            ),
            ListTile(
              tileColor: Colors.transparent, // Transparent background
              onTap: () {
                Navigator.pop(context); // Close the menu
                // Handle option 1
              },
              leading: Icon(Icons.flag_outlined,
                  color: Colors.red.shade400), // Softer red icon
              title: Text(
                'Report',
                style: TextStyle(color: Colors.red.shade400), // Softer red text
              ),
            ),
            ListTile(
              tileColor: Colors.transparent, // Transparent background
              onTap: () {
                Navigator.pop(context); // Close the menu
                // Handle option 2
              },
              leading: Icon(Icons.person_off_outlined,
                  color: Colors.red.shade400), // Softer red icon
              title: Text(
                'Block account',
                style: TextStyle(color: Colors.red.shade400), // Softer red text
              ),
            ),
            ListTile(
              leading: const Icon(Icons.visibility_off),
              title: const Text('Hide'),
              onTap: () {
                Navigator.pop(context); // Close the menu
                // Handle option
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    double userWidth = MediaQuery.of(context).size.width * 0.7;
    return Scaffold(
      appBar: AppBar(
        leading: const CloseButton(),
        
        actions: [
          IconButton(
            icon: const Icon(Icons.more_horiz),
            
            onPressed: () {
              _showBottomMenu(context);
            },
          ),
          Builder(builder: (context) {
                  return IconButton(
                    icon: access_token != null
                        ? FutureBuilder(
                            future: fetchUserProfilePic(access_token!),
                            builder: (context, snapshot) {
                              if (snapshot.connectionState ==
                                  ConnectionState.waiting) {
                                return const CircularProgressIndicator();
                              } else if (snapshot.hasError) {
                                return const CircleAvatar(
                                  backgroundColor: Colors.transparent,
                                  backgroundImage:
                                      AssetImage('assets/images/avatar.png'),
                                );
                              } else {
                                if (snapshot.data == null ||
                                    snapshot.data.toString().isEmpty) {
                                  return const CircleAvatar(
                                    backgroundColor: Colors.transparent,
                                    backgroundImage:
                                        AssetImage('assets/images/avatar.png'),
                                  );
                                } else {
                                  return CircleAvatar(
                                    backgroundColor: Colors.transparent,
                                    backgroundImage:
                                        NetworkImage(snapshot.data.toString()),
                                  );
                                }
                              }
                            },
                          )
                        : const CircleAvatar(
                            backgroundImage:
                                AssetImage('assets/images/avatar.png'),
                          ),
                    onPressed: () {
                      Scaffold.of(context).openEndDrawer();
                    },
                  );
                }),
        ],
      ),
      endDrawer: endDrawer(
        user_width: userWidth,
        token: access_token,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const CircleAvatar(
                  radius: 16,
                  child: Icon(Icons.account_circle),
                ),
                const SizedBox(width: 8),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'r/Valorant',
                      style: TextStyle(
                        fontSize: 16,
                        color: Color(0xFFFFFFFF),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ProfilePage(
                              userName: 'omar',
                            ),
                          ),
                        );
                      },
                      child: Text(
                        'u/${widget.post['redditName']}',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            Text(
              widget.post['title'],
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            Row(
              children: [
                if (widget.post['nsfw'])
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    margin: const EdgeInsets.only(top: 4, right: 4),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text(
                      'NSFW',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                if (widget.post['spoiler'])
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    margin: const EdgeInsets.only(top: 4),
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(255, 137, 137, 137),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text(
                      'Spoiler',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
              ],
            ),

            const SizedBox(height: 8),

            if (widget.post['picture'] != null &&
                widget.post['picture']!.isNotEmpty)
              // Wrap GestureDetector around ClipRRect
              GestureDetector(
                onTap: toggleBlur, // Toggle the blur filter on tap
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(
                      10), // Adjust border radius as needed
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Image without blur effect
                      Image.network(
                        widget.post['picture']!,
                        width: double.infinity,
                        height: 400,
                        fit: BoxFit.cover,
                        color: isBlurred
                            ? const Color.fromARGB(0, 158, 158, 158)
                            : null,
                        colorBlendMode:
                            isBlurred ? BlendMode.saturation : BlendMode.dst,
                      ),
                      if (isBlurred)
                        // Blur effect with BackdropFilter
                        BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                          child: Container(
                            color: const Color.fromARGB(0, 0, 0, 0)
                                .withOpacity(0), // Transparent color
                            width: double.infinity,
                            height: 400,
                          ),
                        ),
                      if (isBlurred)
                        const Column(
                          children: [
                            Icon(Icons.remove_red_eye,
                                size: 40,
                                color: Colors.white), // Icon to indicate blur
                            Text(
                              'Click to view',
                              style:
                                  TextStyle(color: Colors.white, fontSize: 12),
                            ),
                          ],
                        ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: () {
                if (widget.post['nsfw'] || widget.post['spoiler']) {
                  // Check if the post is NSFW or spoiler
                  setState(() {
                    isBlurred = !isBlurred; // Toggle blur if the post is NSFW
                  });
                }
              },
              child: Container(
                decoration: BoxDecoration(
                  color: isBlurred ? Colors.white : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  widget.post['description'],
                  style: TextStyle(
                    fontSize: 16,
                    color: isBlurred ? Colors.transparent : Colors.white,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 8), // Space between description and actions

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    ConstrainedBox(
                      constraints:
                          const BoxConstraints.tightFor(width: 35, height: 38),
                      child: IconButton(
                        icon: AnimatedSwitcher(
                            duration: const Duration(milliseconds: 200),
                            child: hasVoted && voteDirection == VoteDirection.Up
                                ? Image.asset(
                                    'assets/Icons/up vote.png',
                                    key: UniqueKey(),
                                    width: 32,
                                    height: 32,
                                  )
                                : Image.asset(
                                    'assets/Icons/arrow-up.png',
                                    key: UniqueKey(),
                                    width: 32,
                                    height: 32,
                                  )),
                        onPressed: () => vote(VoteDirection.Up),
                      ),
                    ),
                    Text(
                      "${voteCount.abs()}",
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    ConstrainedBox(
                      constraints: const BoxConstraints.tightFor(
                          width: 35, height: 38), // Set a fixed size
                      child: IconButton(
                        icon: AnimatedSwitcher(
                            duration: const Duration(milliseconds: 200),
                            child:
                                hasVoted && voteDirection == VoteDirection.Down
                                    ? Image.asset(
                                        'assets/Icons/down vote.png',
                                        key: UniqueKey(),
                                        width: 32,
                                        height: 32,
                                      )
                                    : Image.asset(
                                        'assets/Icons/arrow-down.png',
                                        key: UniqueKey(),
                                        width: 32,
                                        height: 32,
                                      )),
                        onPressed: () => vote(VoteDirection.Down),
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 50),
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        child: Row(
                          children: [
                            ConstrainedBox(
                                constraints: const BoxConstraints.tightFor(
                                    width: 28, height: 28), // Set a fixed size
                                child: Image.asset('assets/Icons/comment.png')),
                            Padding(
                              padding:
                                  const EdgeInsets.only(left: 4.0, right: 4.0),
                              child: Text(
                                "${widget.post['commentsNo']} Comments",
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 50),
                      IconButton(
                        icon: Transform(
                          alignment: Alignment.center,
                          transform: Matrix4.rotationY(
                              3.14), // Flips the icon horizontally
                          child: const Icon(Icons.reply),
                        ),
                        onPressed: () {
                          int postId = widget.post['id'];
                          String postUrl =
                              'https://icy-desert-094269b03.5.azurestaticapps.net/posts/$postId';
                          Share.share('${widget.post['title']}\n$postUrl');
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            CommentSection(
              postId: "${widget.post['id']}",
            ),
          ],
        ),
      ),
    );
  }
}