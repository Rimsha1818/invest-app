import api from '../libs/api';

export default {
  getEmailLogs: (page = 1) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/email-logs?page=${page}`)
        .then(({ status, data }) => {
          console.log('API response:', status, data); // Added for debugging
          if (status === 200) {
            resolve(data);
          } else {
            reject(new Error(`Failed with status: ${status}`));
          }
        })
        .catch(error => {
          console.error('API request failed:', error.message); // Added for debugging
          reject(error);
        });
    });
  },
};
