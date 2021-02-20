import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";

const ProfileFollow = (props) => {
  const appState = useContext(StateContext);
  const { action } = props;
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [follows, setFollows] = useState([]);

  useEffect(() => {
    const request = Axios.CancelToken.source();

    const fetchFollowers = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/${action}`, {
          cancelToken: request.token,
        });
        setFollows(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("There was a problem");
      }
    };
    fetchFollowers();
    return () => {
      request.cancel();
    };
  }, [action, username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {follows.map((follow, index) => {
        return (
          <Link
            key={`${follow.username}${index}`}
            to={`/profile/${follow.username}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={follow.avatar} />
            {follow.username}
          </Link>
        );
      })}
      {follows.length == 0 &&
        appState.user.username == username &&
        action === "following" && (
          <p className="lead text-muted text-center">
            You aren&rsquo;t following anyone yet.
          </p>
        )}
      {follows.length == 0 &&
        appState.user.username != username &&
        action === "following" && (
          <p className="lead text-muted text-center">
            {username} isn&rsquo;t following anyone yet.
          </p>
        )}
      {follows.length == 0 &&
        appState.user.username == username &&
        action === "followers" && (
          <p className="lead text-muted text-center">
            You don&rsquo;t have any followers yet.
          </p>
        )}
      {follows.length == 0 &&
        appState.user.username != username &&
        action === "followers" && (
          <p className="lead text-muted text-center">
            {username} doesn&rsquo;t have any followers yet.
            {appState.loggedIn && " Be the first to follow them!"}
            {!appState.loggedIn && (
              <>
                {" "}
                If you want to follow them you need to{" "}
                <Link to="/">sign up</Link> for an account first.{" "}
              </>
            )}
          </p>
        )}
    </div>
  );
};

export default ProfileFollow;
