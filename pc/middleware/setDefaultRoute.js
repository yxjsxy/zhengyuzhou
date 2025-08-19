export default function ({ route, redirect }) {
  if (route.path === "/") {
    redirect("/home/home"); // 将用户重定向到默认路由的路径
  }
}
