import api from '../libs/api';

export default {

  getSections: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/sections`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  getDepartmentOfSection: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/get-sections-of-department?department_id=${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
  

  getAllSections: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/get-all-sections`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateSection: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/sections/${id}`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  deleteSection: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .delete(`/sections/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postSection: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post('sections', data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
  

}