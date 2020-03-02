<template>
  <v-card>
    <v-btn
      absolute
      dark
      fab
      bottom
      right
      color="green"
      fixed
      class="addButton"
      @click="dialog = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="zutaten"
      class="elevation-1"
      flat
      mobile-breakpoint="1"
    >
      <v-btn absolute dark fab top right color="pink">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <template v-slot:top>
        <v-dialog v-model="dialog">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.zutat" label="Zutat"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.anzahl" label="Anzahl (in Kg)"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.schwellwert" label="Schwellwert"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Abbrechen</v-btn>
              <v-btn color="blue darken-1" text @click="save">Speichern</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
        <v-icon small @click="openDeleteDialog(item)">delete</v-icon>
      </template>
      <template v-slot:no-data>
        <br />
        <p>Scheint dein Inventar ist leer 😢</p>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Zutat löschen?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="deleteItem()">Löschen</v-btn>

          <v-btn color="black" text @click="deleteDialog = false">Abbrechen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import firebase from "firebase";
let db = firebase.firestore();

export default {
  name: "Inventory",
  data: () => ({
    currentItem: "",
    deleteZutat: false,
    dialog: false,
    deleteDialog: false,
    headers: [
      {
        text: "Zutat",
        align: "left",
        value: "zutat"
      },
      { text: "Anzahl (Kg)", value: "anzahl" },
      { text: "Actions", value: "action", sortable: false }
    ],
    zutaten: [],
    editedIndex: -1,
    editedItem: {
      zutat: "",
      schwellwert: 0,
      anzahl: 0
    },
    defaultItem: {
      zutat: "",
      anzahl: 0
    },
    deletedItem: {}
  }),

  methods: {
    editItem(item) {
      this.editedIndex = this.zutaten.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.currentItem = item;
      this.dialog = true;
    },
    saveEditItem() {
      db.collection("Inventory")
        .doc(this.currentItem.id)
        .update({
          anzahl: this.editedItem.anzahl,
          schwellwert: this.editedItem.schwellwert,
          zutat: this.editedItem.zutat
        })
        .then(function(docRef) {
          this.currentItem = "";
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
      this.dialog = false;
    },
    openDeleteDialog(item) {
      this.deletedItem = item;
      this.deleteDialog = true;
    },
    deleteItem() {
      console.log(this.deletedItem.id);
      db.collection("Inventory")
        .doc(this.deletedItem.id)
        .delete();
      this.deletedItem = {};
      this.deleteDialog = false;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.zutaten[this.editedIndex], this.editedItem);
        this.saveEditItem();
      } else {
        db.collection("Inventory")
          .add({
            anzahl: this.editedItem.anzahl,
            schwellwert: this.editedItem.schwellwert,
            zutat: this.editedItem.zutat
          })
          .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
      }
      this.close();
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Neuer Lagerbstand" : "Zutat bearbeiten";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    db.collection("Inventory").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          this.zutaten.push({
            ...change.doc.data(),
            id: change.doc.id
          });
        } else if (change.type === "removed") {
          let index = this.zutaten
            .map(x => {
              return x.id;
            })
            .indexOf(change.doc.id);
          this.zutaten.splice(index, 1);
        }
      });
    });
  }
};
</script>

<style>
.elevation-1 {
  height: 92vh;
}
.addButton {
  margin-bottom: 50px !important;
}
</style>
