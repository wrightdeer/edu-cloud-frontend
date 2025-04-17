<template>
  <el-container>
    <el-aside>
      <h1>筛选条件</h1>

      <div class="search-bar">
        <span class="bar-title">名字：</span>
        <el-input
          v-model="name"
          placeholder="请输入名字"
          @change="handleSearch"
        ></el-input>
      </div>
      <div class="subject-bar">
        <span class="bar-title">科目:</span>
        <el-radio-group
          v-model="subject"
          @change="handleSearch"
          class="filter-bar-radio"
        >
          <el-radio
            v-for="subject in subjects"
            :key="subject"
            :label="subject"
            >{{ subject }}</el-radio
          >
        </el-radio-group>
      </div>
      <div class="tag-bar">
        <span class="bar-title">标签</span>
        <div class="tag-container">
          <el-tag
            v-for="tag in displayedTags"
            :key="tag.code"
            :type="tag.type"
            closable
            @close="removeTag(tag.code)"
            >{{ tag.name }}</el-tag
          >
        </div>
        <div class="tag-footer">
          <el-select
            v-model="selectedTagCode"
            placeholder="选择标签"
            size="mini"
            style="width: 100px; height: 30px"
          >
            <el-option
              v-for="tag in availableTagsOptions"
              :key="tag.code"
              :label="tag.name"
              :value="tag.code"
            ></el-option>
          </el-select>
          <el-button
            @click="addTag"
            size="mini"
            style="width: 50px; height: 30px"
            >添加</el-button
          >
        </div>
      </div>
      <div class="search-submit">
        <el-button type="primary" @click="updateTagsInUrl">
          <i class="el-icon-search"></i>
          搜索</el-button
        >
      </div>
    </el-aside>
    <el-main>
      <el-empty description="这里空空如也"></el-empty>

      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        layout="total,sizes, prev, pager, next"
      ></el-pagination>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      name: this.$route.query.name || '',
      creator: this.$route.query.creator || '',
      subject: this.$route.query.subject || '',
      displayedTagsCodes: this.$route.query.tags
        ? this.$route.query.tags.split(',').map((code) => parseInt(code))
        : [],
      selectedTagCode: '',
      subjects: ['数学', '语文', '英语'], // 假数据
      tagDictionary: [
        { code: 0, name: 'Markdown' },
        { code: 1, name: 'CSV' },
        { code: 2, name: 'C' },
        { code: 3, name: 'C++' },
        { code: 4, name: 'C/C++' },
        { code: 5, name: 'Python' },
        { code: 6, name: 'Java' },
        { code: 7, name: 'SQL' },
        { code: 8, name: 'Shell' },
        { code: 9, name: 'PHP' },
        { code: 10, name: 'JavaScript' },
        { code: 11, name: 'JSON' },
        { code: 12, name: 'XML' },
        { code: 13, name: 'HTML' },
        { code: 14, name: 'CSS' }
      ],
      page: parseInt(this.$route.query.page) || 1,
      pageSize: parseInt(this.$route.query.pageSize) || 10,
      total: 100 // 假数据
    }
  },
  computed: {
    displayedTags () {
      const types = ['primary', 'success', 'warning', 'danger', 'info']
      return this.displayedTagsCodes.map((code, index) => {
        const tag = this.tagDictionary.find((tag) => tag.code === code)
        return {
          ...tag,
          type: types[index % types.length]
        }
      })
    },
    availableTagsCodes () {
      const allCodes = Array.from({ length: 15 }, (_, i) => i)
      return allCodes.filter((code) => !this.displayedTagsCodes.includes(code))
    },
    availableTagsOptions () {
      return this.availableTagsCodes.map((code) =>
        this.tagDictionary.find((tag) => tag.code === code)
      )
    }
  },
  created () {},
  mounted () {
    document.title = '学习资料'
  },
  methods: {
    handleSearch () {
      this.updateRoute()
    },
    removeCreator () {
      this.creator = ''
      this.updateRoute()
    },
    removeTag (tagCode) {
      this.displayedTagsCodes = this.displayedTagsCodes.filter(
        (code) => code !== tagCode
      )
      this.selectedTagCode = ''
    },
    addTag () {
      if (this.selectedTagCode !== '') {
        this.displayedTagsCodes.push(parseInt(this.selectedTagCode))
        this.selectedTagCode = ''
      }
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      this.updateRoute()
    },
    handlePageChange (newPage) {
      this.page = newPage
      this.updateRoute()
    },
    updateRoute () {
      const currentQuery = this.$route.query
      const newQuery = {
        page: this.page,
        pageSize: this.pageSize,
        name: this.name,
        subject: this.subject,
        creator: this.creator,
        tags: this.displayedTagsCodes.join(',')
      }

      // 将 currentQuery 和 newQuery 的所有值转换为字符串
      const stringifyQuery = (query) => {
        const stringifiedQuery = {}
        for (const key in query) {
          stringifiedQuery[key] = String(query[key])
        }
        return stringifiedQuery
      }

      const isSameQuery =
        JSON.stringify(stringifyQuery(currentQuery)) ===
        JSON.stringify(stringifyQuery(newQuery))

      if (!isSameQuery) {
        this.$router.push({ query: newQuery })
      }
    },
    updateTagsInUrl () {
      this.updateRoute()
    }
  }
}
</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-aside {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: flex-start;
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  padding: 30px;
  gap: 20px;
}
.bar-title {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}
.search-bar {
  display: flex;
  justify-items: center;
}
.subject-bar {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
}
.tag-bar {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.filter-bar-radio {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: start;
  align-items: flex-start;
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.tag-container {
  width: 100%;
  min-height: 40px;
  padding: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.tag-footer {
  display: flex;
  justify-content: space-between;
}
</style>
