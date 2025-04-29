import api from '../libs/api';

export default {

  getApprovers: (page, itemsPerPage) => {
    console.log(page, itemsPerPage)
    return new Promise((resolve, reject) => {
      const params = {
        page: page,
        per_page: itemsPerPage,
      };
        api()
            .get(`/approvers`, { params })
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  getAllApprovers: (page, itemsPerPage) => {
    return new Promise((resolve, reject) => {
      const params = {
        page: page,
        per_page: itemsPerPage,
      };
        api()
            .get(`/get-all-approvers`, { params })
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postApprover: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post('/approvers', data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateApprover: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/approvers/${id}`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateStatus: (data) => {
    return new Promise((resolve, reject) => {
      api()
        .post(`/approve-disapproved`, data)
        .then(({ status, data }) => {
          if (status === 201) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  updateParallelStatus: (data) => {
    return new Promise((resolve, reject) => {
      api()
        .post(`/parallel-approve-disapproved`, data)
        .then(({ status, data }) => {
          if (status === 201) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  

  // updateParallelStatus: (data) => {
  //   return new Promise((resolve, reject) => {
  //       api()
  //           .post(`/parallel-approve-disapproved`, data)
  //           .then(({ status, data }) => {
  //               if (status === 201) resolve(data);
  //               throw new Error(`Failed with status: ${status}`);
  //           })
  //           .catch(error => reject(error));
  //   });
  // },
  


}