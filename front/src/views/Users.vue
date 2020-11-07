<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Country</th>
          <th scope="col">Identification</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in users" :key="index">
          <th scope="row">{{ item._id }}</th>
          <td>{{ item.name }}</td>
          <td>{{ item.country }}</td>
          <td>{{ item.identification }}</td>
          <td>{{ item.date }}</td>
          <td>
            <b-button
              class="btn-warning btn-sm mx-2"
              @click="activateEditing(item._id)"
              >Actualizar</b-button
            >
            <b-button
              class="btn-danger btn-sm mx-2"
              @click="deleteUser(item._id)"
              >Eliminar</b-button
            >
          </td>
        </tr>
      </tbody>
    </table>
    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="mensaje.color"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      {{ mensaje.texto }}
    </b-alert>

    <form @submit.prevent="addUser(user)" v-if="add">
      <h3 class="text-center">Add new users</h3>
      <input
        type="text"
        placeholder="Type name"
        class="form-control my-2"
        v-model="user.name"
      />
      <input
        type="text"
        placeholder="Type country"
        class="form-control my-2"
        v-model="user.country"
      />
      <input
        type="text"
        placeholder="Type identification"
        class="form-control my-2"
        v-model="user.identification"
      />
      <b-button class="btn-sm btn-block btn-success" type="submit"
        >Create</b-button
      >
    </form>
    <form @submit.prevent="editUser(userEdited)" v-else>
      <h3 class="text-center">Edit User</h3>
      <input
        type="text"
        placeholder="Type name"
        class="form-control my-2"
        v-model="userEdited.name"
      />
      <input
        type="text"
        placeholder="Type country"
        class="form-control my-2"
        v-model="userEdited.country"
      />
      <input
        type="text"
        placeholder="Type identification"
        class="form-control my-2"
        v-model="userEdited.identification"
      />
      <b-button class="btn-sm btn-block mb-1 btn-warning" type="submit"
        >Update</b-button
      >
      <b-button class="btn-sm btn-block" @click="add = true">Cancel</b-button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      user: {},
      userEdited: {},
      add: true,
      mensaje: { color: "success", texto: "" },
      dismissSecs: 5,
      dismissCountDown: 0,
    };
  },
  created() {
    this.listUsers();
  },
  methods: {
    listUsers() {
      this.axios
        .get("users")
        .then((response) => {
          this.users = response.data;
        })
        .catch((e) => {
          console.log("error" + e);
        });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    addUser(item) {
      this.axios
        .post("new-user", item)
        .then(() => {
          this.showAlert();
          this.mensaje.texto = "User created!";
          this.mensaje.color = "success";
          this.listUsers();
        })
        .catch((e) => {
          console.log(e);
          console.log(e.response.data.error.errors.nombre.message);
          this.showAlert();
          this.mensaje.color = "danger";
          this.mensaje.texto = e.response.data.error.errors.nombre.message;
        });
      this.user = {};
    },
    activateEditing(id) {
      this.add = false;
      this.axios
        .get(`user/${id}`)
        .then((res) => {
          this.userEdited = res.data;
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    editUser(item) {
      this.axios
        .put(`user/${item._id}`, item)
        .then(() => {
          let index = this.users.findIndex(
            (itemUser) => itemUser._id === this.userEdited._id
          );
          this.users[index].name = this.userEdited.name;
          this.users[index].country = this.userEdited.country;
          this.users[index].identification = this.userEdited.identification;
          this.userEdited = {};

          this.showAlert();
          this.mensaje.texto = "User updated";
          this.mensaje.color = "success";
        })
        .catch((e) => {
          console.log(e);
        });
      this.add = true;
    },
    deleteUser(id) {
      this.axios
        .delete(`user/${id}`)
        .then((res) => {
          let index = this.users.findIndex((item) => item._id === res.data._id);
          this.users.splice(index, 1);

          this.showAlert();
          this.mensaje.texto = "User Deleted!";
          this.mensaje.color = "danger";
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
  },
};
</script>

<style></style>
