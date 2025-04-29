import api from '../libs/api';

export default {

  getManagers: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/teams`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
    getManagersUP: async (page = 1, itemsPerPage = 15) => {
    try {
      const { status, data } = await api().get(`/teams`, {
        params: { page, per_page: itemsPerPage },
      });
      if (status === 200) return data;
      throw new Error(`Failed with status: ${status}`, status);
    } catch (error) {
      throw error; // Re-throw to handle at a higher level if needed
    }
  },
  postManager: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post('/teams', data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateManager: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/teams/${id}`, data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  getFormGroup: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/team-by-form-id?form_id=${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  getGroupTeamMembers: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/team-members-by-id?team_id=${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


}