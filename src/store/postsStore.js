import { create } from 'zustand';

export const usePostsStore = create((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (updatedPost) => set((state) => ({
    posts: state.posts.map((post) => post.id === updatedPost.id ? updatedPost : post)
  })),
  removePost: (postId) => set((state) => ({
    posts: state.posts.filter((post) => post.id !== postId)
  })),
})); 