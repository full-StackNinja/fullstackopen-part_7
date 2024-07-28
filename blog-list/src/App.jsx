import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import userService from './services/users';
import LoginForm from './components/Login';
import CreateBlog from './components/CreateBlog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const [styles, setStyles] = useState({
    fontSize: '16px',
    padding: '10px',
    margin: '20px',
    fontWeight: 'bold',
    border: '3px  solid green',
    backgroundColor: '#ccc',
  });

  const blogFormRef = useRef();
  const setBlogList = (blogList) => {
    blogList.sort((a, b) => b.likes - a.likes);
    setBlogs(blogList);
  };
  useEffect(() => {
    blogService.getAll().then((blogList) => {
      setBlogList(blogList);
    });
  }, []);

  useEffect(() => {
    const userJson = window.localStorage.getItem('loggedInUser');
    if (userJson) {
      const userObject = JSON.parse(userJson);
      setUser(userObject);
      //  console.log("🚀 ~ useEffect ~ userObject:", userObject)
      blogService.setToken(userObject.token);
    }
  }, []);

  useEffect(() => {
    userService
      .getAllUsers()
      .then((users) => {
        setUsers(users);
      })
      .catch((error) => {
        displayNotification(error.response.data.error);
        setStyles({ ...styles, border: '3px solid red', color: 'red' });
        console.log(
          '🚀 ~ userService.getAllUsers ~ error.message:',
          error.response.data.error,
        );
      });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await blogService.login({ username, password });
      console.log('🚀 ~ handleLogin ~ userData:', userData);
      setUser(userData);
      blogService.setToken(userData.token);
      window.localStorage.setItem(
        'loggedInUser',
        `${JSON.stringify(userData)}`,
      );
      setUsername('');
      setPassword('');
    } catch (error) {
      displayNotification(error.response.data.error);
      setStyles({ ...styles, border: '3px solid red', color: 'red' });
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser');
    setUser(null);
  };

  const displayNotification = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const createBlog = async (newBlog) => {
    try {
      const loggedInUser = users.find(
        (eachUser) => eachUser.username === user.username,
      );
      console.log('🚀 ~ createBlog ~ loggedInUser:', loggedInUser);
      newBlog.user = loggedInUser.id;
      console.log('🚀 ~ createBlog ~ newBlog:', newBlog);
      const blog = await blogService.createBlog(newBlog);
      console.log('🚀 ~ createBlog ~ blog:', blog);
      blogFormRef.current.toggleVisibility();
      setBlogList(blogs.concat(blog));
      displayNotification(`A new blog ${blog.title} added by ${blog.author}`);
      setStyles({ ...styles, border: '3px solid green', color: 'green' });
    } catch (exception) {
      displayNotification(exception.response.data.error);
      setStyles({ ...styles, border: '3px solid red', color: 'red' });
      console.log(
        '🚀 ~ handleBlogCreate ~ exception.message:',
        exception.message,
      );
    }
  };

  const updateBlog = async (blog) => {
    console.log('🚀 ~ updateBlog ~ blog:', blog);

    const data = await blogService.updateBlog(blog);
    data.user = user;
    const blogList = blogs.map((blog) => (blog.id === data.id ? data : blog));
    setBlogList(blogList);
  };

  const removeBlog = async (blog) => {
    try {
      const data = await blogService.removeBlog(blog);
      console.log('🚀 ~ removeBlog ~ data:', data);

      const blogList = blogs.filter((blog) => blog.id !== data.id);
      setBlogList(blogList);
    } catch (error) {
      displayNotification(error.response.data.error);
      setStyles({ ...styles, border: '3px solid red', color: 'red' });
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      {message && (
        <Notification
          message={message}
          styles={styles}
        />
      )}
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <>
          <p style={{ margin: '20px', fontWeight: 'bold' }}>
            {user.name} logged in <button onClick={handleLogout}>Logout</button>
          </p>

          <Togglable
            buttonLabel="create new blog"
            ref={blogFormRef}
          >
            <CreateBlog createBlog={createBlog} />
          </Togglable>

          {blogs.map((blog) => {
            console.log('🚀 ~ {blogs.map ~ blog:', blog);
            console.log('🚀 ~ {blogs.map ~ user:', user);
            // const loggedInUser = users.find(
            //   (eachUser) => eachUser.username === user.username,
            // );
            const userOwnsBlog = user.username === blog.user.username;

            console.log('🚀 ~ {blogs.map ~ userOwnsBlog:', userOwnsBlog);
            return (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                removeBlog={removeBlog}
                userOwnsBlog={userOwnsBlog}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default App;
