import api from '../libs/api';

export default {

  getProjects: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/projects`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },



  getAllProjectsByForm: (form_id) => {
    let formID = 0;
    if(!form_id){
        formID = 0;
    }else{
        formID = form_id;

    }
    return new Promise((resolve, reject) => {
        api()
            .get(`/get-projects-of-form?form_id=${formID}`)
            .then(({ status, data }) => {
                if (status === 200 || status === 201) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  getAllSections: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/get-all-sections`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateProject: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/projects/${id}`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  deleteProject: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .delete(`/projects/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postProject: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post('projects', data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
  

}