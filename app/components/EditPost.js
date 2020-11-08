import React, { useEffect, useState, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Page from "./Page";
import NotFound from "./NotFound";
import { useParams, Link, useHistory } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

const EditPost = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  let history = useHistory();

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        break;

      case "titleChange":
        draft.title.hasErrors = false;
        draft.title.value = action.value;

        break;

      case "bodyChange":
        draft.body.hasErrors = false;
        draft.body.value = action.value;
        break;

      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
        }

        break;

      case "saveRequestStarted":
        draft.isSaving = true;
        break;

      case "saveRequestFinished":
        draft.isSaving = false;
        break;

      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = "You must provide a title.";
        }
        break;

      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true;
          draft.body.message = "You must provide body content.";
        }
        break;

      case "notFound":
        draft.notFound = true;
        break;

      default:
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  useEffect(() => {
    const request = Axios.CancelToken.source();

    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${state.id}/`, {
          cancelToken: request.token,
        });
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data });
          if (appState.user.username !== response.data.author.username) {
            appDispatch({
              type: "flashMessage",
              value: "You do not have permissions",
            });
            history.push("/");
          }
        } else {
          console.log("test");
          dispatch({ type: "notFound" });
        }
        dispatch({ type: "fetchComplete", value: response.data });
      } catch (error) {
        console.log("There was a problem");
      }
    };
    fetchPost();
    return () => {
      request.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const request = Axios.CancelToken.source();

      const fetchPost = async () => {
        try {
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token,
            },
            {
              cancelToken: request.token,
            },
          );
          dispatch({ type: "saveRequestFinished" });
          appDispatch({ type: "flashMessage", value: "Post was updated" });
        } catch (error) {
          console.log("There was a problem");
        }
      };
      fetchPost();
      return () => {
        request.cancel();
      };
    }
  }, [state.sendCount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "submitRequest" });
  };

  if (state.isFetching)
    return (
      <Page>
        <LoadingDotsIcon />
      </Page>
    );

  if (state.notFound) {
    return <NotFound />;
  }

  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to post permalink
      </Link>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onChange={(e) =>
              dispatch({ type: "titleChange", value: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "titleRules", value: e.target.value })
            }
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            value={state.title.value}
            autoComplete="off"
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onChange={(e) =>
              dispatch({ type: "bodyChange", value: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "bodyRules", value: e.target.value })
            }
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
          />
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Updates
        </button>
      </form>
    </Page>
  );
};

export default EditPost;
