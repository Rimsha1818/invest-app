import api from '../libs/api';

export default {

  getTasks: (page = 1, itemsPerPage = 10) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/assign-tasks`, {
          params: {
            page,
            per_page: itemsPerPage
          }
        })
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch(error => reject(error));
    });
  },
  

  getTaskById: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/assign-tasks/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  

  postTask: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post(`/assign-tasks`, data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  getExistingMembers: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/assign-tasks/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateTask: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/assign-tasks/${id}`, data)
            .then(({ status, data }) => {
                if (status === 201 || status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  deleteTask: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .delete(`/assign-tasks/${id}`, data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateTaskStatus: (data) => {
    console.log(data)
    return new Promise((resolve, reject) => {
        api()
            .put(`/update-task-status`, data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  getTaskStatus: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/task-status-names`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  updateTaskStatusNonForm: (data) => {
    console.log(data)
    return new Promise((resolve, reject) => {
        api()
            .put(`/update-task-status-non-form`, data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
}