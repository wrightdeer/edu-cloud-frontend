<template>
  <el-card class="space-card" @click.native="handClick">
    <div class="card-header">
        <span class="card-title">{{space.name}}</span>
        <el-tag :type="publicTagType" class="public-tag">{{publicTag}}</el-tag>
    </div>
    <div class="card-content">
        <span>科目：{{space.subjectName}}</span>
        <span>创建者：<el-link @click.stop="handCreatorClick">{{space.createUserName}}</el-link></span>
        <div class="tags-container">
            <el-tag
                v-for="tag in space.tags"
                :key="tag"
                :type="getTagsType(tag)"
                size="small"
                >{{getTagsName(tag)}}
            </el-tag>
        </div>
    </div>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  methods: {
    getTagsName (tag) {
      return this.tagDictionary.find((tagItem) => tagItem.code === tag).name
    },
    getTagsType (tag) {
      const types = ['primary', 'success', 'warning', 'danger', 'info']
      return types[tag % types.length]
    },
    handClick () {
      this.$router.push({
        name: 'Space',
        params: {
          spaceId: this.space.id
        }
      })
    },
    handCreatorClick () {
      if (parseInt(this.space.createUser) === parseInt(this.userInfo.id)) {
        if (this.$router.currentRoute.name === 'Profile') return
        this.$router.push({
          name: 'Profile'
        })
      } else {
        this.$emit('handCreatorClick', this.space.createUser, this.space.createUserName)
      }
    }
  },
  computed: {
    ...mapState(['tagDictionary', 'userInfo']),
    publicTag () {
      return this.space.isPublic === 1 ? '公开' : '私有'
    },
    publicTagType () {
      return this.space.isPublic === 1 ? 'success' : 'danger'
    }
  }

}
</script>

<style scoped>
.space-card {
    width: 46vh;
    padding: 10px;
    margin: 10px;
    cursor: pointer;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.2em;
  font-weight: bold;
}

.card-content {
  margin-top: 10px;
  color: #999;
}

.card-content span {
  display: block;
  margin-bottom: 5px;
}
.tags-container {
  display: flex;
  gap: 5px;
}
</style>
