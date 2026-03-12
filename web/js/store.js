export const store = {

 user:null,
 entrenamientos:[],
 esPro:false,

 setUser(user){
  this.user = user;
 },

 setEntrenamientos(data){
  this.entrenamientos = data;
 },

 setPro(status){
 this.esPro = status;
}

};


