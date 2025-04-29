
import api from '../libs/api';

export default {

  getCostCenter: (page = 1, itemsPerPage = 15) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/cost-centers`, {
          params: {
            page: page,
            per_page: itemsPerPage,
          }
        })
        .then(({ status, data }) => {
          if (status === 200) resolve(data.data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch(error => reject(error));
    });
  },

  getAllCostCenters: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/get-all-cost-centers`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
  getRelatedCostCenters: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/get-related-cost-centers`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postCostCenter: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post(`/cost-centers`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  updateCostCenter: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/cost-centers/${id}`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  deleteCostCenter: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .delete(`/cost-centers/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
 

}