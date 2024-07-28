import { describe } from "vitest";
import Blog from "./Blog";
import { beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { it } from "vitest";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";

describe("<Blog/>", () => {
  let container;
  const mockUpdateBlog = vi.fn();
  const mockRemoveBlog = vi.fn();
  beforeEach(() => {
    const blog = {
      title: "fake title",
      url: "www.fakeurl.com",
      author: "fake author",
      likes: 2,
      user: {
        name: "imran",
        username: "immi123",
        id: "1234",
      },
    };
    container = render(
      <Blog
        blog={blog}
        removeBlog={mockRemoveBlog}
        updateBlog={mockUpdateBlog}
        userOwnsBlog={true}
      />,
    );
  });
  it("renders title and author by default", () => {
    const element = container.getByText("fake title, fake author");
    expect(element).toBeDefined();
  });
  it("does not render url and likes fields by default", () => {
    const url = container.queryByText("www.fakeurl.com");
    const likes = container.queryByText("likes: 2");
    expect(url).toBeNull();
    expect(likes).toBeNull();
  });

  it("renders like and url fields when view button is clicked", async () => {
    const user = userEvent.setup();
    const viewBtn = container.getByText("view");
    await user.click(viewBtn);
    const url = container.getByText("www.fakeurl.com");
    const likes = container.getByText("likes: 2");
    expect(url).toBeDefined();
    expect(likes).toBeDefined();
  });

  it("calls updateBlog twice when like button is clicked twice", async () => {
    const user = userEvent.setup();
    const viewBtn = container.getByText("view");
    // first click view button to render like field
    await user.click(viewBtn);
    const likeBtn = container.getByText("like");
    // then click like button
    await user.click(likeBtn);
    await user.click(likeBtn);
    expect(mockUpdateBlog.mock.calls).toHaveLength(2);
  });
});
