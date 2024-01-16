import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import GuessTheFlag from "./pages/GuessTheFlag";
import Home from "./pages/Home";
import { getAll } from "./services/api";
export const router = createBrowserRouter([
    {
        path: "",
        element: <App />,
        loader: () => getAll(),
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "/guesstheflag",
                element: <GuessTheFlag />
            }
        ]
    },

])