<template>
  <q-page class="bg-dark flex flex-center">
    <div v-for="showdata in showdataall" :key="showdata.showname">
      <q-card class="my-card q-ma-md" style="min-width: 300px; max-width: 300px;">
        <q-img
          :src="showdata.showimage"
          spinner-color="white"
          :ratio="1">
          <div v-show="showdata.tickets === 0" class="absolute-bottom text-subtitle1 text-center">
            ตั๋วหมด
          </div>
          <div v-show="showdata.check === true" class="absolute-bottom text-subtitle1 text-center">
            หมดรอบแสดง
          </div>
        </q-img>

        <q-card-section style="min-height: 125px; max-height: 125px;">
          <b class="text-h6">{{showdata.showname}}</b>
          
          <div class="text-subtitle2 q-mt-sm">{{showdata.showdate}} น.</div>
          <div class="text-subtitle2 q-mt-sm text-grey-6">
            <q-icon name="location_on" />
            {{showdata.place}}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle2 q-mt-sm q-mb-sm">ราคา {{showdata.price}}</div>
          <q-btn
            class="glossy"
            :disabled="showdata.tickets === 0 || showdata.check === true" rounded color="negative"
            :label="showdata.tickets === 0 || showdata.check === true ? 'ไม่สามารถซื้อตั๋วได้แล้ว' : 'ซื้อตั๋ว'"
            style="min-width: 100%; max-width: 100%"
            @click="dailogbuyticket = true"
          />
        </q-card-section>
      </q-card>
      <q-dialog v-model="dailogbuyticket">
        <q-card style="min-width: 100%;">
          <Steper_buy :showdata="showdata" @dailogbuyticketsend="GetData($event)" />
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import axios from 'axios'
import Steper_buy from '../components/Steperbuy.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    Steper_buy
  },
  created () {
    this.loadShowinfo()
  },
  data () {
    return {
      showdataall: [],
      today: new Date(),
      checkdatepast: false,
      dailogbuyticket: false,
    }
  },
  methods: {
    GetData (data) {
      this.dailogbuyticket = data;
    },
    loadShowinfo () {
      axios.get('http://localhost:3000/showData').then(response => {
        for (let index = 0; index < response.data.length; index++) {
          // funtion check past date
          const dateFirst = response.data[index].showdate.split(" ");
          const ansfirstDate = dateFirst[0].split("/")
          const showDate = new Date(`${ansfirstDate[2] - 543}-${ansfirstDate[1]}-${ansfirstDate[0]}`)
          if (showDate.setHours(0, 0, 0, 0) < this.today.setHours(0, 0, 0, 0)) {
            this.checkdatepast = true
          } else {
            this.checkdatepast = false
          }

          this.showdataall.push({
            showname: `${response.data[index].showname}`,
            showimage: `${response.data[index].showimage}`,
            price: response.data[index].price,
            tickets: response.data[index].tickets,
            showdate: `${response.data[index].showdate}`,
            place: `${response.data[index].place}`,
            datestamp: `${response.data[index].datestamp}`,
            check: this.checkdatepast
          })
        }
      }).catch(error => {
        console.log(error.response)
        this.$q.notify({
          icon: 'done',
          color: 'red',
          message: error.response.data.Message
        })
      }).finally(() => {
      })
    },
  }
})
</script>
