import axios from 'axios';

const userBaseUrl = '/api/users';

const getAllUsers = async () => {
  const response = await axios.get(userBaseUrl);
  return response.data;
};

export default { getAllUsers };
