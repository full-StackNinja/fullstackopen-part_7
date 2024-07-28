const login = async ({ page, username, password }) => {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const resetDatabase = async ({ baseUrl, request }) => {
  await request.post(baseUrl + '/api/test/reset');
};

const createUser = async ({ baseUrl, request, user }) => {
  await request.post(baseUrl + '/api/test/users', { data: user });
};

const createBlog = async ({ page, title, author, url }) => {
  await page.getByRole('button', { name: 'create new blog' }).click();
  await page.getByPlaceholder('blog title...').fill(title);
  await page.getByPlaceholder('author name...').fill(author);
  await page.getByPlaceholder('blog url...').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
};

export { login, resetDatabase, createUser, createBlog };
