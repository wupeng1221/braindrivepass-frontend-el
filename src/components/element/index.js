import {
    Container,
    Menu,
    MenuItem,
    Aside,
    Header,
    Main,
    Footer,
    Col,
    Row,
    Form,
    Input,
    FormItem,
    Button,
    Alert,
    Submenu,
    Link,
    Rate,
    Radio,
    RadioGroup,
    Breadcrumb,
    BreadcrumbItem,
    Drawer,
    Table,
    TableColumn,
    Loading,
    MessageBox,
    Message,
    Notification,
} from "element-ui";

const components = [
    Container,
    Menu,
    MenuItem,
    Aside,
    Header,
    Main,
    Footer,
    Col,
    Row,
    Form,
    Input,
    FormItem,
    Button,
    Alert,
    Submenu,
    Link,
    Rate,
    Radio,
    RadioGroup,
    Footer,
    Breadcrumb,
    BreadcrumbItem,
    Drawer,
    Table,
    TableColumn

];

export default {
    install(Vue) {
        components.map(c => {
            Vue.component(c.name, c)
        });
        Vue.use(Loading.directive);

        Vue.prototype.$loading = Loading.service;
        Vue.prototype.$msgbox = MessageBox;
        Vue.prototype.$alert = MessageBox.alert;
        Vue.prototype.$confirm = MessageBox.confirm;
        Vue.prototype.$prompt = MessageBox.prompt;
        Vue.prototype.$notify = Notification;
        Vue.prototype.$message = Message;
    }
}