import api from '../libs/api';

export default {

  getIPSettings: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/ip-restrictions?per_page=1011`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateIPSettings: (data) => {
     return new Promise((resolve, reject) => {
    api()
      .post("ip-restrictions", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ status, data }) => {
        if (status === 201 || status === 200) {
          resolve(data);
        } else if (status === 422) {
          reject(data);
        } else {
          reject("An error occurred");
        }
      })
      .catch((error) => reject(error));
  });

},

  deleteIp: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .delete(`/ip-restrictions/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

}