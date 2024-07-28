import { useState } from 'react';
import PropTypes from 'prop-types';
const Blog = ({ blog, updateBlog, removeBlog, userOwnsBlog }) => {
  console.log('🚀 ~ Blog ~ blog:', blog);
  const [view, setView] = useState(false);

  const updateLike = (blog) => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    };
    updateBlog(updatedBlog);
  };

  const handleRemove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog);
    }
  };

  return (
    <div className="blog">
      <div>
        {blog.title}, {blog.author}{' '}
        <button
          data-testid="view-btn"
          className="view-btn"
          onClick={() => {
            setView(!view);
          }}
        >
          {view ? 'hide' : 'view'}
        </button>
      </div>
      {view && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes: {blog.likes}{' '}
            <button
              onClick={() => {
                updateLike(blog);
              }}
            >
              like
            </button>
          </p>
          <p>{blog.user.name}</p>
          {userOwnsBlog && (
            <button
              onClick={() => {
                handleRemove(blog);
              }}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  userOwnsBlog: PropTypes.bool.isRequired,
};
export default Blog;
