
import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div id="blog-app"></div>
        
        {/* Include our custom scripts after the DOM is loaded */}
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // The blog HTML will be injected into this div
            const blogApp = document.getElementById('blog-app');
            
            // Initialize our blog application
            if (blogApp) {
              initializeBlog(blogApp);
            }
          });
        `}} />
      </div>
    </div>
  );
};

export default Index;
