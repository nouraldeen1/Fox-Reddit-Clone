import 'package:flutter/material.dart';
import 'CreateCommmentsPage.dart';

class PostDetails extends StatelessWidget {
  final String redditName;
  final String title;
  final String picture;

  const PostDetails({
    Key? key,
    required this.redditName,
    required this.title,
    this.picture = '',
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Post Details"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Display the author's avatar and username
              Row(
                children: [
                  _buildAvatarIcon(),
                  const SizedBox(width: 8),
                  Text(
                    redditName,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              // Display the post title
              Text(
                title,
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),

              // Display the post image
              if (picture != null)
                Image.network(
                  picture!,
                  width: double.infinity,
                  height: 400,
                  fit: BoxFit.cover,
                )
              else
                // Display a placeholder image
                Container(
                  width: double.infinity,
                  height: 400,
                  color: Colors.grey[300],
                  child: Center(
                    child: Icon(
                      Icons.image,
                      size: 100,
                      color: Colors.grey[600],
                    ),
                  ),
                ),

              const SizedBox(height: 16),
              // Display the post actions (e.g., reply, upvote, downvote)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Display the reply, upvote, and downvote buttons
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.reply),
                        onPressed: () {},
                      ),
                      IconButton(
                        icon: const Icon(Icons.arrow_upward),
                        onPressed: () {},
                      ),
                      const Text("100"),
                      IconButton(
                        icon: const Icon(Icons.arrow_downward),
                        onPressed: () {},
                      ),
                    ],
                  ),
                  // Display the comment count and share button
                  Expanded(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text("50 Comments"),
                        const SizedBox(width: 8),
                        IconButton(
                          icon: const Icon(Icons.share),
                          onPressed: () {
                            _showBottomMenu(context);
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              // Display the comments section title
              const Text(
                "Comments",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              // Display the first comment
              _buildComment(
                username: "User1",
                pfp: "",
                content: "This is a comment.",
                upvotes: 10,
                downvotes: 5,
                context: context,
                comments: [
                  "Reply 1",
                  "Reply 2",
                ],
              ),
              // Display the second comment
              _buildComment(
                username: "User2",
                pfp: "",
                content: "Another comment here.",
                upvotes: 15,
                downvotes: 3,
                context: context,
                comments: [
                  "Comment A",
                  "Comment B",
                ],
              ),
              const SizedBox(height: 16),
              // Display the "Add a Comment" section title
              const Text(
                "Add a Comment",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              // Display the new comment field
              _buildNewCommentField(context),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  /// Builds the avatar icon widget.
  Widget _buildAvatarIcon() {
    return const CircleAvatar(
      radius: 16,
      child: Icon(Icons.account_circle),
    );
  }

  /// Builds a comment widget.
  Widget _buildComment({
    required String username,
    required String pfp,
    required String content,
    required int upvotes,
    required int downvotes,
    required BuildContext context,
    required List<String> comments,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Display the comment author's avatar and username
        Row(
          children: [
            _buildAvatarIcon(),
            const SizedBox(width: 8),
            Text(
              username,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 8),
        // Display the comment content
        Text(
          content,
          style: const TextStyle(fontSize: 16),
        ),
        const SizedBox(height: 8),
        // Display the comment actions (e.g., upvote, downvote, reply, share)
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(
              icon: const Icon(Icons.arrow_upward),
              onPressed: () {},
            ),
            Text(upvotes.toString()),
            IconButton(
              icon: const Icon(Icons.arrow_downward),
              onPressed: () {},
            ),
            IconButton(
              icon: const Icon(Icons.reply),
              onPressed: () {},
            ),
            IconButton(
              icon: const Icon(Icons.share),
              onPressed: () {
                _showBottomMenu(context);
              },
            ),
          ],
        ),
        const SizedBox(height: 8),
        // Display the comment's replies
        ...comments.map((comment) => _buildCommentWidget(comment)),
        const SizedBox(height: 8),
      ],
    );
  }

  /// Builds a comment widget for a reply.
  Widget _buildCommentWidget(String comment) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32.0),
      child: Row(
        children: [
          const SizedBox(width: 24),
          Text(
            comment,
            style: const TextStyle(fontSize: 14, fontStyle: FontStyle.italic),
          ),
        ],
      ),
    );
  }

  /// Builds the new comment field widget.
  Widget _buildNewCommentField(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const CreateCommentsPage(),
          ),
        );
      },
      child: Row(
        children: [
          const Expanded(
            child: TextField(
              decoration: InputDecoration(
                hintText: "Write a comment...",
                border: InputBorder.none,
              ),
              maxLines: null,
              keyboardType: TextInputType.multiline,
            ),
          ),
          IconButton(
            icon: const Icon(Icons.send),
            onPressed: () {},
          ),
        ],
      ),
    );
  }

  /// Shows the bottom menu modal sheet.
  void _showBottomMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Display the menu items
            _buildMenuItem(context, Icons.share, "Share"),
            _buildMenuItem(context, Icons.save, "Save"),
            _buildMenuItem(
              context,
              Icons.notifications,
              "Get Reply Notification",
            ),
            _buildMenuItem(context, Icons.copy, "Copy Text"),
            _buildMenuItem(context, Icons.close_fullscreen, "Collapse Thread"),
            _buildMenuItem(context, Icons.person_off, "Block Account"),
            _buildMenuItem(context, Icons.flag, "Report"),
          ],
        );
      },
    );
  }

  /// Builds a menu item widget.
  Widget _buildMenuItem(BuildContext context, IconData icon, String label) {
    return ListTile(
      leading: Icon(icon),
      title: Text(label),
      onTap: () {
        Navigator.pop(context);
      },
    );
  }
}
