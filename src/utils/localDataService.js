"use client";

// Default data if nothing exists in localStorage
const DEFAULT_USER_DATA = {
  profile: {
    id: 1,
    name: "Amin fradi",
    username: "@aminfradi",
    bio: "Software Engineer | React & Spring Boot Developer | Building social media experiences",
    location: "Tunisia",
    website: "github.com/mohamedaminefradi",
    birthday: "August 6th 2002",
    avatar: "https://avatars.githubusercontent.com/u/213040804?v=4"
  },
  stats: {
    posts: 2,
    comments: 34,
    likes: 89,
    followers: 155,
    following: 34
  },
  posts: [
    {
      id: 1,
      author: "Amin fradi",
      authorId: 1,
      minutesAgo: 45,
      content: "Just finished implementing the CRUD functionality for our social media app! #coding #react",
      likes: 12,
      dislikes: 0,
      tags: ["coding", "react"],
      commentCount: 3,
      comments: [
        {
          id: 1,
          author: "Jane",
          authorId: 2,
          content: "Great job!",
        },
        {
          id: 2,
          author: "Amin fradi",
          authorId: 1,
          content: "Thanks!",
        },
        {
          id: 3,
          author: "Mike",
          authorId: 3,
          content: "Can't wait to try it out!",
        },
      ],
    },
    {
      id: 2,
      author: "Amin fradi",
      authorId: 1,
      minutesAgo: 120,
      content: "Learning about component decomposition in React. Breaking down large components into smaller, reusable pieces makes code so much more maintainable!",
      likes: 8,
      dislikes: 1,
      tags: ["react", "bestpractices"],
      commentCount: 1,
      comments: [
        {
          id: 4,
          author: "Alex",
          authorId: 4,
          content: "Absolutely agree!",
        },
      ],
    },
  ],
  following: [
    { id: 2, name: "Jane Doe", username: "@janedoe" },
    { id: 3, name: "Mike Smith", username: "@mikesmith" },
    // ... more users
  ],
  followers: [
    { id: 2, name: "Jane Doe", username: "@janedoe" },
    { id: 3, name: "Mike Smith", username: "@mikesmith" },
    // ... more users (up to 155 in a real app)
  ]
};

// Helper to safely use localStorage (only on client side)
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }
};

// Initialize data in localStorage if it doesn't exist
const initializeLocalData = () => {
  if (!safeLocalStorage.getItem('userData')) {
    safeLocalStorage.setItem('userData', JSON.stringify(DEFAULT_USER_DATA));
  }
};

// Get user data from localStorage
const getUserData = () => {
  initializeLocalData();
  const data = safeLocalStorage.getItem('userData');
  return data ? JSON.parse(data) : DEFAULT_USER_DATA;
};

// Save user data to localStorage
const saveUserData = (userData) => {
  safeLocalStorage.setItem('userData', JSON.stringify(userData));
};

// Get user profile
export const getUserProfile = () => {
  return getUserData().profile;
};

// Get user stats
export const getUserStats = () => {
  return getUserData().stats;
};

// Get user posts
export const getUserPosts = () => {
  return getUserData().posts;
};

// Add a new post
export const addPost = (postContent) => {
  const userData = getUserData();
  
  const newPost = {
    id: Date.now(),
    author: userData.profile.name,
    authorId: userData.profile.id,
    minutesAgo: 0,
    content: postContent,
    likes: 0,
    dislikes: 0,
    commentCount: 0,
    tags: extractHashtags(postContent),
    comments: [],
  };
  
  userData.posts.unshift(newPost);
  userData.stats.posts += 1;
  
  saveUserData(userData);
  return newPost;
};

// Extract hashtags from post content
function extractHashtags(content) {
  const hashtagRegex = /#(\w+)/g;
  const matches = content.match(hashtagRegex);
  
  if (!matches) return [];
  
  return matches.map(tag => tag.substring(1));
}

// Edit a post
export const editPost = (postId, newContent) => {
  const userData = getUserData();
  
  userData.posts = userData.posts.map(post => 
    post.id === postId 
      ? { ...post, content: newContent, tags: extractHashtags(newContent) }
      : post
  );
  
  saveUserData(userData);
  return userData.posts.find(post => post.id === postId);
};

// Delete a post
export const deletePost = (postId) => {
  const userData = getUserData();
  
  userData.posts = userData.posts.filter(post => post.id !== postId);
  userData.stats.posts = userData.posts.length;
  
  saveUserData(userData);
  return true;
};

// Add a comment to a post
export const addComment = (postId, commentContent) => {
  const userData = getUserData();
  
  const newComment = {
    id: Date.now(),
    author: userData.profile.name,
    authorId: userData.profile.id,
    content: commentContent,
    minutesAgo: 0
  };
  
  userData.posts = userData.posts.map(post => {
    if (post.id === postId) {
      const comments = [...(post.comments || []), newComment];
      return {
        ...post,
        comments,
        commentCount: comments.length
      };
    }
    return post;
  });
  
  userData.stats.comments += 1;
  
  saveUserData(userData);
  return newComment;
};

// Edit a comment
export const editComment = (postId, commentId, newContent) => {
  const userData = getUserData();
  
  userData.posts = userData.posts.map(post => {
    if (post.id === postId) {
      const comments = post.comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: newContent }
          : comment
      );
      return { ...post, comments };
    }
    return post;
  });
  
  saveUserData(userData);
};

// Delete a comment
export const deleteComment = (postId, commentId) => {
  const userData = getUserData();
  
  userData.posts = userData.posts.map(post => {
    if (post.id === postId) {
      const comments = post.comments.filter(comment => comment.id !== commentId);
      return {
        ...post,
        comments,
        commentCount: comments.length
      };
    }
    return post;
  });
  
  userData.stats.comments -= 1;
  
  saveUserData(userData);
};

// Add reaction to post
export const addReaction = (postId, reactionType) => {
  const userData = getUserData();
  
  userData.posts = userData.posts.map(post => {
    if (post.id === postId) {
      if (reactionType === "like" || reactionType === "👍") {
        return { ...post, likes: post.likes + 1 };
      } else if (reactionType === "dislike" || reactionType === "👎") {
        return { ...post, dislikes: post.dislikes + 1 };
      }
    }
    return post;
  });
  
  if (reactionType === "like" || reactionType === "👍") {
    userData.stats.likes += 1;
  }
  
  saveUserData(userData);
};

// Update profile
export const updateProfile = (profileData) => {
  const userData = getUserData();
  userData.profile = { ...userData.profile, ...profileData };
  saveUserData(userData);
  return userData.profile;
};

// Follow a user
export const followUser = (userId, userData) => {
  const data = getUserData();
  
  // Check if not already following
  if (!data.following.some(user => user.id === userId)) {
    data.following.push(userData);
    data.stats.following += 1;
    saveUserData(data);
  }
  
  return data.stats.following;
};

// Unfollow a user
export const unfollowUser = (userId) => {
  const data = getUserData();
  
  data.following = data.following.filter(user => user.id !== userId);
  data.stats.following = data.following.length;
  
  saveUserData(data);
  return data.stats.following;
};

// Initialize data on import
initializeLocalData(); 