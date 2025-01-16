import { RouterProvider } from "react-router-dom"
import router from "./routes"
import { PrimeReactProvider } from 'primereact/api'
import { persistStore } from "redux-persist";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";


function App() {
  let persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <PrimeReactProvider>
          <div className="">
            <RouterProvider router={router} />
          </div>
        </PrimeReactProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
