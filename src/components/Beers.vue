<template>
  <v-card>
    <v-btn
      absolute
      dark
      fab
      bottom
      right
      color="blue"
      fixed
      class="addButton"
      @click="dialog = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-data-table :headers="headers" :items="beers" class="elevation-1" flat mobile-breakpoint="1">
      <v-btn absolute dark fab top right color="pink">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <template v-slot:top>
        <v-dialog v-model="dialog">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-container>
              <v-text-field label="Welches Bier?" v-model="editedItem.name" flat></v-text-field>
              <v-text-field label="Wie lange dauerts?" v-model="editedItem.dauer" flat></v-text-field>
              <v-row align="center" justify="start">
                <div v-if="editedIndex === -1">
                  <v-col v-for="(selection, i) in selections" :key="selection.zutat" class="shrink">
                    <v-chip :disabled="loading" close @click:close="selected.splice(i, 1)">
                      <v-icon left v-text="selection.icon"></v-icon>
                      {{ selection.zutat }}
                    </v-chip>
                  </v-col>
                </div>

                <!-- Zutaten von DB anzeigen -->
                <div v-if="editedIndex !== -1">
                  <v-col
                    v-for="(selection, i) in editedZutatenAdd"
                    :key="selection.zutat"
                    class="shrink"
                  >
                    <v-chip
                      :disabled="loading"
                      close
                      @click:close="editedItem.zutaten.splice(i, 1)"
                    >
                      <v-icon left v-text="selection.icon"></v-icon>
                      {{ selection.name }} // {{ selection.anzahl }} kg
                    </v-chip>
                  </v-col>
                </div>
              </v-row>
            </v-container>

            <v-divider v-if="!allSelected"></v-divider>

            <v-list class="overflow-y-auto" max-height="400px">
              <template v-for="(item, i) in categories">
                <v-list-item
                  v-if="!selected.includes(i)"
                  :key="i"
                  :disabled="loading"
                  @click="addZutat(item, i)"
                >
                  <v-list-item-title v-text="item.zutat"></v-list-item-title>
                </v-list-item>
              </template>
            </v-list>

            <div v-if="editedIndex !== -1">
              <v-list class="overflow-y-auto" max-height="400px">
                <template v-for="(item, i) in categories">
                  <v-list-item
                    v-if="!selected.includes(i)"
                    :key="i"
                    :disabled="loading"
                    @click="addZutat(item, i)"
                  >
                    <v-list-item-title v-text="item.zutat"></v-list-item-title>
                  </v-list-item>
                </template>
              </v-list>
            </div>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save()">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogAnzahl">
          <v-card>
            <v-card-title>
              <span class="headline">Wie viel?</span>
            </v-card-title>
            <v-container>
              <v-text-field label="In Kilogramm" v-model="anzahlZutat"></v-text-field>
            </v-container>
            <v-spacer></v-spacer>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="saveZutat()">Weiter</v-btn>
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
        <p>Scheint ja ihr macht garkein Bier!</p>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Rezept wirklich löschen?</v-card-title>
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
    bierName: "",
    bierDuration: 0,
    items: [],
    deleteZutat: false,
    dialog: false,
    deleteDialog: false,
    dialogAnzahl: false,
    headers: [
      {
        text: "Bier",
        align: "left",
        value: "name"
      },
      { text: "Actions", value: "action", sortable: false }
    ],
    beers: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      zutaten: [],
      dauer: 0
    },
    defaultItem: {
      name: "",
      zutaten: [],
      dauer: 0
    },
    deletedItem: {},
    search: "",
    selected: [],
    recept: [],
    anzahlZutat: 0
  }),

  methods: {
    saveZutat() {
      let recept = {
        name: this.zutatName,
        anzahl: this.anzahlZutat
      };
      this.recept.push({
        ...recept
      });
      this.dialogAnzahl = false;
      this.anzahlZutat = 0;
    },
    addZutat(item, i) {
      this.zutatName = item.zutat;
      this.dialogAnzahl = true;
      this.selected.push(i);
    },
    editItem(item) {
      this.editedIndex = this.beers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      console.log(this.editedItem);
      this.currentItem = item;
      this.dialog = true;
    },
    saveEditItem() {
      db.collection("BeerSorts")
        .doc(this.currentItem.id)
        .update({
          name: this.editedItem.name,
          zutaten: this.editedZutatenAdd,
          dauer: this.editedItem.dauer
        })
        .then(function(docRef) {
          this.currentItem = "";
          this.recept = [];
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
      db.collection("BeerSorts")
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
        Object.assign(this.beers[this.editedIndex], this.editedItem);
        this.saveEditItem();
      } else {
        db.collection("BeerSorts")
          .add({
            name: this.editedItem.name,
            zutaten: this.recept,
            dauer: this.editedItem.dauer
          })
          .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            this.recept = [];
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
      return this.editedIndex === -1 ? "Neues Bier 🍺" : "Rezept bearbeiten";
    },
    allSelected() {
      return this.selected.length === this.items.length;
    },
    categories() {
      const search = this.search.toLowerCase();

      if (!search) return this.items;

      return this.items.filter(item => {
        const text = item.text.toLowerCase();

        return text.indexOf(search) > -1;
      });
    },
    selections() {
      const selections = [];

      for (const selection of this.selected) {
        selections.push(this.items[selection]);
      }

      return selections;
    },
    editedZutatenAdd() {
      if (this.editedItem.zutaten.indexOf(...this.recept) === -1) {
        this.editedItem.zutaten.push(...this.recept);
      }
      return this.editedItem.zutaten;
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    selected() {
      this.search = "";
    }
  },
  created() {
    db.collection("Inventory").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          this.items.push({
            ...change.doc.data(),
            id: change.doc.id
          });
        }
      });
    });
    db.collection("BeerSorts").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          this.beers.push({
            ...change.doc.data(),
            id: change.doc.id
          });
        } else if (change.type === "removed") {
          let index = this.beers
            .map(x => {
              return x.id;
            })
            .indexOf(change.doc.id);
          this.beers.splice(index, 1);
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
