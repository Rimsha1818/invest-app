import api from '../libs/api';

export default {

  getParallelUsers: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/parallel-approver`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postParallelUsers: (data) => {
  return new Promise((resolve, reject) => {
      api()
          .post('/parallel-approver', data)
          .then(({ status, data }) => {
              if (status === 201) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},

updateParallelUsers: (id, data) => {
  return new Promise((resolve, reject) => {
      api()
          .put(`/parallel-approver/${id}`, data)
          .then(({ status, data }) => {
              if (status === 200) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},

deleteParallelUsers: (id) => {
  return new Promise((resolve, reject) => {
      api()
          .delete(`/parallel-approver/${id}`)
          .then(({ status, data }) => {
              if (status === 204) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},


}