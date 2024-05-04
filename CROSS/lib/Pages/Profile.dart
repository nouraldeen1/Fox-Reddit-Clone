  import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
  import 'package:http/http.dart' as http;
  import 'dart:convert';
  import 'dart:typed_data';
  import 'package:intl/intl.dart';
  import 'package:reddit_fox/Pages/Search.dart';
  import 'package:reddit_fox/Pages/EditProfile.dart';
import 'package:reddit_fox/Pages/postViewForProfile.dart';
  import 'package:reddit_fox/navbar.dart';
  import 'package:reddit_fox/routes/Mock_routes.dart';
  import 'package:share/share.dart';
  import 'package:shared_preferences/shared_preferences.dart';


  class ProfilePage extends StatefulWidget {
    ProfilePage({Key? key, required this.userName, this.myProfile = false, this.access_token = null}) : super(key: key);
    final String userName;
    final bool myProfile;
    final String? access_token;

    @override
    _ProfilePageState createState() => _ProfilePageState();
  }

  class _ProfilePageState extends State<ProfilePage> with SingleTickerProviderStateMixin {
    late Map<String, dynamic> userData = {};
    late Map<String, dynamic> postData = {};
    late TabController _tabController;
    late bool _myProfile;
    late List<Map<String, dynamic>> userPosts = [];
    String? access_token;
    late String? userID;
    late String? profilePic = null;
    late String? userName = widget.userName;
    bool _showTitle = true;
    late String? created_at;
    List<dynamic> data = [];
    List<dynamic> posts = [];
    List<dynamic> userComments = [];
    

    @override
    void initState() {
      super.initState();
      _myProfile = widget.myProfile;
      _tabController = TabController(length: 3, vsync: this);
      access_token = widget.access_token;

      fetchUserAbout(widget.userName);
      fetchData();
      fetchDataBack();
      getUserComments();
    }

    @override
    void dispose() {
      _tabController.dispose();
      super.dispose();
    }


    Future<void> fetchUserAbout(String userName) async {
      var url = Uri.parse(ApiRoutesBackend.getUserAbout(userName));
      print("Token : $access_token");
      final response = await http.get(url);
      print("response statues code: ${response.statusCode}");
      try {
        if (response.statusCode == 200) {
          Map<String, dynamic> responseData = json.decode(response.body);
          print("Response Data: $responseData");
          if (responseData.containsKey('userID')) {
            setState(() {
              profilePic = responseData['avatar'];
              if (profilePic == 'default.jpg') {
                profilePic = null;
              }
              userID = responseData['userID'];
              // created_at = responseData['createdAt'];
              userName = responseData['email']; // Adjust username extraction here , Created at: $created_at
              print(
                  'User ID: $userID, Username: $userName, Profile Pic: $profilePic');
            });
          } else {
            throw Exception('User ID is not present in the response');
          }
        } else {
          throw Exception(
              'Failed to fetch user data, status code: ${response.statusCode}');
        }
      } catch (error) {
        print('Error fetching user data: $error');
        // Handle error, show error message, retry logic, etc.
      }
    }

    Future<void> fetchData() async {
      try {
        final response = await http.get(Uri.parse(ApiRoutesMockserver.getUserById(1)));
        if (response.statusCode == 200) {
          setState(() {
            postData = json.decode(response.body);
          });
        } else {
          throw Exception('Failed to load user data');
        }

        final postResponse = await http.get(Uri.parse(ApiRoutesMockserver.getPostsByCreatorId(widget.userName.toString())));
        if (postResponse.statusCode == 200) {
          setState(() {
            userPosts = json.decode(postResponse.body).cast<Map<String, dynamic>>();
          });
        } else {
          throw Exception('Failed to load user posts');
        }
      } catch (error) {
        print('Error fetching data: $error');
        // Handle error, show error message, retry logic, etc.
      }
    }


    Future<void> fetchDataBack() async {
      // Base URL and endpoint
      String baseUrl = 'http://foxnew.southafricanorth.cloudapp.azure.com';
      String endpoint = '/user/${widget.userName}/overview';

      // Query parameters
      // Map<String, String> queryParams = {
      //   'page': '1',
      //   'count': '5',
      //   'limit': '10',
      //   't': 'all'
      //   // Add any additional query parameters here if needed
      // };

      // Constructing URL with query parameters
      Uri uri = Uri.parse(baseUrl + endpoint); //.replace(queryParameters: queryParams);

      try {
        // Sending GET request with headers
        http.Response response = await http.get(
          uri,
          headers: {'Authorization': 'Bearer ${widget.access_token}'},
        );

        print("status code for fetchDataBack: ${response.statusCode}");

        if (response.statusCode == 200) {
          // Parsing response data
          Map<String, dynamic> responseData = jsonDecode(response.body);
          
          // Updating state with fetched data
          setState(() {
            posts = responseData['posts'];
          });
        } else {
          print('Request failed with status: ${response.statusCode}');
        }
      } catch (e) {
        print('Error fetching data: $e');
      }
    }



  Future<void> getUserComments() async {
    try{
      final commentResponse = await http.get(Uri.parse('http://foxnew.southafricanorth.cloudapp.azure.com/user/${widget.userName}/comments?page=1&count=5&limit=10&t=1'), headers: {'Authorization': 'Bearer $access_token'});
    print("status code for getUserComments: ${commentResponse.statusCode}");
    if (commentResponse.statusCode == 200) {
      setState(() {
        userComments = json.decode(commentResponse.body)['posts'].cast<Map<String, dynamic>>();
        print("user Comments : $userComments");
      });
    } else {
      throw Exception('Failed to load user comments');
    }
  } catch (error) {
    print('Error fetching data: $error');
    // Handle error, show error message, retry logic, etc.
  }
  }

  @override
    ImageProvider<Object> _getImageProvider(dynamic picture) {
      if (profilePic is String) {
        return NetworkImage(profilePic!);
      } else if (profilePic is Uint8List) {
        return MemoryImage(profilePic! as Uint8List);
      } else {
        return AssetImage('assets/images/avatar.png');
      }
    }

    String _formatDate(String? date) {
      if (date != null && date.isNotEmpty) {
        final parsedDate = DateTime.parse(date);
        return DateFormat.MMMd().add_y().format(parsedDate);
      }
      return ''; // Return an empty string if date is null or empty
    }

Widget _buildTitleView() {
  return CustomScrollView(
    slivers: <Widget>[
      SliverAppBar(
        pinned: true,
        backgroundColor: Colors.deepPurple,
        expandedHeight: 350,
        flexibleSpace: LayoutBuilder(
          builder: (context, constraints) {
             _showTitle = constraints.biggest.height <= 100;
            return FlexibleSpaceBar(
              title: userName != null  && _showTitle
                  ? Text(
                      userName!,
                      style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
                    )
                  : null,
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.deepPurple, Colors.black],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(top: 50, left: 10),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CircleAvatar(
                            radius: 50,
                            backgroundImage: _getImageProvider(profilePic ?? ''),
                            backgroundColor: Colors.black,
                          ),
                          Padding(
                            padding: const EdgeInsets.only(left: 10, top: 15),
                            child: SizedBox(
                              height: 40,
                              child: ElevatedButton(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (context) => EditProfilePage()),
                                  );
                                },
                                child: Text('Edit Profile'),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 20, top: 15),
                      child: Text(
                        '$userName',
                        style: TextStyle(
                          fontSize: 26,
                          color: Colors.grey[400],
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 20, top: 5),
                      child: Text(
                        'u/$userName • 1 karma • ', // ${_formatDate(created_at)}
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey[400],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
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
          IconButton(
            onPressed: () {
              Share.share('https://www.reddit.com/user/${widget.userName}/');
              print("it is pressed");
            },
            icon: Transform.scale(
              scale: 0.55,
              child: Image.asset('assets/Icons/share.png'),
            ),
          ),
        ],
      ),
      SliverToBoxAdapter(
        child: TabBar(
          controller: _tabController,
          tabs: [
            Tab(text: 'Posts'),
            Tab(text: 'Comments'),
            Tab(text: 'About'),
          ],
        ),
      ),
      SliverFillRemaining(
        child: TabBarView(
          controller: _tabController,
          children: [
            buildPostsContainer(),
            Container(), // Placeholder for Comments
            Container(), // Placeholder for About
          ],
        ),
      ),
    ],
  );
}

    Widget _buildAlternateView() {
      return CustomScrollView(
        slivers: <Widget>[
          SliverAppBar(
            pinned: true,
            backgroundColor: Colors.deepPurple,
            expandedHeight: 250,
            flexibleSpace: LayoutBuilder(
              builder: (context, constraints) {
                _showTitle = constraints.biggest.height <= 100;
                return FlexibleSpaceBar(
                  title: userName  != null && _showTitle
                      ? Text(
                          userName!,
                          style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
                        )
                      : null,
                  background: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.deepPurple, Colors.black],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                          Padding(
                          padding: const EdgeInsets.only(top: 80, left: 10),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              CircleAvatar(
                                radius: 50,
                                backgroundImage: _getImageProvider(profilePic ?? ''),
                                backgroundColor: Colors.black,
                              ),
                              
                              Row(
                                children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Padding(
                                        padding: const EdgeInsets.only(),
                                        child: Text(
                                          '$userName',
                                          style: TextStyle(
                                            fontSize: 26,
                                            color: Colors.grey[400],
                                          ),
                                        ),
                                      ),
                                      // ${_formatDate(userData['created_at'])}
                                      Padding(
                                        padding: const EdgeInsets.only(),
                                        child: Text(
                                          'u/$userName • 1 karma • ',
                                          style: TextStyle(
                                            fontSize: 16,
                                            color: Colors.grey[400],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.only(left: 50,),
                                      child: CircleAvatar(
                                        backgroundColor: Colors.transparent,
                                        radius: 50, // Increase the radius to increase the size of the CircleAvatar
                                        child: ElevatedButton(
                                          onPressed: () {},
                                          style: ElevatedButton.styleFrom(
                                            shape: CircleBorder(), // Make the ElevatedButton circular
                                          ),
                                          child: Image.asset(
                                            'assets/Icons/Chat.png',
                                            width: 32, // Set the width of the Image
                                            height: 32, // Set the height of the Image
                                          ),
                                        ),
                                      ),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.only(),
                                      child: SizedBox(
                                        height: 35,
                                        child: ElevatedButton(
                                          onPressed: () {
                                          },
                                          child: Text('Follow'),
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
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
              IconButton(
                onPressed: () {
                  Share.share('https://www.reddit.com/user//');
                  print("it is pressed");
                },
                icon: Transform.scale(
                  scale: 0.55,
                  child: Image.asset('assets/Icons/share.png'),
                ),
              ),
            ],
          ),
          SliverToBoxAdapter(
            child: TabBar(
              controller: _tabController,
              tabs: [
                Tab(text: 'Posts'),
                Tab(text: 'Comments'),
                Tab(text: 'About'),
              ],
            ),
          ),
          SliverFillRemaining(
            child: TabBarView(
              controller: _tabController,
              children: [
                buildPostsContainer(),
                Container(), // Placeholder for Comments
                Container(), // Placeholder for About
              ],
            ),
          ),
        ],
      );
    }

    Widget buildPostsContainer(){
      return CustomScrollView(
        slivers: [
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                return ClassicCard(post: posts[index]);
              },
              childCount: posts.length,
            ),
          ),
        ],
      );
    }

    @override
    Widget build(BuildContext context) {
      return Scaffold(
        body: postData.isEmpty
            ? Center(child: CircularProgressIndicator())
            : _myProfile
                ? _buildTitleView()
                : _buildAlternateView(),
        bottomNavigationBar: const nBar(),
      );
    }
  }