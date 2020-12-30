<template lang='pug'>
  v-card.coloured()
    v-card-title.cardHeader
      h2 Admin
    v-card-text
      v-container.padded
        v-tabs(v-model='action')
          v-tab(v-for='action,i in actions' :key='i' :href='"#action-" + action') {{action}}
        v-tabs-items(v-model='action')
          v-tab-item(value="action-Upload" style='background-color: tan;')
            h3 Upload
            v-file-input(v-model='inputFile' type='file' id='uploadFile')
            v-btn.btn-primary(@click='readFile()') Upload
            hr
            v-data-table(v-if='uploaded' :items='csvData' :headers='headers' show-select v-model='selected' item-key='name')
            v-btn.btn-primary(v-if='uploaded' @click='addToDB()') Upload

            //- h5 {{headers}}
            h6(v-if='uploaded') Uploaded {{uploaded.constructor}}
              pre {{uploaded}}
              hr
              pre {{csvData}}
          v-tab-item(value="action-Add" style='background-color: tan;')
            h3 Action = Add
          v-tab-item(value="action-Edit" style='background-color: tan;')
            h3 Action = Edit
          v-tab-item(value="action-Search" style='background-color: tan;')
            h3 Action = Search
        v-card
          v-card-title.header
            h3 New Tea
          v-card-text
            v-text-field(v-model='form.name' label='Name')
            v-select(v-model='form.category' :items='categories' label='Category')
            v-text-field(v-model='form.cost_100g' label='Cost (100g)')
        v-row.justify-space-around
          v-btn(@click='add()') Test Add
          v-btn(@click='get()') Test Query
        
        v-container(v-for='tea, i in Teas' :key='i')
          v-card(max-width='500px')
            v-card-title {{tea.name}}
            v-card-text
              b {{tea.category}}
              b Cost (100g): {{tea.cost_100g}}
</template>



<script>
  import Shared from '@/mixins/Shared'
  export default {
    data () {
      return {
        actions: ['Upload', 'Add', 'Edit', 'Search'],
        action: 'Add',
        uploaded: null,
        csvData: [],
        headers: [],
        selected: [],
        inputFile: null,
        Teas: [],
        form: {},
        categories: ['Black', 'Green', 'Oolong', 'Herbal'],
        categories2: [
          {text: 'Black', value: 'Black'},
          {text: 'Green', value: 'Green'},
          {text: 'Herbal / Tisanes', value: 'Tisanes'}
        ]
      }
    },
    mixins: [
      Shared
    ],
    async created () {
    },
    methods: {
      async add (form) {
        console.log('call addTea')
        var added = await this.addTea(form)
        this.Teas.push(form)
        console.log('added ' + added)
      },
      async get () {
        console.log('call getTea')
        const Teas = await this.getTea()
        console.log('got: ' + JSON.stringify(Teas))
        this.Teas = Teas
      },
      readFile () {
        const input = this.inputFile
        console.log(input)
        if (input) {
          var file = input
          let reader = new FileReader();
          reader.readAsText(file);
          
          var _this = this
          reader.onload = function() {
            _this.uploaded = reader.result
            console.log(reader.result)
            _this.parseData(reader.result, '\t')
          };

          reader.onerror = function() {
            console.log(reader.error);
          };
        } else {
          console.log('no files...')
        }
      },
      parseData (data, delimiter) {
          var csvData = [];
          this.csvData = []
          if (!delimiter) { delimiter = ','}
          const lbreak = data.split("\n");
          console.log(lbreak.length + ' records..')
          lbreak.forEach(res => {
            var arr = res.split(delimiter)
            if (this.headers && this.headers.length) {
              console.log('add object..')
              var Obj = {}
              for (var i = 0; i < this.headers.length; i++) {
                var saveAs = this.saveAs(this.headers[i].text)
                console.log('save as ' + saveAs)
                Obj[saveAs] = arr[i]
                console.log(this.headers[i].text + ' = ' + arr[i])
                if (!i) {
                  if (arr[i].match(/FOP/)) {
                    Obj.grade = 'FOP'
                  } else if (arr[i].match(/BOP/)) {
                    Obj.grade = 'BOP'
                  } else if (arr[i].match(/OP/)) {
                    Obj.grade = 'BOP'
                  } else if (arr[i].match(/CF/)) {
                    Obj['caffeine_free'] = true
                  }
                } else if (i === 2) {
                  if (arr[i].match(/^B/)) {
                    Obj.category = 'Black'
                  } else if (arr[i].match(/^G/)) {
                    Obj.category = 'Green'
                  } else if (arr[i].match(/^S/)) {
                    Obj.category = 'Sencha'
                  } else if (arr[i].match(/^W/)) {
                    Obj.category = 'White'
                  } else if (arr[i].match(/^R/)) {
                    Obj.category = 'Rooibos'
                  } else if (arr[i].match(/^O/)) {
                    Obj.category = 'Oolong'
                  } else if (arr[i].match(/^T/)) {
                    Obj.category = 'Tisane'
                  } else if (arr[i].match(/^Y/)) {
                    Obj.category = 'Yerba'
                  }
                } else if (i === 3) {
                  if (arr[i].match(/\/50g/)) {
                    delete Obj.cost_100g
                    Obj.cost_50g = arr[i].replace('/50g', '')
                  }
                }
              } 
              this.csvData.push(Obj)           
            } else {
              console.log('init headers')
              this.headers = arr.map(a => { return { text: a, value: this.saveAs(a)} })
              console.log(this.headers)
            }
            csvData.push(res.split(delimiter));
          });
          console.table(csvData);          
      },
      saveAs (header) {
        const mapHeaders = {
          Price: 'cost_100g',
          Location: 'shelf'
        }
        return mapHeaders[header] || header.toLowerCase()
      },
      addToDB () {
        this.selected.map( a => {
          this.add(a)
          console.log('add ' + JSON.stringify(a))
        })
      }
    }
  }
</script>