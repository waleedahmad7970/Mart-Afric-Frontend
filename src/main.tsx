import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { setDispatch } from "./api/dispatch/dispatch";

setDispatch(store.dispatch);
createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
    <App />
  </Provider>
);
