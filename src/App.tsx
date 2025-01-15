import { RouterProvider } from "react-router-dom"
import router from "./routes"
import { PrimeReactProvider } from 'primereact/api'


function App() {

  return (
    <PrimeReactProvider>
      <div className="">
        <RouterProvider router={router} />
      </div>
    </PrimeReactProvider>
  )
}

export default App
