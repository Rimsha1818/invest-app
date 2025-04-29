import api from '../libs/api';

export default {

  getTeamMembers: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/team-members`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postTeamMembers: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post('/team-members', data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateTeamMembers: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/team-members/${id}`, data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

}