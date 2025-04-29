import api from '../libs/api';

export default {

  getCategories: (page = 1, itemsPerPage = 15) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/software-categories`, {
          params: {
            page: page,
            per_page: itemsPerPage,
          },
        })
        .then(({ status, data }) => {
          if (status === 200) resolve(data.data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  getCategoryById: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`software-categories/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  getAllCategories: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/get-all-software-categories`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  postCategory: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post('/software-categories', data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  getAllSubCategories: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/software-category/${id}/subcategories`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateCategory: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/software-categories/${id}`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  deleteCategory: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .delete(`/software-categories/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

}