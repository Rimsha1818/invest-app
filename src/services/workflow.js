import api from '../libs/api';

export default {

  postWorkflow: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post('/workflows', data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  deleteWorkflow: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .delete(`/workflows/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateWorkflow: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/workflows/${id}`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  getWorkflowDetails: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/workflows/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  getWorkflows: () => {
    return new Promise((resolve, reject) => {
        api()
            .get('/workflows')
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

    getCurrentWorkflow: (fi, kk) => {
        return new Promise((resolve, reject) => {
            api()
                .get(`/get-current-workflow/?form_id=${fi}&key=${kk}`)
                .then(({ status, data }) => {
                    if (status === 200) resolve(data.data);
                    throw new Error(`Failed with status: ${status}`);
                })
                .catch(error => reject(error));
        });
    },

    updateWorkflowApprovers: (data) => {
        return new Promise((resolve, reject) => {
            api()
                .post(`/update-initiated-workflow`, data)
                .then(({ status, data }) => {
                    if (status === 201) resolve(data);
                    throw new Error(`Failed with status: ${status}`);
                })
                .catch(error => reject(error));
        });
  },

  deleteWorkflowGroup: (data) => {
  return new Promise((resolve, reject) => {
    api()
      .delete(`/delete-workflow-approver-group`, {
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: new URLSearchParams(data).toString(),
      })
      .then(({ status, data }) => {
        if (status === 200) resolve(data);
        throw new Error(`Failed with status: ${status}`);
      })
      .catch(error => reject(error));
  });
},
}
