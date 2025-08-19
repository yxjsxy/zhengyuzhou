<template>
  <div class="container">
    <div class="activity">
        <div class="activity-item" v-for="(item, index) in activityList" :key="index">
            <img :src="item.image" width="300px" alt="">
            <div class="info">
                <span>{{item.title}}</span>
                <span>{{ item.start_time }} - {{ item.end_time }}</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import {
    activity
} from "@/api/api.js"
export default {
    data() {
        return {
            activityList: []
        }
    },
    created() {
        this.getActivity()
    },
    methods: {
        getActivity() {
            activity().then(res => {
                console.log(res)
                this.activityList = res.data;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .container {
        .activity {
            width: 90%;
            margin: 30px auto;
            @include flex(row);
            justify-content: space-between;
            flex-wrap: wrap;
            .info{
                @include flex(column);
            }
         }
    }
</style>