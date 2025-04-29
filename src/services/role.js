import api from "../libs/api";


export default {

  updateRole: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/roles/${id}`, data)
            .then(({ status, data }) => {
              if (status === 200) resolve(data);
              throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  getRoles: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/roles`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postRole: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post(`/roles`, data)
            .then(({ status, data }) => {
              if (status === 200) resolve(data);
              throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  

}