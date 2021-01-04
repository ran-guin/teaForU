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
            v-container.padded
              h3 Uploads
              v-file-input(v-model='inputFile' type='file' id='uploadFile')
              v-btn.btn-primary(@click='readFile()') Upload File
              hr
              v-data-table(v-if='uploaded' :items='csvData' :headers='headers' show-select v-model='selected' item-key='name')
              v-container
                v-btn.btn-primary(v-if='uploaded' @click='addToDB()') Upload {{selected.length}} records to DB

              //- h5 {{headers}}
              h6(v-if='uploaded')
                pre Uploaded: {{uploaded}}
                hr
                v-row
                  v-col
                    h3 Data:
                    pre {{csvData}}
                  v-col
                    h3 Headers:
                    pre {{headers}}
          v-tab-item(value="action-Add" style='background-color: tan;')
            h3 Action = Add
              v-card
                v-card-title.header
                  h3 New Tea
                v-card-text
                  v-text-field(v-model='form.name' label='Name')
                  v-select(v-model='form.category' :items='categories' label='Category')
                  v-text-field(v-model='form.cost_100g' label='Cost (100g)')
                  v-select(v-model='form.code' label='Code')
                  v-text-field(v-model='form.shelf' label='Location (shelf)')
                  v-row.justify-space-around
                    v-btn(@click='add()') Test Add

          v-tab-item(value="action-Edit" style='background-color: tan;')
            h3 Action = Edit
          v-tab-item(value="action-Search" style='background-color: tan;')
            h3 Action = Search
 
        v-container(v-for='tea, i in Teas' :key='i')
          v-card(max-width='500px')
            v-card-title {{tea.name}}
            v-card-text
              b {{tea.category}}
              b Cost (100g): {{tea.cost_100g}}
              b Code: {{tea.code}}
              b Location: {{tea.shelf}}
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
        await this.addTea(form)
        this.Teas.push(form)
      },
      async get () {
        const Teas = await this.getTea()
        this.Teas = Teas
      },
      readFile () {
        const input = this.inputFile
        if (input) {
          var file = input
          let reader = new FileReader();
          reader.readAsText(file);
          
          var _this = this
          reader.onload = function() {
            _this.uploaded = reader.result
            _this.parseData(reader.result, '\t')
          };

          reader.onerror = function() {
            console.debug(reader.error);
          };
        } else {
          console.debug('no file uploaded...')
        }
      },
      parseData (data, delimiter) {
        var minLength = 4 // all data must have at least 4 fields
        var csvData = [];
        this.csvData = []
        if (!delimiter) { delimiter = ','}
        const lbreak = data.split(/\s*\n/);
        console.debug(lbreak.length + ' records found')
        lbreak.forEach(res => {
          var arr = res.split(delimiter)
          console.log('Record: ' + JSON.stringify(arr))
          if (this.headers && this.headers.length && arr.length >= minLength) {
            var Obj = {}
            for (var i = 0; i < this.headers.length; i++) {
              var saveAs = this.saveAs(this.headers[i].text)
              Obj[saveAs] = arr[i] || '?'
              if (this.headers[i] && this.headers[i].text === 'Name') {
                if (arr[i].match(/FOP/)) {
                  Obj.grade = 'FOP'
                } else if (arr[i].match(/BOP/)) {
                  Obj.grade = 'BOP'
                } else if (arr[i].match(/OP/)) {
                  Obj.grade = 'BOP'
                } else if (arr[i].match(/CF/)) {
                  Obj['caffeine_free'] = true
                }
              } else if (this.headers[i] && this.headers[i].text === 'Type') {
                if (arr[i].match(/AB/)) {
                  Obj.aged_black = true
                }
                if (arr[i].match(/O/)) {
                  Obj.organic = true
                }
                if (arr[i].match(/CF/)) {
                  Obj.caffeine_free = true
                }
                else if (arr[i].match(/F/)) {
                  Obj.flavoured = true
                }
              } else if (this.headers[i] && this.headers[i].text === 'Code') {
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
              } else if (this.headers[i] && this.headers[i].text === 'Price') {
                if (arr[i].match(/\/50g/)) {
                  delete Obj.cost_100g
                  Obj.cost_50g = arr[i].replace('/50g', '')
                }
              }
            }
            Obj.description = Obj.description || Obj.name
            console.debug('* Object *: ' + JSON.stringify(Obj))
            this.csvData.push(Obj)           
          } else if (arr && arr.length && !this.headers.length) {
            this.headers = arr.map(a => { return { text: a, value: this.saveAs(a)} })
          } else {
            console.debug('insufficient data: ' + JSON.stringify(arr))
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
          this.addTea(a)
        })
      }
    }
  }
</script>