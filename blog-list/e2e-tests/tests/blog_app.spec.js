const { expect, test, describe, beforeEach } = require('@playwright/test');
import { createBlog, createUser, login, resetDatabase } from './helper';
describe('Blog app', () => {
  const baseUrl = 'http://localhost:5173';
  beforeEach(async ({ page, request }) => {
    await resetDatabase({ baseUrl, request });
    const user = {
      name: 'Imran Hussain',
      username: 'immi123',
      password: 'fakepassword',
    };
    await createUser({ baseUrl, request, user });
    await page.goto(baseUrl);
  });
  test('login form is shown by default', async ({ page }) => {
    const username = await page.getByText('username');
    const password = await page.getByText('password');
    const button = await page.getByRole('button', { name: 'login' });
    await expect(username).toBeVisible();
    await expect(password).toBeVisible();
    await expect(button).toBeVisible();
  });

  describe('login', () => {
    test('successfully logins with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('immi123');
      await page.getByTestId('password').fill('fakepassword');
      await page.getByRole('button', { name: 'login' }).click();

      const locator = await page.getByText('Imran Hussain logged in');
      await expect(locator).toBeVisible();
    });
    test('login fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('wrong');
      await page.getByTestId('password').fill('immi123');
      await page.getByRole('button', { name: 'login' }).click();

      const locator = await page.getByText('incorrect username or password');
      expect(locator).toBeDefined();
    });
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await login({ page, username: 'immi123', password: 'fakepassword' });
    });

    test('a new blog can be created', async ({ page }) => {
      const title = 'New Blog Title';
      const author = 'Imran Hussain';
      const url = 'www.fakeurl.com';
      await createBlog({ page, title, author, url });

      const locator = await page.getByText('New Blog Title, Imran Hussain');
      await expect(locator).toBeVisible();
    });

    test('created blog can be liked', async ({ page }) => {
      const title = 'New Blog Title';
      const author = 'Imran Hussain';
      const url = 'www.fakeurl.com';

      await createBlog({ page, title, author, url });
      await page.getByRole('button', { name: 'view' }).click();
      await page.pause();
      await page.getByRole('button', { name: 'like' }).click();

      const text = await page.getByText('likes: 1');
      await expect(text).toBeVisible();
    });

    test('blog can be deleted by the author only', async ({ page }) => {
      const title = 'New Blog Title';
      const author = 'Imran Hussain';
      const url = 'www.fakeurl.com';
      page.on('console', (message) => {
        console.log(message);
      });
      page.on('dialog', async (dialog) => {
        console.log('dialog.type', dialog.type());
        if (dialog.type() === 'confirm') {
          await dialog.accept();
        }
      });
      await createBlog({ page, title, author, url });
      await page.getByRole('button', { name: 'view' }).click();
      await page.pause();
      await page.getByRole('button', { name: 'remove' }).click();
      const text = await page.getByText('New Blog Title, Imran Hussain');
      await expect(text).not.toBeVisible();
    });

    test('only author can see the blog remove button', async ({
      page,
      request,
    }) => {
      // create another user
      const user = {
        name: 'Fuzail Raza',
        username: 'fuzzi123',
        password: 'fakepassword',
      };
      await createUser({ baseUrl, request, user });
      // create blog with already logged in user 'immi123'
      const title = 'New Blog Title';
      const author = 'Imran Hussain';
      const url = 'www.fakeurl.com';

      await createBlog({ page, title, author, url });
      await page.pause();
      // check for remove button that should be visible
      await page.getByRole('button', { name: 'view' }).click();
      await expect(
        await page.getByRole('button', { name: 'remove' }),
      ).toBeVisible();
      // logout and login with new user
      await page.getByRole('button', { name: 'Logout' }).click();
      await login({ page, username: 'fuzzi123', password: 'fakepassword' });
      await page.pause();
      // check for remove button that should not be visible to other than author
      await page.getByRole('button', { name: 'view' }).click();
      await expect(
        await page.getByRole('button', { name: 'remove' }),
      ).not.toBeVisible();
    });

    test('blogs are listed by descending order of the number of likes', async ({
      page,
    }) => {
      const blogs = [
        {
          title: 'This is First Blog',
          author: 'Imran Hussain',
          url: 'www.fakeurl.com',
        },
        {
          title: 'This is Second Blog',
          author: 'Fuzail Raza',
          url: 'www.fakeurl.com',
        },
        {
          title: 'This is Third Blog',
          author: 'Shabaan Raza',
          url: 'www.fakeurl.com',
        },
      ];

      await createBlog({ page, ...blogs[0] });
      await createBlog({ page, ...blogs[1] });
      await createBlog({ page, ...blogs[2] });

      await page.pause();
      let totalClicks = 1;
      for (const blog of blogs) {
        await page.waitForTimeout(500);
        // await page.waitForLoadState('domcontentloaded');
        let currentBlog = await page
          .locator('div.blog')
          .filter({ hasText: `${blog.title}, ${blog.author}` });
        await currentBlog.getByRole('button', { name: 'view' }).click();
        // await page.waitForLoadState('domcontentloaded');

        for (let click = 0; click < totalClicks; click++) {
          currentBlog = await page
            .locator('div.blog')
            .filter({ hasText: `${blog.title}, ${blog.author}` });
          await currentBlog.getByRole('button', { name: 'like' }).click();
          // await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(500);
        }
        totalClicks++;
      }
      page.on('console', (message) => {
        console.log(message);
      });
      const allBlogs = await page.locator('div.blog').all();
      // check for number of likes in descending order
      let likes = 3;

      for (const blog of allBlogs) {
        const blogText = await blog.getByText(`likes: ${likes}`);
        await expect(blogText).toBeVisible();
        likes--;
      }
    });
  });
});
