import api from '../libs/api';

export default {

  getCurrentSubscription: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/current-subscriptions?per_page=1011`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

}