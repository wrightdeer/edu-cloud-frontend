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
  Message,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Input,
  Button,
  MessageBox,
  Dialog
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
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Tabs.name, Tabs)
Vue.component(TabPane.name, TabPane)
Vue.component(Input.name, Input)
Vue.component(Button.name, Button)
Vue.component(Dialog.name, Dialog)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
