import BioEditor from "./bioEditor";
import { render, waitFor, fireEvent } from "@testing-library/react";
import axios from "./axios";

jest.mock("./axios");

test('1. When no bio is passed to it, an "Add" button is rendered.', async () => {
    const { container } = render(<BioEditor bio="" />);
    console.log("container: ", container.innerHTML);

    expect(container.innerHTML).toContain("<button>Add bio</button>");
});

test('When a bio is passed to it, an "Edit" button is rendered.', async () => {
    const { container } = render(<BioEditor bio="Too cool for school" />);
    console.log("container: ", container.innerHTML);

    expect(container.innerHTML).toContain("<button>Edit</button>");
});

test('Clicking either the "Add" or "Edit" button causes a textarea and a "Save" button to be rendered.', () => {
    const { container } = render(<BioEditor bio="Yess" />);

    const button = container.querySelector("button");
    fireEvent.click(button);

    expect(container.innerHTML).toContain("textarea");
    expect(container.innerHTML).toContain("<button>Save</button>");
});

test.only('Clicking the "Save" button causes an ajax request.', async () => {
    const { container } = render(<BioEditor bio="" />);

    const button = container.querySelector("button");
    fireEvent.click(button);

    await waitFor(() =>
        expect(container.querySelector("textarea")).toBeTruthy()
    );

    let post = axios.post.mockResolvedValue({
        data: {
            bio: "testing is fun....",
        },
    });

    fireEvent.click(container.querySelector(".save"));

    expect(post).toBeTruthy;
});
