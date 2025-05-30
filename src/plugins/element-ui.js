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
  Dialog,
  Select,
  Option,
  Upload,
  Radio,
  RadioGroup,
  RadioButton,
  Tag,
  Card,
  Tooltip,
  Loading,
  Pagination,
  Collapse,
  CollapseItem,
  Divider,
  Empty,
  Link,
  Switch,
  Table,
  TableColumn,
  Tree
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
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)
Vue.component(Upload.name, Upload)
Vue.component(Radio.name, Radio)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(RadioButton.name, RadioButton)
Vue.component(Tag.name, Tag)
Vue.component(Card.name, Card)
Vue.component(Tooltip.name, Tooltip)
Vue.component(Pagination.name, Pagination)
Vue.component(Collapse.name, Collapse)
Vue.component(CollapseItem.name, CollapseItem)
Vue.component(Divider.name, Divider)
Vue.component(Empty.name, Empty)
Vue.component(Link.name, Link)
Vue.component(Switch.name, Switch)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Tree.name, Tree)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$loading = Loading.service
