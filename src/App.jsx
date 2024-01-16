import { Outlet, useLoaderData } from "react-router-dom";

function App() {
  const data = useLoaderData()
  return (
    <>
      <Outlet context={data} />
    </>
  )
}

export default App
