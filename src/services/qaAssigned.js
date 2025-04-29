import api from '../libs/api';

export default {

  getQaAssigned: (formId, assurable_id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/qa-assign?form_id=${formId}&assurable_id=${assurable_id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  // getAllQaAssigned: () => {
  //   return new Promise((resolve, reject) => {
  //       api()
  //           .get(`/qa-assign`)
  //           .then(({ status, data }) => {
  //               if (status === 200) resolve(data.data);
  //               throw new Error(`Failed with status: ${status}`);
  //           })
  //           .catch(error => reject(error));
  //   });
  // },

//   postDepartment: (data) => {
//   return new Promise((resolve, reject) => {
//       api()
//           .post('/departments', data)
//           .then(({ status, data }) => {
//               if (status === 200) resolve(data);
//               throw new Error(`Failed with status: ${status}`);
//           })
//           .catch(error => reject(error));
//   });
// },

// updateDepartment: (id, data) => {
//   return new Promise((resolve, reject) => {
//       api()
//           .put(`/departments/${id}`, data)
//           .then(({ status, data }) => {
//               if (status === 200) resolve(data);
//               throw new Error(`Failed with status: ${status}`);
//           })
//           .catch(error => reject(error));
//   });
// },

// deleteDepartment: (id) => {
//   return new Promise((resolve, reject) => {
//       api()
//           .delete(`/departments/${id}`)
//           .then(({ status, data }) => {
//               if (status === 200) resolve(data);
//               throw new Error(`Failed with status: ${status}`);
//           })
//           .catch(error => reject(error));
//   });
// },


}