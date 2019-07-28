<template>
  <div id="app">
    <h1>Boost - Improving Journalistic Research with ML</h1>
    <div class="container">
      <div class="sidenav">
        Your Documents
        <ul v-for="object in objects">
          <li>{{ object.properties.Name.value }}, <a href="#" @click="select(object)">{{ object.properties['enaio:objectId'].value }}</a></li>
        </ul>
        <li v-if="fileUploaded">{{ file.name }}</li>
      </div>
      <div>
        <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
        <div class="topnav">
          <h2 @click="selected = 'upload'" :class="{active: uploadSelected}">Upload Document</h2>
          <h2 @click="selected = 'search'" :class="{active: searchSelected}">Search Documents</h2>
        </div>
        <div v-if="selected == 'upload'">
          <!-- <button>Choose File</button> -->
          <input type="file" @change="uploadFile">
          <br>
          <div v-if="fileUploaded">
            <h2>{{ file.name }}</h2>
            <h2>{{ file.size }} kb</h2>
            <h2>{{ file.type }}</h2>
            <input type="date" placeholder="date" :value="date">
            <input type="text" placeholder="author">
            <div v-for="(term, idx) in terms">
              <input type="text" placeholder="search query terms" :value="term.value">
              <button @click="removeSearchTerm(idx)">-</button>
            </div>
            <button @click="addSearchTerm">+</button>
            <br>
            <button>Upload Document</button>
          </div>
        </div>
        <div v-if="selected == 'search'">
          <h3 v-if="!selectedDocument">Select a document to analyze from the left side</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'

export default {
  name: 'app',
  data() {
    return {
      fileUploaded: false,
      file: null,
      date: 0,
      terms: [{value: 'foo'}, {value: 'bar'}, {}],
      objects: [],
      selected: 'upload',
      selectedDocument: null,
    }
  },
  components: {},
  computed: {
    uploadSelected() {
      return this.selected === 'upload'
    },
    searchSelected() {
      return this.selected === 'search'
    }
  },
  methods: {
    getFiles() {
      axios.get('http://localhost:3000/files').then(res => {
        const a = res.data.objects
        res.data.objects.map(object => {
          object.link = `/${object.properties['enaio:objectId'].value}`
        })
        this.objects = a
      })
    },
    select(object) {
      this.selectedDocument = object
    },
    uploadFile() {
      const file = document.querySelector('input[type=file]').files[0];
      const reader  = new FileReader();
      // reader.addEventListener("load", function () {
      // preview.src = reader.result;
      // }, false);
      if (file) {
        reader.readAsDataURL(file);
        console.log('file', file)
        const d = new Date(file.lastModified)
        this.date = d.toISOString().split('T')[0]
        console.log('this.date', this.date)
        this.file = file
      }
      setTimeout(() => {
        this.fileUploaded = true
      }, 400)
    },
    addSearchTerm() {
      this.terms.push({})
    },
    removeSearchTerm(idx) {
      const copy = this.terms.slice(0)
      copy.splice(idx, 1)
      this.terms = copy
    }
  },
  mounted() {
    this.getFiles()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
.sidenav {
  width: 250px;
}
.topnav {
  display: flex;
  color: grey;
}
.topnav h2 {
  cursor: pointer;
}

.topnav h2:first-of-type {
  margin-right: 30px;
}
.topnav h2.active {
  color: black;
}
.container {
  display: flex;
}
</style>
