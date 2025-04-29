
import api from '../libs/api';

export default {

  getEquipments: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/equipments`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  getAllEquipments: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/get-all-equipments`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postEquipment: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post(`/equipments`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  updateEquipment: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/equipments/${id}`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  deleteEquipment: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .delete(`/equipments/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
 

}