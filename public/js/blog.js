
// Blog data structure
let blogPosts = [];
let currentEditId = null;

// Initialize the blog application
function initializeBlog(container) {
  // Check for saved posts in localStorage
  const savedPosts = localStorage.getItem('blogPosts');
  
  if (savedPosts) {
    blogPosts = JSON.parse(savedPosts);
  } else {
    // Sample posts for demo
    blogPosts = [
      {
        id: '1',
        title: 'Getting Started with Web Development',
        content: '<p>Web development is an exciting field that combines creativity and technical skills. In this post, we will explore the basics of HTML, CSS, and JavaScript.</p><p>These three technologies form the foundation of modern web development.</p>',
        author: 'John Doe',
        category: 'Technology',
        tags: ['HTML', 'CSS', 'JavaScript'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        likes: 5,
        comments: [
          {
            id: '1',
            author: 'Jane Smith',
            content: 'Great introduction to web development!',
            createdAt: new Date(Date.now() - 43200000).toISOString(),
            likes: 2
          }
        ]
      },
      {
        id: '2',
        title: 'CSS Styling Tips and Tricks',
        content: '<p>CSS is powerful for styling web pages. Here are some tips and tricks to make your designs stand out.</p><p>Learn about flexbox, grid, and responsive design principles.</p>',
        author: 'Sarah Johnson',
        category: 'Design',
        tags: ['CSS', 'Design', 'Web'],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        likes: 10,
        comments: []
      }
    ];
    
    // Save to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  }
  
  // Render the blog interface
  renderBlog(container);
}

// Render the entire blog interface
function renderBlog(container) {
  container.innerHTML = `
    <header class="blog-header">
      <h1>Simple Blog Platform</h1>
      <div class="search-container">
        <input type="text" id="search-input" placeholder="Search posts...">
        <button id="search-button">Search</button>
      </div>
    </header>
    
    <div class="blog-controls">
      <button id="new-post-btn" class="primary-button">Create New Post</button>
      <div class="category-filter">
        <label>Filter by category:</label>
        <select id="category-filter">
          <option value="">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Design">Design</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Business">Business</option>
        </select>
      </div>
    </div>
    
    <div id="editor-container" class="editor-container hidden">
      <h2 id="editor-title">Create New Post</h2>
      <form id="post-form">
        <div class="form-group">
          <label for="post-title">Title:</label>
          <input type="text" id="post-title" required>
        </div>
        
        <div class="form-group">
          <label for="post-category">Category:</label>
          <select id="post-category">
            <option value="Technology">Technology</option>
            <option value="Design">Design</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Business">Business</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="post-tags">Tags (comma separated):</label>
          <input type="text" id="post-tags">
        </div>
        
        <div class="form-group">
          <label for="post-content">Content:</label>
          <div id="rich-editor-toolbar">
            <button type="button" data-action="bold"><b>B</b></button>
            <button type="button" data-action="italic"><i>I</i></button>
            <button type="button" data-action="underline"><u>U</u></button>
            <button type="button" data-action="insertImage">Image</button>
          </div>
          <div id="rich-editor-content" contenteditable="true"></div>
        </div>
        
        <div class="form-actions">
          <button type="submit" id="save-post-btn" class="primary-button">Save Post</button>
          <button type="button" id="cancel-edit-btn">Cancel</button>
        </div>
      </form>
    </div>
    
    <div id="post-detail" class="post-detail hidden"></div>
    
    <div id="posts-container" class="posts-container"></div>
  `;
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Render all posts
  renderPosts();
}

// Render all blog posts
function renderPosts(filteredPosts = null) {
  const postsContainer = document.getElementById('posts-container');
  const postsToRender = filteredPosts || blogPosts;
  
  if (postsToRender.length === 0) {
    postsContainer.innerHTML = '<p class="no-posts">No posts found.</p>';
    return;
  }
  
  postsContainer.innerHTML = '';
  
  postsToRender.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    postElement.dataset.id = post.id;
    
    // Create excerpt from content (first 150 chars)
    const excerpt = stripHtml(post.content).substring(0, 150) + '...';
    
    // Format date
    const date = new Date(post.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    postElement.innerHTML = `
      <h2>${post.title}</h2>
      <div class="post-meta">
        <span class="post-date">${formattedDate}</span>
        <span class="post-author">by ${post.author || 'Anonymous'}</span>
      </div>
      <div class="post-category">
        <span class="category-badge">${post.category}</span>
      </div>
      <div class="post-excerpt">${excerpt}</div>
      <div class="post-tags">
        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="post-engagement">
        <span class="likes">
          <button class="like-button" data-id="${post.id}">
            <span class="heart-icon">❤</span>
            <span class="like-count">${post.likes}</span>
          </button>
        </span>
        <span class="comments-count">${post.comments.length} comments</span>
      </div>
      <div class="post-actions">
        <button class="read-more-btn" data-id="${post.id}">Read More</button>
        <button class="edit-post-btn" data-id="${post.id}">Edit</button>
        <button class="delete-post-btn" data-id="${post.id}">Delete</button>
      </div>
    `;
    
    postsContainer.appendChild(postElement);
  });
}

// Initialize all event listeners for the blog
function initializeEventListeners() {
  // Search functionality
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  
  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm.trim() === '') {
      renderPosts();
      return;
    }
    
    const results = blogPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) || 
      stripHtml(post.content).toLowerCase().includes(searchTerm)
    );
    
    renderPosts(results);
  });
  
  // Category filter
  const categoryFilter = document.getElementById('category-filter');
  categoryFilter.addEventListener('change', () => {
    const category = categoryFilter.value;
    if (category === '') {
      renderPosts();
      return;
    }
    
    const results = blogPosts.filter(post => post.category === category);
    renderPosts(results);
  });
  
  // New post button
  const newPostBtn = document.getElementById('new-post-btn');
  newPostBtn.addEventListener('click', () => {
    // Show the editor for a new post
    showEditor();
  });
  
  // Post form submission
  const postForm = document.getElementById('post-form');
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    savePost();
  });
  
  // Cancel edit button
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener('click', () => {
    hideEditor();
  });
  
  // Rich text editor toolbar
  const toolbar = document.getElementById('rich-editor-toolbar');
  toolbar.addEventListener('click', (e) => {
    if (e.target.dataset.action) {
      e.preventDefault();
      const action = e.target.dataset.action;
      
      switch(action) {
        case 'bold':
          document.execCommand('bold', false, null);
          break;
        case 'italic':
          document.execCommand('italic', false, null);
          break;
        case 'underline':
          document.execCommand('underline', false, null);
          break;
        case 'insertImage':
          const url = prompt('Enter the image URL:');
          if (url) {
            document.execCommand('insertImage', false, url);
          }
          break;
      }
    }
  });
  
  // Post click events (read more, edit, delete, like)
  document.getElementById('posts-container').addEventListener('click', (e) => {
    const target = e.target;
    const postId = target.dataset.id || target.closest('button')?.dataset.id;
    
    if (target.classList.contains('read-more-btn') || target.closest('button')?.classList.contains('read-more-btn')) {
      showPostDetail(postId);
    }
    
    if (target.classList.contains('edit-post-btn') || target.closest('button')?.classList.contains('edit-post-btn')) {
      editPost(postId);
    }
    
    if (target.classList.contains('delete-post-btn') || target.closest('button')?.classList.contains('delete-post-btn')) {
      deletePost(postId);
    }
    
    if (target.classList.contains('like-button') || target.closest('button')?.classList.contains('like-button')) {
      likePost(postId);
    }
  });
}

// Show the editor for creating or editing a post
function showEditor(post = null) {
  const editorContainer = document.getElementById('editor-container');
  const editorTitle = document.getElementById('editor-title');
  const titleInput = document.getElementById('post-title');
  const categorySelect = document.getElementById('post-category');
  const tagsInput = document.getElementById('post-tags');
  const contentEditor = document.getElementById('rich-editor-content');
  
  // Hide post listings and detail view
  document.getElementById('posts-container').classList.add('hidden');
  document.getElementById('post-detail').classList.add('hidden');
  
  // Show editor
  editorContainer.classList.remove('hidden');
  
  if (post) {
    // Edit existing post
    editorTitle.textContent = 'Edit Post';
    titleInput.value = post.title;
    categorySelect.value = post.category;
    tagsInput.value = post.tags.join(', ');
    contentEditor.innerHTML = post.content;
    currentEditId = post.id;
  } else {
    // Create new post
    editorTitle.textContent = 'Create New Post';
    titleInput.value = '';
    categorySelect.value = 'Technology';
    tagsInput.value = '';
    contentEditor.innerHTML = '';
    currentEditId = null;
  }
}

// Hide the editor and show post listings
function hideEditor() {
  document.getElementById('editor-container').classList.add('hidden');
  document.getElementById('posts-container').classList.remove('hidden');
  currentEditId = null;
}

// Save a post (new or edited)
function savePost() {
  const titleInput = document.getElementById('post-title');
  const categorySelect = document.getElementById('post-category');
  const tagsInput = document.getElementById('post-tags');
  const contentEditor = document.getElementById('rich-editor-content');
  
  const title = titleInput.value.trim();
  const category = categorySelect.value;
  const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
  const content = contentEditor.innerHTML;
  
  if (title === '' || content === '') {
    alert('Please fill in all required fields');
    return;
  }
  
  if (currentEditId) {
    // Update existing post
    const postIndex = blogPosts.findIndex(post => post.id === currentEditId);
    
    if (postIndex !== -1) {
      blogPosts[postIndex] = {
        ...blogPosts[postIndex],
        title,
        category,
        tags,
        content,
        updatedAt: new Date().toISOString()
      };
    }
  } else {
    // Create new post
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      author: 'Anonymous User', // In a real app, this would be the logged-in user
      category,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    
    blogPosts.unshift(newPost);
  }
  
  // Save to localStorage
  localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  
  // Hide editor and show posts
  hideEditor();
  renderPosts();
  
  // Show confirmation
  showNotification(currentEditId ? 'Post updated successfully' : 'Post created successfully');
}

// Show a post in detail view
function showPostDetail(postId) {
  const post = blogPosts.find(post => post.id === postId);
  
  if (!post) return;
  
  const detailView = document.getElementById('post-detail');
  const postsContainer = document.getElementById('posts-container');
  
  // Hide posts list, show detail view
  postsContainer.classList.add('hidden');
  detailView.classList.remove('hidden');
  
  // Format date
  const date = new Date(post.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  detailView.innerHTML = `
    <div class="post-detail-header">
      <button id="back-to-posts" class="back-button">← Back to Posts</button>
      <h1>${post.title}</h1>
      <div class="post-meta">
        <span class="post-date">${formattedDate}</span>
        <span class="post-author">by ${post.author || 'Anonymous'}</span>
      </div>
      <div class="post-category">
        <span class="category-badge">${post.category}</span>
      </div>
      <div class="post-tags">
        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
    
    <div class="post-content">
      ${post.content}
    </div>
    
    <div class="post-engagement">
      <button class="like-button detail-like" data-id="${post.id}">
        <span class="heart-icon">❤</span>
        <span class="like-count">${post.likes}</span> likes
      </button>
      
      <button id="share-button" class="share-button">
        Share Post
      </button>
    </div>
    
    <div class="post-comments">
      <h3>Comments (${post.comments.length})</h3>
      
      <div class="comment-form">
        <h4>Leave a Comment</h4>
        <form id="comment-form">
          <div class="form-group">
            <label for="comment-author">Name:</label>
            <input type="text" id="comment-author" required>
          </div>
          <div class="form-group">
            <label for="comment-content">Comment:</label>
            <textarea id="comment-content" rows="4" required></textarea>
          </div>
          <button type="submit" class="primary-button">Post Comment</button>
        </form>
      </div>
      
      <div class="comments-list">
        ${post.comments.length === 0 ? 
          '<p class="no-comments">No comments yet. Be the first to comment!</p>' : 
          post.comments.map(comment => {
            const commentDate = new Date(comment.createdAt);
            const formattedCommentDate = commentDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            
            return `
              <div class="comment">
                <div class="comment-header">
                  <span class="comment-author">${comment.author}</span>
                  <span class="comment-date">${formattedCommentDate}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
                <div class="comment-actions">
                  <button class="comment-like-button" data-post-id="${post.id}" data-comment-id="${comment.id}">
                    <span class="heart-icon">❤</span>
                    <span class="comment-like-count">${comment.likes}</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')
        }
      </div>
    </div>
  `;
  
  // Back button event listener
  document.getElementById('back-to-posts').addEventListener('click', () => {
    detailView.classList.add('hidden');
    postsContainer.classList.remove('hidden');
  });
  
  // Comment form submission
  const commentForm = document.getElementById('comment-form');
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const authorInput = document.getElementById('comment-author');
    const contentInput = document.getElementById('comment-content');
    
    const author = authorInput.value.trim();
    const content = contentInput.value.trim();
    
    if (author === '' || content === '') {
      alert('Please fill in all fields');
      return;
    }
    
    // Add new comment
    const newComment = {
      id: Date.now().toString(),
      author,
      content,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    // Find post and add comment
    const postIndex = blogPosts.findIndex(p => p.id === post.id);
    
    if (postIndex !== -1) {
      blogPosts[postIndex].comments.push(newComment);
      
      // Save to localStorage
      localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
      
      // Refresh the detail view
      showPostDetail(post.id);
      
      // Show confirmation
      showNotification('Comment added successfully');
    }
  });
  
  // Like button event listener
  document.querySelector('.detail-like').addEventListener('click', () => {
    likePost(post.id);
    // Update the like count in the detail view
    const likeCount = document.querySelector('.detail-like .like-count');
    const updatedPost = blogPosts.find(p => p.id === post.id);
    if (updatedPost) {
      likeCount.textContent = updatedPost.likes;
    }
  });
  
  // Comment like buttons
  document.querySelectorAll('.comment-like-button').forEach(button => {
    button.addEventListener('click', () => {
      const postId = button.dataset.postId;
      const commentId = button.dataset.commentId;
      likeComment(postId, commentId);
      
      // Update the comment like count in the UI
      const postIndex = blogPosts.findIndex(p => p.id === postId);
      const commentIndex = blogPosts[postIndex].comments.findIndex(c => c.id === commentId);
      
      if (postIndex !== -1 && commentIndex !== -1) {
        const likeCount = button.querySelector('.comment-like-count');
        likeCount.textContent = blogPosts[postIndex].comments[commentIndex].likes;
      }
    });
  });
  
  // Share button
  document.getElementById('share-button').addEventListener('click', () => {
    // In a real app, this would open a share dialog with social media options
    // For this demo, we'll just simulate copying a link
    
    const shareUrl = `${window.location.origin}?post=${post.id}`;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        showNotification('Link copied to clipboard');
      })
      .catch(() => {
        showNotification('Failed to copy link', 'error');
      });
  });
}

// Edit a post
function editPost(postId) {
  const post = blogPosts.find(post => post.id === postId);
  
  if (post) {
    showEditor(post);
  }
}

// Delete a post
function deletePost(postId) {
  if (confirm('Are you sure you want to delete this post?')) {
    const postIndex = blogPosts.findIndex(post => post.id === postId);
    
    if (postIndex !== -1) {
      blogPosts.splice(postIndex, 1);
      
      // Save to localStorage
      localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
      
      // Refresh the posts list
      renderPosts();
      
      // Show confirmation
      showNotification('Post deleted successfully');
    }
  }
}

// Like a post
function likePost(postId) {
  const postIndex = blogPosts.findIndex(post => post.id === postId);
  
  if (postIndex !== -1) {
    blogPosts[postIndex].likes += 1;
    
    // Save to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    
    // Update like count in UI
    const likeCountElement = document.querySelector(`button[data-id="${postId}"] .like-count`);
    
    if (likeCountElement) {
      likeCountElement.textContent = blogPosts[postIndex].likes;
    }
  }
}

// Like a comment
function likeComment(postId, commentId) {
  const postIndex = blogPosts.findIndex(post => post.id === postId);
  
  if (postIndex !== -1) {
    const commentIndex = blogPosts[postIndex].comments.findIndex(comment => comment.id === commentId);
    
    if (commentIndex !== -1) {
      blogPosts[postIndex].comments[commentIndex].likes += 1;
      
      // Save to localStorage
      localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    }
  }
}

// Strip HTML tags from content for excerpts
function stripHtml(html) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.classList.add('fadeout');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

// Check URL for post ID (for sharing)
function checkUrlForPostId() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('post');
  
  if (postId) {
    const post = blogPosts.find(post => post.id === postId);
    if (post) {
      setTimeout(() => {
        showPostDetail(postId);
      }, 100);
    }
  }
}
