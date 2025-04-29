import api from '../libs/api';

export default {

  getApprovalsByFormId: (page, itemsPerPage, form, tab, status) => {
    const url = `/get-approvals-by-form-id?form_id=${form}&page=${page}&per_page=${itemsPerPage}&status=${status}&tab=${tab}`;
    return new Promise((resolve, reject) => {
      api()
        .get(url)
        .then(({ status, data }) => {
          if (status === 200) resolve(data.data);
          else if (status === 404) {
            reject(new Error('Resource Not Found'));
          } else if (status === 401) {
            reject(new Error('Unauthorized Access'));
          } else {
            reject(new Error(`Failed with status: ${status}`));
          }
        })
        .catch(error => reject(error));
    });
  },

  getPendingApprovalCounts: (form, tab, status) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/get-pending-for-approval-counts`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data.data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch(error => reject(error));
    });
  },



}