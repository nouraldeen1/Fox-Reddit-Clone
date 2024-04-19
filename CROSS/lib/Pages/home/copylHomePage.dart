import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:reddit_fox/Pages/Search.dart';
import 'package:reddit_fox/Pages/home/Drawer.dart';
import 'package:reddit_fox/Pages/home/endDrawer.dart';
import 'package:reddit_fox/navbar.dart';
import 'dart:convert';

import 'package:reddit_fox/routes/Mock_routes.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:reddit_fox/Pages/post_details.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String _dropdownValue = 'Top';

  String? access_token;
  @override
  void initState() {
    super.initState();
    // Retrieve token from shared preferences when the widget initializes
    SharedPreferences.getInstance().then((sharedPrefValue) {
      setState(() {
        // Store the token in the access_token variable
        access_token = sharedPrefValue.getString('mocktoken');
      });
    });
  } // Declare _selectedItem here

  Future<List<dynamic>> fetchPosts() async {
    var url =
        Uri.parse("${ApiRoutesMockserver.baseUrl}/${_dropdownValue}Posts");
    var response = await http.get(url);
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load posts');
    }
  }

  @override
  Widget build(BuildContext context) {
    double drawerWidth = MediaQuery.of(context).size.width * 0.8;
    double userWidth = MediaQuery.of(context).size.width * 0.7;
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
          backgroundColor: Colors.black,
          iconTheme: const IconThemeData(color: Colors.white),
          leading: Builder(builder: (context) {
            return IconButton(
              icon: const Icon(Icons.menu),
              onPressed: () {
                Scaffold.of(context).openDrawer();
              },
            );
          }),
          actions: [
            IconButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const Search()),
                );
              },
              icon: const Icon(Icons.search),
            ),
            Builder(builder: (context) {
              return IconButton(
                icon: const CircleAvatar(),
                onPressed: () {
                  Scaffold.of(context).openEndDrawer();
                },
              );
            }),
          ],
          // title: PopupMenuButton<String>(
          //   icon: Text(_selectedItem),
          //   initialValue: _selectedItem,
          //   itemBuilder: (context) => [
          //     const PopupMenuItem(
          //       value: "Home",
          //       child: Text("Home"),
          //     ),
          //     const PopupMenuItem(
          //       value: "Popular",
          //       child: Text("Popular"),
          //     ),
          //   ],
          //   onSelected: (value) {
          //     setState(() {
          //       _selectedItem = value; // Use _selectedItem from the state class
          //     });
          //   },
          // ),
          title: DropdownButton<String>(
            // value: "asda",
            hint: Text(_dropdownValue),
            items: const [
              DropdownMenuItem(
                value: 'Best',
                child: Text('Best'),
              ),
              DropdownMenuItem(
                value: 'Hot',
                child: Text('Hot'),
              ),
              DropdownMenuItem(
                value: 'New',
                child: Text('New'),
              ),
              DropdownMenuItem(
                value: 'Top',
                child: Text('Top'),
              ),
            ],
            onChanged: (String? value) {
              setState(() {
                _dropdownValue = value!;
              });
            },
          )),
      drawer: CustomDrawer(
        drawer_Width: drawerWidth,
      ),
      endDrawer: endDrawer(
        user_width: userWidth,
        token: access_token,
      ),
      bottomNavigationBar: const nBar(),
      body: FutureBuilder<List<dynamic>>(
        future: fetchPosts(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(), // Show a loading indicator
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Text(
                  'Error: ${snapshot.error}'), // Show an error message if loading fails
            );
          } else {
            List<dynamic> posts = snapshot.data!;
            return ListView.builder(
              itemCount: posts.length,
              itemBuilder: (context, index) {
                var post = posts[index];
                return Column(
                  children: [
                    ListTile(
                      contentPadding: const EdgeInsets.all(16),
                      title: Text(
                        post['redditName'],
                        style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold), // Increase font size
                      ),
                      subtitle: Text(
                        post['title'],
                        style:
                            const TextStyle(fontSize: 16), // Increase font size
                      ),
                                                 trailing: post['picture'] != null && post['nsfw']
                                  ? ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: Container(
                                        width: 100,
                                        height: 250,
                                        child: BackdropFilter(
                                          filter: ImageFilter.blur(
                                              sigmaX: 10,
                                              sigmaY:
                                                  10), // Adjust blur intensity as needed
                                          child: Container(
                                            color: Color.fromARGB(0, 0, 0, 0)
                                                .withOpacity(
                                                    0), // Adjust opacity for blur effect
                                            child: Image.network(
                                              post['picture'],
                                              width: 100,
                                              height: 250,
                                              fit: BoxFit.cover,
                                              colorBlendMode:
                                                  BlendMode.saturation,
                                            ),
                                          ),
                                        ),
                                      ),
                                    )
                                  : post['picture'] != null
                                      ? Image.network(
                                          post['picture'],
                                          width: 100,
                                          height: 250,
                                          fit: BoxFit.cover,
                                        )
                                      : null,
                      onTap: () {
                        // Navigate to post details page
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => PostDetails(
                              redditName: post['redditName'],
                              title: post['title'],
                              picture: post['picture'],
                              votes: post['votes'],
                              commentsNo: post['commentsNo'],
                              creatorId: post['creatorId'],
                              postId: post['id'],
                              nsfw: post['nsfw'],
                              description: post['description'],
                            ),
                          ),
                        );
                      },
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_upward),
                          onPressed: () {
                            // Implement upvote logic here
                          },
                        ),
                        Text(post['votes']
                            .toString()), // Display the total number of votes
                        IconButton(
                          icon: const Icon(Icons.arrow_upward),
                          onPressed: () {
                            // Implement downvote logic here
                          },
                        ),
                      ],
                    ),
                  ],
                );
              },
            );
          }
        },
      ),
    );
  }
}