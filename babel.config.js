module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset' // 保留 Vue CLI 默认配置
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ]
}
