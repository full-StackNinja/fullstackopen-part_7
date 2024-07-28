import { describe } from 'vitest';
import CreateBlog from './CreateBlog';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';

describe('<CreateBlog />', () => {
  it('should call the create blog handler once with right content', async () => {
    const mockCreateBlog = vi.fn();
    const user = userEvent.setup();

    render(<CreateBlog createBlog={mockCreateBlog} />);

    const title = screen.getByPlaceholderText('blog title...');
    const author = screen.getByPlaceholderText('author name...');
    const url = screen.getByPlaceholderText('blog url...');
    const createBtn = screen.getByText('create');

    await user.type(title, 'fake title');
    await user.type(author, 'imran hussain');
    await user.type(url, 'www.fakeurl.com');
    await user.click(createBtn);

    expect(mockCreateBlog.mock.calls).toHaveLength(1);
    expect(mockCreateBlog.mock.calls[0][0]).toStrictEqual({
      title: 'fake title',
      author: 'imran hussain',
      url: 'www.fakeurl.com',
    });
  });
});
