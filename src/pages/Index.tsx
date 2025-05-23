
import React, { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Once the component is mounted, initialize the blog
    const blogApp = document.getElementById('blog-app');
    if (blogApp && window.initializeBlog) {
      window.initializeBlog(blogApp);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div id="blog-app"></div>
      </div>
    </div>
  );
};

export default Index;
