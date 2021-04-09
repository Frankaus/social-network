import { App } from "./app";
import { render } from "@testing-library/react";
import axios from "./axios";

jest.mock("./axios");

axios.get.mockResolvedValue({
    data: {
        firstname: "Francesco",
        lastname: "Vauban",
        profile_pic_url: "https://www.fillmurray.com/500/700",
        id: 1,
    },
});

test("it renders app correctly", async () => {
    let test = render(<App />);
    console.log("test: ", test);
});
