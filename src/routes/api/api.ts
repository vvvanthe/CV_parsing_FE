import { API, standardResponse } from "./middleware";


export async function uploadFiles(formData: FormData) {
    const param = "uploadfiles";
    const config = formData;
    return API.post(`/${param}`, config)
      .then((response) => {
        return standardResponse(true, response.data);
      })
      .catch((error) => {
        return standardResponse(false, error.response?.data);
      });
  }