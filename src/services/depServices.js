import api from '../libs/api';

export default {

  getDepServices: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/department-services`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

   getServicesByDep: (dep) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/department-services/${dep}?per_page=5`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  // getAllSubCategories: () => {
  //   return new Promise((resolve, reject) => {
  //       api()
  //           .get(`/get-all-software-subcategories`)
  //           .then(({ status, data }) => {
  //               if (status === 200) resolve(data.data);
  //               throw new Error(`Failed with status: ${status}`);
  //           })
  //           .catch(error => reject(error));
  //   });
  // },

  updateSubCategory: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/software-subcategories/${id}`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  deleteSubcategory: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .delete(`/software-subcategories/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postAttachServices: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .post(`departments/${id}/services/attach`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
  

}