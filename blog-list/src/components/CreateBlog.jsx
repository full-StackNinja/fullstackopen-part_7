import { useState } from 'react';
import PropTypes from 'prop-types';

const CreateBlog = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleBlogCreate = (e) => {
    e.preventDefault();
    const newBlog = { title, author, url };
    createBlog(newBlog);
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Create new</h2>
      <form onSubmit={handleBlogCreate}>
        <div>
          title:
          <input
            type="text"
            name="title"
            placeholder="blog title..."
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            name="author"
            placeholder="author name..."
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            name="url"
            placeholder="blog url..."
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

CreateBlog.propTypes = {
  createBlog: PropTypes.func.isRequired,
};
export default CreateBlog;
