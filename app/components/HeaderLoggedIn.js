import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import ReactTooltip from "react-tooltip";

const HeaderLoggedIn = (props) => {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const handleLogOut = () => {
    appDispatch({ type: "logout" });
    appDispatch({
      type: "flashMessage",
      value: "You have successfully logged out.",
    });
  };

  const handleSearchIcon = (e) => {
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  };

  return (
    <div className="flex-row my-3 my-md-0">
      <a
        onClick={handleSearchIcon}
        href="#"
        className="text-white mr-2 header-search-icon"
        data-for="search"
        data-tip="Search"
      >
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip place="bottom" className="custom-tooltip" id="search" />{" "}
      <span
        data-for="chat"
        data-tip="Chat"
        className={
          "mr-2 header-chat-icon " +
          (appState.unreadChatCount ? "text-danger" : "text-white")
        }
        onClick={() => appDispatch({ type: "toggleChat" })}
      >
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? (
          <span className="chat-count-badge text-white">
            {appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}
          </span>
        ) : (
          ""
        )}
      </span>
      <ReactTooltip place="bottom" className="custom-tooltip" id="chat" />{" "}
      <Link
        data-for="profile"
        data-tip="My Profile"
        to={`/profile/${appState.user.username}`}
        className="mr-2"
      >
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <ReactTooltip place="bottom" className="custom-tooltip" id="profile" />{" "}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>{" "}
      <button className="btn btn-sm btn-secondary" onClick={handleLogOut}>
        Sign Out
      </button>
    </div>
  );
};

export default HeaderLoggedIn;
