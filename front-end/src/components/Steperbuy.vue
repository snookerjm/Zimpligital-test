<template>
  <q-stepper
    v-model="step"
    vertical
    ref="stepper"
    color="primary"
    animated
  >
    <q-step
      :name="1"
      title="Buy tickets"
      icon="storefront"
      :done="done1"
    >
      <b class="text-h6">ซื้อตั๋วการแสดง{{ showdata.showname }}</b>
      <div class="text-subtitle2 q-mt-sm">เหลือตั๋วการแสดง {{showdata.tickets}}</div>
      <q-input
        v-model.number="ticketnum"
        type="number"
        dense
        filled
        style="max-width: 200px"
      />
      <q-stepper-navigation>
        <q-btn :disabled="ticketnum <= 0 || showdata.tickets - ticketnum < 0" @click="() => { done1 = true; step = 2 }" color="primary" label="Continue" />
                  
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="2"
      title="Payment"
      caption="Debit/Credit card"
      icon="payment"
      :done="done2"
    >
      <div v-for="paymentdata in paymentAll" :key="paymentdata.paymentnum" class="bg-grey-1">
        <q-checkbox dense v-model="paymentdata.check" color="red" @update:model-value="checkcarddone(paymentdata.check)" />
        <q-img
          src="https://www.pngplay.com/wp-content/uploads/12/Mastercard-Transparent-Clip-Art-PNG.png"
          spinner-color="white"
          style="min-height: 50px; max-height: 50px; min-width: 150px; max-width: 150px;"/>
        <div class="text-subtitle2 q-ml-xl">{{paymentdata.paymentnum}}</div>
        <div class="text-subtitle1 q-ml-xl text-grey-6">{{paymentdata.name}} | exp. {{paymentdata.exp}}</div>
        <q-btn size="sm" flat color="primary" label="Edit" class="q-ml-xl" /> | <q-btn size="sm" flat color="primary" label="Delete" />
        <div class="text-subtitle2 q-ml-xl q-mt-sm">Security Code</div>
        <div class="text-grey-6 q-ml-xl q-ml-sm">3-digits on back of card</div>
        <q-input
          v-model="cardnum"
          dense
          filled
          class="q-ml-xl"
          style="max-width: 150px"
          :rules="[(val) => val.length === 3 || 'กรุณาใส่รหัส 3 หลัก']"
          type="password">
          <template v-slot:append>
            <q-icon v-if="cardnum !== paymentdata.securitycode" color="negative" name="dangerous" />
            <q-icon v-else color="positive" name="check_circle" />
          </template>
        </q-input>
      </div>

      <div>
        <q-btn flat @click="dailogaddcard = true">
          <q-icon color="primary" name="add" />
          <q-icon color="primary" name="payment" />
          <div class="q-ml-xs">Add new card</div>
        </q-btn>
        <q-dialog v-model="dailogaddcard">
          <q-card style="min-width: 85%;" class="q-pa-sm">
            <b class="text-h6">เพิ่มบัตร</b>
            <q-input
              v-model="cardnumadd"
              dense
              filled
              style="min-width: 100%;"
              label="เลขบัตร"
              stack-label
              class="q-mt-sm"
              :rules="[(val) => val.length === 16 || 'กรุณาใส่เลขบัตร 16 หลัก']"
            />
            <q-input
              v-model="cardexpadd"
              dense
              filled
              style="min-width: 100%;"
              label="วันหมดอายุ"
              placeholder="05/20"
              stack-label
              class="q-mt-xs"
            />
            <q-input
              v-model="cardsecuritycodeadd"
              dense
              filled
              style="min-width: 100%;"
              label="รหัสหลังบัตร"
              stack-label
              class="q-mt-sm"
              :rules="[(val) => val.length === 3 || 'กรุณาใส่รหัส 3 หลัก']"
            />
            <q-input
              v-model="cardnameadd"
              dense
              filled
              style="min-width: 100%;"
              label="ชื่อบนบัตร"
              stack-label
              class="q-mt-xs"
            />
            <q-btn :disabled="!cardnameadd || !cardsecuritycodeadd || !cardexpadd || !cardnumadd" rounded @click="dailogaddcard = false" color="primary" label="บันทึก" class="q-mt-sm" style="min-width: 100%;" />
          </q-card>
        </q-dialog>
      </div>

      <q-stepper-navigation>
        <q-btn :disabled="checkcard === false || !cardnum" @click="() => { done2 = true; step = 3 }" color="primary" label="Continue" />
        <q-btn flat @click="step = 1, done2 = false" color="primary" label="Back" class="q-ml-sm" />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="3"
      title="Balance summary"
      icon="account_balance_wallet"
      :done="done3"
    >
     <div class="q-pa-sm">
      <div class="row flex justify-between">
        <div class="text-h6">Total</div>
        <div class="text-h6">{{ (((showdata.price * ticketnum) * 7) / 100) + (showdata.price * ticketnum) }}</div>
      </div>
      
      <div class="text-h6 q-mt-sm">Tickets</div>
      <div class="row flex justify-between">
        <div class="q-ml-sm">Resale Tickets: {{showdata.price}} x {{ ticketnum }}</div>
        <div>{{ showdata.price * ticketnum }}</div>
      </div>
      <div class="row flex justify-between">
        <div class="q-ml-sm">VAT 7%</div>
        <div>{{ ((showdata.price * ticketnum) * 7) / 100 }}</div>
      </div>

      <div class="text-subtitle2 q-mt-md">*All Sale Final - No Refunds</div>
      <div class="row flex">
        <q-checkbox dense v-model="checkTerms" color="red" />
        <div class="q-ml-xs">I have read and agree to the current</div>
        <div class="q-ml-xs text-blue">Terms of Use</div>
        <div>.</div>
      </div>
     </div>

      <q-stepper-navigation>
        <div class="text-grey-6">*Exception may apply, see our Terms of Use.</div>
        <q-btn :disabled="checkTerms === false" @click="() => { done3 = true; step = 4 }" color="primary" label="Place Order" />
        <q-btn flat @click="step = 2, done3 = false" color="primary" label="Back" class="q-ml-sm" />
      </q-stepper-navigation>
    </q-step>
    <q-step
      :name="4"
      title="Ticket"
      icon="confirmation_number"
      :done="done4"
    >
      <div class="text-h6">ทำรายการเรียบร้อย</div>
      <div class="text-grey-7">*กรุณาบันทึกหน้าจอไว้เพื่อเป็นหลักฐานในการเข้าชม</div>
      <div>
        <q-card class="my-card" style="min-width: 250px; max-width: 250px;">
          <q-img
            :src="showdata.showimage"
            spinner-color="white"
            :ratio="1"/>

          <q-card-section style="min-height: 125px; max-height: 125px;">
            <div class="row flex justify-between">
              <div class="col">
                <!-- Make a database, record the purchase of tickets and then get the ID. but not now -->
                <div class="q-ml-xs text-grey-5">ID: 1254789512</div>
                <b class="text-h6">{{showdata.showname}}</b>
              </div>
              
              <div style="min-width: 50px; max-width: 50px;">
                <!-- Make QR-code follow ID. but not now -->
                <q-img
                  src="../assets/qr-code-id.png"
                  spinner-color="white"
                  :ratio="1"/>
              </div>
            </div>
            
            <div class="text-subtitle2 q-mt-sm">{{showdata.showdate}} น.</div>
            <div class="text-subtitle2 q-mt-sm text-primary">
              <q-icon name="location_on" />
              {{showdata.place}}
            </div>
          </q-card-section>
          <q-card-section >
            <div class="text-subtitle2 q-mt-lg">จำนวน {{ticketnum}} ที่นั่ง</div>
          </q-card-section>
        </q-card>
      </div>

      <q-stepper-navigation>
        <q-btn color="primary" @click="done4 = true, submitData()" label="Finish" />
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>

<script>
import { defineComponent } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'Steper_buy',
  props: ['showdata'],
  created () {
    this.loadPaymentinfo()
  },
  data () {
    return {
      step: 1,
      done1: false,
      done2: false,
      done3: false,
      done4: false,
      ticketnum: 0,
      paymentAll: [],
      cardnum: '',
      dailogaddcard: false,
      cardnumadd: '',
      cardsecuritycodeadd: '',
      cardexpadd: '',
      cardnameadd: '',
      checkcard: false,
      checkTerms: false,
      dailogbuyticket: true,
    }
  },
  methods: {
    loadPaymentinfo () {
      axios.get('http://localhost:3000/payment').then(response => {
        this.paymentAll = response.data
      }).catch(error => {
        console.log(error.response)
        this.$q.notify({
          icon: 'done',
          color: 'red',
          message: error.response.data.Message
        })
      }).finally(() => {
        for (let index = 0; index < this.paymentAll.length; index++) {
          if (this.paymentAll[index].check === true) {
            this.checkcard = this.paymentAll[index].check
          }
        }
      })
    },
    checkcarddone (val) {
      this.checkcard = val
    },
    submitData () {
      this.$emit("dailogbuyticketsend", this.dailogbuyticket = false);
    },
  }
})
</script>
