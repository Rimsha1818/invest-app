import api from '../libs/api';

export default {

  getQA: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/list-quality-assurance`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postQA: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post('/quality-assurance', data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  sendQaRequest: (selectedForm, currentKey, users) => {
    const formData = `form_id=${selectedForm}`;
    const keyData = `key=${currentKey}`;
    const usersData = users.map((user, index) => `qa_user_ids[${index}]=${user}`).join('&');
    console.log(`/qa-assign?${formData}&${keyData}&${usersData}`)
    return new Promise((resolve, reject) => {
        api()
            .post(`/qa-assign?${formData}&${keyData}&${usersData}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
},
  getifQaAssigned: (detail) => {
    const formData = `detail=${detail}`;
    return new Promise((resolve, reject) => {
        api()
            .get(`/get-qa-assigned/add?${formData}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

getQaRequestByParam: (selectedForm, currentKey, users) => {
  const formData = `form_id=${selectedForm}`;
  const keyData = `key=${currentKey}`;
  const usersData = users.map((user, index) => `users[${index}]=${user}`).join('&');
  return new Promise((resolve, reject) => {
      api()
          .get(`/send-qa-request?${formData}&${keyData}&${usersData}`)
          .then(({ status, data }) => {
              if (status === 200) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},
  

  updateUat: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/quality-assurance/${id}`, data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateQAStatus: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post(`/status-quality-assurance`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  getQaDetails: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/quality-assurance/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


}