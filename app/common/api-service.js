import Axios from "axios";

class APIService {
  async fetchPosts([username, request]) {
    return await Axios.get(`/profile/${username}/posts`, {
      cancelToken: request.token,
    });
  }
}

export default new APIService();
