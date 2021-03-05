import React, { useState, useReducer, useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
Axios.defaults.baseURL =
  process.env.BACKENDURL || "https://backend-react-complex-app.herokuapp.com";

// My components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import Chat from "./components/Chat";
const Search = React.lazy(() => import("./components/Search"));
import NotFound from "./components/NotFound";
import LoadingDotsIcon from "./components/LoadingDotsIcon";

const Main = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexAppToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexAppToken"),
      username: localStorage.getItem("complexAppUsername"),
      avatar: localStorage.getItem("complexAppAvatar"),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        break;

      case "logout":
        draft.loggedIn = false;
        break;

      case "flashMessage":
        draft.flashMessages.push(action.value);
        break;

      case "openSearch":
        draft.isSearchOpen = true;
        break;

      case "closeSearch":
        draft.isSearchOpen = false;
        break;

      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        break;

      case "closeChat":
        draft.isChatOpen = false;
        break;

      case "incrementUnreadChatCount":
        draft.unreadChatCount++;
        break;

      case "clearUnreadChatCount":
        draft.unreadChatCount = 0;
        break;

      default:
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexAppToken", state.user.token);
      localStorage.setItem("complexAppUsername", state.user.username);
      localStorage.setItem("complexAppAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("complexAppToken");
      localStorage.removeItem("complexAppUsername");
      localStorage.removeItem("complexAppAvatar");
    }
  }, [state.loggedIn]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Switch>
              <Route path="/" exact>
                {state.loggedIn ? <Home /> : <HomeGuest />}
              </Route>
              <Route path="/create-post" exact>
                <CreatePost />
              </Route>
              <Route path="/profile/:username">
                <Profile />
              </Route>
              <Route path="/post/:id" exact>
                <ViewSinglePost />
              </Route>
              <Route path="/post/:id/edit" exact>
                <EditPost />
              </Route>
              <Route path="/about-us" exact>
                <About />
              </Route>
              <Route path="/terms" exact>
                <Terms />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Chat />
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
