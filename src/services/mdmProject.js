
import api from '../libs/api';

export default {

  getMdmProject: (page = 1, itemsPerPage = 15) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/mdm-projects`, {
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

  getAllMdmProjects: (catId=0, mdmCatId=0) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/get-related-mdm-projects?software_category_id=${catId}&mdm_category_id=${mdmCatId}`)
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

  postMdmProject: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post(`/mdm-projects`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  updateMdmProject: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/mdm-projects/${id}`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  deleteMdmProject: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .delete(`/mdm-projects/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
 

}