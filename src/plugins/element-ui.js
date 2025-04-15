import Vue from 'vue'
import {
  Header,
  Main,
  Menu,
  MenuItem,
  Icon,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Container,
  Aside,
  Breadcrumb,
  BreadcrumbItem,
  Message
} from 'element-ui'

Vue.component(Header.name, Header)
Vue.component(Main.name, Main)
Vue.component(Menu.name, Menu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(Icon.name, Icon)
Vue.component(Dropdown.name, Dropdown)
Vue.component(DropdownMenu.name, DropdownMenu)
Vue.component(DropdownItem.name, DropdownItem)
Vue.component(Avatar.name, Avatar)
Vue.component(Container.name, Container)
Vue.component(Aside.name, Aside)
Vue.component(Breadcrumb.name, Breadcrumb)
Vue.component(BreadcrumbItem.name, BreadcrumbItem)
Vue.prototype.$message = Message
